import type { Metadata } from "next";
import Image from "next/image";
import { MapPin, Clock } from "lucide-react";
import { getAboutInfo } from "@/lib/firestore/about";
import { getBusinessSettings } from "@/lib/firestore/settings";
import { cldResponsive } from "@/lib/cloudinary";
import { SectionHeading } from "@/components/shared/SectionHeading";

export const metadata: Metadata = {
  title: "About",
  description: "The story, mission, and people behind the showroom.",
};

export default async function AboutPage() {
  const [about, settings] = await Promise.all([getAboutInfo(), getBusinessSettings()]);

  return (
    <div className="pt-32 sm:pt-40">
      {/* Owner profile */}
      <section className="mx-auto max-w-7xl px-6">
        <div className="grid items-center gap-12 lg:grid-cols-2">
          <div>
            <p className="mb-3 text-xs font-semibold uppercase tracking-widest2 text-ignition">Meet The Owner</p>
            <h1 className="font-display text-4xl font-bold uppercase leading-[0.95] text-bone sm:text-5xl">
              {about.ownerName || "Our Founder"}
            </h1>
            <p className="mt-2 text-sm font-semibold uppercase tracking-widest2 text-bone-dim">{about.ownerRole}</p>
            <p className="mt-6 max-w-lg text-base leading-relaxed text-bone-dim">{about.biography}</p>
          </div>
          <div className="relative aspect-[4/5] w-full overflow-hidden rounded-3xl border border-white/10 bg-ink-700">
            {about.ownerImage && (
              <Image src={cldResponsive(about.ownerImage, 900)} alt={about.ownerName} fill className="object-cover" />
            )}
          </div>
        </div>
      </section>

      {/* Company story */}
      <section className="mx-auto mt-28 max-w-4xl px-6">
        <SectionHeading label="Our Story" title="How It Started" />
        <p className="mt-6 whitespace-pre-line text-base leading-relaxed text-bone-dim">{about.companyStory}</p>
      </section>

      {/* Mission / Vision */}
      <section className="mx-auto mt-24 max-w-7xl px-6">
        <div className="grid gap-6 sm:grid-cols-2">
          <div className="rounded-2xl border border-white/10 bg-ink-700/50 p-8">
            <p className="mb-3 text-xs font-semibold uppercase tracking-widest2 text-ignition">Mission</p>
            <p className="text-lg leading-relaxed text-bone">{about.mission}</p>
          </div>
          <div className="rounded-2xl border border-white/10 bg-ink-700/50 p-8">
            <p className="mb-3 text-xs font-semibold uppercase tracking-widest2 text-ignition">Vision</p>
            <p className="text-lg leading-relaxed text-bone">{about.vision}</p>
          </div>
        </div>
      </section>

      {/* Values */}
      {about.values?.length > 0 && (
        <section className="mx-auto mt-24 max-w-7xl px-6">
          <SectionHeading label="What We Stand For" title="Our Values" />
          <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {about.values.map((value, i) => (
              <div key={i} className="rounded-2xl border border-white/10 bg-ink-700/50 p-6">
                <span className="font-display text-3xl font-bold text-ignition">
                  {String(i + 1).padStart(2, "0")}
                </span>
                <p className="mt-3 font-display text-lg font-semibold uppercase text-bone">{value}</p>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Business info strip */}
      <section className="mx-auto mb-28 mt-24 max-w-7xl px-6">
        <div className="flex flex-col gap-6 rounded-2xl border border-white/10 bg-ink-700/50 p-8 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="font-display text-xl font-bold uppercase text-bone">{settings.businessName}</p>
          </div>
          <div className="flex flex-col gap-3 text-sm text-bone-dim sm:flex-row sm:items-center sm:gap-8">
            {settings.address && (
              <span className="flex items-center gap-2"><MapPin size={15} className="text-ignition" /> {settings.address}</span>
            )}
            {settings.businessHours && (
              <span className="flex items-center gap-2"><Clock size={15} className="text-ignition" /> {settings.businessHours}</span>
            )}
          </div>
        </div>
      </section>
    </div>
  );
}
