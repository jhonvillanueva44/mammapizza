//productosPage
'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import HeaderAdmin from '@/components/adminComponents/HeaderAdmin';
import Topbar from '@/components/adminComponents/Topbar';
import Alert from '@/components/adminComponents/Alert';
import ConfirmationModal from '@/components/adminComponents/ConfirmationModal';
import LoadingSpinner from '@/components/adminComponents/LoadingSpinner';
import ModalPizza from '@/adminModals/ModalPizza';
import ModalPCA from '@/adminModals/ModalPCA';
import ModalBA from '@/adminModals/ModalBA';
import ProtectedRoute from '@/components/adminComponents/ProtectedRoute';

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
  const [user, setUser] = useState<any>(null);
  const router = useRouter();
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
  const [busqueda, setBusqueda] = useState('');
  const [pagina, setPagina] = useState(1);
  const ITEMS_POR_PAGINA = 15;

  const backendUrl = process.env.NEXT_PUBLIC_BACK_HOST;
  const API_BASE_URL = `${backendUrl}api`;
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

  useEffect(() => {
    setPagina(1);
  }, [categoriaId, busqueda]);

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

  // Filtrar categorías para eliminar Agregados y Promociones
  const categoriasValidas = categorias.filter((categoria: Categoria) => 
    ![4, 5].includes(categoria.id)
  );

  const getCategoriaNombre = (id: number) => {
    return categoriasValidas.find(c => c.id === id)?.nombre || '-';
  };

  const getSaborInfo = (producto: Producto) => {
    if (producto.categoria_id !== 1) return '';
    if (producto.unico_sabor === true) return 'Sabor único';
    if (producto.unico_sabor === false) return 'Combinación';
    return 'Sin sabor definido';
  };

  const productosFiltrados = productos.filter(producto => {
    const coincideCategoria = categoriaId ? producto.categoria_id === categoriaId : true;
    const texto = busqueda.toLowerCase();
    const coincideBusqueda = producto.nombre.toLowerCase().includes(texto) || 
                           getCategoriaNombre(producto.categoria_id).toLowerCase().includes(texto) ||
                           producto.precio.toString().includes(texto) ||
                           (producto.stock !== null && producto.stock.toString().includes(texto));
    return coincideCategoria && coincideBusqueda;
  });

  const totalPaginas = Math.ceil(productosFiltrados.length / ITEMS_POR_PAGINA);
  const productosPagina = productosFiltrados.slice((pagina - 1) * ITEMS_POR_PAGINA, pagina * ITEMS_POR_PAGINA);

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
      categorias: categoriasValidas,
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
         <div
        className="absolute inset-0 bg-black opacity-60" onClick={commonProps.onClose} />
        
        <div className="relative z-50 bg-white rounded-lg shadow-lg w-full max-w-5xl mx-4 border-2 border-red-500 max-h-[90vh] overflow-hidden flex flex-col">
          {/* Header fijo con selector de categoría */}
          <div className="flex-shrink-0 bg-gradient-to-r from-red-50 to-red-100 border-b border-red-200 p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-xl font-semibold text-gray-800">
                {modoEdicion ? 'Editar Producto' : 'Agregar Nuevo Producto'}
              </h3>
              <button
                onClick={commonProps.onClose}
                className="text-gray-400 hover:text-gray-600 transition-colors"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            {/* Selector de categoría mejorado */}
            <div className="bg-white rounded-lg p-4 shadow-sm border border-red-200">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <span className="flex items-center">
                  <svg className="w-4 h-4 mr-2 text-red-500" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M7 3a1 1 0 000 2h6a1 1 0 100-2H7zM4 7a1 1 0 011-1h10a1 1 0 110 2H5a1 1 0 01-1-1zM2 11a2 2 0 012-2h12a2 2 0 012 2v4a2 2 0 01-2 2H4a2 2 0 01-2-2v-4z"/>
                  </svg>
                  Seleccionar Categoría *
                </span>
              </label>
              <select
                value={selectedModalCategory || ''}
                onChange={(e) => commonProps.onCategoryChange(parseInt(e.target.value))}
                className="w-full border border-gray-300 rounded-lg px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-red-500 cursor-pointer bg-white shadow-sm transition-all duration-200 hover:border-red-300"
                disabled={modoEdicion}
              >
                <option value="">🔽 Seleccione una categoría para continuar</option>
                {categoriasValidas.map((categoria) => (
                  <option key={categoria.id} value={categoria.id}>
                    📂 {categoria.nombre}
                  </option>
                ))}
              </select>
              
              {/* Indicador de categoría seleccionada */}
              {selectedModalCategory && (
                <div className="mt-3 p-2 bg-red-50 border border-red-200 rounded-md">
                  <div className="flex items-center text-sm text-red-700">
                    <svg className="w-4 h-4 mr-2" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd"/>
                    </svg>
                    Categoría seleccionada: <strong>{getCategoriaNombre(selectedModalCategory)}</strong>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Contenido del formulario */}
          <div className="flex-1 overflow-y-auto p-6">
            {selectedModalCategory ? (
              <div className="animate-fadeIn">
                {selectedModalCategory === 1 && <ModalPizza {...commonProps} />}
                {selectedModalCategory === 2 && <ModalPCA {...commonProps} tipoProducto="Calzone" categoriaId={2} />}
                {selectedModalCategory === 3 && <ModalPCA {...commonProps} tipoProducto="Pasta" categoriaId={3} />}
                {selectedModalCategory === 6 && <ModalBA {...commonProps} tipoProducto="Adicional" />}
                {selectedModalCategory === 7 && <ModalPCA {...commonProps} tipoProducto="Bebida" categoriaId={7} />}
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center py-12 text-gray-500">
                <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mb-4">
                  <svg className="w-12 h-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"/>
                  </svg>
                </div>
                <h4 className="text-lg font-medium text-gray-600 mb-2">¡Primero selecciona una categoría!</h4>
                <p className="text-sm text-gray-500 text-center max-w-md">
                  Para continuar con el registro del producto, necesitas seleccionar una categoría en el selector de arriba.
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    );
  };

  return (
    <ProtectedRoute>
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
              <h2 className="text-2xl font-semibold text-gray-800">Listado de Productos</h2>
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

            <div className="flex flex-wrap gap-4 mb-6">
              <select
                className="border border-gray-300 rounded-md px-3 py-2 shadow-sm focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-red-500 cursor-pointer"
                value={categoriaId || ''}
                onChange={(e) => setCategoriaId(e.target.value ? parseInt(e.target.value) : null)}
              >
                <option value="">Todas las categorías</option>
                {categoriasValidas.map((categoria) => (
                  <option key={categoria.id} value={categoria.id}>{categoria.nombre}</option>
                ))}
              </select>

              <input
                type="text"
                placeholder="Buscar por nombre, categoría, precio o stock..."
                className="border border-gray-300 rounded-md px-3 py-2 shadow-sm focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-red-500 flex-1 min-w-[200px]"
                value={busqueda}
                onChange={(e) => setBusqueda(e.target.value)}
              />
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
                          Estado
                        </th>
                        <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Acciones
                        </th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {productosPagina.map((producto) => (
                        <tr key={producto.id} className="hover:bg-gray-50 transition-colors">
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="w-10 h-10">
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
                            <div className="text-xs text-gray-500">{getSaborInfo(producto)}</div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="text-sm text-gray-900">{getCategoriaNombre(producto.categoria_id)}</div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="text-sm text-gray-900">S/.{Number(producto.precio).toFixed(2)}</div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="text-sm text-gray-900">{producto.stock !== null ? producto.stock : '-'}</div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                              producto.habilitado ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                            }`}>
                              {producto.habilitado ? 'Habilitado' : 'Deshabilitado'}
                            </span>
                            {producto.destacado && (
                              <span className="ml-1 px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-yellow-100 text-yellow-800">
                                Destacado
                              </span>
                            )}
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
                      {productosPagina.length === 0 && !loading && (
                        <tr>
                          <td colSpan={7} className="px-6 py-8 text-center">
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

            {totalPaginas > 1 && (
              <div className="flex justify-center mt-4">
                <nav className="inline-flex rounded-md shadow-sm -space-x-px" aria-label="Pagination">
                  <button
                    onClick={() => setPagina(p => Math.max(1, p - 1))}
                    disabled={pagina === 1}
                    className={`relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium ${pagina === 1 ? 'text-gray-300 cursor-not-allowed' : 'text-gray-500 hover:bg-gray-50 cursor-pointer'}`}
                  >
                    <span className="sr-only">Anterior</span>
                    <svg className="h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                      <path fillRule="evenodd" d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                  </button>

                  {Array.from({ length: totalPaginas }, (_, i) => (
                    <button
                      key={i}
                      onClick={() => setPagina(i + 1)}
                      className={`relative inline-flex items-center px-4 py-2 border text-sm font-medium ${pagina === i + 1 ? 'z-10 bg-red-50 border-red-500 text-red-600 cursor-default' : 'bg-white border-gray-300 text-gray-500 hover:bg-gray-50 cursor-pointer'}`}
                    >
                      {i + 1}
                    </button>
                  ))}

                  <button
                    onClick={() => setPagina(p => Math.min(totalPaginas, p + 1))}
                    disabled={pagina === totalPaginas}
                    className={`relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 bg-white text-sm font-medium ${pagina === totalPaginas ? 'text-gray-300 cursor-not-allowed' : 'text-gray-500 hover:bg-gray-50 cursor-pointer'}`}
                  >
                    <span className="sr-only">Siguiente</span>
                    <svg className="h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                      <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
                    </svg>
                  </button>
                </nav>
              </div>
            )}
          </main>
        </div>

        <style jsx>{`
          @keyframes fadeIn {
            from {
              opacity: 0;
              transform: translateY(10px);
            }
            to {
              opacity: 1;
              transform: translateY(0);
            }
          }
          
          .animate-fadeIn {
            animation: fadeIn 0.3s ease-out;
          }
        `}</style>
      </div>
      </ProtectedRoute>
  );
}