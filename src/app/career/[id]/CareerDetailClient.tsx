'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { motion } from 'framer-motion';
import {
  ArrowLeft, Heart, University, Briefcase, Star,
  CheckCircle2, AlertCircle, Lightbulb, TrendingUp, BookOpen
} from 'lucide-react';

import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import MatchBadge from '@/components/ui/MatchBadge';
import NSFASBadge from '@/components/ui/NSFASBadge';
import AdmissionBadge from '@/components/ui/AdmissionBadge';

import { useAppState } from '@/hooks/useAppState';
import { CAREERS } from '@/data/careers';
import { getUniversitiesForCareer } from '@/data/universities';
import { matchCareer, getAdmissionLikelihood } from '@/utils/aps';
import { formatCurrency } from '@/utils/storage';
import { cn } from '@/utils/cn';

export default function CareerDetailClient({ id }: { id: string }) {
  const router = useRouter();

  const {
    profile,
    savedCareers,
    toggleCareer,
    hydrated
  } = useAppState();

  const career = CAREERS.find(c => c.id === id);
  const universities = getUniversitiesForCareer(id);

  useEffect(() => {
    if (hydrated && !career) {
      router.push('/results');
    }
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
  const alternativeCareers = CAREERS.filter(c =>
    career.alternativeCareers.includes(c.id)
  );

  return (
    <div className="min-h-screen bg-[#0a0a0a] grid-bg">
      <Navbar />

      <div className="max-w-6xl mx-auto px-4 sm:px-6 pt-28 pb-20">
        {/* Back */}
        <Link href="/results" className="inline-flex items-center gap-2 text-sm text-[#666] hover:text-[#CAFF00] mb-8">
          <ArrowLeft size={15} /> Back to Results
        </Link>

        {/* Hero */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          className="card p-6 sm:p-8 mb-6"
        >
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
              className={cn(
                'px-4 py-2 rounded-xl',
                isSaved ? 'text-[#CAFF00]' : 'text-gray-400'
              )}
            >
              <Heart fill={isSaved ? 'currentColor' : 'none'} />
            </button>
          </div>

          <p className="text-[#888]">{career.longDescription}</p>

          {match && (
            <div className="mt-4">
              <MatchBadge type={match.matchType} />
              <p className="text-sm">
                {match.matchPercentage}% match
              </p>
            </div>
          )}
        </motion.div>

        {/* Requirements */}
        <div className="card p-6 mb-6">
          <h2 className="text-xl text-white mb-4">Requirements</h2>

          {career.requiredSubjects.map((req) => (
            <div key={req.subject} className="flex justify-between mb-2">
              <span>{req.subject}</span>
              <span>{req.minimumMark}%</span>
            </div>
          ))}
        </div>

        {/* Universities */}
        <div className="card p-6 mb-6">
          <h2 className="text-xl text-white mb-4">Top Universities</h2>

          {universities.slice(0, 3).map((uni) => (
            <div key={uni.id} className="mb-2">
              {uni.name}
            </div>
          ))}
        </div>

        {/* Salary */}
        <div className="card p-6 mb-6">
          <h2 className="text-xl text-white mb-4">Salary</h2>

          <p>{formatCurrency(career.salaryRange.min)}</p>
          <p>{formatCurrency(career.salaryRange.max)}</p>
        </div>

        {/* Alternatives */}
        <div className="card p-6">
          <h2 className="text-xl text-white mb-4">Alternative Careers</h2>

          {alternativeCareers.map((alt) => (
            <Link key={alt.id} href={`/career/${alt.id}`}>
              {alt.title}
            </Link>
          ))}
        </div>
      </div>

      <Footer />
    </div>
  );
}