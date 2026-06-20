// University application fees for all 26 SA universities
// Last verified: June 2026
// Sources: Varsity Wise, University Info, individual university websites

export interface UniversityFeeInfo {
  id: string;
  shortName: string;
  fullName: string;
  applicationFee: number; // 0 = free
  feeNote: string;
  appMethod: "direct" | "cao" | "both";
  caoFee?: number; // CAO application fee if applicable
  feeWaiver?: string;
  province: string;
}

export const UNIVERSITY_FEES: UniversityFeeInfo[] = [
  {
    id: "uct",
    shortName: "UCT",
    fullName: "University of Cape Town",
    applicationFee: 100,
    feeNote: "R100 for SA/SADC applicants (online)",
    appMethod: "direct",
    province: "Western Cape",
  },
  {
    id: "wits",
    shortName: "Wits",
    fullName: "University of the Witwatersrand",
    applicationFee: 0,
    feeNote: "FREE online application",
    appMethod: "direct",
    province: "Gauteng",
  },
  {
    id: "up",
    shortName: "UP",
    fullName: "University of Pretoria",
    applicationFee: 135,
    feeNote: "R135 for SA applicants (online)",
    appMethod: "direct",
    province: "Gauteng",
  },
  {
    id: "stellenbosch",
    shortName: "SU",
    fullName: "Stellenbosch University",
    applicationFee: 100,
    feeNote: "R100 for SA applicants (online)",
    appMethod: "direct",
    province: "Western Cape",
  },
  {
    id: "uj",
    shortName: "UJ",
    fullName: "University of Johannesburg",
    applicationFee: 0,
    feeNote: "FREE online application (R200 manual)",
    appMethod: "direct",
    feeWaiver: "Free online",
    province: "Gauteng",
  },
  {
    id: "ukzn",
    shortName: "UKZN",
    fullName: "University of KwaZulu-Natal",
    applicationFee: 210,
    feeNote: "R210 direct (or R250 via CAO covering 4 KZN universities)",
    appMethod: "cao",
    caoFee: 250,
    province: "KwaZulu-Natal",
  },
  {
    id: "nwu",
    shortName: "NWU",
    fullName: "North-West University",
    applicationFee: 0,
    feeNote: "FREE online application",
    appMethod: "direct",
    province: "North West",
  },
  {
    id: "unisa",
    shortName: "UNISA",
    fullName: "University of South Africa",
    applicationFee: 0,
    feeNote: "FREE — distance learning university",
    appMethod: "direct",
    province: "Gauteng",
  },
  {
    id: "tut",
    shortName: "TUT",
    fullName: "Tshwane University of Technology",
    applicationFee: 0,
    feeNote: "FREE online application",
    appMethod: "direct",
    province: "Gauteng",
  },
  {
    id: "ufs",
    shortName: "UFS",
    fullName: "University of the Free State",
    applicationFee: 0,
    feeNote: "FREE online application",
    appMethod: "direct",
    province: "Free State",
  },
  {
    id: "rhodes",
    shortName: "Rhodes",
    fullName: "Rhodes University",
    applicationFee: 0,
    feeNote: "FREE online application",
    appMethod: "direct",
    province: "Eastern Cape",
  },
  {
    id: "cput",
    shortName: "CPUT",
    fullName: "Cape Peninsula University of Technology",
    applicationFee: 0,
    feeNote: "FREE online (R200 manual/paper)",
    appMethod: "direct",
    feeWaiver: "Free online",
    province: "Western Cape",
  },
  {
    id: "dut",
    shortName: "DUT",
    fullName: "Durban University of Technology",
    applicationFee: 250,
    feeNote: "R250 via CAO (covers 4 KZN universities)",
    appMethod: "cao",
    caoFee: 250,
    province: "KwaZulu-Natal",
  },
  {
    id: "uwc",
    shortName: "UWC",
    fullName: "University of the Western Cape",
    applicationFee: 0,
    feeNote: "FREE online application",
    appMethod: "direct",
    province: "Western Cape",
  },
  {
    id: "unizulu",
    shortName: "UniZulu",
    fullName: "University of Zululand",
    applicationFee: 250,
    feeNote: "R250 via CAO (covers 4 KZN universities)",
    appMethod: "cao",
    caoFee: 250,
    province: "KwaZulu-Natal",
  },
  {
    id: "ufh",
    shortName: "UFH",
    fullName: "University of Fort Hare",
    applicationFee: 0,
    feeNote: "FREE online application",
    appMethod: "direct",
    province: "Eastern Cape",
  },
  {
    id: "wsu",
    shortName: "WSU",
    fullName: "Walter Sisulu University",
    applicationFee: 0,
    feeNote: "FREE online application",
    appMethod: "direct",
    province: "Eastern Cape",
  },
  {
    id: "mut",
    shortName: "MUT",
    fullName: "Mangosuthu University of Technology",
    applicationFee: 250,
    feeNote: "R250 via CAO (covers 4 KZN universities)",
    appMethod: "cao",
    caoFee: 250,
    province: "KwaZulu-Natal",
  },
  {
    id: "smu",
    shortName: "SMU",
    fullName: "Sefako Makgatho Health Sciences University",
    applicationFee: 0,
    feeNote: "FREE online application",
    appMethod: "direct",
    province: "Gauteng",
  },
  {
    id: "spu",
    shortName: "SPU",
    fullName: "Sol Plaatje University",
    applicationFee: 0,
    feeNote: "FREE online application",
    appMethod: "direct",
    province: "Northern Cape",
  },
  {
    id: "ump",
    shortName: "UMP",
    fullName: "University of Mpumalanga",
    applicationFee: 300,
    feeNote: "R300 application fee",
    appMethod: "direct",
    province: "Mpumalanga",
  },
  {
    id: "vut",
    shortName: "VUT",
    fullName: "Vaal University of Technology",
    applicationFee: 0,
    feeNote: "FREE online application",
    appMethod: "direct",
    province: "Gauteng",
  },
  {
    id: "cut",
    shortName: "CUT",
    fullName: "Central University of Technology",
    applicationFee: 0,
    feeNote: "FREE online application",
    appMethod: "direct",
    province: "Free State",
  },
  {
    id: "ul",
    shortName: "UL",
    fullName: "University of Limpopo",
    applicationFee: 200,
    feeNote: "R200 application fee",
    appMethod: "direct",
    province: "Limpopo",
  },
  {
    id: "univen",
    shortName: "UNIVEN",
    fullName: "University of Venda",
    applicationFee: 0,
    feeNote: "FREE online application",
    appMethod: "direct",
    province: "Limpopo",
  },
];

