"use client";

import { FormEvent, useEffect, useMemo, useState } from "react";
import { useParams } from "next/navigation";

export default function CampaignPage() {
  const params = useParams<{ id: string }>();
  const id = params.id;
  const [campaign, setCampaign] = useState<any>(null);
  const [ideas, setIdeas] = useState<any[]>([]);
  const [top10, setTop10] = useState<any[]>([]);
  const [responses, setResponses] = useState<any[]>([]);

  const load = async () => {
    const campaigns = await fetch("/api/campaigns").then((r) => r.json());
    setCampaign(campaigns.find((c: any) => c.id === id));
    const ideaRes = await fetch(`/api/campaigns/${id}/ideas`).then((r) => r.json());
    setIdeas(ideaRes.ideas);
    setTop10(ideaRes.top10);
    const responseRes = await fetch(`/api/campaigns/${id}/responses`).then((r) => r.json());
    setResponses(responseRes);
  };

  useEffect(() => { if (id) load(); }, [id]);

  const liveStats = useMemo(() => ({
    contributors: new Set([...responses.map((r) => r.userName), ...ideas.map((i) => i.authorName)]).size,
    ideas: ideas.length,
    responses: responses.length
  }), [ideas, responses]);

  async function submitIdea(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    await fetch(`/api/campaigns/${id}/ideas`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ authorName: fd.get("userName"), text: fd.get("text") })
    });
    (e.target as HTMLFormElement).reset();
    load();
  }

  async function vote(ideaId: string, type: "up" | "down") {
    await fetch(`/api/campaigns/${id}/ideas`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ideaId, vote: type, userName: "Guest" })
    });
    load();
  }

  async function submitAnswer(e: FormEvent<HTMLFormElement>, questionId: string) {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    await fetch(`/api/campaigns/${id}/responses`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        questionId,
        userName: fd.get("userName"),
        location: fd.get("location"),
        ageGroup: fd.get("ageGroup"),
        answer: fd.get("answer")
      })
    });
    (e.target as HTMLFormElement).reset();
    load();
  }

  if (!campaign) return <p>Loading campaign...</p>;

  return (
    <div className="grid">
      <section className="card">
        <h1 style={{ marginBottom: 6 }}>{campaign.title}</h1>
        <p className="small">{campaign.companyName} · {campaign.startsAt} to {campaign.endsAt}</p>
        <p>{campaign.description}</p>
        <div className="stats">
          <div className="stat"><strong>{liveStats.contributors}</strong><div className="small">Participants</div></div>
          <div className="stat"><strong>{liveStats.responses}</strong><div className="small">Responses</div></div>
          <div className="stat"><strong>{liveStats.ideas}</strong><div className="small">Ideas submitted</div></div>
        </div>
      </section>

      <section className="card">
        <h2>Questions</h2>
        <div className="grid">
          {campaign.questions.map((q: any) => (
            <form key={q.id} className="card" onSubmit={(e) => submitAnswer(e, q.id)}>
              <strong>{q.prompt}</strong>
              <input className="input" name="userName" placeholder="Your name (optional)" />
              <div className="grid" style={{ gridTemplateColumns: "1fr 1fr" }}>
                <input className="input" name="location" placeholder="Location" />
                <select className="select" name="ageGroup" defaultValue="">
                  <option value="">Age group (optional)</option>
                  <option>13-17</option><option>18-24</option><option>25-34</option><option>35-44</option><option>45+</option>
                </select>
              </div>
              <textarea className="input" required name="answer" placeholder={q.type === "multiple_choice" ? `Type one: ${(q.options || []).join(", ")}` : "Your answer"} rows={2} />
              <button className="btn" type="submit">Submit feedback</button>
            </form>
          ))}
        </div>
      </section>

      <section className="card">
        <h2>Idea Validation System</h2>
        <form className="grid" onSubmit={submitIdea}>
          <input className="input" name="userName" placeholder="Your name" />
          <textarea className="input" required name="text" placeholder="Submit your campaign idea" rows={3} />
          <button className="btn" type="submit">Submit idea (+8 pts)</button>
        </form>

        <h3>Top 10 Ideas</h3>
        <div className="grid" style={{ gridTemplateColumns: "repeat(auto-fit,minmax(220px,1fr))" }}>
          {top10.map((idea, idx) => (
            <article className="card" key={idea.id}>
              <div className="small">#{idx + 1}</div>
              <p>{idea.text}</p>
              <p className="small">By {idea.authorName}</p>
              <div style={{ display: "flex", gap: 8 }}>
                <button className="btn" type="button" onClick={() => vote(idea.id, "up")}>▲ {idea.upvotes}</button>
                <button className="btn" type="button" style={{ background: "#475569" }} onClick={() => vote(idea.id, "down")}>▼ {idea.downvotes}</button>
              </div>
            </article>
          ))}
        </div>
      </section>
    </div>
  );
}
