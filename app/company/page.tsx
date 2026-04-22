"use client";

import { FormEvent, useEffect, useState } from "react";
import { SentimentBars } from "@/components/Charts";
import { Campaign } from "@/lib/types";

export default function CompanyDashboard() {
  const [campaigns, setCampaigns] = useState<Campaign[]>([]);
  const [metrics, setMetrics] = useState<any>(null);
  const [selectedCampaign, setSelectedCampaign] = useState<string>("");
  const [error, setError] = useState<string>("");

  const refresh = async () => {
    const data = await fetch("/api/campaigns").then((r) => r.json());
    setCampaigns(data);
    if (!selectedCampaign && data[0]) setSelectedCampaign(data[0].id);
  };

  useEffect(() => { refresh(); }, []);

  useEffect(() => {
    if (!selectedCampaign) return;
    fetch(`/api/metrics?campaignId=${selectedCampaign}`).then((r) => r.json()).then(setMetrics);
  }, [selectedCampaign]);

  async function createCampaign(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError("");
    const formData = new FormData(e.currentTarget);
    const payload = {
      companyName: formData.get("companyName"),
      title: formData.get("title"),
      description: formData.get("description"),
      country: formData.get("country"),
      startsAt: formData.get("startsAt"),
      endsAt: formData.get("endsAt"),
      plan: formData.get("plan"),
      questions: [
        { id: crypto.randomUUID(), prompt: String(formData.get("q1")), type: "multiple_choice", options: ["Option A", "Option B", "Option C"] },
        { id: crypto.randomUUID(), prompt: String(formData.get("q2")), type: "open_ended" }
      ]
    };

    const res = await fetch("/api/campaigns", {
      method: "POST",
      body: JSON.stringify(payload),
      headers: { "Content-Type": "application/json" }
    });

    if (!res.ok) {
      const body = await res.json();
      setError(body.error || "Could not create campaign");
      return;
    }

    (e.target as HTMLFormElement).reset();
    refresh();
  }

  return (
    <div className="grid">
      <h1>Company Dashboard</h1>
      <section className="card">
        <h2>Create Campaign</h2>
        {error && <p style={{ color: "#b91c1c" }}>{error}</p>}
        <form className="grid" onSubmit={createCampaign}>
          <input className="input" required name="companyName" placeholder="Company name" />
          <input className="input" required name="title" placeholder="Campaign title" />
          <textarea className="input" required name="description" placeholder="Campaign objective" rows={3} />
          <div className="grid" style={{ gridTemplateColumns: "1fr 1fr" }}>
            <input className="input" required name="country" placeholder="Country" />
            <select className="select" name="plan" defaultValue="free">
              <option value="free">Free tier (1 campaign)</option>
              <option value="pro">Pro (unlimited + analytics export)</option>
            </select>
          </div>
          <div className="grid" style={{ gridTemplateColumns: "1fr 1fr" }}>
            <input className="input" name="startsAt" required type="date" />
            <input className="input" name="endsAt" required type="date" />
          </div>
          <input className="input" name="q1" required placeholder="Question 1 (multiple choice)" />
          <input className="input" name="q2" required placeholder="Question 2 (open-ended)" />
          <button className="btn" type="submit">Create campaign</button>
        </form>
      </section>

      <section className="card">
        <h2>Analytics Engine</h2>
        <select className="select" value={selectedCampaign} onChange={(e) => setSelectedCampaign(e.target.value)}>
          {campaigns.map((c) => <option key={c.id} value={c.id}>{c.title}</option>)}
        </select>
        {metrics && (
          <div className="grid" style={{ marginTop: 12 }}>
            <div className="stats">
              <div className="stat"><strong>{metrics.totalParticipants}</strong><div className="small">Participants</div></div>
              <div className="stat"><strong>{metrics.totalResponses}</strong><div className="small">Responses</div></div>
              <div className="stat"><strong>{metrics.engagement.totalVotes}</strong><div className="small">Votes</div></div>
            </div>
            <SentimentBars sentiment={metrics.sentiment} />
            <div className="card">
              <h3>Top Ideas</h3>
              <ol>
                {metrics.mostPopularIdeas.map((idea: any) => (
                  <li key={idea.id}>{idea.text} <span className="small">({idea.upvotes - idea.downvotes} score)</span></li>
                ))}
              </ol>
            </div>
          </div>
        )}
      </section>
    </div>
  );
}
