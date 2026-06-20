'use client';
import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { ArrowLeft, Heart, TrendingUp } from 'lucide-react';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import MatchBadge from '@/components/ui/MatchBadge';
import NSFASBadge from '@/components/ui/NSFASBadge';
import { useAppState } from '@/hooks/useAppState';
import { CAREERS } from '@/data/careers';
import { matchCareer } from '@/utils/aps';
import { formatCurrency } from '@/utils/storage';
import { cn } from '@/utils/cn';

export default function CareerDetailClient({ id }: { id: string }) {
  const router = useRouter();
  const { profile, savedCareers, toggleCareer, hydrated } = useAppState();
  const career = CAREERS.find(c => c.id === id);

  useEffect(() => {
    if (hydrated && !career) router.push('/results');
  }, [hydrated, career, router]);

  if (!career) {
    return (
      <div className="min-h-screen bg-[#0a0a0a] flex items-center justify-center">
        <div className="text-[#555] animate-pulse">Loading…</div>
      </div>
    );
  }

  const match = profile ? matchCareer(career, profile) : null;
  const isSaved = savedCareers.includes(career.id);
  const alternativeCareers = CAREERS.filter(c => career.alternativeCareers.includes(c.id));

  return (
    <div className="min-h-screen bg-[#0a0a0a] grid-bg">
      <Navbar />
      <div className="max-w-4xl mx-auto px-4 sm:px-6 pt-28 pb-20">
        <Link href="/results" className="inline-flex items-center gap-2 text-sm text-[#666] hover:text-[#CAFF00] mb-8">
          <ArrowLeft size={15} /> Back to Results
        </Link>

        {/* Hero */}
        <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} className="card p-6 sm:p-8 mb-6">
          <div className="flex justify-between mb-6">
            <div className="flex gap-4">
              <div className="text-4xl">{career.emoji}</div>
              <div>
                <h1 className="text-3xl font-bold text-white">{career.title}</h1>
                <NSFASBadge funded={career.nsfasFunded} demand={career.demandLevel} compact />
              </div>
            </div>
            <button
              onClick={() => toggleCareer(career.id)}
              className={cn('p-2 rounded-xl transition-all', isSaved ? 'text-[#CAFF00] bg-[#CAFF00]/10' : 'text-[#444] hover:text-[#CAFF00]')}
            >
              <Heart size={20} fill={isSaved ? 'currentColor' : 'none'} />
            </button>
          </div>

          <p className="text-[#888] leading-relaxed mb-4">{career.longDescription}</p>

          {match && (
            <div className="flex items-center gap-3 mt-4">
              <MatchBadge type={match.matchType} />
              <span className="text-sm text-[#666]">{match.matchPercentage}% match with your profile</span>
            </div>
          )}
        </motion.div>

        {/* Salary */}
        <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.05 }} className="card p-6 mb-6">
          <h2 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
            <TrendingUp size={16} className="text-[#CAFF00]" /> Salary Range
          </h2>
          <div className="flex items-center gap-6">
            <div>
              <p className="text-xs text-[#555] mb-1">Starting</p>
              <p className="text-2xl font-bold text-white font-mono">{formatCurrency(career.salaryRange.min)}</p>
            </div>
            <div className="text-[#333] text-2xl">→</div>
            <div>
              <p className="text-xs text-[#555] mb-1">Senior</p>
              <p className="text-2xl font-bold text-[#CAFF00] font-mono">{formatCurrency(career.salaryRange.max)}</p>
            </div>
            <div className="ml-auto text-xs text-[#555]">per year</div>
          </div>
        </motion.div>

        {/* Requirements */}
        <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="card p-6 mb-6">
          <h2 className="text-lg font-bold text-white mb-4">Subject Requirements</h2>
          <div className="space-y-3">
            <div className="flex justify-between items-center py-2 border-b border-white/5">
              <span className="text-sm text-[#666]">Minimum APS</span>
              <span className="font-bold text-[#CAFF00] font-mono">{career.minAPS} / 42</span>
            </div>
            {career.requiredSubjects.map(req => {
              const studentSubject = profile?.subjects.find(s => s.name.toLowerCase().includes(req.subject.toLowerCase()));
              const meets = studentSubject ? studentSubject.mark >= req.minimumMark : null;
              return (
                <div key={req.subject} className="flex justify-between items-center py-2 border-b border-white/5">
                  <span className="text-sm text-white">{req.subject}</span>
                  <div className="flex items-center gap-3">
                    <span className="text-sm text-[#666]">≥{req.minimumMark}%</span>
                    {meets !== null && (
                      <span className={cn('text-xs font-semibold px-2 py-0.5 rounded-full', meets ? 'text-emerald-400 bg-emerald-400/10' : 'text-red-400 bg-red-400/10')}>
                        {meets ? '✓ Met' : '✗ Below'}
                      </span>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </motion.div>

        {/* Career outcomes */}
        <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 }} className="card p-6 mb-6">
          <h2 className="text-lg font-bold text-white mb-4">Career Outcomes</h2>
          <div className="grid sm:grid-cols-2 gap-2">
            {career.careerOutcomes.map(outcome => (
              <div key={outcome} className="flex items-center gap-2 px-3 py-2 rounded-xl bg-[#CAFF00]/5 border border-[#CAFF00]/10">
                <span className="w-1.5 h-1.5 rounded-full bg-[#CAFF00] flex-shrink-0" />
                <span className="text-sm text-[#aaa]">{outcome}</span>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Alternative careers */}
        {alternativeCareers.length > 0 && (
          <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="card p-6">
            <h2 className="text-lg font-bold text-white mb-4">Similar Careers</h2>
            <div className="grid sm:grid-cols-2 gap-3">
              {alternativeCareers.map(alt => (
                <Link key={alt.id} href={`/career/${alt.id}`}
                  className="flex items-center gap-3 px-4 py-3 rounded-xl bg-white/3 border border-white/8 hover:border-[#CAFF00]/20 hover:bg-[#CAFF00]/3 transition-all group"
                >
                  <span className="text-2xl">{alt.emoji}</span>
                  <div>
                    <p className="text-sm font-semibold text-white group-hover:text-[#CAFF00] transition-colors">{alt.title}</p>
                    <p className="text-xs text-[#555]">{alt.category}</p>
                  </div>
                </Link>
              ))}
            </div>
          </motion.div>
        )}
      </div>
      <Footer />
    </div>
  );
}
