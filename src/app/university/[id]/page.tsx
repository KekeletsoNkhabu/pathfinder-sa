import { notFound } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, Receipt, ShieldCheck, Star, MapPin } from "lucide-react";
import { getUniversityById, UNIVERSITIES } from "@/data/universities";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import UniversityProspector from "@/components/ui/UniversityProspector";
import { UNIVERSITY_FEES } from "@/data/universityFees";

export const dynamic = "force-static";

export async function generateStaticParams() {
  return UNIVERSITIES.map((u) => ({ id: u.id }));
}

export default function UniversityPage({ params }: { params: { id: string } }) {
  const university = getUniversityById(params.id);
  if (!university) notFound();

  const KZN_IDS = ["ukzn", "dut", "mut", "unizulu"];
  const feeInfo = UNIVERSITY_FEES.find(f => f.id === university.id);
  const appFee = feeInfo
    ? KZN_IDS.includes(university.id)
      ? { fee: 250, isFree: false, note: "R250 via CAO (covers UKZN, DUT, MUT & UniZulu)" }
      : { fee: feeInfo.applicationFee, isFree: feeInfo.applicationFee === 0, note: feeInfo.feeNote }
    : null;

  return (
    <div className="min-h-screen bg-[#0a0a0a] grid-bg">
      <Navbar />
      <div className="max-w-4xl mx-auto px-4 sm:px-6 pt-28 pb-20">
        <Link href="/compare" className="inline-flex items-center gap-2 text-sm text-[#666] hover:text-[#CAFF00] transition-colors mb-8">
          <ArrowLeft size={15} /> Back to Compare
        </Link>

        {/* University hero */}
        <div className="card p-8 mb-8 text-center"
          style={{ borderTop: `4px solid ${university.color}` }}>
          <h1 className="text-3xl font-bold text-white mb-1">{university.name}</h1>
          <p className="text-[#CAFF00] mb-1 flex items-center justify-center gap-1">
            <MapPin size={13} />{university.location}
          </p>
          <p className="text-[#666] max-w-2xl mx-auto mb-6 text-sm leading-relaxed">{university.description}</p>

          {/* Stats pills row */}
          <div className="flex flex-wrap items-center justify-center gap-3">
            {/* Ranking */}
            <div className="flex items-center gap-1.5 px-3 py-2 rounded-xl"
              style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)' }}>
              <Star size={12} className="text-[#CAFF00] fill-[#CAFF00]" />
              <span className="text-sm font-bold text-[#CAFF00]">#{university.ranking} SA</span>
              <span className="text-xs text-[#555]">Ranked</span>
            </div>

            {/* Min APS */}
            <div className="flex items-center gap-1.5 px-3 py-2 rounded-xl"
              style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)' }}>
              <span className="text-xs text-[#555]">Min APS</span>
              <span className="text-sm font-bold text-white">{university.minAPS}</span>
            </div>

            {/* Application fee — most prominent */}
            {appFee && (
              <div className="flex items-center gap-2 px-4 py-2 rounded-xl"
                style={appFee.isFree
                  ? { background: 'rgba(52,211,153,0.08)', border: '1px solid rgba(52,211,153,0.2)' }
                  : { background: 'rgba(251,191,36,0.08)', border: '1px solid rgba(251,191,36,0.2)' }}>
                <Receipt size={13} className={appFee.isFree ? "text-emerald-400" : "text-amber-400"} />
                <div className="text-left">
                  <p className="text-[10px] text-[#555] leading-none">Application fee</p>
                  <p className={`text-sm font-bold leading-tight ${appFee.isFree ? "text-emerald-400" : "text-amber-400"}`}>
                    {appFee.isFree ? "FREE" : `R${appFee.fee}`}
                  </p>
                </div>
                {!appFee.isFree && appFee.note && (
                  <span className="text-[9px] text-[#555] max-w-28 leading-tight">{appFee.note}</span>
                )}
              </div>
            )}

            {/* NSFAS */}
            {university.nsfasAvailable && (
              <div className="flex items-center gap-1.5 px-3 py-2 rounded-xl"
                style={{ background: 'rgba(52,211,153,0.08)', border: '1px solid rgba(52,211,153,0.2)' }}>
                <ShieldCheck size={13} className="text-emerald-400" />
                <span className="text-sm font-bold text-emerald-400">NSFAS Available</span>
              </div>
            )}
          </div>

          {/* Strengths */}
          {university.strengths.length > 0 && (
            <div className="flex flex-wrap justify-center gap-2 mt-5">
              {university.strengths.map(s => (
                <span key={s} className="text-[11px] px-2.5 py-1 rounded-lg text-[#888]"
                  style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.07)' }}>
                  {s}
                </span>
              ))}
            </div>
          )}
        </div>

        {/* Programme Prospector */}
        <UniversityProspector
          universityId={university.id}
          universityName={university.name}
          apsScore={30}
        />
      </div>
      <Footer />
    </div>
  );
}
