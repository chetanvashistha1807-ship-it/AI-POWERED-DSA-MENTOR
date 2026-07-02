import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function POST(request: Request) {
  try {
    const { userId: clerkUserId } = await auth();

    if (!clerkUserId) {
      return NextResponse.json(
        { error: "You must be signed in to use the mentor." },
        { status: 401 }
      );
    }

    const { message } = await request.json();

    if (!message || typeof message !== "string") {
      return NextResponse.json(
        { error: "Message is required." },
        { status: 400 }
      );
    }

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

    if (!profile) {
      return NextResponse.json(
        { error: "Profile not found. Please create your profile first." },
        { status: 404 }
      );
    }

    let conversation = await prisma.aIConversation.findFirst({
      where: {
        userId: profile.id
      },
      orderBy: {
        updatedAt: "desc"
      }
    });

    if (!conversation) {
      conversation = await prisma.aIConversation.create({
        data: {
          userId: profile.id
        }
      });
    } else {
      conversation = await prisma.aIConversation.update({
        where: {
          id: conversation.id
        },
        data: {
          updatedAt: new Date()
        }
      });
    }

    const [problems, notes, catalogProblems, recentMessages] =
      await Promise.all([
        prisma.problem.findMany({
          where: {
            userId: profile.id
          },
          orderBy: {
            createdAt: "desc"
          },
          take: 20
        }),

        prisma.note.findMany({
          where: {
            userId: profile.id
          },
          orderBy: {
            createdAt: "desc"
          },
          take: 10
        }),

        prisma.problemCatalog.findMany({
          orderBy: {
            title: "asc"
          },
          take: 50
        }),

        prisma.aIMessage.findMany({
          where: {
            conversationId: conversation.id
          },
          orderBy: {
            createdAt: "asc"
          },
          take: 20
        })
      ]);

    const context = `
User profile:
${JSON.stringify(profile, null, 2)}

User saved problems:
${problems.length ? JSON.stringify(problems, null, 2) : "No saved problems."}

User notes:
${notes.length ? JSON.stringify(notes, null, 2) : "No notes yet."}

Problem catalog:
${catalogProblems.length ? JSON.stringify(catalogProblems, null, 2) : "No catalog problems yet."}
`;

    const previousMessages = recentMessages.map((chatMessage) => ({
      role: chatMessage.role === "mentor" ? "assistant" : "user",
      content: chatMessage.content
    }));

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
              "You are an AI-powered DSA mentor. Help the user with hints, debugging, dry runs, study planning, and problem recommendations. Prefer recommending problems from the provided problem catalog. Include problem links when available. Do not spoil full solutions unless the user asks directly."
          },
          {
            role: "user",
            content: `Learner context:\n${context}`
          },
          ...previousMessages,
          {
            role: "user",
            content: message
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

    const reply =
      data?.choices?.[0]?.message?.content ||
      "I could not generate a mentor response.";

    await prisma.aIMessage.createMany({
      data: [
        {
          conversationId: conversation.id,
          role: "user",
          content: message
        },
        {
          conversationId: conversation.id,
          role: "mentor",
          content: reply
        }
      ]
    });

    await prisma.aIConversation.update({
      where: {
        id: conversation.id
      },
      data: {
        updatedAt: new Date()
      }
    });

    return NextResponse.json({
      reply
    });
  } catch (error) {
    return NextResponse.json(
      {
        error:
          error instanceof Error ? error.message : "Something went wrong."
      },
      { status: 500 }
    );
  }
}