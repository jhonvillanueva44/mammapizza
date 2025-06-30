//pizzaspage.tsx
'use client'

import { useEffect, useState } from 'react'
import { ChevronDown } from 'lucide-react'
import ProductoCard from '@/components/ProductoCard'

interface Tamanio {
  id: number
  nombre: string
  descripcion?: string
}

interface Sabor {
  id: number
  nombre: string
  descripcion?: string
  especial?: boolean
}

interface TamaniosSabor {
  id: number
  precio: string
  estado: boolean
  tamanio_id: number
  sabor_id: number
  sabor: Sabor
  tamanio: Tamanio
}

interface Unico {
  id: number
  producto_id: number
  tamanio_sabor_id: number
  tamanios_sabor: TamaniosSabor
}

interface Combinacion {
  id: number
  producto_id: number
  tamanio_sabor_id: number
  tamanio_sabor: TamaniosSabor
}

interface Pizza {
  id: number
  nombre: string
  descripcion?: string | null
  stock: number
  destacado?: boolean
  habilitado?: boolean
  unico_sabor?: boolean
  unicos: Unico[]
  combinaciones: Combinacion[]
  imagen?: string
  descuento?: number | null
}

interface FilterButtonsProps {
  onChange: (
    value:
      | { filter: 'todos' }
      | { filter: 'tamanio'; selected: string } 
  ) => void
  tamanios: Tamanio[]
}

type Filtro =
  | { tamanio: 'todos'; especial: 'todos' | 'especial' | 'clasico' }
  | { tamanio: string; especial: 'todos' | 'especial' | 'clasico' }

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

