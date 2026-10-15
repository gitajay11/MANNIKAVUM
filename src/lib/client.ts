"use client";

import type { DeviceHints, ResponseType } from "./responses";

// Renamed from "mk_session": ids under the old key may already be used up.
const KEY = "mk_answer";

/**
 * Anonymous id for the answer about to be sent. Kept in sessionStorage until
 * that answer is stored, so a retry (even after a reload) cannot create a
 * second record; nothing about the device or person is derived from it.
 */
function pendingId(): string {
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

/**
 * Each stored answer gets a fresh id afterwards, so going back and choosing
 * again is recorded instead of being dropped as a duplicate of the first.
 */
function releaseId() {
  try {
    sessionStorage.removeItem(KEY);
  } catch {
    /* storage unavailable: the next pendingId() is random anyway */
  }
}

/** Id of the last stored answer; the optional message is attached to it. */
let answeredId: string | null = null;

type Brand = { brand: string; version: string };
type UAData = {
  platform?: string;
  getHighEntropyValues(hints: string[]): Promise<{
    model?: string;
    platform?: string;
    platformVersion?: string;
    fullVersionList?: Brand[];
  }>;
};

const clip = (s: string | undefined) => s?.trim().slice(0, 64) || undefined;

/**
 * Client Hints (Chromium browsers only). Never blocks the submission:
 * gives up after 500ms and swallows any error.
 */
async function getDeviceHints(): Promise<DeviceHints | undefined> {
  try {
    const uad = (navigator as Navigator & { userAgentData?: UAData }).userAgentData;
    if (!uad) return undefined;
    const v = await Promise.race([
      uad.getHighEntropyValues(["model", "platformVersion", "fullVersionList"]),
      new Promise<never>((_, reject) => setTimeout(() => reject(new Error("timeout")), 500)),
    ]);
    // Skip GREASE brands ("Not A;Brand") and the generic "Chromium" entry.
    const real = v.fullVersionList?.filter((b) => !/not.?a.?brand/i.test(b.brand));
    const brand = real?.find((b) => b.brand !== "Chromium") ?? real?.[0];
    const hints: DeviceHints = {
      model: clip(v.model),
      platform: clip(v.platform ?? uad.platform),
      platformVersion: clip(v.platformVersion),
      browser: clip(brand?.brand),
      browserVersion: clip(brand?.version),
    };
    return Object.values(hints).some(Boolean) ? hints : undefined;
  } catch {
    return undefined;
  }
}

export async function submitResponse(responseType: ResponseType) {
  const hints = await getDeviceHints();
  const sessionId = pendingId();
  const res = await fetch("/api/responses", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ sessionId, responseType, hints }),
  });
  if (!res.ok) throw new Error(`Failed to submit (${res.status})`);
  answeredId = sessionId;
  releaseId();
}

export async function submitMessage(message: string) {
  if (!answeredId) throw new Error("No stored answer to attach the message to");
  const res = await fetch("/api/responses", {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ sessionId: answeredId, message }),
  });
  if (!res.ok) throw new Error(`Failed to send (${res.status})`);
}
