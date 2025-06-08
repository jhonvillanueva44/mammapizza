'use client';

import { useState } from 'react';
import styles from './BannerCard.module.css';

type BannerCardProps = {
  images: string[];
  title: string;
  subtitle: string;
  description: string;
  linkLeft: string;
  linkRight: string;
};

export default function BannerCard({
  images,
  title,
  subtitle,
  description,
  linkLeft,
  linkRight,
}: BannerCardProps) {
  const [hovered, setHovered] = useState<'left' | 'right' | null>(null);

  return (
    <div className="flex justify-center items-center py-10 px-4">
      <div className="flex flex-col md:flex-row w-full max-w-6xl md:h-[220px] overflow-hidden rounded-xl shadow-sm">
        {/* IMAGEN */}
        <a
          href={linkLeft}
          onMouseEnter={() => setHovered('left')}
          onMouseLeave={() => setHovered(null)}
          className={`
            w-full md:w-[65%] 
            bg-[#0C1011] 
            overflow-hidden 
            relative 
            transition-transform duration-300 ease-in-out 
            ${hovered === 'left' ? 'scale-[1.03] z-20 shadow-lg' : 'z-10'}
            border-l-4 md:border-l-4 md:rounded-l-xl border-red-400
            md:rounded-tr-none rounded-t-xl
          `}
        >
          <div className={`${styles.carousel} ${hovered === 'left' ? styles.active : ''}`}>
            {images.concat(images).map((src, idx) => (
              <img
                key={idx}
                src={src}
                alt={`img-${idx}`}
                className="h-full w-auto object-cover select-none mx-auto"
                draggable={false}
              />
            ))}
          </div>
        </a>

        {/* TEXTO */}
        <a
          href={linkRight}
          onMouseEnter={() => setHovered('right')}
          onMouseLeave={() => setHovered(null)}
          className={`
            w-full md:w-[35%] 
            bg-gray-50 
            flex items-center 
            transition-transform duration-300 ease-in-out 
            ${hovered === 'right' ? 'scale-[1.03] z-20 shadow-lg' : 'z-10'}
            border-r-4 md:border-r-4 border-gray-700
            md:rounded-r-xl rounded-b-xl md:rounded-tl-none
          `}
        >
          <div className="px-6 py-4 flex flex-col gap-2 text-center md:text-left">
            <h2 className="text-2xl font-bold text-red-700">{title}</h2>
            <h4 className="text-lg font-semibold text-red-600">{subtitle}</h4>
            <p className="text-sm text-gray-700">{description}</p>
          </div>
        </a>
      </div>
    </div>
  );
}
