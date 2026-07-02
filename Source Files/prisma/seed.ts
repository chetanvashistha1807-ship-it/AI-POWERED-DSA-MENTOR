import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

const catalogProblems = [
  {
    title: "Two Sum",
    topic: "Arrays",
    difficulty: "Easy",
    leetcodeUrl: "https://leetcode.com/problems/two-sum/",
    pattern: "Hash Map",
    description:
      "Find two numbers in an array that add up to a target."
  },
  {
    title: "Valid Anagram",
    topic: "Strings",
    difficulty: "Easy",
    leetcodeUrl: "https://leetcode.com/problems/valid-anagram/",
    pattern: "Frequency Counter",
    description:
      "Check whether two strings contain the same characters with the same counts."
  },
  {
    title: "Group Anagrams",
    topic: "Strings",
    difficulty: "Medium",
    leetcodeUrl: "https://leetcode.com/problems/group-anagrams/",
    pattern: "Hash Map",
    description:
      "Group strings that are anagrams of each other."
  },
  {
    title: "Valid Parentheses",
    topic: "Stack",
    difficulty: "Easy",
    leetcodeUrl: "https://leetcode.com/problems/valid-parentheses/",
    pattern: "Stack",
    description:
      "Check whether brackets are balanced and closed in the correct order."
  },
  {
    title: "Binary Search",
    topic: "Binary Search",
    difficulty: "Easy",
    leetcodeUrl: "https://leetcode.com/problems/binary-search/",
    pattern: "Binary Search",
    description:
      "Search a sorted array in logarithmic time."
  },
  {
    title: "Longest Substring Without Repeating Characters",
    topic: "Sliding Window",
    difficulty: "Medium",
    leetcodeUrl:
      "https://leetcode.com/problems/longest-substring-without-repeating-characters/",
    pattern: "Sliding Window",
    description:
      "Find the longest substring that does not contain repeating characters."
  },
  {
    title: "Merge Intervals",
    topic: "Intervals",
    difficulty: "Medium",
    leetcodeUrl: "https://leetcode.com/problems/merge-intervals/",
    pattern: "Sorting",
    description:
      "Merge overlapping intervals into non-overlapping intervals."
  },
  {
    title: "Number of Islands",
    topic: "Graphs",
    difficulty: "Medium",
    leetcodeUrl: "https://leetcode.com/problems/number-of-islands/",
    pattern: "DFS/BFS",
    description:
      "Count connected groups of land cells in a grid."
  },
  {
    title: "Coin Change",
    topic: "Dynamic Programming",
    difficulty: "Medium",
    leetcodeUrl: "https://leetcode.com/problems/coin-change/",
    pattern: "1D DP",
    description:
      "Find the fewest coins needed to make a target amount."
  },
  {
    title: "Climbing Stairs",
    topic: "Dynamic Programming",
    difficulty: "Easy",
    leetcodeUrl: "https://leetcode.com/problems/climbing-stairs/",
    pattern: "Fibonacci DP",
    description:
      "Count the number of ways to climb stairs taking one or two steps."
  }
];

async function main() {
  for (const problem of catalogProblems) {
    await prisma.problemCatalog.upsert({
      where: {
        leetcodeUrl: problem.leetcodeUrl
      },
      update: problem,
      create: problem
    });
  }

  console.log(`Seeded ${catalogProblems.length} catalog problems.`);
}

main()
  .catch((error) => {
    console.error(error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });