import { NextResponse } from "next/server";
import { detectSentiment, readDb, writeDb } from "@/lib/store";

export async function GET(_: Request, { params }: { params: { id: string } }) {
  const db = await readDb();
  const responses = db.responses.filter((r) => r.campaignId === params.id);
  return NextResponse.json(responses);
}

export async function POST(req: Request, { params }: { params: { id: string } }) {
  const body = await req.json();
  const db = await readDb();

  const response = {
    id: `res-${crypto.randomUUID()}`,
    campaignId: params.id,
    questionId: body.questionId,
    userName: body.userName || "Guest",
    ageGroup: body.ageGroup,
    location: body.location,
    sentiment: detectSentiment(body.answer),
    answer: body.answer,
    createdAt: new Date().toISOString()
  };

  db.responses.push(response);
  db.points[response.userName] = (db.points[response.userName] ?? 0) + 5;
  await writeDb(db);

  return NextResponse.json(response, { status: 201 });
}
