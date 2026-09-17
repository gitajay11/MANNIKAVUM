import { NextResponse } from "next/server";
import { Prisma } from "@prisma/client";
import { prisma } from "@/lib/prisma";
import { allowSubmission } from "@/lib/rate-limit";
import {
  addMessageSchema,
  createResponseSchema,
  sanitizeMessage,
} from "@/lib/responses";

export const runtime = "nodejs";

async function readJson(req: Request): Promise<unknown> {
  try {
    return await req.json();
  } catch {
    return null;
  }
}

/**
 * Record a response. Called only after she explicitly taps a response button.
 * Stores nothing but the chosen type, a random session id and a timestamp.
 */
export async function POST(req: Request) {
  const parsed = createResponseSchema.safeParse(await readJson(req));
  if (!parsed.success) {
    return NextResponse.json({ error: "Invalid request" }, { status: 400 });
  }
  const { sessionId, responseType } = parsed.data;

  if (!allowSubmission(sessionId)) {
    return NextResponse.json({ error: "Too many requests" }, { status: 429 });
  }

  try {
    const created = await prisma.response.create({
      data: { sessionId, responseType },
      select: { id: true },
    });
    return NextResponse.json({ ok: true, id: created.id }, { status: 201 });
  } catch (err) {
    if (
      err instanceof Prisma.PrismaClientKnownRequestError &&
      err.code === "P2002"
    ) {
      // Same session already answered — treat as idempotent success.
      return NextResponse.json({ ok: true, duplicate: true }, { status: 200 });
    }
    console.error("Failed to store response", err);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}

/** Attach the optional message to an existing response for this session. */
export async function PATCH(req: Request) {
  const parsed = addMessageSchema.safeParse(await readJson(req));
  if (!parsed.success) {
    return NextResponse.json({ error: "Invalid request" }, { status: 400 });
  }
  const { sessionId } = parsed.data;
  const message = sanitizeMessage(parsed.data.message);
  if (!message) {
    return NextResponse.json({ error: "Empty message" }, { status: 400 });
  }

  if (!allowSubmission(sessionId)) {
    return NextResponse.json({ error: "Too many requests" }, { status: 429 });
  }

  try {
    // Only set the message once; a later PATCH cannot overwrite it.
    const result = await prisma.response.updateMany({
      where: { sessionId, message: null },
      data: { message },
    });
    if (result.count === 0) {
      return NextResponse.json({ error: "Not found" }, { status: 404 });
    }
    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error("Failed to store message", err);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
