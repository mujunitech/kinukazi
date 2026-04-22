import { NextResponse } from "next/server";
import { readDb, scoreIdea, writeDb } from "@/lib/store";

export async function GET(_: Request, { params }: { params: { id: string } }) {
  const db = await readDb();
  const ideas = db.ideas.filter((i) => i.campaignId === params.id).sort((a, b) => scoreIdea(b) - scoreIdea(a));
  return NextResponse.json({ ideas, top10: ideas.slice(0, 10) });
}

export async function POST(req: Request, { params }: { params: { id: string } }) {
  const body = await req.json();
  const db = await readDb();
  const idea = {
    id: `idea-${crypto.randomUUID()}`,
    campaignId: params.id,
    authorName: body.authorName || "Guest",
    text: body.text,
    upvotes: 0,
    downvotes: 0,
    engagement: 1,
    createdAt: new Date().toISOString()
  };

  db.ideas.push(idea);
  db.points[idea.authorName] = (db.points[idea.authorName] ?? 0) + 8;
  await writeDb(db);
  return NextResponse.json(idea, { status: 201 });
}

export async function PATCH(req: Request, { params }: { params: { id: string } }) {
  const body = await req.json();
  const db = await readDb();
  const idea = db.ideas.find((i) => i.id === body.ideaId && i.campaignId === params.id);
  if (!idea) return NextResponse.json({ error: "Idea not found" }, { status: 404 });

  if (body.vote === "up") idea.upvotes += 1;
  if (body.vote === "down") idea.downvotes += 1;
  idea.engagement += 1;
  db.points[body.userName || "Guest"] = (db.points[body.userName || "Guest"] ?? 0) + 2;

  await writeDb(db);
  return NextResponse.json(idea);
}
