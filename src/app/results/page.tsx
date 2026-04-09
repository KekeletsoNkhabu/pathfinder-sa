'use client';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { motion } from 'framer-motion';
import {
  ArrowLeft, Filter, Lightbulb, ArrowRight,
  TrendingUp, RefreshCw, Bookmark, AlertTriangle
} from 'lucide-react';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import CareerCard from '@/components/ui/CareerCard';
import APSRing from '@/components/ui/APSRing';
import APSChart from '@/components/charts/APSChart';
import MarkRadar from '@/components/charts/MarkRadar';
import { useAppState } from '@/hooks/useAppState';
import { getImprovementSuggestions } from '@/utils/aps';
import { MatchType, CareerMatch } from '@/types';
import { CAREER_CATEGORIES } from '@/data/careers';

const MATCH_FILTERS: { value: MatchType | 'all'; label: string }[] = [
  { value: 'all', label: 'All' },
  { value: 'strong', label: 'Strong' },
  { value: 'possible', label: 'Possible' },
  { value: 'reach', label: 'Reach' },
];

export default function ResultsPage() {
  const router = useRouter();
  const { profile, careerMatches, savedCareers, toggleCareer, hydrated } = useAppState();
  const [matchFilter, setMatchFilter] = useState<MatchType | 'all'>('all');
  const [categoryFilter, setCategoryFilter] = useState<string>('all');
  const [showImprovement, setShowImprovement] = useState(false);

  useEffect(() => {
    if (hydrated && !profile) {
      router.push('/dashboard');
    }
  }, [hydrated, profile, router]);

  if (!hydrated || !profile) {
    return (
      <div className="min-h-screen bg-[#0a0a0a] flex items-center justify-center">
        <div className="text-[#555] animate-pulse">Loading…</div>
      </div>
    );
  }

  // Filter matches
  const filteredMatches = careerMatches.filter(m => {
    const matchOk = matchFilter === 'all' || m.matchType === matchFilter;
    const catOk = categoryFilter === 'all' || m.career.category === categoryFilter;
    return matchOk && catOk;
  });

  const strongCount = careerMatches.filter(m => m.matchType === 'strong').length;
  const possibleCount = careerMatches.filter(m => m.matchType === 'possible').length;
  const reachCount = careerMatches.filter(m => m.matchType === 'reach').length;

  const improvements = getImprovementSuggestions(profile);

  return (
    <div className="min-h-screen bg-[#0a0a0a] grid-bg">
      <Navbar />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 pt-28 pb-20">
        {/* Back */}
        <Link href="/dashboard" className="inline-flex items-center gap-2 text-sm text-[#666] hover:text-[#CAFF00] transition-colors mb-8">
          <ArrowLeft size={15} /> Back to Profile
        </Link>

        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-10"
        >
          <h1 className="font-display text-4xl font-bold text-white mb-2">
            Your Results, <span className="text-[#CAFF00]">{profile.name.split(' ')[0]}</span>
          </h1>
          <p className="text-[#666]">Based on your {profile.subjects.length} subjects — here's what you qualify for</p>
        </motion.div>

        <div className="grid lg:grid-cols-[280px_1fr] gap-6">
          {/* Left sidebar */}
          <div className="space-y-4">
            {/* APS summary card */}
            <motion.div
              initial={{ opacity: 0, x: -24 }}
              animate={{ opacity: 1, x: 0 }}
              className="card p-6"
            >
              <h3 className="text-xs text-[#555] uppercase tracking-wider mb-5">Your APS Score</h3>
              <div className="flex justify-center mb-5">
                <APSRing score={profile.totalAPS} size={140} />
              </div>

              {/* Match counts */}
              <div className="space-y-2.5">
                <div className="flex justify-between items-center py-2 border-b border-white/4">
                  <span className="text-sm text-[#888]">Strong Matches</span>
                  <span className="font-bold text-[#CAFF00] font-mono">{strongCount}</span>
                </div>
                <div className="flex justify-between items-center py-2 border-b border-white/4">
                  <span className="text-sm text-[#888]">Possible Matches</span>
                  <span className="font-bold text-orange-400 font-mono">{possibleCount}</span>
                </div>
                <div className="flex justify-between items-center py-2">
                  <span className="text-sm text-[#888]">Reach Goals</span>
                  <span className="font-bold text-blue-400 font-mono">{reachCount}</span>
                </div>
              </div>
            </motion.div>

            {/* Subject chart */}
            <motion.div
              initial={{ opacity: 0, x: -24 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.1 }}
              className="card p-5"
            >
              <h3 className="text-xs text-[#555] uppercase tracking-wider mb-3">Subject APS</h3>
              <APSChart subjects={profile.subjects} />
            </motion.div>

            {/* Radar chart */}
            <motion.div
              initial={{ opacity: 0, x: -24 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.15 }}
              className="card p-5"
            >
              <h3 className="text-xs text-[#555] uppercase tracking-wider mb-3">Marks Overview</h3>
              <MarkRadar subjects={profile.subjects} />
            </motion.div>

            {/* Improvement tips trigger */}
            <motion.button
              initial={{ opacity: 0, x: -24 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 }}
              onClick={() => setShowImprovement(!showImprovement)}
              className={`card p-4 w-full text-left transition-all hover:border-[#CAFF00]/30 ${showImprovement ? 'border-[#CAFF00]/20 bg-[#CAFF00]/3' : ''}`}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <TrendingUp size={16} className="text-[#CAFF00]" />
                  <span className="text-sm font-semibold text-white">Improve Your Chances</span>
                </div>
                <ArrowRight size={14} className={`text-[#555] transition-transform ${showImprovement ? 'rotate-90' : ''}`} />
              </div>
              <p className="text-xs text-[#666] mt-1.5 ml-6">
                See which subject to boost to unlock more careers
              </p>
            </motion.button>

            {/* Improvement panel */}
            {showImprovement && improvements.length > 0 && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="card p-5 space-y-4"
              >
                {improvements.map((imp, i) => (
                  <div key={i} className="p-3 rounded-xl bg-white/3 border border-white/5">
                    <div className="flex items-start gap-2 mb-2">
                      <Lightbulb size={14} className="text-[#CAFF00] mt-0.5 flex-shrink-0" />
                      <div>
                        <p className="text-xs font-semibold text-white">{imp.subject.split(' ')[0]}</p>
                        <p className="text-[10px] text-[#666]">{imp.currentMark}% → {imp.targetMark}%</p>
                      </div>
                    </div>
                    <p className="text-[10px] text-[#888]">
                      Unlocks: {imp.careersUnlocked.slice(0, 2).join(', ')}
                    </p>
                  </div>
                ))}
                {improvements.length === 0 && (
                  <p className="text-xs text-[#666]">You&apos;re already maximised for your current marks!</p>
                )}
              </motion.div>
            )}
          </div>

          {/* Main content */}
          <div>
            {/* Filters */}
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              className="flex flex-wrap gap-3 mb-6"
            >
              {/* Match filter */}
              <div className="flex gap-1.5 p-1 bg-white/3 rounded-xl border border-white/5">
                {MATCH_FILTERS.map(f => (
                  <button
                    key={f.value}
                    onClick={() => setMatchFilter(f.value)}
                    className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                      matchFilter === f.value
                        ? 'bg-[#CAFF00]/15 text-[#CAFF00]'
                        : 'text-[#666] hover:text-white'
                    }`}
                  >
                    {f.label}
                  </button>
                ))}
              </div>

              {/* Category filter */}
              <div className="flex gap-1.5 p-1 bg-white/3 rounded-xl border border-white/5 flex-wrap">
                <button
                  onClick={() => setCategoryFilter('all')}
                  className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${categoryFilter === 'all' ? 'bg-white/10 text-white' : 'text-[#666] hover:text-white'}`}
                >
                  All Fields
                </button>
                {CAREER_CATEGORIES.map(cat => (
                  <button
                    key={cat}
                    onClick={() => setCategoryFilter(cat)}
                    className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${categoryFilter === cat ? 'bg-white/10 text-white' : 'text-[#666] hover:text-white'}`}
                  >
                    {cat}
                  </button>
                ))}
              </div>
            </motion.div>

            {/* Results count */}
            <div className="flex items-center justify-between mb-5">
              <p className="text-sm text-[#666]">
                Showing <span className="text-white font-semibold">{filteredMatches.length}</span> career{filteredMatches.length !== 1 ? 's' : ''}
              </p>
              <div className="flex items-center gap-2">
                {savedCareers.length > 0 && (
                  <span className="flex items-center gap-1.5 text-xs text-[#CAFF00]">
                    <Bookmark size={12} fill="currentColor" />
                    {savedCareers.length} saved
                  </span>
                )}
                <Link href="/compare" className="btn-ghost text-xs">
                  Compare Universities →
                </Link>
              </div>
            </div>

            {/* Career grid */}
            {filteredMatches.length === 0 ? (
              <div className="card p-12 text-center">
                <AlertTriangle size={32} className="text-[#333] mx-auto mb-4" />
                <p className="text-[#666]">No careers match your current filters.</p>
                <button
                  onClick={() => { setMatchFilter('all'); setCategoryFilter('all'); }}
                  className="mt-4 btn-ghost flex items-center gap-2 mx-auto"
                >
                  <RefreshCw size={13} /> Clear filters
                </button>
              </div>
            ) : (
              <div className="grid sm:grid-cols-2 xl:grid-cols-3 gap-4">
                {filteredMatches.map((match, i) => (
                  <CareerCard
                    key={match.career.id}
                    match={match}
                    saved={savedCareers.includes(match.career.id)}
                    onToggleSave={toggleCareer}
                    index={i}
                  />
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
}
