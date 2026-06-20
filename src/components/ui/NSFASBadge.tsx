import { ShieldCheck } from 'lucide-react';
import { cn } from '@/utils/cn';

interface NSFASBadgeProps { funded: boolean; demand?: string; compact?: boolean; }

export default function NSFASBadge({ funded, demand, compact }: NSFASBadgeProps) {
  return (
    <div className={cn('flex items-center gap-2', compact ? 'mt-1' : 'mt-2')}>
      {funded && (
        <span className="inline-flex items-center gap-1 text-[10px] px-2 py-0.5 rounded-full bg-emerald-400/10 text-emerald-400 font-semibold">
          <ShieldCheck size={9} />NSFAS
        </span>
      )}
      {demand && (
        <span className={cn(
          'text-[10px] px-2 py-0.5 rounded-full font-semibold',
          demand === 'High' ? 'bg-[#CAFF00]/10 text-[#CAFF00]' :
          demand === 'Growing' ? 'bg-amber-400/10 text-amber-400' :
          'bg-white/5 text-[#666]'
        )}>{demand} demand</span>
      )}
    </div>
  );
}
