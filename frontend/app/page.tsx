//page.tsx
"use client";

import { useRef, useEffect, useState } from "react";
import "../styles/globals.css";
import CarruselBebidas, { BebidaItem } from "@/components/CarruselBebidas";
import Footer from "@/components/Footer";
import CategoryCard from "@/components/CategoryCard/CategoryCard";
import Hero from "@/components/Hero";
import { ProductoCardProps } from "@/components/ProductoCard";
import useFetchProductos from "@/hooks/useFetchProductos";
import ProductSection from "@/components/ProductSection";
import SingleBannerSection from "@/components/SingleBannerSection";


const transformarPromociones = (data: any[]): ProductoCardProps[] => {
  // Verificar que data es un array
  if (!Array.isArray(data)) return [];

  return data.map(promocion => {
    const precioActual = Number(promocion.precio) || 0;
    const descuento = promocion.descuento ?? 0;
    const precioAntiguo = descuento
      ? +(precioActual / (1 - descuento / 100)).toFixed(2)
      : undefined;

    // Construir descripción combinada
    let descripcion = promocion.descripcion || "";

    const imagenValida =
      promocion.imagen && promocion.imagen.trim() !== ""
        ? promocion.imagen
        : "/images/card-pizza.jpg";

    return {
      id: promocion.id,
      titulo: promocion.nombre,
      descripcion: descripcion,
      precio: precioActual,
      imagen: imagenValida,
      precioAntiguo,
      descuento,
      ruta: 'promos', 
      mostrarPersonalizar: false, 
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
      ruta: 'calzone'
    };
  });
};


