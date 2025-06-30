//promociones
'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import HeaderAdmin from '@/components/adminComponents/HeaderAdmin';
import Topbar from '@/components/adminComponents/Topbar';
import Alert from '@/components/adminComponents/Alert';
import ConfirmationModal from '@/components/adminComponents/ConfirmationModal';
import LoadingSpinner from '@/components/adminComponents/LoadingSpinner';
import ModalPromociones from '@/adminModals/ModalFormularioPromocion';
import ModalVisualizarProductos from '@/adminModals/ModalVisualizarProducto';
import ProtectedRoute from '@/components/adminComponents/ProtectedRoute';

type ProductoPromocion = {
  producto_id: number;
  cantidad: number;
};

type Promocion = {
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
  unico_sabor: string;
  tamanio_sabor_ids: string;
  productos: ProductoPromocion[];
};

type Categoria = {
  id: number;
  nombre: string;
};

type Producto = {
  id: number;
  nombre: string;
  precio: number;
  categoria_id: number;
  imagen: string;
  descripcion: string;
};

const backendUrl = process.env.NEXT_PUBLIC_BACK_HOST;

export default function CrudPromocionesPage() {
  // Estados de autenticación
  const [user, setUser] = useState<any>(null);
  const router = useRouter();

  // Estados existentes
  const [promociones, setPromociones] = useState<Promocion[]>([]);
  const [categorias, setCategorias] = useState<Categoria[]>([]);
  const [productos, setProductos] = useState<Producto[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [itemToDelete, setItemToDelete] = useState<number | null>(null);
  const [showPromocionModal, setShowPromocionModal] = useState(false);
  const [modoEdicion, setModoEdicion] = useState(false);
  const [promocionEditando, setPromocionEditando] = useState<Promocion | null>(null);
  const [busqueda, setBusqueda] = useState('');
  const [pagina, setPagina] = useState(1);
  
  const [showDetallesModal, setShowDetallesModal] = useState(false);
  const [promocionDetalles, setPromocionDetalles] = useState<Promocion | null>(null);
  
  const ITEMS_POR_PAGINA = 15;

  const API_BASE_URL = `${backendUrl}api`;
  const PROMOCIONES_URL = `${API_BASE_URL}/promociones`;
  const CATEGORIAS_URL = `${API_BASE_URL}/categorias`;
  const PRODUCTOS_URL = `${API_BASE_URL}/productos`;
  const UPLOADS_URL = `${API_BASE_URL}/uploads`;

const fetchData = async () => {
  try {
    setLoading(true);
    const [promocionesRes, categoriasRes, productosRes] = await Promise.all([
      fetch(PROMOCIONES_URL),
      fetch(CATEGORIAS_URL),
      fetch(PRODUCTOS_URL)
    ]);

    if (!promocionesRes.ok || !categoriasRes.ok || !productosRes.ok) {
      throw new Error('Error al cargar datos');
    }

    const [promocionesData, categoriasData, productosData] = await Promise.all([
      promocionesRes.json(),
      categoriasRes.json(),
      productosRes.json()
    ]);

    console.log('Promociones cargadas:', promocionesData);
    console.log('Productos cargados:', productosData);

    const promocionesDataTransformadas = promocionesData.map((promo: any) => ({
      ...promo,
      productos: promo.detalles_promocion || [],
    }));

    setPromociones(promocionesDataTransformadas);
    setCategorias(categoriasData);
    setProductos(productosData);
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
  }, [busqueda]);

  const handleAddPromocion = () => {
    setModoEdicion(false);
    setPromocionEditando(null);
    setShowPromocionModal(true);
  };

  const handleEditar = (promocion: Promocion) => {
    setModoEdicion(true);
    setPromocionEditando(promocion);
    setShowPromocionModal(true);
  };

  const handleEliminarClick = (id: number) => {
    setItemToDelete(id);
    setShowDeleteModal(true);
  };

const handleVerDetalles = (promocion: Promocion) => {
  console.log('Promoción seleccionada:', promocion);
  console.log('Productos de la promoción:', promocion.productos);
  setPromocionDetalles(promocion);
  setShowDetallesModal(true);
};

  const handleConfirmDelete = async () => {
    if (!itemToDelete) return;
    try {
      setLoading(true);
      const res = await fetch(`${PROMOCIONES_URL}/${itemToDelete}`, { method: 'DELETE' });
      if (!res.ok) throw new Error('Error al eliminar promoción');
      setSuccess('Promoción eliminada correctamente');
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
    setShowPromocionModal(false);
  };

  const getProductoNombre = (productoId: number) => {
    return productos.find(p => p.id === productoId)?.nombre || 'Producto no encontrado';
  };

  const getCategoriaNombre = (categoriaId: number) => {
    return categorias.find(c => c.id === categoriaId)?.nombre || 'Categoría no encontrada';
  };

  const getProductosInfo = (promocion: Promocion) => {
    if (!promocion.productos || promocion.productos.length === 0) return 'Sin productos';
    
    return promocion.productos.map(p => 
      `${getProductoNombre(p.producto_id)} (${p.cantidad})`
    ).join(', ');
  };

  const promocionesFiltradas = promociones.filter(promocion => {
    const texto = busqueda.toLowerCase();
    const coincideBusqueda = promocion.nombre.toLowerCase().includes(texto) || 
                           promocion.precio.toString().includes(texto) ||
                           (promocion.stock !== null && promocion.stock.toString().includes(texto)) ||
                           getProductosInfo(promocion).toLowerCase().includes(texto);
    return coincideBusqueda;
  });

  const totalPaginas = Math.ceil(promocionesFiltradas.length / ITEMS_POR_PAGINA);
  const promocionesPagina = promocionesFiltradas.slice((pagina - 1) * ITEMS_POR_PAGINA, pagina * ITEMS_POR_PAGINA);

  const renderPromocionModal = () => {
    if (!showPromocionModal) return null;
  
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center">
        <div className="absolute inset-0 bg-black opacity-60" onClick={() => setShowPromocionModal(false)} />
        
        <div className="relative z-50 bg-white rounded-lg shadow-lg w-full max-w-6xl mx-4 border-2 border-red-500 max-h-[90vh] overflow-hidden flex flex-col">
          {/* Header fijo */}
          <div className="flex-shrink-0 bg-gradient-to-r from-red-50 to-red-100 border-b border-red-200 p-6">
            <div className="flex items-center justify-between">
              <h3 className="text-xl font-semibold text-gray-800">
                {modoEdicion ? 'Editar Promoción' : 'Agregar Nueva Promoción'}
              </h3>
              <button
                onClick={() => setShowPromocionModal(false)}
                className="text-gray-400 hover:text-gray-600 transition-colors"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
          </div>

          {/* Contenido del formulario */}
          <div className="flex-1 overflow-y-auto p-6">
            <ModalPromociones
              loading={loading}
              modoEdicion={modoEdicion}
              promocionEditando={promocionEditando}
              onError={setError}
              onSave={handleSuccess}
              refreshPromociones={fetchData}
              onClose={() => setShowPromocionModal(false)}
              categorias={categorias}
            />
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
          <Topbar title="Gestión de Promociones" />

          <main className="p-6 space-y-6">
            {error && <Alert message={error} onClose={() => setError(null)} type="error" />}
            {success && <Alert message={success} onClose={() => setSuccess(null)} type="success" />}

            <ConfirmationModal
              message="¿Estás seguro de eliminar esta promoción?"
              isOpen={showDeleteModal}
              onClose={() => setShowDeleteModal(false)}
              onConfirm={handleConfirmDelete}
              title="Confirmar eliminación"
            />

            {/* Barra de herramientas */}
            <div className="bg-white rounded-lg shadow p-6">
              <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
                <div className="flex-1 max-w-md">
                  <div className="relative">
                    <svg
                      className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                      />
                    </svg>
                    <input
                      type="text"
                      placeholder="Buscar promociones..."
                      value={busqueda}
                      onChange={(e) => setBusqueda(e.target.value)}
                      className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-red-500"
                    />
                  </div>
                </div>
                
                <button
                  onClick={handleAddPromocion}
                  className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg flex items-center gap-2 transition-colors"
                  disabled={loading}
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                  </svg>
                  Agregar Promoción
                </button>
              </div>
            </div>

            {/* Tabla de promociones */}
            <div className="bg-white rounded-lg shadow">
              <div className="px-6 py-4 border-b border-gray-200">
                <h2 className="text-lg font-semibold text-gray-800">
                  Promociones ({promocionesFiltradas.length})
                </h2>
              </div>

              {loading ? (
                <div className="flex justify-center items-center py-12">
                  <LoadingSpinner size={8} />
                </div>
              ) : promocionesPagina.length === 0 ? (
                <div className="text-center py-12">
                  <div className="text-gray-500 mb-4">
                    <svg className="w-12 h-12 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
                    </svg>
                    {busqueda ? 'No se encontraron promociones con esa búsqueda' : 'No hay promociones registradas'}
                  </div>
                  {!busqueda && (
                    <button
                      onClick={handleAddPromocion}
                      className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg"
                    >
                      Agregar primera promoción
                    </button>
                  )}
                </div>
              ) : (
                <>
                  {/* Tabla desktop */}
                  <div className="hidden md:block overflow-x-auto">
                    <table className="w-full">
                      <thead className="bg-gray-50">
                        <tr>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Imagen
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Nombre
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Precio
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Stock
                          </th>
                          <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Productos
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Estado
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Acciones
                          </th>
                        </tr>
                      </thead>
                      <tbody className="bg-white divide-y divide-gray-200">
                        {promocionesPagina.map((promocion) => (
                          <tr key={promocion.id} className="hover:bg-gray-50">
                            <td className="px-6 py-4 whitespace-nowrap">
                              <div className="w-10 h-10">
                                <img 
                                  src={promocion.imagen 
                                    ? promocion.imagen.startsWith('/uploads/') 
                                      ? `${UPLOADS_URL}${promocion.imagen.replace('/uploads', '')}`
                                      : promocion.imagen
                                    : `${UPLOADS_URL}/default.jpeg`}
                                  alt={promocion.nombre}
                                  className="w-full h-full object-cover rounded"
                                />
                              </div>
                            </td>
                            <td className="px-6 py-4">
                              <div className="text-sm font-medium text-gray-900">{promocion.nombre}</div>
                              {promocion.descripcion && (
                                <div className="text-sm text-gray-500 truncate max-w-xs">{promocion.descripcion}</div>
                              )}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <div className="text-sm font-medium text-gray-900">S/.{promocion.precio}</div>
                              {promocion.descuento > 0 && (
                                <div className="text-xs text-green-600">-{promocion.descuento}%</div>
                              )}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <div className="text-sm text-gray-900">{promocion.stock || 0}</div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-center">
                              <button
                                onClick={() => handleVerDetalles(promocion)}
                                className="text-blue-600 hover:text-blue-900 p-2 rounded-full hover:bg-blue-50 transition-colors"
                                title="Ver productos incluidos"
                              >
                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                                </svg>
                              </button>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <div className="flex flex-col gap-1">
                                <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                                  promocion.habilitado 
                                    ? 'bg-green-100 text-green-800' 
                                    : 'bg-gray-100 text-gray-800'
                                }`}>
                                  {promocion.habilitado ? 'Habilitado' : 'Deshabilitado'}
                                </span>
                                {promocion.destacado && (
                                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
                                    Destacado
                                  </span>
                                )}
                              </div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                              <div className="flex items-center gap-2">
                                <button
                                  onClick={() => handleEditar(promocion)}
                                  className="text-blue-600 hover:text-blue-900"
                                  title="Editar"
                                >
                                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                                  </svg>
                                </button>
                                <button
                                  onClick={() => handleEliminarClick(promocion.id)}
                                  className="text-red-600 hover:text-red-900"
                                  title="Eliminar"
                                >
                                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                  </svg>
                                </button>
                              </div>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>

                  {/* Paginación */}
                  {totalPaginas > 1 && (
                    <div className="px-6 py-4 border-t border-gray-200">
                      <div className="flex items-center justify-between">
                        <div className="text-sm text-gray-700">
                          Mostrando {((pagina - 1) * ITEMS_POR_PAGINA) + 1} a {Math.min(pagina * ITEMS_POR_PAGINA, promocionesFiltradas.length)} de {promocionesFiltradas.length} resultados
                        </div>
                        
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => setPagina(pagina - 1)}
                            disabled={pagina === 1}
                            className="px-3 py-1 border border-gray-300 rounded text-sm disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
                          >
                            Anterior
                          </button>
                          
                          <div className="flex items-center gap-1">
                            {Array.from({ length: totalPaginas }, (_, i) => i + 1).map((num) => (
                              <button
                                key={num}
                                onClick={() => setPagina(num)}
                                className={`px-3 py-1 text-sm rounded ${
                                  pagina === num
                                    ? 'bg-red-600 text-white'
                                    : 'border border-gray-300 hover:bg-gray-50'
                                }`}
                              >
                                {num}
                              </button>
                            ))}
                          </div>
                          
                          <button
                            onClick={() => setPagina(pagina + 1)}
                            disabled={pagina === totalPaginas}
                            className="px-3 py-1 border border-gray-300 rounded text-sm disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
                          >
                            Siguiente
                          </button>
                        </div>
                      </div>
                    </div>
                  )}
                </>
              )}
            </div>
          </main>
        </div>

        {/* Modal de promoción */}
        {renderPromocionModal()}

        {/* Modal de visualización de productos */}
        {showDetallesModal && promocionDetalles && (
          <ModalVisualizarProductos
            isOpen={showDetallesModal}
            onClose={() => setShowDetallesModal(false)}
            productosSeleccionados={promocionDetalles.productos || []}
            productos={productos}
            categorias={categorias}
          />
        )}
      </div>
      </ProtectedRoute>
  );
}