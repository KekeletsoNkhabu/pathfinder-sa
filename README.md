# PathFinder SA 🧭

A career and university guidance platform for South African Grade 12 learners and gap-year students.

## Tech Stack

- **Next.js 14** (App Router)
- **TypeScript**
- **Tailwind CSS**
- **Framer Motion** (animations)
- **Recharts** (APS charts)
- **LocalStorage** (data persistence — no backend needed)

## Features

- ✅ **APS Calculator** — convert % marks to APS points (NSC scale)
- ✅ **Career Matching Engine** — Strong / Possible / Reach classifications
- ✅ **14 Careers** with descriptions, salary ranges, requirements
- ✅ **10 South African Universities** with program-level APS requirements
- ✅ **"Can I Get In?"** Likely / Borderline / Unlikely indicators
- ✅ **University Comparison Tool** — compare up to 3 universities side-by-side
- ✅ **NSFAS Funding** badges and guidance
- ✅ **Improvement Suggestions** — which subject to improve to unlock careers
- ✅ **Alternative Careers** for each path
- ✅ **Save / Bookmark** careers and universities (LocalStorage)
- ✅ **Fully Responsive** — mobile-first, desktop-optimised
- ✅ **Smooth Animations** with Framer Motion throughout

## Getting Started

```bash
# 1. Install dependencies
npm install

# 2. Run development server
npm run dev

# 3. Open in browser
http://localhost:3000
```

## Build & Deploy to Vercel

```bash
# Build for production
npm run build

# Deploy (requires Vercel CLI)
vercel deploy
```

## Project Structure

```
src/
├── app/
│   ├── page.tsx                 # Landing page
│   ├── dashboard/page.tsx       # Student input form (3-step wizard)
│   ├── results/page.tsx         # Career matches + filters
│   ├── career/[id]/page.tsx     # Career detail page
│   └── compare/page.tsx         # University comparison tool
├── components/
│   ├── layout/                  # Navbar, Footer
│   ├── ui/                      # CareerCard, UniversityCard, APSRing, badges
│   ├── charts/                  # APSChart (bar), MarkRadar (radar)
│   └── forms/                   # SubjectForm, InterestSelector
├── data/
│   ├── careers.ts               # 14 careers dataset
│   ├── universities.ts          # 10 universities + programs
│   └── subjects.ts              # NSC subjects list
├── hooks/
│   └── useAppState.ts           # Global app state hook
├── types/
│   └── index.ts                 # All TypeScript interfaces
└── utils/
    ├── aps.ts                   # APS calculation + career matching
    ├── storage.ts               # LocalStorage utilities
    └── cn.ts                    # Tailwind class merge
```

## Data Notes

All data is static and stored in TypeScript files. No external APIs are used.
Salary ranges, APS requirements, and university rankings are indicative.
Always verify requirements directly with institutions.

## Color Theme

- **Primary:** `#CAFF00` (lime green)
- **Background:** `#0a0a0a` (near black)
- **Font Display:** Syne
- **Font Body:** Space Grotesk
