"use client";

import type { DeviceHints, ResponseType } from "./responses";

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
  const res = await fetch("/api/responses", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ sessionId: getSessionId(), responseType, hints }),
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
