'use client';

import { useState, useEffect, useRef } from 'react';
import HeaderAdmin from '@/components/adminComponents/HeaderAdmin';
import Topbar from '@/components/adminComponents/Topbar';
import Alert from '@/components/adminComponents/Alert';
import ConfirmationModal from '@/components/adminComponents/ConfirmationModal';
import LoadingSpinner from '@/components/adminComponents/LoadingSpinner';
import ModalPizza from '@/adminModals/ModalPizza';
import ModalPCA from '@/adminModals/ModalPCA';
import ModalBA from '@/adminModals/ModalBA';

type Producto = {
  id: number;
  nombre: string;
  precio: number;
  stock: number;
  categoria_id: number;
  destacado: boolean;
  habilitado: boolean;
  descripcion: string;
  impuesto: number;
  descuento: number;
  imagen: string;
  unico_sabor: boolean | null;
  tamanio_sabor_ids: number[];
};

type Categoria = {
  id: number;
  nombre: string;
};

export default function CrudProductoPage() {
  const [productos, setProductos] = useState<Producto[]>([]);
  const [categorias, setCategorias] = useState<Categoria[]>([]);
  const [categoriaId, setCategoriaId] = useState<number | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [itemToDelete, setItemToDelete] = useState<number | null>(null);
  const [showProductModal, setShowProductModal] = useState(false);
  const [selectedModalCategory, setSelectedModalCategory] = useState<number | null>(null);
  const [modoEdicion, setModoEdicion] = useState(false);
  const [productoEditando, setProductoEditando] = useState<Producto | null>(null);

  const API_BASE_URL = 'http://localhost:4000/api';
  const PRODUCTOS_URL = `${API_BASE_URL}/productos`;
  const CATEGORIAS_URL = `${API_BASE_URL}/categorias`;
  const UPLOADS_URL = `${API_BASE_URL}/uploads`;

  const fetchData = async () => {
    try {
      setLoading(true);
      const [productosRes, categoriasRes] = await Promise.all([
        fetch(PRODUCTOS_URL),
        fetch(CATEGORIAS_URL)
      ]);

      if (!productosRes.ok || !categoriasRes.ok) {
        throw new Error('Error al cargar datos');
      }

      const [productosData, categoriasData] = await Promise.all([
        productosRes.json(),
        categoriasRes.json()
      ]);

      setProductos(productosData);
      setCategorias(categoriasData);
      setError(null);
    } catch (e: any) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleAddProduct = () => {
    setModoEdicion(false);
    setProductoEditando(null);
    setSelectedModalCategory(null);
    setShowProductModal(true);
  };

  const handleEditar = (producto: Producto) => {
    setModoEdicion(true);
    setProductoEditando(producto);
    setSelectedModalCategory(producto.categoria_id);
    setShowProductModal(true);
  };

  const handleEliminarClick = (id: number) => {
    setItemToDelete(id);
    setShowDeleteModal(true);
  };

  const handleConfirmDelete = async () => {
    if (!itemToDelete) return;
    try {
      setLoading(true);
      const res = await fetch(`${PRODUCTOS_URL}/${itemToDelete}`, { method: 'DELETE' });
      if (!res.ok) throw new Error('Error al eliminar producto');
      setSuccess('Producto eliminado correctamente');
      await fetchData();
    } catch (e: any) {
      setError(e.message);
    } finally {
      setLoading(false);
      setShowDeleteModal(false);
      setItemToDelete(null);
    }
  };

  const handleSuccess = (msg: string) => {
    setSuccess(msg);
    fetchData();
    setShowProductModal(false);
    setSelectedModalCategory(null);
  };

  const formatPrice = (price: number) => `$${Number(price).toFixed(2)}`;
  const formatNumber = (num: number | null) => (num !== null ? num.toString() : '-');
  const formatBoolean = (val: boolean) => val ? 'Sí' : 'No';

  const getCategoriaNombre = (id: number) => {
    return categorias.find(c => c.id === id)?.nombre || '-';
  };

  const getSaborInfo = (producto: Producto) => {
    if (producto.categoria_id !== 1) return '-';
    if (producto.unico_sabor === true) return 'Sabor único';
    if (producto.unico_sabor === false) return 'Combinación';
    return 'Sin sabor definido';
  };

  const renderProductModal = () => {
    if (!showProductModal) return null;
    
    const commonProps = {
      isOpen: showProductModal,
      onClose: () => {
        setShowProductModal(false);
        setSelectedModalCategory(null);
      },
      loading: loading,
      modoEdicion: modoEdicion,
      productoEditando: productoEditando,
      onError: setError,
      onSave: handleSuccess,
      refreshProductos: fetchData,
      categorias: categorias,
      onCategoryChange: (categoryId: number) => {
        if (modoEdicion && productoEditando?.categoria_id !== categoryId) {
          setProductoEditando(null);
          setModoEdicion(false);
        }
        setSelectedModalCategory(categoryId);
      },
      selectedCategory: selectedModalCategory
    };

    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center">
        <div className="absolute inset-0 bg-black bg-opacity-60" onClick={commonProps.onClose} />
        
        <div className="relative z-50 bg-white rounded-lg shadow-lg p-6 w-full max-w-5xl mx-4 border-2 border-red-500 max-h-[90vh] overflow-y-auto">
          {/* Selector de categoría */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-1">Categoría *</label>
            <select
              value={selectedModalCategory || ''}
              onChange={(e) => commonProps.onCategoryChange(parseInt(e.target.value))}
              className="w-full border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-red-500 cursor-pointer"
              disabled={modoEdicion}
            >
              <option value="">Seleccione una categoría</option>
              {categorias.map((categoria) => (
                <option key={categoria.id} value={categoria.id}>
                  {categoria.nombre}
                </option>
              ))}
            </select>
          </div>

          {selectedModalCategory ? (
            <>
              {selectedModalCategory === 1 && <ModalPizza {...commonProps} />}
              {selectedModalCategory === 2 && <ModalPCA {...commonProps} tipoProducto="Calzone" categoriaId={2} />}
              {selectedModalCategory === 3 && <ModalPCA {...commonProps} tipoProducto="Pasta" categoriaId={3} />}
              {selectedModalCategory === 4 && <ModalPCA {...commonProps} tipoProducto="Agregado" categoriaId={4} />}
              {selectedModalCategory === 6 && <ModalBA {...commonProps} tipoProducto="Adicional" />}
              {selectedModalCategory === 7 && <ModalBA {...commonProps} tipoProducto="Bebida" />}
            </>
          ) : (
            <div className="text-center py-8 text-gray-500">
              Seleccione una categoría para continuar
            </div>
          )}
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen flex bg-gray-50">
      <HeaderAdmin />

      <div className="flex-1 overflow-auto min-w-0">
        <Topbar title="Gestión de Productos" />

        <main className="p-6 space-y-6">
          {error && <Alert message={error} onClose={() => setError(null)} type="error" />}
          {success && <Alert message={success} onClose={() => setSuccess(null)} type="success" />}

          <ConfirmationModal
            message="¿Estás seguro de eliminar este producto?"
            isOpen={showDeleteModal}
            onClose={() => setShowDeleteModal(false)}
            onConfirm={handleConfirmDelete}
            title="Confirmar eliminación"
          />

          {renderProductModal()}

          <div className="flex justify-between items-center mb-6">
            <div className="flex items-center space-x-4">
              <h2 className="text-2xl font-semibold text-gray-800">Listado de Productos</h2>
              <select
                className="border border-gray-300 rounded-md px-3 py-1 text-sm focus:outline-none focus:ring-2 focus:ring-red-500 cursor-pointer"
                value={categoriaId || ''}
                onChange={(e) => setCategoriaId(e.target.value ? parseInt(e.target.value) : null)}
              >
                <option value="">Todas las categorías</option>
                {categorias.map((categoria) => (
                  <option key={categoria.id} value={categoria.id}>{categoria.nombre}</option>
                ))}
              </select>
            </div>
            
            <button
              onClick={handleAddProduct}
              className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-md shadow-sm transition-colors duration-200 flex items-center gap-2 cursor-pointer"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10 5a1 1 0 011 1v3h3a1 1 0 110 2h-3v3a1 1 0 11-2 0v-3H6a1 1 0 110-2h3V6a1 1 0 011-1z" clipRule="evenodd" />
              </svg>
              Agregar Producto
            </button>
          </div>

          <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
            {loading && productos.length === 0 ? (
              <div className="flex justify-center py-12">
                <LoadingSpinner size={10} />
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Imagen
                      </th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Nombre
                      </th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Categoría
                      </th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Precio
                      </th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Stock
                      </th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Tipo
                      </th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Destacado
                      </th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Habilitado
                      </th>
                      <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Acciones
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {productos
                      .filter(producto => categoriaId ? producto.categoria_id === categoriaId : true)
                      .map((producto) => (
                        <tr key={producto.id} className="hover:bg-gray-50 transition-colors">
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="w-12 h-12">
                              <img 
                                src={producto.imagen 
                                  ? producto.imagen.startsWith('/uploads/') 
                                    ? `${UPLOADS_URL}${producto.imagen.replace('/uploads', '')}`
                                    : producto.imagen
                                  : `${UPLOADS_URL}/default.jpeg`}
                                alt={producto.nombre}
                                className="w-full h-full object-cover rounded"
                              />
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="text-sm font-medium text-gray-900">{producto.nombre}</div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="text-sm text-gray-900">{getCategoriaNombre(producto.categoria_id)}</div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="text-sm text-gray-900">{formatPrice(producto.precio)}</div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="text-sm text-gray-900">{formatNumber(producto.stock)}</div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="text-sm text-gray-900">{getSaborInfo(producto)}</div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="text-sm text-gray-900">{formatBoolean(producto.destacado)}</div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="text-sm text-gray-900">{formatBoolean(producto.habilitado)}</div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                            <div className="flex justify-end space-x-3">
                              <button
                                onClick={() => handleEditar(producto)}
                                className="text-indigo-600 hover:text-indigo-900 transition-colors cursor-pointer"
                                disabled={loading}
                              >
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                                  <path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z" />
                                </svg>
                              </button>
                              <button
                                onClick={() => handleEliminarClick(producto.id)}
                                className="text-red-600 hover:text-red-900 transition-colors cursor-pointer"
                                disabled={loading}
                              >
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                                  <path fillRule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd" />
                                </svg>
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    {productos.length === 0 && !loading && (
                      <tr>
                        <td colSpan={9} className="px-6 py-8 text-center">
                          <div className="flex flex-col items-center justify-center text-gray-500">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 opacity-50 mb-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                            </svg>
                            <p className="text-lg font-medium">No hay productos registrados</p>
                            <p className="text-sm mt-1">Comienza agregando un nuevo producto</p>
                          </div>
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