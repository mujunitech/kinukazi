import { NextResponse } from "next/server";
import { readDb, writeDb } from "@/lib/store";

export async function GET() {
  const db = await readDb();
  return NextResponse.json(db.campaigns);
}

export async function POST(req: Request) {
  const body = await req.json();
  const db = await readDb();

  const freeCampaignCount = db.campaigns.filter((c) => c.companyName === body.companyName && c.plan === "free").length;
  if ((body.plan ?? "free") === "free" && freeCampaignCount >= 1) {
    return NextResponse.json({ error: "Free tier limit reached (1 campaign). Upgrade for more." }, { status: 400 });
  }

  const campaign = {
    id: `camp-${crypto.randomUUID()}`,
    companyName: body.companyName,
    title: body.title,
    description: body.description,
    country: body.country,
    startsAt: body.startsAt,
    endsAt: body.endsAt,
    createdAt: new Date().toISOString(),
    plan: body.plan ?? "free",
    questions: body.questions ?? []
  };

  db.campaigns.unshift(campaign);
  await writeDb(db);
  return NextResponse.json(campaign, { status: 201 });
}
