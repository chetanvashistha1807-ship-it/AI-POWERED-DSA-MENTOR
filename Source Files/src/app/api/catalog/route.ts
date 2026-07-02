import { getCurrentUserProfile } from "@/lib/auth/get-current-user";
import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function GET() {
  const profile = await getCurrentUserProfile();

  if (!profile) {
    return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
  }

  const catalog = await prisma.problemCatalog.findMany({
    orderBy: [
      {
        topic: "asc"
      },
      {
        difficulty: "asc"
      },
      {
        title: "asc"
      }
    ]
  });

  return NextResponse.json(catalog);
}