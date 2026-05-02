import React, { useState } from 'react';
import { Palette, Check } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { useTheme } from '../lib/ThemeContext';
import { cn } from '../lib/utils';

const THEMES = [
  { id: 'neon', name: 'NEON / CS2', color: '#ebff00', description: 'Moderni neon stil' },
  { id: 'classic', name: 'CLASSIC / T', color: '#de9b35', description: 'Klasični narandžasti stil' },
  { id: 'ct', name: 'TACTICAL / CT', color: '#4fd1ff', description: 'Plavi taktički stil' },
  { id: 'crimson', name: 'CRIMSON / BLOOD', color: '#ff4747', description: 'Crveni borbeni stil' },
] as const;

export function ThemeToggle() {
  const { theme, setTheme } = useTheme();
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 px-4 py-2 border border-border-strong bg-surface-base hover:border-brand transition-all text-[10px] font-black uppercase tracking-widest text-gray-400 hover:text-white"
      >
        <Palette className="h-4 w-4" />
        <span className="hidden sm:inline">Tema</span>
      </button>

      <AnimatePresence>
        {isOpen && (
          <>
            <div 
              className="fixed inset-0 z-[60]" 
              onClick={() => setIsOpen(false)} 
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 10 }}
              className="absolute right-0 mt-3 w-64 p-2 bg-surface-raised border border-border-strong shadow-2xl z-[70] rounded-sm"
            >
              <div className="px-3 py-2 border-b border-border-strong mb-2">
                <span className="text-[9px] font-black uppercase tracking-widest text-gray-500 italic">Izaberi vizuelni mod</span>
              </div>
              <div className="space-y-1">
                {THEMES.map((t) => (
                  <button
                    key={t.id}
                    onClick={() => {
                      setTheme(t.id);
                      setIsOpen(false);
                    }}
                    className={cn(
                      "w-full flex items-center gap-3 p-3 text-left transition-all hover:bg-surface-hover group rounded-sm",
                      theme === t.id && "bg-surface-hover ring-1 ring-brand/20"
                    )}
                  >
                    <div 
                      className="h-4 w-4 rounded-full flex-shrink-0 border border-white/10" 
                      style={{ backgroundColor: t.color }}
                    />
                    <div className="flex-1">
                      <div className={cn(
                        "text-[10px] font-black uppercase tracking-widest transition-colors",
                        theme === t.id ? "text-brand" : "text-white group-hover:text-brand"
                      )}>
                        {t.name}
                      </div>
                      <div className="text-[9px] text-gray-500 font-medium italic">{t.description}</div>
                    </div>
                    {theme === t.id && (
                      <Check className="h-3 w-3 text-brand" />
                    )}
                  </button>
                ))}
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}
