"use client";

import { useRef } from "react";
import "../styles/globals.css";
import CardPizza from "@/components/CardPizza";
import Carousel from "@/components/CarruselBebidas";
import Footer from "@/components/Footer";


export default function Home() {
  const carouselRef = useRef<HTMLDivElement>(null);

  const scroll = (direction: "left" | "right") => {
    const container = carouselRef.current;
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

  const cards = Array.from({ length: 6 });

  return (
    <div className="min-h-screen font-[family-name:var(--font-geist-sans)]">
      {/* IMAGEN PRINCIPAL */}
      <section className="relative w-full h-[70vh]">
        <img
          src="/images/pizza.jpg"
          alt="pizza_deliciosa"
          className="absolute top-0 left-0 w-full h-full object-cover"
        />
        <div className="absolute inset-0 flex flex-col items-center justify-center text-white text-center px-4 bg-black/60">
          <h1 className="text-6xl font-bold mb-6">¡El sabor que conquista!</h1>
          <p className="text-3xl mb-2">Pizzas artesanales, recién horneadas</p>
          <p className="max-w-xl mb-4">
            Descubre el auténtico sabor de nuestras pizzas hechas con ingredientes frescos y masa artesanal.
          </p>
          <button className="bg-red-600 hover:bg-red-700 text-white px-6 py-2 rounded-2xl">
            Llámanos
          </button>
        </div>
      </section>

      {/* PROMOCIONES */}
      <main className="p-8 sm:p-20 flex flex-col gap-8">
        <h1 className="text-3xl font-bold">Promociones</h1>
        <p>Una promoción se disfruta mejor en familia y amigos</p>

        <div className="relative w-[1480px] mx-auto overflow-hidden">
          {/* Flecha Izquierda */}
          <button
            onClick={() => scroll("left")}
            className="absolute left-0 top-1/2 z-10 -translate-y-1/2 bg-white shadow-md rounded-full p-3 text-[#5E3527] hover:bg-[#BF7645] transition"
          >
            &#8592;
          </button>

          <div className="px-10 py-2">
            <div
              ref={carouselRef}
              className="flex gap-6 no-scrollbar overflow-hidden"
            >
              {cards.map((_, i) => (
                <CardPizza
                  key={i}
                  title="Súper Promo Aña"
                  description="Disfruta de una pizza familiar y una bebida de 2L."
                  price="$20.00"
                  oldPrice="$60.00"
                  imageUrl="/images/pizza.jpg"
                  discount="-45%"
                />
              ))}
            </div>
          </div>

          {/* Flecha Derecha */}
          <button
            onClick={() => scroll("right")}
            className="absolute right-0 top-1/2 z-10 -translate-y-1/2 bg-white shadow-md rounded-full p-3 text-[#5E3527] hover:bg-[#BF7645] transition"
          >
            &#8594;
          </button>
        </div>
      </main>

      {/* LO MÁS VENDIDO */}
      <main className="p-8 sm:p-20 flex flex-col gap-8">
        <h1 className="text-3xl font-bold">¡Lo más vendido!</h1>
        <p>Revisa las pizzas, combos y complementos más pedidos que tenemos para ti.</p>

        <div className="relative w-[1480px] mx-auto overflow-hidden">
          <button
            onClick={() => scroll("left")}
            className="absolute left-0 top-1/2 z-10 -translate-y-1/2 bg-white shadow-md rounded-full p-3 text-[#5E3527] hover:bg-[#BF7645] transition"
          >
            &#8592;
          </button>

          <div className="px-10 py-2">
            <div
              ref={carouselRef}
              className="flex gap-6 no-scrollbar overflow-hidden"
            >
              {cards.map((_, i) => (
                <CardPizza
                  key={i}
                  title="Súper Promo Aña"
                  description="Disfruta de una pizza familiar y una bebida de 2L."
                  price="$20.00"
                  oldPrice="$60.00"
                  imageUrl="/images/pizza.jpg"
                  discount="-45%"
                />
              ))}
            </div>
          </div>

          <button
            onClick={() => scroll("right")}
            className="absolute right-0 top-1/2 z-10 -translate-y-1/2 bg-white shadow-md rounded-full p-3 text-[#5E3527] hover:bg-[#BF7645] transition"
          >
            &#8594;
          </button>
        </div>
      </main>

    <div>
      <Carousel />
      {/* otras secciones */}
    </div>
 
    <div>
      <Footer />
      {/* otras secciones */}
    </div>

    </div>
  );
}
