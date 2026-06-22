'use client';
import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  ShoppingCart, ArrowLeft, CheckCircle2, AlertCircle, User, Phone,
  Mail, CreditCard, FileCheck, ShieldCheck, Sparkles, X, Gift,
  Receipt, Home, Users, ChevronDown, Lock, Loader2,
} from 'lucide-react';
import Link from 'next/link';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import { useApplicationCart, MAX_APPLICATIONS } from '@/hooks/useApplicationCart';
import { UNIVERSITY_FEES } from '@/data/universityFees';
import { cn } from '@/utils/cn';

const PATHFINDER_SERVICE_FEE = 199;
const KZN_IDS = ['ukzn', 'dut', 'mut', 'unizulu'];
const SA_PROVINCES = [
  'Eastern Cape', 'Free State', 'Gauteng', 'KwaZulu-Natal',
  'Limpopo', 'Mpumalanga', 'Northern Cape', 'North West', 'Western Cape',
];
const RELATIONSHIPS = ['Parent', 'Guardian', 'Sibling', 'Aunt/Uncle', 'Grandparent', 'Other'];

interface PersonalInfo {
  fullName: string;
  idNumber: string;
  email: string;
  phone: string;
  streetAddress: string;
  city: string;
  province: string;
  postalCode: string;
  guardianName: string;
  guardianRelationship: string;
  guardianPhone: string;
  applyNsfas: boolean;
}

function buildFeeItems(items: ReturnType<typeof useApplicationCart>['items']) {
  const feeItems: { label: string; fee: number; isFree: boolean; note: string }[] = [];
  let kznAdded = false;
  for (const item of items) {
    const uid = item.recommendation.universityId.toLowerCase().trim();
    const uName = item.recommendation.universityName;
    if (KZN_IDS.includes(uid)) {
      if (!kznAdded) {
        kznAdded = true;
        feeItems.push({ label: 'CAO (KZN Universities)', fee: 250, isFree: false, note: 'Covers UKZN, DUT, MUT & UniZulu' });
      }
    } else {
      const info = UNIVERSITY_FEES.find(f => f.id === uid);
      const fee = info?.applicationFee ?? 0;
      feeItems.push({ label: uName, fee, isFree: fee === 0, note: info?.feeNote ?? 'FREE' });
    }
  }
  return feeItems;
}

