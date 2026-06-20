'use client';
import { motion } from 'framer-motion';

interface MatchBarProps { percentage: number; }

export default function MatchBar({ percentage }: MatchBarProps) {
  const color = percentage >= 80 ? '#CAFF00' : percentage >= 60 ? '#86efac' : percentage >= 40 ? '#fbbf24' : '#f87171';
  return (
    <div className="mt-2">
      <div className="flex justify-between items-center mb-1">
        <span className="text-[10px] text-[#555] uppercase tracking-wider">Match</span>
        <span className="text-xs font-bold font-mono" style={{ color }}>{percentage}%</span>
      </div>
      <div className="h-1.5 bg-white/5 rounded-full overflow-hidden">
        <motion.div
          className="h-full rounded-full"
          style={{ backgroundColor: color }}
          initial={{ width: 0 }}
          animate={{ width: `${percentage}%` }}
          transition={{ duration: 0.8, ease: 'easeOut' }}
        />
      </div>
    </div>
  );
}