const transformarPastas = (data: any[]): ProductoCardProps[] => {
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
      ruta: 'pastas'
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

    const descripcion =
      producto.unicos?.[0]?.tamanios_sabor?.sabor?.descripcion ??
      producto.combinaciones?.[0]?.tamanio_sabor?.sabor?.descripcion ??
      "";

    return {
      id: producto.id,
      titulo: producto.nombre,
      descripcion,
      precio: precioActual,
      imagen: imagenValida,
      ruta: 'pizzas'
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
    "http://localhost:4000/api/productos/pastas",
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

  const [adicionales, setAdicionales] = useState<any[]>([]);
  const [loadingAdicionales, setLoadingAdicionales] = useState(true);

  useEffect(() => {
    const fetchAdicionales = async () => {
      try {
        const response = await fetch('http://localhost:4000/api/productos/adicionales');
        const data = await response.json();
        setAdicionales(data.filter((item: any) => item.destacado));
      } catch (error) {
        console.error('Error fetching adicionales:', error);
      } finally {
        setLoadingAdicionales(false);
      }
    };

    fetchAdicionales();
  }, []);

  const [bebidas, setBebidas] = useState<BebidaItem[]>([]);
  const [loadingBebidas, setLoadingBebidas] = useState(true);

  useEffect(() => {
    const fetchBebidas = async () => {
      try {
        const response = await fetch('http://localhost:4000/api/productos/bebidas');
        const data = await response.json();
        
        // Filtramos solo las bebidas destacadas y las transformamos al formato BebidaItem
        const bebidasTransformadas = data
          .filter((item: any) => item.destacado)
          .map((item: any) => ({
            titulo: item.nombre,
            descripcion: item.descripcion || "Refrescante bebida para acompañar tus platillos",
            imagen: item.imagen || "/images/card-bebida.jpg",
            precio: Number(item.precio) || 0
          }));
        
        setBebidas(bebidasTransformadas);
      } catch (error) {
        console.error('Error fetching bebidas:', error);
      } finally {
        setLoadingBebidas(false);
      }
    };

    fetchBebidas();
  }, []);

  return (
    <div className="min-h-screen font-['Inter'] bg-gradient-to-br from-red-50/30 via-white to-red-50/20">

      {/* SECCION DE HERO */}
      <Hero />

      {/* MENUCARRUSEL -> CATEGORYCARD */}
      <section className="py-8 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-8">
            <h2 className="text-2xl font-bold text-gray-800 font-['Playfair_Display'] mb-2">
              Nuestro Menú
            </h2>
            <p className="text-sm text-gray-600 font-['Open_Sans']">
              Descubre todas nuestras especialidades
            </p>
          </div>
          <div className="flex flex-wrap justify-center gap-4">
            {categories.map((cat, i) => (
              <CategoryCard
                key={i}
                title={cat.title}
                image={cat.image}
                link={cat.link}
              />
            ))}
          </div>
        </div>
      </section>

      {/* SECCION DE PRODUCTOS DESTACADOS */}
      <section className="py-4">
        <ProductSection
          title="🔥 Promociones Especiales"
          description="Una promoción se disfruta mejor en familia y amigos"
          link="/menu/promos"
          productos={productosPromocion}
          scrollRef={promoRef}
          onScrollLeft={() => scrollPizzas("left")}
          onScrollRight={() => scrollPizzas("right")}
        />
      </section>

      <section className="py-4">
        <ProductSection
          title="🍕 Nuestras Pizzas"
          description="Las pizzas más deliciosas, horneadas al estilo tradicional"
          link="/menu/pizzas"
          productos={productosPizzas}
          scrollRef={pizzasRef}
          onScrollLeft={() => scrollPizzasSection("left")}
          onScrollRight={() => scrollPizzasSection("right")}
        />
      </section>

      <section className="py-4">
        <ProductSection
          title="🥟 Calzones Artesanales"
          description="Disfruta de un delicioso calzone con ingredientes frescos y variados"
          link="/menu/calzone"
          productos={productosCalzone}
          scrollRef={calzoneRef}
          onScrollLeft={() => scrollCalzone("left")}
          onScrollRight={() => scrollCalzone("right")}
        />
      </section>

      <section className="py-4">
        <ProductSection
          title="🍝 Pastas Caseras"
          description="Prueba nuestras pastas caseras con salsa tradicional, ¡te encantarán!"
          link="/menu/pastas"
          productos={productosPastas}
          scrollRef={pastasRef}
          onScrollLeft={() => scrollPastas("left")}
          onScrollRight={() => scrollPastas("right")}
        />
      </section>

      {/* SECCIÓN DE ADICIONALES CON BANNER */}
      <section className="py-8 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-8">
            <h2 className="text-2xl font-bold text-gray-800 font-['Playfair_Display'] mb-2">
              🧄 Adicionales
            </h2>
            <p className="text-sm text-gray-600 font-['Open_Sans']">
              Complementa tu experiencia con nuestros extras especiales
            </p>
          </div>
          {!loadingAdicionales && <SingleBannerSection items={adicionales} />}
        </div>
      </section>

      {/* CARRUSEL DE BEBIDAS */}
      <section className="py-8 px-4 bg-gradient-to-r from-red-50/50 to-red-50/50">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-8">
            <h2 className="text-2xl font-bold text-gray-800 font-['Playfair_Display'] mb-2">
              🥤 Bebidas Refrescantes
            </h2>
            <p className="text-sm text-gray-600 font-['Open_Sans']">
              El complemento perfecto para tus platillos favoritos
            </p>
          </div>
          
          {loadingBebidas ? (
            <div className="flex justify-center items-center h-64">
              <div className="flex flex-col items-center gap-3">
                <div className="w-8 h-8 border-4 border-red-200 border-t-red-600 rounded-full animate-spin"></div>
                <p className="text-sm text-gray-600 font-['Open_Sans']">Cargando bebidas...</p>
              </div>
            </div>
          ) : bebidas.length > 0 ? (
            <CarruselBebidas items={bebidas} />
          ) : (
            <div className="flex justify-center items-center h-64">
              <div className="text-center">
                <div className="text-4xl mb-3">🥤</div>
                <p className="text-sm text-gray-600 font-['Open_Sans']">No hay bebidas disponibles</p>
              </div>
            </div>
          )}
        </div>
      </section>

      {/* BOTON DE WHATSAPP 
      <WhatsAppButton /> */}

      {/* FOOTER */}
      <div className="mt-8">
        <Footer />
      </div>
    </div>
  );
}