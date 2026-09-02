"use client";

import { useEffect, useRef, useState } from "react";
import { usePathname } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";

/**
 * On every route change:
 * 1. Overlay fades in while the logo "pixelates in" (blur/steps down resolution).
 * 2. Once fully covered, new page content is already mounted underneath.
 * 3. Overlay reverses (logo "pixelates out") revealing the new page.
 *
 * Replace /public/logo.png with the real logo (ideally a simple, high-contrast mark).
 */
export default function PageTransition({
  children,
  logoSrc = "/logo.svg",
}: {
  children: React.ReactNode;
  logoSrc?: string;
}) {
  const pathname = usePathname();
  const [phase, setPhase] = useState<"idle" | "covering" | "revealing">("idle");
  const prevPath = useRef(pathname);

  useEffect(() => {
    if (prevPath.current !== pathname) {
      prevPath.current = pathname;
      setPhase("covering");
      const t1 = setTimeout(() => setPhase("revealing"), 550);
      const t2 = setTimeout(() => setPhase("idle"), 1050);
      return () => {
        clearTimeout(t1);
        clearTimeout(t2);
      };
    }
  }, [pathname]);

  return (
    <>
      {children}
      <AnimatePresence>
        {phase !== "idle" && (
          <motion.div
            key="transition-overlay"
            className="fixed inset-0 z-[9999] flex items-center justify-center bg-black"
            initial={{ opacity: phase === "covering" ? 0 : 1 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.45, ease: "easeInOut" }}
          >
            <motion.div
              className="relative"
              initial={{
                scale: phase === "covering" ? 3 : 1,
                filter: phase === "covering" ? "blur(0px)" : "blur(0px)",
              }}
              animate={{
                scale: phase === "covering" ? [3, 1] : [1, 3],
                filter:
                  phase === "covering"
                    ? ["blur(0px)", "blur(0px)"]
                    : ["blur(0px)", "blur(0px)"],
              }}
              transition={{ duration: 0.5, ease: [0.76, 0, 0.24, 1] }}
            >
              <PixelLogo animate={phase === "covering" ? "in" : "out"} logoSrc={logoSrc} />
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}

/**
 * Renders /public/logo.png onto a tiny canvas (very low resolution) then scales
 * it up with pixelated image-rendering, and animates the pixel resolution
 * from coarse -> fine (in) or fine -> coarse (out) for a "pixelating" feel.
 */
function PixelLogo({ animate, logoSrc }: { animate: "in" | "out"; logoSrc: string }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [step, setStep] = useState(animate === "in" ? 4 : 48);

  useEffect(() => {
    const sequenceIn = [4, 8, 16, 32, 48];
    const sequenceOut = [48, 32, 16, 8, 4];
    const seq = animate === "in" ? sequenceIn : sequenceOut;
    let i = 0;
    const id = setInterval(() => {
      i++;
      if (i < seq.length) setStep(seq[i]);
      else clearInterval(id);
    }, 90);
    return () => clearInterval(id);
  }, [animate]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    const img = new Image();
    img.crossOrigin = "anonymous";
    img.src = logoSrc;
    img.onload = () => {
      const size = step;
      canvas.width = size;
      canvas.height = size;
      ctx.clearRect(0, 0, size, size);
      ctx.drawImage(img, 0, 0, size, size);
    };
    if (img.complete) img.onload(null as any);
  }, [step, logoSrc]);

  return (
    <canvas
      ref={canvasRef}
      className="pixelated w-40 h-40 md:w-56 md:h-56"
      style={{ imageRendering: "pixelated" }}
    />
  );
}
