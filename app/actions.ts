"use server";

import { redirect } from "next/navigation";

// GitHub username: alphanumeric + hyphens, 1-39 chars, can't start/end with hyphen
const GITHUB_USERNAME_RE = /^[a-zA-Z0-9]([a-zA-Z0-9-]{0,37}[a-zA-Z0-9])?$/;

export async function roastAction(formData: FormData) {
  const raw = formData.get("username");
  if (typeof raw !== "string") return;

  const username = raw
    .trim()
    .replace(/^https?:\/\/github\.com\//i, "")
    .replace(/\/$/, "")
    .split("/")[0]
    .split("?")[0]
    .split("#")[0];

  if (!username || !GITHUB_USERNAME_RE.test(username)) return;

  redirect(`/${username}`);
}
