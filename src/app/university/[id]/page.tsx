import { notFound } from "next/navigation";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import {
  getUniversityById,
  UniversityMeta,
  UNIVERSITIES,
} from "@/data/universities";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import UniversityProspector from "@/components/ui/UniversityProspector";

export const dynamic = "force-static";

interface UniversityPageProps {
  params: { id: string };
}

export async function generateStaticParams() {
  return UNIVERSITIES.map((university) => ({
    id: university.id,
  }));
}

export default function UniversityPage({ params }: UniversityPageProps) {
  const university: UniversityMeta | undefined = getUniversityById(params.id);

  if (!university) {
    notFound();
  }

  return (
    <div className="min-h-screen bg-[#0a0a0a] grid-bg">
      <Navbar />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 pt-28 pb-20">
        {/* Back Button - styled like results page */}
        <Link
          href="/compare"
          className="inline-flex items-center gap-2 text-sm text-[#666] hover:text-[#CAFF00] transition-colors mb-8"
        >
          <ArrowLeft size={15} /> Back to Compare
        </Link>

        {/* University Header */}
        <div className="max-w-4xl mx-auto text-center space-y-6">
          <h1 className="text-3xl font-bold text-white mb-2">
            {university.name}
          </h1>
          <p className="text-xl text-[#CAFF00] mb-4">{university.location}</p>
          <p className="text-gray-400 max-w-2xl mx-auto">
            {university.description}
          </p>
        </div>

        <div className="max-w-4xl mx-auto">
          <UniversityProspector
            universityId={university.id}
            universityName={university.name}
            apsScore={30}
          />
        </div>
      </div>

      <Footer />
    </div>
  );
}
