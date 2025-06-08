"use client";

import { useRef, useEffect, useState } from "react";
import "../styles/globals.css";
import CarruselBebidas, { BebidaItem } from "@/components/CarruselBebidas";
import Footer from "@/components/Footer";
import CategoryCard from "@/components/CategoryCard/CategoryCard";
import Hero from "@/components/Hero";
import { ProductoCardProps } from "@/components/ProductoCard";
import WhatsAppButton from "@/components/WhatsAppButton";
import useFetchProductos from "@/hooks/useFetchProductos";
import ProductSection from "@/components/ProductSection";
import BannerSection from "@/components/BannerSection";


const transformarPromociones = (data: any[]): ProductoCardProps[] => {
  const destacadas = data.filter(promocion => promocion.destacado === true);

  return destacadas.map(promocion => {
    const precioActual = Number(promocion.precio) || 0;
    const descuento = promocion.descuento ?? 0;
    const precioAntiguo = descuento
      ? +(precioActual / (1 - descuento / 100)).toFixed(2)
      : undefined;

    const imagenValida =
      promocion.imagen && promocion.imagen.trim() !== ""
        ? promocion.imagen
        : "/images/card-pizza.jpg";

    return {
      id: promocion.id,
      titulo: promocion.nombre,
      descripcion: promocion.descripcion,
      precio: precioActual,
      imagen: imagenValida,
      precioAntiguo,
      descuento,
    };
  });
};


const transformarCalzones = (data: any[]): ProductoCardProps[] => {
  const filtrados = data.filter(producto => producto.destacado === true);

  return filtrados.map(producto => {
    const precioActual = Number(producto.precio) || 0;
    const imagenValida =
      producto.imagen && producto.imagen.trim() !== ""
        ? producto.imagen
        : "/images/card-calzone.jpg";

    return {
      id: producto.id,
      titulo: producto.nombre,
      descripcion:
        producto.unicos?.[0]?.tamanios_sabor?.sabor?.descripcion ?? "",
      precio: precioActual,
      imagen: imagenValida,
    };
  });
};


const transformarPastas = (data: any[]): ProductoCardProps[] => {
  return data
    .filter(producto => producto.categoria === "pasta")
    .map(producto => {
      const precioActual = Number(producto.precio) || 0;
      const imagenValida = producto.imagen?.trim()
        ? producto.imagen
        : "/images/card-pasta.jpeg";

      return {
        id: producto.id,
        titulo: producto.nombre,
        descripcion: producto.descripcion,
        precio: precioActual,
        imagen: imagenValida,
      };
    });
};


const transformarPizzas = (data: any[]): ProductoCardProps[] => {
  const filtrados = data.filter(producto => producto.destacado === true);

  return filtrados.map(producto => {
    const precioActual = Number(producto.precio) || 0;
    const imagenValida =
      producto.imagen && producto.imagen.trim() !== ""
        ? producto.imagen
        : "images/card-pizza.jpg";

    return {
      id: producto.id,
      titulo: producto.nombre,
      descripcion:
        producto.unicos?.[0]?.tamanios_sabor?.sabor?.descripcion ?? "",
      precio: precioActual,
      imagen: imagenValida,
    };
  });
};


