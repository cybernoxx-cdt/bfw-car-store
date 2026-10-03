"use client";

import { useEffect, useRef } from "react";
import Image from "next/image";
import { cldResponsive } from "@/lib/cloudinary";
import { fadeIn } from "@/lib/animations";
import type { Modification } from "@/types";

function OverlayLayer({ mod }: { mod: Modification }) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (ref.current) fadeIn(ref.current, { duration: 0.5 });
  }, []);

  return (
    <div
      ref={ref}
      className="absolute opacity-0"
      style={{
        top: `${mod.overlayTop ?? 0}%`,
        left: `${mod.overlayLeft ?? 0}%`,
        width: `${mod.overlayWidth ?? 100}%`,
      }}
    >
      <Image
        src={cldResponsive(mod.overlayImage as string, 1200)}
        alt={mod.name}
        width={1100}
        height={620}
        className="h-auto w-full object-contain"
      />
    </div>
  );
}

interface VisualConfiguratorProps {
  baseImage: string;
  altText: string;
  layeredMods: Modification[];
}

/** Layers transparent modification cutouts (spoilers, wheels, body kits…)
 * on top of the base car photo. Falls back to nothing if the car has no
 * base image — the card-based configurator always works regardless. */
export function VisualConfigurator({ baseImage, altText, layeredMods }: VisualConfiguratorProps) {
  if (!baseImage) return null;

  return (
    <div className="relative aspect-[16/10] w-full overflow-hidden rounded-2xl border border-white/10 bg-ink-700">
      <Image src={cldResponsive(baseImage, 1400)} alt={altText} fill className="object-contain" />
      {layeredMods.map((mod) => (
        <OverlayLayer key={mod.id} mod={mod} />
      ))}
    </div>
  );
}
