"use client";

import { motion, type Variants } from "framer-motion";
import type { ReactNode } from "react";

export const screenVariants: Variants = {
  initial: { opacity: 0, y: 24, filter: "blur(6px)" },
  animate: {
    opacity: 1,
    y: 0,
    filter: "blur(0px)",
    transition: { duration: 0.55, ease: [0.22, 1, 0.36, 1] },
  },
  exit: {
    opacity: 0,
    y: -18,
    filter: "blur(6px)",
    transition: { duration: 0.35, ease: "easeIn" },
  },
};

/** Stagger container for children using `itemVariants`. */
export const listVariants: Variants = {
  animate: { transition: { staggerChildren: 0.09, delayChildren: 0.15 } },
};

export const itemVariants: Variants = {
  initial: { opacity: 0, y: 14 },
  animate: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.45, ease: [0.22, 1, 0.36, 1] },
  },
};

export default function Screen({
  children,
  className = "",
  wide = false,
  flush = false,
}: {
  children: ReactNode;
  className?: string;
  wide?: boolean;
  /** Minimal side padding on phones — for content that must not wrap. */
  flush?: boolean;
}) {
  return (
    <motion.section
      variants={screenVariants}
      initial="initial"
      animate="animate"
      exit="exit"
      className={`mx-auto flex w-full ${wide ? "max-w-3xl" : "max-w-xl"} flex-col items-center ${flush ? "px-2" : "px-5"} py-10 sm:px-8 ${className}`}
    >
      {children}
    </motion.section>
  );
}
