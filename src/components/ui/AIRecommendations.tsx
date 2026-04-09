"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Sparkles,
  Loader2,
  GraduationCap,
  Building2,
  Clock,
  Banknote,
  AlertCircle,
  Heart,
  ChevronDown,
  ChevronUp,
  BookOpen,
  Briefcase,
  CalendarDays,
  Phone,
} from "lucide-react";
import { AIRecommendation } from "@/hooks/useAIRecommendations";
import { useCourseDetails } from "@/hooks/useAIRecommendations";
import MatchBar from "./MatchBar";
import { cn } from "@/utils/cn";

interface AIRecommendationsProps {
  recommendations: AIRecommendation[];
  loading: boolean;
  error: string | null;
  savedCareers: string[];
  onToggleSave: (id: string) => void;
}

const demandColors: Record<string, string> = {
  High: "text-[#CAFF00] bg-[#CAFF00]/10",
  Growing: "text-emerald-400 bg-emerald-400/10",
  Medium: "text-amber-400 bg-amber-400/10",
  Low: "text-red-400 bg-red-400/10",
};

function formatZAR(n: number) {
  return `R${(n / 1000).toFixed(0)}k`;
}

// ── Expandable course detail panel ───────────────────────────────────────────

function CourseDetailPanel({
  courseId,
  courseTitle,
  universityName,
}: {
  courseId: string;
  courseTitle: string;
  universityName: string;
}) {
  const { details, loading, error, fetchDetails } = useCourseDetails();
  const [open, setOpen] = useState(false);

  const detail = details[courseId];
  const isLoading = loading[courseId];
  const detailError = error[courseId];

  const handleToggle = () => {
    if (!open && !detail) {
      fetchDetails(courseId, courseTitle, universityName);
    }
    setOpen((prev) => !prev);
  };

  return (
    <div className="mt-3 border-t border-white/5 pt-3">
      <button
        onClick={handleToggle}
        className="flex items-center gap-2 text-xs font-semibold text-[#CAFF00] hover:text-white transition-colors"
      >
        <BookOpen size={13} />
        {open ? "Hide details" : "Read more about this course"}
        {open ? <ChevronUp size={13} /> : <ChevronDown size={13} />}
      </button>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="overflow-hidden"
          >
            <div className="mt-3 space-y-3">
              {/* Loading */}
              {isLoading && (
                <div className="flex items-center gap-2 text-xs text-[#555]">
                  <Loader2 size={13} className="animate-spin text-[#CAFF00]" />
                  AI is gathering course details…
                </div>
              )}

              {/* Error */}
              {detailError && (
                <div className="flex items-center gap-2 text-xs text-red-400 p-2 rounded-lg bg-red-500/10">
                  <AlertCircle size={13} />
                  {detailError}
                </div>
              )}

              {/* Detail content */}
              {detail && (
                <div className="space-y-3 text-xs">
                  {/* Overview */}
                  {detail.overview && (
                    <p className="text-[#888] leading-relaxed">
                      {detail.overview}
                    </p>
                  )}

                  {/* Modules */}
                  {detail.modules?.length > 0 && (
                    <div>
                      <p className="text-[10px] text-[#555] uppercase tracking-wider mb-1.5">
                        Key modules
                      </p>
                      <div className="flex flex-wrap gap-1.5">
                        {detail.modules.map((m) => (
                          <span
                            key={m}
                            className="text-[10px] px-2 py-0.5 rounded-md bg-white/5 text-[#777]"
                          >
                            {m}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Career outcomes */}
                  {detail.careerOutcomes?.length > 0 && (
                    <div>
                      <p className="text-[10px] text-[#555] uppercase tracking-wider mb-1.5 flex items-center gap-1">
                        <Briefcase size={10} /> Career paths
                      </p>
                      <div className="flex flex-wrap gap-1.5">
                        {detail.careerOutcomes.map((c) => (
                          <span
                            key={c}
                            className="text-[10px] px-2 py-0.5 rounded-md bg-[#CAFF00]/5 text-[#CAFF00]/70 border border-[#CAFF00]/10"
                          >
                            {c}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Salary */}
                  {detail.salaryRange && (
                    <p className="flex items-center gap-1 text-[#CAFF00] font-semibold">
                      <Banknote size={12} />
                      {formatZAR(detail.salaryRange.min)}–
                      {formatZAR(detail.salaryRange.max)} p/a
                    </p>
                  )}

                  {/* Admission */}
                  {detail.admissionProcess && (
                    <div className="p-2.5 rounded-lg bg-white/3 border border-white/5">
                      <p className="text-[10px] text-[#555] uppercase tracking-wider mb-1">
                        How to apply
                      </p>
                      <p className="text-[#888] leading-relaxed">
                        {detail.admissionProcess}
                      </p>
                    </div>
                  )}

                  {/* Deadline + contact */}
                  <div className="flex flex-wrap gap-3 text-[#666]">
                    {detail.applicationDeadline && (
                      <span className="flex items-center gap-1">
                        <CalendarDays size={11} />
                        Apply by: {detail.applicationDeadline}
                      </span>
                    )}
                    {detail.contactInfo && (
                      <span className="flex items-center gap-1">
                        <Phone size={11} />
                        {detail.contactInfo}
                      </span>
                    )}
                  </div>

                  {/* NSFAS */}
                  {detail.nsfasAvailable && (
                    <span className="inline-block text-[10px] text-emerald-400 font-semibold">
                      NSFAS Available ✓
                    </span>
                  )}
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

// ── Main component ────────────────────────────────────────────────────────────

export default function AIRecommendations({
  recommendations,
  loading,
  error,
  savedCareers,
  onToggleSave,
}: AIRecommendationsProps) {
  if (loading) {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="flex flex-col items-center justify-center py-16 gap-4"
      >
        <div className="relative">
          <div className="w-16 h-16 rounded-2xl bg-[#CAFF00]/10 border border-[#CAFF00]/20 flex items-center justify-center">
            <Sparkles size={28} className="text-[#CAFF00]" />
          </div>
          <Loader2
            size={18}
            className="absolute -top-1 -right-1 text-[#CAFF00] animate-spin"
          />
        </div>
        <div className="text-center">
          <p className="text-white font-semibold">
            AI is searching across all SA universities…
          </p>
          <p className="text-[#555] text-sm mt-1">
            Analysing your subjects, marks and interests
          </p>
        </div>
        <div className="flex gap-1.5 mt-2">
          {[0, 1, 2].map((i) => (
            <motion.div
              key={i}
              className="w-2 h-2 rounded-full bg-[#CAFF00]/40"
              animate={{ opacity: [0.3, 1, 0.3] }}
              transition={{ duration: 1.2, repeat: Infinity, delay: i * 0.3 }}
            />
          ))}
        </div>
      </motion.div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center gap-3 p-4 rounded-xl bg-red-500/10 border border-red-500/20">
        <AlertCircle size={18} className="text-red-400 flex-shrink-0" />
        <p className="text-sm text-red-400">{error}</p>
      </div>
    );
  }

  if (!recommendations.length) return null;

  return (
    <AnimatePresence>
      <div className="grid sm:grid-cols-2 xl:grid-cols-3 gap-4">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="col-span-full flex items-center gap-2 mb-2"
        >
          <Sparkles size={16} className="text-[#CAFF00]" />
          <span className="text-sm font-semibold text-[#CAFF00]">
            {recommendations.length} AI-Recommended Courses
          </span>
          <span className="text-xs text-[#555]">
            — personalised for your profile
          </span>
        </motion.div>

        {/* Cards */}
        {recommendations
          .sort((a, b) => b.matchScore - a.matchScore)
          .map((rec, i) => {
            const isSaved = savedCareers.includes(rec.id);
            return (
              <motion.div
                key={rec.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.07 }}
                className="card p-5 group hover:border-[#CAFF00]/15 transition-colors flex flex-col"
              >
                {/* Top row */}
                <div className="flex items-start gap-3 mb-3">
                  <div className="w-11 h-11 rounded-xl bg-white/5 flex items-center justify-center text-2xl flex-shrink-0">
                    {rec.emoji}
                  </div>
                  <div className="flex-1 min-w-0">
                    {/* ── Full title, no truncation ── */}
                    <h3 className="font-bold text-white leading-tight">
                      {rec.title}
                    </h3>
                    <div className="flex items-center gap-1.5 mt-0.5">
                      <Building2
                        size={11}
                        className="text-[#555] flex-shrink-0"
                      />
                      <span className="text-xs text-[#666]">
                        {rec.universityName}
                      </span>
                    </div>
                  </div>

                  {/* Demand badge */}
                  <span
                    className={cn(
                      "text-[10px] font-semibold px-2 py-0.5 rounded-full flex-shrink-0",
                      demandColors[rec.demandLevel] ?? demandColors.Medium,
                    )}
                  >
                    {rec.demandLevel}
                  </span>

                  {/* Bookmark */}
                  <button
                    onClick={(e) => {
                      e.preventDefault();
                      onToggleSave(rec.id);
                    }}
                    className={cn(
                      "p-2 rounded-lg transition-all flex-shrink-0",
                      isSaved
                        ? "bg-[#CAFF00]/10 text-[#CAFF00]"
                        : "bg-white/5 text-[#555] hover:text-[#CAFF00] hover:bg-[#CAFF00]/5",
                    )}
                  >
                    <Heart size={15} fill={isSaved ? "currentColor" : "none"} />
                  </button>
                </div>

                {/* Description */}
                <p className="text-xs text-[#777] leading-relaxed mb-3 line-clamp-2">
                  {rec.description}
                </p>

                {/* Meta */}
                <div className="flex flex-wrap gap-3 text-xs text-[#666] mb-3">
                  <span className="flex items-center gap-1">
                    <GraduationCap size={11} /> {rec.degree}
                  </span>
                  <span className="flex items-center gap-1">
                    <Clock size={11} /> {rec.duration}
                  </span>
                  <span className="flex items-center gap-1">
                    <Banknote size={11} />
                    <span className="text-[#CAFF00] font-semibold">
                      {formatZAR(rec.salaryRange.min)}–
                      {formatZAR(rec.salaryRange.max)} p/a
                    </span>
                  </span>
                  {rec.nsfasAvailable && (
                    <span className="text-emerald-400 font-semibold">
                      NSFAS ✓
                    </span>
                  )}
                </div>

                {/* Match bar */}
                <MatchBar percentage={rec.matchScore} />

                {/* Match reason */}
                <p className="text-[11px] text-[#555] mt-2 italic">
                  {rec.matchReason}
                </p>

                {/* Subject requirements */}
                {rec.subjectRequirements.length > 0 && (
                  <div className="mt-3 flex flex-wrap gap-1.5">
                    {rec.subjectRequirements.map((req) => (
                      <span
                        key={req.subject}
                        className="text-[10px] px-2 py-0.5 rounded-md bg-white/5 text-[#777]"
                      >
                        {req.subject} ≥{req.minimumMark}%
                      </span>
                    ))}
                  </div>
                )}

                {/* Career outcomes */}
                {rec.careerOutcomes.length > 0 && (
                  <div className="mt-3 pt-3 border-t border-white/5">
                    <p className="text-[10px] text-[#555] uppercase tracking-wider mb-1.5">
                      Career paths
                    </p>
                    <div className="flex flex-wrap gap-1.5">
                      {rec.careerOutcomes.slice(0, 4).map((c) => (
                        <span
                          key={c}
                          className="text-[10px] px-2 py-0.5 rounded-md bg-[#CAFF00]/5 text-[#CAFF00]/70 border border-[#CAFF00]/10"
                        >
                          {c}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                {/* ── Read More (AI course details) ── */}
                <CourseDetailPanel
                  courseId={rec.id}
                  courseTitle={rec.title}
                  universityName={rec.universityName}
                />
              </motion.div>
            );
          })}
      </div>
    </AnimatePresence>
  );
}
