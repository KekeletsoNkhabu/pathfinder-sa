"use client";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  // Technology
  Code2,
  Cpu,
  Globe,
  Database,
  Smartphone,
  // Science & Health
  FlaskConical,
  HeartPulse,
  Leaf,
  Microscope,
  Stethoscope,
  // Business & Finance
  TrendingUp,
  BarChart2,
  Briefcase,
  ShoppingBag,
  Building2,
  // Creative & Arts
  Palette,
  Pen,
  Music,
  Film,
  Camera,
  // Engineering & Construction
  Wrench,
  HardHat,
  Zap,
  Settings,
  Cog,
  // Social & Law
  Scale,
  Users,
  GraduationCap,
  Globe2,
  HandHeart,
  // Maths & Research
  Calculator,
  BookOpen,
  Lightbulb,
  Search,
  PieChart,
  // Sports & Environment
  Trophy,
  Mountain,
  Sprout,
  Wind,
  // Manual entry
  Plus,
  X,
  Tag,
} from "lucide-react";
import { cn } from "@/utils/cn";

export interface InterestItem {
  id: string;
  label: string;
  icon: React.ElementType;
  group: string;
}

// Interests with proper Lucide icons (no emojis)
export const INTERESTS: InterestItem[] = [
  // Technology
  {
    id: "coding",
    label: "Coding & Software",
    icon: Code2,
    group: "Technology",
  },
  { id: "ai", label: "AI & Machine Learning", icon: Cpu, group: "Technology" },
  { id: "web", label: "Web Development", icon: Globe, group: "Technology" },
  {
    id: "data",
    label: "Data & Analytics",
    icon: Database,
    group: "Technology",
  },
  { id: "mobile", label: "Mobile Apps", icon: Smartphone, group: "Technology" },

  // Science & Health
  {
    id: "medicine",
    label: "Medicine & Health",
    icon: Stethoscope,
    group: "Science & Health",
  },
  {
    id: "biology",
    label: "Biology & Life Sciences",
    icon: Microscope,
    group: "Science & Health",
  },
  {
    id: "chemistry",
    label: "Chemistry & Pharmaceuticals",
    icon: FlaskConical,
    group: "Science & Health",
  },
  {
    id: "nursing",
    label: "Nursing & Patient Care",
    icon: HeartPulse,
    group: "Science & Health",
  },
  {
    id: "environment",
    label: "Environment & Ecology",
    icon: Leaf,
    group: "Science & Health",
  },

  // Business & Finance
  {
    id: "finance",
    label: "Finance & Accounting",
    icon: TrendingUp,
    group: "Business & Finance",
  },
  {
    id: "entrepreneurship",
    label: "Entrepreneurship",
    icon: Lightbulb,
    group: "Business & Finance",
  },
  {
    id: "marketing",
    label: "Marketing & Branding",
    icon: ShoppingBag,
    group: "Business & Finance",
  },
  {
    id: "management",
    label: "Business Management",
    icon: Briefcase,
    group: "Business & Finance",
  },
  {
    id: "economics",
    label: "Economics",
    icon: BarChart2,
    group: "Business & Finance",
  },

  // Engineering & Construction
  { id: "engineering", label: "Engineering", icon: Cog, group: "Engineering" },
  {
    id: "electrical",
    label: "Electrical & Electronics",
    icon: Zap,
    group: "Engineering",
  },
  {
    id: "construction",
    label: "Construction & Architecture",
    icon: HardHat,
    group: "Engineering",
  },
  {
    id: "mechanical",
    label: "Mechanical Systems",
    icon: Wrench,
    group: "Engineering",
  },

  // Creative & Arts
  {
    id: "design",
    label: "Graphic Design & UX",
    icon: Palette,
    group: "Creative & Arts",
  },
  {
    id: "writing",
    label: "Writing & Journalism",
    icon: Pen,
    group: "Creative & Arts",
  },
  { id: "media", label: "Media & Film", icon: Film, group: "Creative & Arts" },
  {
    id: "music",
    label: "Music & Performing Arts",
    icon: Music,
    group: "Creative & Arts",
  },
  {
    id: "photography",
    label: "Photography & Visual Arts",
    icon: Camera,
    group: "Creative & Arts",
  },

  // Social & Law
  { id: "law", label: "Law & Justice", icon: Scale, group: "Social & Law" },
  {
    id: "social-work",
    label: "Social Work & Community",
    icon: HandHeart,
    group: "Social & Law",
  },
  {
    id: "teaching",
    label: "Teaching & Education",
    icon: GraduationCap,
    group: "Social & Law",
  },
  {
    id: "politics",
    label: "Politics & Public Policy",
    icon: Building2,
    group: "Social & Law",
  },
  {
    id: "international",
    label: "International Relations",
    icon: Globe2,
    group: "Social & Law",
  },

  // Research & Maths
  {
    id: "mathematics",
    label: "Mathematics & Statistics",
    icon: Calculator,
    group: "Research",
  },
  {
    id: "research",
    label: "Research & Academia",
    icon: Search,
    group: "Research",
  },
  {
    id: "science",
    label: "Physical Sciences",
    icon: PieChart,
    group: "Research",
  },

  // Other
  { id: "sports", label: "Sports Science", icon: Trophy, group: "Other" },
  {
    id: "agriculture",
    label: "Agriculture & Farming",
    icon: Sprout,
    group: "Other",
  },
];

