// High-demand careers in South Africa
// Based on DHET, Stats SA, and labour market research 2024-2025

export interface HighDemandCareer {
  id: string;
  title: string;
  emoji: string;
  sector: string;
  demandLabel: "Critical Shortage" | "High Demand" | "Growing Fast";
  demandColor: string;
  salaryRange: { min: number; max: number }; // Annual ZAR
  reason: string; // Why it's in demand in SA
  minAPS: number;
  keySubjects: string[];
  qualificationPath: string;
}

export const HIGH_DEMAND_CAREERS: HighDemandCareer[] = [
  {
    id: "software-engineer",
    title: "Software Engineer",
    emoji: "💻",
    sector: "Technology & ICT",
    demandLabel: "Critical Shortage",
    demandColor: "#CAFF00",
    salaryRange: { min: 420000, max: 1200000 },
    reason:
      "SA has a 30,000+ developer shortage. Tech sector growing 15% annually.",
    minAPS: 28,
    keySubjects: ["Mathematics", "Physical Sciences"],
    qualificationPath: "BSc Computer Science / BEng Software",
  },
  {
    id: "data-scientist",
    title: "Data Scientist / Analyst",
    emoji: "📊",
    sector: "Technology & ICT",
    demandLabel: "Critical Shortage",
    demandColor: "#CAFF00",
    salaryRange: { min: 380000, max: 950000 },
    reason:
      "Every major SA bank, retailer and government dept is investing heavily in data.",
    minAPS: 30,
    keySubjects: ["Mathematics", "Physical Sciences"],
    qualificationPath: "BSc Statistics / Data Science / Mathematics",
  },
  {
    id: "civil-engineer",
    title: "Civil / Structural Engineer",
    emoji: "🏗️",
    sector: "Engineering & Construction",
    demandLabel: "Critical Shortage",
    demandColor: "#CAFF00",
    salaryRange: { min: 480000, max: 1100000 },
    reason:
      "R1 trillion infrastructure backlog. Government's MIG programme needs 10,000+ engineers.",
    minAPS: 34,
    keySubjects: ["Mathematics", "Physical Sciences"],
    qualificationPath: "BEng Civil / BSc Engineering",
  },
  {
    id: "medical-doctor",
    title: "Medical Doctor (MBChB)",
    emoji: "🩺",
    sector: "Health Sciences",
    demandLabel: "Critical Shortage",
    demandColor: "#CAFF00",
    salaryRange: { min: 720000, max: 2500000 },
    reason:
      "SA has only 0.9 doctors per 1,000 people vs the WHO minimum of 2.3.",
    minAPS: 42,
    keySubjects: ["Mathematics", "Physical Sciences", "Life Sciences"],
    qualificationPath:
      "MBChB (6 years) — UCT, Wits, UP, SU, UKZN, UFS, WSU, SMU, UL",
  },
  {
    id: "registered-nurse",
    title: "Registered Nurse",
    emoji: "🏥",
    sector: "Health Sciences",
    demandLabel: "High Demand",
    demandColor: "#86efac",
    salaryRange: { min: 180000, max: 520000 },
    reason:
      "Government clinics and private hospitals are critically understaffed nationwide.",
    minAPS: 24,
    keySubjects: ["Life Sciences", "English"],
    qualificationPath: "BCur (Nursing) or Diploma in Nursing",
  },
  {
    id: "electrician-engineer",
    title: "Electrical Engineer / Technician",
    emoji: "⚡",
    sector: "Engineering & Construction",
    demandLabel: "Critical Shortage",
    demandColor: "#CAFF00",
    salaryRange: { min: 360000, max: 900000 },
    reason:
      "Eskom, municipalities, and private sector desperately need electrical engineers to fix SA's grid.",
    minAPS: 28,
    keySubjects: ["Mathematics", "Physical Sciences"],
    qualificationPath: "BEng Electrical / BTech Electrical Engineering",
  },
  {
    id: "chartered-accountant",
    title: "Chartered Accountant (CA)",
    emoji: "📈",
    sector: "Finance & Commerce",
    demandLabel: "High Demand",
    demandColor: "#86efac",
    salaryRange: { min: 600000, max: 2000000 },
    reason:
      "SAICA reports a shortage of CAs, especially in public sector and small business auditing.",
    minAPS: 30,
    keySubjects: ["Mathematics", "Accounting"],
    qualificationPath: "BCom Accounting → CTA → SAICA Board Exams",
  },
  {
    id: "cybersecurity-specialist",
    title: "Cybersecurity Specialist",
    emoji: "🔐",
    sector: "Technology & ICT",
    demandLabel: "Growing Fast",
    demandColor: "#fbbf24",
    salaryRange: { min: 450000, max: 1100000 },
    reason:
      "SA is one of the top cyber-attack targets in Africa. Banking sector invests R12bn+ annually in cybersecurity.",
    minAPS: 28,
    keySubjects: ["Mathematics", "IT"],
    qualificationPath: "BSc Computer Science / BCom IT / Diploma IT",
  },
  {
    id: "social-worker",
    title: "Social Worker",
    emoji: "🤝",
    sector: "Social & Community",
    demandLabel: "Critical Shortage",
    demandColor: "#CAFF00",
    salaryRange: { min: 180000, max: 380000 },
    reason:
      "DSD reports a 60%+ vacancy rate. GBV, child welfare and substance abuse crises drive demand.",
    minAPS: 23,
    keySubjects: ["English", "Life Orientation"],
    qualificationPath: "BA Social Work (4 years) — SACSSP registered",
  },
  {
    id: "teacher",
    title: "School Teacher (STEM / Foundation Phase)",
    emoji: "📚",
    sector: "Education",
    demandLabel: "Critical Shortage",
    demandColor: "#CAFF00",
    salaryRange: { min: 200000, max: 550000 },
    reason:
      "DBE estimates 30,000 teacher vacancies. Maths, Science and Foundation Phase are most critical.",
    minAPS: 24,
    keySubjects: ["English", "Mathematics"],
    qualificationPath: "BEd (4 years) or PGCE after any degree",
  },
  {
    id: "pharmacist",
    title: "Pharmacist",
    emoji: "💊",
    sector: "Health Sciences",
    demandLabel: "High Demand",
    demandColor: "#86efac",
    salaryRange: { min: 380000, max: 800000 },
    reason:
      "SAPC reports shortages in rural areas and public hospitals. Strong private sector growth too.",
    minAPS: 30,
    keySubjects: ["Mathematics", "Physical Sciences", "Life Sciences"],
    qualificationPath: "BPharm (4 years) — UP, Wits, UWC, NWU, Rhodes",
  },
  {
    id: "quantity-surveyor",
    title: "Quantity Surveyor",
    emoji: "🏢",
    sector: "Engineering & Construction",
    demandLabel: "Growing Fast",
    demandColor: "#fbbf24",
    salaryRange: { min: 320000, max: 750000 },
    reason:
      "Construction boom driven by government infrastructure and private development projects.",
    minAPS: 26,
    keySubjects: ["Mathematics", "Physical Sciences"],
    qualificationPath: "BSc Quantity Surveying / BTech QS",
  },
];

export const DEMAND_SECTORS = [
  { id: "all", label: "All Sectors" },
  { id: "Technology & ICT", label: "Tech & ICT" },
  { id: "Health Sciences", label: "Health" },
  { id: "Engineering & Construction", label: "Engineering" },
  { id: "Finance & Commerce", label: "Finance" },
  { id: "Education", label: "Education" },
  { id: "Social & Community", label: "Social Work" },
];
