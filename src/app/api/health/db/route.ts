import { getCurrentUserProfile } from "@/lib/auth/get-current-user";
import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function GET() {
  const profile = await getCurrentUserProfile();

  if (!profile) {
    return NextResponse.json(
      { error: "Not authenticated" },
      { status: 401 }
    );
  }

  return NextResponse.json(profile);
}

export async function PUT(request: Request) {
  const profile = await getCurrentUserProfile();

  if (!profile) {
    return NextResponse.json(
      { error: "Not authenticated" },
      { status: 401 }
    );
  }

  const body = await request.json();

  const updatedProfile = await prisma.userProfile.update({
    where: {
      id: profile.id
    },
    data: {
      name: body.name,
      goal: body.goal,
      skillLevel: body.skillLevel,
      dailyGoal: body.dailyGoal,
      preferredLanguage: body.preferredLanguage
    }
  });

  return NextResponse.json(updatedProfile);
}