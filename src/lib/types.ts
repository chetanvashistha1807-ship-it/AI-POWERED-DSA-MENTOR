export type ProblemStatus = "Not Started" | "In Progress" | "Solved" | "Recommended";

export type Problem = {
  id: string;
  title: string;
  topic: string;
  difficulty: "Easy" | "Medium" | "Hard";
  status: ProblemStatus;
  link?: string;
};

export type Note = {
  id: string;
  title: string;
  linkedTo: string;
  content: string;
};
export type UserProfile = {
  name: string;
  goal: string;
  skillLevel: string;
  dailyGoal: string;
  preferredLanguage: string;
};