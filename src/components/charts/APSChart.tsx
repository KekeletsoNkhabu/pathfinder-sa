'use client';
import {
  BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell, ReferenceLine
} from 'recharts';
import { Subject } from '@/types';
import { apsToColor } from '@/utils/aps';

interface APSChartProps {
  subjects: Subject[];
}

const CustomTooltip = ({ active, payload }: { active?: boolean; payload?: Array<{ payload: Subject & { fullName: string } }> }) => {
  if (!active || !payload?.length) return null;
  const d = payload[0].payload;
  return (
    <div className="bg-[#1a1a1a] border border-white/10 rounded-xl p-3 shadow-2xl">
      <p className="text-xs text-[#666] mb-1">{d.fullName}</p>
      <div className="flex gap-4">
        <div>
          <p className="text-[10px] text-[#555]">Mark</p>
          <p className="text-sm font-bold text-white">{d.mark}%</p>
        </div>
        <div>
          <p className="text-[10px] text-[#555]">APS</p>
          <p className="text-sm font-bold" style={{ color: apsToColor(d.apsPoints) }}>{d.apsPoints}</p>
        </div>
      </div>
    </div>
  );
};

export default function APSChart({ subjects }: APSChartProps) {
  const data = subjects.map(s => ({
    ...s,
    fullName: s.name,
    name: s.name.length > 10 ? s.name.split(' ').map(w => w[0]).join('') : s.name.split(' ')[0],
  }));

  return (
    <div className="w-full">
      <ResponsiveContainer width="100%" height={220}>
        <BarChart data={data} margin={{ top: 10, right: 10, left: -20, bottom: 0 }} barCategoryGap="30%">
          <XAxis
            dataKey="name"
            tick={{ fontSize: 10, fill: '#666', fontFamily: 'Space Grotesk' }}
            axisLine={false}
            tickLine={false}
          />
          <YAxis
            domain={[0, 7]}
            ticks={[1, 2, 3, 4, 5, 6, 7]}
            tick={{ fontSize: 10, fill: '#444', fontFamily: 'JetBrains Mono' }}
            axisLine={false}
            tickLine={false}
          />
          <Tooltip content={<CustomTooltip />} cursor={{ fill: 'rgba(255,255,255,0.03)' }} />
          <ReferenceLine y={4} stroke="rgba(255,255,255,0.08)" strokeDasharray="4 4" />
          <Bar dataKey="apsPoints" radius={[6, 6, 0, 0]} maxBarSize={40}>
            {data.map((entry, index) => (
              <Cell key={index} fill={apsToColor(entry.apsPoints)} fillOpacity={0.9} />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
      <p className="text-center text-[10px] text-[#444] mt-1">APS points per subject (7 = max)</p>
    </div>
  );
}
