/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { MessageSquare, Clock, TrendingUp, Users, Shield, Copy, Headset } from 'lucide-react';
import { motion } from 'motion/react';
import { Category } from '../types';
import { ForumService } from '../lib/ForumService';

const MOCK_CATEGORIES: Category[] = [
  { id: 'obavestenja', title: 'Obavestenja', description: 'Zvanične informacije i novosti vezane za TS3 i CS2 zajednicu.', order: 1 },
  { id: 'donacije', title: 'Donacije', description: 'Informacije o načinima doniranja i pogodnostima za donatore.', order: 2 },
  { id: 'pitanje-staff', title: 'Pitanje za staff', description: 'Treba vam pomoć? Pitajte našu administraciju ovde.', order: 3 },
  { id: 'predlog-ts3', title: 'Predlog za TS3', description: 'Imate ideju kako da poboljšamo TeamSpeak? Pišite nam!', order: 4 },
  { id: 'zahtev-premium', title: 'Zahtev za Premium Member', description: 'Prijavite se za specijalni status na serveru.', order: 5 },
  { id: 'zahtev-stalna-soba', title: 'Zahtev za stalnu sobu', description: 'Zatražite privatnu stalnu sobu za vaše društvo.', order: 6 },
  { id: 'zahtev-klanska-soba', title: 'Zahtev za klansku sobu', description: 'Specijalne sobe rezervisane za aktivne klanove.', order: 7 },
  { id: 'zahtev-audiobot', title: 'Zahtev za AudioBota', description: 'Muzički botovi za uživanje i atmosferu u sobama.', order: 8 },
  { id: 'zahtev-unban', title: 'Zahtev za Unban', description: 'Smatrate da ste nepravedno kažnjeni? Podnesite žalbu ovde.', order: 9 },
];

