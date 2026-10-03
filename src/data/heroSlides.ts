import type { HeroSlide } from "@/types";

/**
 * Static hero slides.
 *
 * These used to be managed from /admin/hero-slides (Firestore + Cloudinary).
 * That admin section has been removed — the hero images are now plain
 * files shipped with the website itself.
 *
 * To change a slide: drop your image into /public/images/hero/ and update
 * the `carImage` (and optional `backgroundImage`/`backgroundVideo`) path
 * below. No admin login, upload, or database needed.
 */
export const HERO_SLIDES: HeroSlide[] = [
  {
    id: "slide-1",
    title: "BMW M4",
    subtitle: "COMPETITION",
    label: "Premium Automotive",
    description: "Engineered for performance. Designed without compromise.",
    carImage: "/images/hero/slide-1.png",
    backgroundImage: "",
    backgroundVideo: "",
    ctaText: "Explore Car",
    ctaLink: "/cars",
    secondaryCtaText: "Build Your Car",
    secondaryCtaLink: "/cars",
    order: 0,
    active: true,
  },
  {
    id: "slide-2",
    title: "Porsche 911",
    subtitle: "CARRERA",
    label: "Premium Automotive",
    description: "A legend, refined again. Precision in every curve.",
    carImage: "/images/hero/slide-2.png",
    backgroundImage: "",
    backgroundVideo: "",
    ctaText: "Explore Car",
    ctaLink: "/cars",
    secondaryCtaText: "Build Your Car",
    secondaryCtaLink: "/cars",
    order: 1,
    active: true,
  },
  {
    id: "slide-3",
    title: "Nissan GT-R",
    subtitle: "NISMO",
    label: "Premium Automotive",
    description: "Built to dominate the track and the street alike.",
    carImage: "/images/hero/slide-3.png",
    backgroundImage: "",
    backgroundVideo: "",
    ctaText: "Explore Car",
    ctaLink: "/cars",
    secondaryCtaText: "Build Your Car",
    secondaryCtaLink: "/cars",
    order: 2,
    active: true,
  },
];
