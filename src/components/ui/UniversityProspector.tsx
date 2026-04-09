"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Search,
  Loader2,
  GraduationCap,
  Clock,
  ChevronDown,
  ChevronUp,
} from "lucide-react";
import { useUniversityProspector } from "@/hooks/useAIRecommendations";

interface UniversityProspectorProps {
  universityId: string;
  universityName: string;
  apsScore?: number;
  interests?: string[];
}

export default function UniversityProspector({
  universityId,
  universityName,
  apsScore,
  interests,
}: UniversityProspectorProps) {
  const { programs, loading, error, fetchPrograms } = useUniversityProspector();
  const [expanded, setExpanded] = useState<string | null>(null);

  const handleFetch = () => {
    fetchPrograms(universityId, universityName, apsScore, interests);
  };

  return (
    <div className="card p-5">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h3 className="font-bold text-white">Programme Prospector</h3>
          <p className="text-xs text-[#555] mt-0.5">
            AI-powered — fetches live programmes from {universityName}
          </p>
        </div>
        <button
          onClick={handleFetch}
          disabled={loading}
          className="flex items-center gap-2 px-4 py-2 rounded-xl bg-[#CAFF00] text-black text-sm font-bold hover:bg-[#b8e600] disabled:opacity-50 transition-all"
        >
          {loading ? (
            <Loader2 size={14} className="animate-spin" />
          ) : (
            <Search size={14} />
          )}
          {loading ? "Searching…" : "Find All Programmes"}
        </button>
      </div>

      {error && (
        <p className="text-xs text-red-400 p-3 rounded-lg bg-red-500/10">
          {error}
        </p>
      )}

      <AnimatePresence>
        {programs && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            className="space-y-2 mt-2"
          >
            <p className="text-xs text-[#555] mb-3">
              Found {programs.programs.length} programmes — last updated{" "}
              {programs.lastUpdated}
            </p>

            {programs.programs.map((prog) => (
              <div
                key={prog.id}
                className="rounded-xl border border-white/8 bg-white/2 overflow-hidden"
              >
                <button
                  onClick={() =>
                    setExpanded(expanded === prog.id ? null : prog.id)
                  }
                  className="w-full flex items-center justify-between p-3 text-left hover:bg-white/3 transition-colors"
                >
                  <div className="flex items-center gap-2.5">
                    <GraduationCap
                      size={14}
                      className="text-[#CAFF00] flex-shrink-0"
                    />
                    <div>
                      <p className="text-sm text-white font-medium">
                        {prog.name}
                      </p>
                      <p className="text-xs text-[#555]">
                        {prog.degree} · {prog.faculty}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 flex-shrink-0">
                    <span className="text-xs text-[#666] flex items-center gap-1">
                      <Clock size={10} /> {prog.duration}
                    </span>
                    <span className="text-xs font-bold text-[#CAFF00]">
                      APS {prog.minAPS}
                    </span>
                    {expanded === prog.id ? (
                      <ChevronUp size={14} className="text-[#555]" />
                    ) : (
                      <ChevronDown size={14} className="text-[#555]" />
                    )}
                  </div>
                </button>

                <AnimatePresence>
                  {expanded === prog.id && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      className="px-4 pb-4 border-t border-white/6"
                    >
                      <p className="text-xs text-[#777] mt-3 leading-relaxed">
                        {prog.description}
                      </p>

                      {prog.subjectRequirements.length > 0 && (
                        <div className="mt-3">
                          <p className="text-[10px] text-[#555] uppercase tracking-wider mb-1.5">
                            Requirements
                          </p>
                          <div className="flex flex-wrap gap-1.5">
                            {prog.subjectRequirements.map((r) => (
                              <span
                                key={r.subject}
                                className="text-[10px] px-2 py-0.5 rounded-md bg-white/5 text-[#777]"
                              >
                                {r.subject} ≥{r.minimumMark}%
                              </span>
                            ))}
                          </div>
                        </div>
                      )}

                      {prog.careerOutcomes.length > 0 && (
                        <div className="mt-3">
                          <p className="text-[10px] text-[#555] uppercase tracking-wider mb-1.5">
                            Career outcomes
                          </p>
                          <div className="flex flex-wrap gap-1.5">
                            {prog.careerOutcomes.map((c) => (
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

                      <div className="flex items-center justify-between mt-3 pt-3 border-t border-white/5">
                        {prog.nsfasAvailable && (
                          <span className="text-[10px] text-emerald-400 font-semibold">
                            NSFAS Available ✓
                          </span>
                        )}
                        {prog.applicationDeadline && (
                          <span className="text-[10px] text-[#555]">
                            Apply by: {prog.applicationDeadline}
                          </span>
                        )}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
