/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useParams, Link, useNavigate } from 'react-router-dom';
import { MessageSquare, Plus, Filter, ArrowLeft, Pin, Lock, X, Send } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { useEffect, useState } from 'react';
import { ForumService } from '@/src/lib/ForumService';
import { Topic } from '@/src/types';
import { useAuth } from '@/src/lib/AuthContext';
import { signInWithGoogle } from '@/src/lib/firebase';

export default function Category() {
  const { categoryId } = useParams();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [topics, setTopics] = useState<Topic[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newTopicTitle, setNewTopicTitle] = useState('');
  const [newTopicContent, setNewTopicContent] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (categoryId) {
      const unsubscribe = ForumService.getTopics(categoryId, setTopics);
      return unsubscribe;
    }
  }, [categoryId]);

  const handleCreateTopic = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user || !categoryId || !newTopicTitle.trim() || !newTopicContent.trim() || isSubmitting) return;

    setIsSubmitting(true);
    try {
      const topicId = await ForumService.createTopic(
        categoryId,
        user.uid,
        user.displayName || 'Anonimni korisnik',
        newTopicTitle,
        newTopicContent
      );
      if (topicId) {
        setIsModalOpen(false);
        setNewTopicTitle('');
        setNewTopicContent('');
        navigate(`/category/${categoryId}/topic/${topicId}`);
      }
    } catch (error) {
      console.error('Failed to create topic:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between border-b border-border-strong pb-6">
        <div className="flex items-center gap-6">
          <Link
            to="/"
            className="flex h-12 w-12 items-center justify-center rounded-sm bg-surface-raised border border-border-strong text-gray-500 hover:text-brand hover:border-brand transition-all shadow-sm"
          >
            <ArrowLeft className="h-6 w-6" />
          </Link>
          <div>
            <div className="flex items-center gap-2 mb-1">
              <div className="h-1 w-8 bg-brand"></div>
              <span className="text-[10px] font-black uppercase tracking-widest text-brand">Kategorija</span>
            </div>
            <h1 className="text-3xl font-black tracking-tighter text-white capitalize italic uppercase">
              {categoryId?.replace(/-/g, ' ')}
            </h1>
          </div>
        </div>
        <button 
          onClick={() => setIsModalOpen(true)}
          className="flex items-center justify-center gap-2 bg-brand px-8 py-3 text-xs font-black uppercase tracking-widest text-surface-base hover:opacity-90 transition-all active:scale-95 shadow-lg shadow-brand/10"
        >
          <Plus className="h-5 w-5" />
          Nova tema
        </button>
      </div>

      <div className="flex items-center justify-between bg-surface-raised p-2 border border-border-subtle rounded-sm">
        <div className="flex gap-1">
          <button className="bg-brand px-5 py-2 text-[10px] font-black text-surface-base uppercase tracking-widest">
            Sve Teme
          </button>
          <button className="px-5 py-2 text-[10px] font-black text-gray-500 hover:text-white uppercase tracking-widest transition-colors">
             Najpopularnije
          </button>
        </div>
        <button className="p-2 text-gray-600 hover:text-brand transition-colors">
          <Filter className="h-5 w-5" />
        </button>
      </div>

      <div className="space-y-1 bg-border-strong p-px">
        {topics.length > 0 ? (
          topics.map((topic) => (
            <motion.div
              key={topic.id}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="group bg-surface-raised p-6 hover:bg-surface-hover transition-colors"
            >
              <div className="flex items-center justify-between gap-8">
                <div className="flex flex-1 gap-6 items-center">
                  <div className="w-12 h-12 shrink-0 border border-border-strong bg-surface-base flex items-center justify-center text-xs font-black text-gray-500 group-hover:border-brand transition-colors uppercase">
                    {topic.authorName.charAt(0).toUpperCase()}
                  </div>
                  <div>
                    <div className="flex items-center gap-3">
                      {topic.isPinned && <Pin className="h-4 w-4 text-brand fill-brand" />}
                      {topic.isLocked && <Lock className="h-4 w-4 text-gray-500" />}
                      <Link to={`/category/${categoryId}/topic/${topic.id}`} className="text-xl font-bold text-white hover:text-brand transition-colors italic group-hover:underline decoration-brand underline-offset-4">
                        {topic.title}
                      </Link>
                    </div>
                    <div className="mt-2 flex items-center gap-3 text-[10px] font-black uppercase tracking-[0.2em] text-gray-500">
                      <span className="text-gray-300">{topic.authorName}</span>
                      <span>//</span>
                      <span className="italic">{new Date(topic.updatedAt).toLocaleDateString('sr-RS')}</span>
                    </div>
                  </div>
                </div>

                <div className="hidden sm:flex items-center gap-12 min-w-[150px] justify-end">
                  <div className="text-center">
                    <div className="text-lg font-mono font-bold text-white leading-tight">{topic.replyCount}</div>
                    <div className="text-[9px] font-black text-gray-600 uppercase tracking-widest">Odgovora</div>
                  </div>
                  <div className="text-center">
                    <div className="text-lg font-mono font-bold text-white leading-tight">{topic.viewCount}</div>
                    <div className="text-[9px] font-black text-gray-600 uppercase tracking-widest">Pregleda</div>
                  </div>
                </div>
              </div>
            </motion.div>
          ))
        ) : (
          <div className="bg-surface-raised p-20 text-center border border-border-subtle">
            <MessageSquare className="mx-auto h-16 w-16 text-gray-800 mb-6" />
            <p className="text-white text-xl font-black uppercase tracking-tighter italic">Nema dostupnih diskusija</p>
            <p className="text-gray-500 text-sm mt-2 font-medium">Budi prvi i otvori novu temu u ovoj kategoriji.</p>
          </div>
        )}
      </div>

      <AnimatePresence>
        {isModalOpen && (
          <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsModalOpen(false)}
              className="absolute inset-0 bg-surface-base/80 backdrop-blur-sm"
            />
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 20 }}
              className="relative w-full max-w-2xl overflow-hidden rounded-sm bg-surface-raised border border-border-strong shadow-2xl"
            >
              <div className="flex items-center justify-between border-b border-border-strong px-8 py-6 bg-surface-hover">
                <div>
                  <h2 className="text-xl font-black text-white uppercase italic tracking-tighter">Započni novu temu</h2>
                  <div className="h-1 w-12 bg-brand mt-1"></div>
                </div>
                <button
                  onClick={() => setIsModalOpen(false)}
                  className="p-2 text-gray-500 hover:text-white transition-colors border border-transparent hover:border-border-strong"
                >
                  <X className="h-6 w-6" />
                </button>
              </div>

              {!user ? (
                <div className="p-16 text-center">
                  <p className="text-gray-400 font-medium mb-8 italic">Prijavi se da bi učestvovao u NRG zajednici.</p>
                  <button 
                    onClick={() => signInWithGoogle()}
                    className="bg-brand px-10 py-4 font-black uppercase tracking-widest text-surface-base shadow-lg shadow-brand/20 active:scale-95 transition-all"
                  >
                    Prijavi se
                  </button>
                </div>
              ) : (
                <form onSubmit={handleCreateTopic} className="p-10 space-y-8">
                  <div className="space-y-3">
                    <label className="text-[10px] font-black uppercase tracking-[0.3em] text-gray-500 italic block">Naslov Teme</label>
                    <input
                      required
                      type="text"
                      value={newTopicTitle}
                      onChange={(e) => setNewTopicTitle(e.target.value)}
                      placeholder="npr. Moja transformacija..."
                      className="w-full bg-surface-base border border-border-strong px-6 py-4 text-white focus:border-brand focus:outline-none transition-all font-bold placeholder:text-gray-700"
                    />
                  </div>
                  <div className="space-y-3">
                    <label className="text-[10px] font-black uppercase tracking-[0.3em] text-gray-500 italic block">Sadržaj (Markdown podržan)</label>
                    <textarea
                      required
                      value={newTopicContent}
                      onChange={(e) => setNewTopicContent(e.target.value)}
                      placeholder="Vaš tekst ovde..."
                      className="min-h-[200px] w-full resize-none bg-surface-base border border-border-strong px-6 py-4 text-white focus:border-brand focus:outline-none transition-all font-medium placeholder:text-gray-700"
                    />
                  </div>
                  <div className="flex items-center justify-between pt-4 border-t border-border-strong">
                    <p className="text-[9px] font-black text-gray-600 uppercase tracking-widest">NRG Community guidelines Apply</p>
                    <button
                      disabled={isSubmitting}
                      className="flex items-center gap-3 bg-brand px-10 py-4 font-black uppercase tracking-widest text-surface-base shadow-lg shadow-brand/20 active:scale-95 disabled:opacity-50 transition-all"
                    >
                      {isSubmitting ? 'Objavljivanje...' : (
                        <>
                          <Send className="h-4 w-4" />
                          OBJAVI TEMU
                        </>
                      )}
                    </button>
                  </div>
                </form>
              )}
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
