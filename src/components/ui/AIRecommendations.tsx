"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
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
  ShoppingCart,
  Check,
  ArrowRight,
  X,
} from "lucide-react";
import Link from "next/link";
import { AIRecommendation } from "@/hooks/useAIRecommendations";
import {
  useApplicationCart,
  SERVICE_FEE,
  MAX_APPLICATIONS,
} from "@/hooks/useApplicationCart";
import MatchBar from "./MatchBar";
import { cn } from "@/utils/cn";

interface AIRecommendationsProps {
  recommendations: AIRecommendation[];
  loading: boolean;
  error: string | null;
  savedCareers?: string[];
  onToggleSave?: (id: string) => void;
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

export default function AIRecommendations({
  recommendations,
  loading,
  error,
  savedCareers = [],
  onToggleSave,
}: AIRecommendationsProps) {
  const { items, addItem, removeItem, isInCart } = useApplicationCart();

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

  const cartFull = items.length >= MAX_APPLICATIONS;

  return (
    <AnimatePresence>
      <div className="space-y-4">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-center justify-between mb-2"
        >
          <div className="flex items-center gap-2">
            <Sparkles size={16} className="text-[#CAFF00]" />
            <span className="text-sm font-semibold text-[#CAFF00]">
              {recommendations.length} AI-Recommended Courses
            </span>
            <span className="text-xs text-[#555] hidden sm:inline">
              — personalised for your profile
            </span>
          </div>
        </motion.div>

        {/* Cart banner — shown when items are in cart */}
        {items.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="p-4 rounded-xl bg-[#CAFF00]/8 border border-[#CAFF00]/25 flex items-center justify-between gap-4"
          >
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-[#CAFF00]/15 flex items-center justify-center">
                <ShoppingCart size={15} className="text-[#CAFF00]" />
              </div>
              <div>
                <p className="text-sm font-bold text-white">
                  {items.length}/{MAX_APPLICATIONS} applications selected
                </p>
                <p className="text-xs text-[#666]">
                  Service fee: R{SERVICE_FEE} total (flat rate)
                </p>
              </div>
            </div>
            <Link
              href="/apply"
              className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-[#CAFF00] text-black text-xs font-bold hover:bg-[#b8e600] transition-all flex-shrink-0"
            >
              Apply Now
              <ArrowRight size={13} />
            </Link>
          </motion.div>
        )}

        {/* Cards */}
        {recommendations
          .sort((a, b) => b.matchScore - a.matchScore)
          .map((rec, i) => {
            const inCart = isInCart(rec.id);
            const isSaved = savedCareers.includes(rec.id);

            return (
              <motion.div
                key={rec.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.07 }}
                className={cn(
                  "card p-5 group transition-colors",
                  inCart
                    ? "border-[#CAFF00]/25 bg-[#CAFF00]/3"
                    : "hover:border-[#CAFF00]/15",
                )}
              >
                {/* Top row */}
                <div className="flex items-start gap-3 mb-3">
                  <div className="w-11 h-11 rounded-xl bg-white/5 flex items-center justify-center text-2xl flex-shrink-0">
                    {rec.emoji}
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="font-bold text-white leading-tight truncate">
                      {rec.title}
                    </h3>
                    <div className="flex items-center gap-1.5 mt-0.5">
                      <Building2 size={11} className="text-[#555]" />
                      <span className="text-xs text-[#666] truncate">
                        {rec.universityName}
                      </span>
                    </div>
                  </div>
                  <div className="flex items-center gap-1.5 flex-shrink-0">
                    <span
                      className={cn(
                        "text-[10px] font-semibold px-2 py-0.5 rounded-full",
                        demandColors[rec.demandLevel] ?? demandColors.Medium,
                      )}
                    >
                      {rec.demandLevel}
                    </span>
                    {onToggleSave && (
                      <button
                        onClick={() => onToggleSave(rec.id)}
                        className={cn(
                          "p-1.5 rounded-lg transition-all",
                          isSaved
                            ? "text-[#CAFF00] bg-[#CAFF00]/10"
                            : "text-[#444] hover:text-[#CAFF00] hover:bg-[#CAFF00]/5",
                        )}
                      >
                        <Heart
                          size={13}
                          fill={isSaved ? "currentColor" : "none"}
                        />
                      </button>
                    )}
                  </div>
                </div>

                {/* Description */}
                <p className="text-xs text-[#777] leading-relaxed mb-3 line-clamp-2">
                  {rec.description}
                </p>

                {/* Meta row */}
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

                {/* ── Apply button ── */}
                <div className="mt-4 pt-3 border-t border-white/5">
                  {inCart ? (
                    <div className="flex items-center gap-2">
                      <div className="flex-1 flex items-center gap-2 px-4 py-2.5 rounded-xl bg-[#CAFF00]/10 border border-[#CAFF00]/20">
                        <Check size={13} className="text-[#CAFF00]" />
                        <span className="text-xs font-semibold text-[#CAFF00]">
                          Added to application
                        </span>
                      </div>
                      <button
                        onClick={() => removeItem(rec.id)}
                        className="p-2.5 rounded-xl bg-white/5 text-[#555] hover:text-red-400 hover:bg-red-400/10 transition-all"
                        title="Remove from cart"
                      >
                        <X size={13} />
                      </button>
                    </div>
                  ) : (
                    <button
                      onClick={() => addItem(rec)}
                      disabled={cartFull}
                      className={cn(
                        "w-full flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl text-xs font-semibold transition-all",
                        cartFull
                          ? "bg-white/3 text-[#444] border border-white/5 cursor-not-allowed"
                          : "bg-white/5 text-[#999] border border-white/8 hover:bg-[#CAFF00]/10 hover:text-[#CAFF00] hover:border-[#CAFF00]/20",
                      )}
                    >
                      <ShoppingCart size={13} />
                      {cartFull
                        ? `Cart full (${MAX_APPLICATIONS} max)`
                        : "Add to Application"}
                    </button>
                  )}
                </div>
              </motion.div>
            );
          })}

        {/* Bottom CTA when cart has items */}
        {items.length > 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="sticky bottom-4 pt-2"
          >
            <Link
              href="/apply"
              className="flex items-center justify-between w-full px-6 py-4 rounded-2xl bg-[#CAFF00] text-black font-bold hover:bg-[#b8e600] transition-all shadow-lg shadow-[#CAFF00]/20"
            >
              <div className="flex items-center gap-3">
                <ShoppingCart size={18} />
                <div className="text-left">
                  <p className="text-sm font-bold">
                    Proceed to Apply ({items.length}/{MAX_APPLICATIONS})
                  </p>
                  <p className="text-xs font-medium opacity-70">
                    R{SERVICE_FEE} service fee · flat rate
                  </p>
                </div>
              </div>
              <ArrowRight size={20} />
            </Link>
          </motion.div>
        )}
      </div>
    </AnimatePresence>
  );
}
