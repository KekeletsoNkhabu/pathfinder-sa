'use client';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { Menu, X, Compass, BarChart3, BookOpen, GitCompare } from 'lucide-react';
import { cn } from '@/utils/cn';

const NAV_LINKS = [
  { href: '/dashboard', label: 'My Profile', icon: <BarChart3 size={16} /> },
  { href: '/results', label: 'Results', icon: <Compass size={16} /> },
  { href: '/compare', label: 'Compare', icon: <GitCompare size={16} /> },
];

export default function Navbar() {
  const pathname = usePathname();
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <>
      <motion.nav
        initial={{ y: -80 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.5, ease: [0.34, 1.56, 0.64, 1] }}
        className={cn(
          'fixed top-0 left-0 right-0 z-50 transition-all duration-300',
          scrolled
            ? 'bg-[#0a0a0a]/90 backdrop-blur-xl border-b border-white/5'
            : 'bg-transparent'
        )}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <Link href="/" className="flex items-center gap-2 group">
              <div className="w-8 h-8 rounded-lg bg-[#CAFF00] flex items-center justify-center group-hover:scale-110 transition-transform">
                <Compass size={16} className="text-black" />
              </div>
              <span className="font-display font-bold text-lg text-white">
                Path<span className="text-[#CAFF00]">Finder</span>
                <span className="text-[#666] ml-1 text-sm font-normal">SA</span>
              </span>
            </Link>

            {/* Desktop nav */}
            <div className="hidden md:flex items-center gap-1">
              {NAV_LINKS.map(link => (
                <Link
                  key={link.href}
                  href={link.href}
                  className={cn(
                    'flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all',
                    pathname === link.href
                      ? 'bg-[#CAFF00]/10 text-[#CAFF00]'
                      : 'text-[#999] hover:text-white hover:bg-white/5'
                  )}
                >
                  {link.icon}
                  {link.label}
                </Link>
              ))}
            </div>

            {/* Mobile toggle */}
            <button
              onClick={() => setMobileOpen(!mobileOpen)}
              className="md:hidden p-2 rounded-lg hover:bg-white/5 transition-colors"
            >
              {mobileOpen ? <X size={20} /> : <Menu size={20} />}
            </button>
          </div>
        </div>
      </motion.nav>

      {/* Mobile menu */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="fixed top-16 left-0 right-0 z-40 bg-[#111]/95 backdrop-blur-xl border-b border-white/5 md:hidden"
          >
            <div className="px-4 py-4 flex flex-col gap-2">
              {NAV_LINKS.map(link => (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={() => setMobileOpen(false)}
                  className={cn(
                    'flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all',
                    pathname === link.href
                      ? 'bg-[#CAFF00]/10 text-[#CAFF00]'
                      : 'text-[#999] hover:text-white hover:bg-white/5'
                  )}
                >
                  {link.icon}
                  {link.label}
                </Link>
              ))}
              <Link
                href="/dashboard"
                onClick={() => setMobileOpen(false)}
                className="btn-primary text-center mt-2"
              >
                Get Started →
              </Link>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
