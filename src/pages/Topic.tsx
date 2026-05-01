/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useParams, Link } from 'react-router-dom';
import { ArrowLeft, MessageCircle, Share2, MoreHorizontal, Smile, Flag, Send } from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import { motion } from 'motion/react';
import { useEffect, useState } from 'react';
import { doc, onSnapshot } from 'firebase/firestore';
import { db } from '@/src/lib/firebase';
import { ForumService } from '@/src/lib/ForumService';
import { Post } from '@/src/types';
import { useAuth } from '@/src/lib/AuthContext';
import { formatDate } from '@/src/lib/utils';
import { signInWithGoogle } from '@/src/lib/firebase';

export default function Topic() {
  const { categoryId, topicId } = useParams();
  const { user } = useAuth();
  const [topic, setTopic] = useState<any>(null);
  const [posts, setPosts] = useState<Post[]>([]);
  const [replyContent, setReplyContent] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showMods, setShowMods] = useState(false);

  // Mock admin for evaluation - real check should be in Firestore/Auth custom claims
  const isAdmin = user?.email === 'ogcshop2020@gmail.com';

  useEffect(() => {
    if (categoryId && topicId) {
      // Get posts
      const unsubscribePosts = ForumService.getPosts(categoryId, topicId, setPosts);
      
      // Get topic details for notifications and status
      const topicRef = doc(db, `categories/${categoryId}/topics`, topicId);
      const unsubscribeTopic = onSnapshot(topicRef, (snap) => {
        if (snap.exists()) {
          setTopic({ id: snap.id, ...snap.data() });
        }
      });

      return () => {
        unsubscribePosts();
        unsubscribeTopic();
      };
    }
  }, [categoryId, topicId]);

  const handleModeration = async (action: 'pin' | 'lock' | 'delete') => {
    if (!categoryId || !topicId || !topic) return;
    try {
      if (action === 'pin') await ForumService.pinTopic(categoryId, topicId, !topic.isPinned);
      if (action === 'lock') await ForumService.lockTopic(categoryId, topicId, !topic.isLocked);
      if (action === 'delete') {
        if (confirm('POTVRDI BRISANJE TAČKE?')) {
          await ForumService.deleteTopic(categoryId, topicId);
        }
      }
    } catch (error) {
      console.error('Moderation failed:', error);
    }
  };

  const handleReply = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user || !categoryId || !topicId || !replyContent.trim() || isSubmitting || !topic) return;

    if (topic.isLocked && !isAdmin) {
      alert('Tema je zaključana.');
      return;
    }

    setIsSubmitting(true);
    try {
      await ForumService.createReply(
        categoryId,
        topicId,
        user.uid,
        user.displayName || 'Anonimni korisnik',
        user.photoURL || undefined,
        replyContent,
        topic.authorId,
        topic.title
      );
      setReplyContent('');
    } catch (error) {
      console.error('Failed to reply:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between border-b border-border-strong pb-6">
        <div className="flex items-center gap-6">
          <Link
            to={`/category/${categoryId}`}
            className="flex h-12 w-12 items-center justify-center rounded-sm bg-surface-raised border border-border-strong text-gray-500 hover:text-brand hover:border-brand transition-all shadow-sm"
          >
            <ArrowLeft className="h-6 w-6" />
          </Link>
          <div className="flex flex-col text-sm">
            <div className="flex items-center gap-2 mb-1">
              <div className="h-1 w-8 bg-brand"></div>
              <Link to={`/category/${categoryId}`} className="text-[10px] font-black uppercase tracking-widest text-brand hover:underline">{categoryId?.replace(/-/g, ' ')}</Link>
            </div>
            <span className="text-white font-black italic text-xl uppercase tracking-tighter">Diskusija #{topicId?.substring(0, 4)}</span>
          </div>
        </div>
        <div className="flex items-center gap-3">
          {isAdmin && (
            <div className="flex items-center gap-2 mr-4 border-r border-border-strong pr-4">
              <button 
                onClick={() => handleModeration('pin')}
                className="px-3 py-1.5 bg-surface-base border border-border-strong text-[10px] font-black uppercase tracking-widest text-brand hover:border-brand transition-colors"
                title="PIN TOPIC"
              >
                PIN
              </button>
              <button 
                onClick={() => handleModeration('lock')}
                className="px-3 py-1.5 bg-surface-base border border-border-strong text-[10px] font-black uppercase tracking-widest text-orange-500 hover:border-orange-500 transition-colors"
                title="LOCK TOPIC"
              >
                LOCK
              </button>
              <button 
                onClick={() => handleModeration('delete')}
                className="px-3 py-1.5 bg-surface-base border border-border-strong text-[10px] font-black uppercase tracking-widest text-red-500 hover:border-red-500 transition-colors"
                title="DELETE TOPIC"
              >
                DEL
              </button>
            </div>
          )}
          <button className="flex items-center gap-2 px-5 py-2.5 text-[10px] font-black uppercase tracking-widest border border-border-strong hover:border-brand transition-colors text-gray-400 hover:text-white">
            <Share2 className="h-4 w-4" />
            Podeli
          </button>
          <button 
            onClick={() => isAdmin && setShowMods(!showMods)}
            className="p-2.5 bg-surface-raised border border-border-strong text-gray-500 hover:text-white"
          >
            <MoreHorizontal className="h-4 w-4" />
          </button>
        </div>
      </div>

      <div className="space-y-2">
        {posts.map((post, index) => (
          <motion.div
            key={post.id}
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: index * 0.05 }}
            className="bg-surface-raised border border-border-subtle rounded-sm overflow-hidden"
          >
            <div className="flex border-b border-border-strong bg-surface-hover/50 px-6 py-4 items-center justify-between">
              <div className="flex items-center gap-4">
                <Link to={`/profile/${post.authorId}`} className="flex h-10 w-10 shrink-0 items-center justify-center overflow-hidden rounded-sm border border-border-strong bg-surface-base text-xs font-black text-white hover:border-brand transition-colors">
                  {post.authorAvatarUrl ? (
                    <img src={post.authorAvatarUrl} alt={post.authorName} className="h-full w-full object-cover" />
                  ) : (
                    post.authorName.charAt(0).toUpperCase()
                  )}
                </Link>
                <div>
                   <Link to={`/profile/${post.authorId}`} className="text-sm font-black text-white uppercase tracking-tight hover:text-brand transition-colors">{post.authorName}</Link>
                   <div className="flex items-center gap-2 text-[9px] font-black text-gray-500 uppercase tracking-widest italic">
                      {formatDate(post.createdAt)}
                   </div>
                </div>
              </div>
              <div className="flex items-center gap-4">
                <span className="text-[10px] font-mono text-gray-700">#{(index + 1).toString().padStart(2, '0')}</span>
                <button className="text-gray-600 hover:text-brand transition-colors">
                  <Flag className="h-4 w-4" />
                </button>
              </div>
            </div>
            
            <div className="p-8">
              <div className="prose prose-invert prose-orange max-w-none text-gray-300 leading-relaxed font-medium italic">
                <ReactMarkdown>{post.content}</ReactMarkdown>
              </div>
            </div>

            <div className="flex px-6 py-4 bg-surface-hover/30 border-t border-border-subtle justify-between items-center">
              <div className="flex gap-4">
                <button className="flex items-center gap-2 text-[10px] font-black text-gray-500 hover:text-brand uppercase tracking-widest transition-colors">
                  <Smile className="h-4 w-4" />
                  REAGUJ
                </button>
                <button 
                  onClick={() => {
                    setReplyContent(`@${post.authorName} `);
                    window.scrollTo({ top: document.body.scrollHeight, behavior: 'smooth' });
                  }}
                  className="flex items-center gap-2 text-[10px] font-black text-gray-500 hover:text-white hover:italic uppercase tracking-widest transition-colors"
                >
                  <MessageCircle className="h-4 w-4" />
                  ODGOVORI
                </button>
              </div>
              <div className="text-[10px] font-mono text-gray-700 uppercase">
                End of Segment
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      <div className="mt-12 pt-12 border-t border-border-strong">
        {user ? (
          <form onSubmit={handleReply} className="space-y-6">
            <h3 className="text-xs font-black uppercase tracking-[0.3em] text-brand italic">Sastavi Odgovor</h3>
            <div className="bg-surface-raised border border-border-strong rounded-sm p-2 focus-within:border-brand transition-all shadow-2xl">
              <textarea
                value={replyContent}
                onChange={(e) => setReplyContent(e.target.value)}
                placeholder="Unesite vašu poruku..."
                className="w-full min-h-[200px] bg-surface-base p-6 resize-none outline-none text-white font-medium italic placeholder:text-gray-800"
              />
              <div className="mt-2 flex items-center justify-between px-4 pb-4">
                <div className="flex gap-2">
                   <div className="w-1.5 h-1.5 bg-brand"></div>
                   <p className="text-[9px] text-gray-600 font-black uppercase tracking-widest italic">Markdown format podržan</p>
                </div>
                <button 
                  disabled={!replyContent.trim() || isSubmitting}
                  className="flex items-center gap-3 bg-brand px-12 py-4 text-xs font-black uppercase tracking-widest text-surface-base hover:opacity-90 disabled:opacity-30 disabled:cursor-not-allowed transition-all active:scale-95 shadow-xl shadow-brand/10"
                >
                  {isSubmitting ? 'Slanje...' : (
                    <>
                      <Send className="h-4 w-4" />
                      Objavi Poruku
                    </>
                  )}
                </button>
              </div>
            </div>
          </form>
        ) : (
          <div className="bg-surface-raised border-2 border-dashed border-border-strong p-16 text-center rounded-sm">
            <p className="text-white font-black uppercase italic text-xl tracking-tighter mb-8">Ulogujte se za učešće</p>
            <button 
              onClick={() => signInWithGoogle()}
              className="bg-brand px-12 py-4 text-xs font-black uppercase tracking-widest text-surface-base shadow-xl shadow-brand/20 active:scale-95 transition-all"
            >
              Prijavi se putem Googla
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
