"use client";

import type { ResponseType } from "./responses";

const KEY = "mk_session";

/**
 * Anonymous per-visit id. Lives in sessionStorage only so a reload in the
 * same tab does not create a second record; nothing about the device or
 * person is derived from it.
 */
export function getSessionId(): string {
  try {
    const existing = sessionStorage.getItem(KEY);
    if (existing) return existing;
    const id = crypto.randomUUID();
    sessionStorage.setItem(KEY, id);
    return id;
  } catch {
    return crypto.randomUUID();
  }
}

export async function submitResponse(responseType: ResponseType) {
  const res = await fetch("/api/responses", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ sessionId: getSessionId(), responseType }),
  });
  if (!res.ok) throw new Error(`Failed to submit (${res.status})`);
}

export async function submitMessage(message: string) {
  const res = await fetch("/api/responses", {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ sessionId: getSessionId(), message }),
  });
  if (!res.ok) throw new Error(`Failed to send (${res.status})`);
}
