"use client";

import { useEffect, useState } from "react";

export default function LeaderboardPage() {
  const [rows, setRows] = useState<Array<{ user: string; points: number }>>([]);

  useEffect(() => {
    fetch("/api/leaderboard").then((r) => r.json()).then(setRows);
  }, []);

  return (
    <div className="grid">
      <h1>Top Contributors</h1>
      <div className="card">
        {rows.length === 0 && <p className="small">Engage in campaigns to appear here.</p>}
        <ol>
          {rows.map((row, idx) => (
            <li key={row.user} style={{ marginBottom: 8 }}>
              <strong>#{idx + 1} {row.user}</strong> — {row.points} pts
            </li>
          ))}
        </ol>
      </div>
    </div>
  );
}