export default function MenuPizzasPage() {
  const [pizzas, setPizzas] = useState<Pizza[]>([])
  const [tamanios, setTamanios] = useState<Tamanio[]>([])
  const [loading, setLoading] = useState(true)
  const [filter, setFilter] = useState<Filtro>({ tamanio: 'todos', especial: 'todos' })

  const handleFilterTamanioChange = (
    value: { filter: 'todos' } | { filter: 'tamanio'; selected: string }
  ) => {
    if (value.filter === 'todos') {
      setFilter((f) => ({ ...f, tamanio: 'todos' }))
    } else {
      setFilter((f) => ({ ...f, tamanio: value.selected.toLowerCase() }))
    }
  }

  const handleFilterEspecialChange = (value: 'todos' | 'especial' | 'clasico') => {
    setFilter((f) => ({ ...f, especial: value }))
  }

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [pizzasRes, tamaniosRes] = await Promise.all([
          fetch(`${ process.env.NEXT_PUBLIC_BACK_HOST }api/productos/pizzas`),
          fetch(`${ process.env.NEXT_PUBLIC_BACK_HOST }api/tamanios/pizza`)
        ])
        
        const [pizzasData, tamaniosData] = await Promise.all([
          pizzasRes.json(),
          tamaniosRes.json()
        ])
        
        setPizzas(pizzasData)
        setTamanios(tamaniosData)
      } catch (error) {
        console.error('Error al obtener datos:', error)
      } finally {
        setLoading(false)
      }
    }
    fetchData()
  }, [])

  const pizzasFiltradas = pizzas.filter((pizza) => {
    if (pizza.habilitado !== true) return false;

    if (pizza.combinaciones.length > 0) {
      const filtroTamanio =
        filter.tamanio === 'todos' ||
        pizza.combinaciones.some((c) => c.tamanio_sabor.tamanio.nombre.toLowerCase() === filter.tamanio)

      const filtroEspecial =
        filter.especial === 'todos' ||
        pizza.combinaciones.some((c) => {
          const esEspecial = c.tamanio_sabor.sabor.especial ?? false
          if (filter.especial === 'especial') return esEspecial
          if (filter.especial === 'clasico') return !esEspecial
          return true
        })

      return filtroTamanio && filtroEspecial
    }
    else if (pizza.unicos.length > 0) {
      const filtroTamanio =
        filter.tamanio === 'todos' ||
        pizza.unicos.some((u) => u.tamanios_sabor.tamanio.nombre.toLowerCase() === filter.tamanio)

      const filtroEspecial =
        filter.especial === 'todos' ||
        pizza.unicos.some((u) => {
          const esEspecial = u.tamanios_sabor.sabor.especial ?? false
          if (filter.especial === 'especial') return esEspecial
          if (filter.especial === 'clasico') return !esEspecial
          return true
        })

      return filtroTamanio && filtroEspecial
    }
    return false
  })

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

                <div className="space-y-4">
                  <h2 className="text-xl font-bold text-gray-800 font-['Playfair_Display'] flex items-center gap-2">
                    <span className="w-2 h-2 bg-red-600 rounded-full"></span>
                    Filtrar por Tipo
                  </h2>
                  <div className="flex gap-3 flex-wrap">
                    {['todos', 'especial', 'clasico'].map((opt) => (
                      <button
                        key={opt}
                        onClick={() => handleFilterEspecialChange(opt as 'todos' | 'especial' | 'clasico')}
                        className={`px-6 py-3 rounded-full border-2 font-semibold transition-all duration-300 text-sm shadow-lg hover:shadow-xl transform hover:scale-105 ${
                          filter.especial === opt
                            ? 'bg-green-600 text-white border-green-600 shadow-green-200'
                            : 'bg-white text-green-600 border-green-200 hover:bg-green-50 hover:border-green-400'
                        }`}
                      >
                        {opt === 'todos' ? 'Todos' : opt === 'especial' ? 'Especiales' : 'Clásicos'}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              {/* Descripción */}
              <div className="flex-1 lg:pl-8 lg:border-l-2 lg:border-red-100 w-full">
                <div className="bg-gradient-to-r from-red-50 to-red-50/50 rounded-xl p-6">
                  {filter.tamanio !== 'todos' && filter.especial !== 'todos' && (
                    <>
                      <p className="text-gray-800 text-base mb-4 font-medium">
                        Estás viendo nuestras pizzas de tamaño{' '}
                        <span className="font-bold text-red-600 capitalize">{filter.tamanio}</span> y tipo{' '}
                        <span className="font-bold text-green-600 capitalize">
                          {filter.especial === 'especial' ? 'Especiales' : 'Clásicos'}
                        </span>
                        , cuidadosamente seleccionadas para que disfrutes el mejor sabor.
                      </p>
                      <p className="text-gray-600 text-sm font-['Open_Sans'] leading-relaxed">
                        Recuerda que cada tamaño ofrece una experiencia diferente: desde la porción ideal para uno hasta opciones para compartir en familia o con amigos. ¡No dudes en explorar y descubrir tu favorita!
                      </p>
                    </>
                  )}

                  {filter.tamanio !== 'todos' && filter.especial === 'todos' && (
                    <>
                      <p className="text-gray-800 text-base mb-4 font-medium">
                        Navegando por pizzas de tamaño <span className="font-bold text-red-600 capitalize">{filter.tamanio}</span>.
                      </p>
                      <p className="text-gray-600 text-sm font-['Open_Sans'] leading-relaxed">
                        Cada tamaño está pensado para adaptarse a tu apetito y ocasión. Si quieres variar, también puedes probar nuestras opciones clásicas y especiales disponibles en otros tamaños.
                      </p>
                    </>
                  )}

                  {filter.tamanio === 'todos' && filter.especial !== 'todos' && (
                    <>
                      <p className="text-gray-800 text-base mb-4 font-medium">
                        Mostrando pizzas <span className="font-bold text-green-600 capitalize">{filter.especial === 'especial' ? 'Especiales' : 'Clásicos'}</span> de todos los tamaños.
                      </p>
                      <p className="text-gray-600 text-sm font-['Open_Sans'] leading-relaxed">
                        Ya sea que prefieras los sabores tradicionales o las combinaciones más innovadoras, aquí encontrarás opciones para todos los gustos y ocasiones. ¡Buen provecho!
                      </p>
                    </>
                  )}

                  {filter.tamanio === 'todos' && filter.especial === 'todos' && (
                    <div className="text-center py-4">
                      <div className="text-4xl mb-3">🍕</div>
                      <p className="text-gray-600 text-sm font-['Open_Sans'] italic">
                        Estás viendo todo nuestro menú de pizzas. Explora diferentes tamaños y sabores para encontrar tu próxima favorita.
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
                <p className="text-lg text-gray-600 font-['Open_Sans']">Cargando deliciosas pizzas...</p>
              </div>
            </div>
          ) : pizzasFiltradas.length === 0 ? (
            <div className="text-center py-16">
              <div className="text-6xl mb-4">🍕</div>
              <h3 className="text-2xl font-bold text-gray-800 font-['Playfair_Display'] mb-2">
                ¡Ups! No encontramos pizzas
              </h3>
              <p className="text-gray-600 font-['Open_Sans']">
                No hay pizzas disponibles para ese filtro. Intenta con otros criterios de búsqueda.
              </p>
            </div>
          ) : (
            <>
              <div className="text-center mb-8">
                <h2 className="text-2xl font-bold text-gray-800 font-['Playfair_Display'] mb-2">
                  Nuestras Especialidades
                </h2>
              </div>
              
              <div className="grid gap-6 grid-cols-[repeat(auto-fit,minmax(300px,1fr))]">
                {pizzasFiltradas.map((pizza) => {
                  if (pizza.combinaciones.length > 0) {
                    const shouldShowPizza = () => {
                      const cumpleTamanio = 
                        filter.tamanio === 'todos' || 
                        pizza.combinaciones.some(c => c.tamanio_sabor.tamanio.nombre.toLowerCase() === filter.tamanio);
                      
                      if (filter.especial === 'todos') return cumpleTamanio;
                      if (filter.especial === 'especial') {
                        return cumpleTamanio && pizza.combinaciones.some(c => c.tamanio_sabor.sabor.especial);
                      }
                      return cumpleTamanio && pizza.combinaciones.some(c => !c.tamanio_sabor.sabor.especial);
                    };

                    if (!shouldShowPizza()) return null;

                    let combinacionAMostrar = pizza.combinaciones[0]; 

                    if (filter.tamanio !== 'todos' || filter.especial !== 'todos') {
                      const exactMatch = pizza.combinaciones.find(c => {
                        const cumpleTamanio = 
                          filter.tamanio === 'todos' || 
                          c.tamanio_sabor.tamanio.nombre.toLowerCase() === filter.tamanio;
                        
                        const cumpleEspecial =
                          filter.especial === 'todos' ||
                          (filter.especial === 'especial' 
                            ? c.tamanio_sabor.sabor.especial 
                            : !c.tamanio_sabor.sabor.especial);
                        
                        return cumpleTamanio && cumpleEspecial;
                      });

                      if (exactMatch) {
                        combinacionAMostrar = exactMatch;
                      } else {
                        const sizeMatch = pizza.combinaciones.find(c => 
                          filter.tamanio === 'todos' || 
                          c.tamanio_sabor.tamanio.nombre.toLowerCase() === filter.tamanio
                        );
                        if (sizeMatch) {
                          combinacionAMostrar = sizeMatch;
                        }
                      }
                    }

                    return (
                      <ProductoCard
                        key={pizza.id}
                        id={pizza.id}
                        titulo={pizza.nombre}
                        descripcion={pizza.descripcion || combinacionAMostrar.tamanio_sabor.sabor.descripcion || ''}
                        precio={parseFloat(combinacionAMostrar.tamanio_sabor.precio)}
                        imagen={pizza.imagen || ''}
                        descuento={pizza.descuento ?? undefined}
                        isGrid={true}
                        especial={combinacionAMostrar.tamanio_sabor.sabor.especial ?? false}
                        ruta="pizzas"
                        tamanio={combinacionAMostrar.tamanio_sabor.tamanio.nombre}
                        sabores={combinacionAMostrar.tamanio_sabor.sabor.nombre.split(',').map(s => s.trim())}
                        agregados={[]}
                      />
                    );
                  }
                  else if (pizza.unicos.length > 0) {
                    const unicoEspecial = pizza.unicos.find((u) => {
                      const esEspecial = u.tamanios_sabor.sabor.especial ?? false
                      if (filter.especial === 'especial') return esEspecial
                      if (filter.especial === 'clasico') return !esEspecial
                      return true
                    })

                    const unicoTamanio =
                      filter.tamanio === 'todos'
                        ? pizza.unicos[0]
                        : pizza.unicos.find(
                          (u) => u.tamanios_sabor.tamanio.nombre.toLowerCase() === filter.tamanio
                        ) || pizza.unicos[0]

                    const unico = unicoEspecial || unicoTamanio || pizza.unicos[0]

                    if (!unico) return null

                    return (
                      <ProductoCard
                        key={pizza.id}
                        id={pizza.id}
                        titulo={pizza.nombre}
                        descripcion={pizza.descripcion || unico.tamanios_sabor.sabor.descripcion || ''}
                        precio={parseFloat(unico.tamanios_sabor.precio)}
                        imagen={pizza.imagen || ''}
                        descuento={pizza.descuento ?? undefined}
                        isGrid={true}
                        especial={unico.tamanios_sabor.sabor.especial ?? false}
                        ruta="pizzas"
                        tamanio={unico.tamanios_sabor.tamanio.nombre}
                        sabores={unico.tamanios_sabor.sabor.nombre.split(',').map(s => s.trim())}
                        agregados={[]}
                      />
                    )
                  }
                  return null
                })}
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  )
}