'use client';

import { useState, useEffect, useRef } from 'react';
import HeaderAdmin from '@/components/adminComponents/HeaderAdmin';
import Topbar from '@/components/adminComponents/Topbar';
import Alert from '@/components/adminComponents/Alert';
import ConfirmationModal from '@/components/adminComponents/ConfirmationModal';
import LoadingSpinner from '@/components/adminComponents/LoadingSpinner';
import { usePizzaForm } from '@/adminHooks/usePizzaForm';
import { useCalzoneForm } from '@/adminHooks/useCalzoneForm';
import { useBebidasForm } from '@/adminHooks/useBebidasForm';

// Types
type Producto = {
  id: number;
  nombre: string;
  precio: number;
  stock: number;
  categoria_id: number;
  destacado: boolean;
  habilitado: boolean;
  descripcion?: string;
  impuesto?: number;
  descuento?: number;
  imagen?: string;
  unico_sabor?: boolean | null;
  tamanio_sabor_ids?: number[];
};

type Categoria = {
  id: number;
  nombre: string;
};

export default function CrudProductoPage() {
  const [productos, setProductos] = useState<Producto[]>([]);
  const [categorias, setCategorias] = useState<Categoria[]>([]);
  const [categoriaId, setCategoriaId] = useState<number | null>(null);
  const [modoEdicion, setModoEdicion] = useState(false);
  const [idEditando, setIdEditando] = useState<number | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [itemToDelete, setItemToDelete] = useState<number | null>(null);

  // Form fields
  const [nombre, setNombre] = useState('');
  const [precio, setPrecio] = useState<number | null>(null);
  const [stock, setStock] = useState<number | null>(null);
  const [imagenPreview, setImagenPreview] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [descripcion, setDescripcion] = useState('');
  const [impuesto, setImpuesto] = useState<number | null>(null);
  const [descuento, setDescuento] = useState<number | null>(null);
  const [destacado, setDestacado] = useState(false);
  const [habilitado, setHabilitado] = useState(true);

  const API_BASE_URL = 'http://localhost:4000/api';
  const PRODUCTOS_URL = `${API_BASE_URL}/productos`;
  const CATEGORIAS_URL = `${API_BASE_URL}/categorias`;
  const UPLOADS_URL = `${API_BASE_URL}/uploads`;

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => setImagenPreview(reader.result as string);
      reader.readAsDataURL(file);
    }
  };

  const handleNumberChange = (
    e: React.ChangeEvent<HTMLInputElement>,
    setState: (val: number | null) => void
  ) => {
    const val = e.target.value;
    const parsed = parseFloat(val);
    setState(val === '' ? null : isNaN(parsed) ? 0 : parsed);
  };

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

  const {
    renderFormularioPizza,
    resetForm: resetPizzaForm,
    loadProductData: loadPizzaData,
    handleGuardar: handleGuardarPizza,
  } = usePizzaForm({
    categoriaId,
    categorias,
    nombre,
    setNombre,
    precio,
    setPrecio,
    stock,
    setStock,
    imagenPreview,
    handleImageChange,
    fileInputRef,
    descripcion,
    setDescripcion,
    impuesto,
    setImpuesto,
    descuento,
    setDescuento,
    destacado,
    setDestacado,
    habilitado,
    setHabilitado,
    loading,
    setLoading,
    modoEdicion,
    productoEditando: modoEdicion && idEditando 
      ? productos.find(p => p.id === idEditando) || null 
      : null,
    onError: (msg: string) => setError(msg),
    onSuccess: (msg: string, producto?: Producto) => {
      setSuccess(msg);
      fetchData();
      resetForm();
    },
    handleNumberChange,
    refreshProductos: fetchData
  });

  const {
    renderFormularioCalzone,
    resetForm: resetCalzoneForm,
    loadProductData: loadCalzoneData,
    handleGuardar: handleGuardarCalzone,
  } = useCalzoneForm({
    categoriaId,
    categorias,
    nombre,
    setNombre,
    precio,
    setPrecio,
    stock,
    setStock,
    imagenPreview,
    handleImageChange,
    fileInputRef,
    descripcion,
    setDescripcion,
    impuesto,
    setImpuesto,
    descuento,
    setDescuento,
    destacado,
    setDestacado,
    habilitado,
    setHabilitado,
    loading,
    setLoading,
    modoEdicion,
    productoEditando: modoEdicion && idEditando 
      ? productos.find(p => p.id === idEditando) || null 
      : null,
    onError: (msg: string) => setError(msg),
    onSuccess: (msg: string, producto?: Producto) => {
      setSuccess(msg);
      fetchData();
      resetForm();
    },
    handleNumberChange,
    refreshProductos: fetchData
  });

  const {
    renderFormularioBebidas,
    resetForm: resetBebidasForm,
    loadProductData: loadBebidasData,
    handleGuardar: handleGuardarBebidas,
  } = useBebidasForm({
    categoriaId,
    categorias,
    nombre,
    setNombre,
    precio,
    setPrecio,
    stock,
    setStock,
    imagenPreview,
    handleImageChange,
    fileInputRef,
    descripcion,
    setDescripcion,
    impuesto,
    setImpuesto,
    descuento,
    setDescuento,
    destacado,
    setDestacado,
    habilitado,
    setHabilitado,
    loading,
    setLoading,
    modoEdicion,
    productoEditando: modoEdicion && idEditando 
      ? productos.find(p => p.id === idEditando) || null 
      : null,
    onError: (msg: string) => setError(msg),
    onSuccess: (msg: string, producto?: Producto) => {
      setSuccess(msg);
      fetchData();
      resetForm();
    },
    handleNumberChange,
    refreshProductos: fetchData
  });

  const resetForm = () => {
    setCategoriaId(null);
    setModoEdicion(false);
    setIdEditando(null);
    setNombre('');
    setPrecio(null);
    setStock(null);
    setImagenPreview(null);
    setDescripcion('');
    setImpuesto(null);
    setDescuento(null);
    setDestacado(false);
    setHabilitado(true);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
    resetPizzaForm();
    resetCalzoneForm();
    resetBebidasForm();
  };

  const handleEditar = (producto: Producto) => {
    setModoEdicion(true);
    setIdEditando(producto.id);
    setCategoriaId(producto.categoria_id);
    setNombre(producto.nombre);
    setPrecio(producto.precio);
    setStock(producto.stock);
    setDescripcion(producto.descripcion || '');
    setImpuesto(producto.impuesto || null);
    setDescuento(producto.descuento || null);
    setDestacado(producto.destacado);
    setHabilitado(producto.habilitado);
    
    // Cargar imagen preview si existe
    if (producto.imagen) {
      const imagePath = producto.imagen.startsWith('/uploads/') 
        ? `${UPLOADS_URL}${producto.imagen.replace('/uploads', '')}`
        : producto.imagen;
      setImagenPreview(imagePath);
    }

    // Cargar datos específicos basados en categoría
    if (producto.categoria_id === 1) { // Pizza
      loadPizzaData(producto);
    } else if (producto.categoria_id === 2) { // Calzone
      loadCalzoneData(producto);
    } else if (producto.categoria_id === 3) { // Bebidas
      loadBebidasData(producto);
    }
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

          <div className="bg-white p-6 rounded-lg shadow">
            <h2 className="text-xl font-bold mb-4">{modoEdicion ? 'Editar Producto' : 'Agregar Producto'}</h2>

            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-1">Categoría *</label>
              <select
                value={categoriaId || ''}
                onChange={(e) => setCategoriaId(e.target.value ? parseInt(e.target.value) : null)}
                className="w-full border border-gray-300 rounded px-4 py-2"
                disabled={loading || modoEdicion}
                required
              >
                <option value="">Seleccionar categoría</option>
                {categorias.map((categoria) => (
                  <option key={categoria.id} value={categoria.id}>{categoria.nombre}</option>
                ))}
              </select>
            </div>

            {categoriaId === 1 && renderFormularioPizza()}
            {categoriaId === 2 && renderFormularioCalzone()}
            {categoriaId === 3 && renderFormularioBebidas()}

            {/* Formulario genérico para otras categorías */}
            {categoriaId && categoriaId !== 1 && categoriaId !== 2 && categoriaId !== 3 && (
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {/* Primera columna */}
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Nombre *</label>
                    <input
                      type="text"
                      value={nombre}
                      onChange={(e) => setNombre(e.target.value)}
                      className="w-full border border-gray-300 rounded px-3 py-2 text-sm"
                      disabled={loading}
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Precio *</label>
                    <input
                      type="number"
                      value={precio ?? ''}
                      onChange={(e) => handleNumberChange(e, setPrecio)}
                      className="w-full border border-gray-300 rounded px-3 py-2 text-sm"
                      disabled={loading}
                      min="0"
                      step="0.01"
                      required
                    />
                  </div>
                </div>

                {/* Segunda columna */}
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Stock</label>
                    <input
                      type="number"
                      value={stock ?? ''}
                      onChange={(e) => handleNumberChange(e, setStock)}
                      className="w-full border border-gray-300 rounded px-3 py-2 text-sm"
                      disabled={loading}
                      min="0"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Impuesto (%)</label>
                    <input
                      type="number"
                      value={impuesto ?? ''}
                      onChange={(e) => handleNumberChange(e, setImpuesto)}
                      className="w-full border border-gray-300 rounded px-3 py-2 text-sm"
                      disabled={loading}
                      min="0"
                      max="100"
                    />
                  </div>
                </div>

                {/* Tercera columna */}
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Imagen</label>
                    <div className="flex items-center gap-4">
                      <div>
                        <input
                          type="file"
                          ref={fileInputRef}
                          onChange={handleImageChange}
                          accept="image/*"
                          className="hidden"
                          id="imagen-upload"
                          disabled={loading}
                        />
                        <label
                          htmlFor="imagen-upload"
                          className="cursor-pointer bg-gray-100 hover:bg-gray-200 text-gray-700 px-4 py-2 rounded-md text-sm transition-colors"
                        >
                          Seleccionar imagen
                        </label>
                      </div>
                      {imagenPreview && (
                        <div className="w-16 h-16 border rounded overflow-hidden">
                          <img src={imagenPreview} alt="Preview" className="w-full h-full object-cover" />
                        </div>
                      )}
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Descripción</label>
                    <textarea
                      value={descripcion}
                      onChange={(e) => setDescripcion(e.target.value)}
                      className="w-full border border-gray-300 rounded px-3 py-2 text-sm"
                      rows={5}
                      disabled={loading}
                    />
                  </div>
                </div>
              </div>
            )}

            {categoriaId && (
              <div className="mt-6 flex justify-end space-x-3">
                {modoEdicion && (
                  <button
                    type="button"
                    onClick={resetForm}
                    className="px-4 py-2 text-gray-600 border border-gray-300 rounded"
                    disabled={loading}
                  >
                    Cancelar
                  </button>
                )}
                <button
                  type="button"
                  onClick={() => {
                    if (categoriaId === 1) {
                      handleGuardarPizza();
                    } else if (categoriaId === 2) {
                      handleGuardarCalzone();
                    } else if (categoriaId === 3) {
                      handleGuardarBebidas();
                    } else {
                      handleGuardarProductoGenerico();
                    }
                  }}
                  className="px-4 py-2 bg-red-600 text-white rounded"
                  disabled={loading}
                >
                  {loading ? <LoadingSpinner size={6} /> : modoEdicion ? 'Actualizar' : 'Guardar'}
                </button>
              </div>
            )}
          </div>

          <div className="bg-white p-6 rounded-lg shadow">
            <h2 className="text-xl font-bold mb-4">Lista de Productos</h2>
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
                    {productos.map((producto) => (
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

  async function handleGuardarProductoGenerico() {
    if (!nombre || !categoriaId || precio === null) {
      setError('Nombre, categoría y precio son obligatorios');
      return;
    }

    try {
      setLoading(true);
      const formData = new FormData();
      formData.append('nombre', nombre);
      formData.append('precio', precio.toString());
      formData.append('stock', stock?.toString() || '0');
      formData.append('categoria_id', categoriaId.toString());
      formData.append('descripcion', descripcion);
      formData.append('impuesto', impuesto?.toString() || '0');
      formData.append('descuento', descuento?.toString() || '0');
      formData.append('destacado', destacado.toString());
      formData.append('habilitado', habilitado.toString());
      formData.append('unico_sabor', 'null'); // Para productos no pizza

      if (fileInputRef.current?.files?.[0]) {
        formData.append('imagen', fileInputRef.current.files[0]);
      }

      let response;
      if (modoEdicion && idEditando) {
        response = await fetch(`${PRODUCTOS_URL}/${idEditando}`, {
          method: 'PUT',
          body: formData,
        });
      } else {
        response = await fetch(PRODUCTOS_URL, {
          method: 'POST',
          body: formData,
        });
      }

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Error al guardar el producto');
      }

      const data = await response.json();
      setSuccess(modoEdicion ? 'Producto actualizado correctamente' : 'Producto creado correctamente');
      await fetchData();
      resetForm();
    } catch (e: any) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  }
}