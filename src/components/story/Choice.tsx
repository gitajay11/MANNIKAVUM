"use client";

import { motion } from "framer-motion";
import { useState } from "react";
import { RESPONSE_META, type ResponseType } from "@/lib/responses";
import Screen, { itemVariants, listVariants } from "./Screen";

const ALTERNATIVES: ResponseType[] = ["NEED_TIME", "DONT_KNOW", "DECLINE"];

export default function Choice({
  onChoose,
}: {
  onChoose: (type: ResponseType) => Promise<void>;
}) {
  const [pending, setPending] = useState<ResponseType | null>(null);
  const [error, setError] = useState<string | null>(null);

  const choose = async (type: ResponseType) => {
    if (pending) return;
    setPending(type);
    setError(null);
    try {
      await onChoose(type);
    } catch {
      setError("Something went wrong sending that. You can try again, or just close this — no pressure.");
      setPending(null);
    }
  };

  const busy = pending !== null;

  return (
    <Screen className="min-h-dvh justify-center text-center">
      <motion.div
        variants={listVariants}
        initial="initial"
        animate="animate"
        className="w-full"
      >
        <motion.h2
          variants={itemVariants}
          className="font-display mb-3 text-3xl font-semibold sm:text-4xl"
        >
          That&rsquo;s everything I wanted to say.
        </motion.h2>
        <motion.p variants={itemVariants} className="text-muted mb-8 text-sm sm:text-base">
          Whatever you pick here is okay. There&rsquo;s no wrong answer.
        </motion.p>

        <motion.div variants={itemVariants}>
          <motion.button
            type="button"
            disabled={busy}
            onClick={() => choose("ACCEPTED")}
            className="btn btn-primary w-full max-w-sm text-lg sm:text-xl"
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
          >
            {pending === "ACCEPTED" ? "Sending…" : "Accept My Apology ❤️"}
          </motion.button>
        </motion.div>

        <motion.p
          variants={itemVariants}
          className="text-fg/80 mt-8 mb-4 text-base"
        >
          I understand if you&rsquo;re not ready to forgive me.
        </motion.p>

        <div className="grid gap-3 sm:grid-cols-3">
          {ALTERNATIVES.map((type) => {
            const meta = RESPONSE_META[type];
            return (
              <motion.button
                key={type}
                type="button"
                variants={itemVariants}
                disabled={busy}
                onClick={() => choose(type)}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="glass flex min-h-24 flex-col items-center justify-center gap-2 rounded-2xl p-4 text-base font-semibold transition-colors hover:bg-white/8 disabled:opacity-60"
              >
                <span className="text-2xl" aria-hidden>
                  {meta.emoji}
                </span>
                {pending === type ? "Sending…" : meta.label}
              </motion.button>
            );
          })}
        </div>

        <motion.div
          variants={itemVariants}
          className="glass mt-4 rounded-2xl p-5 text-left sm:p-6"
        >
          <p className="text-base font-semibold sm:text-lg">
            <span aria-hidden>🤍</span> No response needed
          </p>
          <p className="text-muted mt-1 text-sm leading-relaxed sm:text-base">
            You don&rsquo;t have to reply. I just wanted to say I&rsquo;m genuinely
            sorry.
          </p>
          <motion.button
            type="button"
            disabled={busy}
            onClick={() => choose("NO_RESPONSE_NEEDED")}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className="btn btn-ghost mt-4 w-full text-sm sm:w-auto"
          >
            {pending === "NO_RESPONSE_NEEDED"
              ? "Okay…"
              : "Continue without responding"}
          </motion.button>
        </motion.div>

        {error && (
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-peach mt-4 text-sm"
            role="alert"
          >
            {error}
          </motion.p>
        )}
      </motion.div>
    </Screen>
  );
}
