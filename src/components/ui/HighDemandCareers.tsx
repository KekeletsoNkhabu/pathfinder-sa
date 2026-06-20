"use client";
import { useState } from "react";
import { motion } from "framer-motion";
import { TrendingUp, AlertTriangle, ArrowRight } from "lucide-react";
import Link from "next/link";
import { HIGH_DEMAND_CAREERS, DEMAND_SECTORS } from "@/data/highDemandCareers";
import { cn } from "@/utils/cn";

function formatZAR(n: number) {
  return `R${(n / 1000).toFixed(0)}k`;
}

const demandBadgeStyle: Record<string, string> = {
  "Critical Shortage": "bg-red-500/10 text-red-400 border border-red-500/20",
  "High Demand": "bg-[#CAFF00]/10 text-[#CAFF00] border border-[#CAFF00]/20",
  "Growing Fast": "bg-amber-400/10 text-amber-400 border border-amber-400/20",
};

const demandDotStyle: Record<string, string> = {
  "Critical Shortage": "bg-red-400",
  "High Demand": "bg-[#CAFF00]",
  "Growing Fast": "bg-amber-400",
};

export default function HighDemandCareers() {
  const [activeFilter, setActiveFilter] = useState("all");

  const filtered =
    activeFilter === "all"
      ? HIGH_DEMAND_CAREERS
      : HIGH_DEMAND_CAREERS.filter((c) => c.sector === activeFilter);

  return (
    <section className="py-24 px-4 sm:px-6 border-t border-white/4">
      <div className="max-w-5xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-10"
        >
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-red-500/20 bg-red-500/5 mb-5">
            <AlertTriangle size={13} className="text-red-400" />
            <span className="text-xs font-semibold text-red-400 uppercase tracking-widest">
              South Africa&apos;s Skills Crisis
            </span>
          </div>
          <h2 className="font-display text-4xl font-bold text-white mb-4">
            Careers in High Demand
          </h2>
          <p className="text-[#666] max-w-xl mx-auto">
            SA is experiencing critical shortages in these fields. Studying any
            of these means strong employment prospects and competitive salaries
            after graduation.
          </p>
        </motion.div>

        {/* Legend */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="flex flex-wrap items-center justify-center gap-4 mb-8"
        >
          {(["Critical Shortage", "High Demand", "Growing Fast"] as const).map(
            (label) => (
              <div key={label} className="flex items-center gap-2">
                <span
                  className={cn(
                    "w-2 h-2 rounded-full flex-shrink-0",
                    demandDotStyle[label],
                  )}
                />
                <span className="text-xs text-[#666]">{label}</span>
              </div>
            ),
          )}
        </motion.div>

        {/* Filter pills */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="flex flex-wrap gap-2 justify-center mb-8"
        >
          {DEMAND_SECTORS.map((sector) => (
            <button
              key={sector.id}
              onClick={() => setActiveFilter(sector.id)}
              className={cn(
                "px-3 py-1.5 rounded-full text-xs font-medium transition-all border",
                activeFilter === sector.id
                  ? "bg-[#CAFF00]/15 border-[#CAFF00]/30 text-[#CAFF00]"
                  : "bg-white/3 border-white/8 text-[#666] hover:text-white hover:border-white/15",
              )}
            >
              {sector.label}
            </button>
          ))}
        </motion.div>

        {/* Career grid */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {filtered.map((career, i) => (
            <motion.div
              key={career.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.05 }}
              className="card p-5 hover:border-white/15 transition-all group"
            >
              {/* Top row */}
              <div className="flex items-start justify-between gap-2 mb-3">
                <div className="flex items-center gap-2.5">
                  <div className="w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center text-xl flex-shrink-0">
                    {career.emoji}
                  </div>
                  <div>
                    <h3 className="font-bold text-white text-sm leading-tight">
                      {career.title}
                    </h3>
                    <span className="text-[10px] text-[#555]">
                      {career.sector}
                    </span>
                  </div>
                </div>
                <span
                  className={cn(
                    "text-[9px] font-bold px-2 py-1 rounded-full flex-shrink-0 whitespace-nowrap",
                    demandBadgeStyle[career.demandLabel],
                  )}
                >
                  {career.demandLabel}
                </span>
              </div>

              {/* Reason */}
              <p className="text-[11px] text-[#777] leading-relaxed mb-3">
                {career.reason}
              </p>

              {/* Salary */}
              <div className="flex items-center justify-between py-2.5 px-3 rounded-lg bg-white/3 mb-3">
                <span className="text-[10px] text-[#555]">Annual salary</span>
                <span className="text-sm font-bold text-[#CAFF00] font-mono">
                  {formatZAR(career.salaryRange.min)} –{" "}
                  {formatZAR(career.salaryRange.max)}
                </span>
              </div>

              {/* Path + APS */}
              <div className="space-y-1.5">
                <div className="flex items-center gap-1.5">
                  <span className="text-[10px] text-[#444] uppercase tracking-wider">
                    Min APS:
                  </span>
                  <span className="text-[10px] font-bold text-[#CAFF00] font-mono">
                    {career.minAPS}
                  </span>
                </div>
                <p className="text-[10px] text-[#555]">
                  {career.qualificationPath}
                </p>
              </div>

              {/* Key subjects */}
              <div className="mt-3 flex flex-wrap gap-1.5">
                {career.keySubjects.map((subj) => (
                  <span
                    key={subj}
                    className="text-[9px] px-1.5 py-0.5 rounded-md bg-white/4 text-[#666] border border-white/6"
                  >
                    {subj}
                  </span>
                ))}
              </div>
            </motion.div>
          ))}
        </div>

        {/* CTA */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="text-center mt-10"
        >
          <p className="text-[#555] text-sm mb-4">
            Check if your APS qualifies you for any of these careers
          </p>
          <Link
            href="/dashboard"
            className="btn-primary inline-flex items-center gap-2"
          >
            <TrendingUp size={15} />
            Calculate My APS
            <ArrowRight size={15} />
          </Link>
        </motion.div>
      </div>
    </section>
  );
}
