'use client';
import Link from 'next/link';
import { motion } from 'framer-motion';
import {
  Compass, BarChart3, University, ShieldCheck, ArrowRight,
  Sparkles, Target, TrendingUp, Users, CheckCircle2
} from 'lucide-react';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';

const STATS = [
  { value: '14+', label: 'Career Paths', icon: Target },
  { value: '10', label: 'Universities', icon: University },
  { value: '42', label: 'Max APS Score', icon: BarChart3 },
  { value: '100%', label: 'Free to Use', icon: ShieldCheck },
];

const FEATURES = [
  {
    icon: BarChart3,
    title: 'APS Calculator',
    description: 'Instantly convert your percentage marks into APS points and see your total score with a detailed breakdown.',
    color: '#CAFF00',
  },
  {
    icon: Target,
    title: 'Career Matching',
    description: 'Our matching engine analyses your subjects and APS to find careers you\'re strongly suited for—plus stretch goals.',
    color: '#86efac',
  },
  {
    icon: University as React.ElementType,
    title: 'University Rankings',
    description: 'See the top South African universities for each career path, with NSFAS availability and entry requirements.',
    color: '#93c5fd',
  },
  {
    icon: TrendingUp,
    title: 'Improvement Guide',
    description: 'Find out exactly which subject to focus on to unlock new careers and university options for your future.',
    color: '#fbbf24',
  },
];

const HOW_IT_WORKS = [
  { step: '01', title: 'Enter Your Marks', desc: 'Input your Grade 12 subjects and percentage marks.' },
  { step: '02', title: 'Get Your APS', desc: 'We calculate your APS score and show you a full breakdown.' },
  { step: '03', title: 'See Your Matches', desc: 'View careers you qualify for, sorted by match strength.' },
  { step: '04', title: 'Choose Your Path', desc: 'Compare universities and save your favourite options.' },
];

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-[#0a0a0a] grid-bg">
      <Navbar />

      {/* ── Hero ── */}
      <section className="relative pt-32 pb-20 px-4 sm:px-6 overflow-hidden">
        {/* BG glow */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[600px] pointer-events-none"
          style={{ background: 'radial-gradient(ellipse at center, rgba(202,255,0,0.07) 0%, transparent 60%)' }}
        />

        <div className="max-w-5xl mx-auto text-center relative z-10">
          {/* Tag */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-[#CAFF00]/20 bg-[#CAFF00]/5 mb-8"
          >
            <Sparkles size={14} className="text-[#CAFF00]" />
            <span className="text-xs font-semibold text-[#CAFF00] uppercase tracking-widest">For Grade 12 & Gap Year Learners</span>
          </motion.div>

          {/* Headline */}
          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1, duration: 0.6 }}
            className="font-display text-5xl sm:text-6xl md:text-7xl font-bold text-white leading-[1.05] mb-6"
          >
            Find Your
            <br />
            <span className="gradient-text">Career Path</span>
            <br />
            in South Africa
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.5 }}
            className="text-lg text-[#888] max-w-2xl mx-auto mb-10 leading-relaxed"
          >
            Calculate your APS score, discover careers you qualify for, compare top universities,
            and understand your NSFAS funding options—all in one place.
          </motion.p>

          {/* CTAs */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.5 }}
            className="flex flex-col sm:flex-row gap-3 justify-center"
          >
            <Link href="/dashboard" className="btn-primary flex items-center gap-2 justify-center text-base px-8 py-3.5 animate-pulse-lime">
              Calculate My APS
              <ArrowRight size={18} />
            </Link>
            <Link href="/compare" className="btn-secondary flex items-center gap-2 justify-center text-base px-8 py-3.5">
              Compare Universities
            </Link>
          </motion.div>

          {/* Trust line */}
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
            className="mt-6 text-[#444] text-sm flex items-center justify-center gap-2"
          >
            <CheckCircle2 size={14} className="text-[#CAFF00]" />
            Free · No sign-up · No backend · Your data stays on your device
          </motion.p>
        </div>
      </section>

      {/* ── Stats ── */}
      <section className="py-16 px-4 sm:px-6 border-y border-white/4">
        <div className="max-w-5xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-6">
          {STATS.map((stat, i) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className="text-center"
            >
              <stat.icon size={24} className="text-[#CAFF00] mx-auto mb-3 opacity-80" />
              <div className="font-display text-3xl font-bold text-white mb-1">{stat.value}</div>
              <div className="text-sm text-[#555]">{stat.label}</div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* ── Features ── */}
      <section className="py-24 px-4 sm:px-6">
        <div className="max-w-5xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="font-display text-4xl font-bold text-white mb-4">Everything You Need</h2>
            <p className="text-[#666] max-w-xl mx-auto">
              PathFinder SA gives you all the tools to make an informed decision about your future, built specifically for the South African education system.
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 gap-5">
            {FEATURES.map((feature, i) => (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="card p-6 hover:scale-[1.01] transition-transform"
              >
                <div
                  className="w-12 h-12 rounded-2xl flex items-center justify-center mb-4"
                  style={{ backgroundColor: `${feature.color}15`, border: `1px solid ${feature.color}30` }}
                >
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
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="font-display text-4xl font-bold text-white mb-4">How It Works</h2>
            <p className="text-[#666]">Four simple steps to your personalised career roadmap</p>
          </motion.div>

          <div className="grid sm:grid-cols-2 md:grid-cols-4 gap-6">
            {HOW_IT_WORKS.map((step, i) => (
              <motion.div
                key={step.step}
                initial={{ opacity: 0, y: 32 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.12 }}
                className="relative text-center"
              >
                {/* Connector line */}
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
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.5 }}
            className="text-center mt-14"
          >
            <Link href="/dashboard" className="btn-primary inline-flex items-center gap-2 text-base px-10 py-4">
              Start Now – It&apos;s Free
              <ArrowRight size={18} />
            </Link>
          </motion.div>
        </div>
      </section>

      {/* ── NSFAS Banner ── */}
      <section className="py-16 px-4 sm:px-6">
        <div className="max-w-5xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="card-lime p-8 md:p-10 flex flex-col md:flex-row items-center justify-between gap-6"
          >
            <div>
              <div className="flex items-center gap-2 mb-3">
                <ShieldCheck size={20} className="text-[#CAFF00]" />
                <span className="text-xs text-[#CAFF00] font-semibold uppercase tracking-wider">NSFAS Guidance</span>
              </div>
              <h3 className="font-display text-2xl font-bold text-white mb-2">
                Funding Your Studies
              </h3>
              <p className="text-[#777] max-w-lg">
                PathFinder SA shows you which programmes are NSFAS-funded and which universities offer funding. Household income must be below R350,000/year to qualify.
              </p>
            </div>
            <Link href="/dashboard" className="btn-primary flex-shrink-0 flex items-center gap-2 whitespace-nowrap">
              Check My Options
              <ArrowRight size={16} />
            </Link>
          </motion.div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
