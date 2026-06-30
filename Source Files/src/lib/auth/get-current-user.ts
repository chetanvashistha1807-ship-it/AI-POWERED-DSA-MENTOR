import { auth } from "@clerk/nextjs/server";

import { prisma } from "@/lib/prisma";

export async function getCurrentUser() {
  const { userId: clerkId } = await auth();

  if (!clerkId) {
    return null;
  }

  return prisma.user.upsert({
    where: { clerkId },
    create: { clerkId },
    update: {}
  });
}

export async function requireCurrentUser() {
  const user = await getCurrentUser();

  if (!user) {
    throw new Error("Unauthorized");
  }

  return user;
}
