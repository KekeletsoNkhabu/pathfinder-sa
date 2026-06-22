'use client';
import Link from 'next/link';
import { motion } from 'framer-motion';
import {
  Compass, BarChart3, University, ShieldCheck, ArrowRight,
  Sparkles, Target, TrendingUp, CheckCircle2, FileCheck,
  BadgeDollarSign, Gift
} from 'lucide-react';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import HighDemandCareers from '@/components/ui/HighDemandCareers';
import { UNIVERSITY_FEES } from '@/data/universityFees';

const STATS = [
  { value: '14+', label: 'Career Paths', icon: Target },
  { value: '26', label: 'Universities', icon: University },
  { value: '42', label: 'Max APS Score', icon: BarChart3 },
  { value: 'R199', label: 'Flat Service Fee', icon: BadgeDollarSign },
];

const FEATURES = [
  {
    icon: BarChart3,
    title: 'APS Calculator',
    description: 'Instantly convert your percentage marks into APS points with live breakdown and subject-by-subject scoring.',
    color: '#CAFF00',
  },
  {
    icon: Target,
    title: 'Career Matching',
    description: 'Our AI engine analyses your subjects, APS and interests to find careers you qualify for — plus stretch goals.',
    color: '#86efac',
  },
  {
    icon: University,
    title: 'University Compare',
    description: 'Side-by-side comparison of all 26 SA universities with NSFAS info, rankings, and application fees.',
    color: '#93c5fd',
  },
  {
    icon: FileCheck,
    title: 'We Apply For You',
    description: 'Pay one flat fee of R199 and we complete and submit your applications to multiple universities on your behalf.',
    color: '#fbbf24',
  },
];

const HOW_IT_WORKS = [
  { step: '01', title: 'Enter Your Marks', desc: 'Input your Grade 12 subjects and percentage marks.' },
  { step: '02', title: 'Get AI Matches', desc: 'AI searches all 26 SA universities for programmes that fit your profile.' },
  { step: '03', title: 'Choose Courses', desc: 'Add up to 3 programmes to your application basket.' },
  { step: '04', title: 'We Submit', desc: 'Pay R199 flat fee — we handle all your university applications.' },
];

