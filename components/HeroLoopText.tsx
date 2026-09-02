"use client";

import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { getDir } from "@/lib/text-direction";

export type HeroTextItem = {
  content: string; // may contain \n for multi-line
  lang: "en" | "fa";
  fontSize?: string; // "sm" | "md" | "lg" | "xl"
  position?: string; // "{top|center|bottom}-{right|center|left}"
};

const FONT_SIZE_CLASS: Record<string, string> = {
  sm: "text-base md:text-xl",
  md: "text-xl md:text-2xl",
  lg: "text-xl md:text-3xl",
  xl: "text-3xl md:text-5xl",
};

// vertical anchor -> items-*, horizontal anchor -> justify-* (container is flex-row)
const POSITION_CLASS: Record<string, string> = {
  "top-right": "items-start justify-end text-right",
  "top-center": "items-start justify-center text-center",
  "top-left": "items-start justify-start text-left",
  "center-right": "items-center justify-end text-right",
  "center-center": "items-center justify-center text-center",
  "center-left": "items-center justify-start text-left",
  "bottom-right": "items-end justify-end text-right",
  "bottom-center": "items-end justify-center text-center",
  "bottom-left": "items-end justify-start text-left",
};

export default function HeroLoopText({
  items,
  intervalMs = 3200,
}: {
  items: HeroTextItem[];
  intervalMs?: number;
}) {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    if (items.length < 2) return;
    const id = setInterval(() => {
      setIndex((i) => (i + 1) % items.length);
    }, intervalMs);
    return () => clearInterval(id);
  }, [items.length, intervalMs]);

  if (!items.length) return null;
  const current = items[index];
  const posClass = POSITION_CLASS[current.position || "bottom-center"] || POSITION_CLASS["bottom-center"];
  const sizeClass = FONT_SIZE_CLASS[current.fontSize || "lg"] || FONT_SIZE_CLASS.lg;

  return (
    <div className={`absolute inset-0 flex px-6 md:px-16 pt-24 pb-24 md:pt-28 md:pb-24 ${posClass}`}>
      <AnimatePresence mode="wait">
        <motion.p
          key={index}
          dir={getDir(current.content) === "rtl" || current.lang === "fa" ? "rtl" : "ltr"}
          lang={current.lang}
          initial={{ opacity: 0, y: 24, filter: "blur(6px)" }}
          animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
          exit={{ opacity: 0, y: -24, filter: "blur(6px)" }}
          transition={{ duration: 0.6, ease: [0.76, 0, 0.24, 1] }}
          className={`${sizeClass} font-medium tracking-tight text-white drop-shadow-lg whitespace-pre-line max-w-2xl`}
        >
          {current.content}
        </motion.p>
      </AnimatePresence>
    </div>
  );
}
