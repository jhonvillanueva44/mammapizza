'use client'

import { useEffect, useState } from 'react'
import ProductoCard from '@/components/ProductoCard'

interface DetallePromocion {
  id: number
  cantidad: number
  producto_id: number
  producto: {
    id: number
    nombre: string
  }
}

interface Promocion {
  id: number
  nombre: string
  descripcion: string
  precio: string
  imagen?: string
  descuento?: number | null
  detalles_promocion?: DetallePromocion[]
}

export default function MenuPromosPage() {
  const [promos, setPromos] = useState<Promocion[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchPromociones = async () => {
      try {
        const res = await fetch(`${process.env.NEXT_PUBLIC_BACK_HOST}api/promociones`)
        const data = await res.json()
        setPromos(data)
      } catch (error) {
        console.error('Error al obtener promociones:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchPromociones()
  }, [])

  const transformarProductos = (detalles: DetallePromocion[] = []): Record<number, [string, number]>[] => {
    return detalles.map(detalle => ({
      [detalle.producto_id]: [detalle.producto.nombre, detalle.cantidad]
    }))
  }

  return (
    <div className="min-h-screen font-['Inter'] bg-gradient-to-br from-red-50/30 via-white to-red-50/20">
      <div className="py-8 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="bg-white rounded-2xl shadow-xl border border-red-100 p-6 md:p-8">
            <div className="flex flex-col lg:flex-row items-start lg:items-center gap-6">
              <div className="flex flex-col items-start gap-6 lg:max-w-[400px] w-full lg:w-auto">
                <div className="space-y-4">
                  <h1 className="text-3xl font-bold text-gray-800 font-['Playfair_Display'] flex items-center gap-3">
                    <span className="w-3 h-3 bg-red-600 rounded-full"></span>
                    Menú - Promociones
                  </h1>
                </div>
              </div>

              <div className="flex-1 lg:pl-8 lg:border-l-2 lg:border-red-100 w-full">
                <div className="bg-gradient-to-r from-red-50 to-red-50/50 rounded-xl p-6">
                  <div className="text-center py-4">
                    <div className="text-4xl mb-3">🎉</div>
                    <p className="text-gray-800 text-base mb-4 font-medium">
                      Explora nuestras promociones exclusivas, diseñadas para disfrutar en familia o con amigos.
                    </p>
                    <p className="text-gray-600 text-sm font-['Open_Sans'] leading-relaxed">
                      Combos irresistibles con precios especiales, solo por tiempo limitado. Aprovecha estas ofertas únicas y comparte momentos especiales con los mejores sabores.
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
                <p className="text-lg text-gray-600 font-['Open_Sans']">Cargando promociones especiales...</p>
              </div>
            </div>
          ) : promos.length === 0 ? (
            <div className="text-center py-16">
              <div className="text-6xl mb-4">🎉</div>
              <h3 className="text-2xl font-bold text-gray-800 font-['Playfair_Display'] mb-2">
                ¡Ups! No hay promociones disponibles
              </h3>
              <p className="text-gray-600 font-['Open_Sans']">
                No hay promociones disponibles en este momento. Vuelve pronto para ver nuestras ofertas especiales.
              </p>
            </div>
          ) : (
            <>
              <div className="text-center mb-8">
                <h2 className="text-2xl font-bold text-gray-800 font-['Playfair_Display'] mb-2">
                  Ofertas Especiales
                </h2>
              </div>
              
              <div className="grid gap-6 grid-cols-[repeat(auto-fit,minmax(300px,1fr))]">
                {promos.map((promo) => {
                  const precioActual = parseFloat(promo.precio)
                  const descuento = promo.descuento ?? 0
                  const precioAntiguo = descuento > 0 
                    ? +(precioActual / (1 - descuento / 100)).toFixed(2) 
                    : undefined

                  return (
                    <ProductoCard
                      key={promo.id}
                      id={promo.id}
                      titulo={promo.nombre}
                      descripcion={promo.descripcion}
                      precio={precioActual}
                      imagen={promo.imagen || '/images/card-pizza.jpg'}
                      precioAntiguo={precioAntiguo}
                      descuento={descuento || undefined}
                      isGrid={true}
                      mostrarPersonalizar={false}
                      productos={transformarProductos(promo.detalles_promocion)}
                    />
                  )
                })}
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  )
}