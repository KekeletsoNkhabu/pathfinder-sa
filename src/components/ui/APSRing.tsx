'use client';
import { motion } from 'framer-motion';

interface APSRingProps {
  score: number;
  maxScore?: number;
  size?: number;
}

export default function APSRing({ score, maxScore = 42, size = 120 }: APSRingProps) {
  const radius = (size - 20) / 2;
  const circumference = 2 * Math.PI * radius;
  const percent = Math.min(score / maxScore, 1);
  const offset = circumference - percent * circumference;

  const getColor = () => {
    if (percent >= 0.8) return '#CAFF00';
    if (percent >= 0.6) return '#86efac';
    if (percent >= 0.4) return '#fbbf24';
    return '#f87171';
  };

  const getLabel = () => {
    if (percent >= 0.85) return 'Excellent';
    if (percent >= 0.70) return 'Strong';
    if (percent >= 0.55) return 'Good';
    if (percent >= 0.40) return 'Average';
    return 'Developing';
  };

  return (
    <div className="flex flex-col items-center gap-2">
      <div className="relative" style={{ width: size, height: size }}>
        <svg width={size} height={size} className="progress-ring">
          {/* Track */}
          <circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            fill="none"
            stroke="rgba(255,255,255,0.06)"
            strokeWidth={10}
          />
          {/* Progress */}
          <motion.circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            fill="none"
            stroke={getColor()}
            strokeWidth={10}
            strokeLinecap="round"
            strokeDasharray={circumference}
            initial={{ strokeDashoffset: circumference }}
            animate={{ strokeDashoffset: offset }}
            transition={{ duration: 1.2, ease: [0.34, 1.56, 0.64, 1] }}
            style={{ filter: `drop-shadow(0 0 8px ${getColor()}60)` }}
          />
        </svg>
        {/* Center text */}
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <motion.span
            className="text-3xl font-display font-bold"
            style={{ color: getColor() }}
            initial={{ opacity: 0, scale: 0.5 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.5, duration: 0.5, ease: [0.34, 1.56, 0.64, 1] }}
          >
            {score}
          </motion.span>
          <span className="text-[10px] text-[#666] uppercase tracking-wider">/ {maxScore}</span>
        </div>
      </div>
      <div className="text-center">
        <div className="text-xs font-semibold" style={{ color: getColor() }}>{getLabel()}</div>
        <div className="text-[11px] text-[#555] mt-0.5">APS Score</div>
      </div>
    </div>
  );
}
