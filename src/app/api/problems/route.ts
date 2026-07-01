import { getCurrentUserProfile } from "@/lib/auth/get-current-user";
import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function GET() {
  const profile = await getCurrentUserProfile();

  if (!profile) {
    return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
  }

  const problems = await prisma.problem.findMany({
    where: {
      userId: profile.id
    },
    orderBy: {
      createdAt: "desc"
    }
  });

  return NextResponse.json(problems);
}

export async function POST(request: Request) {
  const profile = await getCurrentUserProfile();

  if (!profile) {
    return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
  }

  const body = await request.json();

  const problem = await prisma.problem.create({
    data: {
      userId: profile.id,
      title: body.title,
      topic: body.topic,
      difficulty: body.difficulty,
      status: body.status ?? "Not Started",
      link: body.link || null
    }
  });

  return NextResponse.json(problem, { status: 201 });
}

export async function PATCH(request: Request) {
  const profile = await getCurrentUserProfile();

  if (!profile) {
    return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
  }

  const body = await request.json();

  const problem = await prisma.problem.update({
    where: {
      id: body.id,
      userId: profile.id
    },
    data: {
      status: body.status
    }
  });

  return NextResponse.json(problem);
}