export default function Home() {

  // INFORMACION PARA CATEGORIAS
  const categories = [
    { title: "Pizzas", image: "/images/category-pizza.png", link: "/menu/pizzas" },
    { title: "Calzone", image: "/images/category-calzone.png", link: "/menu/calzone" },
    { title: "Pastas", image: "/images/category-pasta.png", link: "/menu/pastas" },
    { title: "Adicionales", image: "/images/category-adicional.png", link: "/menu/adicionales" },
    { title: "Promociones", image: "/images/category-promocion.png", link: "/menu/promos" },
  ];

  // INFORMACION PARA PRODUCTOS
  const promoRef = useRef<HTMLDivElement>(null);

  const calzoneRef = useRef<HTMLDivElement>(null);

  const pastasRef = useRef<HTMLDivElement>(null);

  const pizzasRef = useRef<HTMLDivElement>(null);

  const { productos: productosPromocion } = useFetchProductos(
    "http://localhost:4000/api/promociones",
    transformarPromociones
  );

  const { productos: productosCalzone } = useFetchProductos(
    "http://localhost:4000/api/productos/calzones",
    transformarCalzones
  );

  const { productos: productosPastas } = useFetchProductos(
    "http://localhost:4000/api/productos/pizzas",
    transformarPastas
  );

  const { productos: productosPizzas } = useFetchProductos(
    "http://localhost:4000/api/productos/pizzas",
    transformarPizzas
  );

  const scrollPizzasSection = (direction: "left" | "right") => {
    if (pizzasRef.current) {
      const scrollAmount = pizzasRef.current.offsetWidth * 0.8;
      pizzasRef.current.scrollBy({
        left: direction === "left" ? -scrollAmount : scrollAmount,
        behavior: "smooth",
      });
    }
  };


  // FUNCIONES PARA DESPLAZAR LOS CARRUSELES
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

  const banners = [
    {
      title: "Jugo de Frutas Tropicales",
      subtitle: "Frescura 100% Natural",
      description: "Una mezcla deliciosa de frutas exóticas, perfecta para mantenerte hidratado y saludable.",
      images,
      linkLeft: "/desayunos/bebidascalientes",
      linkRight: "/desayunos/bebidascalientes",
    },
    {
      title: "Jugo de Naranja y Zanahoria",
      subtitle: "Energía para tu Día",
      description: "El poder de la vitamina C y betacarotenos en un solo sorbo. Ideal para comenzar tu jornada.",
      images,
      linkLeft: "/desayunos/jugos",
      linkRight: "/desayunos/jugos",
    },
    {
      title: "Jugo Verde Detox",
      subtitle: "Limpieza y Vitalidad",
      description: "Una mezcla saludable de manzana, espinaca y pepino. Ideal para revitalizar tu cuerpo.",
      images,
      linkLeft: "/desayunos/sandwiches",
      linkRight: "/desayunos/sandwiches",
    },
  ];

  // Ejemplo de datos para el carrusel de bebidas:
  const bebidas: BebidaItem[] = [
    {
      titulo: "Vodka Premium",
      descripcion: "Un vodka suave y refinado con notas cristalinas.",
      imagen: "/images/Cbodka.png",
      precio: 150.0,
    },
    {
      titulo: "Gaseosas Variadas",
      descripcion: "Refrescos perfectos para acompañar cualquier momento.",
      imagen: "/images/Gaseosas.png",
      precio: 25.0,
    },
    {
      titulo: "Cóctel Tropical",
      descripcion: "Mezcla exótica con frutas frescas y un toque dulce.",
      imagen: "/images/Cbodka.png",
      precio: 85.0,
    },
  ];

  return (
    <div className="min-h-screen font-[family-name:var(--font-geist-sans)] bg-white">

      {/* SECCION DE HERO */}
      <Hero />

      {/* MENUCARRUSEL -> CATEGORYCARD */}
      <div className="flex flex-wrap justify-center gap-4 p-4">
        {categories.map((cat, i) => (
          <CategoryCard
            key={i}
            title={cat.title}
            image={cat.image}
            link={cat.link}
          />
        ))}
      </div>

      {/* SECCION DE PRODUCTOS DESTACADOS */}
      <ProductSection
        title="Promociones"
        description="Una promoción se disfruta mejor en familia y amigos"
        link="/menu/promos"
        productos={productosPromocion}
        scrollRef={promoRef}
        onScrollLeft={() => scrollPizzas("left")}
        onScrollRight={() => scrollPizzas("right")}
      />

      <ProductSection
        title="Pizzas"
        description="Las pizzas más deliciosas, horneadas al estilo tradicional"
        link="/menu/pizzas"
        productos={productosPizzas}
        scrollRef={pizzasRef}
        onScrollLeft={() => scrollPizzasSection("left")}
        onScrollRight={() => scrollPizzasSection("right")}
      />

      <ProductSection
        title="Calzone"
        description="Disfruta de un delicioso calzone con ingredientes frescos y variados"
        link="/menu/calzone"
        productos={productosCalzone}
        scrollRef={calzoneRef}
        onScrollLeft={() => scrollCalzone("left")}
        onScrollRight={() => scrollCalzone("right")}
      />

      <ProductSection
        title="Pastas"
        description="Prueba nuestras pastas caseras con salsa tradicional, ¡te encantarán!"
        link="/menu/pastas"
        productos={productosPastas}
        scrollRef={pastasRef}
        onScrollLeft={() => scrollPastas("left")}
        onScrollRight={() => scrollPastas("right")}
      />


      {/* SECCION DE BANNERS DE JUGOS */}
      <BannerSection banners={banners} />

      {/* BOTON DE WHATSAPP */}
      <WhatsAppButton />

      {/* CARRUSEL DE BEBIDAS */}
      <section className="mt-10 px-4">
        <h2 className="text-2xl font-bold text-center mb-12 text-gray-900">
          Carrusel de Bebidas
        </h2>
        <CarruselBebidas items={bebidas} />
      </section>

      {/* FOOTER */}
      <div>
        <Footer />
      </div>
    </div>
  );
}
