"use client";
import Link from "next/link";
import { motion } from "framer-motion";
import { Heart, GitCompare, MapPin, Star, ArrowRight } from "lucide-react";
import { University } from "@/types";
import { cn } from "@/utils/cn";

interface UniversityCardProps {
  university: University;
  saved: boolean;
  inCompare: boolean;
  onToggleSave: (id: string) => void;
  onToggleCompare: (id: string) => void;
  studentAPS?: number;
  index?: number;
}

export default function UniversityCard({
  university,
  saved,
  inCompare,
  onToggleSave,
  onToggleCompare,
  studentAPS,
  index = 0,
}: UniversityCardProps) {
  const canApply = studentAPS ? studentAPS >= university.minAPS : null;

  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.07 }}
      className="card group relative overflow-hidden"
    >
      {/* Top accent */}
      <div
        className="h-1 w-full rounded-t-[16px]"
        style={{ backgroundColor: university.color }}
      />

      <div className="p-5">
        <div className="flex items-start justify-between gap-3 mb-3">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="text-[10px] font-mono text-[#555]">
                #{university.ranking} SA Ranked
              </span>
              {university.nsfasAvailable && (
                <span className="badge badge-green text-[10px] py-0.5 px-2">
                  NSFAS
                </span>
              )}
            </div>
            <h3 className="font-display font-bold text-white leading-tight">
              {university.name}
            </h3>
            <div className="flex items-center gap-1 mt-1">
              <MapPin size={11} className="text-[#555]" />
              <span className="text-xs text-[#666]">{university.location}</span>
            </div>
          </div>
          <div className="flex items-center gap-1 flex-shrink-0">
            <Star size={12} className="text-[#CAFF00] fill-[#CAFF00]" />
            <span className="text-sm font-bold text-[#CAFF00]">
              {university.overallRating}
            </span>
          </div>
        </div>

        {/* APS bar */}
        <div
          className={cn(
            "flex items-center gap-2 px-3 py-2 rounded-lg mb-3",
            canApply === true
              ? "bg-[#CAFF00]/5 border border-[#CAFF00]/15"
              : canApply === false
                ? "bg-red-500/5 border border-red-500/15"
                : "bg-white/3 border border-white/5",
          )}
        >
          <span className="text-xs text-[#666]">Min APS:</span>
          <span
            className={cn(
              "text-sm font-bold",
              canApply === true
                ? "text-[#CAFF00]"
                : canApply === false
                  ? "text-red-400"
                  : "text-white",
            )}
          >
            {university.minAPS}
          </span>
          {canApply !== null && (
            <span
              className={cn(
                "ml-auto text-[10px] font-semibold",
                canApply ? "text-[#CAFF00]" : "text-red-400",
              )}
            >
              {canApply ? "✓ Meets requirement" : "✗ Below requirement"}
            </span>
          )}
        </div>

        {/* Tags */}
        <div className="flex flex-wrap gap-1.5 mb-4">
          {university.tags.slice(0, 3).map((tag) => (
            <span
              key={tag}
              className="text-[10px] px-2 py-1 rounded-md bg-white/4 text-[#777] border border-white/5"
            >
              {tag}
            </span>
          ))}
        </div>

        {/* Save / Compare */}
        <div className="flex gap-2 mb-3">
          <button
            onClick={(e) => {
              e.preventDefault();
              onToggleSave(university.id);
            }}
            className={cn(
              "flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs font-medium transition-all flex-1 justify-center",
              saved
                ? "bg-[#CAFF00]/10 text-[#CAFF00] border border-[#CAFF00]/20"
                : "bg-white/4 text-[#666] border border-white/5 hover:text-[#CAFF00] hover:bg-[#CAFF00]/5",
            )}
          >
            <Heart size={12} fill={saved ? "currentColor" : "none"} />
            {saved ? "Saved" : "Save"}
          </button>
          <button
            onClick={(e) => {
              e.preventDefault();
              onToggleCompare(university.id);
            }}
            className={cn(
              "flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs font-medium transition-all flex-1 justify-center",
              inCompare
                ? "bg-blue-500/10 text-blue-400 border border-blue-500/20"
                : "bg-white/4 text-[#666] border border-white/5 hover:text-blue-400 hover:bg-blue-500/5",
            )}
          >
            <GitCompare size={12} />
            {inCompare ? "Comparing" : "Compare"}
          </button>
        </div>

        {/* ── View all programmes → university detail page ── */}
        <Link
          href={`/university/${university.id}`}
          className="flex items-center justify-between w-full px-4 py-2.5 rounded-xl bg-white/3 hover:bg-[#CAFF00]/5 border border-white/5 hover:border-[#CAFF00]/20 transition-all group/cta"
        >
          <span className="text-sm font-medium text-[#999] group-hover/cta:text-white transition-colors">
            View all programmes
          </span>
          <ArrowRight
            size={15}
            className="text-[#555] group-hover/cta:text-[#CAFF00] group-hover/cta:translate-x-1 transition-all"
          />
        </Link>
      </div>
    </motion.div>
  );
}
