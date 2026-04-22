export type QuestionType = "multiple_choice" | "open_ended" | "vote";

export interface Question {
  id: string;
  prompt: string;
  type: QuestionType;
  options?: string[];
}

export interface Campaign {
  id: string;
  companyName: string;
  title: string;
  description: string;
  country: string;
  startsAt: string;
  endsAt: string;
  createdAt: string;
  plan: "free" | "pro";
  questions: Question[];
}

export interface Idea {
  id: string;
  campaignId: string;
  authorName: string;
  text: string;
  upvotes: number;
  downvotes: number;
  engagement: number;
  createdAt: string;
}

export interface Response {
  id: string;
  campaignId: string;
  questionId: string;
  userName: string;
  ageGroup?: string;
  location?: string;
  sentiment: "positive" | "negative" | "neutral";
  answer: string;
  createdAt: string;
}

export interface Db {
  campaigns: Campaign[];
  ideas: Idea[];
  responses: Response[];
  points: Record<string, number>;
}
