"use client";
import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Sparkles, Loader2, GraduationCap, Building2, Clock,
  Banknote, AlertCircle, Heart, ShoppingCart, Check, ArrowRight, X, Receipt,
} from "lucide-react";
import Link from "next/link";
import { AIRecommendation } from "@/hooks/useAIRecommendations";
import { useApplicationCart, SERVICE_FEE, MAX_APPLICATIONS } from "@/hooks/useApplicationCart";
import { UNIVERSITY_FEES } from "@/data/universityFees";
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
  High: "text-[#CAFF00] bg-[#CAFF00]/10 border-[#CAFF00]/20",
  Growing: "text-emerald-400 bg-emerald-400/10 border-emerald-400/20",
  Medium: "text-amber-400 bg-amber-400/10 border-amber-400/20",
  Low: "text-red-400 bg-red-400/10 border-red-400/20",
};

function formatZAR(n: number) {
  return `R${(n / 1000).toFixed(0)}k`;
}

// KZN universities share a single CAO fee of R250
const KZN_IDS = ["ukzn", "dut", "mut", "unizulu"];

function getAppFeeForUni(universityId: string): { fee: number; isFree: boolean; note: string } {
  if (KZN_IDS.includes(universityId)) {
    return { fee: 250, isFree: false, note: "via CAO" };
  }
  const info = UNIVERSITY_FEES.find(f => f.id === universityId);
  if (!info) return { fee: 0, isFree: true, note: "FREE" };
  return {
    fee: info.applicationFee,
    isFree: info.applicationFee === 0,
    note: info.applicationFee === 0 ? "FREE" : `R${info.applicationFee}`,
  };
}

function calcCartTotal(items: { recommendation: AIRecommendation }[]): number {
  let total = SERVICE_FEE;
  let kznAdded = false;
  for (const item of items) {
    const uid = item.recommendation.universityId;
    if (KZN_IDS.includes(uid)) {
      if (!kznAdded) { kznAdded = true; total += 250; }
    } else {
      const info = UNIVERSITY_FEES.find(f => f.id === uid);
      if (info) total += info.applicationFee;
    }
  }
  return total;
}

