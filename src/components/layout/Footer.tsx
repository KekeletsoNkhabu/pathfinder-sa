import Link from 'next/link';
import { Compass, Heart } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="border-t border-white/5 mt-24 py-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
          <Link href="/" className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-lg bg-[#CAFF00] flex items-center justify-center">
              <Compass size={14} className="text-black" />
            </div>
            <span className="font-display font-bold text-white">
              Path<span className="text-[#CAFF00]">Finder</span>
              <span className="text-[#555] ml-1 text-xs font-normal">SA</span>
            </span>
          </Link>
          <p className="text-[#555] text-sm flex items-center gap-1.5">
            Made with <Heart size={12} className="text-[#CAFF00]" /> for South African learners
          </p>
          <div className="flex gap-4 text-sm text-[#555]">
            <Link href="/dashboard" className="hover:text-[#CAFF00] transition-colors">Dashboard</Link>
            <Link href="/results" className="hover:text-[#CAFF00] transition-colors">Results</Link>
            <Link href="/compare" className="hover:text-[#CAFF00] transition-colors">Compare</Link>
          </div>
        </div>
        <p className="text-center text-[#333] text-xs mt-6">
          Data is indicative only. Always verify APS requirements directly with institutions.
          NSFAS eligibility subject to income criteria. © {new Date().getFullYear()} PathFinder SA
        </p>
      </div>
    </footer>
  );
}
