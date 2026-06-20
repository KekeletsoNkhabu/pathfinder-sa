import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { personalInfo, selectedApplications, paymentRef, totalPaid, applyNsfas } = body;

    const refNumber = `PF-${Date.now()}-${Math.random().toString(36).slice(2, 6).toUpperCase()}`;

    console.log("=== NEW APPLICATION RECEIVED ===");
    console.log("Ref:", refNumber);
    console.log("Student:", personalInfo?.fullName, "—", personalInfo?.email);
    console.log("Phone:", personalInfo?.phone);
    console.log("ID Number:", personalInfo?.idNumber);
    console.log("Applying to:", selectedApplications?.map(
      (a: { universityName: string; title: string }) => `${a.universityName} — ${a.title}`
    ));
    console.log("Payment Ref:", paymentRef, "| Total:", `R${totalPaid}`);
    console.log("Apply NSFAS:", applyNsfas ? "YES (FREE)" : "No");
    console.log("================================");

    return NextResponse.json({
      success: true,
      refNumber,
      message: "Application received successfully",
      estimatedProcessingDays: 3,
    });
  } catch (err) {
    return NextResponse.json({ error: "Failed to process application", detail: String(err) }, { status: 500 });
  }
}
