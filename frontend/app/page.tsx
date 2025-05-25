"use client";

import { useRef, useEffect, useState } from "react";
import "../styles/globals.css";
import Carousel from "@/components/CarruselBebidas";
import Footer from "@/components/Footer";
import CategoryCard from "@/components/CategoryCard/CategoryCard";
import Hero from "@/components/Hero";
import ProductoCard from "@/components/ProductoCard";
import BannerCard from "@/components/BannerCard/BannerCard";

export default function Home() {

  // INFORMACION PARA CATEGORIAS
  const categories = [
    { title: "Pizzas", image: "/images/category-pizza.png" },
    { title: "Calzone", image: "/images/category-calzone.png" },
    { title: "Pastas", image: "/images/category-pasta.png" },
    { title: "Adicionales", image: "/images/category-adicional.png" },
    { title: "Promociones", image: "/images/category-promocion.png" },
  ];

  // INFORMACION PARA PRODUCTOS
const [productosPromocion, setProductosPromocion] = useState([]);

  useEffect(() => {
    const fetchProductos = async () => {
      try {
        const response = await fetch("http://localhost:4000/api/productos/promociones");
        const data = await response.json();

        const productosFiltrados = data
          .map((producto: any) => {

        const impuesto = (producto.impuesto) || 0;
        const precio = parseFloat(producto.precio) || 0;
        const descuento = parseFloat(producto.impuesto) || 0;
        const precioAntiguo = descuento > 0 ? parseFloat((precio / (1 - descuento / 100)).toFixed(2)) : undefined;


       return {
         titulo: producto.nombre || "Producto sin nombre",
        descripcion: producto.descripcion || "",
        precio: precio,
        precioAntiguo: precioAntiguo,
        descuento: descuento,
        imagen: typeof producto.imagen === "string" ? producto.imagen : "",
       };
     });


        setProductosPromocion(productosFiltrados);
      } catch (error) {
        console.error("Error al obtener productos:", error);
      }
    };

    fetchProductos();
  }, []);

  // INFORMACION PARA CALZONE
  const productosCalzone = Array.from({ length: 10 }).map((_, i) => ({
    titulo: `Calzone Especial ${i + 1}`,
    descripcion: "Calzone relleno con ingredientes frescos.",
    precio: 75.99,
    precioAntiguo: 85.99,
    descuento: 12,
    imagen: "images/card-calzone.jpg",
  }));

  // INFORMACION PARA PASTAS
  const productosPastas = Array.from({ length: 8 }).map((_, i) => ({
    titulo: `Pasta Especial ${i + 1}`,
    descripcion: "Pasta casera con salsa tradicional.",
    precio: 65.99,
    imagen: "images/card-pasta.jpeg",
  }));

  // SCROLL PARA EL CARRUSEL DE CARDS
  const promoRef = useRef<HTMLDivElement>(null);
  const calzoneRef = useRef<HTMLDivElement>(null);
  const pastasRef = useRef<HTMLDivElement>(null);

  const scrollPizzas = (direction: "left" | "right") => {
    if (promoRef.current) {
      const scrollAmount = promoRef.current.offsetWidth * 0.8;
      promoRef.current.scrollBy({
        left: direction === "left" ? -scrollAmount : scrollAmount,
        behavior: "smooth",
      });
    }
  };

  const scrollCalzone = (direction: "left" | "right") => {
    if (calzoneRef.current) {
      const scrollAmount = calzoneRef.current.offsetWidth * 0.8;
      calzoneRef.current.scrollBy({
        left: direction === "left" ? -scrollAmount : scrollAmount,
        behavior: "smooth",
      });
    }
  };

  const scrollPastas = (direction: "left" | "right") => {
    if (pastasRef.current) {
      const scrollAmount = pastasRef.current.offsetWidth * 0.8;
      pastasRef.current.scrollBy({
        left: direction === "left" ? -scrollAmount : scrollAmount,
        behavior: "smooth",
      });
    }
  };

  // INFORMACION PARA BANNER CARD
  const images = [
    '/images/category-calzone.png',
    '/images/category-calzone.png',
    '/images/category-calzone.png',
  ];

  return (
    <div className="min-h-screen font-[family-name:var(--font-geist-sans)] bg-white">

      {/* SECCION DE HERO */}
      <Hero />

      {/* MENUCARRUSEL -> CATEGORYCARD */}
      <div className="flex flex-wrap justify-center gap-4 p-4">
        {categories.map((cat, i) => (
          <CategoryCard key={i} title={cat.title} image={cat.image} />
        ))}
      </div>

      {/* PROMOCIONES */}
      <section className="w-full py-10 bg-white relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center mb-6 flex-wrap sm:flex-nowrap">
            <div className="max-w-[70%] sm:max-w-none">
              <h1 className="text-xl sm:text-3xl font-bold">Promociones</h1>
              <p className="text-xs sm:text-base break-words">
                Una promoción se disfruta mejor en familia y amigos
              </p>
            </div>
            <button className="text-sm sm:text-base underline text-red-600 whitespace-nowrap mt-2 sm:mt-0">
              Ver más
            </button>
          </div>


          <div className="relative">

            <button
              onClick={() => scrollPizzas("left")}
              className="hidden sm:flex absolute -left-4 top-1/2 -translate-y-1/2 z-30 bg-gray-200 border border-gray-300 rounded-full p-3 hover:bg-red-600 hover:text-white transition"
            >
              ◀
            </button>

            <div
              ref={promoRef}
              className="flex gap-4 flex-nowrap overflow-x-auto sm:overflow-x-hidden scrollbar-hide"
            >
              {productosPromocion.map((producto, index) => (
                <div key={index} className="flex-shrink-0 lg:w-64 sm:w-48">
                  {/* <ProductoCard {...producto} /> */}
                </div>
              ))}
            </div>

            <button
              onClick={() => scrollPizzas("right")}
              className="hidden sm:flex absolute -right-4 top-1/2 -translate-y-1/2 z-30 bg-gray-200 border border-gray-300 rounded-full p-3 hover:bg-red-600 hover:text-white transition"
            >
              ▶
            </button>
          </div>
        </div>
      </section>

      {/* SECCION CALZONE */}
      <section className="w-full py-10 bg-white relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center mb-6 flex-wrap sm:flex-nowrap">
            <div className="max-w-[70%] sm:max-w-none">
              <h1 className="text-xl sm:text-3xl font-bold">Calzone</h1>
              <p className="text-xs sm:text-base break-words">
                Disfruta de un delicioso calzone con ingredientes frescos y variados
              </p>
            </div>
            <button className="text-sm sm:text-base underline text-red-600 whitespace-nowrap mt-2 sm:mt-0">
              Ver más
            </button>
          </div>


          <div className="relative">
            <button
              onClick={() => scrollCalzone("left")}
              className="hidden sm:flex absolute -left-4 top-1/2 -translate-y-1/2 z-30 bg-gray-200 border border-gray-300 rounded-full p-3 hover:bg-red-600 hover:text-white transition"
              aria-label="Desplazar calzone izquierda"
            >
              ◀
            </button>

            <div
              ref={calzoneRef}
              className="flex gap-4 flex-nowrap overflow-x-auto sm:overflow-x-hidden scrollbar-hide"
            >
              {productosCalzone.map((producto, index) => (
                <div key={index} className="flex-shrink-0 lg:w-64 sm:w-48">
                  <ProductoCard {...producto} />
                </div>
              ))}
            </div>

            <button
              onClick={() => scrollCalzone("right")}
              className="hidden sm:flex absolute -right-4 top-1/2 -translate-y-1/2 z-30 bg-gray-200 border border-gray-300 rounded-full p-3 hover:bg-red-600 hover:text-white transition"
              aria-label="Desplazar calzone derecha"
            >
              ▶
            </button>
          </div>
        </div>
      </section>

      {/* SECCION PASTAS */}
      <section className="w-full py-10 bg-white relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center mb-6 flex-wrap sm:flex-nowrap">
            <div className="max-w-[70%] sm:max-w-none">
              <h1 className="text-xl sm:text-3xl font-bold">Pastas</h1>
              <p className="text-xs sm:text-base break-words">
                Prueba nuestras pastas caseras con salsa tradicional, ¡te encantarán!
              </p>
            </div>
            <button className="text-sm sm:text-base underline text-red-600 whitespace-nowrap mt-2 sm:mt-0">
              Ver más
            </button>
          </div>

          <div className="relative">
            <button
              onClick={() => scrollPastas("left")}
              className="hidden sm:flex absolute -left-4 top-1/2 -translate-y-1/2 z-30 bg-gray-200 border border-gray-300 rounded-full p-3 hover:bg-red-600 hover:text-white transition"
              aria-label="Desplazar pastas izquierda"
            >
              ◀
            </button>

            <div
              ref={pastasRef}
              className="flex gap-4 flex-nowrap overflow-x-auto sm:overflow-x-hidden scrollbar-hide"
            >
              {productosPastas.map((producto, index) => (
                <div key={index} className="flex-shrink-0 lg:w-64 sm:w-48">
                  <ProductoCard {...producto} />
                </div>
              ))}
            </div>

            <button
              onClick={() => scrollPastas("right")}
              className="hidden sm:flex absolute -right-4 top-1/2 -translate-y-1/2 z-30 bg-gray-200 border border-gray-300 rounded-full p-3 hover:bg-red-600 hover:text-white transition"
              aria-label="Desplazar pastas derecha"
            >
              ▶
            </button>
          </div>
        </div>
      </section>

      {/* SECCION DE BANNERS DE JUGOS */}
      <section className="flex flex-col gap-8 items-center w-full py-12 bg-white">
        <BannerCard
          images={images}
          title="Jugo de Frutas Tropicales"
          subtitle="Frescura 100% Natural"
          description="Una mezcla deliciosa de frutas exóticas, perfecta para mantenerte hidratado y saludable."
          linkLeft="/jugos/tropical"
          linkRight="/jugos/tropical/info"
        />
        <BannerCard
          images={images}
          title="Jugo de Naranja y Zanahoria"
          subtitle="Energía para tu Día"
          description="El poder de la vitamina C y betacarotenos en un solo sorbo. Ideal para comenzar tu jornada."
          linkLeft="/jugos/naranja-zanahoria"
          linkRight="/jugos/naranja-zanahoria/info"
        />
        <BannerCard
          images={images}
          title="Jugo Verde Detox"
          subtitle="Limpieza y Vitalidad"
          description="Una mezcla saludable de manzana, espinaca y pepino. Ideal para revitalizar tu cuerpo."
          linkLeft="/jugos/detox"
          linkRight="/jugos/detox/info"
        />
      </section>

      {/* CARRUSEL DE BEBIDAS 
      <div className="mt-10">
        <Carousel />
      </div> */}

      {/* FOOTER */}
      <div>
        <Footer />
      </div>
    </div>
  );
}
