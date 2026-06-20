'use client';
import { Subject } from '@/types';

interface APSChartProps { subjects: Subject[]; }

const COLORS = ['#CAFF00', '#86efac', '#6ee7b7', '#fbbf24', '#fb923c', '#f87171', '#ef4444'];

export default function APSChart({ subjects }: APSChartProps) {
  const max = Math.max(...subjects.map(s => s.apsPoints), 1);
  return (
    <div className="space-y-2">
      {subjects.map((s, i) => (
        <div key={s.name} className="flex items-center gap-2">
          <span className="text-[10px] text-[#555] w-20 truncate flex-shrink-0">{s.name.split(' ')[0]}</span>
          <div className="flex-1 h-4 bg-white/5 rounded-full overflow-hidden">
            <div
              className="h-full rounded-full transition-all duration-700"
              style={{
                width: `${(s.apsPoints / 7) * 100}%`,
                backgroundColor: COLORS[Math.min(i, COLORS.length - 1)],
              }}
            />
          </div>
          <span className="text-[10px] font-bold font-mono text-[#CAFF00] w-4 flex-shrink-0">{s.apsPoints}</span>
        </div>
      ))}
    </div>
  );
}
