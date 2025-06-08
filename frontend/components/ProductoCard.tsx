'use client'

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
}: ProductoCardProps) => {
  const esPromocion = precioAntiguo !== undefined && descuento !== undefined

  const handleAddToCart = () => {
    const existingCart = sessionStorage.getItem('carrito')
    let cart = existingCart ? JSON.parse(existingCart) : []

    const existingProductIndex = cart.findIndex((item: any) => item.id === id)

    if (existingProductIndex !== -1) {
      cart[existingProductIndex].cantidad += 1
    } else {
      cart.push({
        id,
        titulo,
        precio,
        imagen,
        cantidad: 1,
      })
    }

    sessionStorage.setItem('carrito', JSON.stringify(cart))
  }

  return (
    <div
      className={`flex-shrink-0 bg-white rounded-xl p-4 border border-gray-600 shadow-[0_5px_25px_rgba(0,0,0,0.15)] transition-all duration-300 snap-start font-[Poppins] flex flex-col justify-between
      ${isGrid ? 'max-w-[300px] w-full' : 'w-[180px] sm:w-[200px] lg:w-[220px]'}
      `}
    >
      <div>
        <div className="relative w-full overflow-hidden rounded-md group">
          <img
            src={imagen}
            alt={titulo}
            className="w-full h-[140px] object-cover rounded-md transition-transform duration-300 group-hover:scale-110"
          />

          {/* Si es promoción, mostrar badge de descuento */}
          {esPromocion && (
            <span className="absolute top-2 left-2 text-white text-xs px-2 py-1 bg-red-600 rounded">
              -{descuento}%
            </span>
          )}

          {/* Mostrar badge de Especial/Clásico solo si es Grid y NO es promoción */}
          {isGrid && !esPromocion && typeof especial === 'boolean' && (
            <span
              className={`absolute top-2 right-2 text-xs px-2 py-1 rounded font-semibold ${
                especial ? 'bg-green-600 text-white' : 'bg-gray-300 text-gray-700'
              } select-none`}
            >
              {especial ? 'Especial' : 'Clásico'}
            </span>
          )}
        </div>

        {/* Título y descripción */}
        <div className="mt-2 h-[100px] flex flex-col justify-between">
          <h3 className="text-base font-semibold leading-snug line-clamp-2 overflow-hidden">
            {titulo}
          </h3>

          <p className="text-sm text-gray-600 mt-1 leading-snug line-clamp-2 overflow-hidden">
            {descripcion}
          </p>
        </div>

        {/* Precio actual y anterior */}
        <div className="flex items-center gap-2 mt-2">
          <p className="text-base font-bold text-[#5E3527]">${precio.toFixed(2)}</p>
          {esPromocion && (
            <p className="text-sm text-gray-500 line-through">${precioAntiguo?.toFixed(2)}</p>
          )}
        </div>
      </div>

      {/* Botón de añadir al carrito */}
      <button
        onClick={handleAddToCart}
        className="mt-3 bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-2xl text-sm w-full cursor-pointer"
      >
        Añadir al Carrito
      </button>
    </div>
  )
}

export default ProductoCard
