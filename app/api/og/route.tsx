import { ImageResponse } from "@vercel/og";
import { NextRequest } from "next/server";

const GITHUB_USERNAME_RE = /^[a-zA-Z0-9]([a-zA-Z0-9-]{0,37}[a-zA-Z0-9])?$/;

function sanitizeText(value: string | null, fallback: string, maxLength: number): string {
  if (!value) return fallback;
  return value.replace(/[<>"'&]/g, "").slice(0, maxLength);
}

export async function GET(request: NextRequest) {
  const { searchParams } = request.nextUrl;

  const rawUsername = searchParams.get("username") ?? "";
  const username = GITHUB_USERNAME_RE.test(rawUsername) ? rawUsername : "unknown";

  const developerType = sanitizeText(searchParams.get("type"), "Mystery Developer", 60);
  const emoji = sanitizeText(searchParams.get("emoji"), "🔥", 4);
  const score = sanitizeText(searchParams.get("score"), "?", 2);
  const scoreLabel = sanitizeText(searchParams.get("label"), "Unknown", 40);
  const avatarUrl = `https://github.com/${username}.png`;

  return new ImageResponse(
    (
      <div
        style={{
          width: "1200px",
          height: "630px",
          background: "#0d1117",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          fontFamily: "sans-serif",
          gap: "24px",
          padding: "48px",
        }}
      >
        <div
          style={{
            background: "#161b22",
            border: "1px solid #30363d",
            borderRadius: "24px",
            padding: "8px 20px",
            color: "#8b949e",
            fontSize: "14px",
            display: "flex",
            alignItems: "center",
            gap: "8px",
          }}
        >
          🔥 roastmygithub.dev
        </div>

        <div style={{ display: "flex", alignItems: "center", gap: "16px" }}>
          <img
            src={avatarUrl}
            width={72}
            height={72}
            style={{ borderRadius: "50%", border: "2px solid #30363d" }}
            alt=""
          />
          <span style={{ color: "#8b949e", fontSize: "22px" }}>@{username}</span>
        </div>

        <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "8px" }}>
          <span style={{ fontSize: "72px" }}>{emoji}</span>
          <span
            style={{
              color: "#ffffff",
              fontSize: "36px",
              fontWeight: "bold",
              textAlign: "center",
              maxWidth: "900px",
            }}
          >
            {developerType}
          </span>
        </div>

        <div
          style={{
            background: "#161b22",
            border: "1px solid #30363d",
            borderRadius: "999px",
            padding: "12px 28px",
            display: "flex",
            alignItems: "center",
            gap: "12px",
          }}
        >
          <span style={{ color: "#fbbf24", fontSize: "28px", fontWeight: "bold" }}>
            {score}/10
          </span>
          <span style={{ color: "#8b949e", fontSize: "16px" }}>GitHub Rizz Score</span>
          <span style={{ color: "#8b949e", fontSize: "14px" }}>— {scoreLabel}</span>
        </div>
      </div>
    ),
    { width: 1200, height: 630 }
  );
}
