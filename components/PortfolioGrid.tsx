"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { AnimatePresence, motion } from "framer-motion";
import { getDir } from "@/lib/text-direction";

export type PortfolioItem = {
  id: string;
  slug: string;
  title: string;
  summary: string;
  actionLabel: string;
  coverImage: string;
  orientation: string;
};

export default function PortfolioGrid({ items }: { items: PortfolioItem[] }) {
  const [active, setActive] = useState<PortfolioItem | null>(null);

  // On touch devices (no real hover), cycle a "reveal" effect through the
  // grid automatically so images don't stay black & white forever — since
  // there's no cursor to trigger the hover state. Devices that DO support
  // hover (desktop/mouse) are left untouched; hover alone drives the effect.
  const [autoIndex, setAutoIndex] = useState(-1);
  useEffect(() => {
    if (items.length === 0) return;
    const supportsHover = window.matchMedia("(hover: hover)").matches;
    if (supportsHover) return;
    const id = setInterval(() => {
      setAutoIndex((i) => (i + 1) % items.length);
    }, 2600);
    return () => clearInterval(id);
  }, [items.length]);

  return (
    <>
      <div className="columns-1 sm:columns-2 lg:columns-3 gap-4 space-y-4">
        {items.map((item, i) => {
          const isAuto = i === autoIndex;
          return (
            <button
              key={item.id}
              onClick={() => setActive(item)}
              className="block w-full break-inside-avoid mb-4 relative overflow-hidden rounded-2xl group"
            >
              {/* No forced aspect ratio — image keeps its natural size, nothing gets cropped */}
              <img
                src={item.coverImage}
                alt={item.title}
                className={`w-full h-auto block transition-all duration-700 group-hover:grayscale-0 group-hover:scale-105 ${
                  isAuto ? "grayscale-0 scale-105" : "grayscale"
                }`}
              />
              {/* Permanent dark overlay so the centered title stays readable at all times */}
              <div
                className={`absolute inset-0 bg-black/40 transition-opacity duration-300 group-hover:opacity-0 ${
                  isAuto ? "opacity-0" : "opacity-100"
                }`}
              />
              {/* Title — centered, large, always visible; hides only while the color-reveal effect is active */}
              <span
                dir={getDir(item.title)}
                className={`absolute inset-0 flex items-center justify-center text-center px-6 text-white text-xl md:text-2xl font-bold drop-shadow-lg transition-opacity duration-300 group-hover:opacity-0 ${
                  isAuto ? "opacity-0" : "opacity-100"
                }`}
              >
                {item.title}
              </span>
            </button>
          );
        })}
      </div>

      <AnimatePresence>
        {active && (
          <motion.div
            className="fixed inset-0 z-[200] flex items-center justify-center bg-black/80 backdrop-blur-sm p-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setActive(null)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              transition={{ duration: 0.3, ease: [0.76, 0, 0.24, 1] }}
              onClick={(e) => e.stopPropagation()}
              className="bg-neutral-950 border border-white/10 rounded-2xl max-w-lg w-full overflow-hidden"
            >
              <img src={active.coverImage} alt={active.title} className="w-full max-h-72 object-cover" />
              <div className="p-6 flex flex-col gap-4">
                <h3 dir={getDir(active.title)} className="text-2xl font-bold">
                  {active.title}
                </h3>
                <p dir={getDir(active.summary)} className="text-white/70 leading-7 whitespace-pre-line">
                  {active.summary}
                </p>
                <Link
                  href={`/portfolio/${active.slug}`}
                  className="self-start px-5 py-2.5 rounded-full bg-white text-black font-medium hover:opacity-80 transition-opacity"
                >
                  {active.actionLabel}
                </Link>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
