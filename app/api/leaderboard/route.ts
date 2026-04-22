import { NextResponse } from "next/server";
import { readDb } from "@/lib/store";

export async function GET() {
  const db = await readDb();
  const rows = Object.entries(db.points)
    .map(([user, points]) => ({ user, points }))
    .sort((a, b) => Number(b.points) - Number(a.points));
  return NextResponse.json(rows);
}
