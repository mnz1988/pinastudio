"use client";

import { useEffect, useRef, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";

const COVER_MS = 550; // time for the pixelate-in animation to finish
const REVEAL_MS = 500; // time for the pixelate-out animation to finish

export default function PageTransition({
  children,
  logoSrc = "/logo.svg",
}: {
  children: React.ReactNode;
  logoSrc?: string;
}) {
  const pathname = usePathname();
  const router = useRouter();
  const [phase, setPhase] = useState<"idle" | "covering" | "revealing">("idle");

  const prevPath = useRef(pathname);
  const navigatingRef = useRef(false); // we've started covering for a pending nav
  const coverDoneRef = useRef(false); // cover-in animation finished
  const dataReadyRef = useRef(false); // new page's pathname has arrived

  function startReveal() {
    setPhase("revealing");
    setTimeout(() => setPhase("idle"), REVEAL_MS);
  }

  function maybeReveal() {
    if (coverDoneRef.current && dataReadyRef.current) {
      navigatingRef.current = false;
      startReveal();
    }
  }

  // Intercept internal link clicks in the CAPTURE phase so this runs before
  // Next.js's own <Link> click handler does its preventDefault + router.push.
  // This lets us start the cover animation immediately, instead of only
  // after the destination page's data has already finished loading.
  useEffect(() => {
    function onClick(e: MouseEvent) {
      if (e.defaultPrevented || e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;
      const anchor = (e.target as HTMLElement)?.closest("a");
      if (!anchor) return;
      if (anchor.target && anchor.target !== "_self") return;
      if (anchor.hasAttribute("download")) return;
      const href = anchor.getAttribute("href");
      if (!href || href.startsWith("#")) return;

      let url: URL;
      try {
        url = new URL(href, window.location.href);
      } catch {
        return;
      }
      if (url.origin !== window.location.origin) return;
      if (url.pathname === pathname) return;

      e.preventDefault();
      navigatingRef.current = true;
      coverDoneRef.current = false;
      dataReadyRef.current = false;
      setPhase("covering");
      setTimeout(() => {
        coverDoneRef.current = true;
        maybeReveal();
      }, COVER_MS);
      router.push(url.pathname + url.search);
    }
    document.addEventListener("click", onClick, true);
    return () => document.removeEventListener("click", onClick, true);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pathname]);

  // Fires once the new route has actually rendered (pathname changed).
  useEffect(() => {
    if (prevPath.current === pathname) return;
    prevPath.current = pathname;

    if (navigatingRef.current) {
      // Cover animation already started on click — just mark data ready.
      dataReadyRef.current = true;
      maybeReveal();
    } else {
      // Fallback for navigations we didn't intercept (browser back/forward,
      // programmatic navigation elsewhere) — behave like before.
      setPhase("covering");
      const t1 = setTimeout(() => setPhase("revealing"), COVER_MS);
      const t2 = setTimeout(() => setPhase("idle"), COVER_MS + REVEAL_MS);
      return () => {
        clearTimeout(t1);
        clearTimeout(t2);
      };
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
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
            <motion.div className="relative">
              <PixelLogo animate={phase === "covering" ? "in" : "out"} logoSrc={logoSrc} />
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}

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