interface ChartsProps {
  sentiment: { positive: number; negative: number; neutral: number };
}

export function SentimentBars({ sentiment }: ChartsProps) {
  const total = Math.max(sentiment.positive + sentiment.negative + sentiment.neutral, 1);
  const bar = (v: number, color: string) => (
    <div style={{ marginBottom: 8 }}>
      <div className="small" style={{ marginBottom: 4 }}>{v} responses</div>
      <div style={{ background: "#e5e7eb", borderRadius: 999, height: 10 }}>
        <div style={{ width: `${(v / total) * 100}%`, background: color, height: 10, borderRadius: 999 }} />
      </div>
    </div>
  );

  return (
    <div className="card">
      <h3>Sentiment Trends</h3>
      {bar(sentiment.positive, "#22c55e")}
      {bar(sentiment.neutral, "#6b7280")}
      {bar(sentiment.negative, "#ef4444")}
    </div>
  );
}
