'use client';

import { useEffect, useState } from 'react';
import ProductoCard from '@/components/ProductoCard';

interface Adicional {
  id: number;
  nombre: string;
  descripcion?: string | null;
  stock: number;
  precio: string;
  destacado?: boolean;
  habilitado?: boolean;
  imagen?: string;
  descuento?: number | null;
}

export default function MenuAdicionalesPage() {
  const [adicionales, setAdicionales] = useState<Adicional[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await fetch(`${process.env.NEXT_PUBLIC_BACK_HOST}api/productos/adicionales`);
        const data = await res.json();
        // Filtrar solo los adicionales habilitados
        setAdicionales(data.filter((adicional: Adicional) => adicional.habilitado === true));
      } catch (error) {
        console.error('Error al obtener adicionales:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  return (
    <div className="min-h-screen font-['Inter'] bg-gradient-to-br from-red-50/30 via-white to-red-50/20">
      <div className="py-8 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="bg-white rounded-2xl shadow-xl border border-red-100 p-6 md:p-8">
            <div className="flex flex-col lg:flex-row items-start lg:items-center gap-6">
              {/* Título */}
              <div className="flex flex-col items-start gap-6 lg:max-w-[400px] w-full lg:w-auto">
                <div className="space-y-4">
                  <h1 className="text-3xl font-bold text-gray-800 font-['Playfair_Display'] flex items-center gap-3">
                    <span className="w-3 h-3 bg-red-600 rounded-full"></span>
                    Menú - Adicionales
                  </h1>
                </div>
              </div>

              {/* Descripción */}
              <div className="flex-1 lg:pl-8 lg:border-l-2 lg:border-red-100 w-full">
                <div className="bg-gradient-to-r from-red-50 to-red-50/50 rounded-xl p-6">
                  <div className="text-center py-4">
                    <div className="text-4xl mb-3">🍟</div>
                    <p className="text-gray-800 text-base mb-4 font-medium">
                      Complementa tu comida con nuestros deliciosos adicionales.
                    </p>
                    <p className="text-gray-600 text-sm font-['Open_Sans'] leading-relaxed">
                      Añade un extra de sabor a tu pedido con nuestras opciones adicionales. Desde papas crujientes hasta salsas especiales, encuentra el complemento perfecto para tu comida.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="py-8 px-6">
        <div className="max-w-7xl mx-auto">
          {loading ? (
            <div className="flex justify-center items-center h-64">
              <div className="flex flex-col items-center gap-4">
                <div className="w-12 h-12 border-4 border-red-200 border-t-red-600 rounded-full animate-spin"></div>
                <p className="text-lg text-gray-600 font-['Open_Sans']">Cargando deliciosos adicionales...</p>
              </div>
            </div>
          ) : adicionales.length === 0 ? (
            <div className="text-center py-16">
              <div className="text-6xl mb-4">🍟</div>
              <h3 className="text-2xl font-bold text-gray-800 font-['Playfair_Display'] mb-2">
                ¡Ups! No encontramos adicionales disponibles
              </h3>
              <p className="text-gray-600 font-['Open_Sans']">
                No hay adicionales habilitados en este momento. Vuelve pronto para ver nuestras opciones.
              </p>
            </div>
          ) : (
            <>
              <div className="text-center mb-8">
                <h2 className="text-2xl font-bold text-gray-800 font-['Playfair_Display'] mb-2">
                  Nuestros Adicionales
                </h2>
              </div>
              
              <div className="grid gap-6 grid-cols-[repeat(auto-fit,minmax(300px,1fr))]">
                {adicionales.map((adicional) => (
                  <ProductoCard
                    key={adicional.id}
                    id={adicional.id}
                    titulo={adicional.nombre}
                    descripcion={adicional.descripcion || ''}
                    precio={parseFloat(adicional.precio)}
                    imagen={adicional.imagen || '/images/card-adicional.jpg'}
                    descuento={adicional.descuento ?? undefined}
                    isGrid={true}
                    ruta="adicionales"
                    mostrarPersonalizar={false}
                    tamanio=""
                    sabores={[]}
                    agregados={[]}
                  />
                ))}
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}