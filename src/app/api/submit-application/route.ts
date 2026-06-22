import { NextRequest, NextResponse } from "next/server";
import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const {
      personalInfo,
      selectedApplications,
      totalPaid,
      applyNsfas,
      paymentMethod,
    } = body;

    const refNumber = `PF-${Date.now()}-${Math.random().toString(36).slice(2, 6).toUpperCase()}`;

    // Build a readable list of applications
    const applicationRows =
      selectedApplications
        ?.map(
          (a: { universityName: string; title: string }) =>
            `<tr>
            <td style="padding:8px 12px;border-bottom:1px solid #222;">${a.universityName}</td>
            <td style="padding:8px 12px;border-bottom:1px solid #222;">${a.title}</td>
          </tr>`,
        )
        .join("") ?? "";

    // ── EMAIL 1: To you (admin) ──────────────────────────────────────
    await resend.emails.send({
      from: `PathFinder SA <${process.env.SENDER_EMAIL}>`,
      to: process.env.ADMIN_EMAIL!,
      subject: `🎓 New Application — ${personalInfo.fullName} [${refNumber}]`,
      html: `
        <div style="font-family:sans-serif;max-width:600px;margin:0 auto;background:#0f0f0f;color:#ccc;padding:32px;border-radius:12px;">
          <div style="background:#CAFF00;color:#000;padding:12px 20px;border-radius:8px;margin-bottom:24px;">
            <strong style="font-size:18px;">New PathFinder Application</strong>
            <span style="float:right;font-family:monospace;">${refNumber}</span>
          </div>

          <h3 style="color:#CAFF00;margin:0 0 12px;">Student Details</h3>
          <table style="width:100%;border-collapse:collapse;margin-bottom:24px;">
            <tr><td style="color:#888;padding:6px 0;width:40%;">Full Name</td><td><strong style="color:#fff;">${personalInfo.fullName}</strong></td></tr>
            <tr><td style="color:#888;padding:6px 0;">ID Number</td><td style="font-family:monospace;color:#fff;">${personalInfo.idNumber}</td></tr>
            <tr><td style="color:#888;padding:6px 0;">Email</td><td><a href="mailto:${personalInfo.email}" style="color:#CAFF00;">${personalInfo.email}</a></td></tr>
            <tr><td style="color:#888;padding:6px 0;">Phone</td><td style="color:#fff;">${personalInfo.phone}</td></tr>
            <tr><td style="color:#888;padding:6px 0;">Address</td><td style="color:#fff;">${personalInfo.streetAddress}, ${personalInfo.city}, ${personalInfo.province} ${personalInfo.postalCode}</td></tr>
            ${
              personalInfo.guardianName
                ? `
            <tr><td style="color:#888;padding:6px 0;">Guardian</td><td style="color:#fff;">${personalInfo.guardianName} (${personalInfo.guardianRelationship}) — ${personalInfo.guardianPhone}</td></tr>
            `
                : ""
            }
          </table>

          <h3 style="color:#CAFF00;margin:0 0 12px;">Applications (${selectedApplications?.length ?? 0})</h3>
          <table style="width:100%;border-collapse:collapse;margin-bottom:24px;background:#1a1a1a;border-radius:8px;overflow:hidden;">
            <thead>
              <tr style="background:#222;">
                <th style="padding:10px 12px;text-align:left;color:#888;font-weight:500;">University</th>
                <th style="padding:10px 12px;text-align:left;color:#888;font-weight:500;">Programme</th>
              </tr>
            </thead>
            <tbody>${applicationRows}</tbody>
          </table>

          <h3 style="color:#CAFF00;margin:0 0 12px;">Payment</h3>
          <table style="width:100%;border-collapse:collapse;margin-bottom:24px;">
            <tr><td style="color:#888;padding:6px 0;width:40%;">Amount Paid</td><td style="color:#CAFF00;font-size:20px;font-weight:bold;">R${totalPaid?.toFixed(2)}</td></tr>
            <tr><td style="color:#888;padding:6px 0;">Method</td><td style="color:#fff;">${paymentMethod ?? "—"}</td></tr>
            <tr><td style="color:#888;padding:6px 0;">NSFAS</td><td style="color:${applyNsfas ? "#4ade80" : "#666"};">${applyNsfas ? "YES — apply for NSFAS" : "Not requested"}</td></tr>
          </table>

          <div style="background:#1a1a1a;border:1px solid #333;border-radius:8px;padding:16px;font-size:13px;color:#666;">
            Submitted: ${new Date().toLocaleString("en-ZA", { timeZone: "Africa/Johannesburg" })} SAST
          </div>
        </div>
      `,
    });

    // ── EMAIL 2: To the student (confirmation) ───────────────────────
    await resend.emails.send({
      from: `PathFinder SA <${process.env.SENDER_EMAIL}>`,
      to: personalInfo.email,
      subject: `Your application is confirmed — ${refNumber}`,
      html: `
        <div style="font-family:sans-serif;max-width:600px;margin:0 auto;background:#0f0f0f;color:#ccc;padding:32px;border-radius:12px;">
          <div style="text-align:center;margin-bottom:28px;">
            <div style="background:#CAFF00;display:inline-block;padding:12px 24px;border-radius:8px;margin-bottom:16px;">
              <strong style="color:#000;font-size:18px;">PathFinder SA</strong>
            </div>
            <h1 style="color:#fff;margin:0 0 8px;font-size:24px;">Application Received! 🎓</h1>
            <p style="color:#666;margin:0;">We've got everything we need to get you into university.</p>
          </div>

          <div style="background:#1a1a1a;border:1px solid #CAFF00;border-radius:10px;padding:16px;text-align:center;margin-bottom:24px;">
            <p style="color:#888;margin:0 0 4px;font-size:13px;">Your reference number</p>
            <p style="color:#CAFF00;font-family:monospace;font-size:22px;font-weight:bold;margin:0;">${refNumber}</p>
            <p style="color:#555;font-size:12px;margin:8px 0 0;">Save this — you'll need it to track your application</p>
          </div>

          <h3 style="color:#CAFF00;margin:0 0 12px;">You're applying to:</h3>
          <table style="width:100%;border-collapse:collapse;margin-bottom:24px;background:#1a1a1a;border-radius:8px;overflow:hidden;">
            <thead>
              <tr style="background:#222;">
                <th style="padding:10px 12px;text-align:left;color:#888;font-weight:500;">University</th>
                <th style="padding:10px 12px;text-align:left;color:#888;font-weight:500;">Programme</th>
              </tr>
            </thead>
            <tbody>${applicationRows}</tbody>
          </table>

          <h3 style="color:#CAFF00;margin:0 0 12px;">What happens next?</h3>
          <div style="space-y:8px;">
            ${[
              [
                "1",
                "We verify your documents",
                "Within 24 hours of payment clearing",
              ],
              ["2", "We submit your applications", "Within 3 working days"],
              [
                "3",
                "You get status updates",
                "Via WhatsApp and this email address",
              ],
            ]
              .map(
                ([num, title, sub]) => `
              <div style="display:flex;gap:12px;align-items:flex-start;margin-bottom:12px;">
                <div style="background:#CAFF00;color:#000;width:24px;height:24px;border-radius:50%;display:flex;align-items:center;justify-content:center;font-weight:bold;font-size:12px;flex-shrink:0;text-align:center;line-height:24px;">${num}</div>
                <div>
                  <p style="color:#fff;margin:0;font-weight:500;">${title}</p>
                  <p style="color:#555;margin:4px 0 0;font-size:13px;">${sub}</p>
                </div>
              </div>
            `,
              )
              .join("")}
          </div>

          ${
            applyNsfas
              ? `
          <div style="background:rgba(74,222,128,0.08);border:1px solid rgba(74,222,128,0.2);border-radius:8px;padding:14px;margin-top:16px;">
            <p style="color:#4ade80;margin:0;font-weight:500;">✓ NSFAS application included</p>
            <p style="color:#555;margin:6px 0 0;font-size:13px;">We'll also submit your NSFAS application at no extra charge.</p>
          </div>
          `
              : ""
          }

          <div style="border-top:1px solid #222;margin-top:28px;padding-top:20px;text-align:center;">
            <p style="color:#555;font-size:12px;margin:0;">
              Questions? WhatsApp us or reply to this email.<br/>
              PathFinder SA — Helping South African students find their path.
            </p>
          </div>
        </div>
      `,
    });

    console.log(
      `[${refNumber}] Emails sent — ${personalInfo.fullName} (${personalInfo.email})`,
    );

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
