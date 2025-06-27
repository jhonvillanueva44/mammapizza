'use client'

import Link from 'next/link';

export type ProductoCardProps = {
  id: number
  titulo: string
  descripcion: string
  precio: number
  imagen: string
  precioAntiguo?: number
  descuento?: number
  isGrid?: boolean
  especial?: boolean
  ruta?: string
  mostrarPersonalizar?: boolean,
  tamanio?: string,
  sabores?: string[] | null,
  agregados?: string[] | null
}

const ProductoCard = ({
  id,
  titulo,
  descripcion,
  precio,
  imagen,
  precioAntiguo,
  descuento,
  isGrid = false,
  especial,
  ruta = '',
  mostrarPersonalizar = true,
  tamanio = '',
  sabores = [],
  agregados = []
}: ProductoCardProps) => {
  const esPromocion = precioAntiguo !== undefined && descuento !== undefined

  const handleAddToCart = () => {
    const existingCart = sessionStorage.getItem('carrito')
    let cart = existingCart ? JSON.parse(existingCart) : []

    // Siempre agregamos un nuevo ítem, sin verificar duplicados
    cart.push({
      id,
      titulo,
      imagen,
      precio: `${precio.toFixed(2)}`,
      tamanio: tamanio || '',
      sabores: sabores || [],
      agregados: agregados || [],
      // Agregamos un ID único para cada ítem del carrito
      itemId: Date.now() + Math.random().toString(36).substring(2, 9)
    })

    sessionStorage.setItem('carrito', JSON.stringify(cart))
  }

  const getPersonalizarUrl = () => {
    if (ruta === 'bebidas') {
      return `/${ruta}/${id}`
    }
    return `/menu/${ruta}/${id}`
  }

  return (
    <div
      className={`group relative flex-shrink-0 bg-gradient-to-br from-white via-red-50/30 to-red-50/20 rounded-2xl overflow-hidden border-2 border-red-100/50 shadow-[0_8px_40px_rgba(255,0,0,0.15)] hover:shadow-[0_20px_60px_rgba(255,0,0,0.25)] transition-all duration-500 snap-start font-sans flex flex-col justify-between backdrop-blur-sm hover:-translate-y-2 hover:border-red-200/80
      ${isGrid ? 'max-w-[320px] w-full' : 'w-[200px] sm:w-[220px] lg:w-[240px]'}
      `}
    >
      <div className="absolute inset-0 bg-gradient-to-r from-red-400/5 to-red-400/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>

      <div className="relative z-10">
        <div className="relative w-full overflow-hidden rounded-t-xl">
          <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent z-10"></div>
          <img
            src={imagen}
            alt={titulo}
            className="w-full h-[160px] object-cover transition-all duration-700 group-hover:scale-110 group-hover:brightness-110"
          />

          {esPromocion && (
            <div className="absolute top-3 left-3 z-20">
              <div className="bg-gradient-to-r from-red-500 to-red-600 text-white text-xs font-semibold px-2.5 py-1 rounded-full shadow-lg animate-pulse font-sans">
                <span className="flex items-center gap-1">
                  🔥 -{descuento}%
                </span>
              </div>
            </div>
          )}

          {isGrid && !esPromocion && typeof especial === 'boolean' && (
            <div className="absolute top-3 right-3 z-20">
              <span
                className={`text-xs font-medium px-2.5 py-1 rounded-full shadow-lg backdrop-blur-sm font-sans ${especial
                  ? 'bg-gradient-to-r from-green-500 to-emerald-600 text-white'
                  : 'bg-white/90 text-gray-700 border border-gray-200'
                  }`}
              >
                {especial ? '⭐ Especial' : 'Clásico'}
              </span>
            </div>
          )}

          {mostrarPersonalizar && (
            <Link
              href={getPersonalizarUrl()}
              className="absolute bottom-3 right-3 z-20 bg-red-600 hover:bg-red-700 text-white hover:text-white text-xs font-medium px-2.5 py-1.5 rounded-full shadow-lg transition-all duration-300 hover:scale-105 cursor-pointer font-sans"
            >
              ✨ Personalizar
            </Link>
          )}
        </div>

        <div className="p-4">
          <div className="mb-3 min-h-[80px] flex flex-col justify-between">
            <h3 className="text-lg font-bold leading-tight line-clamp-2 overflow-hidden text-ellipsis h-[3.25rem] text-gray-800 group-hover:text-red-800 transition-colors duration-300 font-serif">
              {titulo}
            </h3>

            <p className="text-sm text-gray-600 mt-2 leading-relaxed line-clamp-2 h-[3rem] overflow-hidden font-serif">
              {descripcion}
            </p>
          </div>

          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <span className="text-sm font-bold bg-gradient-to-r from-red-600 to-red-600 bg-clip-text text-transparent font-sans">
                S/ {precio.toFixed(2)}
              </span>
              {esPromocion && (
                <span className="text-xs text-gray-500 line-through bg-gray-100 px-1.5 py-0.5 rounded-md font-sans">
                  S/ {precioAntiguo?.toFixed(2)}
                </span>
              )}
            </div>
            {esPromocion && (
              <div className="text-green-600 font-medium text-xs font-sans">
                ¡Ahorra S/ {(precioAntiguo! - precio).toFixed(2)}!
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="relative z-10 p-4 pt-0">
        <button
          onClick={handleAddToCart}
          className="w-full bg-red-600 hover:bg-red-700 text-white font-medium py-2.5 px-5 rounded-xl transition-all duration-300 hover:scale-105 hover:shadow-lg active:scale-95 relative overflow-hidden group/button text-sm font-sans cursor-pointer"
        >
          <span className="absolute inset-0 bg-white/20 translate-x-[-100%] group-hover/button:translate-x-[100%] transition-transform duration-500 skew-x-12"></span>
          <span className="relative flex items-center justify-center gap-2">
            Añadir al Carrito
          </span>
        </button>
      </div>

      <div className="absolute top-0 right-0 w-20 h-20 bg-gradient-to-br from-red-200/20 to-transparent rounded-full -translate-y-10 translate-x-10"></div>
      <div className="absolute bottom-0 left-0 w-16 h-16 bg-gradient-to-tr from-red-200/20 to-transparent rounded-full translate-y-8 -translate-x-8"></div>
    </div>
  )
}

export default ProductoCard