export default function AIRecommendations({
  recommendations, loading, error, savedCareers = [], onToggleSave,
}: AIRecommendationsProps) {
  const { items, addItem, removeItem, isInCart } = useApplicationCart();
  const cartTotal = calcCartTotal(items);

  if (loading) {
    return (
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}
        className="flex flex-col items-center justify-center py-16 gap-4">
        <div className="relative">
          <div className="w-16 h-16 rounded-2xl bg-[#CAFF00]/10 border border-[#CAFF00]/20 flex items-center justify-center">
            <Sparkles size={28} className="text-[#CAFF00]" />
          </div>
          <Loader2 size={18} className="absolute -top-1 -right-1 text-[#CAFF00] animate-spin" />
        </div>
        <div className="text-center">
          <p className="text-white font-semibold">AI is searching across all SA universities…</p>
          <p className="text-[#555] text-sm mt-1">Analysing your subjects, marks and interests</p>
        </div>
        <div className="flex gap-1.5 mt-2">
          {[0, 1, 2].map(i => (
            <motion.div key={i} className="w-2 h-2 rounded-full bg-[#CAFF00]/40"
              animate={{ opacity: [0.3, 1, 0.3] }}
              transition={{ duration: 1.2, repeat: Infinity, delay: i * 0.3 }} />
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
        <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }}
          className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-2">
            <Sparkles size={16} className="text-[#CAFF00]" />
            <span className="text-sm font-semibold text-[#CAFF00]">{recommendations.length} AI-Recommended Courses</span>
            <span className="text-xs text-[#555] hidden sm:inline">— personalised for your profile</span>
          </div>
        </motion.div>

        {/* Cart banner — shows dynamic total */}
        {items.length > 0 && (
          <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }}
            className="p-4 rounded-xl border flex items-center justify-between gap-4"
            style={{ background: "rgba(202,255,0,0.05)", borderColor: "rgba(202,255,0,0.2)" }}>
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-lg flex items-center justify-center flex-shrink-0"
                style={{ background: "rgba(202,255,0,0.12)" }}>
                <Receipt size={15} className="text-[#CAFF00]" />
              </div>
              <div>
                <p className="text-sm font-bold text-white">
                  {items.length}/{MAX_APPLICATIONS} courses selected
                </p>
                <p className="text-xs text-[#888]">
                  Total: <span className="text-[#CAFF00] font-bold">R{cartTotal}</span>
                  <span className="text-[#555] ml-1">(R{SERVICE_FEE} service + app fees)</span>
                </p>
              </div>
            </div>
            <Link href="/apply"
              className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-[#CAFF00] text-black text-xs font-bold hover:bg-[#b8e600] transition-all flex-shrink-0">
              Apply Now <ArrowRight size={13} />
            </Link>
          </motion.div>
        )}

        {/* Cards */}
        {[...recommendations].sort((a, b) => b.matchScore - a.matchScore).map((rec, i) => {
          const inCart = isInCart(rec.id);
          const isSaved = savedCareers.includes(rec.id);
          const appFee = getAppFeeForUni(rec.universityId);

          return (
            <motion.div key={rec.id} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.07 }}
              className={cn("card p-5 group transition-all",
                inCart ? "border-[#CAFF00]/25" : "hover:border-white/12")}
              style={inCart ? { background: "rgba(202,255,0,0.03)" } : {}}>

              {/* Top row */}
              <div className="flex items-start gap-3 mb-3">
                <div className="w-11 h-11 rounded-xl flex items-center justify-center text-2xl flex-shrink-0"
                  style={{ background: "rgba(255,255,255,0.05)" }}>
                  {rec.emoji}
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="font-bold text-white leading-tight truncate">{rec.title}</h3>
                  <div className="flex items-center gap-1.5 mt-0.5">
                    <Building2 size={11} className="text-[#555]" />
                    <span className="text-xs text-[#666] truncate">{rec.universityName}</span>
                  </div>
                </div>
                <div className="flex items-center gap-1.5 flex-shrink-0">
                  <span className={cn("text-[10px] font-semibold px-2 py-0.5 rounded-full border",
                    demandColors[rec.demandLevel] ?? demandColors.Medium)}>
                    {rec.demandLevel}
                  </span>
                  {onToggleSave && (
                    <button onClick={() => onToggleSave(rec.id)}
                      className={cn("p-1.5 rounded-lg transition-all",
                        isSaved ? "text-[#CAFF00]" : "text-[#444] hover:text-[#CAFF00]")}>
                      <Heart size={13} fill={isSaved ? "currentColor" : "none"} />
                    </button>
                  )}
                </div>
              </div>

              {/* Description */}
              <p className="text-xs text-[#777] leading-relaxed mb-3 line-clamp-2">{rec.description}</p>

              {/* Meta row */}
              <div className="flex flex-wrap gap-2 text-xs text-[#666] mb-3">
                <span className="flex items-center gap-1"><GraduationCap size={11} /> {rec.degree}</span>
                <span className="flex items-center gap-1"><Clock size={11} /> {rec.duration}</span>
                <span className="flex items-center gap-1">
                  <Banknote size={11} />
                  <span className="text-[#CAFF00] font-semibold">
                    {formatZAR(rec.salaryRange.min)}–{formatZAR(rec.salaryRange.max)} p/a
                  </span>
                </span>
                {rec.nsfasAvailable && (
                  <span className="text-emerald-400 font-semibold">NSFAS ✓</span>
                )}
              </div>

              {/* Application fee — prominent pill */}
              <div className="flex items-center gap-2 mb-3 p-2.5 rounded-xl"
                style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.07)" }}>
                <Receipt size={12} className="text-[#555] flex-shrink-0" />
                <span className="text-xs text-[#666]">University application fee:</span>
                {appFee.isFree ? (
                  <span className="text-xs font-bold text-emerald-400 px-2 py-0.5 rounded-full"
                    style={{ background: "rgba(52,211,153,0.1)" }}>
                    FREE
                  </span>
                ) : (
                  <span className="text-xs font-bold text-amber-400 px-2 py-0.5 rounded-full"
                    style={{ background: "rgba(251,191,36,0.1)" }}>
                    R{appFee.fee} {appFee.note !== `R${appFee.fee}` ? `· ${appFee.note}` : ""}
                  </span>
                )}
              </div>

              {/* Match bar */}
              <MatchBar percentage={rec.matchScore} />
              <p className="text-[11px] text-[#555] mt-2 italic">{rec.matchReason}</p>

              {/* Subject requirements */}
              {rec.subjectRequirements.length > 0 && (
                <div className="mt-3 flex flex-wrap gap-1.5">
                  {rec.subjectRequirements.map(req => (
                    <span key={req.subject} className="text-[10px] px-2 py-0.5 rounded-md text-[#777]"
                      style={{ background: "rgba(255,255,255,0.05)" }}>
                      {req.subject} ≥{req.minimumMark}%
                    </span>
                  ))}
                </div>
              )}

              {/* Career outcomes */}
              {rec.careerOutcomes.length > 0 && (
                <div className="mt-3 pt-3" style={{ borderTop: "1px solid rgba(255,255,255,0.05)" }}>
                  <p className="text-[10px] text-[#555] uppercase tracking-wider mb-1.5">Career paths</p>
                  <div className="flex flex-wrap gap-1.5">
                    {rec.careerOutcomes.slice(0, 4).map(c => (
                      <span key={c} className="text-[10px] px-2 py-0.5 rounded-md text-[#CAFF00]/70"
                        style={{ background: "rgba(202,255,0,0.05)", border: "1px solid rgba(202,255,0,0.1)" }}>
                        {c}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* Apply button */}
              <div className="mt-4 pt-3" style={{ borderTop: "1px solid rgba(255,255,255,0.05)" }}>
                {inCart ? (
                  <div className="flex items-center gap-2">
                    <div className="flex-1 flex items-center gap-2 px-4 py-2.5 rounded-xl"
                      style={{ background: "rgba(202,255,0,0.08)", border: "1px solid rgba(202,255,0,0.2)" }}>
                      <Check size={13} className="text-[#CAFF00]" />
                      <span className="text-xs font-semibold text-[#CAFF00]">Added to application</span>
                      {!appFee.isFree && (
                        <span className="ml-auto text-[10px] text-amber-400 font-bold">+R{appFee.fee}</span>
                      )}
                    </div>
                    <button onClick={() => removeItem(rec.id)}
                      className="p-2.5 rounded-xl text-[#555] hover:text-red-400 transition-all"
                      style={{ background: "rgba(255,255,255,0.04)" }}
                      title="Remove">
                      <X size={13} />
                    </button>
                  </div>
                ) : (
                  <button onClick={() => addItem(rec)} disabled={cartFull}
                    className={cn("w-full flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl text-xs font-semibold transition-all",
                      cartFull ? "cursor-not-allowed" : "")}
                    style={cartFull
                      ? { background: "rgba(255,255,255,0.03)", color: "#444", border: "1px solid rgba(255,255,255,0.05)" }
                      : { background: "rgba(255,255,255,0.05)", color: "#999", border: "1px solid rgba(255,255,255,0.08)" }
                    }
                    onMouseEnter={e => { if (!cartFull) { (e.currentTarget as HTMLButtonElement).style.background = "rgba(202,255,0,0.08)"; (e.currentTarget as HTMLButtonElement).style.color = "#CAFF00"; (e.currentTarget as HTMLButtonElement).style.borderColor = "rgba(202,255,0,0.2)"; } }}
                    onMouseLeave={e => { if (!cartFull) { (e.currentTarget as HTMLButtonElement).style.background = "rgba(255,255,255,0.05)"; (e.currentTarget as HTMLButtonElement).style.color = "#999"; (e.currentTarget as HTMLButtonElement).style.borderColor = "rgba(255,255,255,0.08)"; } }}
                  >
                    <ShoppingCart size={13} />
                    {cartFull
                      ? `Cart full (${MAX_APPLICATIONS} max)`
                      : appFee.isFree
                        ? "Add to Application (no app fee)"
                        : `Add to Application (+R${appFee.fee} app fee)`
                    }
                  </button>
                )}
              </div>
            </motion.div>
          );
        })}

        {/* Sticky bottom CTA with dynamic total */}
        {items.length > 0 && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="sticky bottom-4 pt-2">
            <Link href="/apply"
              className="flex items-center justify-between w-full px-6 py-4 rounded-2xl bg-[#CAFF00] text-black font-bold hover:bg-[#b8e600] transition-all"
              style={{ boxShadow: "0 8px 32px rgba(202,255,0,0.25)" }}>
              <div className="flex items-center gap-3">
                <ShoppingCart size={18} />
                <div className="text-left">
                  <p className="text-sm font-bold">Apply Now ({items.length}/{MAX_APPLICATIONS} courses)</p>
                  <p className="text-xs font-medium opacity-70">Total: R{cartTotal} incl. all fees</p>
                </div>
              </div>
              <div className="text-right">
                <p className="text-lg font-bold">R{cartTotal}</p>
                <ArrowRight size={16} className="ml-auto" />
              </div>
            </Link>
          </motion.div>
        )}
      </div>
    </AnimatePresence>
  );
}
