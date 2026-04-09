import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'PathFinder SA – Career & University Guidance',
  description: 'Discover your ideal career path and universities based on your Grade 12 results. Calculate your APS score and find the best fit for your future.',
  keywords: 'APS calculator, South Africa careers, university guidance, NSFAS, Grade 12',
  openGraph: {
    title: 'PathFinder SA',
    description: 'Your personalised career & university guide for South African learners',
    type: 'website',
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@300;400;500;600;700&family=Syne:wght@400;600;700;800&family=JetBrains+Mono:wght@400;500&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="noise-overlay">
        {children}
      </body>
    </html>
  );
}
