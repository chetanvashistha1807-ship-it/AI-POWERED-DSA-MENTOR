import { getCurrentUserProfile } from "@/lib/auth/get-current-user";
import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function GET() {
  const profile = await getCurrentUserProfile();

  if (!profile) {
    return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
  }

  const [problems, notes] = await Promise.all([
    prisma.problem.findMany({
      where: {
        userId: profile.id
      },
      orderBy: {
        createdAt: "desc"
      }
    }),
    prisma.note.findMany({
      where: {
        userId: profile.id
      },
      orderBy: {
        createdAt: "desc"
      }
    })
  ]);

  return NextResponse.json({
    profile,
    problems,
    notes
  });
}