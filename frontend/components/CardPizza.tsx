interface CardPromoProps {
  title: string;
  description: string;
  price: string;
  oldPrice: string;
  imageUrl: string;
  discount?: string;
}

export default function CardPromo({
  title,
  description,
  price,
  oldPrice,
  imageUrl,
  discount = "-45%",
}: CardPromoProps) {
  return (
    <div
      className="flex-shrink-0 bg-white rounded-xl p-4 
      w-[180px] sm:w-[200px] lg:w-[220px]
      shadow-[0_5px_25px_rgba(0,0,0,0.35)]
hover:shadow-[0_8px_35px_rgba(0,0,0,0.5)]

      hover:scale-105 
      transition-all duration-300 snap-start"
    >
      <div className="relative w-full">
        <img
          src={imageUrl}
          alt={title}
          className="w-full h-[140px] object-cover rounded-md"
        />
        <span className="absolute top-2 left-2 text-white text-xs px-2 py-1 bg-[#BF7645] rounded">
          {discount}
        </span>
      </div>

      <div className="mt-4">
        <h3 className="text-lg font-semibold">{title}</h3>
        <p className="text-sm text-gray-600 mt-1">{description}</p>
        <div className="flex items-center gap-2 mt-2">
          <p className="text-base font-bold text-green-600">{price}</p>
          <p className="text-sm text-gray-500 line-through">{oldPrice}</p>
        </div>
        <button className="mt-4 bg-[#5E3527] hover:bg-[#35231d] text-white px-4 py-2 rounded-2xl text-sm w-full">
          Agregar al Carrito
        </button>
      </div>
    </div>
  );
}
