import { NextResponse } from "next/server";
import { readDb, scoreIdea } from "@/lib/store";

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const campaignId = searchParams.get("campaignId");
  const location = searchParams.get("location") ?? "";
  const ageGroup = searchParams.get("ageGroup") ?? "";

  const db = await readDb();
  const responses = db.responses.filter((r) => {
    if (campaignId && r.campaignId !== campaignId) return false;
    if (location && r.location !== location) return false;
    if (ageGroup && r.ageGroup !== ageGroup) return false;
    return true;
  });

  const ideas = db.ideas
    .filter((i) => !campaignId || i.campaignId === campaignId)
    .sort((a, b) => scoreIdea(b) - scoreIdea(a));

  const sentiment = responses.reduce(
    (acc, r) => {
      acc[r.sentiment] += 1;
      return acc;
    },
    { positive: 0, negative: 0, neutral: 0 }
  );

  return NextResponse.json({
    totalParticipants: new Set(responses.map((r) => r.userName)).size,
    totalResponses: responses.length,
    mostPopularIdeas: ideas.slice(0, 5),
    sentiment,
    engagement: {
      totalVotes: ideas.reduce((n, idea) => n + idea.upvotes + idea.downvotes, 0),
      totalIdeas: ideas.length
    }
  });
}
