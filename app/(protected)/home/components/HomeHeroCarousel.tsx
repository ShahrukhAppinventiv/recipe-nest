"use client";

import { useRef } from "react";
import Image from "next/image";
import Autoplay from "embla-carousel-autoplay";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";

const HERO_IMAGES = [
  {
    src: "/recipe1.webp",
    alt: "Colorful vegetable stir fry in a bowl",
  },
  {
    src: "/recipe2.webp",
    alt: "Fresh pasta with herbs and tomatoes",
  },
  {
    src: "/recipe3.webp",
    alt: "Gourmet plated dish with seasonal ingredients",
  },
  {
    src: "/recipe4.webp",
    alt: "Warm homemade soup with fresh bread",
  },
  {
    src: "/recipe5.webp",
    alt: "Healthy grain bowl with roasted vegetables",
  },
  {
    src: "/recipe6.avif",
    alt: "Elegant dinner spread on a rustic table",
  },
] as const;

export function HomeHeroCarousel() {
  const autoplay = useRef(
    Autoplay({
      delay: 3000,
      stopOnInteraction: false,
    }),
  );

  return (
    <Carousel
      opts={{ loop: true }}
      plugins={[autoplay.current]}
      className="w-full"
      aria-label="Featured recipe photos"
    >
      <CarouselContent className="-ml-0">
        {HERO_IMAGES.map((image, index) => (
          <CarouselItem key={image.src} className="pl-0">
            <div className="relative aspect-[4/5] overflow-hidden rounded-2xl shadow-large sm:aspect-[5/6]">
              <Image
                src={image.src}
                alt={image.alt}
                fill
                priority={index === 0}
                className="object-cover"
                sizes="(max-width: 1024px) 100vw, 560px"
              />
            </div>
          </CarouselItem>
        ))}
      </CarouselContent>

      <CarouselPrevious className="left-3 border-border/40 bg-card/90 backdrop-blur-sm hover:bg-card disabled:opacity-40" />
      <CarouselNext className="right-3 border-border/40 bg-card/90 backdrop-blur-sm hover:bg-card disabled:opacity-40" />
    </Carousel>
  );
}
