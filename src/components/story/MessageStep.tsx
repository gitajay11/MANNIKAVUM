"use client";

import { motion } from "framer-motion";
import { useState } from "react";
import { MESSAGE_MAX } from "@/lib/responses";
import Screen, { itemVariants, listVariants } from "./Screen";

export default function MessageStep({
  onSend,
  onSkip,
}: {
  onSend: (message: string) => Promise<void>;
  onSkip: () => void;
}) {
  const [text, setText] = useState("");
  const [sending, setSending] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const trimmed = text.trim();

  const send = async () => {
    if (!trimmed || sending) return;
    setSending(true);
    setError(null);
    try {
      await onSend(trimmed);
    } catch {
      setError("Couldn't send that just now. You can try again or skip.");
      setSending(false);
    }
  };

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
          className="font-display mb-2 text-3xl font-semibold sm:text-4xl"
        >
          Would you like to say anything?
        </motion.h2>
        <motion.p variants={itemVariants} className="text-muted mb-6 text-sm">
          Completely optional. Skipping is a perfectly good answer.
        </motion.p>

        <motion.div variants={itemVariants} className="glass rounded-3xl p-4 sm:p-5">
          <label htmlFor="msg" className="sr-only">
            Optional message
          </label>
          <textarea
            id="msg"
            value={text}
            onChange={(e) => setText(e.target.value.slice(0, MESSAGE_MAX))}
            placeholder="Write something… (optional)"
            rows={5}
            maxLength={MESSAGE_MAX}
            disabled={sending}
            className="text-fg placeholder:text-muted/60 w-full resize-none rounded-2xl bg-white/5 p-4 text-base leading-relaxed outline-none focus:ring-2 focus:ring-(--lavender)/60"
          />
          <div className="text-muted/70 mt-2 text-right text-xs tabular-nums">
            {text.length}/{MESSAGE_MAX}
          </div>
        </motion.div>

        <motion.div
          variants={itemVariants}
          className="mt-6 flex flex-col-reverse items-center justify-center gap-3 sm:flex-row"
        >
          <motion.button
            type="button"
            onClick={onSkip}
            disabled={sending}
            className="btn btn-ghost w-full sm:w-auto"
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
          >
            Skip
          </motion.button>
          <motion.button
            type="button"
            onClick={send}
            disabled={!trimmed || sending}
            className="btn btn-primary w-full disabled:opacity-50 sm:w-auto"
            whileHover={{ scale: trimmed ? 1.03 : 1 }}
            whileTap={{ scale: trimmed ? 0.97 : 1 }}
          >
            {sending ? "Sending…" : "Send"}
          </motion.button>
        </motion.div>

        {error && (
          <p className="text-peach mt-4 text-sm" role="alert">
            {error}
          </p>
        )}
      </motion.div>
    </Screen>
  );
}
