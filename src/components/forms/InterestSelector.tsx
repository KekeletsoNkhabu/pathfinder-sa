'use client';
import { motion } from 'framer-motion';
import { INTERESTS } from '@/data/careers';
import { cn } from '@/utils/cn';

interface InterestSelectorProps {
  selected: string[];
  onChange: (interests: string[]) => void;
}

export default function InterestSelector({ selected, onChange }: InterestSelectorProps) {
  const toggle = (id: string) => {
    onChange(
      selected.includes(id) ? selected.filter(s => s !== id) : [...selected, id]
    );
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-3">
        <h3 className="text-sm font-semibold text-white">Your Interests</h3>
        <span className="text-xs text-[#555]">Select all that apply</span>
      </div>
      <div className="grid grid-cols-2 gap-2">
        {INTERESTS.map((interest, i) => {
          const active = selected.includes(interest.id);
          return (
            <motion.button
              key={interest.id}
              type="button"
              onClick={() => toggle(interest.id)}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: i * 0.04 }}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className={cn(
                'flex items-center gap-2.5 px-3 py-2.5 rounded-xl border text-sm text-left transition-all',
                active
                  ? 'bg-[#CAFF00]/10 border-[#CAFF00]/30 text-[#CAFF00]'
                  : 'bg-white/3 border-white/6 text-[#888] hover:bg-white/5 hover:border-white/12 hover:text-white'
              )}
            >
              <span className="text-lg leading-none">{interest.emoji}</span>
              <span className="text-xs font-medium leading-tight">{interest.label}</span>
            </motion.button>
          );
        })}
      </div>
    </div>
  );
}
