'use client';

import { useEffect, useState } from 'react';
import FilterButtons from '@/components/FilterButtonsCalzones';
import ProductoCard from '@/components/ProductoCard';

interface Tamanio {
  id: number;
  nombre: string;
  descripcion?: string;
}

interface Sabor {
  id: number;
  nombre: string;
  descripcion?: string;
  especial?: boolean;
}

interface TamaniosSabor {
  id: number;
  precio: string;
  estado: boolean;
  tamanio_id: number;
  sabor_id: number;
  sabor: Sabor;
  tamanio: Tamanio;
}

interface Unico {
  id: number;
  producto_id: number;
  tamanio_sabor_id: number;
  tamanios_sabor: TamaniosSabor;
}

interface Calzone {
  id: number;
  nombre: string;
  descripcion?: string | null;
  stock: number;
  destacado?: boolean;
  habilitado?: boolean;
  unico_sabor?: boolean;
  unicos: Unico[];
  imagen?: string;
  descuento?: number | null;
}

type Filtro =
  | { tamanio: 'todos'; especial: 'todos' | 'especial' | 'clasico' }
  | { tamanio: string; especial: 'todos' | 'especial' | 'clasico' };

export default function MenuCalzonePage() {
  const [calzones, setCalzones] = useState<Calzone[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<Filtro>({ tamanio: 'todos', especial: 'todos' });

  const handleFilterTamanioChange = (
    value: { filter: 'todos' } | { filter: 'tamanio'; selected: string }
  ) => {
    if (value.filter === 'todos') {
      setFilter((f) => ({ ...f, tamanio: 'todos' }));
    } else {
      setFilter((f) => ({ ...f, tamanio: value.selected.toLowerCase() }));
    }
  };

  const handleFilterEspecialChange = (value: 'todos' | 'especial' | 'clasico') => {
    setFilter((f) => ({ ...f, especial: value }));
  };

  useEffect(() => {
    const fetchCalzones = async () => {
      try {
        const res = await fetch('http://localhost:4000/api/productos/calzones');
        const data = await res.json();
        setCalzones(data);
      } catch (error) {
        console.error('Error al obtener calzones:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchCalzones();
  }, []);

  const calzonesFiltrados = calzones.filter((calzone) => {
    const filtroTamanio =
      filter.tamanio === 'todos' ||
      calzone.unicos.some(
        (u) => u.tamanios_sabor.tamanio.nombre.toLowerCase() === filter.tamanio
      );

    const filtroEspecial =
      filter.especial === 'todos' ||
      calzone.unicos.some((u) => {
        const esEspecial = u.tamanios_sabor.sabor.especial ?? false;
        if (filter.especial === 'especial') return esEspecial;
        if (filter.especial === 'clasico') return !esEspecial;
        return true;
      });

    return filtroTamanio && filtroEspecial;
  });

  return (
    <div className="min-h-screen p-6 sm:p-10 font-[var(--font-geist-sans)]">
      <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 max-w-[700px] w-full">
        {/* Columna izquierda: filtros */}
        <div className="flex flex-col items-start gap-4 sm:max-w-[300px] w-full sm:w-auto">
          <h1 className="text-2xl font-bold">Menú - Calzones</h1>

          {/* Filtro tamaño */}
          <FilterButtons onChange={handleFilterTamanioChange} />

          {/* Filtro especial */}
          <div className="flex gap-3 mt-2">
            {['todos', 'especial', 'clasico'].map((opt) => (
              <button
                key={opt}
                onClick={() => handleFilterEspecialChange(opt as 'todos' | 'especial' | 'clasico')}
                className={`px-3 py-1 rounded-full border ${filter.especial === opt
                  ? 'bg-green-600 text-white border-green-600'
                  : 'border-gray-300 text-gray-700'
                  } hover:bg-green-600 hover:text-white transition`}
              >
                {opt === 'todos' ? 'Todos' : opt === 'especial' ? 'Especiales' : 'Clásicos'}
              </button>
            ))}
          </div>
        </div>

        {/* Columna derecha: texto descriptivo */}
        <div className="flex-1 pl-4 border-l border-gray-300 min-h-[120px] w-full sm:w-auto">
          {filter.tamanio !== 'todos' && filter.especial !== 'todos' && (
            <>
              <p className="text-gray-800 text-base mb-2">
                Estás viendo nuestros calzones de tamaño{' '}
                <span className="font-semibold capitalize">{filter.tamanio}</span> y tipo{' '}
                <span className="font-semibold capitalize">
                  {filter.especial === 'especial' ? 'Especiales' : 'Clásicos'}
                </span>
                .
              </p>
              <p className="text-gray-600 text-sm">
                Cada uno relleno con ingredientes frescos y cuidadosamente seleccionados.
              </p>
            </>
          )}

          {filter.tamanio !== 'todos' && filter.especial === 'todos' && (
            <>
              <p className="text-gray-800 text-base mb-2">
                Calzones de tamaño <span className="font-semibold capitalize">{filter.tamanio}</span>.
              </p>
              <p className="text-gray-600 text-sm">
                Disfruta de nuestro menú en diferentes tamaños, según tu antojo o compañía.
              </p>
            </>
          )}

          {filter.tamanio === 'todos' && filter.especial !== 'todos' && (
            <>
              <p className="text-gray-800 text-base mb-2">
                Mostrando calzones <span className="font-semibold capitalize">{filter.especial === 'especial' ? 'Especiales' : 'Clásicos'}</span>.
              </p>
              <p className="text-gray-600 text-sm">
                Tenemos opciones para todos los gustos: desde combinaciones tradicionales hasta sabores únicos.
              </p>
            </>
          )}

          {filter.tamanio === 'todos' && filter.especial === 'todos' && (
            <p className="text-gray-500 text-sm italic">
              Estás viendo todos nuestros calzones. Usa los filtros para encontrar justo lo que deseas.
            </p>
          )}
        </div>
      </div>

      {/* Lista de productos */}
      <div className="mt-6 grid gap-4 grid-cols-[repeat(auto-fit,minmax(280px,1fr))]">
        {loading ? (
          <p>Cargando calzones...</p>
        ) : calzonesFiltrados.length === 0 ? (
          <p>No hay calzones disponibles para ese filtro.</p>
        ) : (
          calzonesFiltrados.map((calzone) => {
            const unicoEspecial = calzone.unicos.find((u) => {
              const esEspecial = u.tamanios_sabor.sabor.especial ?? false;
              if (filter.especial === 'especial') return esEspecial;
              if (filter.especial === 'clasico') return !esEspecial;
              return true;
            });

            const unicoTamanio =
              filter.tamanio === 'todos'
                ? calzone.unicos[0]
                : calzone.unicos.find(
                  (u) => u.tamanios_sabor.tamanio.nombre.toLowerCase() === filter.tamanio
                ) || calzone.unicos[0];

            const unico = unicoEspecial || unicoTamanio || calzone.unicos[0];

            if (!unico) return null;

            return (
              <ProductoCard
                key={calzone.id}
                id={calzone.id}
                titulo={calzone.nombre}
                descripcion={
                  calzone.descripcion || unico.tamanios_sabor.sabor.descripcion || ''
                }
                precio={parseFloat(unico.tamanios_sabor.precio)}
                imagen={calzone.imagen || '/images/card-calzone.jpg'}
                descuento={calzone.descuento ?? undefined}
                isGrid={true}
                especial={unico.tamanios_sabor.sabor.especial ?? false}
              />
            );
          })
        )}
      </div>
    </div>
  );
}
