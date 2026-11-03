import { ImageResponse } from "next/og";
import { NextRequest } from "next/server";

const GITHUB_USERNAME_RE = /^[a-zA-Z0-9]([a-zA-Z0-9-]{0,37}[a-zA-Z0-9])?$/;

function sanitize(value: string | null, fallback: string, max: number): string {
  if (!value) return fallback;
  return value.replace(/[<>"'&]/g, "").slice(0, max);
}

export async function GET(request: NextRequest) {
  const p = request.nextUrl.searchParams;

  const rawUsername = p.get("username") ?? "";
  const username = GITHUB_USERNAME_RE.test(rawUsername) ? rawUsername : "unknown";
  const developerType = sanitize(p.get("type"), "Mystery Developer", 60);
  const emoji = sanitize(p.get("emoji"), "🔥", 4);
  const score = sanitize(p.get("score"), "?", 2);
  const scoreLabel = sanitize(p.get("label"), "", 40);

  return new ImageResponse(
    (
      <div
        style={{
          width: "1200px",
          height: "630px",
          background: "linear-gradient(135deg, #0a0e1a 0%, #0f172a 60%, #1a0a14 100%)",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          fontFamily: "sans-serif",
          gap: "20px",
          padding: "60px",
          position: "relative",
        }}
      >
        {/* Decorative snowflakes */}
        {["8%", "20%", "80%", "92%", "50%"].map((left, i) => (
          <div
            key={i}
            style={{
              position: "absolute",
              top: ["12%", "70%", "8%", "75%", "5%"][i],
              left,
              color: "rgba(255,255,255,0.08)",
              fontSize: "48px",
            }}
          >
            ❄
          </div>
        ))}

        {/* Badge */}
        <div
          style={{
            background: "rgba(196,30,58,0.15)",
            border: "1px solid rgba(196,30,58,0.4)",
            borderRadius: "24px",
            padding: "8px 22px",
            color: "#c41e3a",
            fontSize: "15px",
            display: "flex",
            gap: "8px",
          }}
        >
          🎄 roastmygithub
        </div>

        {/* Avatar + username */}
        <div style={{ display: "flex", alignItems: "center", gap: "16px" }}>
          <img
            src={`https://github.com/${username}.png`}
            width={72}
            height={72}
            style={{ borderRadius: "50%", border: "2px solid #c41e3a" }}
            alt=""
          />
          <span style={{ color: "#94a3b8", fontSize: "24px" }}>@{username}</span>
        </div>

        {/* Developer type */}
        <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "10px" }}>
          <span style={{ fontSize: "68px" }}>{emoji}</span>
          <span
            style={{
              color: "#ffffff",
              fontSize: "38px",
              fontWeight: "bold",
              textAlign: "center",
              maxWidth: "900px",
            }}
          >
            {developerType}
          </span>
        </div>

        {/* Score */}
        <div
          style={{
            background: "rgba(15,23,42,0.8)",
            border: "1px solid #1e3a5f",
            borderRadius: "999px",
            padding: "12px 32px",
            display: "flex",
            alignItems: "center",
            gap: "12px",
          }}
        >
          <span style={{ color: "#fbbf24", fontSize: "28px", fontWeight: "bold" }}>
            {score}/10
          </span>
          <span style={{ color: "#64748b", fontSize: "16px" }}>GitHub Rizz Score</span>
          {scoreLabel ? (
            <span style={{ color: "#64748b", fontSize: "14px" }}>— {scoreLabel}</span>
          ) : null}
        </div>
      </div>
    ),
    { width: 1200, height: 630 }
  );
}
