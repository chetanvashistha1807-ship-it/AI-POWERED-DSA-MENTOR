import { getCurrentUserProfile } from "@/lib/auth/get-current-user";
import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
  const profile = await getCurrentUserProfile();

  if (!profile) {
    return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
  }

  const body = await request.json();

  const catalogProblem = await prisma.problemCatalog.findUnique({
    where: {
      id: body.catalogProblemId
    }
  });

  if (!catalogProblem) {
    return NextResponse.json(
      { error: "Catalog problem not found" },
      { status: 404 }
    );
  }

  const problem = await prisma.problem.create({
    data: {
      userId: profile.id,
      title: catalogProblem.title,
      topic: catalogProblem.topic,
      difficulty: catalogProblem.difficulty,
      status: body.status ?? "Not Started",
      link: catalogProblem.leetcodeUrl,
      isTodayGoal: body.isTodayGoal ?? false
    }
  });

  return NextResponse.json(problem, { status: 201 });
}