const freeCount = UNIVERSITY_FEES.filter(u => u.applicationFee === 0).length;
const paidCount = UNIVERSITY_FEES.length - freeCount;

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-[#0a0a0a] grid-bg">
      <Navbar />

      {/* ── Hero ── */}
      <section className="relative pt-32 pb-20 px-4 sm:px-6 overflow-hidden">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[600px] pointer-events-none"
          style={{ background: 'radial-gradient(ellipse at center, rgba(202,255,0,0.07) 0%, transparent 60%)' }}
        />
        <div className="max-w-5xl mx-auto text-center relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-[#CAFF00]/20 bg-[#CAFF00]/5 mb-8"
          >
            <Sparkles size={14} className="text-[#CAFF00]" />
            <span className="text-xs font-semibold text-[#CAFF00] uppercase tracking-widest">For Grade 12 & Gap Year Learners</span>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1, duration: 0.6 }}
            className="font-display text-5xl sm:text-6xl md:text-7xl font-bold text-white leading-[1.05] mb-6"
          >
            Find Your<br />
            <span className="gradient-text">Career Path</span><br />
            in South Africa
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}
            className="text-lg text-[#888] max-w-2xl mx-auto mb-10 leading-relaxed"
          >
            Calculate your APS, discover careers you qualify for, compare SA universities,
            and let us handle your applications — all in one place.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}
            className="flex flex-col sm:flex-row gap-3 justify-center"
          >
            <Link href="/dashboard" className="btn-primary flex items-center gap-2 justify-center text-base px-8 py-3.5 animate-pulse-lime">
              Calculate My APS <ArrowRight size={18} />
            </Link>
            <Link href="/compare" className="btn-secondary flex items-center gap-2 justify-center text-base px-8 py-3.5">
              Compare Universities
            </Link>
          </motion.div>

          <motion.p
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.5 }}
            className="mt-6 text-[#444] text-sm flex items-center justify-center gap-2"
          >
            <CheckCircle2 size={14} className="text-[#CAFF00]" />
            Free to use · No sign-up · NSFAS applications free · R199 flat fee to apply
          </motion.p>
        </div>
      </section>

      {/* ── Stats ── */}
      <section className="py-16 px-4 sm:px-6 border-y border-white/4">
        <div className="max-w-5xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-6">
          {STATS.map((stat, i) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 24 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
              transition={{ delay: i * 0.1 }} className="text-center"
            >
              <stat.icon size={24} className="text-[#CAFF00] mx-auto mb-3 opacity-80" />
              <div className="font-display text-3xl font-bold text-white mb-1">{stat.value}</div>
              <div className="text-sm text-[#555]">{stat.label}</div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* ── Apply For You Banner ── */}
      <section className="py-20 px-4 sm:px-6">
        <div className="max-w-5xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 24 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
            className="card-lime p-8 md:p-10"
          >
            <div className="flex flex-col lg:flex-row gap-8 items-start">
              {/* Left: heading */}
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-4">
                  <FileCheck size={20} className="text-[#CAFF00]" />
                  <span className="text-xs text-[#CAFF00] font-semibold uppercase tracking-wider">Application Service</span>
                </div>
                <h2 className="font-display text-3xl font-bold text-white mb-3">
                  We Apply to Universities<br />
                  <span className="text-[#CAFF00]">On Your Behalf</span>
                </h2>
                <p className="text-[#777] mb-6 leading-relaxed">
                  Applying to multiple universities is stressful and time-consuming. PathFinder SA handles the whole process
                  — forms, uploads, follow-ups — so you can focus on your studies.
                </p>

                {/* What's included */}
                <div className="grid sm:grid-cols-2 gap-3 mb-6">
                  {[
                    'Complete all application forms for you',
                    'Upload your documents securely',
                    'Follow up with universities',
                    'Apply to NSFAS for you (FREE)',
                    'Track your application status',
                    'Email you every update',
                  ].map(item => (
                    <div key={item} className="flex items-center gap-2 text-sm text-[#aaa]">
                      <CheckCircle2 size={13} className="text-[#CAFF00] flex-shrink-0" />
                      {item}
                    </div>
                  ))}
                </div>

                <Link href="/apply" className="btn-primary inline-flex items-center gap-2">
                  <FileCheck size={15} />
                  Start My Application — R199
                </Link>
              </div>

              {/* Right: fee breakdown */}
              <div className="lg:w-72 w-full space-y-3">
                <h3 className="text-sm font-semibold text-white mb-3">What You Pay</h3>

                <div className="card p-4 space-y-3">
                  <div className="flex justify-between items-center">
                    <div>
                      <p className="text-sm font-bold text-white">PathFinder Service Fee</p>
                      <p className="text-xs text-[#555]">Flat rate — covers all applications</p>
                    </div>
                    <span className="text-xl font-bold text-[#CAFF00]">R199</span>
                  </div>
                  <div className="border-t border-white/5 pt-3">
                    <p className="text-xs text-[#555] mb-2">University application fees (passed through at cost):</p>
                    <div className="space-y-1.5 text-xs">
                      <div className="flex justify-between">
                        <span className="text-[#666]">{freeCount} universities</span>
                        <span className="text-emerald-400 font-semibold">FREE</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-[#666]">Wits</span>
                        <span className="text-emerald-400 font-semibold">R100</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-[#666]">UCT</span>
                        <span className="text-amber-400">R100</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-[#666]">UP</span>
                        <span className="text-amber-400">R135</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-[#666]">Stellenbosch</span>
                        <span className="text-amber-400">R100</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-[#666]">KZN universities (via CAO)</span>
                        <span className="text-amber-400">R250</span>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="card p-4 flex items-start gap-3">
                  <Gift size={16} className="text-emerald-400 mt-0.5 flex-shrink-0" />
                  <div>
                    <p className="text-sm font-bold text-white">NSFAS Application</p>
                    <p className="text-xs text-[#666] mt-0.5">We apply for NSFAS funding for you — completely free. No extra charge.</p>
                    <p className="text-emerald-400 text-xs font-bold mt-1">FREE ✓</p>
                  </div>
                </div>

                <p className="text-[10px] text-[#444] text-center">
                  University fees are official 2025/2026 rates. No markup — passed through at cost.
                </p>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* ── High Demand Careers ── */}
      <HighDemandCareers />

      {/* ── Features ── */}
      <section className="py-24 px-4 sm:px-6 border-t border-white/4">
        <div className="max-w-5xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 24 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="font-display text-4xl font-bold text-white mb-4">Everything You Need</h2>
            <p className="text-[#666] max-w-xl mx-auto">
              Built specifically for the South African education system and matric learners.
            </p>
          </motion.div>
          <div className="grid md:grid-cols-2 gap-5">
            {FEATURES.map((feature, i) => (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 24 }} whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }} transition={{ delay: i * 0.1 }}
                className="card p-6 hover:scale-[1.01] transition-transform"
              >
                <div className="w-12 h-12 rounded-2xl flex items-center justify-center mb-4"
                  style={{ backgroundColor: `${feature.color}15`, border: `1px solid ${feature.color}30` }}>
                  <feature.icon size={22} style={{ color: feature.color }} />
                </div>
                <h3 className="font-display text-xl font-bold text-white mb-2">{feature.title}</h3>
                <p className="text-[#777] text-sm leading-relaxed">{feature.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── How It Works ── */}
      <section className="py-24 px-4 sm:px-6 border-t border-white/4">
        <div className="max-w-5xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 24 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="font-display text-4xl font-bold text-white mb-4">How It Works</h2>
            <p className="text-[#666]">Four simple steps from matric marks to submitted applications</p>
          </motion.div>
          <div className="grid sm:grid-cols-2 md:grid-cols-4 gap-6">
            {HOW_IT_WORKS.map((step, i) => (
              <motion.div
                key={step.step}
                initial={{ opacity: 0, y: 32 }} whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }} transition={{ delay: i * 0.12 }}
                className="relative text-center"
              >
                {i < HOW_IT_WORKS.length - 1 && (
                  <div className="hidden md:block absolute top-8 left-[calc(50%+24px)] right-[-50%] h-px bg-gradient-to-r from-[#CAFF00]/20 to-transparent" />
                )}
                <div className="w-16 h-16 rounded-2xl bg-[#111] border border-[#CAFF00]/20 flex items-center justify-center mx-auto mb-4">
                  <span className="font-mono font-bold text-[#CAFF00]">{step.step}</span>
                </div>
                <h4 className="font-display font-bold text-white mb-2">{step.title}</h4>
                <p className="text-sm text-[#666]">{step.desc}</p>
              </motion.div>
            ))}
          </div>
          <motion.div
            initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }}
            transition={{ delay: 0.5 }} className="text-center mt-14"
          >
            <Link href="/dashboard" className="btn-primary inline-flex items-center gap-2 text-base px-10 py-4">
              Start Now – It&apos;s Free <ArrowRight size={18} />
            </Link>
          </motion.div>
        </div>
      </section>

      {/* ── NSFAS Banner ── */}
      <section className="py-16 px-4 sm:px-6 border-t border-white/4">
        <div className="max-w-5xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 24 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
            className="card-lime p-8 md:p-10 flex flex-col md:flex-row items-center justify-between gap-6"
          >
            <div>
              <div className="flex items-center gap-2 mb-3">
                <ShieldCheck size={20} className="text-[#CAFF00]" />
                <span className="text-xs text-[#CAFF00] font-semibold uppercase tracking-wider">NSFAS — Free Service</span>
              </div>
              <h3 className="font-display text-2xl font-bold text-white mb-2">We Apply for NSFAS — Free</h3>
              <p className="text-[#777] max-w-lg">
                PathFinder SA applies for NSFAS funding on your behalf at zero cost. Your household income must be below
                R350,000/year to qualify. We&apos;ll check your eligibility and submit the application for you.
              </p>
            </div>
            <Link href="/dashboard" className="btn-primary flex-shrink-0 flex items-center gap-2 whitespace-nowrap">
              Check My Options <ArrowRight size={16} />
            </Link>
          </motion.div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
