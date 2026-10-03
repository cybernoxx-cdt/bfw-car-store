"use client";

import { useEffect } from "react";
import Lenis from "lenis";
import gsap from "gsap";

/** Wires up Lenis smooth scrolling and syncs it to the GSAP ticker so
 * ScrollTrigger-based animations stay perfectly in step. Skips the heavy
 * inertia entirely when the visitor prefers reduced motion, leaving native
 * scrolling in place. */
export function useLenis() {
  useEffect(() => {
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduced) return;

    const lenis = new Lenis({
      duration: 1.1,
      easing: (t: number) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      smoothWheel: true,
    });

    const onTick = (time: number) => lenis.raf(time * 1000);
    gsap.ticker.add(onTick);
    gsap.ticker.lagSmoothing(0);

    return () => {
      gsap.ticker.remove(onTick);
      lenis.destroy();
    };
  }, []);
}
