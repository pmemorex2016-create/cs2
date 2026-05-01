/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { ReactNode } from 'react';
import { Navbar } from './Navbar';
import { motion, AnimatePresence } from 'motion/react';
import { useLocation } from 'react-router-dom';

interface ShellProps {
  children: ReactNode;
}

export function Shell({ children }: ShellProps) {
  const location = useLocation();

  return (
    <div className="min-h-screen bg-surface-base font-sans text-gray-200 flex flex-col">
      <Navbar />
      <div className="flex-1 flex flex-col lg:flex-row mx-auto w-full max-w-7xl min-h-0">
        <main className="flex-1 p-4 sm:p-6 lg:p-8 overflow-y-auto">
          <AnimatePresence mode="wait">
            <motion.div
              key={location.pathname}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.2 }}
            >
              {children}
            </motion.div>
          </AnimatePresence>
        </main>

        <aside className="w-full lg:w-80 border-l border-border-strong bg-surface-raised p-8 flex flex-col gap-8 shrink-0">
          <div className="space-y-4">
            <h4 className="text-[10px] font-black uppercase tracking-widest text-brand italic underline">Statistika Foruma</h4>
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-surface-base p-4 border border-border-subtle rounded-sm">
                <div className="text-2xl font-mono text-white font-bold tracking-tight">12,492</div>
                <div className="text-[10px] uppercase text-gray-500 font-black tracking-widest">Članova</div>
              </div>
              <div className="bg-surface-base p-4 border border-border-subtle rounded-sm">
                <div className="text-2xl font-mono text-white font-bold tracking-tight">451</div>
                <div className="text-[10px] uppercase text-gray-500 font-black tracking-widest">Online</div>
              </div>
            </div>
          </div>

          <div className="space-y-4">
            <h4 className="text-[10px] font-black uppercase tracking-widest text-brand italic underline">Aktivna Zajednica</h4>
            <div className="space-y-4">
              {[
                { name: 'KennyS_fan', topic: 'Novi update: Inferno rework?', time: 'Pre 2 min' },
                { name: 'Simple_Jr', topic: 'Tražim tim za Faceit Level 10', time: 'Pre 15 min' },
                { name: 'NikO_aim', topic: 'Procena skina: AK-47 Blue Gem', time: 'Pre 1h' },
              ].map((item, i) => (
                <div key={i} className="flex items-center gap-3 group cursor-pointer">
                  <div className="w-8 h-8 bg-surface-hover text-gray-200 border border-border-strong flex items-center justify-center rounded-sm text-xs font-black group-hover:border-brand transition-colors uppercase">
                    {item.name.substring(0, 2)}
                  </div>
                  <div className="overflow-hidden">
                    <div className="text-sm text-white font-bold truncate group-hover:text-brand transition-colors">{item.topic}</div>
                    <div className="text-[9px] text-gray-500 uppercase font-black tracking-widest italic">{item.time} - {item.name}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="mt-auto">
            <div className="p-5 border border-brand/20 bg-brand/5 rounded-sm text-center">
              <p className="text-[10px] text-brand/70 font-black uppercase tracking-[0.2em] mb-3">Podrži zajednicu</p>
              <button className="w-full py-3 bg-brand text-surface-base font-black uppercase text-[10px] tracking-widest hover:opacity-90 active:scale-95 transition-all">Poslani Premium</button>
            </div>
          </div>
        </aside>
      </div>

      <footer className="h-12 border-t border-border-strong bg-surface-raised px-8 flex items-center justify-between text-[10px] uppercase font-black tracking-widest text-gray-500 shrink-0">
        <div>&copy; {new Date().getFullYear()} CS2.RS BALKAN. Sva prava zadržana.</div>
        <div className="hidden sm:flex gap-6">
          <a href="#" className="hover:text-white transition-colors">Pravilnik</a>
          <a href="#" className="hover:text-white transition-colors">Privatnost</a>
          <a href="#" className="hover:text-white transition-colors">Kontakt</a>
        </div>
      </footer>
    </div>
  );
}
