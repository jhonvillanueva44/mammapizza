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
        const res = await fetch('http://localhost:4000/api/productos/adicionales');
        const data = await res.json();
        setAdicionales(data);
      } catch (error) {
        console.error('Error al obtener adicionales:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  return (
    <div className="min-h-screen p-6 sm:p-10 font-[var(--font-geist-sans)]">
      <div className="flex flex-col items-start gap-4">
        <h1 className="text-2xl font-bold">Menú - Adicionales</h1>
        
        <div className="flex-1 pl-4 border-l border-gray-300 min-h-[120px] w-full">
          <p className="text-gray-800 text-base mb-2">
            Complementa tu comida con nuestros deliciosos adicionales.
          </p>
          <p className="text-gray-600 text-sm">
            Añade un extra de sabor a tu pedido con nuestras opciones adicionales.
          </p>
        </div>
      </div>

      {/* Lista de productos */}
      <div className="mt-6 grid gap-4 grid-cols-[repeat(auto-fit,minmax(280px,1fr))]">
        {loading ? (
          <p>Cargando adicionales...</p>
        ) : adicionales.length === 0 ? (
          <p>No hay adicionales disponibles en este momento.</p>
        ) : (
          adicionales.map((adicional) => (
            <ProductoCard
              key={adicional.id}
              id={adicional.id}
              titulo={adicional.nombre}
              descripcion={adicional.descripcion || ''}
              precio={parseFloat(adicional.precio)}
              imagen={adicional.imagen || '/images/card-adicional.jpg'}
              descuento={adicional.descuento ?? undefined}
              isGrid={true}
              mostrarPersonalizar={false}
            />
          ))
        )}
      </div>
    </div>
  );
}