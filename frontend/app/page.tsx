"use client";

import { useRef } from "react";
import "../styles/globals.css";
import CardPizza from "@/components/CardPizza";
import Carousel from "@/components/CarruselBebidas";
import Footer from "@/components/Footer";
import MenuCarrusel from "@/components/MenuCarrusel";

export default function Home() {
  const carouselRef1 = useRef<HTMLDivElement>(null);
  const carouselRef2 = useRef<HTMLDivElement>(null);

  const scroll = (
    direction: "left" | "right",
    ref: React.RefObject<HTMLDivElement | null>
  ) => {
    const container = ref.current;
    if (!container) return;

    const firstCard = container.querySelector("div");
    if (!firstCard) return;

    const style = getComputedStyle(firstCard);
    const cardWidth = firstCard.clientWidth;
    const gap = parseInt(style.marginRight) || 24;

    const scrollAmount = cardWidth + gap;

    container.scrollBy({
      left: direction === "left" ? -scrollAmount : scrollAmount,
      behavior: "smooth",
    });
  };

  const cards = Array.from({ length: 8 });

  return (
    <div className="min-h-screen font-[family-name:var(--font-geist-sans)] bg-white">
      {/* IMAGEN PRINCIPAL */}
      <section className="relative w-full h-[35vh] sm:h-[55vh] lg:h-[70vh]">
        <img
          src="/images/pizza.jpg"
          alt="pizza_deliciosa"
          className="absolute top-0 left-0 w-full h-full object-cover"
        />
        <div className="absolute inset-0 flex flex-col items-center justify-center text-white text-center px-2 sm:px-4 bg-black/60">
          <h1 className="text-2xl sm:text-4xl lg:text-6xl font-bold mb-2 sm:mb-4">
            ¡El sabor que conquista!
          </h1>
          <p className="text-base sm:text-xl lg:text-3xl mb-1 sm:mb-2">
            Pizzas artesanales, recién horneadas
          </p>
          <p className="max-w-md sm:max-w-xl mb-2 sm:mb-4 text-xs sm:text-base">
            Descubre el auténtico sabor de nuestras pizzas hechas con ingredientes frescos y masa artesanal.
          </p>
          <button className="bg-red-600 hover:bg-red-700 text-white px-4 sm:px-6 py-2 rounded-2xl text-sm sm:text-base">
            Llámanos
          </button>
        </div>
      </section>

      <div>
        <MenuCarrusel />
      </div>

      {/* PROMOCIONES */}
      <main className="p-2 sm:p-6 lg:p-16 flex flex-col gap-2 sm:gap-6">
        <h1 className="text-xl sm:text-3xl font-bold">Promociones</h1>
        <p className="text-xs sm:text-base">
          Una promoción se disfruta mejor en familia y amigos
        </p>

<div className="relative w-full px-4 sm:px-8 lg:px-12 overflow-visible">
          <button
            onClick={() => scroll("left", carouselRef1)}
            className="hidden sm:flex absolute left-0 top-1/2 z-10 -translate-y-1/2 bg-white shadow-md rounded-full p-2 sm:p-3 text-[#5E3527] hover:bg-[#BF7645] transition"
          >
            &#8592;
          </button>

          <div className="px-1 sm:px-6 py-2">
            <div
              ref={carouselRef1}
              className="flex gap-2 sm:gap-3 lg:gap-4 overflow-x-auto sm:overflow-hidden snap-x snap-mandatory no-scrollbar"
            >
              {cards.map((_, i) => (
                <div
                  key={i}
                  className="min-w-[180px] sm:min-w-[200px] lg:min-w-[220px] max-w-[220px] flex-shrink-0 snap-start"
                >
                  <CardPizza
                    title="Súper Promo Aña"
                    description="Disfruta de una pizza familiar y una bebida de 2L."
                    price="$20.00"
                    oldPrice="$60.00"
                    imageUrl="/images/pizza.jpg"
                    discount="-45%"
                  />
                </div>
              ))}
            </div>
          </div>

          <button
            onClick={() => scroll("right", carouselRef1)}
            className="hidden sm:flex absolute right-0 top-1/2 z-10 -translate-y-1/2 bg-white shadow-md rounded-full p-2 sm:p-3 text-[#5E3527] hover:bg-[#BF7645] transition"
          >
            &#8594;
          </button>
        </div>
      </main>

      {/* LO MÁS VENDIDO */}
      <main className="p-2 sm:p-6 lg:p-16 flex flex-col gap-2 sm:gap-6">
        <h1 className="text-xl sm:text-3xl font-bold">¡Lo más vendido!</h1>
        <p className="text-xs sm:text-base">
          Revisa las pizzas, combos y complementos más pedidos que tenemos para ti.
        </p>

<div className="relative w-full px-4 sm:px-8 lg:px-12 overflow-visible">
          <button
            onClick={() => scroll("left", carouselRef2)}
            className="hidden sm:flex absolute left-0 top-1/2 z-10 -translate-y-1/2 bg-white shadow-md rounded-full p-2 sm:p-3 text-[#5E3527] hover:bg-[#BF7645] transition"
          >
            &#8592;
          </button>

          <div className="px-1 sm:px-6 py-2">
            <div
              ref={carouselRef2}
              className="flex gap-2 sm:gap-3 lg:gap-4 overflow-x-auto sm:overflow-hidden snap-x snap-mandatory no-scrollbar"
            >
              {cards.map((_, i) => (
                <div
                  key={i}
                  className="min-w-[180px] sm:min-w-[200px] lg:min-w-[220px] max-w-[220px] flex-shrink-0 snap-start"
                >
                  <CardPizza
                    title="Súper Promo Aña"
                    description="Disfruta de una pizza familiar y una bebida de 2L."
                    price="$20.00"
                    oldPrice="$60.00"
                    imageUrl="/images/pizza.jpg"
                    discount="-45%"
                  />
                </div>
              ))}
            </div>
          </div>

          <button
            onClick={() => scroll("right", carouselRef2)}
            className="hidden sm:flex absolute right-0 top-1/2 z-10 -translate-y-1/2 bg-white shadow-md rounded-full p-2 sm:p-3 text-[#5E3527] hover:bg-[#BF7645] transition"
          >
            &#8594;
          </button>
        </div>
      </main>

      <div>
        <Carousel />
      </div>

      <div>
        <Footer />
      </div>
    </div>
  );
}
