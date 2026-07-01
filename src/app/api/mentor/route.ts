import { getCurrentUserProfile } from "@/lib/auth/get-current-user";
import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
  try {
    const profile = await getCurrentUserProfile();

    if (!profile) {
      return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
    }

    if (!process.env.OPENROUTER_API_KEY) {
      return NextResponse.json(
        { error: "OPENROUTER_API_KEY is missing" },
        { status: 500 }
      );
    }

    const body = await request.json();
    const userMessage = String(body.message ?? "").trim();

    if (!userMessage) {
      return NextResponse.json({ error: "Message is required" }, { status: 400 });
    }

    const [problems, notes] = await Promise.all([
      prisma.problem.findMany({
        where: { userId: profile.id },
        orderBy: { createdAt: "desc" },
        take: 20
      }),
      prisma.note.findMany({
        where: { userId: profile.id },
        orderBy: { createdAt: "desc" },
        take: 10
      })
    ]);

    const conversation = await prisma.aIConversation.create({
      data: {
        userId: profile.id,
        title: userMessage.slice(0, 60)
      }
    });

    await prisma.aIMessage.create({
      data: {
        conversationId: conversation.id,
        role: "user",
        content: userMessage
      }
    });

    const context = {
      profile: {
        name: profile.name,
        goal: profile.goal,
        skillLevel: profile.skillLevel,
        dailyGoal: profile.dailyGoal,
        preferredLanguage: profile.preferredLanguage
      },
      problems: problems.map((problem) => ({
        title: problem.title,
        topic: problem.topic,
        difficulty: problem.difficulty,
        status: problem.status
      })),
      notes: notes.map((note) => ({
        title: note.title,
        linkedTo: note.linkedTo,
        content: note.content
      }))
    };

    const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${process.env.OPENROUTER_API_KEY}`,
        "Content-Type": "application/json",
        "HTTP-Referer": "http://localhost:3000",
        "X-Title": "AI DSA Mentor"
      },
      body: JSON.stringify({
        model:
          process.env.OPENROUTER_MODEL ??
          "deepseek/deepseek-chat-v3-0324:free",
        messages: [
          {
            role: "system",
            content:
              "You are AI DSA Mentor. Help the learner with Data Structures and Algorithms, coding interview preparation, and code debugging. Give hints before full solutions unless the user asks for the full solution. When debugging code, explain the bug, the reason, and the corrected approach. Use saved profile, problems, and notes. Do not recommend already solved problems. Be concise, practical, and beginner-friendly."
          },
          {
            role: "user",
            content: `Learner context:\n${JSON.stringify(
              context,
              null,
              2
            )}\n\nUser question:\n${userMessage}`
          }
        ]
      })
    });

    if (!response.ok) {
      const errorText = await response.text();

      return NextResponse.json(
        {
          error: "OpenRouter request failed",
          details: errorText
        },
        { status: 500 }
      );
    }

    const data = await response.json();

    const mentorReply =
      data.choices?.[0]?.message?.content ||
      "I could not generate a response. Please try again.";

    await prisma.aIMessage.create({
      data: {
        conversationId: conversation.id,
        role: "mentor",
        content: mentorReply
      }
    });

    return NextResponse.json({
      conversationId: conversation.id,
      reply: mentorReply
    });
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Unknown server error";

    return NextResponse.json(
      {
        error: "Mentor route failed",
        details: message
      },
      { status: 500 }
    );
  }
}