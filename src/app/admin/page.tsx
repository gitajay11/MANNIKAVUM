import type { Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";
import { isAdminRequest } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import {
  RESPONSE_META,
  RESPONSE_TYPES,
  type ResponseType,
} from "@/lib/responses";
import LogoutButton from "@/components/admin/LogoutButton";
import Timeline from "@/components/admin/Timeline";

export const metadata: Metadata = { title: "Admin · Responses" };
export const dynamic = "force-dynamic";

type Filter = "all" | "accepted" | "needs-time" | "no-comment" | "declined";

const FILTERS: { key: Filter; label: string; types: ResponseType[] | null }[] = [
  { key: "all", label: "All", types: null },
  { key: "accepted", label: "Accepted apology", types: ["ACCEPTED"] },
  { key: "needs-time", label: "Needs time", types: ["NEED_TIME"] },
  {
    key: "no-comment",
    label: "No response / comment",
    types: ["DONT_KNOW", "NO_RESPONSE_NEEDED"],
  },
  { key: "declined", label: "Doesn't want to respond", types: ["DECLINE"] },
];

const dateFmt = new Intl.DateTimeFormat("en-GB", {
  day: "numeric",
  month: "long",
  year: "numeric",
});
const timeFmt = new Intl.DateTimeFormat("en-GB", {
  hour: "2-digit",
  minute: "2-digit",
  timeZone: "Asia/Kolkata",
  timeZoneName: "short",
});

function formatDate(d: Date) {
  return `${dateFmt.format(d)} · ${timeFmt.format(d)}`;
}

export default async function AdminPage({
  searchParams,
}: {
  searchParams: Promise<{ filter?: string }>;
}) {
  // proxy.ts already gates this route; re-check defensively.
  if (!(await isAdminRequest())) redirect("/admin/login");

  const { filter: rawFilter } = await searchParams;
  const filter =
    FILTERS.find((f) => f.key === rawFilter) ?? FILTERS[0];

  const [total, byType, latest, rows] = await Promise.all([
    prisma.response.count(),
    prisma.response.groupBy({ by: ["responseType"], _count: { _all: true } }),
    prisma.response.findFirst({ orderBy: { createdAt: "desc" } }),
    prisma.response.findMany({
      where: filter.types ? { responseType: { in: filter.types } } : undefined,
      orderBy: { createdAt: "desc" },
      take: 200,
    }),
  ]);

  const counts = Object.fromEntries(
    RESPONSE_TYPES.map((t) => [t, 0]),
  ) as Record<ResponseType, number>;
  for (const g of byType) counts[g.responseType] = g._count._all;

  return (
    <main className="mx-auto w-full max-w-4xl px-5 py-8 sm:px-8">
      <header className="mb-8 flex flex-wrap items-center justify-between gap-4">
        <div>
          <p className="text-muted text-xs tracking-[0.3em] uppercase">
            Private dashboard
          </p>
          <h1 className="font-display text-3xl font-semibold">Responses</h1>
        </div>
        <LogoutButton />
      </header>

      <p className="text-muted mb-6 text-xs">
        Only what she chose to submit through the site is shown here: her
        selected response, the time, and an optional message. Nothing else
        is collected.
      </p>

      {/* Stats */}
      <section className="mb-8 grid gap-3 sm:grid-cols-3">
        <div className="glass rounded-2xl p-5">
          <p className="text-muted text-xs uppercase">Total responses</p>
          <p className="font-display mt-1 text-4xl font-semibold">{total}</p>
        </div>
        <div className="glass rounded-2xl p-5 sm:col-span-2">
          <p className="text-muted text-xs uppercase">Latest response</p>
          {latest ? (
            <>
              <p className="mt-1 text-lg font-semibold">
                {RESPONSE_META[latest.responseType].emoji}{" "}
                {RESPONSE_META[latest.responseType].label}
              </p>
              <p className="text-muted text-sm">{formatDate(latest.createdAt)}</p>
            </>
          ) : (
            <p className="text-muted mt-1">Nothing yet.</p>
          )}
        </div>
      </section>

      {/* Breakdown */}
      <section className="mb-8 grid grid-cols-2 gap-3 sm:grid-cols-5">
        {RESPONSE_TYPES.map((t) => (
          <div key={t} className="glass rounded-2xl p-4">
            <p className="text-2xl" aria-hidden>
              {RESPONSE_META[t].emoji}
            </p>
            <p className="font-display text-2xl font-semibold">{counts[t]}</p>
            <p className="text-muted text-xs">{RESPONSE_META[t].short}</p>
          </div>
        ))}
      </section>

      {/* Filters */}
      <nav className="mb-5 flex flex-wrap gap-2" aria-label="Filter responses">
        {FILTERS.map((f) => {
          const active = f.key === filter.key;
          return (
            <Link
              key={f.key}
              href={f.key === "all" ? "/admin" : `/admin?filter=${f.key}`}
              className={`rounded-full px-4 py-2 text-sm font-semibold transition-colors ${
                active
                  ? "bg-(--lavender) text-[#1a1030]"
                  : "glass text-fg hover:bg-white/9"
              }`}
              aria-current={active ? "page" : undefined}
            >
              {f.label}
            </Link>
          );
        })}
      </nav>

      {/* Timeline */}
      <section className="mb-8">
        <h2 className="font-display mb-3 text-xl font-semibold">Timeline</h2>
        <Timeline
          items={rows.map((r) => ({
            id: r.id,
            type: r.responseType,
            at: r.createdAt.toISOString(),
          }))}
        />
      </section>

      {/* History */}
      <section>
        <h2 className="font-display mb-3 text-xl font-semibold">
          Response history{" "}
          <span className="text-muted text-sm font-normal">({rows.length})</span>
        </h2>
        {rows.length === 0 ? (
          <div className="glass text-muted rounded-2xl p-6 text-center">
            No responses in this filter.
          </div>
        ) : (
          <ol className="space-y-3">
            {rows.map((r) => {
              const meta = RESPONSE_META[r.responseType];
              return (
                <li key={r.id} className="glass rounded-2xl p-5">
                  <div className="flex flex-wrap items-start justify-between gap-2">
                    <div>
                      <p className="text-muted text-xs uppercase">Response</p>
                      <p className="text-lg font-semibold">
                        <span aria-hidden>{meta.emoji}</span> {meta.label}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="text-muted text-xs uppercase">Date</p>
                      <p className="text-sm">{formatDate(r.createdAt)}</p>
                    </div>
                  </div>
                  <div className="mt-3">
                    <p className="text-muted text-xs uppercase">Message</p>
                    {r.message ? (
                      <p className="mt-1 text-base leading-relaxed whitespace-pre-wrap">
                        {r.message}
                      </p>
                    ) : (
                      <p className="text-muted mt-1 text-sm italic">
                        No message.
                      </p>
                    )}
                  </div>
                </li>
              );
            })}
          </ol>
        )}
      </section>
    </main>
  );
}
