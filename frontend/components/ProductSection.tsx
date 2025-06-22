// components/ProductSection.tsx
import React, { RefObject } from "react";
import Link from "next/link";
import ProductoCard, { ProductoCardProps } from "@/components/ProductoCard";

interface ProductSectionProps {
  title: string;
  description: string;
  link: string;
  productos: ProductoCardProps[];
  scrollRef: RefObject<HTMLDivElement | null>;
  onScrollLeft: () => void;
  onScrollRight: () => void;
}

export default function ProductSection({
  title,
  description,
  link,
  productos,
  scrollRef,
  onScrollLeft,
  onScrollRight,
}: ProductSectionProps) {
  return (
    <section className="w-full py-10 bg-white relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center mb-6 flex-wrap sm:flex-nowrap">
          <div className="max-w-[70%] sm:max-w-none">
            <h1 className="text-xl sm:text-3xl font-bold">{title}</h1>
            <p className="text-xs sm:text-base break-words">{description}</p>
          </div>
          <Link href={link}>
            <span className="text-sm sm:text-base underline text-red-600 whitespace-nowrap mt-2 sm:mt-0 cursor-pointer">
              Ver más
            </span>
          </Link>
        </div>

        <div className="relative group">
          {/* Botón izquierdo - posicionado correctamente */}
          <button
            onClick={onScrollLeft}
            className="hidden sm:flex absolute left-0 top-1/2 -translate-y-1/2 z-10 bg-red-600 text-white border border-red-600 rounded-l-lg p-2 cursor-pointer hover:brightness-110 transition transform -translate-x-1/2"
            aria-label="Scroll left"
          >
            ◀
          </button>

          {/* Contenedor de productos */}
          <div
            ref={scrollRef}
            className="flex gap-4 flex-nowrap overflow-x-auto sm:overflow-x-hidden scrollbar-hide px-2"
          >
            {productos.map((producto, index) => (
              <div key={index} className="flex-shrink-0 lg:w-64 sm:w-48">
                <ProductoCard {...producto} />
              </div>
            ))}
          </div>

          {/* Botón derecho - posicionado correctamente */}
          <button
            onClick={onScrollRight}
            className="hidden sm:flex absolute right-0 top-1/2 -translate-y-1/2 z-10 bg-red-600 text-white border border-red-600 rounded-r-lg p-2 cursor-pointer hover:brightness-110 transition transform translate-x-1/2"
            aria-label="Scroll right"
          >
            ▶
          </button>
        </div>
      </div>
    </section>
  );
}