import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    const { userId: clerkUserId } = await auth();

    if (!clerkUserId) {
      return NextResponse.json({ messages: [] });
    }

    const profile = await prisma.userProfile.findUnique({
      where: {
        clerkUserId
      }
    });

    if (!profile) {
      return NextResponse.json({ messages: [] });
    }

    const conversation = await prisma.aIConversation.findFirst({
      where: {
        userId: profile.id
      },
      orderBy: {
        updatedAt: "desc"
      },
      include: {
        messages: {
          orderBy: {
            createdAt: "asc"
          },
          take: 30
        }
      }
    });

    if (!conversation) {
      return NextResponse.json({ messages: [] });
    }

    return NextResponse.json({
      messages: conversation.messages.map((message) => ({
        role: message.role,
        content: message.content
      }))
    });
  } catch {
    return NextResponse.json(
      { error: "Could not load mentor history." },
      { status: 500 }
    );
  }
}

export async function DELETE() {
  try {
    const { userId: clerkUserId } = await auth();

    if (!clerkUserId) {
      return NextResponse.json(
        { error: "You must be signed in." },
        { status: 401 }
      );
    }

    const profile = await prisma.userProfile.findUnique({
      where: {
        clerkUserId
      }
    });

    if (!profile) {
      return NextResponse.json({ success: true });
    }

    const conversation = await prisma.aIConversation.findFirst({
      where: {
        userId: profile.id
      },
      orderBy: {
        updatedAt: "desc"
      }
    });

    if (!conversation) {
      return NextResponse.json({ success: true });
    }

    await prisma.aIMessage.deleteMany({
      where: {
        conversationId: conversation.id
      }
    });

    await prisma.aIConversation.update({
      where: {
        id: conversation.id
      },
      data: {
        updatedAt: new Date()
      }
    });

    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json(
      { error: "Could not clear mentor history." },
      { status: 500 }
    );
  }
}