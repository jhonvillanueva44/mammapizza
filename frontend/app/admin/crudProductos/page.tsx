'use client';

import { useState, useEffect } from 'react';
import HeaderAdmin from '@/components/adminComponents/HeaderAdmin';
import Topbar from '@/components/adminComponents/Topbar';
import Alert from '@/components/adminComponents/Alert';
import ConfirmationModal from '@/components/adminComponents/ConfirmationModal';
import LoadingSpinner from '@/components/adminComponents/LoadingSpinner';

type Producto = {
  id: number;
  nombre: string;
  precio: number | null;
  stock: number | null;
  imagen: string | null;
  descripcion: string | null;
  impuesto: number | null;
  descuento: number | null;
  destacado: boolean;
  habilitado: boolean;
  unico_sabor: boolean;
};

export default function CrudProductoPage() {
  const [productos, setProductos] = useState<Producto[]>([]);
  const [nombre, setNombre] = useState('');
  const [precio, setPrecio] = useState<number | null>(null);
  const [stock, setStock] = useState<number | null>(null);
  const [imagen, setImagen] = useState('');
  const [descripcion, setDescripcion] = useState('');
  const [impuesto, setImpuesto] = useState<number | null>(null);
  const [descuento, setDescuento] = useState<number | null>(null);
  const [destacado, setDestacado] = useState(false);
  const [habilitado, setHabilitado] = useState(true);
  const [unicoSabor, setUnicoSabor] = useState(true);
  const [modoEdicion, setModoEdicion] = useState(false);
  const [idEditando, setIdEditando] = useState<number | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [itemToDelete, setItemToDelete] = useState<number | null>(null);

  const API_BASE_URL = 'http://localhost:4000/api/productos';

  const fetchProductos = async () => {
    try {
      setLoading(true);
      const res = await fetch(API_BASE_URL);
      if (!res.ok) throw new Error('Error al cargar productos');
      const data = await res.json();
      setProductos(data);
      setError(null);
    } catch (e: any) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProductos();
  }, []);

  const handleGuardar = async () => {
    if (!nombre.trim()) {
      setError('El nombre es obligatorio');
      return;
    }

    const productoPayload = {
      nombre: nombre.trim(),
      precio: precio,
      stock: stock,
      imagen: imagen.trim(),
      descripcion: descripcion.trim(),
      impuesto: impuesto,
      descuento: descuento,
      destacado: destacado,
      habilitado: habilitado,
      unico_sabor: unicoSabor
    };

    try {
      setLoading(true);
      if (modoEdicion && idEditando !== null) {
        const res = await fetch(`${API_BASE_URL}/${idEditando}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(productoPayload),
        });
        if (!res.ok) {
          const err = await res.json();
          throw new Error(err.error || 'Error al actualizar producto');
        }
        setSuccess('Producto actualizado correctamente');
      } else {
        const res = await fetch(API_BASE_URL, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(productoPayload),
        });
        if (!res.ok) {
          const err = await res.json();
          throw new Error(err.error || 'Error al crear producto');
        }
        setSuccess('Producto creado correctamente');
      }

      await fetchProductos();
      setModoEdicion(false);
      setIdEditando(null);
      resetForm();
      setError(null);
    } catch (e: any) {
      setError(e.message);
      setSuccess(null);
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setNombre('');
    setPrecio(null);
    setStock(null);
    setImagen('');
    setDescripcion('');
    setImpuesto(null);
    setDescuento(null);
    setDestacado(false);
    setHabilitado(true);
    setUnicoSabor(true);
  };

  const handleEditar = (producto: Producto) => {
    setModoEdicion(true);
    setIdEditando(producto.id);
    setNombre(producto.nombre);
    setPrecio(producto.precio);
    setStock(producto.stock);
    setImagen(producto.imagen || '');
    setDescripcion(producto.descripcion || '');
    setImpuesto(producto.impuesto);
    setDescuento(producto.descuento);
    setDestacado(producto.destacado);
    setHabilitado(producto.habilitado);
    setUnicoSabor(producto.unico_sabor);
  };

  const handleEliminarClick = (id: number) => {
    setItemToDelete(id);
    setShowDeleteModal(true);
  };

  const handleConfirmDelete = async () => {
    if (!itemToDelete) return;

    try {
      setLoading(true);
      const res = await fetch(`${API_BASE_URL}/${itemToDelete}`, { 
        method: 'DELETE' 
      });
      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.error || 'Error al eliminar producto');
      }
      setSuccess('Producto eliminado correctamente');
      await fetchProductos();
      setError(null);
    } catch (e: any) {
      setError(e.message);
      setSuccess(null);
    } finally {
      setLoading(false);
      setShowDeleteModal(false);
      setItemToDelete(null);
    }
  };

  const formatPrice = (price: number | string | null): string => {
  const num = typeof price === 'string' ? parseFloat(price) : price;
  return num !== null && !isNaN(num) ? `$${num.toFixed(2)}` : '-';
};


  const formatNumber = (num: number | null): string => {
    return num !== null ? num.toString() : '-';
  };

  // Función para manejar cambios en inputs numéricos
  const handleNumberChange = (
    e: React.ChangeEvent<HTMLInputElement>,
    setter: React.Dispatch<React.SetStateAction<number | null>>
  ) => {
    const value = e.target.value;
    setter(value === '' ? null : parseFloat(value));
  };

  return (
    <div className="min-h-screen bg-gray-50 flex">
      <HeaderAdmin />
      <div className="flex-1 overflow-auto">
        <Topbar title="Gestión de Productos" />

        <main className="p-6 space-y-6">
          {/* Alertas */}
          {error && (
            <Alert
              type="error"
              message={error}
              onClose={() => setError(null)}
            />
          )}
          
          {success && (
            <Alert
              type="success"
              message={success}
              onClose={() => setSuccess(null)}
            />
          )}

          {/* Modal de confirmación para eliminar */}
          <ConfirmationModal
            isOpen={showDeleteModal}
            onClose={() => setShowDeleteModal(false)}
            onConfirm={handleConfirmDelete}
            title="Confirmar eliminación"
            message="¿Estás seguro de que deseas eliminar este producto? Esta acción no se puede deshacer."
            confirmText="Eliminar"
          />

          {/* Formulario */}
          <div className="bg-white p-6 rounded-lg shadow">
            <h2 className="text-xl font-bold mb-4">
              {modoEdicion ? 'Editar Producto' : 'Agregar Producto'}
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Nombre del Producto *
                </label>
                <input
                  type="text"
                  placeholder="Ej: Pizza Margarita, Hamburguesa, etc."
                  value={nombre}
                  onChange={(e) => setNombre(e.target.value)}
                  className="w-full border border-gray-300 rounded px-4 py-2 focus:ring-2 focus:ring-red-500 focus:border-red-500 outline-none transition"
                  disabled={loading}
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Precio
                </label>
                <input
                  type="number"
                  placeholder="Precio del producto"
                  value={precio ?? ''}
                  onChange={(e) => handleNumberChange(e, setPrecio)}
                  className="w-full border border-gray-300 rounded px-4 py-2 focus:ring-2 focus:ring-red-500 focus:border-red-500 outline-none transition"
                  disabled={loading}
                  step="0.01"
                  min="0"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Stock
                </label>
                <input
                  type="number"
                  placeholder="Cantidad en stock"
                  value={stock ?? ''}
                  onChange={(e) => handleNumberChange(e, setStock)}
                  className="w-full border border-gray-300 rounded px-4 py-2 focus:ring-2 focus:ring-red-500 focus:border-red-500 outline-none transition"
                  disabled={loading}
                  min="0"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  URL de la Imagen
                </label>
                <input
                  type="text"
                  placeholder="URL de la imagen del producto"
                  value={imagen}
                  onChange={(e) => setImagen(e.target.value)}
                  className="w-full border border-gray-300 rounded px-4 py-2 focus:ring-2 focus:ring-red-500 focus:border-red-500 outline-none transition"
                  disabled={loading}
                />
              </div>
              
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Descripción
                </label>
                <textarea
                  placeholder="Descripción del producto"
                  value={descripcion}
                  onChange={(e) => setDescripcion(e.target.value)}
                  className="w-full border border-gray-300 rounded px-4 py-2 focus:ring-2 focus:ring-red-500 focus:border-red-500 outline-none transition"
                  disabled={loading}
                  rows={3}
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Impuesto (%)
                </label>
                <input
                  type="number"
                  placeholder="Porcentaje de impuesto"
                  value={impuesto ?? ''}
                  onChange={(e) => handleNumberChange(e, setImpuesto)}
                  className="w-full border border-gray-300 rounded px-4 py-2 focus:ring-2 focus:ring-red-500 focus:border-red-500 outline-none transition"
                  disabled={loading}
                  min="0"
                  max="100"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Descuento (%)
                </label>
                <input
                  type="number"
                  placeholder="Porcentaje de descuento"
                  value={descuento ?? ''}
                  onChange={(e) => handleNumberChange(e, setDescuento)}
                  className="w-full border border-gray-300 rounded px-4 py-2 focus:ring-2 focus:ring-red-500 focus:border-red-500 outline-none transition"
                  disabled={loading}
                  min="0"
                  max="100"
                />
              </div>
              
              <div className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  id="destacado"
                  checked={destacado}
                  onChange={(e) => setDestacado(e.target.checked)}
                  className="h-4 w-4 text-red-600 focus:ring-red-500 border-gray-300 rounded"
                  disabled={loading}
                />
                <label htmlFor="destacado" className="text-sm font-medium text-gray-700">
                  Producto destacado
                </label>
              </div>
              
              <div className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  id="habilitado"
                  checked={habilitado}
                  onChange={(e) => setHabilitado(e.target.checked)}
                  className="h-4 w-4 text-red-600 focus:ring-red-500 border-gray-300 rounded"
                  disabled={loading}
                />
                <label htmlFor="habilitado" className="text-sm font-medium text-gray-700">
                  Producto habilitado
                </label>
              </div>
              
              <div className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  id="unicoSabor"
                  checked={unicoSabor}
                  onChange={(e) => setUnicoSabor(e.target.checked)}
                  className="h-4 w-4 text-red-600 focus:ring-red-500 border-gray-300 rounded"
                  disabled={loading}
                />
                <label htmlFor="unicoSabor" className="text-sm font-medium text-gray-700">
                  Único sabor
                </label>
              </div>
            </div>

            <div className="mt-6 flex justify-end space-x-3">
              {modoEdicion && (
                <button
                  onClick={() => {
                    setModoEdicion(false);
                    setIdEditando(null);
                    resetForm();
                    setError(null);
                  }}
                  className="px-4 py-2 text-gray-600 hover:text-gray-800 font-medium rounded-md border border-gray-300 hover:bg-gray-50 transition-colors"
                  disabled={loading}
                >
                  Cancelar
                </button>
              )}
              <button
                onClick={handleGuardar}
                className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white font-medium rounded-md transition-colors flex items-center justify-center min-w-[100px]"
                disabled={loading}
              >
                {loading ? (
                  <LoadingSpinner size={6} />
                ) : modoEdicion ? (
                  'Actualizar'
                ) : (
                  'Guardar'
                )}
              </button>
            </div>
          </div>

          {/* Tabla */}
          <div className="bg-white p-6 rounded-lg shadow">
            <h2 className="text-xl font-bold mb-4">Lista de Productos</h2>

            {loading ? (
              <div className="flex justify-center py-8">
                <LoadingSpinner size={8} />
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full table-auto">
                  <thead>
                    <tr className="bg-gray-100 text-left">
                      <th className="px-4 py-3 font-semibold text-gray-700">Nombre</th>
                      <th className="px-4 py-3 font-semibold text-gray-700">Precio</th>
                      <th className="px-4 py-3 font-semibold text-gray-700">Stock</th>
                      <th className="px-4 py-3 font-semibold text-gray-700">Destacado</th>
                      <th className="px-4 py-3 font-semibold text-gray-700">Habilitado</th>
                      <th className="px-4 py-3 font-semibold text-gray-700">Acciones</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    {productos.map((producto) => (
                      <tr key={producto.id} className="hover:bg-gray-50">
                        <td className="px-4 py-3">{producto.nombre}</td>
                        <td className="px-4 py-3">{formatPrice(producto.precio)}</td>
                        <td className="px-4 py-3">{formatNumber(producto.stock)}</td>
                        <td className="px-4 py-3">
                          {producto.destacado ? (
                            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                              Sí
                            </span>
                          ) : (
                            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                              No
                            </span>
                          )}
                        </td>
                        <td className="px-4 py-3">
                          {producto.habilitado ? (
                            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                              Sí
                            </span>
                          ) : (
                            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800">
                              No
                            </span>
                          )}
                        </td>
                        <td className="px-4 py-3">
                          <div className="flex space-x-3">
                            <button
                              onClick={() => handleEditar(producto)}
                              className="text-blue-600 hover:text-blue-800 transition-colors font-medium"
                              disabled={loading}
                            >
                              Editar
                            </button>
                            <button
                              onClick={() => handleEliminarClick(producto.id)}
                              className="text-red-600 hover:text-red-800 transition-colors font-medium"
                              disabled={loading}
                            >
                              Eliminar
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                    {productos.length === 0 && (
                      <tr>
                        <td colSpan={6} className="px-4 py-6 text-center text-gray-500">
                          No hay productos registrados.
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </main>
      </div>
    </div>
  );
}