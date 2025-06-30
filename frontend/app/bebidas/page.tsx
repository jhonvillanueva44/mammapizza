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

interface Bebida {
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

interface FilterButtonsProps {
  onChange: (
    value:
      | { filter: 'todos' }
      | { filter: 'tamanio'; selected: string } 
  ) => void
  tamanios: Tamanio[]
}

type Filtro = { tamanio: 'todos' | string };

function FilterButtons({ onChange, tamanios }: FilterButtonsProps) {
  const [activeFilter, setActiveFilter] = useState<'todos' | 'tamanio'>('todos')
  const [selectedValue, setSelectedValue] = useState('')
  const [dropdownOpen, setDropdownOpen] = useState(false)

  useEffect(() => {
    if (tamanios.length > 0 && !selectedValue) {
      setSelectedValue(tamanios[0].nombre)
    }
  }, [tamanios, selectedValue])

  const handleSelect = (value: string) => {
    setSelectedValue(value)
    setActiveFilter('tamanio')
    setDropdownOpen(false)
    onChange({ filter: 'tamanio', selected: value })
  }

  return (
    <div className="flex gap-3 flex-wrap">
      {/* Botón "Todos" */}
      <button
        onClick={() => {
          setActiveFilter('todos')
          setDropdownOpen(false)
          onChange({ filter: 'todos' })
        }}
        className={`px-6 py-3 rounded-full border-2 font-semibold transition-all duration-300 text-sm sm:text-base shadow-lg hover:shadow-xl transform hover:scale-105 ${
          activeFilter === 'todos'
            ? 'bg-red-600 text-white border-red-600 shadow-red-200'
            : 'bg-white text-red-600 border-red-200 hover:bg-red-50 hover:border-red-400'
        }`}
      >
        Todos
      </button>

      {/* Botón desplegable "Tamaño" */}
      <div className="relative">
        <button
          onClick={() => {
            setDropdownOpen(!dropdownOpen)
            setActiveFilter('tamanio')
          }}
          className={`flex items-center gap-2 px-6 py-3 w-[140px] sm:w-[160px] rounded-full border-2 font-semibold transition-all duration-300 text-sm sm:text-base shadow-lg hover:shadow-xl transform hover:scale-105 ${
            activeFilter === 'tamanio'
              ? 'bg-red-600 text-white border-red-600 shadow-red-200'
              : 'bg-white text-red-600 border-red-200 hover:bg-red-50 hover:border-red-400'
          }`}
          style={{ minWidth: '140px' }}
        >
          <span className="truncate">{selectedValue}</span>
          <ChevronDown size={16} className={`transition-transform duration-300 ${dropdownOpen ? 'rotate-180' : ''}`} />
        </button>

        {dropdownOpen && (
          <div className="absolute top-full mt-2 w-full bg-white border-2 border-red-100 rounded-xl shadow-2xl z-10 overflow-hidden">
            {tamanios.map((tamanio) => (
              <button
                key={tamanio.id}
                onClick={() => handleSelect(tamanio.nombre)}
                className="w-full text-left px-4 py-3 hover:bg-red-50 hover:text-red-600 text-sm font-medium transition-colors duration-200 border-b border-red-50 last:border-b-0"
              >
                {tamanio.nombre}
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

export default function MenuBebidasPage() {
  const [bebidas, setBebidas] = useState<Bebida[]>([]);
  const [tamanios, setTamanios] = useState<Tamanio[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<Filtro>({ tamanio: 'todos' });

  const handleFilterTamanioChange = (
    value: { filter: 'todos' } | { filter: 'tamanio'; selected: string }
  ) => {
    if (value.filter === 'todos') {
      setFilter({ tamanio: 'todos' });
    } else {
      setFilter({ tamanio: value.selected.toLowerCase() });
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [bebidasRes, tamaniosRes] = await Promise.all([
          fetch(`${process.env.NEXT_PUBLIC_BACK_HOST}api/productos/bebidas`),
          fetch(`${process.env.NEXT_PUBLIC_BACK_HOST}api/tamanios/bebida`)
        ]);
        
        const [bebidasData, tamaniosData] = await Promise.all([
          bebidasRes.json(),
          tamaniosRes.json()
        ]);
        
        setBebidas(bebidasData);
        setTamanios(tamaniosData);
      } catch (error) {
        console.error('Error al obtener datos:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const bebidasFiltradas = bebidas.filter((bebida) => {
    if (bebida.habilitado !== true) return false;
    return (
      filter.tamanio === 'todos' ||
      bebida.unicos.some(
        (u) => u.tamanios_sabor.tamanio.nombre.toLowerCase() === filter.tamanio
      )
    );
  });

  return (
    <div className="min-h-screen font-['Inter'] bg-gradient-to-br from-red-50/30 via-white to-red-50/20">
      <div className="py-8 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="bg-white rounded-2xl shadow-xl border border-red-100 p-6 md:p-8">
            <div className="flex flex-col lg:flex-row items-start lg:items-center gap-6">
              {/* Filtros */}
              <div className="flex flex-col items-start gap-6 lg:max-w-[400px] w-full lg:w-auto">
                <div className="space-y-4">
                  <h2 className="text-xl font-bold text-gray-800 font-['Playfair_Display'] flex items-center gap-2">
                    <span className="w-2 h-2 bg-red-600 rounded-full"></span>
                    Filtrar por Tamaño
                  </h2>
                  <FilterButtons onChange={handleFilterTamanioChange} tamanios={tamanios} />
                </div>
              </div>

              {/* Descripción */}
              <div className="flex-1 lg:pl-8 lg:border-l-2 lg:border-red-100 w-full">
                <div className="bg-gradient-to-r from-red-50 to-red-50/50 rounded-xl p-6">
                  {filter.tamanio !== 'todos' && (
                    <>
                      <p className="text-gray-800 text-base mb-4 font-medium">
                        Estás viendo nuestras bebidas de tamaño{' '}
                        <span className="font-bold text-red-600 capitalize">{filter.tamanio}</span>
                        , perfectas para acompañar tu comida.
                      </p>
                      <p className="text-gray-600 text-sm font-['Open_Sans'] leading-relaxed">
                        Disfruta de nuestra selección de bebidas en diferentes tamaños, desde refrescantes opciones individuales hasta compartibles. Cada bebida está cuidadosamente seleccionada para complementar tu experiencia gastronómica.
                      </p>
                    </>
                  )}

                  {filter.tamanio === 'todos' && (
                    <div className="text-center py-4">
                      <div className="text-4xl mb-3">🥤</div>
                      <p className="text-gray-600 text-sm font-['Open_Sans'] italic">
                        Estás viendo todas nuestras bebidas. Explora diferentes tamaños para encontrar tu próxima bebida favorita.
                      </p>
                    </div>
                  )}
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
                <p className="text-lg text-gray-600 font-['Open_Sans']">Cargando refrescantes bebidas...</p>
              </div>
            </div>
          ) : bebidasFiltradas.length === 0 ? (
            <div className="text-center py-16">
              <div className="text-6xl mb-4">🥤</div>
              <h3 className="text-2xl font-bold text-gray-800 font-['Playfair_Display'] mb-2">
                ¡Ups! No encontramos bebidas
              </h3>
              <p className="text-gray-600 font-['Open_Sans']">
                No hay bebidas disponibles para ese filtro. Intenta con otros criterios de búsqueda.
              </p>
            </div>
          ) : (
            <>
              <div className="text-center mb-8">
                <h2 className="text-2xl font-bold text-gray-800 font-['Playfair_Display'] mb-2">
                  Nuestras Bebidas
                </h2>
              </div>
              
              <div className="grid gap-6 grid-cols-[repeat(auto-fit,minmax(300px,1fr))]">
                {bebidasFiltradas.map((bebida) => {
                  const unico =
                    filter.tamanio === 'todos'
                      ? bebida.unicos[0]
                      : bebida.unicos.find(
                          (u) => u.tamanios_sabor.tamanio.nombre.toLowerCase() === filter.tamanio
                        ) || bebida.unicos[0];

                  if (!unico) return null;

                  return (
                    <ProductoCard
                      key={bebida.id}
                      id={bebida.id}
                      titulo={bebida.nombre}
                      descripcion={
                        bebida.descripcion || 
                        unico.tamanios_sabor.sabor.descripcion || 
                        "Refrescante bebida para acompañar tu comida"
                      }
                      precio={parseFloat(unico.tamanios_sabor.precio)}
                      imagen={bebida.imagen || '/images/card-bebida.jpg'}
                      descuento={bebida.descuento ?? undefined}
                      isGrid={true}
                      ruta="bebidas"
                      mostrarPersonalizar={true}
                      tamanio={unico.tamanios_sabor.tamanio.nombre}
                      sabores={unico.tamanios_sabor.sabor.nombre.split(',').map(s => s.trim())}
                      agregados={[]} 
                    />
                  );
                })}
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}