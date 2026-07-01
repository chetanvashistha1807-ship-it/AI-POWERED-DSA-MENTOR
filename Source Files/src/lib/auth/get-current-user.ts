import { currentUser } from "@clerk/nextjs/server";
import { prisma } from "@/lib/prisma";

export async function getCurrentUserProfile() {
  const clerkUser = await currentUser();

  if (!clerkUser) {
    return null;
  }

  const email = clerkUser.emailAddresses[0]?.emailAddress ?? "";
  const name =
    clerkUser.firstName ||
    clerkUser.fullName ||
    email ||
    "DSA Learner";

  return prisma.userProfile.upsert({
    where: {
      clerkUserId: clerkUser.id
    },
    update: {
      name
    },
    create: {
      clerkUserId: clerkUser.id,
      name,
      goal: "Placement preparation",
      skillLevel: "Beginner",
      dailyGoal: "3 problems",
      preferredLanguage: "C++ / Java / Python"
    }
  });
}