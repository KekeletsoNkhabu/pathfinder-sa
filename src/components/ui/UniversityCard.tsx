'use client';
import { motion } from 'framer-motion';
import { Star, MapPin, GitCompare, Heart, ArrowRight, Receipt } from 'lucide-react';
import Link from 'next/link';
import { University } from '@/types';
import AdmissionBadge from './AdmissionBadge';
import { getAdmissionLikelihood } from '@/utils/aps';
import { UNIVERSITY_FEES } from '@/data/universityFees';
import { cn } from '@/utils/cn';

interface UniversityCardProps {
  university: University;
  saved: boolean;
  inCompare: boolean;
  onToggleSave: (id: string) => void;
  onToggleCompare: (id: string) => void;
  studentAPS?: number;
  index?: number;
}

export default function UniversityCard({
  university: u, saved, inCompare, onToggleSave, onToggleCompare, studentAPS, index = 0
}: UniversityCardProps) {
  const likelihood = studentAPS ? getAdmissionLikelihood(studentAPS, u.minAPS) : null;
  const feeInfo = UNIVERSITY_FEES.find(f => f.id === u.id);
  const KZN_IDS = ['ukzn', 'dut', 'mut', 'unizulu'];
  const appFee = feeInfo
    ? KZN_IDS.includes(u.id)
      ? { fee: 250, isFree: false, note: 'R250 via CAO' }
      : { fee: feeInfo.applicationFee, isFree: feeInfo.applicationFee === 0, note: feeInfo.feeNote }
    : null;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.05 }}
      className="card p-5 flex flex-col gap-3 transition-all"
      style={{ borderTop: `3px solid ${u.color}` }}
    >
      {/* Header row */}
      <div className="flex items-start justify-between gap-2">
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-0.5">
            <span className="font-bold text-white text-sm">{u.shortName}</span>
            <span className="text-[10px] text-[#555] font-mono bg-white/5 px-1.5 py-0.5 rounded-md">#{u.ranking} SA</span>
          </div>
          <p className="text-xs text-[#666] truncate">{u.name}</p>
          <p className="text-[10px] text-[#444] flex items-center gap-1 mt-0.5">
            <MapPin size={9} />{u.location}
          </p>
        </div>
        <div className="flex gap-1.5 flex-shrink-0">
          <button
            onClick={() => onToggleSave(u.id)}
            className={cn('p-1.5 rounded-lg transition-all', saved ? 'text-[#CAFF00]' : 'text-[#444] hover:text-[#CAFF00]')}
          >
            <Heart size={13} fill={saved ? 'currentColor' : 'none'} />
          </button>
          <button
            onClick={() => onToggleCompare(u.id)}
            className={cn(
              'px-2 py-1 rounded-lg border transition-all text-[10px] font-semibold flex items-center gap-1',
              inCompare
                ? 'text-[#CAFF00]'
                : 'text-[#555] hover:text-white'
            )}
            style={inCompare
              ? { background: 'rgba(202,255,0,0.08)', borderColor: 'rgba(202,255,0,0.25)' }
              : { background: 'rgba(255,255,255,0.03)', borderColor: 'rgba(255,255,255,0.08)' }}
          >
            <GitCompare size={11} />
            {inCompare ? 'Added' : 'Compare'}
          </button>
        </div>
      </div>

      {/* Stats row */}
      <div className="flex items-center gap-2 flex-wrap">
        <div className="flex items-center gap-1">
          <Star size={10} className="text-[#CAFF00] fill-[#CAFF00]" />
          <span className="text-xs text-[#CAFF00] font-bold">{u.overallRating}/10</span>
        </div>
        <span className="text-[#222]">·</span>
        <span className="text-xs text-[#666]">Min APS <strong className="text-[#aaa]">{u.minAPS}</strong></span>
        {u.nsfasAvailable && (
          <span className="ml-auto text-[9px] font-bold text-emerald-400 px-1.5 py-0.5 rounded-full"
            style={{ background: 'rgba(52,211,153,0.1)' }}>
            NSFAS ✓
          </span>
        )}
      </div>

      {/* Application fee — large prominent pill */}
      {appFee && (
        <div className="flex items-center gap-2 px-3 py-2 rounded-xl"
          style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.07)' }}>
          <Receipt size={12} className="text-[#555] flex-shrink-0" />
          <span className="text-xs text-[#666]">Application fee:</span>
          {appFee.isFree ? (
            <span className="ml-auto text-xs font-bold text-emerald-400 px-2 py-0.5 rounded-full"
              style={{ background: 'rgba(52,211,153,0.1)' }}>
              FREE
            </span>
          ) : (
            <div className="ml-auto flex flex-col items-end">
              <span className="text-sm font-bold text-amber-400">R{appFee.fee}</span>
              {appFee.note && appFee.note !== `R${appFee.fee}` && (
                <span className="text-[9px] text-[#555] leading-none mt-0.5">{appFee.note}</span>
              )}
            </div>
          )}
        </div>
      )}

      {/* Admission likelihood */}
      {likelihood && <AdmissionBadge likelihood={likelihood} size="sm" />}

      {/* Tags */}
      <div className="flex flex-wrap gap-1.5">
        {u.tags.slice(0, 3).map(t => (
          <span key={t} className="text-[9px] px-1.5 py-0.5 rounded-md text-[#555]"
            style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.06)' }}>
            {t}
          </span>
        ))}
      </div>

      {/* CTA */}
      <Link
        href={`/university/${u.id}`}
        className="flex items-center justify-center gap-1.5 py-2.5 rounded-xl text-xs text-[#777] hover:text-white transition-all"
        style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.07)' }}
      >
        View All Programmes <ArrowRight size={11} />
      </Link>
    </motion.div>
  );
}
