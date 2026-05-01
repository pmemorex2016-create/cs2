/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { Link } from 'react-router-dom';
import { MessageSquare, Clock, TrendingUp, Users } from 'lucide-react';
import { motion } from 'motion/react';
import { Category } from '../types';

const MOCK_CATEGORIES: Category[] = [
  { id: 'lobby', title: 'Glavni Lobby', description: 'Mesto za opštu diskusiju, timove i traženje saigrača.', order: 1 },
  { id: 'premier-ranks', title: 'Premier & Ranks', description: 'Diskusije o rankovima, matchmaking-u i strategijama za napredak.', order: 2 },
  { id: 'skins-market', title: 'Skins & Pijaca', description: 'Trejdovi, procene skinova i najnoviji dropovi.', order: 3 },
  { id: 'taktike-granate', title: 'Taktike & Granate', description: 'Lineups, strategije za mape i tutorijali za CS2.', order: 4 },
];

export default function Home() {
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
            <span className="text-[10px] font-black uppercase tracking-[0.4em] text-brand">Tactical Operations Center</span>
          </div>
          <h1 className="text-5xl font-black tracking-tighter text-white sm:text-7xl md:text-8xl uppercase italic leading-none">
            Elite <span className="text-brand underline decoration-8 underline-offset-8">CS2</span> Hub
          </h1>
          <p className="mt-6 text-gray-400 font-bold italic text-xl max-w-2xl leading-relaxed uppercase tracking-tight">
            Dobrodošli u srce domaće Counter-Strike 2 zajednice. Taktike, trejdovi i borba za rankove počinje ovde.
          </p>
        </motion.div>
        
        <div className="flex gap-4 relative z-10 pb-2">
          <div className="bg-surface-raised px-6 py-4 border border-border-strong rounded-sm flex flex-col items-end min-w-[140px] shadow-2xl">
             <span className="text-[9px] font-black text-gray-600 uppercase tracking-widest mb-1 italic">Operativci Online</span>
             <span className="text-3xl font-mono text-white font-bold leading-tight tracking-tighter">1,402</span>
          </div>
          <button className="bg-brand px-8 py-4 text-surface-base font-black uppercase text-sm tracking-[0.2em] hover:brightness-110 active:scale-95 transition-all h-full self-stretch flex items-center gap-3 shadow-lg shadow-brand/20">
            Otvori Briefing
          </button>
        </div>
      </header>

      <section className="space-y-1">
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

              <div className="flex gap-12 shrink-0">
                <div className="text-center w-20">
                  <div className="text-white font-mono text-xl font-bold tracking-tight">1.4k</div>
                  <div className="text-gray-600 text-[9px] uppercase font-black tracking-widest">Teme</div>
                </div>
                <div className="text-center w-20">
                  <div className="text-white font-mono text-xl font-bold tracking-tight">45.2k</div>
                  <div className="text-gray-600 text-[9px] uppercase font-black tracking-widest">Poruke</div>
                </div>
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
                    {['Xy', 'Zy', 'Ky', 'Ay', 'My'][i]}
                  </div>
                  <div>
                    <Link to="/category/lobby/topic/1" className="text-base font-bold text-white hover:text-brand transition-colors italic">
                      {[
                        "Novi update: Inferno rework?",
                        "Tražim tim za Faceit Level 10",
                        "Procena skina: AK-47 Case Hardened Blue Gem",
                        "Najbolji crosshair za rezoluciju 4:3",
                        "Premier Rank: Kako preći 20k elo?"
                      ][i]}
                    </Link>
                    <div className="mt-1 flex items-center gap-2 text-[10px] font-bold uppercase tracking-widest text-gray-600">
                      <span className="text-brand">{['KennyS_fan', 'Simple_Jr', 'NikO_aim', 'ZywOo_2', 'Monasy'][i]}</span>
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
  );
}
