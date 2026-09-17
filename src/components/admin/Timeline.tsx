import { RESPONSE_META, type ResponseType } from "@/lib/responses";

const dateFmt = new Intl.DateTimeFormat("en-GB", {
  day: "numeric",
  month: "short",
  year: "numeric",
  hour: "2-digit",
  minute: "2-digit",
  timeZone: "Asia/Kolkata",
});

const COLOR: Record<ResponseType, string> = {
  ACCEPTED: "var(--mint)",
  NEED_TIME: "var(--peach)",
  DONT_KNOW: "var(--lavender)",
  DECLINE: "var(--rose)",
  NO_RESPONSE_NEEDED: "var(--fg)",
};

/** Simple vertical timeline; newest first, matching the history list. */
export default function Timeline({
  items,
}: {
  items: { id: string; type: ResponseType; at: string }[];
}) {
  if (items.length === 0) {
    return (
      <div className="glass text-muted rounded-2xl p-6 text-center text-sm">
        The timeline will fill in once a response arrives.
      </div>
    );
  }

  return (
    <div className="glass rounded-2xl p-5">
      <ol className="relative ml-3 border-l border-white/10 pl-6">
        {items.map((item) => (
          <li key={item.id} className="relative mb-5 last:mb-0">
            <span
              aria-hidden
              className="absolute top-1.5 -left-[31px] h-2.5 w-2.5 rounded-full"
              style={{
                background: COLOR[item.type],
                boxShadow: `0 0 12px ${COLOR[item.type]}`,
              }}
            />
            <p className="text-sm font-semibold">
              <span aria-hidden>{RESPONSE_META[item.type].emoji}</span>{" "}
              {RESPONSE_META[item.type].short}
            </p>
            <p className="text-muted text-xs">
              {dateFmt.format(new Date(item.at))}
            </p>
          </li>
        ))}
      </ol>
    </div>
  );
}
