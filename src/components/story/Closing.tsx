"use client";

import { AnimatePresence, motion } from "framer-motion";
import { useEffect, useState } from "react";
import Screen from "./Screen";

const VERSE = [
  "நல்லாய்! பொய் எல்லாம் ஏற்றித் தவறு தலைப்பெய்து,",
  "கையொடு கண்டாய்; பிழைத்தேன்; அருள் இனி.",
];

type Phase = "verse" | "zoom" | "end";

export default function Closing() {
  const [phase, setPhase] = useState<Phase>("verse");

  // After the zoom finishes, settle into a calm "you can close this" state.
  useEffect(() => {
    if (phase !== "zoom") return;
    const t = setTimeout(() => setPhase("end"), 5200);
    return () => clearTimeout(t);
  }, [phase]);

  return (
    <>
      <AnimatePresence mode="wait">
        {phase === "verse" && (
          <Screen key="verse" className="min-h-dvh justify-center text-center">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 1 }}
              className="w-full"
            >
              <div className="glass rounded-3xl p-7 sm:p-10">
                <p className="font-tamil text-fg text-xl leading-loose font-semibold sm:text-2xl">
                  {VERSE.map((line, i) => (
                    <motion.span
                      key={i}
                      initial={{ opacity: 0, y: 8 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.5 + i * 0.9, duration: 0.8 }}
                      className="block"
                    >
                      {line}
                    </motion.span>
                  ))}
                </p>
              </div>

              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 2.8, duration: 0.6 }}
                className="mt-10 flex justify-center"
              >
                <motion.button
                  type="button"
                  onClick={() => setPhase("zoom")}
                  className="btn btn-ghost"
                  whileHover={{ scale: 1.03 }}
                  whileTap={{ scale: 0.97 }}
                >
                  Close 🌙
                </motion.button>
              </motion.div>
            </motion.div>
          </Screen>
        )}

        {phase === "zoom" && (
          <motion.section
            key="zoom"
            className="fixed inset-0 flex items-center justify-center overflow-hidden px-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0, transition: { duration: 0.8 } }}
          >
            <motion.div
              className="text-center"
              initial={{ scale: 0.2, opacity: 0, filter: "blur(10px)" }}
              animate={{
                scale: [0.2, 0.9, 1, 1.6, 6],
                opacity: [0, 1, 1, 1, 0],
                filter: ["blur(10px)", "blur(0px)", "blur(0px)", "blur(0px)", "blur(8px)"],
              }}
              transition={{
                duration: 5,
                times: [0, 0.3, 0.55, 0.8, 1],
                ease: ["easeOut", "easeInOut", "easeIn", "easeIn"],
              }}
            >
              <span
                className="font-display block text-4xl font-bold tracking-tight text-nowrap sm:text-6xl md:text-7xl"
                style={{
                  color: "var(--mint)",
                  textShadow:
                    "0 0 30px rgba(142,240,192,0.6), 0 0 80px rgba(142,240,192,0.35)",
                }}
              >
                SORRY 3000 TIMES
              </span>
              <span
                className="font-display mt-2 block text-5xl font-bold tracking-tight sm:text-7xl md:text-8xl"
                style={{
                  color: "var(--mint)",
                  textShadow:
                    "0 0 30px rgba(142,240,192,0.6), 0 0 80px rgba(142,240,192,0.35)",
                }}
              >
                ABI💚
              </span>
            </motion.div>
          </motion.section>
        )}

        {phase === "end" && (
          <Screen key="end" className="min-h-dvh justify-center text-center">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 1.2 }}
            >
              <p className="text-4xl" aria-hidden>
                💚
              </p>
              <p className="font-display mt-4 text-2xl font-semibold sm:text-3xl">
                That&rsquo;s all.
              </p>
              <p className="text-muted mt-2 text-sm">
                You can close this tab now. Take care, Abi. 🌙
              </p>
            </motion.div>
          </Screen>
        )}
      </AnimatePresence>
    </>
  );
}
