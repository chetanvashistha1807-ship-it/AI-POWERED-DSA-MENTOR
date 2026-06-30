import { getCurrentUserProfile } from "@/lib/auth/get-current-user";
import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const user = await getCurrentUserProfile();

    if (!user) {
      return NextResponse.json(
        { ok: false, error: "Not authenticated" },
        { status: 401 }
      );
    }

    await prisma.$queryRaw`SELECT 1`;

    return NextResponse.json({
      ok: true,
      message: "Database connection is ready",
      userId: user.id
    });
  } catch (error) {
    console.error("Database health check failed", error);

    return NextResponse.json(
      {
        ok: false,
        error: "Database health check failed"
      },
      { status: 500 }
    );
  }
}