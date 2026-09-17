"use client";

import { AnimatePresence, motion, useMotionValue, useTransform, animate } from "framer-motion";
import { useEffect, useState } from "react";
import Screen from "./Screen";

const STAGES: { label: string; to: number; hold: number }[] = [
  { label: "Loading…", to: 12, hold: 1100 },
  { label: "Calculating…", to: 41, hold: 1200 },
  { label: "Still calculating…", to: 68, hold: 1200 },
  { label: "Calculator overheating… 🔥", to: 93, hold: 1300 },
  { label: "Okay. Very sorry. 😭", to: 100, hold: 900 },
];

export default function SorryMeter({ onNext }: { onNext: () => void }) {
  const [stage, setStage] = useState(0);
  const [done, setDone] = useState(false);
  const progress = useMotionValue(0);
  const width = useTransform(progress, (v) => `${v}%`);
  const shown = useTransform(progress, (v) => Math.round(v));
  const [num, setNum] = useState(0);

  useEffect(() => shown.on("change", (v) => setNum(v)), [shown]);

  useEffect(() => {
    let cancelled = false;
    let timer: ReturnType<typeof setTimeout>;

    const run = async (i: number) => {
      if (cancelled || i >= STAGES.length) {
        if (!cancelled) setDone(true);
        return;
      }
      setStage(i);
      await animate(progress, STAGES[i].to, {
        duration: 0.8,
        ease: "easeInOut",
      });
      timer = setTimeout(() => run(i + 1), STAGES[i].hold);
    };
    run(0);

    return () => {
      cancelled = true;
      clearTimeout(timer);
    };
  }, [progress]);

  const overheating = stage === 3 && !done;

  return (
    <Screen className="min-h-dvh justify-center text-center">
      <div className="w-full">
        <motion.h2
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="font-display mb-8 text-3xl font-semibold sm:text-4xl"
        >
          How sorry am I?
        </motion.h2>

        <motion.div
          className="glass rounded-3xl p-6 sm:p-8"
          animate={
            overheating
              ? { x: [0, -2, 2, -2, 2, 0], transition: { repeat: Infinity, duration: 0.3 } }
              : { x: 0 }
          }
        >
          <div className="mb-4 flex items-baseline justify-between">
            <span className="text-muted text-sm">Sorry level</span>
            <span className="font-display text-3xl font-semibold tabular-nums">
              {num}%
            </span>
          </div>

          <div
            className="relative h-4 w-full overflow-hidden rounded-full bg-white/8"
            role="progressbar"
            aria-valuemin={0}
            aria-valuemax={100}
            aria-valuenow={num}
          >
            <motion.div
              style={{ width }}
              className="absolute inset-y-0 left-0 rounded-full"
            >
              <div
                className="h-full w-full rounded-full"
                style={{
                  background:
                    "linear-gradient(90deg, var(--lavender), var(--rose), var(--peach))",
                  boxShadow: "0 0 24px rgba(255,143,177,0.6)",
                }}
              />
            </motion.div>
          </div>

          <div className="mt-5 h-7">
            <AnimatePresence mode="wait">
              <motion.p
                key={stage}
                initial={{ opacity: 0, y: 6 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -6 }}
                transition={{ duration: 0.25 }}
                className="text-fg/90 text-base sm:text-lg"
              >
                {STAGES[stage].label}
              </motion.p>
            </AnimatePresence>
          </div>

          <AnimatePresence>
            {done && (
              <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ type: "spring", stiffness: 260, damping: 16 }}
                className="mt-4"
              >
                <span className="shimmer font-display text-4xl font-bold sm:text-5xl">
                  100% Sorry
                </span>
                <p className="text-muted mt-2 text-xs">
                  (Meter maxed out. We tried adding more, it wouldn&rsquo;t fit.)
                </p>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>

        <AnimatePresence>
          {done && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
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
          )}
        </AnimatePresence>
      </div>
    </Screen>
  );
}
