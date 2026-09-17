import { z } from "zod";

/** The only response types she can pick. Shared by UI, API and dashboard. */
export const RESPONSE_TYPES = [
  "ACCEPTED",
  "NEED_TIME",
  "DONT_KNOW",
  "DECLINE",
  "NO_RESPONSE_NEEDED",
] as const;

export type ResponseType = (typeof RESPONSE_TYPES)[number];

export const RESPONSE_META: Record<
  ResponseType,
  { emoji: string; label: string; short: string }
> = {
  ACCEPTED: { emoji: "🙏", label: "I accept your apology", short: "Accepted" },
  NEED_TIME: { emoji: "😐", label: "I need some time", short: "Needs time" },
  DONT_KNOW: {
    emoji: "💭",
    label: "I don't know what to say",
    short: "Doesn't know what to say",
  },
  DECLINE: {
    emoji: "🚫",
    label: "I don't want to respond",
    short: "Doesn't want to respond",
  },
  NO_RESPONSE_NEEDED: {
    emoji: "🤍",
    label: "No response needed",
    short: "No response needed",
  },
};

/** Response types that skip the "would you like to say anything?" step. */
export const SILENT_TYPES: ReadonlySet<ResponseType> = new Set([
  "DECLINE",
  "NO_RESPONSE_NEEDED",
]);

export const MESSAGE_MAX = 2000;

const sessionId = z
  .string()
  .regex(/^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i, {
    message: "Invalid session id",
  });

export const createResponseSchema = z
  .object({
    sessionId,
    responseType: z.enum(RESPONSE_TYPES),
  })
  .strict();

export const addMessageSchema = z
  .object({
    sessionId,
    message: z.string().trim().min(1).max(MESSAGE_MAX),
  })
  .strict();

// Control characters except tab (\x09), LF (\x0A) and CR (\x0D).
const CONTROL_CHARS = /[\x00-\x08\x0B\x0C\x0E-\x1F\x7F]/g;

/**
 * Strip control characters and collapse excessive blank lines. Content is
 * rendered as text (React escapes it), so no HTML-entity encoding is needed
 * here — this is about keeping stored data clean.
 */
export function sanitizeMessage(input: string): string {
  return input
    .replace(CONTROL_CHARS, "")
    .replace(/\r\n?/g, "\n")
    .replace(/\n{3,}/g, "\n\n")
    .trim()
    .slice(0, MESSAGE_MAX);
}
