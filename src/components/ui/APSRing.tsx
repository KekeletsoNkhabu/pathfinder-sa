'use client';
import { motion } from 'framer-motion';

interface APSRingProps { score: number; size?: number; }

export default function APSRing({ score, size = 120 }: APSRingProps) {
  const max = 42;
  const pct = Math.min(score / max, 1);
  const r = (size - 20) / 2;
  const circ = 2 * Math.PI * r;
  const offset = circ * (1 - pct);
  const color = score >= 35 ? '#CAFF00' : score >= 28 ? '#86efac' : score >= 20 ? '#fbbf24' : '#f87171';

  return (
    <div className="relative flex items-center justify-center" style={{ width: size, height: size }}>
      <svg width={size} height={size} className="-rotate-90">
        <circle cx={size/2} cy={size/2} r={r} fill="none" stroke="rgba(255,255,255,0.05)" strokeWidth={8} />
        <motion.circle
          cx={size/2} cy={size/2} r={r}
          fill="none" stroke={color} strokeWidth={8}
          strokeLinecap="round"
          strokeDasharray={circ}
          initial={{ strokeDashoffset: circ }}
          animate={{ strokeDashoffset: offset }}
          transition={{ duration: 1, ease: 'easeOut' }}
        />
      </svg>
      <div className="absolute text-center">
        <motion.p
          className="font-mono font-bold text-white"
          style={{ fontSize: size * 0.22 }}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
        >
          {score}
        </motion.p>
        <p className="text-[#555] font-mono" style={{ fontSize: size * 0.09 }}>/ 42</p>
      </div>
    </div>
  );
}
