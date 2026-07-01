"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { Note, Problem, ProblemStatus, UserProfile } from "./types";

function createId() {
  return `${Date.now()}-${Math.random().toString(16).slice(2)}`;
}

type LearningStore = {
  problems: Problem[];
  notes: Note[];
  profile: UserProfile;
  addProblem: (problem: Omit<Problem, "id">) => void;
  updateProblemStatus: (id: string, status: ProblemStatus) => void;
  addNote: (note: Omit<Note, "id">) => void;
  updateProfile: (profile: UserProfile) => void;
};

const starterProblems: Problem[] = [
  {
    id: "two-sum",
    title: "Two Sum",
    topic: "Arrays",
    difficulty: "Easy",
    status: "Solved",
    link: "https://leetcode.com/problems/two-sum/"
  },
  {
    id: "longest-substring",
    title: "Longest Substring Without Repeating Characters",
    topic: "Sliding Window",
    difficulty: "Medium",
    status: "In Progress",
    link: "https://leetcode.com/problems/longest-substring-without-repeating-characters/"
  },
  {
    id: "number-of-islands",
    title: "Number of Islands",
    topic: "Graphs",
    difficulty: "Medium",
    status: "Recommended",
    link: "https://leetcode.com/problems/number-of-islands/"
  }
];

const starterNotes: Note[] = [
  {
    id: "binary-search-boundaries",
    title: "Binary Search boundaries",
    linkedTo: "Binary Search",
    content:
      "Decide if the answer remains inside the search space. Do not mix lower-bound and exact-search patterns."
  },
  {
    id: "sliding-window-rule",
    title: "Sliding Window rule",
    linkedTo: "Sliding Window",
    content:
      "Expand with right pointer. Shrink with left pointer only when the current window becomes invalid."
  }
];

const starterProfile: UserProfile = {
  name: "Chetan",
  goal: "Placement preparation",
  skillLevel: "Beginner",
  dailyGoal: "3 problems",
  preferredLanguage: "C++ / Java / Python"
};

export const useLearningStore = create<LearningStore>()(
  persist(
    (set) => ({
      problems: starterProblems,
      notes: starterNotes,
      profile: starterProfile,

      addProblem: (problem) =>
        set((state) => ({
          problems: [
            {
              ...problem,
              id: createId()
            },
            ...state.problems
          ]
        })),

      updateProblemStatus: (id, status) =>
        set((state) => ({
          problems: state.problems.map((problem) =>
            problem.id === id ? { ...problem, status } : problem
          )
        })),

      addNote: (note) =>
        set((state) => ({
          notes: [
            {
              ...note,
              id: createId()
            },
            ...state.notes
          ]
        })),

      updateProfile: (profile) =>
        set(() => ({
          profile
        }))
    }),
    {
      name: "ai-dsa-mentor-learning-store"
    }
  )
);