import { promises as fs } from "fs";
import path from "path";
import { Db, Idea, Response } from "./types";

const DB_PATH = path.join(process.cwd(), "data", "db.json");

const initialData: Db = {
  campaigns: [
    {
      id: "camp-cocacola-december",
      companyName: "Coca-Cola Tanzania",
      title: "December Festive Campaign – Coca-Cola Tanzania",
      description: "Help us design festive campaign ideas that drive engagement across Tanzania.",
      country: "Tanzania",
      startsAt: "2026-12-01",
      endsAt: "2026-12-31",
      createdAt: new Date().toISOString(),
      plan: "pro",
      questions: [
        {
          id: "q1",
          prompt: "What festive offer would excite you most?",
          type: "multiple_choice",
          options: ["Buy 1 Get 1", "Discount bundles", "Scratch & Win prizes"]
        },
        { id: "q2", prompt: "Share one holiday activation idea", type: "open_ended" },
        { id: "q3", prompt: "Would you join a Coca-Cola community event?", type: "vote" }
      ]
    }
  ],
  ideas: [
    {
      id: "idea1",
      campaignId: "camp-cocacola-december",
      authorName: "Amina",
      text: "Launch a #CokeWithFamily street photo challenge.",
      upvotes: 24,
      downvotes: 2,
      engagement: 55,
      createdAt: new Date().toISOString()
    }
  ],
  responses: [],
  points: { Amina: 24 }
};

async function ensureDb() {
  try {
    await fs.access(DB_PATH);
  } catch {
    await fs.mkdir(path.dirname(DB_PATH), { recursive: true });
    await fs.writeFile(DB_PATH, JSON.stringify(initialData, null, 2));
  }
}

export async function readDb(): Promise<Db> {
  await ensureDb();
  const raw = await fs.readFile(DB_PATH, "utf8");
  return JSON.parse(raw) as Db;
}

export async function writeDb(db: Db) {
  await fs.writeFile(DB_PATH, JSON.stringify(db, null, 2));
}

export function scoreIdea(idea: Idea) {
  const ageHours = Math.max((Date.now() - new Date(idea.createdAt).getTime()) / 3600000, 1);
  const voteScore = idea.upvotes - idea.downvotes;
  return voteScore * 0.7 + idea.engagement * 0.2 + (24 / ageHours) * 0.1;
}

export function detectSentiment(answer: string): Response["sentiment"] {
  const positiveWords = ["great", "love", "good", "amazing", "excellent", "happy", "like"];
  const negativeWords = ["bad", "hate", "poor", "worse", "boring", "angry", "slow"];
  const lower = answer.toLowerCase();
  const positives = positiveWords.filter((w) => lower.includes(w)).length;
  const negatives = negativeWords.filter((w) => lower.includes(w)).length;
  if (positives > negatives) return "positive";
  if (negatives > positives) return "negative";
  return "neutral";
}
