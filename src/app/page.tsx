import Link from "next/link";
import { Search, Sliders, MessageCircle } from "lucide-react";
import { HeroSlider } from "@/components/home/HeroSlider";
import { FeaturedVehicles } from "@/components/home/FeaturedVehicles";
import { SectionHeading } from "@/components/shared/SectionHeading";

const STEPS = [
  {
    icon: Search,
    title: "Browse the Collection",
    description: "Explore our current lineup, filtered by brand, category, and price.",
  },
  {
    icon: Sliders,
    title: "Build Your Car",
    description: "Choose modifications by category and watch your total update live.",
  },
  {
    icon: MessageCircle,
    title: "Talk To Our Team",
    description: "Send your build straight to WhatsApp to confirm availability.",
  },
];

export default function HomePage() {
  return (
    <>
      <HeroSlider />
      <FeaturedVehicles />

      <section className="border-t border-white/10 bg-ink-800 py-24 sm:py-32">
        <div className="mx-auto max-w-7xl px-6">
          <SectionHeading label="How It Works" title="From Browsing To Building" align="center" />
          <div className="mt-14 grid gap-8 sm:grid-cols-3">
            {STEPS.map(({ icon: Icon, title, description }, i) => (
              <div key={title} className="rounded-2xl border border-white/10 bg-ink-700/50 p-8">
                <div className="mb-6 flex h-12 w-12 items-center justify-center rounded-full bg-ignition/10 text-ignition">
                  <Icon size={20} />
                </div>
                <p className="mb-2 font-display text-xs font-semibold uppercase tracking-widest2 text-bone-dim">
                  Step {i + 1}
                </p>
                <h3 className="font-display text-xl font-bold uppercase text-bone">{title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-bone-dim">{description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-ink-900 py-24 text-center sm:py-32">
        <div className="mx-auto max-w-2xl px-6">
          <h2 className="font-display text-4xl font-bold uppercase leading-tight text-bone sm:text-5xl">
            Ready to build <span className="text-ignition">something serious?</span>
          </h2>
          <p className="mt-4 text-bone-dim">
            Every build starts with a vehicle. Find yours and start configuring.
          </p>
          <Link
            href="/cars"
            className="mt-8 inline-flex items-center gap-2 rounded-full bg-ignition px-8 py-4 text-xs font-semibold uppercase tracking-widest2 text-ink-900 transition-colors hover:bg-ignition-soft"
          >
            Explore The Collection
          </Link>
        </div>
      </section>
    </>
  );
}
