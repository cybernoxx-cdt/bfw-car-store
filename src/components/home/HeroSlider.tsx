"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Keyboard, A11y, EffectFade } from "swiper/modules";
import type { Swiper as SwiperType } from "swiper";
import Link from "next/link";
import { ChevronLeft, ChevronRight } from "lucide-react";
import "swiper/css";
import "swiper/css/effect-fade";

import { HeroSlideContent, type HeroSlideRefs, type HeroSlideRefKey } from "./HeroSlide";
import { HERO_SLIDES } from "@/data/heroSlides";
import { slideTransition, prefersReducedMotion } from "@/lib/animations";

const AUTOPLAY_MS = 6500;

// Hero slides are static (see src/data/heroSlides.ts) — no admin panel or
// Firestore fetch involved. Only active slides are shown, in `order`.
const SLIDES = HERO_SLIDES.filter((s) => s.active).sort((a, b) => a.order - b.order);

export function HeroSlider() {
  const [activeIndex, setActiveIndex] = useState(0);
  const [paused, setPaused] = useState(false);

  const swiperRef = useRef<SwiperType | null>(null);
  const refsMap = useRef<Record<number, HeroSlideRefs>>({});
  const hasAnimatedFirst = useRef(false);
  const slides = SLIDES;

  const registerRef = useCallback((index: number, key: HeroSlideRefKey, el: HTMLElement | null) => {
    const existing = refsMap.current[index] ?? {
      image: null,
      label: null,
      title: null,
      description: null,
      actions: null,
    };
    refsMap.current[index] = { ...existing, [key]: el };
  }, []);

  // Play the very first slide's entrance the moment its refs exist.
  useEffect(() => {
    if (slides.length === 0 || hasAnimatedFirst.current) return;
    const first = refsMap.current[0];
    if (!first) return;
    hasAnimatedFirst.current = true;
    slideTransition({
      incomingImage: first.image,
      incomingLabel: first.label,
      incomingTitle: first.title,
      incomingDescription: first.description,
      incomingActions: first.actions,
    });
  });

  const goTo = useCallback((index: number) => {
    swiperRef.current?.slideTo(index);
  }, []);

  const goNext = useCallback(() => {
    if (slides.length === 0) return;
    goTo((activeIndex + 1) % slides.length);
  }, [activeIndex, slides, goTo]);

  const goPrev = useCallback(() => {
    if (slides.length === 0) return;
    goTo((activeIndex - 1 + slides.length) % slides.length);
  }, [activeIndex, slides, goTo]);

  // Manual autoplay (kept separate from Swiper's own Autoplay module so we
  // stay in full control of looping + the progress indicator below, and can
  // avoid Swiper's slide-cloning `loop` mode, which would otherwise fight
  // with the per-index ref map above).
  useEffect(() => {
    if (slides.length < 2 || paused) return;
    const t = setTimeout(goNext, AUTOPLAY_MS);
    return () => clearTimeout(t);
  }, [activeIndex, slides, paused, goNext]);

  const handleSlideChange = useCallback((swiper: SwiperType) => {
    const prevIndex = swiper.previousIndex;
    const nextIndex = swiper.activeIndex;
    setActiveIndex(nextIndex);

    const outgoing = refsMap.current[prevIndex];
    const incoming = refsMap.current[nextIndex];
    if (!incoming) return;

    slideTransition({
      outgoingImage: outgoing?.image,
      incomingImage: incoming.image,
      incomingLabel: incoming.label,
      incomingTitle: incoming.title,
      incomingDescription: incoming.description,
      incomingActions: incoming.actions,
    });
  }, []);

  if (slides.length === 0) {
    return (
      <div className="relative flex h-[100svh] w-full items-center justify-center bg-ink-900 px-6 text-center">
        <div>
          <p className="mb-4 text-xs font-semibold uppercase tracking-widest2 text-ignition">
            Premium Automotive
          </p>
          <h1 className="font-display text-5xl font-bold uppercase text-bone sm:text-6xl">
            Explore The Collection
          </h1>
          <Link
            href="/cars"
            className="mt-8 inline-flex items-center gap-2 rounded-full bg-ignition px-7 py-3.5 text-xs font-semibold uppercase tracking-widest2 text-ink-900"
          >
            View Cars
          </Link>
        </div>
      </div>
    );
  }

  return (
    <section
      className="relative"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
    >
      <Swiper
        modules={[Keyboard, A11y, EffectFade]}
        speed={prefersReducedMotion() ? 0 : 900}
        effect="fade"
        fadeEffect={{ crossFade: true }}
        keyboard={{ enabled: true }}
        onSwiper={(s) => (swiperRef.current = s)}
        onSlideChange={handleSlideChange}
        className="hero-swiper"
      >
        {slides.map((slide, i) => (
          <SwiperSlide key={slide.id}>
            <HeroSlideContent slide={slide} index={i} total={slides.length} registerRef={registerRef} />
          </SwiperSlide>
        ))}
      </Swiper>

      {slides.length > 1 && (
        <div className="absolute inset-x-0 bottom-8 z-20 flex items-center justify-center gap-4 sm:justify-start sm:pl-6 lg:pl-16">
          <button
            onClick={goPrev}
            aria-label="Previous slide"
            className="flex h-11 w-11 items-center justify-center rounded-full border border-white/20 bg-white/5 text-bone backdrop-blur-md transition-colors hover:border-ignition hover:text-ignition"
          >
            <ChevronLeft size={18} />
          </button>
          <button
            onClick={goNext}
            aria-label="Next slide"
            className="flex h-11 w-11 items-center justify-center rounded-full border border-white/20 bg-white/5 text-bone backdrop-blur-md transition-colors hover:border-ignition hover:text-ignition"
          >
            <ChevronRight size={18} />
          </button>

          <div className="ml-2 flex gap-1.5">
            {slides.map((s, i) => (
              <button
                key={s.id}
                onClick={() => goTo(i)}
                aria-label={`Go to slide ${i + 1}`}
                className="relative h-1 w-8 overflow-hidden rounded-full bg-white/15"
              >
                {i === activeIndex && (
                  <span
                    key={`${activeIndex}-${paused}`}
                    className="absolute inset-y-0 left-0 block bg-ignition"
                    style={{
                      animation: paused ? "none" : `heroProgress ${AUTOPLAY_MS}ms linear forwards`,
                      width: paused ? "100%" : undefined,
                    }}
                  />
                )}
                {i < activeIndex && <span className="absolute inset-0 bg-ignition" />}
              </button>
            ))}
          </div>
        </div>
      )}
    </section>
  );
}
