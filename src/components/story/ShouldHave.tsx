"use client";

import { AnimatePresence, motion } from "framer-motion";
import { useState } from "react";
import Screen, { itemVariants, listVariants } from "./Screen";

const CARDS: { title: string; detail: string; emoji: string }[] = [
  {
    emoji: "🧠",
    title: "I should have thought before I acted.",
    detail:
      "I let the moment decide for me instead of stopping for even a second to think about how it would land on you. That second was mine to take, and I didn't.",
  },
  {
    emoji: "💚",
    title: "I should have understood your words.",
    detail:
      "Your words were never something to work around. I should have paid attention to what you were actually telling me — in words and otherwise — instead of what I wanted to hear.",
  },
  {
    emoji: "🤝",
    title: "I should have respected the situation better.",
    detail:
      "You'd been clear about where things stood. Respecting that meant acting like it, not just saying I did. I fell short of that, and it's on me.",
  },
  {
    emoji: "🔁",
    title: "I should have handled things differently.",
    detail:
      "There were better ways to do all of this — calmer, kinder, more honest. I picked the wrong one. I can't undo it, but I can own it, and I do.",
  },
];

export default function ShouldHave({ onNext }: { onNext: () => void }) {
  const [open, setOpen] = useState<Set<number>>(new Set());
  const allOpened = open.size === CARDS.length;

  const toggle = (i: number) =>
    setOpen((prev) => {
      const next = new Set(prev);
      if (next.has(i)) next.delete(i);
      else next.add(i);
      return next;
    });

  return (
    <Screen className="min-h-dvh justify-center">
      <motion.div
        variants={listVariants}
        initial="initial"
        animate="animate"
        className="w-full"
      >
        <motion.div variants={itemVariants} className="mb-6 text-center">
          <h2 className="font-display text-3xl font-semibold sm:text-4xl">
            Things I should have done
          </h2>
          <p className="text-muted mt-2 text-sm">
            Tap a card. No quiz at the end, promise.
          </p>
        </motion.div>

        <div className="grid gap-3 sm:gap-4">
          {CARDS.map((card, i) => {
            const isOpen = open.has(i);
            return (
              <motion.button
                key={card.title}
                type="button"
                variants={itemVariants}
                onClick={() => toggle(i)}
                aria-expanded={isOpen}
                whileTap={{ scale: 0.985 }}
                className={`glass w-full rounded-2xl p-5 text-left transition-colors ${
                  isOpen ? "bg-white/8" : "hover:bg-white/7"
                }`}
              >
                <div className="flex items-start gap-3">
                  <span className="text-2xl leading-none" aria-hidden>
                    {card.emoji}
                  </span>
                  <div className="flex-1">
                    <p className="text-base font-semibold sm:text-lg">
                      {card.title}
                    </p>
                    <AnimatePresence initial={false}>
                      {isOpen && (
                        <motion.p
                          key="detail"
                          initial={{ height: 0, opacity: 0, marginTop: 0 }}
                          animate={{ height: "auto", opacity: 1, marginTop: 10 }}
                          exit={{ height: 0, opacity: 0, marginTop: 0 }}
                          transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
                          className="text-muted overflow-hidden text-sm leading-relaxed sm:text-base"
                        >
                          {card.detail}
                        </motion.p>
                      )}
                    </AnimatePresence>
                  </div>
                  <motion.span
                    aria-hidden
                    className="text-muted mt-1 text-sm"
                    animate={{ rotate: isOpen ? 180 : 0 }}
                  >
                    ▾
                  </motion.span>
                </div>
              </motion.button>
            );
          })}
        </div>

        <motion.div
          variants={itemVariants}
          className="mt-8 flex flex-col items-center gap-2"
        >
          <motion.button
            type="button"
            onClick={onNext}
            className="btn btn-ghost"
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
          >
            {allOpened ? "Okay, I've said it all →" : "Continue →"}
          </motion.button>
        </motion.div>
      </motion.div>
    </Screen>
  );
}
