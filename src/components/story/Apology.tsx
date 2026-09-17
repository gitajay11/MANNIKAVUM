"use client";

import { motion } from "framer-motion";
import Screen from "./Screen";

const PARAGRAPHS: string[] = [
  "Abi, I know you're angry with me. And I understand why.",
  "I made a mistake. I could give you excuses, explain myself, or try to justify what happened — but none of that changes the fact that I hurt you.",
  "I'm genuinely sorry.",
  "You didn't deserve to be put in that situation, and I regret what I did.",
  "I'm not making this to force you to forgive me. I'm not asking you to change how you feel about me. I'm not asking for another chance.",
  "I just wanted to take responsibility for what I did and tell you properly, without hiding behind a text message:",
  "I'm sorry.",
];

const EMPHASIS = new Set([2, 6]);

export default function Apology({ onNext }: { onNext: () => void }) {
  // Reveal one paragraph at a time; the button appears after the last one.
  const stepDelay = 0.9;
  const totalDelay = 0.4 + PARAGRAPHS.length * stepDelay;

  return (
    <Screen className="min-h-dvh justify-center">
      <div className="w-full">
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8 }}
          className="text-muted mb-2 text-center text-xs tracking-[0.3em] uppercase"
        >
          Jokes apart…
        </motion.p>
        <motion.h2
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.1 }}
          className="font-display mb-8 text-center text-3xl font-semibold sm:text-4xl"
        >
          What I actually want to say
        </motion.h2>

        <div className="glass rounded-3xl p-6 sm:p-9">
          <div className="space-y-5">
            {PARAGRAPHS.map((text, i) => (
              <motion.p
                key={i}
                initial={{ opacity: 0, y: 10, filter: "blur(4px)" }}
                animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
                transition={{
                  duration: 0.7,
                  delay: 0.4 + i * stepDelay,
                  ease: [0.22, 1, 0.36, 1],
                }}
                className={
                  EMPHASIS.has(i)
                    ? "font-display text-2xl leading-snug font-semibold sm:text-3xl"
                    : "text-fg/90 text-base leading-relaxed sm:text-lg"
                }
              >
                {text}
              </motion.p>
            ))}
          </div>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: totalDelay, duration: 0.6 }}
          className="mt-8 flex justify-center"
        >
          <motion.button
            type="button"
            onClick={onNext}
            className="btn btn-ghost"
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
          >
            Continue →
          </motion.button>
        </motion.div>
      </div>
    </Screen>
  );
}
