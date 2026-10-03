"use client";

import { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import { prefersReducedMotion } from "@/lib/animations";

export function Preloader({ onDone }: { onDone?: () => void }) {
  const [percent, setPercent] = useState(0);
  const [visible, setVisible] = useState(true);
  const rootRef = useRef<HTMLDivElement>(null);
  const logoRef = useRef<HTMLDivElement>(null);
  const barRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const reduced = prefersReducedMotion();

    if (reduced) {
      setPercent(100);
      const t = setTimeout(() => {
        setVisible(false);
        onDone?.();
      }, 200);
      return () => clearTimeout(t);
    }

    const counter = { value: 0 };
    const tl = gsap.timeline({
      onComplete: () => {
        gsap
          .timeline({
            onComplete: () => {
              setVisible(false);
              onDone?.();
            },
          })
          .to(barRef.current, { opacity: 0, duration: 0.3 })
          .to(logoRef.current, { y: -16, opacity: 0, duration: 0.5, ease: "power2.in" }, "<")
          .to(rootRef.current, { yPercent: -100, duration: 0.7, ease: "power3.inOut" }, "-=0.2");
      },
    });

    tl.to(counter, {
      value: 100,
      duration: 1.6,
      ease: "power2.inOut",
      onUpdate: () => setPercent(Math.floor(counter.value)),
    });

    if (barRef.current) {
      tl.fromTo(
        barRef.current,
        { scaleX: 0 },
        { scaleX: 1, duration: 1.6, ease: "power2.inOut" },
        "<"
      );
    }

    return () => {
      tl.kill();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  if (!visible) return null;

  return (
    <div
      ref={rootRef}
      className="fixed inset-0 z-[300] flex flex-col items-center justify-center bg-ink-900"
      aria-hidden="true"
    >
      <div
        ref={logoRef}
        className="mb-10 font-display text-2xl font-bold uppercase tracking-widest2 text-bone"
      >
        Showroom<span className="text-ignition">.</span>
      </div>
      <div className="w-56 sm:w-72">
        <div className="h-px w-full origin-left bg-white/10">
          <div ref={barRef} className="h-px w-full origin-left bg-ignition" style={{ transform: "scaleX(0)" }} />
        </div>
        <div className="mt-4 flex items-baseline justify-between text-xs uppercase tracking-widest2 text-bone-dim">
          <span>Loading</span>
          <span className="font-display text-sm text-bone">{percent}%</span>
        </div>
      </div>
    </div>
  );
}
