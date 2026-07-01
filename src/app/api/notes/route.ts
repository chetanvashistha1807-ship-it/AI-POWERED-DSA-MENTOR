import { getCurrentUserProfile } from "@/lib/auth/get-current-user";
import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function GET() {
  const profile = await getCurrentUserProfile();

  if (!profile) {
    return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
  }

  const notes = await prisma.note.findMany({
    where: {
      userId: profile.id
    },
    orderBy: {
      createdAt: "desc"
    }
  });

  return NextResponse.json(notes);
}

export async function POST(request: Request) {
  const profile = await getCurrentUserProfile();

  if (!profile) {
    return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
  }

  const body = await request.json();

  const note = await prisma.note.create({
    data: {
      userId: profile.id,
      title: body.title,
      linkedTo: body.linkedTo || "General",
      content: body.content
    }
  });

  return NextResponse.json(note, { status: 201 });
}