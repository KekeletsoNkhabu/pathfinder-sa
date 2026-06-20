import { cn } from '@/utils/cn';

interface AdmissionBadgeProps { likelihood: string; size?: 'sm' | 'md'; }

const MAP: Record<string, { label: string; className: string }> = {
  'very-likely': { label: 'Very Likely', className: 'bg-[#CAFF00]/10 text-[#CAFF00] border border-[#CAFF00]/20' },
  'likely':      { label: 'Likely', className: 'bg-emerald-400/10 text-emerald-400 border border-emerald-400/20' },
  'borderline':  { label: 'Borderline', className: 'bg-amber-400/10 text-amber-400 border border-amber-400/20' },
  'unlikely':    { label: 'Unlikely', className: 'bg-red-400/10 text-red-400 border border-red-400/20' },
};

export default function AdmissionBadge({ likelihood, size = 'md' }: AdmissionBadgeProps) {
  const m = MAP[likelihood] ?? MAP['borderline'];
  return (
    <span className={cn(
      'rounded-full font-semibold border',
      size === 'sm' ? 'text-[9px] px-2 py-0.5' : 'text-xs px-2.5 py-1',
      m.className
    )}>
      {m.label}
    </span>
  );
}
