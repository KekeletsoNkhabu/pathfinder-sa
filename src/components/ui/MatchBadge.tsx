import { MatchType } from '@/types';
import { cn } from '@/utils/cn';
import { CheckCircle2, AlertCircle, TrendingUp } from 'lucide-react';

interface MatchBadgeProps {
  type: MatchType;
  size?: 'sm' | 'md';
}

const config = {
  strong: { label: 'Strong Match', icon: CheckCircle2, className: 'badge-lime' },
  possible: { label: 'Possible Match', icon: AlertCircle, className: 'badge-orange' },
  reach: { label: 'Reach Goal', icon: TrendingUp, className: 'badge-blue' },
};

export default function MatchBadge({ type, size = 'md' }: MatchBadgeProps) {
  const { label, icon: Icon, className } = config[type];
  return (
    <span className={cn('badge', className, size === 'sm' && 'text-[10px] py-0.5 px-2')}>
      <Icon size={size === 'sm' ? 9 : 11} />
      {label}
    </span>
  );
}
