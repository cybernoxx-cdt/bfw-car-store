"use client";

import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { SplitText } from "gsap/SplitText";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger, SplitText);
}

export const EASE = "cubic-bezier(0.16, 1, 0.3, 1)";
export const EASE_GSAP = "power3.out";

export const prefersReducedMotion = () =>
  typeof window !== "undefined" &&
  window.matchMedia("(prefers-reduced-motion: reduce)").matches;

/** Fades an element in while lifting it up slightly. The default building
 * block for most of the site's reveal animations. */
export function fadeUp(
  target: gsap.TweenTarget,
  vars: gsap.TweenVars = {}
) {
  const reduced = prefersReducedMotion();
  return gsap.fromTo(
    target,
    { y: reduced ? 0 : 24, opacity: 0 },
    { y: 0, opacity: 1, duration: reduced ? 0.25 : 0.9, ease: EASE_GSAP, ...vars }
  );
}

export function fadeIn(target: gsap.TweenTarget, vars: gsap.TweenVars = {}) {
  const reduced = prefersReducedMotion();
  return gsap.fromTo(
    target,
    { opacity: 0 },
    { opacity: 1, duration: reduced ? 0.25 : 0.8, ease: EASE_GSAP, ...vars }
  );
}

export function scaleReveal(target: gsap.TweenTarget, vars: gsap.TweenVars = {}) {
  const reduced = prefersReducedMotion();
  return gsap.fromTo(
    target,
    { scale: reduced ? 1 : 1.08, opacity: 0 },
    { scale: 1, opacity: 1, duration: reduced ? 0.3 : 1.4, ease: EASE_GSAP, ...vars }
  );
}

export function imageReveal(target: gsap.TweenTarget, vars: gsap.TweenVars = {}) {
  const reduced = prefersReducedMotion();
  return gsap.fromTo(
    target,
    { scale: reduced ? 1 : 1.08, opacity: 0, x: reduced ? 0 : 24, y: reduced ? 0 : 12 },
    { scale: 1, opacity: 1, x: 0, y: 0, duration: reduced ? 0.3 : 1.3, ease: EASE_GSAP, ...vars }
  );
}

/** Splits a heading into words and reveals them upward with a stagger.
 * Uses the (now fully free) GSAP SplitText plugin, with an automatic
 * fallback if the DOM node isn't ready. Returns the SplitText instance so
 * callers can `.revert()` it on cleanup. */
export function textReveal(target: string | Element, vars: gsap.TweenVars = {}) {
  const reduced = prefersReducedMotion();
  const el = typeof target === "string" ? document.querySelector(target) : target;
  if (!el) return null;

  const split = new SplitText(el, { type: "words,lines", linesClass: "overflow-hidden" });

  gsap.fromTo(
    split.words,
    { y: reduced ? 0 : "110%", opacity: reduced ? 1 : 0 },
    {
      y: "0%",
      opacity: 1,
      duration: reduced ? 0.2 : 0.9,
      ease: EASE_GSAP,
      stagger: reduced ? 0 : 0.045,
      ...vars,
    }
  );

  return split;
}

export function staggerReveal(
  targets: gsap.TweenTarget,
  vars: gsap.TweenVars = {},
  stagger = 0.08
) {
  const reduced = prefersReducedMotion();
  return gsap.fromTo(
    targets,
    { y: reduced ? 0 : 20, opacity: 0 },
    {
      y: 0,
      opacity: 1,
      duration: reduced ? 0.25 : 0.7,
      ease: EASE_GSAP,
      stagger: reduced ? 0 : stagger,
      ...vars,
    }
  );
}

export function parallax(target: gsap.TweenTarget, trigger: Element, amount = 80) {
  if (prefersReducedMotion()) return null;
  return gsap.to(target, {
    y: amount,
    ease: "none",
    scrollTrigger: {
      trigger,
      start: "top bottom",
      end: "bottom top",
      scrub: true,
    },
  });
}

