'use client';

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

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
  const [isAnimating, setIsAnimating] = useState(false);
  const router = useRouter();

  useEffect(() => {
    if (items.length <= 1) return;

    const interval = setInterval(() => {
      nextSlide();
    }, 5000);

    return () => clearInterval(interval);
  }, [current, items.length]);

  const prevSlide = () => {
    if (isAnimating) return;
    setIsAnimating(true);
    setCurrent((prev) => (prev - 1 + items.length) % items.length);
    setTimeout(() => setIsAnimating(false), 500);
  };

  const nextSlide = () => {
    if (isAnimating) return;
    setIsAnimating(true);
    setCurrent((prev) => (prev + 1) % items.length);
    setTimeout(() => setIsAnimating(false), 500);
  };

  const goToSlide = (index: number) => {
    if (isAnimating || index === current) return;
    setIsAnimating(true);
    setCurrent(index);
    setTimeout(() => setIsAnimating(false), 500);
  };

  const handleVerMas = () => {
    router.push('/bebidas');
  };

  if (items.length === 0) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="text-center">
          <div className="text-5xl mb-3">🥤</div>
          <p className="text-sm text-gray-600 font-['Open_Sans']">No hay bebidas disponibles </p>
        </div>
      </div>
    );
  }

  const prevIndex = (current - 1 + items.length) % items.length;
  const nextIndex = (current + 1) % items.length;

  const renderCard = (index: number, position: "prev" | "current" | "next") => {
    const item = items[index];

    const positionStyles = {
      prev: {
        transform: "translateX(-20px) scale(0.85)",
        opacity: "0.6",
        zIndex: "1"
      },
      current: {
        transform: "translateX(0) scale(1)",
        opacity: "1",
        zIndex: "10"
      },
      next: {
        transform: "translateX(20px) scale(0.85)",
        opacity: "0.6",
        zIndex: "1"
      }
    };

    const isActive = position === "current";

    return (
      <div
        key={`${index}-${position}`}
        className={`
          relative transition-all duration-500 ease-out cursor-pointer
          ${isActive ? 'w-80 lg:w-96' : 'w-72 lg:w-80'}
        `}
        style={positionStyles[position]}
        onClick={() => !isActive && goToSlide(index)}
      >
        <div className={`
          relative overflow-hidden rounded-2xl bg-white shadow-lg border border-red-600
          ${isActive ? 'shadow-2xl border-red-700' : 'hover:shadow-xl'}
          transition-all duration-300 
        `}>

          {/* Imagen */}
          <div className="relative overflow-hidden">
            <img
              src={item.imagen}
              alt={item.titulo}
              className={`
                w-full object-cover transition-transform duration-300
                ${isActive ? 'h-56 lg:h-64 hover:scale-105' : 'h-48 lg:h-52'}
              `}
              loading="lazy"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent"></div>
          </div>

          {/* Contenido */}
          <div className={`p-6 ${isActive ? 'pb-8' : 'pb-6'}`}>
            <div className="space-y-3">
              {/* Título */}
              <h3 className={`
                font-bold text-gray-800 font-['Playfair_Display'] line-clamp-2
                ${isActive ? 'text-2xl lg:text-3xl' : 'text-xl lg:text-2xl'}
              `}>
                {item.titulo}
              </h3>

              {/* Descripción */}
              <p className={`
                text-gray-600 font-['Open_Sans'] line-clamp-2
                ${isActive ? 'text-base' : 'text-sm'}
              `}>
                {item.descripcion}
              </p>

              {/* Precio */}
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className={`
                    font-bold text-red-700 font-['Inter']
                    ${isActive ? 'text-2xl' : 'text-xl'}
                  `}>
                    S/ {item.precio.toFixed(2)}
                  </span>
                  {isActive && (
                    <span className="text-sm text-gray-500 font-['Open_Sans']">
                      Precio especial
                    </span>
                  )}
                </div>
              </div>

              {/* Botón Ver Más - Solo en la card activa */}
              {isActive && (
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    handleVerMas();
                  }}
                  className="w-full mt-4 bg-gradient-to-r from-red-600 to-red-600 hover:from-red-700 hover:to-red-700 text-white py-3 px-6 rounded-xl font-medium font-['Open_Sans'] transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl cursor-pointer"
                >
                  Ver todas las bebidas
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="w-full max-w-7xl mx-auto">
      {/* Carrusel principal */}
      <div className="relative flex justify-center items-center gap-4 lg:gap-8 px-4 mb-8">
        {/* Botón anterior */}
        <button
          onClick={prevSlide}
          disabled={isAnimating}
          className="absolute left-0 lg:left-4 z-20 p-3 rounded-full bg-white/90 hover:bg-red-700 shadow-lg hover:shadow-xl border border-red-600 text-red-600 hover:text-white transition-all duration-300 transform hover:scale-110 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
          aria-label="Bebida anterior"
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
        </button>

        {/* Cards del carrusel */}
        <div className="flex items-center justify-center gap-4 lg:gap-8 overflow-hidden">
          {items.length > 1 && (
            <div className="hidden lg:block">
              {renderCard(prevIndex, "prev")}
            </div>
          )}

          <div className="flex-shrink-0">
            {renderCard(current, "current")}
          </div>

          {items.length > 1 && (
            <div className="hidden lg:block">
              {renderCard(nextIndex, "next")}
            </div>
          )}
        </div>

        {/* Botón siguiente */}
        <button
          onClick={nextSlide}
          disabled={isAnimating}
          className="absolute right-0 lg:right-4 z-20 p-3 rounded-full bg-white/90 hover:bg-red-700 shadow-lg hover:shadow-xl border border-red-600 text-red-600 hover:text-white transition-all duration-300 transform hover:scale-110 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
          aria-label="Siguiente bebida"
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
        </button>
      </div>

      {/* Indicadores de posición */}
      {items.length > 1 && (
        <div className="flex justify-center gap-2 mb-4">
          {items.map((_, index) => (
            <button
              key={index}
              onClick={() => goToSlide(index)}
              className={`
                h-2 rounded-full transition-all duration-300
                ${index === current
                  ? 'w-8 bg-red-600'
                  : 'w-2 bg-gray-300 hover:bg-gray-400 cursor-pointer'
                }
              `}
              aria-label={`Ir a bebida ${index + 1}`}
            />
          ))}
        </div>
      )}

      {/* Información adicional */}
      <div className="text-center px-4">
        {items.length > 1 && (
          <p className="text-xs text-gray-500 font-['Open_Sans'] mt-1">
          </p>
        )}
      </div>
    </div>
  );
}
