import { cn } from '@/utils/cn';
import { ShieldCheck, TrendingUp } from 'lucide-react';

interface NSFASBadgeProps {
  funded: boolean;
  demand?: 'High' | 'Medium' | 'Growing';
  compact?: boolean;
}

export default function NSFASBadge({ funded, demand, compact = false }: NSFASBadgeProps) {
  return (
    <div className={cn('flex flex-wrap gap-2', compact && 'gap-1')}>
      {funded && (
        <span
          className={cn('badge badge-green', compact && 'text-[10px] py-0.5 px-2')}
          data-tooltip="NSFAS may fund this programme. Eligibility based on household income below R350,000/year."
        >
          <ShieldCheck size={compact ? 9 : 11} />
          NSFAS Funded
        </span>
      )}
      {demand && (
        <span
          className={cn(
            'badge',
            demand === 'High' ? 'badge-lime' : demand === 'Growing' ? 'badge-blue' : 'badge-orange',
            compact && 'text-[10px] py-0.5 px-2'
          )}
          data-tooltip={`${demand} demand field in the South African job market`}
        >
          <TrendingUp size={compact ? 9 : 11} />
          {demand} Demand
        </span>
      )}
    </div>
  );
}