export default function Home() {
  const [stats, setStats] = useState({ userCount: 0, onlineCount: 0, topicCount: 0, categoryCount: 0 });

  useEffect(() => {
    const unsub = ForumService.getGlobalStats(setStats);
    return () => unsub();
  }, []);

  const handleConnect = () => {
    window.location.href = 'ts3server://ts.cs2.rs';
  };

  const handleBriefing = () => {
    const section = document.getElementById('categories-grid');
    section?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <div className="space-y-10">
      <header className="relative flex flex-col gap-8 md:flex-row md:items-end md:justify-between border-b border-border-strong pb-10 overflow-hidden">
        {/* Background Decorative Image */}
        <div className="absolute inset-0 -z-10 opacity-20 mask-gradient-to-t">
          <img 
            src="https://images.unsplash.com/photo-1542751371-adc38448a05e?auto=format&fit=crop&q=80&w=2000" 
            alt="CS2 background" 
            className="w-full h-full object-cover grayscale"
            referrerPolicy="no-referrer"
          />
        </div>

        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="relative z-10"
        >
          <div className="flex items-center gap-3 mb-4">
            <div className="h-1 w-12 bg-brand rounded-full animate-pulse"></div>
            <span className="text-[10px] font-black uppercase tracking-[0.4em] text-brand">TEAMSPEAK</span>
          </div>
          <h1 className="text-5xl font-black tracking-tighter text-white sm:text-7xl md:text-8xl uppercase italic leading-none">
            TS.<span className="text-brand underline decoration-8 underline-offset-8">CS2</span>.RS
          </h1>
          <p className="mt-6 text-gray-400 font-bold italic text-xl max-w-2xl leading-relaxed uppercase tracking-tight">
            Dobrodošli na TeamSpeak3 server. Vaša baza za komunikaciju, druženje i vrhunski gaming.
          </p>
        </motion.div>
        
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        {/* Main Content Area */}
        <div className="lg:col-span-3 space-y-10">
          <section id="categories-grid" className="space-y-1">
            {MOCK_CATEGORIES.map((category, index) => (
              <motion.div
                key={category.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
              >
                <Link
                  to={`/category/${category.id}`}
                  className="group bg-surface-raised p-6 border border-border-subtle flex flex-col sm:flex-row items-center gap-8 hover:bg-surface-hover transition-all duration-200 rounded-sm"
                >
                  <div className="w-14 h-14 bg-brand/10 text-brand flex items-center justify-center rounded-sm shrink-0 group-hover:bg-brand group-hover:text-surface-base transition-all duration-300">
                    <MessageSquare className="h-7 w-7" />
                  </div>
                  
                  <div className="flex-1 text-center sm:text-left">
                    <h3 className="text-white font-black text-xl uppercase tracking-tight group-hover:text-brand transition-colors">{category.title}</h3>
                    <p className="text-gray-500 text-sm italic font-medium mt-1">
                      {category.description}
                    </p>
                  </div>
                </Link>
              </motion.div>
            ))}
          </section>

          <div className="pt-10 border-t border-border-strong">
            <div className="flex items-center gap-4 mb-6">
               <Clock className="h-5 w-5 text-brand" />
               <h2 className="text-xs font-black uppercase tracking-[0.2em] text-white italic">Poslednje Aktivnosti na mreži</h2>
               <div className="flex-1 h-px bg-border-strong"></div>
            </div>

            <div className="space-y-1 bg-border-strong p-px">
              {[1, 2, 3, 4, 5].map((i) => (
                <div key={i} className="group bg-surface-raised p-5 hover:bg-surface-hover transition-colors">
                  <div className="flex items-center justify-between gap-6">
                    <div className="flex-1 flex gap-4 items-center">
                      <div className="w-10 h-10 border border-border-strong bg-surface-base flex items-center justify-center text-[10px] font-black text-gray-500 group-hover:border-brand transition-colors">
                        {['Xy', 'Zy', 'Ky', 'Ay', 'My'][i % 5]}
                      </div>
                      <div>
                        <Link to="/category/lobby/topic/1" className="text-base font-bold text-white hover:text-brand transition-colors italic">
                          {[
                            "Novi update: Inferno rework?",
                            "Tražim tim za Faceit Level 10",
                            "Procena skina: AK-47 Case Hardened Blue Gem",
                            "Najbolji crosshair za rezoluciju 4:3",
                            "Premier Rank: Kako preći 20k elo?"
                          ][i % 5]}
                        </Link>
                        <div className="mt-1 flex items-center gap-2 text-[10px] font-bold uppercase tracking-widest text-gray-600">
                          <span className="text-brand">{['KennyS_fan', 'Simple_Jr', 'NikO_aim', 'ZywOo_2', 'Monasy'][i % 5]}</span>
                          <span>//</span>
                          <span>Pre {i+1} minuta</span>
                        </div>
                      </div>
                    </div>
                    <div className="hidden sm:flex items-center gap-10 text-[10px] font-black text-gray-600 uppercase tracking-widest">
                      <div className="flex flex-col items-center">
                        <span className="text-white font-mono text-sm leading-tight">12</span>
                        <span>Odg</span>
                      </div>
                      <div className="flex flex-col items-center">
                        <span className="text-white font-mono text-sm leading-tight">1.2k</span>
                        <span>Preg</span>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Sidebar */}
        <aside className="space-y-8">
          {/* TeamSpeak 3 Card */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-surface-raised border border-border-strong p-6 rounded-sm relative overflow-hidden group/ts shadow-2xl"
          >
            <div className="absolute top-0 right-0 p-2 opacity-5 group-hover/ts:opacity-10 transition-opacity">
              <Headset className="h-24 w-24 text-brand -rotate-12" />
            </div>
            
            <div className="relative z-10">
              <div className="flex items-center gap-2 mb-4">
                <div className="h-2 w-2 rounded-full bg-brand animate-ping" />
                <span className="text-[9px] font-black uppercase tracking-[0.3em] text-brand italic">Voice Operations</span>
              </div>
              
              <h3 className="text-2xl font-black text-white italic uppercase tracking-tighter mb-1">TeamSpeak 3</h3>
              <p className="text-gray-500 text-[10px] font-black uppercase tracking-widest mb-6 italic opacity-60">Base of Operations</p>
              
              <div 
                className="bg-surface-base border border-border-strong p-4 flex items-center justify-between group/ip cursor-pointer hover:border-brand transition-all active:scale-[0.98]"
                onClick={() => {
                  navigator.clipboard.writeText('ts.cs2.rs');
                  const banner = document.getElementById('copy-banner');
                  if (banner) {
                    banner.classList.remove('opacity-0');
                    setTimeout(() => banner.classList.add('opacity-0'), 2000);
                  }
                }}
              >
                <div className="flex flex-col">
                  <span className="text-[8px] font-black text-gray-700 uppercase tracking-widest mb-0.5">Server Address</span>
                  <code className="text-brand font-mono font-black text-lg tracking-tight">ts.cs2.rs</code>
                </div>
                <div className="p-2 bg-surface-hover border border-border-strong rounded-sm group-hover/ip:bg-brand group-hover/ip:text-surface-base transition-all">
                  <Copy className="h-4 w-4" />
                </div>
              </div>

              <div id="copy-banner" className="opacity-0 transition-opacity duration-300 absolute left-0 right-0 -bottom-1 h-1 bg-brand" />
              
              <div className="mt-6 flex items-center justify-between">
                <div className="flex flex-col">
                  <span className="text-[8px] font-black text-gray-700 uppercase tracking-widest mb-0.5">Status</span>
                  <span className="text-white text-[10px] font-black uppercase italic tracking-tighter">Combat Ready</span>
                </div>
                <div className="flex flex-col items-end">
                  <span className="text-[8px] font-black text-gray-700 uppercase tracking-widest mb-0.5">Operativci</span>
                  <span className="text-white text-[10px] font-black uppercase italic tracking-tighter">{stats.onlineCount} / 512</span>
                </div>
              </div>

              <button 
                onClick={handleConnect}
                className="w-full mt-6 bg-brand py-3 text-surface-base font-black uppercase text-[10px] tracking-[0.2em] hover:brightness-110 transition-all flex items-center justify-center gap-2"
              >
                Poveži se Odmah
              </button>
            </div>
          </motion.div>

          {/* Discord or Other Socials */}
          <div className="bg-surface-hover/30 border border-border-strong p-6 rounded-sm">
             <h4 className="text-[9px] font-black uppercase tracking-widest text-gray-500 mb-4 italic">Zajednica Sponzori</h4>
             <div className="grid grid-cols-2 gap-3 opacity-30 grayscale contrast-125">
                <div className="aspect-[3/1] bg-surface-base border border-border-strong rounded-sm" />
                <div className="aspect-[3/1] bg-surface-base border border-border-strong rounded-sm" />
             </div>
          </div>
        </aside>
      </div>
    </div>
  );
}
