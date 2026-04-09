import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  const { courseId, courseTitle, universityName } = await req.json();

  const prompt = `You are a South African higher education expert. Provide comprehensive details about the following course at the specified university.

Course: ${courseTitle}
University: ${universityName}

Respond ONLY with valid JSON, no markdown backticks, no explanation:
{
  "title": "${courseTitle}",
  "universityName": "${universityName}",
  "degree": "e.g. Diploma / BSc / BCom",
  "faculty": "Faculty of ...",
  "duration": "3 years",
  "minAPS": 28,
  "overview": "2-3 sentence description of the course and what students will learn",
  "subjectRequirements": [
    { "subject": "Mathematics", "minimumMark": 60 },
    { "subject": "English", "minimumMark": 50 }
  ],
  "careerOutcomes": ["Software Developer", "Systems Analyst", "IT Project Manager"],
  "salaryRange": { "min": 180000, "max": 650000 },
  "nsfasAvailable": true,
  "applicationDeadline": "30 September",
  "modules": [
    "Programming Fundamentals",
    "Database Management",
    "Networking",
    "Software Engineering",
    "Web Development"
  ],
  "admissionProcess": "Brief description of how to apply — online portal, closing date, required documents",
  "campusLife": "One sentence about relevant campus facilities or student support for this faculty",
  "contactInfo": "admissions@university.ac.za or relevant faculty contact"
}`;

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
          temperature: 0.2,
          max_tokens: 2000,
        }),
      },
    );

    if (!response.ok) {
      const errorText = await response.text();
      return NextResponse.json(
        { error: "Groq API error", detail: errorText },
        { status: 500 },
      );
    }

    const data = await response.json();
    const raw: string = data.choices?.[0]?.message?.content ?? "";
    if (!raw) {
      return NextResponse.json(
        { error: "Empty response from Groq" },
        { status: 500 },
      );
    }

    const clean = raw.replace(/```json|```/g, "").trim();
    const start = clean.indexOf("{");
    const end = clean.lastIndexOf("}");
    if (start === -1) {
      return NextResponse.json({ error: "Parse error", raw }, { status: 500 });
    }

    const result = JSON.parse(clean.slice(start, end + 1));
    return NextResponse.json(result);
  } catch (e) {
    return NextResponse.json(
      { error: "Unexpected error", detail: String(e) },
      { status: 500 },
    );
  }
}
