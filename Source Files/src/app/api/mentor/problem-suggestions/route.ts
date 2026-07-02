import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

type SuggestedProblem = {
  title: string;
  topic: string;
  difficulty: "Easy" | "Medium" | "Hard";
  link: string;
  reason: string;
};

function extractJson(text: string) {
  const firstBracket = text.indexOf("[");
  const lastBracket = text.lastIndexOf("]");

  if (firstBracket === -1 || lastBracket === -1) {
    throw new Error("AI did not return a JSON array.");
  }

  return text.slice(firstBracket, lastBracket + 1);
}

export async function POST(request: Request) {
  try {
    const { userId: clerkUserId } = await auth();

    if (!clerkUserId) {
      return NextResponse.json(
        { error: "You must be signed in." },
        { status: 401 }
      );
    }

    const { prompt } = await request.json();

    const apiKey = process.env.OPENROUTER_API_KEY;

    if (!apiKey) {
      return NextResponse.json(
        { error: "OPENROUTER_API_KEY is missing." },
        { status: 500 }
      );
    }

    const profile = await prisma.userProfile.findUnique({
      where: {
        clerkUserId
      }
    });

    const solvedProblems = profile
      ? await prisma.problem.findMany({
          where: {
            userId: profile.id
          },
          orderBy: {
            createdAt: "desc"
          },
          take: 30
        })
      : [];

    const aiResponse = await fetch("https://openrouter.ai/api/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
        "HTTP-Referer": "http://localhost:3000",
        "X-Title": "AI DSA Mentor"
      },
      body: JSON.stringify({
        model:
          process.env.OPENROUTER_MODEL ||
          "deepseek/deepseek-chat-v3-0324:free",
        messages: [
          {
            role: "system",
            content:
              "You suggest real LeetCode problems for DSA practice. Return ONLY valid JSON. No markdown. No explanation outside JSON."
          },
          {
            role: "user",
            content: `
Suggest 3 real LeetCode problems for this learner.

User request:
${prompt || "Suggest useful DSA practice problems for today."}

Learner profile:
${profile ? JSON.stringify(profile, null, 2) : "No profile yet."}

Already saved problems:
${JSON.stringify(solvedProblems, null, 2)}

Return exactly this JSON format:
[
  {
    "title": "Valid Anagram",
    "topic": "Hashing",
    "difficulty": "Easy",
    "link": "https://leetcode.com/problems/valid-anagram/",
    "reason": "Good for practicing frequency maps."
  }
]

Rules:
- Use only real LeetCode problems.
- link must be a valid LeetCode problem URL.
- difficulty must be Easy, Medium, or Hard.
- Avoid suggesting problems already saved by the user.
`
          }
        ]
      })
    });

    const data = await aiResponse.json();

    if (!aiResponse.ok) {
      return NextResponse.json(
        {
          error:
            data?.error?.message ||
            data?.message ||
            "OpenRouter request failed."
        },
        { status: aiResponse.status }
      );
    }

    const content = data?.choices?.[0]?.message?.content || "";
    const jsonText = extractJson(content);
    const suggestions = JSON.parse(jsonText) as SuggestedProblem[];

    return NextResponse.json({ suggestions });
  } catch (error) {
    return NextResponse.json(
      {
        error:
          error instanceof Error
            ? error.message
            : "Could not generate problem suggestions."
      },
      { status: 500 }
    );
  }
}