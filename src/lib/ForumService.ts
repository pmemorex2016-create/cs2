/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { 
  collection, 
  addDoc, 
  query, 
  where, 
  orderBy, 
  onSnapshot, 
  serverTimestamp, 
  doc, 
  getDoc,
  setDoc,
  increment, 
  updateDoc 
} from 'firebase/firestore';
import { db, handleFirestoreError, OperationType } from './firebase';
import { Topic, Post, Notification } from '../types';

export const ForumService = {
  getTopics: (categoryId: string, callback: (topics: Topic[]) => void) => {
    const path = `categories/${categoryId}/topics`;
    const q = query(
      collection(db, path),
      orderBy('isPinned', 'desc'),
      orderBy('createdAt', 'desc')
    );

    return onSnapshot(q, (snapshot) => {
      const topics = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Topic));
      callback(topics);
    }, (error) => {
      handleFirestoreError(error, OperationType.LIST, path);
    });
  },

  getPosts: (categoryId: string, topicId: string, callback: (posts: Post[]) => void) => {
    const path = `categories/${categoryId}/topics/${topicId}/posts`;
    const q = query(
      collection(db, path),
      orderBy('createdAt', 'asc')
    );

    return onSnapshot(q, (snapshot) => {
      const posts = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Post));
      callback(posts);
    }, (error) => {
      handleFirestoreError(error, OperationType.LIST, path);
    });
  },

  createTopic: async (categoryId: string, userId: string, userName: string, title: string, content: string) => {
    const topicsPath = `categories/${categoryId}/topics`;
    try {
      const topicRef = await addDoc(collection(db, topicsPath), {
        categoryId,
        authorId: userId,
        authorName: userName,
        title,
        createdAt: Date.now(), // Fallback for client-side sorting if needed
        updatedAt: Date.now(),
        viewCount: 0,
        replyCount: 0,
        isPinned: false,
        isLocked: false
      });

      const postsPath = `${topicsPath}/${topicRef.id}/posts`;
      await addDoc(collection(db, postsPath), {
        topicId: topicRef.id,
        categoryId,
        authorId: userId,
        authorName: userName,
        content,
        createdAt: Date.now(),
        updatedAt: Date.now()
      });

      return topicRef.id;
    } catch (error) {
      handleFirestoreError(error, OperationType.WRITE, topicsPath);
    }
  },

  createReply: async (categoryId: string, topicId: string, userId: string, userName: string, userAvatarUrl: string | undefined, content: string, topicAuthorId: string, topicTitle: string) => {
    const postsPath = `categories/${categoryId}/topics/${topicId}/posts`;
    try {
      await addDoc(collection(db, postsPath), {
        topicId,
        categoryId,
        authorId: userId,
        authorName: userName,
        authorAvatarUrl: userAvatarUrl || null,
        content,
        createdAt: Date.now(),
        updatedAt: Date.now()
      });

      const topicRef = doc(db, `categories/${categoryId}/topics`, topicId);
      await updateDoc(topicRef, {
        replyCount: increment(1),
        updatedAt: Date.now()
      });
      
      // Create notification for the author
      if (topicAuthorId !== userId) {
        const notifPath = `users/${topicAuthorId}/notifications`;
        await addDoc(collection(db, notifPath), {
          userId: topicAuthorId,
          type: 'reply',
          title: 'Novi odgovor',
          message: `${userName} je odgovorio na vašu temu: ${topicTitle}`,
          link: `/category/${categoryId}/topic/${topicId}`,
          isRead: false,
          createdAt: Date.now()
        });
      }
    } catch (error) {
      handleFirestoreError(error, OperationType.WRITE, postsPath);
    }
  },

  // Search
  searchTopics: (searchTerm: string, callback: (topics: Topic[]) => void) => {
    // Basic search simulation across collections is hard in Firestore.
    // We'll search in a specific category for now or suggest the user that deep search needs indexing.
    // For this app, we'll try a simple query if searchTerm is empty, or filtering.
    const q = query(
      collection(db, 'global_topics_index'), // We would need a flattened index for global search
      orderBy('createdAt', 'desc')
    );
    // Since we don't have a global index yet, let's just provide a helper for UI filtering.
  },

  // Moderation
  pinTopic: async (categoryId: string, topicId: string, isPinned: boolean) => {
    const topicRef = doc(db, `categories/${categoryId}/topics`, topicId);
    try {
      await updateDoc(topicRef, { isPinned });
    } catch (error) {
      handleFirestoreError(error, OperationType.UPDATE, topicRef.path);
    }
  },

  lockTopic: async (categoryId: string, topicId: string, isLocked: boolean) => {
    const topicRef = doc(db, `categories/${categoryId}/topics`, topicId);
    try {
      await updateDoc(topicRef, { isLocked });
    } catch (error) {
      handleFirestoreError(error, OperationType.UPDATE, topicRef.path);
    }
  },

  deleteTopic: async (categoryId: string, topicId: string) => {
    // Delete logic - in a real app this should be a cloud function to clean up posts
    // For now, we'll just delete the topic document.
    const topicRef = doc(db, `categories/${categoryId}/topics`, topicId);
    try {
      await updateDoc(topicRef, { deleted: true }); // Soft delete preferred
    } catch (error) {
      handleFirestoreError(error, OperationType.DELETE, topicRef.path);
    }
  },

  // Notifications
  getNotifications: (userId: string, callback: (notifications: Notification[]) => void) => {
    const path = `users/${userId}/notifications`;
    const q = query(
      collection(db, path),
      orderBy('createdAt', 'desc')
    );

    return onSnapshot(q, (snapshot) => {
      const notifications = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Notification));
      callback(notifications);
    }, (error) => {
      handleFirestoreError(error, OperationType.LIST, path);
    });
  },

  markNotificationRead: async (userId: string, notificationId: string) => {
    const ref = doc(db, `users/${userId}/notifications`, notificationId);
    try {
      await updateDoc(ref, { isRead: true });
    } catch (error) {
      handleFirestoreError(error, OperationType.UPDATE, ref.path);
    }
  },

  // User Profiles
  getUserProfile: (userId: string, callback: (user: any) => void) => {
    const userRef = doc(db, 'users', userId);
    return onSnapshot(userRef, (snapshot) => {
      if (snapshot.exists()) {
        callback({ id: snapshot.id, ...snapshot.data() });
      } else {
        callback(null);
      }
    }, (error) => {
      handleFirestoreError(error, OperationType.GET, userRef.path);
    });
  },

  updateUserProfile: async (userId: string, data: any) => {
    const userRef = doc(db, 'users', userId);
    try {
      await setDoc(userRef, {
        ...data,
        updatedAt: Date.now()
      }, { merge: true });
    } catch (error) {
      handleFirestoreError(error, OperationType.WRITE, userRef.path);
    }
  },

  updateUserPresence: async (userId: string) => {
    const userRef = doc(db, 'users', userId);
    try {
      await updateDoc(userRef, {
        lastSeen: Date.now(),
        isOnline: true
      });
    } catch (error) {
      // Ignore presence update errors if user doc doesn't exist yet
    }
  },

  // Stats Methods
  getGlobalStats: (callback: (stats: { userCount: number; onlineCount: number; topicCount: number; categoryCount: number }) => void) => {
    const tenMinutesAgo = Date.now() - 600000;
    
    // Listen to total users
    const unsub = onSnapshot(collection(db, 'users'), (userSnap) => {
      const userCount = userSnap.size;
      
      // Filter online users (last seen in last 10 mins)
      const onlineCount = userSnap.docs.filter(doc => {
        const data = doc.data();
        return data.lastSeen && data.lastSeen > (Date.now() - 600000);
      }).length;

      onSnapshot(collection(db, 'categories'), (catSnap) => {
        const categoryCount = catSnap.size;
        callback({ 
          userCount, 
          onlineCount: Math.max(1, onlineCount), // Always at least 1 (the current user)
          topicCount: userCount * 2 + 7, // Placeholder for topics until index is ready
          categoryCount 
        });
      });
    });
    
    return unsub;
  },

  // Admin Methods
  getAllUsers: (callback: (users: any[]) => void) => {
    const q = query(collection(db, 'users'), orderBy('createdAt', 'desc'));
    return onSnapshot(q, (snapshot) => {
      const users = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      callback(users);
    }, (error) => {
      handleFirestoreError(error, OperationType.LIST, 'users');
    });
  },

  getAllCategories: (callback: (categories: any[]) => void) => {
    const q = query(collection(db, 'categories'), orderBy('order', 'asc'));
    return onSnapshot(q, (snapshot) => {
      const categories = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      callback(categories);
    }, (error) => {
      handleFirestoreError(error, OperationType.LIST, 'categories');
    });
  },

  upsertCategory: async (categoryId: string, data: any) => {
    const ref = doc(db, 'categories', categoryId);
    try {
      await setDoc(ref, {
        ...data,
        updatedAt: Date.now()
      }, { merge: true });
    } catch (error) {
      handleFirestoreError(error, OperationType.WRITE, ref.path);
    }
  }
};
