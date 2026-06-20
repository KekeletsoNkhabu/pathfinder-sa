'use client';
import { useSearchParams } from 'next/navigation';
import { Suspense } from 'react';
import Link from 'next/link';
import { CheckCircle2 } from 'lucide-react';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';

function SuccessContent() {
  const params = useSearchParams();
  const ref = params.get('ref') ?? '';
  return (
    <div className="max-w-2xl mx-auto px-4 pt-32 pb-20 text-center">
      <div className="w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6"
        style={{ background: 'rgba(202,255,0,0.1)', border: '1px solid rgba(202,255,0,0.3)' }}>
        <CheckCircle2 size={40} className="text-[#CAFF00]" />
      </div>
      <h1 className="text-3xl font-bold text-white mb-3">Payment Successful!</h1>
      {ref && <p className="text-[#CAFF00] font-mono text-lg mb-2">{ref}</p>}
      <p className="text-[#666] mb-8">Your application has been received and payment confirmed. We'll start processing within 24 hours and email you updates.</p>
      <Link href="/dashboard" className="btn-secondary">← Back to Dashboard</Link>
    </div>
  );
}

export default function SuccessPage() {
  return (
    <div className="min-h-screen bg-[#0a0a0a] grid-bg">
      <Navbar />
      <Suspense fallback={<div className="pt-32 text-center text-[#555]">Loading…</div>}>
        <SuccessContent />
      </Suspense>
      <Footer />
    </div>
  );
}
