'use client';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { Heart, ArrowRight, AlertTriangle } from 'lucide-react';
import { CareerMatch } from '@/types';
import MatchBadge from './MatchBadge';
import MatchBar from './MatchBar';
import NSFASBadge from './NSFASBadge';
import { formatCurrency } from '@/utils/storage';
import { cn } from '@/utils/cn';

interface CareerCardProps {
  match: CareerMatch;
  saved: boolean;
  onToggleSave: (id: string) => void;
  index?: number;
}

export default function CareerCard({ match, saved, onToggleSave, index = 0 }: CareerCardProps) {
  const { career, matchType, matchPercentage, missingRequirements } = match;

  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.06, duration: 0.4 }}
      className="card group relative overflow-hidden"
    >
      {/* Hover glow */}
      <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"
        style={{ background: 'radial-gradient(ellipse at top left, rgba(202,255,0,0.04) 0%, transparent 60%)' }}
      />

      <div className="p-5">
        {/* Header */}
        <div className="flex items-start justify-between gap-3 mb-4">
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-xl bg-white/5 flex items-center justify-center text-2xl flex-shrink-0">
              {career.emoji}
            </div>
            <div>
              <h3 className="font-display font-bold text-white leading-tight">{career.title}</h3>
              <span className="text-[11px] text-[#555] uppercase tracking-wider">{career.category}</span>
            </div>
          </div>
          <button
            onClick={(e) => { e.preventDefault(); onToggleSave(career.id); }}
            className={cn(
              'p-2 rounded-lg transition-all flex-shrink-0',
              saved
                ? 'bg-[#CAFF00]/10 text-[#CAFF00]'
                : 'bg-white/5 text-[#555] hover:text-[#CAFF00] hover:bg-[#CAFF00]/5'
            )}
          >
            <Heart size={15} fill={saved ? 'currentColor' : 'none'} />
          </button>
        </div>

        {/* Description */}
        <p className="text-sm text-[#888] leading-relaxed mb-4 line-clamp-2">{career.description}</p>

        {/* Salary */}
        <div className="flex items-center gap-2 mb-4">
          <span className="text-xs text-[#555]">Salary range:</span>
          <span className="text-xs font-bold text-[#CAFF00]">
            {formatCurrency(career.salaryRange.min)} – {formatCurrency(career.salaryRange.max)} p/a
          </span>
        </div>

        {/* Match bar */}
        <MatchBar percentage={matchPercentage} />

        {/* Badges */}
        <div className="flex flex-wrap items-center gap-2 mt-3">
          <MatchBadge type={matchType} size="sm" />
          <NSFASBadge funded={career.nsfasFunded} demand={career.demandLevel} compact />
        </div>

        {/* Missing requirements warning */}
        {missingRequirements.length > 0 && (
          <div className="mt-3 p-2.5 rounded-lg bg-orange-500/5 border border-orange-500/15">
            <div className="flex items-center gap-1.5 mb-1">
              <AlertTriangle size={11} className="text-orange-400" />
              <span className="text-[10px] text-orange-400 font-semibold uppercase tracking-wider">Gaps to address</span>
            </div>
            <p className="text-[11px] text-[#777]">{missingRequirements.slice(0, 2).join(' · ')}</p>
          </div>
        )}

        {/* CTA */}
        <Link
          href={`/career/${career.id}`}
          className="mt-4 flex items-center justify-between w-full px-4 py-2.5 rounded-xl bg-white/3 hover:bg-[#CAFF00]/5 border border-white/5 hover:border-[#CAFF00]/20 transition-all group/cta"
        >
          <span className="text-sm font-medium text-[#999] group-hover/cta:text-white transition-colors">View career details</span>
          <ArrowRight size={15} className="text-[#555] group-hover/cta:text-[#CAFF00] group-hover/cta:translate-x-1 transition-all" />
        </Link>
      </div>
    </motion.div>
  );
}
