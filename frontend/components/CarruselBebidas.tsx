"use client";

import { useEffect, useState } from "react";

const images = [
  "/images/Cbodka.png",
  "/images/Gaseosas.png",
];

export default function Carousel() {
  const [current, setCurrent] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrent((prev) => (prev + 1) % images.length);
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  const prevSlide = () => {
    setCurrent((prev) => (prev - 1 + images.length) % images.length);
  };

  const nextSlide = () => {
    setCurrent((prev) => (prev + 1) % images.length);
  };

  return (
  <div className="relative w-full overflow-hidden">
    {/* Imagen */}
    <img
      src={images[current]}
      alt={`imagen_${current}`}
      className="w-full h-auto sm:h-[70vh] object-contain sm:object-cover transition-all duration-700"
    />

    {/* Flechas y overlay */}
    <div className="absolute inset-0 flex items-center justify-center text-white text-3xl font-bold pointer-events-none" />

    {/* Flecha izquierda */}
    <button
      onClick={prevSlide}
      className="absolute top-1/2 left-4 transform -translate-y-1/2 bg-white/70 hover:bg-[#5E3527] text-black p-3 rounded-full shadow-md pointer-events-auto"
    >
      &#8592;
    </button>

    {/* Flecha derecha */}
    <button
      onClick={nextSlide}
      className="absolute top-1/2 right-4 transform -translate-y-1/2 bg-white/70 hover:bg-[#5E3527] text-black p-3 rounded-full shadow-md pointer-events-auto"
    >
      &#8594;
    </button>
  </div>
);

}
