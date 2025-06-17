'use client'

import { useEffect, useState } from 'react'
import ProductoCard from '@/components/ProductoCard'

interface Promocion {
  id: number
  nombre: string
  descripcion: string
  precio: string
  imagen?: string
  descuento?: number | null
}

export default function MenuPromosPage() {
  const [promos, setPromos] = useState<Promocion[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchPromociones = async () => {
      try {
        const res = await fetch('http://localhost:4000/api/promociones')
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

  return (
    <div className="min-h-screen p-6 sm:p-10 font-[var(--font-geist-sans)]">
      {/* Encabezado */}
      <div className="max-w-3xl mb-6">
        <h1 className="text-3xl font-bold mb-2">Menú - Promociones</h1>
        <p className="text-gray-700 text-base">
          Explora nuestras promociones exclusivas, diseñadas para disfrutar en familia o con amigos.
          Combos irresistibles con precios especiales, solo por tiempo limitado.
        </p>
      </div>

      {/* Grid de promociones */}
      <div className="mt-6 grid gap-4 grid-cols-[repeat(auto-fit,minmax(280px,1fr))]">
        {loading ? (
          <p>Cargando promociones...</p>
        ) : promos.length === 0 ? (
          <p>No hay promociones disponibles en este momento.</p>
        ) : (
          promos.map((promo) => {
            const precioActual = parseFloat(promo.precio)
            const descuento = promo.descuento ?? 0
            const precioAntiguo =
              descuento > 0 ? +(precioActual / (1 - descuento / 100)).toFixed(2) : undefined

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
              />
            )
          })
        )}
      </div>
    </div>
  )
}
