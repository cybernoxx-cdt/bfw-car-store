"use client";

import Image from "next/image";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import type { HeroSlide as HeroSlideType } from "@/types";
import { cldResponsive } from "@/lib/cloudinary";

export interface HeroSlideRefs {
  image: HTMLDivElement | null;
  label: HTMLParagraphElement | null;
  title: HTMLHeadingElement | null;
  description: HTMLParagraphElement | null;
  actions: HTMLDivElement | null;
}

export type HeroSlideRefKey = keyof HeroSlideRefs;

interface HeroSlideProps {
  slide: HeroSlideType;
  index: number;
  total: number;
  registerRef: (index: number, key: HeroSlideRefKey, el: HTMLElement | null) => void;
}

// Renders one hero slide's markup. Each animated element (image wrapper,
// label, title, description, actions) registers its own DOM node with the
// parent HeroSlider via `registerRef`, so the shared GSAP timeline in
// lib/animations.ts can target the currently active slide's pieces
// independently on every Swiper slide change.
export function HeroSlideContent({ slide, index, total, registerRef }: HeroSlideProps) {
  return (
    <div className="relative flex h-[100svh] w-full items-center overflow-hidden bg-ink-900">
      {/* Atmosphere layer */}
      <div className="absolute inset-0">
        {slide.backgroundVideo ? (
          <video
            className="h-full w-full object-cover opacity-50"
            src={slide.backgroundVideo}
            autoPlay
            muted
            loop
            playsInline
          />
        ) : slide.backgroundImage ? (
          <Image
            src={cldResponsive(slide.backgroundImage, 1920)}
            alt=""
            fill
            priority={index === 0}
            className="object-cover opacity-40"
          />
        ) : null}
        <div className="absolute inset-0 bg-gradient-to-t from-ink-900 via-ink-900/70 to-ink-900/20" />
        <div className="absolute inset-0 bg-gradient-to-r from-ink-900/90 via-ink-900/20 to-transparent" />
      </div>

      {/* Car image */}
      <div
        ref={(el) => registerRef(index, "image", el)}
        className="absolute inset-x-0 bottom-0 flex justify-center opacity-0 sm:justify-end sm:pr-6 lg:pr-16"
      >
        {slide.carImage && (
          <Image
            src={cldResponsive(slide.carImage, 1400)}
            alt={slide.title}
            width={1100}
            height={620}
            priority={index === 0}
            className="h-auto w-[min(92vw,1100px)] object-contain drop-shadow-[0_40px_60px_rgba(0,0,0,0.55)]"
          />
        )}
      </div>

      {/* Copy */}
      <div className="relative z-10 mx-auto w-full max-w-7xl px-6">
        <div className="max-w-xl pb-24 pt-24 sm:pb-32">
          <p
            ref={(el) => registerRef(index, "label", el)}
            className="mb-4 text-xs font-semibold uppercase tracking-widest2 text-ignition opacity-0"
          >
            {slide.label}
          </p>
          <h1
            ref={(el) => registerRef(index, "title", el)}
            className="font-display text-5xl font-bold uppercase leading-[0.92] tracking-tight text-bone sm:text-6xl md:text-7xl"
          >
            {slide.title}
            <br />
            <span className="text-ignition">{slide.subtitle}</span>
          </h1>
          <p
            ref={(el) => registerRef(index, "description", el)}
            className="mt-6 max-w-md text-base leading-relaxed text-bone-dim opacity-0"
          >
            {slide.description}
          </p>
          <div
            ref={(el) => registerRef(index, "actions", el)}
            className="mt-9 flex flex-wrap items-center gap-4 opacity-0"
          >
            {slide.ctaText && (
              <Link
                href={slide.ctaLink || "/cars"}
                className="group inline-flex items-center gap-2 rounded-full bg-ignition px-7 py-3.5 text-xs font-semibold uppercase tracking-widest2 text-ink-900 transition-colors hover:bg-ignition-soft"
              >
                {slide.ctaText}
                <ArrowRight size={15} className="transition-transform group-hover:translate-x-1" />
              </Link>
            )}
            {slide.secondaryCtaText && (
              <Link
                href={slide.secondaryCtaLink || "/cars"}
                className="inline-flex items-center gap-2 rounded-full border border-white/25 px-7 py-3.5 text-xs font-semibold uppercase tracking-widest2 text-bone transition-colors hover:border-ignition hover:text-ignition"
              >
                {slide.secondaryCtaText}
              </Link>
            )}
          </div>
        </div>
      </div>

      <div className="absolute bottom-8 right-6 z-10 hidden font-display text-sm text-bone-dim sm:block">
        <span className="text-bone">{String(index + 1).padStart(2, "0")}</span> / {String(total).padStart(2, "0")}
      </div>
    </div>
  );
}
