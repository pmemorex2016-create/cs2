/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Users, Layout, Shield, Search, MoreVertical, Edit3, Trash2, CheckCircle, XCircle, Plus, X, Save } from 'lucide-react';
import { useAuth } from '@/src/lib/AuthContext';
import { ForumService } from '@/src/lib/ForumService';
import { cn } from '@/src/lib/utils';
import { useNavigate } from 'react-router-dom';

export default function Admin() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<'users' | 'categories'>('users');
  const [users, setUsers] = useState<any[]>([]);
  const [categories, setCategories] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  
  // Modal states
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [catFormData, setCatFormData] = useState({
    title: '',
    description: '',
    order: 0
  });

  // Critical check for admin
  const isAdmin = user?.email === 'ogcshop2020@gmail.com';

  useEffect(() => {
    if (user && !isAdmin) {
      navigate('/');
      return;
    }

    if (isAdmin) {
      const unsubUsers = ForumService.getAllUsers(setUsers);
      const unsubCats = ForumService.getAllCategories(setCategories);
      setLoading(false);

      return () => {
        unsubUsers();
        unsubCats();
      };
    }
  }, [user, isAdmin, navigate]);

  const handleCreateCategory = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isAdmin) return;

    setIsSaving(true);
    try {
      const categoryId = catFormData.title.toLowerCase().replace(/\s+/g, '-');
      await ForumService.upsertCategory(categoryId, catFormData);
      setIsModalOpen(false);
      setCatFormData({ title: '', description: '', order: 0 });
    } catch (error) {
      console.error('Failed to create category:', error);
    } finally {
      setIsSaving(false);
    }
  };

  if (!isAdmin) {
    return null;
  }

  const filteredUsers = users.filter(u => 
    u.username?.toLowerCase().includes(searchQuery.toLowerCase()) || 
    u.email?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="space-y-8">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 border-b border-border-strong pb-8">
        <div>
          <div className="flex items-center gap-3 mb-2">
            <Shield className="h-4 w-4 text-brand" />
            <span className="text-[10px] font-black uppercase tracking-[0.3em] text-brand italic">Command & Control</span>
          </div>
          <h1 className="text-4xl font-black tracking-tighter text-white uppercase italic">
            Admin <span className="text-brand underline decoration-4 underline-offset-8">Panel</span>
          </h1>
        </div>

        <div className="flex bg-surface-raised border border-border-strong p-1 rounded-sm">
          <button
            onClick={() => setActiveTab('users')}
            className={cn(
              "px-6 py-2.5 text-[10px] font-black uppercase tracking-widest transition-all flex items-center gap-2",
              activeTab === 'users' ? "bg-brand text-surface-base" : "text-gray-500 hover:text-white"
            )}
          >
            <Users className="h-3.5 w-3.5" />
            Operativci
          </button>
          <button
            onClick={() => setActiveTab('categories')}
            className={cn(
              "px-6 py-2.5 text-[10px] font-black uppercase tracking-widest transition-all flex items-center gap-2",
              activeTab === 'categories' ? "bg-brand text-surface-base" : "text-gray-500 hover:text-white"
            )}
          >
            <Layout className="h-3.5 w-3.5" />
            Sektori
          </button>
        </div>
      </div>

      <div className="relative">
        <AnimatePresence mode="wait">
          {activeTab === 'users' ? (
            <motion.div
              key="users"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="space-y-6"
            >
              <div className="relative max-w-md">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-600" />
                <input
                  type="text"
                  placeholder="Pretraži bazu korisnika..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full bg-surface-base border border-border-strong pl-10 pr-4 py-3 text-white text-sm focus:border-brand focus:outline-none transition-all placeholder:text-gray-700 font-bold"
                />
              </div>

              <div className="bg-surface-raised border border-border-strong rounded-sm overflow-hidden">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="bg-surface-hover border-b border-border-strong text-[10px] font-black uppercase tracking-widest text-gray-500">
                      <th className="px-6 py-4 italic">Korisnik</th>
                      <th className="px-6 py-4 italic">Uloga</th>
                      <th className="px-6 py-4 italic">Status</th>
                      <th className="px-6 py-4 italic text-right">Akcije</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredUsers.map((u) => (
                      <tr key={u.id} className="border-b border-border-subtle hover:bg-white/[0.02] transition-colors">
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-3">
                            <div className="h-10 w-10 shrink-0 border border-border-strong bg-surface-base rounded-sm overflow-hidden">
                              {u.avatarUrl ? (
                                <img src={u.avatarUrl} alt="" className="h-full w-full object-cover" />
                              ) : (
                                <div className="h-full w-full flex items-center justify-center bg-surface-hover text-gray-700">
                                  <Users className="h-5 w-5" />
                                </div>
                              )}
                            </div>
                            <div>
                              <div className="text-sm font-black text-white italic uppercase tracking-tight">{u.username}</div>
                              <div className="text-[10px] font-bold text-gray-600 font-mono">{u.email}</div>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <span className={cn(
                            "px-2 py-0.5 text-[9px] font-black uppercase rounded-sm inline-flex items-center gap-1",
                            u.role === 'admin' ? "bg-brand/20 text-brand border border-brand/50" : "bg-gray-800 text-gray-400"
                          )}>
                            {u.role === 'admin' && <Shield className="h-2.5 w-2.5" />}
                            {u.role || 'user'}
                          </span>
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-1.5">
                            <div className="h-1.5 w-1.5 rounded-full bg-green-500 animate-pulse" />
                            <span className="text-[10px] font-black uppercase text-gray-500">Online</span>
                          </div>
                        </td>
                        <td className="px-6 py-4 text-right">
                          <button className="p-2 text-gray-600 hover:text-white transition-colors">
                            <MoreVertical className="h-4 w-4" />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </motion.div>
          ) : (
            <motion.div
              key="categories"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="space-y-6"
            >
              <div className="flex justify-end">
                <button 
                  onClick={() => setIsModalOpen(true)}
                  className="bg-brand px-6 py-3 text-surface-base font-black uppercase text-[10px] tracking-widest hover:opacity-90 active:scale-95 transition-all flex items-center gap-2"
                >
                  <Plus className="h-4 w-4" />
                  Novi Sektor
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {categories.map((cat) => (
                  <div key={cat.id} className="bg-surface-raised border border-border-strong p-6 rounded-sm group relative overflow-hidden">
                    <div className="absolute top-0 right-0 h-20 w-20 bg-brand/5 rotate-45 translate-x-10 -translate-y-10 group-hover:scale-150 transition-transform" />
                    <div className="flex items-start justify-between relative z-10">
                      <div>
                        <div className="text-[10px] font-black text-brand mb-1 uppercase tracking-widest">
                          Sektor #{cat.order || 0}
                        </div>
                        <h3 className="text-xl font-black text-white italic uppercase tracking-tighter mb-2">{cat.title}</h3>
                        <p className="text-gray-500 text-xs font-bold leading-relaxed">{cat.description}</p>
                      </div>
                      <div className="flex gap-2">
                        <button className="p-2 bg-surface-base border border-border-strong text-gray-500 hover:text-white hover:border-brand transition-all">
                          <Edit3 className="h-4 w-4" />
                        </button>
                        <button className="p-2 bg-surface-base border border-border-strong text-gray-500 hover:text-red-500 hover:border-red-500 transition-all">
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Create Category Modal */}
              <AnimatePresence>
                {isModalOpen && (
                  <div className="fixed inset-0 z-[100] flex items-center justify-center px-4">
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      onClick={() => setIsModalOpen(false)}
                      className="absolute inset-0 bg-black/80 backdrop-blur-sm"
                    />
                    <motion.div
                      initial={{ opacity: 0, scale: 0.9, y: 20 }}
                      animate={{ opacity: 1, scale: 1, y: 0 }}
                      exit={{ opacity: 0, scale: 0.9, y: 20 }}
                      className="relative w-full max-w-lg bg-surface-raised border border-border-strong rounded-sm overflow-hidden shadow-2xl"
                    >
                      <div className="flex items-center justify-between px-8 py-6 border-b border-border-strong bg-surface-hover/50">
                        <div>
                          <p className="text-[10px] font-black uppercase tracking-widest text-brand mb-1">New Deployment</p>
                          <h2 className="text-2xl font-black text-white italic uppercase tracking-tighter">Dodaj Sektor</h2>
                        </div>
                        <button 
                          onClick={() => setIsModalOpen(false)}
                          className="p-2 text-gray-500 hover:text-white transition-colors"
                        >
                          <X className="h-6 w-6" />
                        </button>
                      </div>

                      <form onSubmit={handleCreateCategory} className="p-8 space-y-6">
                        <div className="space-y-4">
                          <div className="space-y-2">
                            <label className="text-[10px] font-black uppercase tracking-widest text-gray-500 italic">Naziv Sektora</label>
                            <input
                              type="text"
                              required
                              value={catFormData.title}
                              onChange={(e) => setCatFormData({ ...catFormData, title: e.target.value })}
                              placeholder="npr. Generalne Diskusije"
                              className="w-full bg-surface-base border border-border-strong px-4 py-3 text-white focus:border-brand focus:outline-none transition-all font-bold text-sm"
                            />
                          </div>

                          <div className="space-y-2">
                            <label className="text-[10px] font-black uppercase tracking-widest text-gray-500 italic">Opis (Short Intel)</label>
                            <textarea
                              required
                              value={catFormData.description}
                              onChange={(e) => setCatFormData({ ...catFormData, description: e.target.value })}
                              placeholder="Kratak opis o čemu se radi u ovom sektoru..."
                              rows={3}
                              className="w-full bg-surface-base border border-border-strong px-4 py-3 text-white focus:border-brand focus:outline-none transition-all font-medium italic text-sm resize-none"
                            />
                          </div>

                          <div className="space-y-2">
                            <label className="text-[10px] font-black uppercase tracking-widest text-gray-500 italic">Prioritet (Order)</label>
                            <input
                              type="number"
                              value={catFormData.order}
                              onChange={(e) => setCatFormData({ ...catFormData, order: parseInt(e.target.value) || 0 })}
                              className="w-full bg-surface-base border border-border-strong px-4 py-3 text-white focus:border-brand focus:outline-none transition-all font-mono font-bold text-sm"
                            />
                          </div>
                        </div>

                        <button
                          disabled={isSaving}
                          className="w-full bg-brand py-4 text-surface-base font-black uppercase text-xs tracking-[0.2em] hover:opacity-90 active:scale-[0.98] transition-all disabled:opacity-50 flex items-center justify-center gap-2 shadow-lg shadow-brand/20"
                        >
                          <Save className="h-4 w-4" />
                          {isSaving ? 'Deployment u toku...' : 'POTVRDI DEPLOYMENT'}
                        </button>
                      </form>
                    </motion.div>
                  </div>
                )}
              </AnimatePresence>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
