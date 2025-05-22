"use client";

import { useState } from "react";

const categories = [
  {
    name: "Pizzas",
    image: "/images/pizzaC.png",
  },
  {
    name: "Calzone",
    image: "/images/calzone.png",
  },
  {
    name: "Pastas",
    image: "/images/pasta.png",
  },
  {
    name: "Adicionales",
    image: "/images/pan.png",
  },
  {
    name: "Promociones o Combos",
    image: "/images/promociones.png",
  },
];

export default function CategoryButtons() {
  const [activeIndex, setActiveIndex] = useState<number | null>(null); 

  const handleClick = (index: number) => {
    setActiveIndex(index);
  };

  return (
    <div className="w-full max-w-6xl mx-auto px-4 py-8">
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-x-4 gap-y-6 justify-items-center">
        {categories.map((cat, index) => (
          <div
            key={index}
            onClick={() => handleClick(index)}
            className={`
              flex flex-col items-center justify-center text-center cursor-pointer rounded-2xl border-2 border-[#BF7645] p-4
              transition-all duration-300 transform hover:scale-105
              hover:bg-[#f8f1ec] bg-white
              ${activeIndex === index ? "ring-2 ring-[#BF7645]" : ""}
            `}
          >
            <span className="mb-3 text-base font-semibold text-[#BF7645]">
              {cat.name}
            </span>
            <img
              src={cat.image}
              alt={cat.name}
              className="w-32 h-32 object-contain"
            />
          </div>
        ))}
      </div>
    </div>
  );
}
