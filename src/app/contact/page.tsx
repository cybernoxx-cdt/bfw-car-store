import type { Metadata } from "next";
import { Phone, Mail, MapPin, Clock, Instagram, Facebook } from "lucide-react";
import { getBusinessSettings } from "@/lib/firestore/settings";
import { WhatsAppButton } from "@/components/shared/WhatsAppButton";
import { SectionHeading } from "@/components/shared/SectionHeading";

export const metadata: Metadata = {
  title: "Contact",
  description: "Get in touch with our team on WhatsApp, phone, or email.",
};

export default async function ContactPage() {
  const settings = await getBusinessSettings();

  const channels = [
    { icon: Phone, label: "Phone", value: settings.phone, href: settings.phone ? `tel:${settings.phone}` : undefined },
    { icon: Mail, label: "Email", value: settings.email, href: settings.email ? `mailto:${settings.email}` : undefined },
    { icon: MapPin, label: "Address", value: settings.address },
    { icon: Clock, label: "Business Hours", value: settings.businessHours },
    { icon: Instagram, label: "Instagram", value: settings.instagram, href: settings.instagram },
    { icon: Facebook, label: "Facebook", value: settings.facebook, href: settings.facebook },
  ].filter((c) => c.value);

  return (
    <div className="mx-auto max-w-5xl px-6 pb-28 pt-32 sm:pt-40">
      <SectionHeading label="Get In Touch" title="Contact Us" />

      <div className="mt-12 grid gap-10 lg:grid-cols-2">
        <div>
          <p className="max-w-md text-base leading-relaxed text-bone-dim">
            Have a question about a vehicle, a build, or availability? Message
            us directly on WhatsApp for the fastest response, or reach out
            through any channel below.
          </p>
          <div className="mt-8">
            <WhatsAppButton
              number={settings.whatsappNumber}
              label="Message Us On WhatsApp"
              message="Hello, I have a question about your vehicles."
            />
          </div>
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          {channels.map(({ icon: Icon, label, value, href }) => {
            const inner = (
              <>
                <Icon size={18} className="mb-4 text-ignition" />
                <p className="text-[11px] font-semibold uppercase tracking-widest2 text-bone-dim">{label}</p>
                <p className="mt-1 break-words text-sm text-bone">{value}</p>
              </>
            );
            const className = "block rounded-2xl border border-white/10 bg-ink-700/50 p-6 transition-colors hover:border-ignition/40";

            return href ? (
              <a key={label} href={href} target="_blank" rel="noopener noreferrer" className={className}>
                {inner}
              </a>
            ) : (
              <div key={label} className={className}>
                {inner}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
