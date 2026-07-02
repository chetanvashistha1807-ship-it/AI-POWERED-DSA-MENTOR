import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    const { userId: clerkUserId } = await auth();

    if (!clerkUserId) {
      return NextResponse.json({ problems: [] });
    }

    const profile = await prisma.userProfile.findUnique({
      where: {
        clerkUserId
      }
    });

    if (!profile) {
      return NextResponse.json({ problems: [] });
    }

    const problems = await prisma.problem.findMany({
      where: {
        userId: profile.id
      },
      orderBy: {
        createdAt: "desc"
      }
    });

    return NextResponse.json({ problems });
  } catch {
    return NextResponse.json(
      { error: "Could not load problems." },
      { status: 500 }
    );
  }
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

    const body = await request.json();

    if (!body.title || !body.topic || !body.difficulty) {
      return NextResponse.json(
        { error: "Title, topic, and difficulty are required." },
        { status: 400 }
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

    const problem = await prisma.problem.create({
      data: {
        userId: profile.id,
        title: body.title,
        topic: body.topic,
        difficulty: body.difficulty,
        status: body.status || "Recommended",
        link: body.link || null,
        isTodayGoal: Boolean(body.isTodayGoal)
      }
    });

    return NextResponse.json({ problem });
  } catch {
    return NextResponse.json(
      { error: "Could not add problem." },
      { status: 500 }
    );
  }
}