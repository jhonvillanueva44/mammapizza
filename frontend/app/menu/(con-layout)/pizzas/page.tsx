'use client'

import { useEffect, useState } from 'react'
import FilterButtons from '@/components/FilterButtonsPizzas'
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

type Filtro =
  | { tamanio: 'todos'; especial: 'todos' | 'especial' | 'clasico' }
  | { tamanio: string; especial: 'todos' | 'especial' | 'clasico' }

export default function MenuPizzasPage() {
  const [pizzas, setPizzas] = useState<Pizza[]>([])
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
    const fetchPizzas = async () => {
      try {
        const res = await fetch('http://localhost:4000/api/productos/pizzas')
        const data = await res.json()
        setPizzas(data)
      } catch (error) {
        console.error('Error al obtener pizzas:', error)
      } finally {
        setLoading(false)
      }
    }
    fetchPizzas()
  }, [])

  const pizzasFiltradas = pizzas.filter((pizza) => {
    // Si tiene combinaciones, aplicar filtros a las combinaciones
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
    // Si tiene unicos, aplicar filtros a los unicos (mantenemos la lógica original)
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
    <div className="min-h-screen p-6 sm:p-10 font-[var(--font-geist-sans)]">
      <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 max-w-[700px] w-full">
        {/* Columna izquierda: filtros */}
        <div className="flex flex-col items-start gap-4 sm:max-w-[300px] w-full sm:w-auto">
          <h1 className="text-2xl font-bold">Menú - Pizzas</h1>

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
                Estás viendo nuestras pizzas de tamaño{' '}
                <span className="font-semibold capitalize">{filter.tamanio}</span> y tipo{' '}
                <span className="font-semibold capitalize">
                  {filter.especial === 'especial' ? 'Especiales' : 'Clásicos'}
                </span>
                , cuidadosamente seleccionadas para que disfrutes el mejor sabor.
              </p>
              <p className="text-gray-600 text-sm">
                Recuerda que cada tamaño ofrece una experiencia diferente: desde la porción ideal para uno hasta opciones para compartir en familia o con amigos. ¡No dudes en explorar y descubrir tu favorita!
              </p>
            </>
          )}

          {filter.tamanio !== 'todos' && filter.especial === 'todos' && (
            <>
              <p className="text-gray-800 text-base mb-2">
                Navegando por pizzas de tamaño <span className="font-semibold capitalize">{filter.tamanio}</span>.
              </p>
              <p className="text-gray-600 text-sm">
                Cada tamaño está pensado para adaptarse a tu apetito y ocasión. Si quieres variar, también puedes probar nuestras opciones clásicas y especiales disponibles en otros tamaños.
              </p>
            </>
          )}

          {filter.tamanio === 'todos' && filter.especial !== 'todos' && (
            <>
              <p className="text-gray-800 text-base mb-2">
                Mostrando pizzas <span className="font-semibold capitalize">{filter.especial === 'especial' ? 'Especiales' : 'Clásicos'}</span> de todos los tamaños.
              </p>
              <p className="text-gray-600 text-sm">
                Ya sea que prefieras los sabores tradicionales o las combinaciones más innovadoras, aquí encontrarás opciones para todos los gustos y ocasiones. ¡Buen provecho!
              </p>
            </>
          )}

          {filter.tamanio === 'todos' && filter.especial === 'todos' && (
            <p className="text-gray-500 text-sm italic">
              Estás viendo todo nuestro menú de pizzas. Explora diferentes tamaños y sabores para encontrar tu próxima favorita.
            </p>
          )}
        </div>
      </div>

      <div className="mt-6 grid gap-4 grid-cols-[repeat(auto-fit,minmax(280px,1fr))]">
        {loading ? (
          <p>Cargando pizzas...</p>
        ) : pizzasFiltradas.length === 0 ? (
          <p>No hay pizzas disponibles para ese filtro.</p>
        ) : (
          pizzasFiltradas.map((pizza) => {
            // Lógica para productos con combinaciones
            if (pizza.combinaciones.length > 0) {
              // Primero verificamos si la pizza debería mostrarse según los filtros
              const shouldShowPizza = () => {
                const cumpleTamanio = 
                  filter.tamanio === 'todos' || 
                  pizza.combinaciones.some(c => c.tamanio_sabor.tamanio.nombre.toLowerCase() === filter.tamanio);
                
                if (filter.especial === 'todos') return cumpleTamanio;
                if (filter.especial === 'especial') {
                  return cumpleTamanio && pizza.combinaciones.some(c => c.tamanio_sabor.sabor.especial);
                }
                // 'clasico'
                return cumpleTamanio && pizza.combinaciones.some(c => !c.tamanio_sabor.sabor.especial);
              };

              if (!shouldShowPizza()) return null;

              // Seleccionamos la combinación a mostrar
              let combinacionAMostrar = pizza.combinaciones[0]; // Valor por defecto

              if (filter.tamanio !== 'todos' || filter.especial !== 'todos') {
                // Intentamos encontrar una combinación que coincida exactamente con los filtros
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
                  // Si no hay match exacto, priorizamos el filtro de tamaño
                  const sizeMatch = pizza.combinaciones.find(c => 
                    filter.tamanio === 'todos' || 
                    c.tamanio_sabor.tamanio.nombre.toLowerCase() === filter.tamanio
                  );
                  if (sizeMatch) {
                    combinacionAMostrar = sizeMatch;
                  }
                  // Si no, se queda con la primera por defecto
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
                />
              );
            }
            // Lógica original para productos con unicos
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
                />
              )
            }
            return null
          })
        )}
      </div>
    </div>
  )
}