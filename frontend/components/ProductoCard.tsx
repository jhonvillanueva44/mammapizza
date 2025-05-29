'use client'

import { useCart } from './CartContext'

export type ProductoCardProps = {
  id: string
  titulo: string
  descripcion: string
  precio: number
  imagen: string
  precioAntiguo?: number
  descuento?: number
}

const ProductoCard = ({
  id,
  titulo,
  descripcion,
  precio,
  imagen,
  precioAntiguo,
  descuento,
}: ProductoCardProps) => {
  const { addToCart } = useCart()
  const esPromocion = precioAntiguo !== undefined && descuento !== undefined

  const handleAddToCart = () => {
    addToCart({
      id,
      titulo,
      precio,
      imagen,
    })
  }

  return (
    <div className="flex-shrink-0 bg-white rounded-xl p-4 w-[180px] sm:w-[200px] lg:w-[220px] border border-gray-600 shadow-[0_5px_25px_rgba(0,0,0,0.15)] transition-all duration-300 snap-start font-[Poppins] flex flex-col justify-between">
      <div>
        <div className="relative w-full overflow-hidden rounded-md group">
          <img
            src={imagen}
            alt={titulo}
            className="w-full h-[140px] object-cover rounded-md transition-transform duration-300 group-hover:scale-110"
          />
          {esPromocion && (
            <span className="absolute top-2 left-2 text-white text-xs px-2 py-1 bg-red-600 rounded">
              -{descuento}%
            </span>
          )}
        </div>

        <div className="mt-2 min-h-[100px] flex flex-col justify-between">
          <h3 className="text-base font-semibold leading-snug line-clamp-2 overflow-hidden">
            {titulo}
          </h3>

          <p className="text-sm text-gray-600 mt-1 leading-snug line-clamp-2 overflow-hidden">
            {descripcion}
          </p>

          <div className="flex items-center gap-2 mt-2">
            <p className="text-base font-bold text-[#5E3527]">${precio.toFixed(2)}</p>
            {esPromocion && (
              <p className="text-sm text-gray-500 line-through">${precioAntiguo?.toFixed(2)}</p>
            )}
          </div>
        </div>
      </div>

      <button 
        onClick={handleAddToCart}
        className="mt-3 bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-2xl text-sm w-full"
      >
        Añadir al Carrito
      </button>
    </div>
  )
}

export default ProductoCard