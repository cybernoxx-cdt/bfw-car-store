"use client";

import { useState } from "react";
import Image from "next/image";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Thumbs } from "swiper/modules";
import type { Swiper as SwiperType } from "swiper";
import { X } from "lucide-react";
import "swiper/css";
import "swiper/css/navigation";
import { cldResponsive } from "@/lib/cloudinary";

export function CarGallery({ images, alt }: { images: string[]; alt: string }) {
  const [thumbsSwiper, setThumbsSwiper] = useState<SwiperType | null>(null);
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);

  if (!images || images.length === 0) return null;

  return (
    <div>
      <Swiper
        modules={[Navigation, Thumbs]}
        thumbs={{ swiper: thumbsSwiper }}
        navigation
        className="main-gallery overflow-hidden rounded-2xl"
      >
        {images.map((src, i) => (
          <SwiperSlide key={src + i}>
            <button
              onClick={() => setLightboxIndex(i)}
              className="relative block aspect-[16/9] w-full"
              aria-label={`Open image ${i + 1} of ${images.length}`}
            >
              <Image
                src={cldResponsive(src, 1400)}
                alt={`${alt} — photo ${i + 1}`}
                fill
                className="object-cover"
              />
            </button>
          </SwiperSlide>
        ))}
      </Swiper>

      {images.length > 1 && (
        <Swiper
          modules={[Thumbs]}
          onSwiper={setThumbsSwiper}
          slidesPerView={4.5}
          spaceBetween={12}
          watchSlidesProgress
          className="mt-3"
          breakpoints={{ 640: { slidesPerView: 6 } }}
        >
          {images.map((src, i) => (
            <SwiperSlide key={src + i} className="cursor-pointer overflow-hidden rounded-lg opacity-50 transition-opacity [&.swiper-slide-thumb-active]:opacity-100">
              <div className="relative aspect-square">
                <Image src={cldResponsive(src, 200)} alt="" fill className="object-cover" />
              </div>
            </SwiperSlide>
          ))}
        </Swiper>
      )}

      {lightboxIndex !== null && (
        <div
          className="fixed inset-0 z-[200] flex items-center justify-center bg-black/95 p-4"
          role="dialog"
          aria-modal="true"
          onClick={() => setLightboxIndex(null)}
        >
          <button
            onClick={() => setLightboxIndex(null)}
            aria-label="Close gallery"
            className="absolute right-6 top-6 flex h-11 w-11 items-center justify-center rounded-full border border-white/20 text-bone"
          >
            <X size={20} />
          </button>
          <div className="relative h-full max-h-[80vh] w-full max-w-5xl" onClick={(e) => e.stopPropagation()}>
            <Image
              src={cldResponsive(images[lightboxIndex], 1800)}
              alt={`${alt} — full size`}
              fill
              className="object-contain"
            />
          </div>
        </div>
      )}
    </div>
  );
}
