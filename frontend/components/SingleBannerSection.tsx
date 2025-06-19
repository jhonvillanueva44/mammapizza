'use client';

import { useState, useEffect, useRef } from 'react';

interface BannerData {
  id: number;
  nombre: string;
  precio: string;
  imagen: string;
  descripcion: string;
}

interface SingleBannerSectionProps {
  items: BannerData[];
}

export default function SingleBannerSection({ items }: SingleBannerSectionProps) {
  const [currentTextIndex, setCurrentTextIndex] = useState(0);
  const containerRef = useRef<HTMLDivElement>(null);
  const animationRef = useRef<number | null>(null);
  const positionRef = useRef(0);
  
  // Configuración fija para las imágenes
  const imageWidth = 280;  // Ancho fijo en píxeles
  const imageHeight = 220; // Alto fijo en píxeles
  const speed = 1.5;       // Velocidad de desplazamiento

  // Duplicamos los items para el efecto infinito
  const duplicatedItems = [...items, ...items];

  // Efecto para el movimiento continuo tipo cinta de película
  useEffect(() => {
    if (!containerRef.current || items.length === 0) return;

    const animate = () => {
      positionRef.current -= speed;
      
      // Reiniciamos la posición cuando hemos recorrido el ancho de todos los items
      if (-positionRef.current >= imageWidth * items.length) {
        positionRef.current += imageWidth * items.length;
      }

      if (containerRef.current) {
        containerRef.current.style.transform = `translateX(${positionRef.current}px)`;
      }

      animationRef.current = requestAnimationFrame(animate);
    };

    animationRef.current = requestAnimationFrame(animate);

    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [items.length, imageWidth]);

  // Efecto para el cambio de textos más lento
  useEffect(() => {
    if (items.length > 1) {
      const interval = setInterval(() => {
        setCurrentTextIndex((prev) => (prev + 1) % items.length);
      }, 8000); // Cambia cada 8 segundos
      
      return () => clearInterval(interval);
    }
  }, [items.length]);

  if (!items || items.length === 0) {
    return <div className="text-center py-12">No hay elementos para mostrar</div>;
  }

  const currentItem = items[currentTextIndex];

  return (
    <a 
      href={'/menu/adicionales'} 
      className="flex justify-center items-center py-10 px-4 cursor-pointer block"
    >
      <div className="flex flex-col md:flex-row w-full max-w-6xl h-[300px] overflow-hidden rounded-xl shadow-sm">
        {/* CINTA DE PELÍCULA CON IMÁGENES */}
        <div
          className={`
            w-full md:w-[65%] 
            bg-[#0C1011] 
            overflow-hidden 
            relative 
            border-l-4 md:border-l-4 md:rounded-l-xl border-red-600
            md:rounded-tr-none rounded-t-xl
            flex items-center
          `}
        >
          <div className="h-full w-full overflow-hidden">
            <div 
              ref={containerRef}
              className="flex h-full items-center will-change-transform absolute"
              style={{ width: `${duplicatedItems.length * imageWidth}px` }}
            >
              {duplicatedItems.map((item, index) => (
                <div 
                  key={`${item.id}-${index}`} 
                  className="flex-shrink-0 flex items-center justify-center"
                  style={{ 
                    width: `${imageWidth}px`,
                    height: `${imageHeight}px`,
                    padding: '0 8px'
                  }}
                >
                  <div 
                    className="relative h-full w-full flex items-center justify-center"
                    style={{
                      borderRadius: '8px',
                      border: '2px solid #EF4444',
                      boxShadow: '0 0 8px rgba(239, 68, 68, 0.7)',
                      overflow: 'hidden'
                    }}
                  >
                    <img
                      src={item.imagen}
                      alt={item.nombre}
                      className="absolute h-full w-full object-cover select-none"
                      style={{
                        objectFit: 'cover',
                        padding: '4px'
                      }}
                      draggable={false}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* SECCIÓN DE TEXTO */}
        <div
          className={`
            w-full md:w-[35%] 
            bg-gray-50 
            flex items-center 
            border-r-4 md:border-r-4 border-gray-700
            md:rounded-r-xl rounded-b-xl md:rounded-tl-none
          `}
        >
          <div className="px-6 py-4 flex flex-col gap-2 text-center md:text-left">
            <h2 className="text-2xl font-bold text-red-700">{currentItem.nombre}</h2>
            <h4 className="text-lg font-semibold text-red-600">S/ {currentItem.precio}</h4>
            <p className="text-sm text-gray-700">{currentItem.descripcion}</p>
          </div>
        </div>
      </div>
    </a>
  );
}