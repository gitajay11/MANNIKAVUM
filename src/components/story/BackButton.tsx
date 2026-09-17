"use client";

import { motion } from "framer-motion";

/** Small fixed arrow in the top-left corner that returns to the previous section. */
export default function BackButton({ onClick }: { onClick: () => void }) {
  return (
    <motion.button
      type="button"
      onClick={onClick}
      aria-label="Go back"
      title="Back"
      initial={{ opacity: 0, x: -8 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -8 }}
      whileHover={{ scale: 1.08 }}
      whileTap={{ scale: 0.92 }}
      className="glass text-fg/80 hover:text-fg fixed top-4 left-4 z-50 flex h-10 w-10 items-center justify-center rounded-full text-lg transition-colors sm:top-6 sm:left-6"
      style={{ top: "max(1rem, env(safe-area-inset-top))" }}
    >
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden>
        <path
          d="M15 5l-7 7 7 7"
          stroke="currentColor"
          strokeWidth="2.2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    </motion.button>
  );
}
