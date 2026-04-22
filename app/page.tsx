"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { Campaign } from "@/lib/types";

export default function Home() {
  const [campaigns, setCampaigns] = useState<Campaign[]>([]);

  useEffect(() => {
    fetch("/api/campaigns").then((r) => r.json()).then(setCampaigns);
  }, []);

  const active = useMemo(() => {
    const now = new Date();
    return campaigns.filter((c) => new Date(c.endsAt) > now);
  }, [campaigns]);

  return (
    <div className="grid">
      <section className="hero card">
        <div>
          <span className="badge">Real-time customer insight platform</span>
          <h1 style={{ marginBottom: 8 }}>Validate ideas with the public in minutes.</h1>
          <p className="small">Kinukazi helps brands collect structured feedback, rank ideas, and turn public sentiment into better campaign decisions.</p>
          <div style={{ display: "flex", gap: 8, marginTop: 12 }}>
            <Link className="btn" href="/company">Launch a Campaign</Link>
            <Link className="btn" href="/leaderboard" style={{ background: "#334155" }}>View Top Contributors</Link>
          </div>
        </div>
        <div className="stats">
          <div className="stat"><strong>{campaigns.length}</strong><div className="small">Campaigns</div></div>
          <div className="stat"><strong>{active.length}</strong><div className="small">Live now</div></div>
          <div className="stat"><strong>5s</strong><div className="small">Avg response target</div></div>
        </div>
      </section>

      <section className="grid" style={{ gridTemplateColumns: "repeat(auto-fit,minmax(220px,1fr))" }}>
        {active.map((campaign) => (
          <Link key={campaign.id} href={`/campaign/${campaign.id}`} className="card">
            <h3 style={{ marginTop: 0 }}>{campaign.title}</h3>
            <p className="small">{campaign.companyName} · {campaign.country}</p>
            <p>{campaign.description}</p>
            <span className="badge">Ends {campaign.endsAt}</span>
          </Link>
        ))}
      </section>
    </div>
  );
}
