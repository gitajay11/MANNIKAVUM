"use client";

import { motion } from "framer-motion";
import type { ResponseType } from "@/lib/responses";
import Screen, { itemVariants, listVariants } from "./Screen";

function linesFor(type: ResponseType): { lines: string[]; emoji: string } {
  switch (type) {
    case "NO_RESPONSE_NEEDED":
      return {
        emoji: "🤍",
        lines: [
          "That's okay. 🏳️",
          "You didn't owe me a response in the first place.",
          "I just wanted to apologize properly.",
          "I'm genuinely sorry.",
          "Take care. 🌙",
        ],
      };
    case "DECLINE":
      return {
        emoji: "🌙",
        lines: [
          "Understood. 🌙",
          "You don't have to explain, and I won't ask you to.",
          "Thank you for reading this far — that was more than enough.",
          "I hope things become better for you, whether that includes me or not.",
        ],
      };
    case "NEED_TIME":
      return {
        emoji: "🕊️",
        lines: [
          "Thank you for hearing me out.",
          "Take all the time you need. There's no clock on this, and I won't be checking one.",
          "Whatever you decide, I respect your decision.",
          "I hope things become better for you, whether that includes me or not.",
        ],
      };
    case "DONT_KNOW":
      return {
        emoji: "🌱",
        lines: [
          "Thank you for hearing me out.",
          "Not knowing what to say is a completely fair answer. You don't have to figure it out.",
          "Whatever you choose, I respect your decision.",
          "I hope things become better for you, whether that includes me or not.",
        ],
      };
    case "ACCEPTED":
    default:
      return {
        emoji: "🌷",
        lines: [
          "Thank you for hearing me out.",
          "That means more than I can put into a web page. Thank you.",
          "Whatever you choose from here, I respect your decision.",
          "I hope things become better for you, whether that includes me or not.",
        ],
      };
  }
}

export default function FinalScreen({
  type,
  onNext,
}: {
  type: ResponseType;
  onNext: () => void;
}) {
  const { lines, emoji } = linesFor(type);

  return (
    <Screen className="min-h-dvh justify-center text-center">
      <motion.div
        variants={{
          animate: { transition: { staggerChildren: 0.5, delayChildren: 0.3 } },
        }}
        initial="initial"
        animate="animate"
        className="w-full"
      >
        <motion.div
          variants={itemVariants}
          className="mb-6 text-5xl"
          aria-hidden
        >
          <motion.span
            className="inline-block"
            animate={{ y: [0, -6, 0] }}
            transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
          >
            {emoji}
          </motion.span>
        </motion.div>

        <div className="glass space-y-4 rounded-3xl p-6 sm:p-9">
          {lines.map((line, i) => (
            <motion.p
              key={i}
              variants={itemVariants}
              className={
                i === 0
                  ? "font-display text-2xl leading-snug font-semibold sm:text-3xl"
                  : "text-fg/90 text-base leading-relaxed sm:text-lg"
              }
            >
              {line}
            </motion.p>
          ))}
        </div>

        <motion.div
          variants={listVariants}
          className="mt-8 flex justify-center"
        >
          <motion.button
            type="button"
            variants={itemVariants}
            onClick={onNext}
            className="btn btn-ghost"
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
          >
            One last thing →
          </motion.button>
        </motion.div>
      </motion.div>
    </Screen>
  );
}
