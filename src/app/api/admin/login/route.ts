import { NextResponse } from "next/server";
import { z } from "zod";
import {
  ADMIN_COOKIE,
  adminCookieOptions,
  createAdminToken,
  verifyAdminPassword,
} from "@/lib/auth";
import { allowLoginAttempt } from "@/lib/rate-limit";

export const runtime = "nodejs";

const schema = z.object({ password: z.string().min(1).max(256) }).strict();

export async function POST(req: Request) {
  if (!allowLoginAttempt()) {
    return NextResponse.json(
      { error: "Too many attempts. Try again later." },
      { status: 429 },
    );
  }

  let body: unknown = null;
  try {
    body = await req.json();
  } catch {
    /* fallthrough */
  }
  const parsed = schema.safeParse(body);
  if (!parsed.success || !verifyAdminPassword(parsed.data.password)) {
    return NextResponse.json({ error: "Wrong password" }, { status: 401 });
  }

  const res = NextResponse.json({ ok: true });
  res.cookies.set(ADMIN_COOKIE, await createAdminToken(), adminCookieOptions());
  return res;
}
