import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

const allowedStatuses = ["Not Started", "Recommended", "In Progress", "Solved", "Skipped"];

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { userId: clerkUserId } = await auth();

    if (!clerkUserId) {
      return NextResponse.json(
        { error: "You must be signed in." },
        { status: 401 }
      );
    }

    const { id } = await params;
    const body = await request.json();

    const profile = await prisma.userProfile.findUnique({
      where: {
        clerkUserId
      }
    });

    if (!profile) {
      return NextResponse.json(
        { error: "Profile not found." },
        { status: 404 }
      );
    }

    const data: {
      status?: string;
      isTodayGoal?: boolean;
    } = {};

    if (typeof body.status === "string") {
      if (!allowedStatuses.includes(body.status)) {
        return NextResponse.json(
          { error: "Invalid problem status." },
          { status: 400 }
        );
      }

      data.status = body.status;
    }

    if (typeof body.isTodayGoal === "boolean") {
      data.isTodayGoal = body.isTodayGoal;
    }

    if (Object.keys(data).length === 0) {
      return NextResponse.json(
        { error: "Nothing to update." },
        { status: 400 }
      );
    }

    const updateResult = await prisma.problem.updateMany({
      where: {
        id,
        userId: profile.id
      },
      data
    });

    if (updateResult.count === 0) {
      return NextResponse.json(
        { error: "Problem not found." },
        { status: 404 }
      );
    }

    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json(
      { error: "Could not update problem." },
      { status: 500 }
    );
  }
}