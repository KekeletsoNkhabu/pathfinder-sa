"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { motion } from "framer-motion";
import {
  ArrowLeft,
  Lightbulb,
  ArrowRight,
  TrendingUp,
  RefreshCw,
  Bookmark,
} from "lucide-react";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import APSRing from "@/components/ui/APSRing";
import APSChart from "@/components/charts/APSChart";
import MarkRadar from "@/components/charts/MarkRadar";
import AIRecommendations from "@/components/ui/AIRecommendations";
import { useAppState } from "@/hooks/useAppState";
import { useAIRecommendations } from "@/hooks/useAIRecommendations";
import { getImprovementSuggestions } from "@/utils/aps";

export default function ResultsPage() {
  const router = useRouter();
  const { profile, savedCareers, toggleCareer, hydrated } = useAppState();
  const {
    recommendations,
    loading: aiLoading,
    error: aiError,
    getRecommendations,
  } = useAIRecommendations();

  const [showImprovement, setShowImprovement] = useState(false);
  const [aiTriggered, setAiTriggered] = useState(false);

  useEffect(() => {
    if (hydrated && !profile) {
      router.push("/dashboard");
    }
  }, [hydrated, profile, router]);

  // Auto-trigger AI on load
  useEffect(() => {
    if (!aiTriggered && profile && hydrated) {
      setAiTriggered(true);
      const subjectsWithMarks = profile.subjects.map((s) => ({
        name: s.name,
        mark: s.mark,
      }));
      getRecommendations(
        subjectsWithMarks,
        profile.totalAPS,
        profile.interests ?? [],
      );
    }
  }, [aiTriggered, profile, hydrated, getRecommendations]);

  if (!hydrated || !profile) {
    return (
      <div className="min-h-screen bg-[#0a0a0a] flex items-center justify-center">
        <div className="text-[#555] animate-pulse">Loading…</div>
      </div>
    );
  }

  const improvements = getImprovementSuggestions(profile);

  return (
    <div className="min-h-screen bg-[#0a0a0a] grid-bg">
      <Navbar />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 pt-28 pb-20">
        {/* Back */}
        <Link
          href="/dashboard"
          className="inline-flex items-center gap-2 text-sm text-[#666] hover:text-[#CAFF00] transition-colors mb-8"
        >
          <ArrowLeft size={15} /> Back to Profile
        </Link>

        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-10"
        >
          <h1 className="font-display text-4xl font-bold text-white mb-2">
            Your Results,{" "}
            <span className="text-[#CAFF00]">{profile.name.split(" ")[0]}</span>
          </h1>
          <p className="text-[#666]">
            Based on your {profile.subjects.length} subjects — here's what you
            qualify for
          </p>
        </motion.div>

        <div className="grid lg:grid-cols-[280px_1fr] gap-6">
          {/* ── Left sidebar ── */}
          <div className="space-y-4">
            <motion.div
              initial={{ opacity: 0, x: -24 }}
              animate={{ opacity: 1, x: 0 }}
              className="card p-6"
            >
              <h3 className="text-xs text-[#555] uppercase tracking-wider mb-5">
                Your APS Score
              </h3>
              <div className="flex justify-center mb-5">
                <APSRing score={profile.totalAPS} size={140} />
              </div>
              <div className="space-y-2.5">
                <div className="flex justify-between items-center py-2 border-b border-white/4">
                  <span className="text-sm text-[#888]">
                    AI Recommendations
                  </span>
                  <span className="font-bold text-[#CAFF00] font-mono">
                    {recommendations.length > 0 ? recommendations.length : "—"}
                  </span>
                </div>
                <div className="flex justify-between items-center py-2">
                  <span className="text-sm text-[#888]">Saved Courses</span>
                  <span className="font-bold text-orange-400 font-mono">
                    {savedCareers.length}
                  </span>
                </div>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: -24 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.1 }}
              className="card p-5"
            >
              <h3 className="text-xs text-[#555] uppercase tracking-wider mb-3">
                Subject APS
              </h3>
              <APSChart subjects={profile.subjects} />
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: -24 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.15 }}
              className="card p-5"
            >
              <h3 className="text-xs text-[#555] uppercase tracking-wider mb-3">
                Marks Overview
              </h3>
              <MarkRadar subjects={profile.subjects} />
            </motion.div>

            <motion.button
              initial={{ opacity: 0, x: -24 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 }}
              onClick={() => setShowImprovement(!showImprovement)}
              className={`card p-4 w-full text-left transition-all hover:border-[#CAFF00]/30 ${showImprovement ? "border-[#CAFF00]/20 bg-[#CAFF00]/3" : ""}`}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <TrendingUp size={16} className="text-[#CAFF00]" />
                  <span className="text-sm font-semibold text-white">
                    Improve Your Chances
                  </span>
                </div>
                <ArrowRight
                  size={14}
                  className={`text-[#555] transition-transform ${showImprovement ? "rotate-90" : ""}`}
                />
              </div>
              <p className="text-xs text-[#666] mt-1.5 ml-6">
                See which subject to boost to unlock more careers
              </p>
            </motion.button>

            {showImprovement && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="card p-5 space-y-4"
              >
                {improvements.length > 0 ? (
                  improvements.map((imp, i) => (
                    <div
                      key={i}
                      className="p-3 rounded-xl bg-white/3 border border-white/5"
                    >
                      <div className="flex items-start gap-2 mb-2">
                        <Lightbulb
                          size={14}
                          className="text-[#CAFF00] mt-0.5 flex-shrink-0"
                        />
                        <div>
                          <p className="text-xs font-semibold text-white">
                            {imp.subject.split(" ")[0]}
                          </p>
                          <p className="text-[10px] text-[#666]">
                            {imp.currentMark}% → {imp.targetMark}%
                          </p>
                        </div>
                      </div>
                      <p className="text-[10px] text-[#888]">
                        Unlocks: {imp.careersUnlocked.slice(0, 2).join(", ")}
                      </p>
                    </div>
                  ))
                ) : (
                  <p className="text-xs text-[#666]">
                    You&apos;re already maximised for your current marks!
                  </p>
                )}
              </motion.div>
            )}
          </div>

          {/* ── Main content ── */}
          <div>
            {/* Top bar */}
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              className="flex items-center justify-between mb-6"
            >
              <p className="text-sm text-[#666]">
                AI-searched across{" "}
                <span className="text-white font-semibold">
                  all 26 SA universities
                </span>
              </p>
              <div className="flex items-center gap-3">
                {savedCareers.length > 0 && (
                  <span className="flex items-center gap-1.5 text-xs text-[#CAFF00]">
                    <Bookmark size={12} fill="currentColor" />
                    {savedCareers.length} saved
                  </span>
                )}
                {aiTriggered && !aiLoading && (
                  <button
                    onClick={() => {
                      const subjectsWithMarks = profile.subjects.map((s) => ({
                        name: s.name,
                        mark: s.mark,
                      }));
                      getRecommendations(
                        subjectsWithMarks,
                        profile.totalAPS,
                        profile.interests ?? [],
                      );
                    }}
                    className="btn-ghost text-xs flex items-center gap-1.5"
                  >
                    <RefreshCw size={12} /> Refresh
                  </button>
                )}
              </div>
            </motion.div>

            <AIRecommendations
              recommendations={recommendations}
              loading={aiLoading}
              error={aiError}
              savedCareers={savedCareers}
              onToggleSave={toggleCareer}
            />
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
}
