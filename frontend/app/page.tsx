"use client";

import { useRef } from "react";
import '../styles/globals.css';

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
    behavior: "smooth", // animación suave
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

        {/* Carrusel */}
        <div className="relative w-[1480px] mx-auto overflow-hidden">
          {/* Flecha Izquierda */}
          <button
            onClick={() => scroll("left")}
            className="absolute left-0 top-1/2 z-10 -translate-y-1/2 bg-white shadow-md rounded-full p-3 text-[#5E3527] hover:bg-[#BF7645] transition"
          >
            &#8592;
          </button>

          {/* Carrusel */}
          <div className="px-10 py-2">
            <div
              ref={carouselRef}
              className="flex gap-6 no-scrollbar overflow-hidden scroll-smooth"
              style={{ scrollBehavior: "smooth" }}
            >
              {cards.map((_, i) => (
                <div
                  key={i}
                  className="flex-shrink-0 bg-white shadow-md rounded-md p-4 w-[280px]"
                  // marginRight se controla por gap en flex, no aquí
                >
                  <div className="relative w-full">
                    <img
                      src="/images/pizza.jpg"
                      alt={`pizza_tarjeta_${i}`}
                      className="w-full h-[150px] object-cover rounded-md"
                    />
                    <span className="absolute top-2 left-2 text-white text-xs px-2 py-1 bg-[#BF7645] rounded">
                      -45%
                    </span>
                  </div>
                  <div className="mt-4">
                    <h3 className="text-xl font-semibold">Súper Promo Aña</h3>
                    <p className="text-sm text-gray-600 mt-1">
                      Disfruta de una pizza familiar y una bebida de 2L.
                    </p>
                    <div className="flex items-center gap-3 mt-2">
                      <p className="text-lg font-bold text-green-600">$20.00</p>
                      <p className="text-sm text-gray-500 line-through">$60.00</p>
                    </div>
                    <button className="mt-4 bg-[#5E3527] hover:bg-[#35231d] text-white px-4 py-2 rounded-2xl text-sm w-full">
                      Agregar al Carrito
                    </button>
                  </div>
                </div>
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

      {/* LO MAS VENDIDO */}
      <main className="p-8 sm:p-20 flex flex-col gap-8">
        <h1 className="text-3xl font-bold">¡Lo más vendido!</h1>
        <p>Revisa las pizzas, combos y complementos más pedidos que tenemos para ti.</p>

        {/* Carrusel */}
        <div className="relative w-[1480px] mx-auto overflow-hidden">
          {/* Flecha Izquierda */}
          <button
            onClick={() => scroll("left")}
            className="absolute left-0 top-1/2 z-10 -translate-y-1/2 bg-white shadow-md rounded-full p-3 text-[#5E3527] hover:bg-[#BF7645] transition"
          >
            &#8592;
          </button>

          {/* Carrusel */}
          <div className="px-10 py-2">
            <div
              ref={carouselRef}
              className="flex gap-6 no-scrollbar overflow-hidden scroll-smooth"
              style={{ scrollBehavior: "smooth" }}
            >
              {cards.map((_, i) => (
                <div
                  key={i}
                  className="flex-shrink-0 bg-white shadow-md rounded-md p-4 w-[280px]"
                  // marginRight se controla por gap en flex, no aquí
                >
                  <div className="relative w-full">
                    <img
                      src="/images/pizza.jpg"
                      alt={`pizza_tarjeta_${i}`}
                      className="w-full h-[150px] object-cover rounded-md"
                    />
                    <span className="absolute top-2 left-2 text-white text-xs px-2 py-1 bg-[#BF7645] rounded">
                      -45%
                    </span>
                  </div>
                  <div className="mt-4">
                    <h3 className="text-xl font-semibold">Súper Promo Aña</h3>
                    <p className="text-sm text-gray-600 mt-1">
                      Disfruta de una pizza familiar y una bebida de 2L.
                    </p>
                    <div className="flex items-center gap-3 mt-2">
                      <p className="text-lg font-bold text-green-600">$20.00</p>
                      <p className="text-sm text-gray-500 line-through">$60.00</p>
                    </div>
                    <button className="mt-4 bg-[#5E3527] hover:bg-[#35231d] text-white px-4 py-2 rounded-2xl text-sm w-full">
                      Agregar al Carrito
                    </button>
                  </div>
                </div>
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
            

     {/* CARRUSEL DE BEBIDAS */}
<section className="relative w-full h-[70vh] flex">
  {/* Columna izquierda - fondo oscuro */}
  <div className="w-1/2 bg-[#1C191B] text-white pl-10 pr-20 pt-6 pb-10 relative">
    
    {/* Título en la parte superior izquierda */}
    <div className="absolute top-6 left-10">
      <h1 className="text-3xl font-bold mb-1">Conoce nuestras bebidas</h1>
      <p className="text-lg">Explore nuestra selección de licores premium y disfrute cada sorbo</p>
    </div>

    {/* Contenido (destilados) centrado más abajo */}
    <div className="mt-54 space-y-5">
      <h2 className="text-2xl font-semibold">Destilados</h2>

      <div className="flex justify-between items-center text-lg font-medium">
        <p>Mojito Clásico</p>
        <p>s/9,00</p>
      </div>
      <p className="text-base">Refrescante mezcla de ron, menta fresca, lima y un toque de soda.</p>

      <div className="flex justify-between items-center text-lg font-medium">
        <p>Margarita Tradicional</p>
        <p>s/10,50</p>
      </div>
      <p className="text-base">Tequila de alta calidad con jugo de lima y licor de naranja, servido en copa escarchada.</p>

      <div className="flex justify-between items-center text-lg font-medium">
        <p>Piña Colada</p>
        <p>s/9,50</p>
      </div>
      <p className="text-base">Dulce combinación de ron, crema de coco y jugo de piña natural.</p>
    </div>
  </div>

  {/* Imagen central - sobrepuesta */}
  <div className="absolute inset-y-0 left-1/2 transform -translate-x-1/2 flex items-center justify-center z-10">
    <img
      src="/images/sala.png"
      alt="Botella"
      className="h-[350px] object-contain"
    />
  </div>

  {/* Columna derecha - fondo claro */}
  <div className="w-1/2 bg-[#FBF4F4] text-black p-10 flex flex-col justify-center">
    <h2 className="text-2xl font-semibold mb-4">Vinos Tintos</h2>

    <div className="flex justify-between items-center text-lg font-medium">
      <p>Ron Añejo</p>
      <p>s/12,00</p>
    </div>
    <p className="text-base mb-3">Un ron premium envejecido en barricas de roble, con notas de vainilla y especias.</p>

    <div className="flex justify-between items-center text-lg font-medium">
      <p>Whisky Escocés</p>
      <p>s/15,00</p>
    </div>
    <p className="text-base mb-3">Whisky de malta envejecido con un perfil ahumado y toques de caramelo.</p>

    <div className="flex justify-between items-center text-lg font-medium">
      <p>Vodka Premium</p>
      <p>s/10,00</p>
    </div>
    <p className="text-base">Vodka ultra filtrado para una suavidad y pureza excepcionales.</p>
  </div>
</section>

    </div>
  );
}
