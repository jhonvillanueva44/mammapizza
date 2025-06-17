//page.tsx
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
              className="w-full border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-red-500"
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
    <div className="min-h-screen bg-gray-50 flex">
      <HeaderAdmin />
      <div className="flex-1 overflow-auto">
        <Topbar title="Gestión de Productos" />
        <main className="p-6 space-y-6">
          {error && <Alert type="error" message={error} onClose={() => setError(null)} />}
          {success && <Alert type="success" message={success} onClose={() => setSuccess(null)} />}

          <ConfirmationModal
            isOpen={showDeleteModal}
            onClose={() => setShowDeleteModal(false)}
            onConfirm={handleConfirmDelete}
            title="Confirmar eliminación"
            message="¿Estás seguro de que deseas eliminar este producto?"
            confirmText="Eliminar"
          />

          {renderProductModal()}

          <div className="bg-white p-6 rounded-lg shadow">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-bold">Lista de Productos</h2>
              <div className="flex items-center space-x-4">
                <button
                  onClick={handleAddProduct}
                  className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
                >
                  Agregar Producto
                </button>
              </div>
            </div>

            {loading ? (
              <div className="flex justify-center py-8"><LoadingSpinner size={8} /></div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full table-auto">
                  <thead>
                    <tr className="bg-gray-100 text-left">
                      <th className="px-4 py-3">Imagen</th>
                      <th className="px-4 py-3">Nombre</th>
                      <th className="px-4 py-3">Categoría</th>
                      <th className="px-4 py-3">Precio</th>
                      <th className="px-4 py-3">Stock</th>
                      <th className="px-4 py-3">Tipo</th>
                      <th className="px-4 py-3">Destacado</th>
                      <th className="px-4 py-3">Habilitado</th>
                      <th className="px-4 py-3">Acciones</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    {productos
                      .filter(producto => categoriaId ? producto.categoria_id === categoriaId : true)
                      .map((producto) => (
                        <tr key={producto.id} className="hover:bg-gray-50">
                          <td className="px-4 py-3">
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
                          <td className="px-4 py-3">{producto.nombre}</td>
                          <td className="px-4 py-3">{getCategoriaNombre(producto.categoria_id)}</td>
                          <td className="px-4 py-3">{formatPrice(producto.precio)}</td>
                          <td className="px-4 py-3">{formatNumber(producto.stock)}</td>
                          <td className="px-4 py-3">{getSaborInfo(producto)}</td>
                          <td className="px-4 py-3">{formatBoolean(producto.destacado)}</td>
                          <td className="px-4 py-3">{formatBoolean(producto.habilitado)}</td>
                          <td className="px-4 py-3">
                            <div className="flex space-x-3">
                              <button 
                                onClick={() => handleEditar(producto)} 
                                className="text-blue-600 hover:text-blue-800"
                              >
                                Editar
                              </button>
                              <button 
                                onClick={() => handleEliminarClick(producto.id)} 
                                className="text-red-600 hover:text-red-800"
                              >
                                Eliminar
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    {productos.length === 0 && (
                      <tr>
                        <td colSpan={9} className="px-4 py-6 text-center text-gray-500">
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