export function modalOpen(overlay: gsap.TweenTarget, panel: gsap.TweenTarget) {
  const reduced = prefersReducedMotion();
  const tl = gsap.timeline();
  tl.fromTo(overlay, { opacity: 0 }, { opacity: 1, duration: reduced ? 0.15 : 0.3, ease: "power1.out" });
  tl.fromTo(
    panel,
    { opacity: 0, y: reduced ? 0 : 24, scale: reduced ? 1 : 0.97 },
    { opacity: 1, y: 0, scale: 1, duration: reduced ? 0.2 : 0.45, ease: "power3.out" },
    reduced ? "<" : "<0.05"
  );
  return tl;
}

export function modalClose(overlay: gsap.TweenTarget, panel: gsap.TweenTarget, onComplete?: () => void) {
  const reduced = prefersReducedMotion();
  const tl = gsap.timeline({ onComplete });
  tl.to(panel, { opacity: 0, y: reduced ? 0 : 16, scale: reduced ? 1 : 0.98, duration: reduced ? 0.15 : 0.3, ease: "power2.in" });
  tl.to(overlay, { opacity: 0, duration: reduced ? 0.1 : 0.2, ease: "power1.in" }, "<");
  return tl;
}

/** Crossfades/moves the outgoing and incoming hero visuals + copy. Used by
 * HeroSlider on every Swiper slide change. Both `outgoing` and `incoming`
 * are optional so the very first slide can skip the exit half. */
export function slideTransition({
  outgoingImage,
  incomingImage,
  incomingLabel,
  incomingTitle,
  incomingDescription,
  incomingActions,
}: {
  outgoingImage?: Element | null;
  incomingImage?: Element | null;
  incomingLabel?: Element | null;
  incomingTitle?: Element | null;
  incomingDescription?: Element | null;
  incomingActions?: Element | null;
}) {
  const reduced = prefersReducedMotion();
  const tl = gsap.timeline({ defaults: { ease: EASE_GSAP } });

  if (outgoingImage) {
    tl.to(outgoingImage, {
      scale: reduced ? 1 : 1.05,
      x: reduced ? 0 : -30,
      opacity: 0,
      duration: reduced ? 0.2 : 0.7,
    }, 0);
  }

  if (incomingImage) {
    tl.fromTo(
      incomingImage,
      { scale: reduced ? 1 : 1.08, opacity: 0, x: reduced ? 0 : 40, y: reduced ? 0 : 16 },
      { scale: 1, opacity: 1, x: 0, y: 0, duration: reduced ? 0.25 : 1.1 },
      reduced ? 0 : 0.15
    );
  }

  if (incomingLabel) {
    tl.fromTo(incomingLabel, { y: reduced ? 0 : 16, opacity: 0 }, { y: 0, opacity: 1, duration: reduced ? 0.2 : 0.5 }, reduced ? 0 : 0.3);
  }

  if (incomingTitle) {
    const split = new SplitText(incomingTitle, { type: "words" });
    tl.fromTo(
      split.words,
      { y: reduced ? 0 : "100%", opacity: reduced ? 1 : 0 },
      { y: "0%", opacity: 1, duration: reduced ? 0.2 : 0.8, stagger: reduced ? 0 : 0.05 },
      reduced ? 0 : 0.38
    );
  }

  if (incomingDescription) {
    tl.fromTo(incomingDescription, { y: reduced ? 0 : 14, opacity: 0 }, { y: 0, opacity: 1, duration: reduced ? 0.2 : 0.6 }, reduced ? 0 : 0.55);
  }

  if (incomingActions) {
    tl.fromTo(incomingActions, { y: reduced ? 0 : 14, opacity: 0 }, { y: 0, opacity: 1, duration: reduced ? 0.2 : 0.6 }, reduced ? 0 : 0.65);
  }

  return tl;
}

export { gsap, ScrollTrigger, SplitText };
