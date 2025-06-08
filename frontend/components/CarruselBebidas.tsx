'use client';

import { useState } from "react";

export interface BebidaItem {
  titulo: string;
  descripcion: string;
  imagen: string;
  precio: number;
}

interface CarruselBebidasProps {
  items: BebidaItem[];
}

export default function CarruselBebidas({ items }: CarruselBebidasProps) {
  const [current, setCurrent] = useState(0);

  const prevSlide = () => {
    setCurrent((prev) => (prev - 1 + items.length) % items.length);
  };

  const nextSlide = () => {
    setCurrent((prev) => (prev + 1) % items.length);
  };

  if (items.length === 0) return null;

  const prevIndex = (current - 1 + items.length) % items.length;
  const nextIndex = (current + 1) % items.length;

  const renderCard = (index: number, position: "prev" | "current" | "next") => {
    const item = items[index];
    const baseClasses =
      "rounded-xl overflow-hidden transition-transform duration-500 ease-in-out";

    const titleClamp = "line-clamp-2 h-[3rem]";        // Altura fija al título
    const descClamp = "line-clamp-2 h-[3rem]";         // Altura fija al párrafo

    if (position === "current") {
      return (
        <div
          key={index}
          className={`${baseClasses} w-80 md:w-[22rem] transform scale-105 z-20 bg-white border-2 border-red-400`}
          style={{ boxShadow: "0 0 20px rgba(220,0,0,0.3)" }}
        >
          <img
            src={item.imagen}
            alt={item.titulo}
            className="w-full h-52 object-cover"
            loading="lazy"
          />
          <div className="p-4">
            <h3 className={`text-xl font-bold text-gray-900 ${titleClamp}`}>{item.titulo}</h3>
            <p className={`text-gray-700 text-sm mt-1 ${descClamp}`}>{item.descripcion}</p>
            <p className="text-red-600 font-semibold mt-3 text-lg">${item.precio.toFixed(2)}</p>
          </div>
        </div>
      );
    } else {
      return (
        <div
          key={index}
          className={`${baseClasses} w-64 md:w-72 transform scale-95 z-10 bg-white`}
          style={{ filter: "grayscale(100%) brightness(0.25)", opacity: 0.5 }}
        >
          <img
            src={item.imagen}
            alt={item.titulo}
            className="w-full h-44 object-cover"
            loading="lazy"
          />
          <div className="p-4">
            <h3 className={`text-lg font-semibold text-gray-800 ${titleClamp}`}>{item.titulo}</h3>
            <p className={`text-gray-600 text-sm mt-1 ${descClamp}`}>{item.descripcion}</p>
            <p className="text-red-500 font-semibold mt-3 text-sm">${item.precio.toFixed(2)}</p>
          </div>
        </div>
      );
    }
  };

  return (
    <section className="w-full max-w-6xl mx-auto py-4">
      <div className="relative flex justify-center items-center gap-6">
        <div className="cursor-pointer">{renderCard(prevIndex, "prev")}</div>
        <div className="cursor-pointer">{renderCard(current, "current")}</div>
        <div className="cursor-pointer">{renderCard(nextIndex, "next")}</div>
      </div>

      <div className="flex justify-center mt-6 gap-6">
        <button
          onClick={prevSlide}
          className="bg-red-600 hover:bg-red-700 text-white px-6 py-2 rounded-lg shadow-md transition"
          aria-label="Anterior"
        >
          ◀
        </button>
        <button
          onClick={nextSlide}
          className="bg-red-600 hover:bg-red-700 text-white px-6 py-2 rounded-lg shadow-md transition"
          aria-label="Siguiente"
        >
          ▶
        </button>
      </div>
    </section>
  );
}
