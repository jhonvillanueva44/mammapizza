'use client';

import { useState, useEffect, useRef } from 'react';
import HeaderAdmin from '@/components/adminComponents/HeaderAdmin';
import Topbar from '@/components/adminComponents/Topbar';
import Alert from '@/components/adminComponents/Alert';
import ConfirmationModal from '@/components/adminComponents/ConfirmationModal';
import LoadingSpinner from '@/components/adminComponents/LoadingSpinner';
import { usePizzaForm } from '@/adminHooks/usePizzaForm';

// Types

type Producto = {
  id: number;
  nombre: string;
  precio: number;
  stock: number;
  categoria_id: number;
  destacado: boolean;
  habilitado: boolean;
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
  const [tamanioId, setTamanioId] = useState<number | null>(null);
  const [tamanioSaborId, setTamanioSaborId] = useState<number | null>(null);
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
    setState: (val: number) => void
  ) => {
    const val = e.target.value;
    const parsed = parseFloat(val);
    setState(val === '' || isNaN(parsed) ? 0 : parsed);
  };

  const fetchData = async () => {
    try {
      setLoading(true);
      const [productosRes, categoriasRes] = await Promise.all([
        fetch(PRODUCTOS_URL),
        fetch(CATEGORIAS_URL)
      ]);

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

  const pizzaFormProps = usePizzaForm({
    categoriaId,
    categorias,
    nombre,
    setNombre,
    tamanioId,
    setTamanioId,
    tamanioSaborId,
    setTamanioSaborId,
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
    modoEdicion,
    onError: (msg: string) => setError(msg),
    handleNumberChange
  });

  const resetForm = () => {
    setCategoriaId(null);
    setModoEdicion(false);
    setIdEditando(null);
    setNombre('');
    setTamanioId(null);
    setTamanioSaborId(null);
    setPrecio(null);
    setStock(null);
    setImagenPreview(null);
    setDescripcion('');
    setImpuesto(null);
    setDescuento(null);
    setDestacado(false);
    setHabilitado(true);
    pizzaFormProps.resetForm();
  };

  const handleEditar = (producto: Producto) => {
    setModoEdicion(true);
    setIdEditando(producto.id);
    setCategoriaId(producto.categoria_id);
    pizzaFormProps.loadProductData(producto);
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
              >
                <option value="">Seleccionar categoría</option>
                {categorias.map((categoria) => (
                  <option key={categoria.id} value={categoria.id}>{categoria.nombre}</option>
                ))}
              </select>
            </div>

            {categoriaId === 1 && pizzaFormProps.renderFormularioPizza()}

            {categoriaId && (
              <div className="mt-6 flex justify-end space-x-3">
                {modoEdicion && (
                  <button
                    onClick={resetForm}
                    className="px-4 py-2 text-gray-600 border border-gray-300 rounded"
                    disabled={loading}
                  >Cancelar</button>
                )}
                <button
                  onClick={pizzaFormProps.handleGuardar}
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
                      <th className="px-4 py-3">Nombre</th>
                      <th className="px-4 py-3">Categoría</th>
                      <th className="px-4 py-3">Precio</th>
                      <th className="px-4 py-3">Stock</th>
                      <th className="px-4 py-3">Destacado</th>
                      <th className="px-4 py-3">Habilitado</th>
                      <th className="px-4 py-3">Acciones</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    {productos.map((producto) => (
                      <tr key={producto.id} className="hover:bg-gray-50">
                        <td className="px-4 py-3">{producto.nombre}</td>
                        <td className="px-4 py-3">{categorias.find(c => c.id === producto.categoria_id)?.nombre || '-'}</td>
                        <td className="px-4 py-3">{formatPrice(producto.precio)}</td>
                        <td className="px-4 py-3">{formatNumber(producto.stock)}</td>
                        <td className="px-4 py-3">{producto.destacado ? 'Sí' : 'No'}</td>
                        <td className="px-4 py-3">{producto.habilitado ? 'Sí' : 'No'}</td>
                        <td className="px-4 py-3">
                          <div className="flex space-x-3">
                            <button onClick={() => handleEditar(producto)} className="text-blue-600">Editar</button>
                            <button onClick={() => handleEliminarClick(producto.id)} className="text-red-600">Eliminar</button>
                          </div>
                        </td>
                      </tr>
                    ))}
                    {productos.length === 0 && (
                      <tr>
                        <td colSpan={7} className="px-4 py-6 text-center text-gray-500">No hay productos registrados.</td>
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