// Get fee info for a specific university
export function getUniversityFee(
  universityId: string,
): UniversityFeeInfo | undefined {
  return UNIVERSITY_FEES.find((u) => u.id === universityId);
}

// Calculate total university application fees the learner would pay
export function calculateTotalAppFees(universityIds: string[]): {
  total: number;
  breakdown: { university: string; fee: number; note: string }[];
  caoSaving?: number;
} {
  const kznUniversities = ["ukzn", "dut", "mut", "unizulu"];
  const selectedKZN = universityIds.filter((id) =>
    kznUniversities.includes(id),
  );

  let total = 0;
  const breakdown: { university: string; fee: number; note: string }[] = [];
  let caoAlreadyCounted = false;

  for (const id of universityIds) {
    const fee = getUniversityFee(id);
    if (!fee) continue;

    if (kznUniversities.includes(id) && selectedKZN.length > 0) {
      // KZN universities share a single CAO fee
      if (!caoAlreadyCounted) {
        caoAlreadyCounted = true;
        total += 250;
        breakdown.push({
          university: `KZN Universities (${selectedKZN.join(", ").toUpperCase()})`,
          fee: 250,
          note: "Single CAO fee covers all 4 KZN universities",
        });
      }
    } else {
      total += fee.applicationFee;
      breakdown.push({
        university: fee.shortName,
        fee: fee.applicationFee,
        note: fee.feeNote,
      });
    }
  }

  return { total, breakdown };
}
