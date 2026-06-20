import { cn } from '@/utils/cn';

interface MatchBadgeProps { type: string; }

const MAP: Record<string, { label: string; className: string }> = {
  perfect: { label: '✦ Perfect Match', className: 'bg-[#CAFF00]/10 text-[#CAFF00] border border-[#CAFF00]/20' },
  strong:  { label: '▲ Strong Match', className: 'bg-emerald-400/10 text-emerald-400 border border-emerald-400/20' },
  possible:{ label: '◆ Possible Match', className: 'bg-amber-400/10 text-amber-400 border border-amber-400/20' },
  stretch: { label: '△ Stretch Goal', className: 'bg-red-400/10 text-red-400 border border-red-400/20' },
};

export default function MatchBadge({ type }: MatchBadgeProps) {
  const m = MAP[type] ?? MAP.stretch;
  return <span className={cn('text-xs px-2.5 py-1 rounded-full font-semibold', m.className)}>{m.label}</span>;
}
