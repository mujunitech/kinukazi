import "./globals.css";
import Link from "next/link";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Kinukazi",
  description: "Real-time customer insight and idea validation platform"
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <header className="container" style={{ paddingBottom: 0 }}>
          <nav className="card" style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <strong>Kinukazi</strong>
            <div style={{ display: "flex", gap: "1rem" }}>
              <Link href="/">Home</Link>
              <Link href="/company">Company Dashboard</Link>
              <Link href="/leaderboard">Leaderboard</Link>
            </div>
          </nav>
        </header>
        <main className="container">{children}</main>
      </body>
    </html>
  );
}
