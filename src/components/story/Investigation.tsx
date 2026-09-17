"use client";

import { motion } from "framer-motion";
import Screen, { itemVariants, listVariants } from "./Screen";

const ROWS: { label: string; value: string; emoji: string }[] = [
  { label: "Crime", value: "Being an idiot and making a mistake", emoji: "🚨" },
  {
    label: "Victim",
    value: "Someone who absolutely did NOT deserve it",
    emoji: "🌷",
  },
  { label: "Suspect", value: "Me. Unfortunately.", emoji: "🫠" },
  { label: "Evidence", value: "Too much to explain 😭", emoji: "📁" },
  { label: "Verdict", value: "100% Guilty", emoji: "⚖️" },
  {
    label: "Sentence",
    value: "Apologize sincerely and accept whatever response she chooses.",
    emoji: "📜",
  },
];

export default function Investigation({ onNext }: { onNext: () => void }) {
  return (
    <Screen className="min-h-dvh justify-center">
      <motion.div
        variants={listVariants}
        initial="initial"
        animate="animate"
        className="w-full"
      >
        <motion.div variants={itemVariants} className="mb-6 text-center">
          <p className="text-muted mb-2 text-xs tracking-[0.3em] uppercase">
            Case file #0001
          </p>
          <h2 className="font-display text-3xl font-semibold sm:text-4xl">
            Official Investigation Report{" "}<span className="inline-block">🔎</span>
          </h2>
        </motion.div>

        <motion.div
          variants={itemVariants}
          className="glass relative overflow-hidden rounded-3xl px-5 pt-12 pb-5 sm:px-7 sm:pt-12 sm:pb-7"
        >
          <motion.div
            className="stamp pointer-events-none absolute top-3 right-4 text-sm sm:text-base"
            initial={{ scale: 3, opacity: 0, rotate: -20 }}
            animate={{ scale: 1, opacity: 0.9, rotate: -8 }}
            transition={{ delay: 1.1, type: "spring", stiffness: 300, damping: 14 }}
          >
            Guilty
          </motion.div>

          <dl className="divide-y divide-white/8">
            {ROWS.map((row) => (
              <motion.div
                key={row.label}
                variants={itemVariants}
                className="grid grid-cols-[auto_1fr] items-start gap-x-3 py-3.5 sm:grid-cols-[7.5rem_1fr] sm:gap-x-4"
              >
                <dt className="text-muted flex items-center gap-2 text-sm font-semibold">
                  <span aria-hidden>{row.emoji}</span>
                  {row.label}
                </dt>
                <dd className="text-fg text-base leading-relaxed sm:text-lg">
                  {row.value}
                </dd>
              </motion.div>
            ))}
          </dl>
        </motion.div>

        <motion.div variants={itemVariants} className="mt-8 flex justify-center">
          <motion.button
            type="button"
            onClick={onNext}
            className="btn btn-ghost"
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
          >
            Okay… continue →
          </motion.button>
        </motion.div>
      </motion.div>
    </Screen>
  );
}
