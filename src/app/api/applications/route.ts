import { NextRequest, NextResponse } from "next/server";

// In production: save to a database (Supabase, PlanetScale, MongoDB Atlas, etc.)
// and send yourself an email notification via Resend/SendGrid
// For now: logs everything + returns a reference number

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const {
      personalInfo,
      selectedApplications,
      documents,
      paymentRef,
      totalPaid,
    } = body;

    // Generate a unique reference number
    const refNumber = `PF-${Date.now()}-${Math.random()
      .toString(36)
      .slice(2, 6)
      .toUpperCase()}`;

    // ── In production, replace this block with your DB insert ──────────────
    // Example with Supabase:
    // const { error } = await supabase.from('applications').insert({
    //   ref_number: refNumber,
    //   student_name: personalInfo.fullName,
    //   student_email: personalInfo.email,
    //   student_phone: personalInfo.phone,
    //   id_number: personalInfo.idNumber,
    //   applications: selectedApplications,
    //   payment_ref: paymentRef,
    //   total_paid: totalPaid,
    //   status: 'pending',
    //   created_at: new Date().toISOString(),
    // });
    //
    // Example email to yourself via Resend:
    // await resend.emails.send({
    //   from: 'noreply@yourapp.co.za',
    //   to: 'you@youremail.co.za',
    //   subject: `New Application: ${personalInfo.fullName} — ${refNumber}`,
    //   html: `<h2>New application received</h2><pre>${JSON.stringify(body, null, 2)}</pre>`
    // });
    // ────────────────────────────────────────────────────────────────────────

    // For now: log to console (visible in your terminal / Vercel logs)
    console.log("=== NEW APPLICATION RECEIVED ===");
    console.log("Ref:", refNumber);
    console.log("Student:", personalInfo?.fullName, "—", personalInfo?.email);
    console.log("Phone:", personalInfo?.phone);
    console.log("ID Number:", personalInfo?.idNumber);
    console.log(
      "Applying to:",
      selectedApplications?.map(
        (a: { universityName: string; title: string }) =>
          `${a.universityName} — ${a.title}`,
      ),
    );
    console.log("Payment Ref:", paymentRef, "| Total:", `R${totalPaid}`);
    console.log("================================");

    return NextResponse.json({
      success: true,
      refNumber,
      message: "Application received successfully",
      estimatedProcessingDays: 3,
    });
  } catch (err) {
    console.error("Application submission error:", err);
    return NextResponse.json(
      { error: "Failed to process application", detail: String(err) },
      { status: 500 },
    );
  }
}
