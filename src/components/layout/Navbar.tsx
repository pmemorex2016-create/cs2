/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { LogIn, LogOut, MessageSquare, User as UserIcon, Search, Menu, Bell, X, Shield } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { cn } from '@/src/lib/utils';
import { useAuth } from '@/src/lib/AuthContext';
import { signInWithGoogle, logout } from '@/src/lib/firebase';
import { ForumService } from '@/src/lib/ForumService';
import { Notification } from '@/src/types';
import { ThemeToggle } from '../ThemeToggle';

export function Navbar() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [showNotifications, setShowNotifications] = useState(false);

  useEffect(() => {
    if (user) {
      const unsubscribe = ForumService.getNotifications(user.uid, (data) => {
        setNotifications(data);
      });
      return () => unsubscribe();
    }
  }, [user]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      // Basic simulation: scroll to search results or just navigate
      console.log('Searching CS2 database for:', searchQuery);
    }
  };

  const unreadCount = notifications.filter(n => !n.isRead).length;
  const isAdmin = user?.email === 'ogcshop2020@gmail.com';

  return (
    <nav className="sticky top-0 z-50 w-full border-b border-border-strong bg-surface-raised/95 backdrop-blur-md h-20 flex items-center shrink-0">
      <div className="mx-auto flex h-full w-full max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        <div className="flex items-center gap-10">
          <Link to="/" className="flex items-center gap-3 group">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-brand font-black text-surface-base text-xl italic underline decoration-2 transition-transform group-hover:scale-105 shadow-lg shadow-brand/20">
              TS
            </div>
            <span className="text-2xl font-black tracking-tighter uppercase text-white">CS2.RS</span>
          </Link>

          <div className="hidden lg:flex items-center gap-6 text-sm font-semibold uppercase tracking-widest text-gray-400">
            <Link to="/" className="text-brand hover:italic transition-all">Lobby</Link>
            <Link to="/members" className="hover:text-white transition-colors">Igrači</Link>
            <Link to="/activity" className="hover:text-white transition-colors">Aktivnost</Link>
            {isAdmin && (
              <Link to="/admin" className="text-orange-500 hover:text-orange-400 flex items-center gap-2">
                <Shield className="h-4 w-4" />
                Admin
              </Link>
            )}
          </div>
        </div>

        <div className="flex items-center gap-4 sm:gap-6">
          <ThemeToggle />
          <form onSubmit={handleSearch} className="relative hidden md:block">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-500" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="PRETRAŽI BAZE..."
              className="h-10 w-48 rounded-sm border border-border-strong bg-surface-base pl-10 pr-4 text-[10px] font-black uppercase tracking-widest text-white focus:border-brand focus:outline-none transition-colors placeholder:text-gray-700"
            />
          </form>

          {user && (
            <div className="relative">
              <button 
                onClick={() => setShowNotifications(!showNotifications)}
                className="relative p-2 text-gray-400 hover:text-white transition-colors"
              >
                <Bell className="h-6 w-6" />
                {unreadCount > 0 && (
                  <span className="absolute top-1 right-1 flex h-4 w-4 items-center justify-center rounded-sm bg-brand text-[9px] font-black text-surface-base animate-pulse">
                    {unreadCount}
                  </span>
                )}
              </button>

              <AnimatePresence>
                {showNotifications && (
                  <motion.div 
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 10 }}
                    className="absolute right-0 mt-4 w-80 rounded-sm border border-border-strong bg-surface-raised shadow-2xl overflow-hidden z-[100]"
                  >
                    <div className="px-5 py-4 border-b border-border-strong bg-surface-hover flex items-center justify-between">
                      <span className="text-[10px] font-black uppercase tracking-widest text-white italic">Radio Communications</span>
                      <button onClick={() => setShowNotifications(false)}>
                        <X className="h-4 w-4 text-gray-500 hover:text-white" />
                      </button>
                    </div>
                    <div className="max-h-96 overflow-y-auto">
                      {notifications.length > 0 ? (
                        notifications.map(n => (
                          <div 
                            key={n.id} 
                            onClick={() => {
                              ForumService.markNotificationRead(user.uid, n.id);
                              setShowNotifications(false);
                              navigate(n.link);
                            }}
                            className={cn(
                              "px-5 py-4 cursor-pointer hover:bg-surface-hover border-b border-border-subtle transition-colors",
                              !n.isRead && "border-l-2 border-l-brand bg-brand/5"
                            )}
                          >
                            <div className="text-xs font-black text-white mb-1 uppercase italic tracking-tighter">{n.title}</div>
                            <div className="text-[10px] text-gray-500 line-clamp-2 font-medium">{n.message}</div>
                          </div>
                        ))
                      ) : (
                        <div className="p-8 text-center text-[10px] font-black text-gray-600 uppercase tracking-widest italic">
                          Tišina na frekvenciji
                        </div>
                      )}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          )}

          {user ? (
            <div className="flex items-center gap-3">
              <Link to="/profile" className="flex h-10 w-10 items-center justify-center overflow-hidden rounded-sm border border-border-strong hover:border-brand transition-colors bg-surface-base">
                {user.photoURL ? (
                  <img src={user.photoURL} alt={user.displayName || ''} className="h-full w-full object-cover" />
                ) : (
                  <UserIcon className="h-5 w-5 text-gray-400" />
                )}
              </Link>
              <button 
                onClick={() => logout()}
                className="hidden sm:flex items-center gap-2 px-5 py-2.5 text-[10px] font-black uppercase tracking-widest border border-border-strong hover:border-white transition-colors text-gray-500 hover:text-white"
              >
                <LogOut className="h-3 w-3" />
                <span>Disconnect</span>
              </button>
            </div>
          ) : (
            <button 
              onClick={() => signInWithGoogle()}
              className="px-6 py-2.5 text-[10px] font-black uppercase tracking-[0.2em] bg-brand text-surface-base hover:opacity-90 transition-all active:scale-95 shadow-lg shadow-brand/20 active:translate-y-px"
            >
              Sign In
            </button>
          )}

          <button className="lg:hidden p-2 text-gray-500">
            <Menu className="h-6 w-6" />
          </button>
        </div>
      </div>
    </nav>
  );
}
