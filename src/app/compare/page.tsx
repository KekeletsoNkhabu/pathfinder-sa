'use client';
import { useState } from 'react';
import { motion } from 'framer-motion';
import {
  ArrowLeft, GitCompare, MapPin, Star, Check, X,
  ShieldCheck, ChevronDown, Search, University as UniversityIcon
} from 'lucide-react';
import Link from 'next/link';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import UniversityCard from '@/components/ui/UniversityCard';
import AdmissionBadge from '@/components/ui/AdmissionBadge';
import { useAppState } from '@/hooks/useAppState';
import { UNIVERSITIES } from '@/data/universities';
import { CAREERS } from '@/data/careers';
import { getAdmissionLikelihood } from '@/utils/aps';
import { University } from '@/types';
import { cn } from '@/utils/cn';

export default function ComparePage() {
  const { profile, savedUniversities, compareList, toggleUniversity, toggleCompare } = useAppState();
  const [search, setSearch] = useState('');
  const [filterProvince, setFilterProvince] = useState('all');
  const [selectedCareer, setSelectedCareer] = useState('');

  const provinces = ['all', ...Array.from(new Set(UNIVERSITIES.map(u => u.province))).sort()];

  const filtered = UNIVERSITIES.filter(u => {
    const matchSearch = u.name.toLowerCase().includes(search.toLowerCase()) ||
      u.shortName.toLowerCase().includes(search.toLowerCase());
    const matchProv = filterProvince === 'all' || u.province === filterProvince;
    return matchSearch && matchProv;
  });

  const compareUniversities = compareList
    .map(id => UNIVERSITIES.find(u => u.id === id))
    .filter(Boolean) as University[];

  // Comparison table rows
  const compareRows = [
    { label: 'Location', key: (u: University) => u.location },
    { label: 'Province', key: (u: University) => u.province },
    { label: 'Type', key: (u: University) => u.type },
    { label: 'SA Ranking', key: (u: University) => `#${u.ranking}` },
    { label: 'Overall Rating', key: (u: University) => `${u.overallRating}/10` },
    { label: 'Min APS', key: (u: University) => String(u.minAPS) },
    { label: 'NSFAS Available', key: (u: University) => u.nsfasAvailable ? 'Yes' : 'No', isBoolean: true },
  ];

  return (
    <div className="min-h-screen bg-[#0a0a0a] grid-bg">
      <Navbar />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 pt-28 pb-20">
        {/* Back */}
        <Link href="/results" className="inline-flex items-center gap-2 text-sm text-[#666] hover:text-[#CAFF00] transition-colors mb-8">
          <ArrowLeft size={15} /> Back to Results
        </Link>

        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-10"
        >
          <h1 className="font-display text-4xl font-bold text-white mb-2">
            Compare Universities
          </h1>
          <p className="text-[#666]">Select up to 3 universities to compare side-by-side</p>
        </motion.div>

        {/* Comparison panel */}
        {compareUniversities.length >= 2 && (
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            className="card mb-10 overflow-hidden"
          >
            <div className="p-5 border-b border-white/5 flex items-center justify-between">
              <h2 className="font-display text-xl font-bold text-white flex items-center gap-2">
                <GitCompare size={18} className="text-[#CAFF00]" />
                Comparison Table
              </h2>
              {/* Career filter for comparison */}
              <select
                value={selectedCareer}
                onChange={e => setSelectedCareer(e.target.value)}
                className="input-field w-auto text-sm py-1.5 px-3"
              >
                <option value="">General comparison</option>
                {CAREERS.map(c => <option key={c.id} value={c.id}>{c.title}</option>)}
              </select>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-white/5">
                    <th className="text-left p-4 text-xs text-[#555] uppercase tracking-wider w-36">Feature</th>
                    {compareUniversities.map(u => (
                      <th key={u.id} className="p-4 text-center min-w-[160px]">
                        <div className="flex flex-col items-center gap-1">
                          <div className="w-8 h-1 rounded-full mb-2" style={{ backgroundColor: u.color }} />
                          <span className="font-display font-bold text-white text-sm">{u.shortName}</span>
                          <div className="flex items-center gap-1">
                            <Star size={10} className="text-[#CAFF00] fill-[#CAFF00]" />
                            <span className="text-xs text-[#CAFF00]">{u.overallRating}</span>
                          </div>
                        </div>
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {compareRows.map((row, i) => (
                    <tr key={row.label} className={cn('border-b border-white/3', i % 2 === 0 ? 'bg-white/[0.01]' : '')}>
                      <td className="p-4 text-xs text-[#666]">{row.label}</td>
                      {compareUniversities.map(u => {
                        const val = row.key(u);
                        const isYes = val === 'Yes';
                        const isNo = val === 'No';
                        return (
                          <td key={u.id} className="p-4 text-center">
                            {row.isBoolean ? (
                              isYes
                                ? <span className="inline-flex items-center gap-1 badge badge-green text-[10px]"><Check size={9} />Yes</span>
                                : <span className="inline-flex items-center gap-1 badge badge-red text-[10px]"><X size={9} />No</span>
                            ) : (
                              <span className="text-sm text-white font-medium">{val}</span>
                            )}
                          </td>
                        );
                      })}
                    </tr>
                  ))}

                  {/* Can I get in? */}
                  {profile && (
                    <tr className="border-b border-white/3">
                      <td className="p-4 text-xs text-[#666]">Can I Get In?</td>
                      {compareUniversities.map(u => {
                        let minAPS = u.minAPS;
                        if (selectedCareer) {
                          const prog = u.programs.find(p => p.careerId === selectedCareer);
                          if (prog) minAPS = prog.minAPS;
                        }
                        const likelihood = getAdmissionLikelihood(profile.totalAPS, minAPS);
                        return (
                          <td key={u.id} className="p-4 text-center">
                            <div className="flex justify-center">
                              <AdmissionBadge likelihood={likelihood} size="sm" />
                            </div>
                          </td>
                        );
                      })}
                    </tr>
                  )}

                  {/* Strengths */}
                  <tr>
                    <td className="p-4 text-xs text-[#666] align-top pt-5">Strengths</td>
                    {compareUniversities.map(u => (
                      <td key={u.id} className="p-4 align-top">
                        <div className="flex flex-col gap-1">
                          {u.strengths.slice(0, 4).map(s => (
                            <span key={s} className="text-[10px] text-[#777] flex items-center gap-1">
                              <span className="w-1 h-1 rounded-full bg-[#CAFF00] flex-shrink-0" />
                              {s}
                            </span>
                          ))}
                        </div>
                      </td>
                    ))}
                  </tr>
                </tbody>
              </table>
            </div>

            {/* Tags per university */}
            <div className="p-5 border-t border-white/5 grid gap-4" style={{ gridTemplateColumns: `auto repeat(${compareUniversities.length}, 1fr)` }}>
              <span className="text-xs text-[#555]">Tags</span>
              {compareUniversities.map(u => (
                <div key={u.id} className="flex flex-wrap gap-1.5">
                  {u.tags.map(tag => (
                    <span key={tag} className="text-[10px] px-2 py-1 rounded-md bg-white/4 text-[#777] border border-white/5">{tag}</span>
                  ))}
                </div>
              ))}
            </div>
          </motion.div>
        )}

        {/* Prompt if no compare selected */}
        {compareUniversities.length < 2 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="card-lime p-6 mb-8 flex items-center gap-4"
          >
            <GitCompare size={24} className="text-[#CAFF00] flex-shrink-0" />
            <div>
              <p className="font-semibold text-white">Select 2–3 universities below</p>
              <p className="text-sm text-[#777]">
                {compareList.length === 0
                  ? 'Click "Compare" on any university card to start comparing'
                  : `${compareList.length} selected — add ${2 - compareList.length} more to compare`}
              </p>
            </div>
          </motion.div>
        )}

        {/* Filters */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="flex flex-col sm:flex-row gap-3 mb-6"
        >
          <div className="relative flex-1">
            <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-[#555]" />
            <input
              type="text"
              placeholder="Search universities…"
              value={search}
              onChange={e => setSearch(e.target.value)}
              className="input-field pl-9"
            />
          </div>
          <select
            value={filterProvince}
            onChange={e => setFilterProvince(e.target.value)}
            className="input-field w-full sm:w-auto text-sm"
          >
            {provinces.map(p => (
              <option key={p} value={p}>{p === 'all' ? 'All Provinces' : p}</option>
            ))}
          </select>
        </motion.div>

        {/* University grid */}
        <div className="grid sm:grid-cols-2 xl:grid-cols-3 gap-4">
          {filtered.map((uni, i) => (
            <UniversityCard
              key={uni.id}
              university={uni}
              saved={savedUniversities.includes(uni.id)}
              inCompare={compareList.includes(uni.id)}
              onToggleSave={toggleUniversity}
              onToggleCompare={toggleCompare}
              studentAPS={profile?.totalAPS}
              index={i}
            />
          ))}
        </div>

        {filtered.length === 0 && (
          <div className="text-center py-20 text-[#555]">
            No universities match your search.
          </div>
        )}
      </div>

      <Footer />
    </div>
  );
}
