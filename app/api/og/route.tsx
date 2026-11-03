import { ImageResponse } from "@vercel/og";
import { NextRequest } from "next/server";

const GITHUB_USERNAME_RE = /^[a-zA-Z0-9]([a-zA-Z0-9-]{0,37}[a-zA-Z0-9])?$/;

export async function GET(request: NextRequest) {
  const { searchParams } = request.nextUrl;
  const raw = searchParams.get("username") ?? "";
  const username = GITHUB_USERNAME_RE.test(raw) ? raw : "unknown";

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
          gap: "28px",
        }}
      >
        <div
          style={{
            background: "#161b22",
            border: "1px solid #30363d",
            borderRadius: "24px",
            padding: "10px 24px",
            color: "#8b949e",
            fontSize: "16px",
            display: "flex",
            gap: "8px",
          }}
        >
          🔥 roastmygithub
        </div>

        <div style={{ display: "flex", alignItems: "center", gap: "20px" }}>
          <img
            src={`https://github.com/${username}.png`}
            width={80}
            height={80}
            style={{ borderRadius: "50%", border: "2px solid #30363d" }}
            alt=""
          />
          <span style={{ color: "#8b949e", fontSize: "28px" }}>@{username}</span>
        </div>

        <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "12px" }}>
          <span style={{ fontSize: "80px" }}>🔥</span>
          <span style={{ color: "#ffffff", fontSize: "42px", fontWeight: "bold" }}>
            just got roasted
          </span>
          <span style={{ color: "#8b949e", fontSize: "20px" }}>
            Find out your developer type →
          </span>
        </div>
      </div>
    ),
    { width: 1200, height: 630 }
  );
}
