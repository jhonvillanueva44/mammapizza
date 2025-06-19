'use client';

import { useEffect, useState } from 'react';
import { ChevronDown } from 'lucide-react';
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

interface Pasta {
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

type Filtro = { tamanio: 'todos' | string };

export default function MenuPastasPage() {
  const [pastas, setPastas] = useState<Pasta[]>([]);
  const [tamanios, setTamanios] = useState<Tamanio[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<Filtro>({ tamanio: 'todos' });
  
  // Estados para el filtro
  const [activeFilter, setActiveFilter] = useState<'todos' | 'tamanio'>('todos');
  const [selectedValue, setSelectedValue] = useState('');
  const [dropdownOpen, setDropdownOpen] = useState(false);

  const handleFilterTamanioChange = (
    value: { filter: 'todos' } | { filter: 'tamanio'; selected: string }
  ) => {
    if (value.filter === 'todos') {
      setFilter({ tamanio: 'todos' });
    } else {
      setFilter({ tamanio: value.selected.toLowerCase() });
    }
  };

  const handleSelect = (value: string) => {
    setSelectedValue(value);
    setActiveFilter('tamanio');
    setDropdownOpen(false);
    handleFilterTamanioChange({ filter: 'tamanio', selected: value });
  };

  const handleTodosClick = () => {
    setActiveFilter('todos');
    setDropdownOpen(false);
    handleFilterTamanioChange({ filter: 'todos' });
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch pastas
        const pastasRes = await fetch('http://localhost:4000/api/productos/pastas');
        const pastasData = await pastasRes.json();
        setPastas(pastasData);

        // Fetch tamaños para el filtro
        const tamaniosRes = await fetch('http://localhost:4000/api/tamanios/pasta');
        const tamaniosData = await tamaniosRes.json();
        setTamanios(tamaniosData);
        
        // Establecer el primer tamaño como valor por defecto
        if (tamaniosData.length > 0) {
          setSelectedValue(tamaniosData[0].nombre);
        }
      } catch (error) {
        console.error('Error al obtener datos:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const pastasFiltradas = pastas.filter((pasta) => {
    return (
      filter.tamanio === 'todos' ||
      pasta.unicos.some(
        (u) => u.tamanios_sabor.tamanio.nombre.toLowerCase() === filter.tamanio
      )
    );
  });

  return (
    <div className="min-h-screen p-6 sm:p-10 font-[var(--font-geist-sans)]">
      <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 max-w-[700px] w-full">
        {/* Columna izquierda: filtros */}
        <div className="flex flex-col items-start gap-4 sm:max-w-[300px] w-full sm:w-auto">
          <h1 className="text-2xl font-bold">Menú - Pastas</h1>

          {/* Filtro tamaño integrado */}
          <div className="flex gap-3 flex-wrap">
            {/* Botón "Todos" */}
            <button
              onClick={handleTodosClick}
              className={`px-4 py-2 rounded-full border font-medium transition text-sm sm:text-base ${
                activeFilter === 'todos'
                  ? 'bg-red-600 text-white border-black'
                  : 'bg-white text-black border-black hover:bg-[#DC0000]'
              }`}
            >
              Todos
            </button>

            {/* Botón desplegable "Tipo de Pasta" */}
            <div className="relative">
              <button
                onClick={() => {
                  setDropdownOpen(!dropdownOpen);
                  setActiveFilter('tamanio');
                }}
                className={`flex items-center gap-1 px-4 py-2 w-[140px] sm:w-[160px] rounded-full border font-medium transition text-sm sm:text-base ${
                  activeFilter === 'tamanio'
                    ? 'bg-red-600 text-white border-black'
                    : 'bg-white text-black border-black hover:bg-[#DC0000]'
                }`}
                style={{ minWidth: '140px' }}
              >
                <span className="truncate">{selectedValue}</span>
                <ChevronDown size={16} />
              </button>

              {dropdownOpen && (
                <div className="absolute top-full mt-2 w-full bg-white border rounded shadow z-10">
                  {tamanios.map((tamanio) => (
                    <button
                      key={tamanio.id}
                      onClick={() => handleSelect(tamanio.nombre)}
                      className="w-full text-left px-4 py-2 hover:bg-[#DC0000] text-sm"
                    >
                      {tamanio.nombre}
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Columna derecha: texto descriptivo */}
        <div className="flex-1 pl-4 border-l border-gray-300 min-h-[120px] w-full sm:w-auto">
          {filter.tamanio !== 'todos' ? (
            <>
              <p className="text-gray-800 text-base mb-2">
                Estás viendo nuestras pastas de tamaño{' '}
                <span className="font-semibold capitalize">{filter.tamanio}</span>.
              </p>
              <p className="text-gray-600 text-sm">
                Disfruta de nuestras deliciosas pastas en diferentes tamaños, perfectas para cualquier ocasión.
              </p>
            </>
          ) : (
            <p className="text-gray-500 text-sm italic">
              Estás viendo todas nuestras pastas. Usa los filtros para encontrar justo lo que deseas.
            </p>
          )}
        </div>
      </div>

      {/* Lista de productos */}
      <div className="mt-6 grid gap-4 grid-cols-[repeat(auto-fit,minmax(280px,1fr))]">
        {loading ? (
          <p>Cargando pastas...</p>
        ) : pastasFiltradas.length === 0 ? (
          <p>No hay pastas disponibles para ese filtro.</p>
        ) : (
          pastasFiltradas.map((pasta) => {
            const unico =
              filter.tamanio === 'todos'
                ? pasta.unicos[0]
                : pasta.unicos.find(
                    (u) => u.tamanios_sabor.tamanio.nombre.toLowerCase() === filter.tamanio
                  ) || pasta.unicos[0];

            if (!unico) return null;

            return (
              <ProductoCard
                key={pasta.id}
                id={pasta.id}
                titulo={pasta.nombre}
                descripcion={
                  pasta.descripcion || unico.tamanios_sabor.sabor.descripcion || ''
                }
                precio={parseFloat(unico.tamanios_sabor.precio)}
                imagen={pasta.imagen || '/images/card-pasta.jpg'}
                descuento={pasta.descuento ?? undefined}
                isGrid={true}
                
              />
            );
          })
        )}
      </div>
    </div>
  );
}