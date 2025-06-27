//single-banner-section.tsx
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
  
  const imageWidth = 280;
  const imageHeight = 220;
  const speed = 1.5;

  const duplicatedItems = [...items, ...items];

  useEffect(() => {
    if (!containerRef.current || items.length === 0) return;

    const animate = () => {
      positionRef.current -= speed;
      
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

  useEffect(() => {
    if (items.length > 1) {
      const interval = setInterval(() => {
        setCurrentTextIndex((prev) => (prev + 1) % items.length);
      }, 8000);
      
      return () => clearInterval(interval);
    }
  }, [items.length]);

  if (!items || items.length === 0) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="text-center">
          <div className="text-4xl mb-3">🧄</div>
          <p className="text-sm text-gray-600 font-['Open_Sans']">No hay adicionales disponibles</p>
        </div>
      </div>
    );
  }

  const currentItem = items[currentTextIndex];

  return (
    <div className="max-w-7xl mx-auto px-4">
      <a 
        href="/menu/adicionales" 
        className="group block transform transition-all duration-300 hover:scale-[1.02] hover:shadow-2xl"
      >
        <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-red-100 via-white to-red-100 shadow-lg border border-red-200/50">
          <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-red-500 via-red-500 to-red-500"></div>
          
          <div className="flex flex-col lg:flex-row min-h-[320px]">
            <div className="lg:w-2/5 p-8 flex flex-col justify-center relative z-10">
              <div className="space-y-4">
                <div className="inline-flex items-center px-3 py-1 rounded-full bg--red-100 border border-red-200">
                  <span className="text-xs font-medium text-red-700 font-['Open_Sans']">
                    ✨ Adicional Especial
                  </span>
                </div>

                <h2 className="text-3xl lg:text-4xl font-bold text-gray-800 font-['Playfair_Display'] leading-tight">
                  {currentItem.nombre}
                </h2>

                <div className="flex items-center gap-2">
                  <span className="text-2xl font-bold text-red-600 font-['Inter']">
                    S/ {currentItem.precio}
                  </span>
                  <div className="h-6 w-px bg-gray-300"></div>
                  <span className="text-sm text-gray-500 font-['Open_Sans']">
                    Precio especial
                  </span>
                </div>

                <p className="text-gray-600 font-['Open_Sans'] leading-relaxed max-w-md">
                  {currentItem.descripcion}
                </p>

                <div className="flex items-center gap-2 text-red-600 font-medium text-sm font-['Open_Sans'] group-hover:text-red-700 transition-colors">
                  <span>Ver todos los adicionales</span>
                  <svg 
                    className="w-4 h-4 transform group-hover:translate-x-1 transition-transform" 
                    fill="none" 
                    stroke="currentColor" 
                    viewBox="0 0 24 24"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </div>
              </div>

              {items.length > 1 && (
                <div className="flex gap-2 mt-6">
                  {items.map((_, index) => (
                    <div
                      key={index}
                      className={`h-1 rounded-full transition-all duration-300 ${
                        index === currentTextIndex 
                          ? 'w-8 bg-red-500' 
                          : 'w-2 bg-gray-300'
                      }`}
                    />
                  ))}
                </div>
              )}
            </div>

            <div className="lg:w-3/5 relative overflow-hidden bg-gradient-to-br from-gray-900 via-gray-800 to-black">
          
              <div className="absolute top-0 left-0 w-full h-full pointer-events-none z-10">
                <div className="absolute top-2 left-0 w-full flex justify-between px-4">
                  {[...Array(8)].map((_, i) => (
                    <div key={i} className="w-3 h-3 rounded-full bg-gray-700 opacity-60"></div>
                  ))}
                </div>
                <div className="absolute bottom-2 left-0 w-full flex justify-between px-4">
                  {[...Array(8)].map((_, i) => (
                    <div key={i} className="w-3 h-3 rounded-full bg-gray-700 opacity-60"></div>
                  ))}
                </div>
              </div>

              <div className="h-full flex items-center overflow-hidden">
                <div 
                  ref={containerRef}
                  className="flex h-full items-center will-change-transform absolute"
                  style={{ width: `${duplicatedItems.length * imageWidth}px` }}
                >
                  {duplicatedItems.map((item, index) => (
                    <div 
                      key={`${item.id}-${index}`} 
                      className="flex-shrink-0 flex items-center justify-center p-4"
                      style={{ 
                        width: `${imageWidth}px`,
                        height: `${imageHeight}px`
                      }}
                    >
                      <div className="relative h-full w-full rounded-lg overflow-hidden shadow-lg border-2 border-orange-400/30 group-hover:border-red-500/60 transition-colors">
                        <img
                          src={item.imagen}
                          alt={item.nombre}
                          className="h-full w-full object-cover select-none transition-transform duration-300 group-hover:scale-105"
                          draggable={false}
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent"></div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="absolute inset-y-0 left-0 w-1 bg-gradient-to-b from-red-500 to-red-500"></div>
              <div className="absolute inset-y-0 right-0 w-1 bg-gradient-to-b from-red-500 to-red-500"></div>
            </div>
          </div>
        </div>
      </a>
    </div>
  );
}