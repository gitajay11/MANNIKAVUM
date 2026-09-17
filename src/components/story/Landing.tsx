"use client";

import { motion } from "framer-motion";
import { useState } from "react";
import Screen, { itemVariants, listVariants } from "./Screen";

export default function Landing({ onNext }: { onNext: () => void }) {
  const [leaving, setLeaving] = useState(false);

  const go = () => {
    if (leaving) return;
    setLeaving(true);
    // Let the button's "gulp" animation play before moving on.
    setTimeout(onNext, 650);
  };

  return (
    <Screen className="min-h-dvh justify-center text-center">
      <motion.div
        variants={listVariants}
        initial="initial"
        animate="animate"
        className="flex flex-col items-center gap-6"
      >
        <motion.div
          variants={itemVariants}
          className="text-6xl sm:text-7xl"
          aria-hidden
        >
          <motion.span
            className="inline-block"
            animate={{ rotate: [0, -6, 6, -4, 0] }}
            transition={{ duration: 2.4, repeat: Infinity, repeatDelay: 2 }}
          >
            😶
          </motion.span>
        </motion.div>

        <motion.h1
          variants={itemVariants}
          className="font-display glow-text text-4xl leading-tight font-semibold sm:text-6xl"
        >
          Okay… I messed up.
        </motion.h1>

        <motion.p
          variants={itemVariants}
          className="text-muted max-w-md text-base sm:text-lg"
        >
          And apparently saying &ldquo;sorry&rdquo; over WhatsApp wasn&rsquo;t
          enough.
        </motion.p>

        <motion.div variants={itemVariants} className="mt-4">
          <motion.button
            type="button"
            onClick={go}
            disabled={leaving}
            className="btn btn-primary text-base sm:text-lg"
            whileHover={{ scale: 1.04 }}
            whileTap={{ scale: 0.96 }}
            animate={
              leaving
                ? { scale: [1, 1.08, 0.9, 1.15, 0], rotate: [0, -3, 3, 0, 0] }
                : { scale: 1 }
            }
            transition={leaving ? { duration: 0.65, ease: "easeInOut" } : {}}
          >
            KINDLY, This way Ma&rsquo;am🍂 →
          </motion.button>
        </motion.div>

        <motion.p
          variants={itemVariants}
          className="text-muted/70 mt-8 text-xs"
        >
          No sign-ups, no tracking. Just an apology.
        </motion.p>
      </motion.div>
    </Screen>
  );
}