const GROUPS = [
  "Technology",
  "Science & Health",
  "Business & Finance",
  "Engineering",
  "Creative & Arts",
  "Social & Law",
  "Research",
  "Other",
];

interface InterestSelectorProps {
  selected: string[];
  onChange: (interests: string[]) => void;
  // customInterests are free-text entries the learner adds manually
  customInterests?: string[];
  onCustomChange?: (customs: string[]) => void;
}

export default function InterestSelector({
  selected,
  onChange,
  customInterests = [],
  onCustomChange,
}: InterestSelectorProps) {
  const [activeGroup, setActiveGroup] = useState("Technology");
  const [customInput, setCustomInput] = useState("");
  const [showCustomInput, setShowCustomInput] = useState(false);

  const toggle = (id: string) => {
    onChange(
      selected.includes(id)
        ? selected.filter((s) => s !== id)
        : [...selected, id],
    );
  };

  const addCustom = () => {
    const trimmed = customInput.trim();
    if (!trimmed || customInterests.includes(trimmed)) return;
    onCustomChange?.([...customInterests, trimmed]);
    setCustomInput("");
  };

  const removeCustom = (item: string) => {
    onCustomChange?.(customInterests.filter((c) => c !== item));
  };

  const visibleInterests = INTERESTS.filter((i) => i.group === activeGroup);
  const totalSelected = selected.length + customInterests.length;

  return (
    <div>
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-sm font-semibold text-white">Your Interests</h3>
        <span className="text-xs text-[#555]">
          {totalSelected > 0 ? (
            <span className="text-[#CAFF00] font-medium">
              {totalSelected} selected
            </span>
          ) : (
            "Select all that apply"
          )}
        </span>
      </div>

      {/* Group tabs */}
      <div className="flex gap-1.5 flex-wrap mb-4">
        {GROUPS.map((group) => {
          const groupCount = INTERESTS.filter(
            (i) => i.group === group && selected.includes(i.id),
          ).length;
          return (
            <button
              key={group}
              type="button"
              onClick={() => setActiveGroup(group)}
              className={cn(
                "px-2.5 py-1 rounded-lg text-[10px] font-medium transition-all border relative",
                activeGroup === group
                  ? "bg-[#CAFF00]/10 border-[#CAFF00]/25 text-[#CAFF00]"
                  : "bg-white/3 border-white/6 text-[#666] hover:text-white hover:border-white/12",
              )}
            >
              {group}
              {groupCount > 0 && (
                <span className="ml-1 text-[9px] font-bold text-[#CAFF00]">
                  {groupCount}
                </span>
              )}
            </button>
          );
        })}
      </div>

      {/* Interest grid for active group */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 mb-4">
        {visibleInterests.map((interest, i) => {
          const active = selected.includes(interest.id);
          const Icon = interest.icon;
          return (
            <motion.button
              key={interest.id}
              type="button"
              onClick={() => toggle(interest.id)}
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: i * 0.03 }}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className={cn(
                "flex items-center gap-2.5 px-3 py-2.5 rounded-xl border text-sm text-left transition-all",
                active
                  ? "bg-[#CAFF00]/10 border-[#CAFF00]/30 text-[#CAFF00]"
                  : "bg-white/3 border-white/6 text-[#888] hover:bg-white/5 hover:border-white/12 hover:text-white",
              )}
            >
              <Icon
                size={16}
                className={cn(
                  "flex-shrink-0 transition-colors",
                  active ? "text-[#CAFF00]" : "text-[#555]",
                )}
              />
              <span className="text-xs font-medium leading-tight">
                {interest.label}
              </span>
              {active && (
                <motion.span
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  className="ml-auto w-4 h-4 rounded-full bg-[#CAFF00]/20 flex items-center justify-center flex-shrink-0"
                >
                  <span className="text-[#CAFF00] text-[8px] font-bold">✓</span>
                </motion.span>
              )}
            </motion.button>
          );
        })}
      </div>

      {/* Divider */}
      <div className="border-t border-white/6 pt-4 mt-2">
        <div className="flex items-center justify-between mb-3">
          <p className="text-xs text-[#555]">
            Don&apos;t see your interest?{" "}
            <span className="text-[#888]">Add it manually</span>
          </p>
          <button
            type="button"
            onClick={() => setShowCustomInput(!showCustomInput)}
            className={cn(
              "flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all border",
              showCustomInput
                ? "bg-[#CAFF00]/10 border-[#CAFF00]/25 text-[#CAFF00]"
                : "bg-white/3 border-white/8 text-[#666] hover:text-white hover:border-white/15",
            )}
          >
            <Plus size={12} />
            Add custom
          </button>
        </div>

        {/* Custom interest input */}
        <AnimatePresence>
          {showCustomInput && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              className="mb-3"
            >
              <div className="flex gap-2">
                <input
                  type="text"
                  value={customInput}
                  onChange={(e) => setCustomInput(e.target.value)}
                  onKeyDown={(e) =>
                    e.key === "Enter" && (e.preventDefault(), addCustom())
                  }
                  placeholder="e.g. Aviation, Veterinary, Fashion Design…"
                  className="input-field flex-1 text-sm"
                  maxLength={50}
                />
                <button
                  type="button"
                  onClick={addCustom}
                  disabled={!customInput.trim()}
                  className="px-4 py-2 rounded-xl bg-[#CAFF00]/10 border border-[#CAFF00]/25 text-[#CAFF00] text-xs font-semibold hover:bg-[#CAFF00]/15 transition-all disabled:opacity-40 disabled:cursor-not-allowed flex-shrink-0"
                >
                  Add
                </button>
              </div>
              <p className="text-[10px] text-[#444] mt-1.5">
                AI will use your custom interests when recommending courses
              </p>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Custom interests tags */}
        {customInterests.length > 0 && (
          <div className="flex flex-wrap gap-2">
            {customInterests.map((item) => (
              <motion.div
                key={item}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-[#CAFF00]/8 border border-[#CAFF00]/20 text-[#CAFF00]"
              >
                <Tag size={10} />
                <span className="text-xs font-medium">{item}</span>
                <button
                  type="button"
                  onClick={() => removeCustom(item)}
                  className="text-[#CAFF00]/50 hover:text-[#CAFF00] transition-colors ml-0.5"
                >
                  <X size={10} />
                </button>
              </motion.div>
            ))}
          </div>
        )}
      </div>

      {/* Selected summary across all groups */}
      {selected.length > 0 && (
        <div className="mt-4 pt-3 border-t border-white/5">
          <p className="text-[10px] text-[#444] uppercase tracking-wider mb-2">
            All selected interests
          </p>
          <div className="flex flex-wrap gap-1.5">
            {INTERESTS.filter((i) => selected.includes(i.id)).map(
              (interest) => {
                const Icon = interest.icon;
                return (
                  <button
                    key={interest.id}
                    type="button"
                    onClick={() => toggle(interest.id)}
                    className="flex items-center gap-1 px-2 py-1 rounded-lg bg-[#CAFF00]/5 border border-[#CAFF00]/15 text-[#CAFF00]/80 hover:bg-red-500/10 hover:border-red-500/20 hover:text-red-400 transition-all group"
                  >
                    <Icon size={10} />
                    <span className="text-[9px] font-medium">
                      {interest.label}
                    </span>
                    <X
                      size={8}
                      className="opacity-0 group-hover:opacity-100 transition-opacity"
                    />
                  </button>
                );
              },
            )}
          </div>
        </div>
      )}
    </div>
  );
}
