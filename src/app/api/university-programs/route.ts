import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  const { universityId, universityName, apsScore, interests } = await req.json();

  const prompt = `You are a South African university admissions expert. List ALL undergraduate programmes (degrees and diplomas) offered at ${universityName} in South Africa.

The student has an APS of ${apsScore} and interests in: ${interests?.join(", ") || "general"}.

Respond ONLY with valid JSON, no markdown backticks, no explanation:
{
  "universityId": "${universityId}",
  "universityName": "${universityName}",
  "lastUpdated": "2025",
  "programs": [
    {
      "id": "programme-slug",
      "name": "Full Programme Name",
      "degree": "BSc / BCom / BA / BEng / Diploma / Advanced Diploma",
      "faculty": "Faculty of ...",
      "duration": "3 years",
      "minAPS": 28,
      "subjectRequirements": [{ "subject": "Mathematics", "minimumMark": 60 }],
      "nsfasAvailable": true,
      "description": "Brief description",
      "careerOutcomes": ["Career 1", "Career 2"],
      "applicationDeadline": "September 30"
    }
  ]
}`;

  try {
    const response = await fetch("https://api.groq.com/openai/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${process.env.GROQ_API_KEY}`,
      },
      body: JSON.stringify({
        model: "llama-3.3-70b-versatile",
        messages: [{ role: "user", content: prompt }],
        temperature: 0.2,
        max_tokens: 6000,
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      return NextResponse.json({ error: "Groq API error", detail: errorText }, { status: 500 });
    }

    const data = await response.json();
    const raw: string = data.choices?.[0]?.message?.content ?? "";
    if (!raw) return NextResponse.json({ error: "Empty response from Groq" }, { status: 500 });

    const clean = raw.replace(/```json|```/g, "").trim();
    const start = clean.indexOf("{");
    const end = clean.lastIndexOf("}");
    if (start === -1) return NextResponse.json({ error: "Parse error", raw }, { status: 500 });

    const result = JSON.parse(clean.slice(start, end + 1));
    return NextResponse.json(result);
  } catch (e) {
    return NextResponse.json({ error: "Unexpected error", detail: String(e) }, { status: 500 });
  }
}
