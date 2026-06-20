"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import {
  ArrowRight,
  User,
  BookOpen,
  Lightbulb,
  RotateCcw,
  CheckCircle2,
  AlertCircle,
} from "lucide-react";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import SubjectForm, { SubjectEntry } from "@/components/forms/SubjectForm";
import InterestSelector from "@/components/forms/InterestSelector";
import APSRing from "@/components/ui/APSRing";
import APSChart from "@/components/charts/APSChart";
import { buildSubjects, calculateTotalAPS } from "@/utils/aps";
import { saveProfile, loadSavedData } from "@/utils/storage";
import { DEFAULT_SUBJECTS } from "@/data/subjects";
import { StudentProfile } from "@/types";

const STEPS = [
  { id: "profile", label: "Profile", icon: User },
  { id: "subjects", label: "Subjects", icon: BookOpen },
  { id: "interests", label: "Interests", icon: Lightbulb },
];

const defaultSubjects: SubjectEntry[] = DEFAULT_SUBJECTS.map((name) => ({
  name,
  mark: "",
}));

export default function DashboardPage() {
  const router = useRouter();
  const [step, setStep] = useState(0);
  const [studentName, setStudentName] = useState("");
  const [subjects, setSubjects] = useState<SubjectEntry[]>(defaultSubjects);
  const [interests, setInterests] = useState<string[]>([]);
  // NEW: free-text custom interests the learner types manually
  const [customInterests, setCustomInterests] = useState<string[]>([]);
  const [errors, setErrors] = useState<string[]>([]);

  // Load saved data on mount
  useEffect(() => {
    const saved = loadSavedData();
    if (saved.profile) {
      setStudentName(saved.profile.name);
      setSubjects(
        saved.profile.subjects.map((s) => ({
          name: s.name,
          mark: String(s.mark),
        })),
      );
      setInterests(saved.profile.interests);
      // Load custom interests if stored (stored as entries starting with "custom:")
      const savedCustom = (saved.profile.interests ?? [])
        .filter((i: string) => i.startsWith("custom:"))
        .map((i: string) => i.replace("custom:", ""));
      setCustomInterests(savedCustom);
      // Strip the "custom:" entries from the main interests list
      setInterests(
        (saved.profile.interests ?? []).filter(
          (i: string) => !i.startsWith("custom:"),
        ),
      );
    }
  }, []);

  const builtSubjects = buildSubjects(subjects);
  const totalAPS = calculateTotalAPS(builtSubjects);
  const filledSubjects = builtSubjects.length;

  const validate = (): boolean => {
    const errs: string[] = [];
    if (step === 0 && !studentName.trim()) errs.push("Please enter your name.");
    if (step === 1) {
      if (filledSubjects < 4)
        errs.push("Please enter at least 4 subjects with marks.");
      const invalid = subjects.find(
        (s) => s.name && s.mark && (Number(s.mark) < 0 || Number(s.mark) > 100),
      );
      if (invalid) errs.push("Marks must be between 0 and 100.");
    }
    setErrors(errs);
    return errs.length === 0;
  };

  const handleNext = () => {
    if (!validate()) return;
    if (step < STEPS.length - 1) {
      setStep((s) => s + 1);
    } else {
      handleSubmit();
    }
  };

  const handleSubmit = () => {
    const built = buildSubjects(subjects);
    // Merge standard interests + custom interests (prefixed so API can distinguish)
    const allInterests = [
      ...interests,
      ...customInterests.map((c) => `custom:${c}`),
    ];
    const profile: StudentProfile = {
      name: studentName.trim() || "Learner",
      subjects: built,
      totalAPS: calculateTotalAPS(built),
      interests: allInterests,
      savedAt: new Date().toISOString(),
    };
    saveProfile(profile);
    router.push("/results");
  };

  const handleReset = () => {
    setStudentName("");
    setSubjects(defaultSubjects);
    setInterests([]);
    setCustomInterests([]);
    setStep(0);
    setErrors([]);
  };

  return (
    <div className="min-h-screen bg-[#0a0a0a] grid-bg">
      <Navbar />

      <div className="max-w-6xl mx-auto px-4 sm:px-6 pt-28 pb-20">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-10"
        >
          <h1 className="font-display text-4xl font-bold text-white mb-2">
            Your Profile
          </h1>
          <p className="text-[#666]">
            Enter your information to get personalised career matches
          </p>
        </motion.div>

        {/* Step progress */}
        <div className="flex items-center gap-0 mb-10">
          {STEPS.map((s, i) => (
            <div key={s.id} className="flex items-center flex-1 last:flex-none">
              <button
                onClick={() => i < step && setStep(i)}
                className={`flex items-center gap-2 px-3 py-2 rounded-xl transition-all ${
                  i === step
                    ? "bg-[#CAFF00]/10 text-[#CAFF00]"
                    : i < step
                      ? "text-[#888] hover:text-white cursor-pointer"
                      : "text-[#444] cursor-default"
                }`}
              >
                <s.icon size={16} />
                <span className="text-sm font-medium hidden sm:inline">
                  {s.label}
                </span>
              </button>
              {i < STEPS.length - 1 && (
                <div
                  className={`flex-1 h-px mx-2 transition-colors ${i < step ? "bg-[#CAFF00]/30" : "bg-white/6"}`}
                />
              )}
            </div>
          ))}
        </div>

        <div className="grid lg:grid-cols-[1fr_320px] gap-6">
          {/* Main panel */}
          <div className="card p-6 sm:p-8">
            <AnimatePresence mode="wait">
              {/* Step 0: Profile */}
              {step === 0 && (
                <motion.div
                  key="step-profile"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  transition={{ duration: 0.3 }}
                >
                  <h2 className="font-display text-2xl font-bold text-white mb-2">
                    Who are you?
                  </h2>
                  <p className="text-[#666] text-sm mb-8">
                    Let&apos;s personalise your experience
                  </p>

                  <div className="space-y-6 max-w-sm">
                    <div>
                      <label className="block text-sm text-[#999] mb-2 font-medium">
                        Your name
                      </label>
                      <input
                        type="text"
                        value={studentName}
                        onChange={(e) => setStudentName(e.target.value)}
                        placeholder="e.g. Thabo Nkosi"
                        className="input-field text-base"
                        autoFocus
                      />
                    </div>

                    <div className="card-lime p-4 text-sm text-[#aaa] leading-relaxed">
                      <strong className="text-[#CAFF00]">Privacy first.</strong>{" "}
                      All your data is stored only on your device using
                      LocalStorage. Nothing is sent to any server.
                    </div>
                  </div>
                </motion.div>
              )}

              {/* Step 1: Subjects */}
              {step === 1 && (
                <motion.div
                  key="step-subjects"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  transition={{ duration: 0.3 }}
                >
                  <h2 className="font-display text-2xl font-bold text-white mb-2">
                    Hello{studentName ? `, ${studentName.split(" ")[0]}` : ""}!
                    👋
                  </h2>
                  <p className="text-[#666] text-sm mb-8">
                    Enter your Grade 12 subjects and percentage marks
                  </p>
                  <SubjectForm subjects={subjects} onChange={setSubjects} />
                </motion.div>
              )}

              {/* Step 2: Interests */}
              {step === 2 && (
                <motion.div
                  key="step-interests"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  transition={{ duration: 0.3 }}
                >
                  <h2 className="font-display text-2xl font-bold text-white mb-2">
                    What excites you?
                  </h2>
                  <p className="text-[#666] text-sm mb-8">
                    Select your interests — or type your own
                  </p>
                  <InterestSelector
                    selected={interests}
                    onChange={setInterests}
                    customInterests={customInterests}
                    onCustomChange={setCustomInterests}
                  />
                </motion.div>
              )}
            </AnimatePresence>

            {/* Error messages */}
            <AnimatePresence>
              {errors.length > 0 && (
                <motion.div
                  initial={{ opacity: 0, y: -8 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -8 }}
                  className="mt-6 flex items-start gap-2 p-3 rounded-xl bg-red-500/5 border border-red-500/20"
                >
                  <AlertCircle
                    size={16}
                    className="text-red-400 flex-shrink-0 mt-0.5"
                  />
                  <div className="text-sm text-red-400">
                    {errors.map((e, i) => (
                      <div key={i}>{e}</div>
                    ))}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Navigation */}
            <div className="flex items-center justify-between mt-8 pt-6 border-t border-white/5">
              <div className="flex gap-2">
                {step > 0 && (
                  <button
                    onClick={() => setStep((s) => s - 1)}
                    className="btn-secondary py-2.5 px-5"
                  >
                    ← Back
                  </button>
                )}
                <button
                  onClick={handleReset}
                  className="btn-ghost flex items-center gap-1.5"
                >
                  <RotateCcw size={13} />
                  Reset
                </button>
              </div>
              <button
                onClick={handleNext}
                className="btn-primary flex items-center gap-2"
              >
                {step === STEPS.length - 1 ? (
                  <>
                    <CheckCircle2 size={16} />
                    See My Results
                  </>
                ) : (
                  <>
                    Continue
                    <ArrowRight size={16} />
                  </>
                )}
              </button>
            </div>
          </div>

          {/* Sidebar — Live APS preview */}
          <div className="space-y-4">
            <motion.div
              initial={{ opacity: 0, x: 24 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 }}
              className="card p-6"
            >
              <h3 className="text-xs text-[#555] uppercase tracking-wider mb-5">
                Live APS Preview
              </h3>
              <div className="flex justify-center mb-4">
                <APSRing score={totalAPS} size={130} />
              </div>
              <div className="text-center text-xs text-[#555]">
                {filledSubjects} subject{filledSubjects !== 1 ? "s" : ""}{" "}
                entered
              </div>

              {builtSubjects.length > 0 && (
                <div className="mt-5 space-y-2">
                  {builtSubjects.map((s) => (
                    <div
                      key={s.name}
                      className="flex items-center justify-between"
                    >
                      <span className="text-xs text-[#666] truncate max-w-[140px]">
                        {s.name.split(" ")[0]}
                      </span>
                      <div className="flex items-center gap-2">
                        <span className="text-xs text-[#555]">{s.mark}%</span>
                        <span
                          className={`font-mono text-xs font-bold px-1.5 py-0.5 rounded ${
                            s.apsPoints >= 6
                              ? "bg-[#CAFF00]/10 text-[#CAFF00]"
                              : s.apsPoints >= 4
                                ? "bg-yellow-500/10 text-yellow-400"
                                : "bg-red-500/10 text-red-400"
                          }`}
                        >
                          {s.apsPoints}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </motion.div>

            {/* Chart */}
            {builtSubjects.length >= 3 && (
              <motion.div
                initial={{ opacity: 0, x: 24 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.3 }}
                className="card p-5"
              >
                <h3 className="text-xs text-[#555] uppercase tracking-wider mb-3">
                  APS Breakdown
                </h3>
                <APSChart subjects={builtSubjects} />
              </motion.div>
            )}

            {/* APS scale reference */}
            <motion.div
              initial={{ opacity: 0, x: 24 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.35 }}
              className="card p-4"
            >
              <h3 className="text-xs text-[#555] uppercase tracking-wider mb-3">
                APS Scale
              </h3>
              <div className="space-y-1.5">
                {[
                  { range: "80–100%", aps: 7, color: "#CAFF00" },
                  { range: "70–79%", aps: 6, color: "#86efac" },
                  { range: "60–69%", aps: 5, color: "#6ee7b7" },
                  { range: "50–59%", aps: 4, color: "#fbbf24" },
                  { range: "40–49%", aps: 3, color: "#fb923c" },
                  { range: "30–39%", aps: 2, color: "#f87171" },
                  { range: "0–29%", aps: 1, color: "#ef4444" },
                ].map((row) => (
                  <div
                    key={row.aps}
                    className="flex items-center justify-between"
                  >
                    <span className="text-xs text-[#555]">{row.range}</span>
                    <span
                      className="font-mono text-xs font-bold"
                      style={{ color: row.color }}
                    >
                      = {row.aps} pts
                    </span>
                  </div>
                ))}
              </div>
            </motion.div>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
}