export default function ApplyPage() {
  const { items, removeItem, clearCart } = useApplicationCart();
  const [info, setInfo] = useState<PersonalInfo>({
    fullName: '', idNumber: '', email: '', phone: '',
    streetAddress: '', city: '', province: '', postalCode: '',
    guardianName: '', guardianRelationship: '', guardianPhone: '',
    applyNsfas: false,
  });
  const [step, setStep] = useState<'review' | 'personal' | 'payment' | 'done'>('review');
  const [errors, setErrors] = useState<string[]>([]);
  const [submitting, setSubmitting] = useState(false);
  const [refNumber, setRefNumber] = useState('');
  const [paymentMethod, setPaymentMethod] = useState<'card' | 'eft' | 'instant_eft'>('card');
  const [provinceOpen, setProvinceOpen] = useState(false);
  const [relOpen, setRelOpen] = useState(false);

  // Fee calc
  const feeItems = buildFeeItems(items);
  const uniFeesTotal = feeItems.reduce((s, i) => s + i.fee, 0);
  const grandTotal = PATHFINDER_SERVICE_FEE + uniFeesTotal;

  const upd = (k: keyof PersonalInfo, v: string | boolean) =>
    setInfo(p => ({ ...p, [k]: v }));

  const validatePersonal = () => {
    const e: string[] = [];
    if (!info.fullName.trim()) e.push('Full name is required.');
    if (info.idNumber.length !== 13) e.push('SA ID number must be 13 digits.');
    if (!info.email.includes('@')) e.push('Valid email address is required.');
    if (info.phone.replace(/\s/g, '').length < 10) e.push('Valid cell number is required.');
    if (!info.streetAddress.trim()) e.push('Street address is required.');
    if (!info.city.trim()) e.push('City/town is required.');
    if (!info.province) e.push('Province is required.');
    setErrors(e);
    return e.length === 0;
  };

  const handlePayFast = async () => {
    setSubmitting(true);
    try {
      // 1. Save application to backend
      const res = await fetch('/api/submit-application', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          personalInfo: info,
          selectedApplications: items.map(i => i.recommendation),
          totalPaid: grandTotal,
          applyNsfas: info.applyNsfas,
          paymentMethod,
        }),
      });
      const data = await res.json();
      if (!data.success) throw new Error(data.error ?? 'Submission failed');

      const ref = data.refNumber;
      setRefNumber(ref);

      if (paymentMethod === 'eft') {
        // EFT — skip payment gateway, just confirm
        clearCart();
        setStep('done');
        setSubmitting(false);
        return;
      }

      // 2. Build PayFast form and auto-submit
      // PayFast sandbox: https://sandbox.payfast.co.za/eng/process
      // PayFast live: https://www.payfast.co.za/eng/process
      const PAYFAST_URL = 'https://sandbox.payfast.co.za/eng/process';
      const form = document.createElement('form');
      form.method = 'POST';
      form.action = PAYFAST_URL;

      const fields: Record<string, string> = {
        merchant_id: '10000100',          // ← Replace with your PayFast merchant ID
        merchant_key: '46f0cd694581a',    // ← Replace with your PayFast merchant key
        return_url: `${window.location.origin}/apply/success?ref=${ref}`,
        cancel_url: `${window.location.origin}/apply`,
        notify_url: `${window.location.origin}/api/payfast-notify`,
        name_first: info.fullName.split(' ')[0] || info.fullName,
        name_last: info.fullName.split(' ').slice(1).join(' ') || '-',
        email_address: info.email,
        cell_number: info.phone.replace(/\s/g, ''),
        m_payment_id: ref,
        amount: grandTotal.toFixed(2),
        item_name: `PathFinder SA Application Service (${items.length} universities)`,
        item_description: items.map(i => i.recommendation.universityName).join(', '),
        payment_method: paymentMethod === 'instant_eft' ? 'eft' : 'cc',
      };

      for (const [key, value] of Object.entries(fields)) {
        const input = document.createElement('input');
        input.type = 'hidden';
        input.name = key;
        input.value = value;
        form.appendChild(input);
      }

      document.body.appendChild(form);
      clearCart();
      form.submit();
    } catch (err) {
      setErrors([err instanceof Error ? err.message : 'Something went wrong. Please try again.']);
      setSubmitting(false);
    }
  };

  if (items.length === 0 && step !== 'done') {
    return (
      <div className="min-h-screen bg-[#0a0a0a] grid-bg">
        <Navbar />
        <div className="max-w-2xl mx-auto px-4 pt-32 pb-20 text-center">
          <ShoppingCart size={48} className="text-[#333] mx-auto mb-6" />
          <h1 className="text-2xl font-bold text-white mb-3">Your cart is empty</h1>
          <p className="text-[#666] mb-8">Add courses from your results page to apply.</p>
          <Link href="/results" className="btn-primary">View My Results</Link>
        </div>
        <Footer />
      </div>
    );
  }

  // Shared order summary sidebar
  const OrderSummary = () => (
    <div className="space-y-4">
      {/* Selected courses */}
      <div className="card p-4">
        <h3 className="text-xs font-bold text-[#CAFF00] uppercase tracking-wider mb-3">
          Your Applications ({items.length}/{MAX_APPLICATIONS})
        </h3>
        <div className="space-y-2.5">
          {items.map(item => (
            <div key={item.recommendation.id} className="flex items-center gap-2">
              <span className="text-lg flex-shrink-0">{item.recommendation.emoji}</span>
              <div className="flex-1 min-w-0">
                <p className="text-xs font-semibold text-white truncate">{item.recommendation.title}</p>
                <p className="text-[10px] text-[#555] truncate">{item.recommendation.universityName}</p>
              </div>
              {step === 'review' && (
                <button onClick={() => removeItem(item.recommendation.id)}
                  className="text-[#444] hover:text-red-400 transition-colors flex-shrink-0">
                  <X size={12} />
                </button>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Cost breakdown */}
      <div className="card p-4">
        <h3 className="text-xs font-bold text-white uppercase tracking-wider mb-3 flex items-center gap-1.5">
          <Receipt size={12} className="text-[#CAFF00]" /> Cost Breakdown
        </h3>
        <div className="space-y-2">
          <div className="flex justify-between text-sm">
            <span className="text-[#666]">PathFinder service fee</span>
            <span className="text-white font-semibold">R{PATHFINDER_SERVICE_FEE}</span>
          </div>
          {feeItems.map((fi, i) => (
            <div key={i} className="flex justify-between text-sm">
              <div className="flex-1 min-w-0 mr-2">
                <p className="text-[#666] truncate">{fi.label}</p>
                {fi.note && !fi.isFree && fi.note !== fi.label && (
                  <p className="text-[9px] text-[#444] truncate">{fi.note}</p>
                )}
              </div>
              {fi.isFree
                ? <span className="text-emerald-400 font-semibold flex-shrink-0">FREE</span>
                : <span className="text-amber-400 font-semibold flex-shrink-0">R{fi.fee}</span>
              }
            </div>
          ))}
          {info.applyNsfas && (
            <div className="flex justify-between text-sm">
              <span className="text-[#666] flex items-center gap-1"><Gift size={10} /> NSFAS application</span>
              <span className="text-emerald-400 font-semibold">FREE</span>
            </div>
          )}
          <div className="flex justify-between pt-3 mt-1" style={{ borderTop: '1px solid rgba(255,255,255,0.08)' }}>
            <span className="font-bold text-white">Total</span>
            <span className="text-xl font-bold text-[#CAFF00]">R {grandTotal.toFixed(2)}</span>
          </div>
        </div>
      </div>

      {/* What's included */}
      <div className="card p-4">
        <h3 className="text-xs font-bold text-[#555] uppercase tracking-wider mb-3">What&apos;s Included</h3>
        {[
          'Applications to up to 3 universities',
          'Document verification & formatting',
          'Application portal submissions',
          'Progress tracking & updates',
          'WhatsApp & email support',
          'Status alerts when results are out',
        ].map(item => (
          <div key={item} className="flex items-center gap-2 py-1">
            <CheckCircle2 size={11} className="text-[#CAFF00] flex-shrink-0" />
            <span className="text-xs text-[#777]">{item}</span>
          </div>
        ))}
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-[#0a0a0a] grid-bg">
      <Navbar />
      <div className="max-w-6xl mx-auto px-4 sm:px-6 pt-28 pb-20">
        <Link href="/results" className="inline-flex items-center gap-2 text-sm text-[#666] hover:text-[#CAFF00] mb-8">
          <ArrowLeft size={15} /> Back to Results
        </Link>

        {/* ── DONE ── */}
        {step === 'done' && (
          <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="max-w-2xl mx-auto card p-10 text-center">
            <div className="w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6"
              style={{ background: 'rgba(202,255,0,0.1)', border: '1px solid rgba(202,255,0,0.3)' }}>
              <CheckCircle2 size={40} className="text-[#CAFF00]" />
            </div>
            <h1 className="text-3xl font-bold text-white mb-3">Application Submitted!</h1>
            <p className="text-[#666] mb-2">Your reference number:</p>
            <p className="text-2xl font-mono font-bold text-[#CAFF00] mb-6">{refNumber}</p>
            <div className="card-lime p-5 text-left mb-6 space-y-2.5">
              {[
                "We'll complete and submit your applications within 3 working days.",
                `We'll send all updates to ${info.email}.`,
                info.applyNsfas ? "Your NSFAS application will also be submitted — free of charge." : null,
              ].filter(Boolean).map((msg, i) => (
                <div key={i} className="flex items-start gap-2.5">
                  <CheckCircle2 size={14} className="text-[#CAFF00] mt-0.5 flex-shrink-0" />
                  <p className="text-sm text-[#aaa]">{msg}</p>
                </div>
              ))}
            </div>
            <Link href="/dashboard" className="btn-secondary">← Back to Dashboard</Link>
          </motion.div>
        )}

        {step !== 'done' && (
          <div className="grid lg:grid-cols-[1fr_340px] gap-6 items-start">
            {/* ── Left: main form ── */}
            <div>
              {/* ── REVIEW ── */}
              {step === 'review' && (
                <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
                  <h1 className="text-3xl font-bold text-white mb-1">Review Your Application</h1>
                  <p className="text-[#666] mb-8 text-sm">Confirm your courses and total cost before proceeding.</p>

                  {/* NSFAS opt-in */}
                  <div className="card p-5 mb-5 cursor-pointer transition-all hover:border-white/12"
                    style={info.applyNsfas ? { background: 'rgba(202,255,0,0.03)', borderColor: 'rgba(202,255,0,0.2)' } : {}}
                    onClick={() => upd('applyNsfas', !info.applyNsfas)}>
                    <div className="flex items-start gap-3">
                      <div className="w-5 h-5 rounded border-2 flex items-center justify-center flex-shrink-0 mt-0.5 transition-all"
                        style={info.applyNsfas
                          ? { borderColor: '#CAFF00', background: '#CAFF00' }
                          : { borderColor: '#444' }}>
                        {info.applyNsfas && <CheckCircle2 size={12} className="text-black" />}
                      </div>
                      <div>
                        <p className="text-sm font-semibold text-white flex items-center gap-2">
                          Also apply for NSFAS for me
                          <span className="text-[10px] font-bold text-emerald-400 px-2 py-0.5 rounded-full"
                            style={{ background: 'rgba(52,211,153,0.1)' }}>FREE</span>
                        </p>
                        <p className="text-xs text-[#666] mt-1">
                          Household income under R350,000/year? You may qualify for full funding covering tuition, accommodation & meals. We apply for you at no extra cost.
                        </p>
                      </div>
                    </div>
                  </div>

                  <button onClick={() => setStep('personal')}
                    className="btn-primary w-full flex items-center justify-center gap-2 py-4 text-base">
                    Continue to Personal Details <ArrowLeft size={16} className="rotate-180" />
                  </button>
                </motion.div>
              )}

              {/* ── PERSONAL INFO ── */}
              {step === 'personal' && (
                <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
                  <h1 className="text-3xl font-bold text-white mb-1">Your Details</h1>
                  <p className="text-[#666] mb-6 text-sm">Required to complete your applications accurately.</p>

                  <div className="card p-6 mb-4 space-y-5">
                    <h2 className="text-sm font-bold text-[#CAFF00] uppercase tracking-wider flex items-center gap-2">
                      <User size={14} /> Personal Information
                    </h2>
                    <div className="grid sm:grid-cols-2 gap-4">
                      <div className="sm:col-span-2">
                        <label className="block text-xs text-[#666] mb-1.5 font-medium">Full Name (as on ID) *</label>
                        <input value={info.fullName} onChange={e => upd('fullName', e.target.value)}
                          placeholder="e.g. Thabo Sipho Nkosi" className="input-field" />
                      </div>
                      <div>
                        <label className="block text-xs text-[#666] mb-1.5 font-medium flex items-center gap-1">
                          <CreditCard size={11} /> SA ID Number *
                        </label>
                        <input value={info.idNumber}
                          onChange={e => upd('idNumber', e.target.value.replace(/\D/g, '').slice(0, 13))}
                          placeholder="13-digit ID number" className="input-field font-mono tracking-widest" maxLength={13} />
                        <p className="text-[10px] text-[#444] mt-1">{info.idNumber.length}/13 digits</p>
                      </div>
                      <div>
                        <label className="block text-xs text-[#666] mb-1.5 font-medium flex items-center gap-1">
                          <Phone size={11} /> Cell Number *
                        </label>
                        <input value={info.phone} onChange={e => upd('phone', e.target.value)}
                          placeholder="e.g. 0712345678" className="input-field" type="tel" />
                      </div>
                      <div className="sm:col-span-2">
                        <label className="block text-xs text-[#666] mb-1.5 font-medium flex items-center gap-1">
                          <Mail size={11} /> Email Address *
                        </label>
                        <input value={info.email} onChange={e => upd('email', e.target.value)}
                          placeholder="your@email.com" className="input-field" type="email" />
                      </div>
                    </div>
                  </div>

                  <div className="card p-6 mb-4 space-y-4">
                    <h2 className="text-sm font-bold text-[#CAFF00] uppercase tracking-wider flex items-center gap-2">
                      <Home size={14} /> Home Address
                    </h2>
                    <div>
                      <label className="block text-xs text-[#666] mb-1.5 font-medium">Street Address *</label>
                      <input value={info.streetAddress} onChange={e => upd('streetAddress', e.target.value)}
                        placeholder="e.g. 25 Tshiame A" className="input-field" />
                    </div>
                    <div className="grid sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-xs text-[#666] mb-1.5 font-medium">City/Town *</label>
                        <input value={info.city} onChange={e => upd('city', e.target.value)}
                          placeholder="e.g. Bloemfontein" className="input-field" />
                      </div>
                      {/* Custom province dropdown */}
                      <div className="relative">
                        <label className="block text-xs text-[#666] mb-1.5 font-medium">Province *</label>
                        <button type="button"
                          onClick={() => setProvinceOpen(!provinceOpen)}
                          className="input-field flex items-center justify-between text-left"
                          style={info.province ? {} : { color: '#444' }}>
                          <span>{info.province || 'Select a province'}</span>
                          <ChevronDown size={14} className="text-[#555] flex-shrink-0"
                            style={{ transform: provinceOpen ? 'rotate(180deg)' : undefined, transition: 'transform 0.2s' }} />
                        </button>
                        {provinceOpen && (
                          <div className="absolute top-full left-0 right-0 mt-1 z-50 rounded-xl overflow-hidden"
                            style={{ background: '#1a1a1a', border: '1px solid rgba(255,255,255,0.1)', boxShadow: '0 20px 40px rgba(0,0,0,0.6)' }}>
                            {SA_PROVINCES.map(p => (
                              <button key={p} type="button"
                                onClick={() => { upd('province', p); setProvinceOpen(false); }}
                                className="w-full text-left px-4 py-2.5 text-sm transition-colors"
                                style={{ color: info.province === p ? '#CAFF00' : '#bbb',
                                  background: info.province === p ? 'rgba(202,255,0,0.08)' : 'transparent' }}
                                onMouseEnter={e => { if (info.province !== p) (e.currentTarget as HTMLButtonElement).style.background = 'rgba(255,255,255,0.05)'; }}
                                onMouseLeave={e => { if (info.province !== p) (e.currentTarget as HTMLButtonElement).style.background = 'transparent'; }}
                              >
                                {p}
                              </button>
                            ))}
                          </div>
                        )}
                      </div>
                    </div>
                    <div className="sm:w-1/2">
                      <label className="block text-xs text-[#666] mb-1.5 font-medium">Postal Code</label>
                      <input value={info.postalCode} onChange={e => upd('postalCode', e.target.value.replace(/\D/g, '').slice(0, 4))}
                        placeholder="e.g. 9300" className="input-field" maxLength={4} />
                    </div>
                  </div>

                  <div className="card p-6 mb-4 space-y-4">
                    <h2 className="text-sm font-bold text-[#CAFF00] uppercase tracking-wider flex items-center gap-2">
                      <Users size={14} /> Parent / Guardian <span className="text-[#444] font-normal normal-case tracking-normal">(optional but recommended)</span>
                    </h2>
                    <div className="grid sm:grid-cols-2 gap-4">
                      <div className="sm:col-span-2">
                        <label className="block text-xs text-[#666] mb-1.5 font-medium">Guardian Full Name</label>
                        <input value={info.guardianName} onChange={e => upd('guardianName', e.target.value)}
                          placeholder="e.g. Kekeletso Nkhabu" className="input-field" />
                      </div>
                      {/* Relationship dropdown */}
                      <div className="relative">
                        <label className="block text-xs text-[#666] mb-1.5 font-medium">Relationship</label>
                        <button type="button"
                          onClick={() => setRelOpen(!relOpen)}
                          className="input-field flex items-center justify-between text-left"
                          style={info.guardianRelationship ? {} : { color: '#444' }}>
                          <span>{info.guardianRelationship || 'Select relationship'}</span>
                          <ChevronDown size={14} className="text-[#555] flex-shrink-0"
                            style={{ transform: relOpen ? 'rotate(180deg)' : undefined, transition: 'transform 0.2s' }} />
                        </button>
                        {relOpen && (
                          <div className="absolute top-full left-0 right-0 mt-1 z-50 rounded-xl overflow-hidden"
                            style={{ background: '#1a1a1a', border: '1px solid rgba(255,255,255,0.1)', boxShadow: '0 20px 40px rgba(0,0,0,0.6)' }}>
                            {RELATIONSHIPS.map(r => (
                              <button key={r} type="button"
                                onClick={() => { upd('guardianRelationship', r); setRelOpen(false); }}
                                className="w-full text-left px-4 py-2.5 text-sm transition-colors"
                                style={{ color: info.guardianRelationship === r ? '#CAFF00' : '#bbb',
                                  background: info.guardianRelationship === r ? 'rgba(202,255,0,0.08)' : 'transparent' }}
                                onMouseEnter={e => { if (info.guardianRelationship !== r) (e.currentTarget as HTMLButtonElement).style.background = 'rgba(255,255,255,0.05)'; }}
                                onMouseLeave={e => { if (info.guardianRelationship !== r) (e.currentTarget as HTMLButtonElement).style.background = 'transparent'; }}
                              >
                                {r}
                              </button>
                            ))}
                          </div>
                        )}
                      </div>
                      <div>
                        <label className="block text-xs text-[#666] mb-1.5 font-medium">Guardian Phone</label>
                        <input value={info.guardianPhone} onChange={e => upd('guardianPhone', e.target.value)}
                          placeholder="e.g. 0812345678" className="input-field" type="tel" />
                      </div>
                    </div>
                  </div>

                  {/* Privacy */}
                  <div className="flex items-start gap-2.5 p-4 rounded-xl mb-5"
                    style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.06)' }}>
                    <ShieldCheck size={14} className="text-[#CAFF00] mt-0.5 flex-shrink-0" />
                    <p className="text-xs text-[#666] leading-relaxed">
                      Your information is used <strong className="text-[#aaa]">only</strong> to complete your university applications.
                      We never sell or share your data. Deleted securely after your applications are submitted.
                    </p>
                  </div>

                  <AnimatePresence>
                    {errors.length > 0 && (
                      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                        className="flex items-start gap-2 p-3 rounded-xl mb-4"
                        style={{ background: 'rgba(248,113,113,0.05)', border: '1px solid rgba(248,113,113,0.2)' }}>
                        <AlertCircle size={15} className="text-red-400 flex-shrink-0 mt-0.5" />
                        <div className="text-sm text-red-400 space-y-0.5">
                          {errors.map((e, i) => <div key={i}>{e}</div>)}
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>

                  <div className="flex gap-3">
                    <button onClick={() => setStep('review')} className="btn-secondary">← Back</button>
                    <button onClick={() => { if (validatePersonal()) setStep('payment'); }}
                      className="btn-primary flex-1 flex items-center justify-center gap-2 py-3">
                      <FileCheck size={15} /> Continue to Payment
                    </button>
                  </div>
                </motion.div>
              )}

              {/* ── PAYMENT ── */}
              {step === 'payment' && (
                <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
                  <h1 className="text-3xl font-bold text-white mb-1">Payment</h1>
                  <p className="text-[#666] mb-6 text-sm">Secure payment powered by PayFast — SA&apos;s trusted payment gateway.</p>

                  {/* Payment method selector */}
                  <div className="card p-5 mb-5">
                    <h2 className="text-sm font-bold text-white mb-4 flex items-center gap-2">
                      <CreditCard size={14} className="text-[#CAFF00]" /> Choose Payment Method
                    </h2>
                    <div className="space-y-2">
                      {([
                        { id: 'card', label: 'Credit / Debit Card', sub: 'Visa, Mastercard — secure card payment via PayFast', icon: '💳' },
                        { id: 'instant_eft', label: 'Instant EFT', sub: 'Pay directly from your bank account via PayFast', icon: '🏦' },
                        { id: 'eft', label: 'Manual EFT / Cash Deposit', sub: "We'll email you our banking details — application held until payment clears", icon: '📋' },
                      ] as const).map(opt => (
                        <button key={opt.id} type="button"
                          onClick={() => setPaymentMethod(opt.id)}
                          className="w-full flex items-start gap-3 p-4 rounded-xl transition-all text-left"
                          style={paymentMethod === opt.id
                            ? { background: 'rgba(202,255,0,0.06)', border: '1px solid rgba(202,255,0,0.25)' }
                            : { background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.08)' }}>
                          <span className="text-xl flex-shrink-0 mt-0.5">{opt.icon}</span>
                          <div className="flex-1">
                            <p className={`text-sm font-semibold ${paymentMethod === opt.id ? 'text-[#CAFF00]' : 'text-white'}`}>{opt.label}</p>
                            <p className="text-xs text-[#555] mt-0.5">{opt.sub}</p>
                          </div>
                          <div className="w-4 h-4 rounded-full border-2 flex-shrink-0 mt-1 flex items-center justify-center"
                            style={paymentMethod === opt.id
                              ? { borderColor: '#CAFF00', background: '#CAFF00' }
                              : { borderColor: '#444' }}>
                            {paymentMethod === opt.id && <div className="w-1.5 h-1.5 rounded-full bg-black" />}
                          </div>
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* PayFast trust banner */}
                  <div className="flex items-center gap-3 p-4 rounded-xl mb-5"
                    style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.06)' }}>
                    <Lock size={14} className="text-[#CAFF00] flex-shrink-0" />
                    <p className="text-xs text-[#555]">
                      Payments secured by{' '}
                      <strong className="text-[#CAFF00]">PayFast</strong> — South Africa&apos;s leading payment provider.
                      Your card details are never stored by PathFinder SA.
                    </p>
                  </div>

                  <AnimatePresence>
                    {errors.length > 0 && (
                      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                        className="flex items-start gap-2 p-3 rounded-xl mb-4"
                        style={{ background: 'rgba(248,113,113,0.05)', border: '1px solid rgba(248,113,113,0.2)' }}>
                        <AlertCircle size={15} className="text-red-400 flex-shrink-0 mt-0.5" />
                        <div className="text-sm text-red-400">
                          {errors.map((e, i) => <div key={i}>{e}</div>)}
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>

                  <div className="flex gap-3">
                    <button onClick={() => setStep('personal')} className="btn-secondary">← Back</button>
                    <button onClick={handlePayFast} disabled={submitting}
                      className="btn-primary flex-1 flex items-center justify-center gap-2 py-4 text-base">
                      {submitting ? (
                        <><Loader2 size={16} className="animate-spin" /> Processing…</>
                      ) : paymentMethod === 'eft' ? (
                        <><FileCheck size={16} /> Submit & Get EFT Details</>
                      ) : (
                        <><Lock size={16} /> Pay R{grandTotal.toFixed(2)} via PayFast</>
                      )}
                    </button>
                  </div>
                  <p className="text-[10px] text-[#444] text-center mt-3">
                    {paymentMethod !== 'eft'
                      ? 'You will be redirected to PayFast to complete your payment securely.'
                      : 'We will email banking details to ' + info.email + ' within 1 hour.'}
                  </p>
                </motion.div>
              )}
            </div>

            {/* ── Right: order summary ── */}
            <div className="sticky top-28">
              <OrderSummary />
            </div>
          </div>
        )}
      </div>
      <Footer />
    </div>
  );
}
