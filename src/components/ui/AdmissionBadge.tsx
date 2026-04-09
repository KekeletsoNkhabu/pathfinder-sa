import { AdmissionLikelihood } from '@/utils/aps';
import { CheckCircle2, MinusCircle, XCircle } from 'lucide-react';
import { cn } from '@/utils/cn';

interface AdmissionBadgeProps {
  likelihood: AdmissionLikelihood;
  showIcon?: boolean;
  size?: 'sm' | 'md';
}

const config: Record<AdmissionLikelihood, { label: string; icon: typeof CheckCircle2; cls: string }> = {
  Likely: { label: 'Likely', icon: CheckCircle2, cls: 'badge-lime' },
  Borderline: { label: 'Borderline', icon: MinusCircle, cls: 'badge-orange' },
  Unlikely: { label: 'Unlikely', icon: XCircle, cls: 'badge-red' },
};

export default function AdmissionBadge({ likelihood, showIcon = true, size = 'md' }: AdmissionBadgeProps) {
  const { label, icon: Icon, cls } = config[likelihood];
  return (
    <span className={cn('badge', cls, size === 'sm' && 'text-[10px] py-0.5 px-2')}>
      {showIcon && <Icon size={size === 'sm' ? 9 : 11} />}
      {label}
    </span>
  );
}
