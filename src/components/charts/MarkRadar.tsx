'use client';
import {
  RadarChart, Radar, PolarGrid, PolarAngleAxis, ResponsiveContainer, Tooltip
} from 'recharts';
import { Subject } from '@/types';

interface MarkRadarProps {
  subjects: Subject[];
}

const CustomTooltip = ({ active, payload }: { active?: boolean; payload?: Array<{ value: number; payload: { fullName: string } }> }) => {
  if (!active || !payload?.length) return null;
  return (
    <div className="bg-[#1a1a1a] border border-white/10 rounded-xl p-3 text-xs">
      <p className="text-[#666]">{payload[0].payload.fullName}</p>
      <p className="font-bold text-[#CAFF00]">{payload[0].value}%</p>
    </div>
  );
};

export default function MarkRadar({ subjects }: MarkRadarProps) {
  const data = subjects.slice(0, 8).map(s => ({
    fullName: s.name,
    subject: s.name.split(' ').map(w => w[0]).join('').toUpperCase().slice(0, 4),
    mark: s.mark,
  }));

  return (
    <ResponsiveContainer width="100%" height={220}>
      <RadarChart data={data}>
        <PolarGrid stroke="rgba(255,255,255,0.06)" />
        <PolarAngleAxis
          dataKey="subject"
          tick={{ fontSize: 10, fill: '#555', fontFamily: 'Space Grotesk' }}
        />
        <Radar
          name="Mark"
          dataKey="mark"
          stroke="#CAFF00"
          fill="#CAFF00"
          fillOpacity={0.08}
          strokeWidth={2}
        />
        <Tooltip content={<CustomTooltip />} />
      </RadarChart>
    </ResponsiveContainer>
  );
}
