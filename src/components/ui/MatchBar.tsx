'use client';
import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';

interface MatchBarProps {
  percentage: number;
  showLabel?: boolean;
  height?: number;
}

const getColor = (pct: number) => {
  if (pct >= 80) return '#CAFF00';
  if (pct >= 60) return '#86efac';
  if (pct >= 40) return '#fbbf24';
  return '#f87171';
};

export default function MatchBar({ percentage, showLabel = true, height = 6 }: MatchBarProps) {
  const [animated, setAnimated] = useState(false);

  useEffect(() => {
    const t = setTimeout(() => setAnimated(true), 100);
    return () => clearTimeout(t);
  }, []);

  const color = getColor(percentage);

  return (
    <div className="w-full">
      {showLabel && (
        <div className="flex justify-between items-center mb-1.5">
          <span className="text-xs text-[#666]">Match</span>
          <span className="text-xs font-bold" style={{ color }}>{percentage}%</span>
        </div>
      )}
      <div className="match-bar-track" style={{ height }}>
        <motion.div
          className="match-bar-fill"
          style={{ backgroundColor: color }}
          initial={{ width: 0 }}
          animate={{ width: animated ? `${percentage}%` : 0 }}
          transition={{ duration: 0.8, ease: [0.34, 1.56, 0.64, 1] }}
        />
      </div>
    </div>
  );
}
