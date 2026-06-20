import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  const { subjects, apsScore, interests } = await req.json();

  const subjectSummary = subjects
    .map((s: { name: string; mark: number }) => `${s.name}: ${s.mark}%`)
    .join(", ");

  // Separate standard interests from custom free-text interests
  const standardInterests = (interests as string[]).filter(
    (i: string) => !i.startsWith("custom:"),
  );
  const customInterests = (interests as string[])
    .filter((i: string) => i.startsWith("custom:"))
    .map((i: string) => i.replace("custom:", ""));

  const interestsList = [
    ...standardInterests,
    ...customInterests, // include verbatim — they are user-typed
  ].join(", ");

  const customNote =
    customInterests.length > 0
      ? `\nThe student also has these additional interests they typed themselves (take these seriously when matching): ${customInterests.join(", ")}.`
      : "";

  const prompt = `You are a South African university admissions expert. A matric student has the following profile:

APS Score: ${apsScore}/42
Subjects and marks: ${subjectSummary}
Interests: ${interestsList || "general"}${customNote}

Recommend the 10 most suitable degree/diploma programmes this student can study at South African universities (UCT, Wits, UP, Stellenbosch, UJ, UKZN, NWU, UNISA, TUT, UFS, Rhodes, CPUT, DUT, UWC, UNIZULU, UFH, WSU, MUT, SMU, SPU, UMP, VUT, CUT, UL, UNIVEN, Walter Sisulu).

Be realistic about whether the student qualifies based on their APS and subject marks.
Give extra weight to the student's stated interests — especially any custom interests they typed themselves.

Respond ONLY with a valid JSON array, no markdown, no explanation:
[
  {
    "id": "unique-slug",
    "title": "Programme Name",
    "universityId": "university-short-id",
    "universityName": "Full University Name",
    "faculty": "Faculty Name",
    "degree": "BSc / BCom / BA / BEng / Diploma etc",
    "duration": "3 years",
    "minAPS": 28,
    "subjectRequirements": [{ "subject": "Mathematics", "minimumMark": 60 }],
    "careerOutcomes": ["Career 1", "Career 2", "Career 3"],
    "salaryRange": { "min": 300000, "max": 900000 },
    "demandLevel": "High",
    "nsfasAvailable": true,
    "matchScore": 85,
    "matchReason": "Reason the student is a good fit",
    "category": "Engineering",
    "emoji": "⚙️",
    "description": "Brief description of the programme"
  }
]`;

  try {
    const response = await fetch(
      "https://api.groq.com/openai/v1/chat/completions",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${process.env.GROQ_API_KEY}`,
        },
        body: JSON.stringify({
          model: "llama-3.3-70b-versatile",
          messages: [{ role: "user", content: prompt }],
          temperature: 0.3,
          max_tokens: 4000,
        }),
      },
    );

    if (!response.ok) {
      const errorText = await response.text();
      console.error("Groq API error:", errorText);
      return NextResponse.json(
        { error: "Groq API error", detail: errorText },
        { status: 500 },
      );
    }

    const data = await response.json();
    const raw: string = data.choices?.[0]?.message?.content ?? "";

    if (!raw) {
      console.error("Empty Groq response:", JSON.stringify(data));
      return NextResponse.json(
        { error: "Empty response from Groq", detail: data },
        { status: 500 },
      );
    }

    const clean = raw.replace(/```json|```/g, "").trim();
    const start = clean.indexOf("[");
    const end = clean.lastIndexOf("]");

    if (start === -1 || end === -1) {
      console.error("No JSON array found in:", raw);
      return NextResponse.json(
        { error: "No valid JSON found", raw },
        { status: 500 },
      );
    }

    const recommendations = JSON.parse(clean.slice(start, end + 1));
    return NextResponse.json({ recommendations });
  } catch (e) {
    console.error("Unexpected error:", e);
    return NextResponse.json(
      { error: "JSON parse failed or unexpected error", detail: String(e) },
      { status: 500 },
    );
  }
}