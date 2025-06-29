'use client';
import { useState } from 'react';
// hola
// Types
type Categoria = { id: number; nombre: string };
type Producto = {
  id: number;
  nombre: string;
  precio: number;
  imagen: string;
  categoria_id: number;
  descripcion: string;
};

type ProductoPromocion = {
  producto_id: number;
  cantidad: number;
};

type Props = {
  isOpen: boolean;
  onClose: () => void;
  productosSeleccionados: ProductoPromocion[];
  productos: Producto[];
  categorias: Categoria[];
};

export default function ModalVisualizarProductos({
  isOpen,
  onClose,
  productosSeleccionados,
  productos,
  categorias,
}: Props) {

  if (!isOpen) return null;

  const getProductoInfo = (productoId: number) => {
    return productos.find(p => p.id === productoId);
  };

  const getCategoriaNombre = (categoriaId: number) => {
    return categorias.find(c => c.id === categoriaId)?.nombre || '';
  };

  const calcularTotalPromocion = () => {
    return productosSeleccionados.reduce((total, productoPromo) => {
      const producto = getProductoInfo(productoPromo.producto_id);
      return producto ? total + (Number(producto.precio) * productoPromo.cantidad) : total;
    }, 0);
  };

  const calcularTotalProductos = () => {
    return productosSeleccionados.reduce((total, productoPromo) => total + productoPromo.cantidad, 0);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Fondo oscuro */}
      <div
        className="absolute inset-0 bg-black opacity-60"
        onClick={onClose}
      />

      {/* Modal */}
      <div className="relative z-50 bg-white rounded-lg shadow-xl w-full max-w-2xl max-h-[90vh] flex flex-col overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-gray-200 bg-gray-50">
          <h2 className="text-lg font-semibold text-gray-800">
            Productos incluidos en la promoción
          </h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Contenido scrollable */}
        <div className="flex-1 p-4 overflow-y-auto">
          {productosSeleccionados.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              No hay productos en esta promoción
            </div>
          ) : (
            <div className="space-y-3">
              {productosSeleccionados.map((productoPromo) => {
                const producto = getProductoInfo(productoPromo.producto_id);
                if (!producto) return null;

                return (
                  <div key={productoPromo.producto_id} className="flex items-start gap-4 p-3 border border-gray-100 rounded-lg">
                    <div className="w-16 h-16 bg-gray-100 rounded-md overflow-hidden flex-shrink-0">
                      {producto.imagen ? (
                        <img 
                          src={producto.imagen} 
                          alt={producto.nombre}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-gray-400">
                          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                          </svg>
                        </div>
                      )}
                    </div>

                    <div className="flex-1">
                      <h3 className="font-medium text-gray-900">{producto.nombre}</h3>
                      <div className="text-sm text-gray-500 mt-1">
                        <span className="bg-blue-100 text-blue-800 px-2 py-0.5 rounded-full text-xs">
                          {getCategoriaNombre(producto.categoria_id)}
                        </span>
                      </div>
                      {producto.descripcion && (
                        <p className="text-sm text-gray-600 mt-1 line-clamp-2">
                          {producto.descripcion}
                        </p>
                      )}
                    </div>

                    <div className="text-right">
                      <div className="font-medium text-gray-900">
                        {productoPromo.cantidad} × ${Number(producto.precio).toFixed(2)}
                      </div>
                      <div className="text-sm text-gray-600">
                        Subtotal: ${(Number(producto.precio) * productoPromo.cantidad).toFixed(2)}
                      </div>
                    </div>
                  </div>
                );
              })}

              {/* Total */}
              <div className="mt-4 p-3 bg-gray-50 rounded-lg border border-gray-200">
                <div className="flex justify-between items-center">
                  <span className="font-medium">Total productos:</span>
                  <span className="font-medium">{calcularTotalProductos()}</span>
                </div>
                <div className="flex justify-between items-center mt-1">
                  <span className="font-semibold">Valor total:</span>
                  <span className="text-lg font-bold text-red-600">
                    ${calcularTotalPromocion().toFixed(2)}
                  </span>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-gray-200 flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-gray-200 hover:bg-gray-300 text-gray-800 rounded transition-colors"
          >
            Cerrar
          </button>
        </div>
      </div>
    </div>
  );
}
