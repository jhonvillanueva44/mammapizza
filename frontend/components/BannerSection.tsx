// components/BannerSection.tsx
import React from "react";
import BannerCard from "@/components/BannerCard/BannerCard";

interface BannerData {
  title: string;
  subtitle: string;
  description: string;
  images: string[];
  linkLeft: string;
  linkRight: string;
}

interface BannerSectionProps {
  banners: BannerData[];
}

export default function BannerSection({ banners }: BannerSectionProps) {
  return (
    <section className="flex flex-col gap-8 items-center w-full py-12 bg-white">
      {banners.map((banner, index) => (
        <BannerCard
          key={index}
          images={banner.images}
          title={banner.title}
          subtitle={banner.subtitle}
          description={banner.description}
          linkLeft={banner.linkLeft}
          linkRight={banner.linkRight}
        />
      ))}
    </section>
  );
}
