'use client';
import { Subject } from '@/types';

interface MarkRadarProps { subjects: Subject[]; }

export default function MarkRadar({ subjects }: MarkRadarProps) {
  if (subjects.length === 0) return null;
  const size = 180;
  const cx = size / 2;
  const cy = size / 2;
  const r = size * 0.38;
  const n = subjects.length;

  const points = subjects.map((_, i) => {
    const angle = (2 * Math.PI * i) / n - Math.PI / 2;
    return { angle, x: cx + r * Math.cos(angle), y: cy + r * Math.sin(angle) };
  });

  const dataPoints = subjects.map((s, i) => {
    const angle = points[i].angle;
    const ratio = s.mark / 100;
    return { x: cx + r * ratio * Math.cos(angle), y: cy + r * ratio * Math.sin(angle) };
  });

  const polygon = dataPoints.map(p => `${p.x},${p.y}`).join(' ');

  return (
    <svg width={size} height={size} className="mx-auto">
      {[0.25, 0.5, 0.75, 1].map(ratio => (
        <polygon key={ratio}
          points={points.map(p => {
            const angle = p.angle;
            return `${cx + r * ratio * Math.cos(angle)},${cy + r * ratio * Math.sin(angle)}`;
          }).join(' ')}
          fill="none" stroke="rgba(255,255,255,0.06)" strokeWidth="1"
        />
      ))}
      {points.map((p, i) => (
        <line key={i} x1={cx} y1={cy} x2={p.x} y2={p.y} stroke="rgba(255,255,255,0.06)" strokeWidth="1" />
      ))}
      <polygon points={polygon} fill="rgba(202,255,0,0.12)" stroke="#CAFF00" strokeWidth="1.5" />
      {subjects.map((s, i) => (
        <text key={s.name}
          x={points[i].x + Math.cos(points[i].angle) * 14}
          y={points[i].y + Math.sin(points[i].angle) * 14}
          textAnchor="middle" dominantBaseline="middle"
          fontSize="7" fill="#555"
        >
          {s.name.split(' ')[0].slice(0, 6)}
        </text>
      ))}
    </svg>
  );
}
