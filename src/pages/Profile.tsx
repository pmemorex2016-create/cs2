/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'motion/react';
import { User, Settings, Save, X, ExternalLink, Shield } from 'lucide-react';
import { useAuth } from '@/src/lib/AuthContext';
import { ForumService } from '@/src/lib/ForumService';
import { User as UserType } from '@/src/types';
import { cn } from '@/src/lib/utils';

export default function Profile() {
  const { userId } = useParams();
  const { user: authUser } = useAuth();
  const navigate = useNavigate();
  
  const [profile, setProfile] = useState<any>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  
  const [formData, setFormData] = useState({
    username: '',
    bio: '',
    signature: '',
    avatarUrl: ''
  });

  const isOwnProfile = authUser?.uid === userId || (!userId && authUser);
  const targetId = userId || authUser?.uid;

  useEffect(() => {
    if (!targetId) {
      setLoading(false);
      return;
    }

    const unsubscribe = ForumService.getUserProfile(targetId, (data) => {
      if (data) {
        setProfile(data);
        setFormData({
          username: data.username || '',
          bio: data.bio || '',
          signature: data.signature || '',
          avatarUrl: data.avatarUrl || ''
        });
      } else if (isOwnProfile && authUser) {
        // Initialize profile if it doesn't exist
        const initialData = {
          username: authUser.displayName || 'Igrač',
          email: authUser.email || '',
          avatarUrl: authUser.photoURL || '',
          role: 'user',
          createdAt: Date.now()
        };
        ForumService.updateUserProfile(authUser.uid, initialData);
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, [targetId, isOwnProfile, authUser]);

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!authUser || !isOwnProfile) return;

    setIsSaving(true);
    try {
      await ForumService.updateUserProfile(authUser.uid, formData);
      setIsEditing(false);
    } catch (error) {
      console.error('Failed to update profile:', error);
    } finally {
      setIsSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex min-h-[400px] items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-2 border-brand border-t-transparent" />
      </div>
    );
  }

  if (!profile && !authUser) {
    return (
      <div className="bg-surface-raised p-20 text-center border border-border-subtle">
        <User className="mx-auto h-16 w-16 text-gray-800 mb-6" />
        <p className="text-white text-xl font-black uppercase tracking-tighter italic">Profil nije pronađen</p>
        <button onClick={() => navigate('/')} className="mt-6 text-brand hover:underline font-black uppercase text-xs tracking-widest">Povratak u lobby</button>
      </div>
    );
  }

  const displayUser = profile || {
    username: authUser?.displayName || 'Nepoznat',
    avatarUrl: authUser?.photoURL || '',
    bio: '',
    signature: '',
    role: 'user'
  };

  return (
    <div className="space-y-8 max-w-4xl mx-auto">
      <div className="relative group">
        <div className="absolute -inset-1 bg-gradient-to-r from-brand/20 to-transparent blur opacity-25" />
        <div className="relative bg-surface-raised border border-border-strong overflow-hidden rounded-sm">
          {/* Header/Cover */}
          <div className="h-32 bg-surface-hover border-b border-border-strong relative">
            <div className="absolute inset-0 bg-brand/5 opacity-50" />
          </div>
          
          <div className="px-8 pb-8">
            <div className="relative flex flex-col sm:flex-row items-end gap-6 -mt-12">
              <div className="relative h-32 w-32 shrink-0 border-4 border-surface-raised bg-surface-base rounded-sm overflow-hidden group/avatar shadow-2xl">
                {displayUser.avatarUrl ? (
                  <img src={displayUser.avatarUrl} alt={displayUser.username} className="h-full w-full object-cover" />
                ) : (
                  <div className="h-full w-full flex items-center justify-center bg-surface-hover text-gray-500">
                    <User className="h-16 w-16" />
                  </div>
                )}
                {isOwnProfile && isEditing && (
                  <div className="absolute inset-0 bg-black/60 flex items-center justify-center opacity-0 group-hover/avatar:opacity-100 transition-opacity">
                    <span className="text-[10px] font-black uppercase text-white tracking-widest text-center px-2">Link slike</span>
                  </div>
                )}
              </div>
              
              <div className="flex-1 pb-2 text-center sm:text-left">
                <div className="flex items-center justify-center sm:justify-start gap-3">
                  <h1 className="text-3xl font-black text-white italic uppercase tracking-tighter">
                    {displayUser.username}
                  </h1>
                  {displayUser.role === 'admin' && (
                    <div className="flex items-center gap-1 bg-brand px-2 py-0.5 rounded-sm">
                      <Shield className="h-3 w-3 text-surface-base fill-surface-base" />
                      <span className="text-[9px] font-black text-surface-base uppercase">Admin</span>
                    </div>
                  )}
                </div>
                <p className="text-gray-500 text-[10px] font-black uppercase tracking-widest mt-1">
                  ID: {displayUser.id?.substring(0, 8)} // STATUS: ONLINE
                </p>
              </div>

              {isOwnProfile && (
                <button
                  onClick={() => setIsEditing(!isEditing)}
                  className={cn(
                    "mb-2 flex items-center gap-2 px-5 py-2.5 text-[10px] font-black uppercase tracking-widest transition-all",
                    isEditing 
                      ? "bg-surface-hover text-gray-400 hover:text-white" 
                      : "bg-brand text-surface-base hover:opacity-90 shadow-lg shadow-brand/20"
                  )}
                >
                  {isEditing ? <><X className="h-3 w-3" /> Odustani</> : <><Settings className="h-3 w-3" /> Podešavanja</>}
                </button>
              )}
            </div>

            <div className="mt-12 grid grid-cols-1 lg:grid-cols-3 gap-8">
              <div className="lg:col-span-2 space-y-8">
                {isEditing ? (
                  <form onSubmit={handleUpdate} className="space-y-6">
                    <div className="space-y-4">
                      <div className="space-y-2">
                        <label className="text-[10px] font-black uppercase tracking-widest text-gray-500 italic">Korisničko Ime</label>
                        <input
                          type="text"
                          value={formData.username}
                          onChange={(e) => setFormData({ ...formData, username: e.target.value })}
                          className="w-full bg-surface-base border border-border-strong px-4 py-3 text-white focus:border-brand focus:outline-none transition-all font-bold text-sm"
                        />
                      </div>
                      <div className="space-y-2">
                        <label className="text-[10px] font-black uppercase tracking-widest text-gray-500 italic">Link Avatara (URL)</label>
                        <input
                          type="text"
                          value={formData.avatarUrl}
                          onChange={(e) => setFormData({ ...formData, avatarUrl: e.target.value })}
                          placeholder="https://..."
                          className="w-full bg-surface-base border border-border-strong px-4 py-3 text-white focus:border-brand focus:outline-none transition-all font-mono text-[10px]"
                        />
                      </div>
                      <div className="space-y-2">
                        <label className="text-[10px] font-black uppercase tracking-widest text-gray-500 italic">Biografija / O Meni</label>
                        <textarea
                          value={formData.bio}
                          onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
                          rows={4}
                          className="w-full bg-surface-base border border-border-strong px-4 py-3 text-white focus:border-brand focus:outline-none transition-all font-medium italic text-sm resize-none"
                          placeholder="Unesite vašu gaming istoriju..."
                        />
                      </div>
                      <div className="space-y-2">
                        <label className="text-[10px] font-black uppercase tracking-widest text-gray-500 italic">Potpis (User Signature)</label>
                        <input
                          type="text"
                          value={formData.signature}
                          onChange={(e) => setFormData({ ...formData, signature: e.target.value })}
                          placeholder="Vaš catchphrase..."
                          className="w-full bg-surface-base border border-border-strong px-4 py-3 text-white focus:border-brand focus:outline-none transition-all font-bold italic text-xs"
                        />
                      </div>
                    </div>
                    <button
                      disabled={isSaving}
                      className="w-full bg-brand py-4 text-surface-base font-black uppercase text-xs tracking-widest hover:opacity-90 active:scale-[0.98] transition-all disabled:opacity-50 flex items-center justify-center gap-2"
                    >
                      <Save className="h-4 w-4" />
                      {isSaving ? 'Sačuva se...' : 'SAČUVAJ PROMENE'}
                    </button>
                  </form>
                ) : (
                  <div className="space-y-8">
                    <div>
                      <h4 className="text-[10px] font-black uppercase tracking-widest text-brand italic underline mb-4">Informacije</h4>
                      <div className="bg-surface-base p-6 border border-border-subtle rounded-sm">
                        <p className="text-gray-300 italic whitespace-pre-wrap leading-relaxed">
                          {displayUser.bio || 'Korisnik još uvek nije dodao biografiju.'}
                        </p>
                      </div>
                    </div>

                    <div>
                      <h4 className="text-[10px] font-black uppercase tracking-widest text-gray-500 mb-4">Gaming Signature</h4>
                      <div className="border-l-4 border-brand bg-surface-hover/50 p-4 italic text-sm text-gray-400 font-bold">
                        "{displayUser.signature || 'No signature set.'}"
                      </div>
                    </div>
                  </div>
                )}
              </div>

              <div className="space-y-6">
                <div className="bg-surface-base p-6 border border-border-subtle rounded-sm space-y-4">
                  <h4 className="text-[10px] font-black uppercase tracking-widest text-gray-500 mb-2">CS2 Statistika</h4>
                  <div className="grid grid-cols-1 gap-3">
                    <div className="flex justify-between items-center py-2 border-b border-border-strong">
                      <span className="text-[10px] font-black uppercase text-gray-600">Level</span>
                      <span className="text-white font-mono font-bold italic">Global Elite</span>
                    </div>
                    <div className="flex justify-between items-center py-2 border-b border-border-strong">
                      <span className="text-[10px] font-black uppercase text-gray-600">Faceit</span>
                      <span className="text-white font-mono font-bold italic">Level 10</span>
                    </div>
                    <div className="flex justify-between items-center pt-2">
                       <span className="text-[10px] font-black uppercase text-gray-600">Mape</span>
                       <span className="text-white font-mono font-bold italic">Mirage, Inferno</span>
                    </div>
                  </div>
                </div>

                <div className="bg-brand/5 border border-brand/20 p-6 rounded-sm">
                   <h4 className="text-[10px] font-black uppercase tracking-widest text-brand mb-2">Social</h4>
                   <div className="flex gap-4">
                      <button className="text-gray-500 hover:text-white transition-colors">
                        <ExternalLink className="h-4 w-4" />
                      </button>
                   </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
