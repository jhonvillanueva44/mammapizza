'use client';

import { useState, useEffect, useRef } from 'react';
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
  unico_sabor: boolean | null;
  categoria_id: number;
  tamanio_sabores: { tamanio_id: number; sabor_id: number }[];
};

type Categoria = {
  id: number;
  nombre: string;
};

type Tamanio = {
  id: number;
  nombre: string;
  categoria_id: number;
};

type TamanioSabor = {
  tamanio_nombre: string;
  id: number;
  tamanio_id: number;
  sabor_id: number;
  sabor_nombre: string;
  precio: number;
};

export default function CrudProductoPage() {
  // Estados principales
  const [productos, setProductos] = useState<Producto[]>([]);
  const [categorias, setCategorias] = useState<Categoria[]>([]);
  const [tamanios, setTamanios] = useState<Tamanio[]>([]);
  const [tamanioSabores, setTamanioSabores] = useState<TamanioSabor[]>([]);
  
  // Estados del formulario
  const [categoriaId, setCategoriaId] = useState<number | null>(null);
  const [nombre, setNombre] = useState('');
  const [tamanioId, setTamanioId] = useState<number | null>(null);
  const [saboresSeleccionados, setSaboresSeleccionados] = useState<{tamanio_id: number, sabor_id: number}[]>([]);
  const [precio, setPrecio] = useState<number | null>(null);
  const [stock, setStock] = useState<number | null>(null);
  const [imagen, setImagen] = useState<File | null>(null);
  const [imagenPreview, setImagenPreview] = useState<string | null>(null);
  const [descripcion, setDescripcion] = useState('');
  const [impuesto, setImpuesto] = useState<number | null>(null);
  const [descuento, setDescuento] = useState<number | null>(null);
  const [destacado, setDestacado] = useState(false);
  const [habilitado, setHabilitado] = useState(true);
  const [tamanioSaborId, setTamanioSaborId] = useState<number | null>(null);
  
  // Estados de UI
  const [modoEdicion, setModoEdicion] = useState(false);
  const [idEditando, setIdEditando] = useState<number | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [itemToDelete, setItemToDelete] = useState<number | null>(null);
  
  const fileInputRef = useRef<HTMLInputElement>(null);

  const API_BASE_URL = 'http://localhost:4000/api';
  const PRODUCTOS_URL = `${API_BASE_URL}/productos`;
  const CATEGORIAS_URL = `${API_BASE_URL}/categorias`;
  const TAMANIOS_URL = `${API_BASE_URL}/tamanios`;
  const TAMANIO_SABORES_URL = `${API_BASE_URL}/tamanioSabor`;

  // Fetch data
  const fetchData = async () => {
    try {
      setLoading(true);
      
      // Fetch en paralelo
      const [productosRes, categoriasRes, tamaniosRes, tamanioSaboresRes] = await Promise.all([
        fetch(PRODUCTOS_URL),
        fetch(CATEGORIAS_URL),
        fetch(TAMANIOS_URL),
        fetch(TAMANIO_SABORES_URL)
      ]);

      if (!productosRes.ok) throw new Error('Error al cargar productos');
      if (!categoriasRes.ok) throw new Error('Error al cargar categorías');
      if (!tamaniosRes.ok) throw new Error('Error al cargar tamaños');
      if (!tamanioSaboresRes.ok) throw new Error('Error al cargar tamaños-sabores');

      const [productosData, categoriasData, tamaniosData, tamanioSaboresData] = await Promise.all([
        productosRes.json(),
        categoriasRes.json(),
        tamaniosRes.json(),
        tamanioSaboresRes.json()
      ]);

      setProductos(productosData);
      setCategorias(categoriasData);
      setTamanios(tamaniosData);
      setTamanioSabores(tamanioSaboresData);
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

  // Cuando cambia la categoría, resetear tamaño y sabores
  useEffect(() => {
    setTamanioId(null);
    setSaboresSeleccionados([]);
    setPrecio(null);
  }, [categoriaId]);

  // Cuando cambia el tamaño, resetear sabores y agregar el primer sabor disponible
  useEffect(() => {
    if (tamanioId && (categoriaId === 1 || categoriaId === 2 || categoriaId === 3)) {
      const saboresDisponibles = getSaboresDisponibles();
      if (saboresDisponibles.length > 0) {
        // Para pizza, permitir agregar hasta 2 sabores
        if (categoriaId === 1 && saboresSeleccionados.length === 0) {
          setSaboresSeleccionados([{ tamanio_id: tamanioId, sabor_id: saboresDisponibles[0].sabor_id }]);
        }
        // Para calzone y pasta, solo un sabor
        else if ((categoriaId === 2 || categoriaId === 3) && saboresSeleccionados.length === 0) {
          setSaboresSeleccionados([{ tamanio_id: tamanioId, sabor_id: saboresDisponibles[0].sabor_id }]);
        }
      }
    }
  }, [tamanioId, categoriaId]);

  // Manejar imagen seleccionada
  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setImagen(file);
      
      // Crear preview
      const reader = new FileReader();
      reader.onload = (event) => {
        if (event.target) {
          setImagenPreview(event.target.result as string);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  // Agregar otro sabor (solo para pizza)
  const agregarSabor = () => {
    if (tamanioId && categoriaId === 1 && saboresSeleccionados.length < 2) {
      const saboresDisponibles = getSaboresDisponibles();
      if (saboresDisponibles.length > 0) {
        setSaboresSeleccionados([...saboresSeleccionados, { tamanio_id: tamanioId, sabor_id: saboresDisponibles[0].sabor_id }]);
      }
    }
  };

  // Eliminar sabor
  const eliminarSabor = (index: number) => {
    const nuevosSabores = [...saboresSeleccionados];
    nuevosSabores.splice(index, 1);
    setSaboresSeleccionados(nuevosSabores);
  };

  // Cambiar sabor seleccionado
  const cambiarSabor = (index: number, sabor_id: number) => {
    const nuevosSabores = [...saboresSeleccionados];
    nuevosSabores[index].sabor_id = sabor_id;
    setSaboresSeleccionados(nuevosSabores);
  };

  // Guardar producto
  const handleGuardar = async () => {
    if (!categoriaId) {
      setError('Debes seleccionar una categoría');
      return;
    }

    if (!nombre.trim()) {
      setError('El nombre es obligatorio');
      return;
    }

    // Validaciones específicas por categoría
    if (categoriaId === 1 || categoriaId === 2 || categoriaId === 3) { // Pizza, Calzone, Pasta
      if (!tamanioId) {
        setError('Debes seleccionar un tamaño');
        return;
      }
      if (saboresSeleccionados.length === 0) {
        setError('Debes seleccionar al menos un sabor');
        return;
      }
    }

    // Determinar si es único sabor (solo aplica para Pizza, Calzone y Pasta)
    const unicoSabor = [1, 2, 3].includes(categoriaId) ? saboresSeleccionados.length === 1 : null;

    // Calcular precio para Pizza (suma de precios de sabores)
    if (categoriaId === 1 && tamanioId) {
      const precioTotal = saboresSeleccionados.reduce((total, sabor) => {
        const ts = tamanioSabores.find(ts => 
          ts.tamanio_id === sabor.tamanio_id && ts.sabor_id === sabor.sabor_id
        );
        return total + (ts?.precio || 0);
      }, 0);
      setPrecio(precioTotal);
    }

    // Crear FormData para enviar imagen
    const formData = new FormData();
    formData.append('nombre', nombre.trim());
    if (precio !== null) formData.append('precio', precio.toString());
    if (stock !== null) formData.append('stock', stock.toString());
    if (imagen) formData.append('imagen', imagen);
    if (descripcion.trim()) formData.append('descripcion', descripcion.trim());
    if (impuesto !== null) formData.append('impuesto', impuesto.toString());
    if (descuento !== null) formData.append('descuento', descuento.toString());
    formData.append('destacado', destacado.toString());
    formData.append('habilitado', habilitado.toString());
    formData.append('unico_sabor', unicoSabor !== null ? unicoSabor.toString() : 'null');
    formData.append('categoria_id', categoriaId.toString());
    saboresSeleccionados.forEach((sabor, index) => {
      formData.append(`tamanio_sabores[${index}][tamanio_id]`, sabor.tamanio_id.toString());
      formData.append(`tamanio_sabores[${index}][sabor_id]`, sabor.sabor_id.toString());
    });

    try {
      setLoading(true);
      let res: Response;

      if (modoEdicion && idEditando !== null) {
        res = await fetch(`${PRODUCTOS_URL}/${idEditando}`, {
          method: 'PUT',
          body: formData,
        });
      } else {
        res = await fetch(PRODUCTOS_URL, {
          method: 'POST',
          body: formData,
        });
      }

      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.error || 'Error al guardar producto');
      }

      setSuccess(modoEdicion ? 'Producto actualizado correctamente' : 'Producto creado correctamente');
      await fetchData();
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

  // Resetear formulario
  const resetForm = () => {
    setCategoriaId(null);
    setNombre('');
    setTamanioId(null);
    setSaboresSeleccionados([]);
    setPrecio(null);
    setStock(null);
    setImagen(null);
    setImagenPreview(null);
    setDescripcion('');
    setImpuesto(null);
    setDescuento(null);
    setDestacado(false);
    setHabilitado(true);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  // Editar producto
  const handleEditar = (producto: Producto) => {
    setModoEdicion(true);
    setIdEditando(producto.id);
    setCategoriaId(producto.categoria_id);
    setNombre(producto.nombre);
    setPrecio(producto.precio);
    setStock(producto.stock);
    setImagenPreview(producto.imagen);
    setDescripcion(producto.descripcion || '');
    setImpuesto(producto.impuesto);
    setDescuento(producto.descuento);
    setDestacado(producto.destacado);
    setHabilitado(producto.habilitado);
    setSaboresSeleccionados(producto.tamanio_sabores || []);
    
    // Si tiene sabores, establecer el primer tamaño
    if (producto.tamanio_sabores && producto.tamanio_sabores.length > 0) {
      setTamanioId(producto.tamanio_sabores[0].tamanio_id);
    }
  };

  // Eliminar producto
  const handleEliminarClick = (id: number) => {
    setItemToDelete(id);
    setShowDeleteModal(true);
  };

  const handleConfirmDelete = async () => {
    if (!itemToDelete) return;

    try {
      setLoading(true);
      const res = await fetch(`${PRODUCTOS_URL}/${itemToDelete}`, { 
        method: 'DELETE' 
      });
      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.error || 'Error al eliminar producto');
      }
      setSuccess('Producto eliminado correctamente');
      await fetchData();
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

  // Formatear precio
  const formatPrice = (price: any): string => {
    const parsed = Number(price);
    return !isNaN(parsed) ? `$${parsed.toFixed(2)}` : '-';
  };

  // Formatear número
  const formatNumber = (num: number | null): string => {
    return num !== null ? num.toString() : '-';
  };

  // Manejar cambios en inputs numéricos
  const handleNumberChange = (
    e: React.ChangeEvent<HTMLInputElement>,
    setter: React.Dispatch<React.SetStateAction<number | null>>
  ) => {
    const value = e.target.value;
    setter(value === '' ? null : parseFloat(value));
  };

  // Obtener tamaños filtrados por categoría
  const getTamaniosFiltrados = () => {
    return categoriaId ? tamanios.filter(t => t.categoria_id === categoriaId) : [];
  };

  // Obtener sabores disponibles para el tamaño seleccionado
  const getSaboresDisponibles = () => {
    return tamanioId ? tamanioSabores.filter(ts => ts.tamanio_id === tamanioId) : [];
  };

  // Determinar si la categoría necesita tamaños y sabores (Pizza, Calzone, Pasta)
  const necesitaTamaniosSabores = () => {
    return categoriaId === 1 || categoriaId === 2 || categoriaId === 3;
  };

  // Determinar si la categoría necesita precio directo (Bebidas, Agregados)
  const necesitaPrecioDirecto = () => {
    return categoriaId === 4 || categoriaId === 5;
  };

  // Determinar si es pizza (puede tener hasta 2 sabores)
  const esPizza = () => {
    return categoriaId === 1;
  };

  return (
    <div className="min-h-screen bg-gray-50 flex">
      <HeaderAdmin />
      <div className="flex-1 overflow-auto">
        <Topbar title="Gestión de Productos" />

        <main className="p-6 space-y-6">
          {/* Alertas */}
          {error && (
            <Alert type="error" message={error} onClose={() => setError(null)} />
          )}
          
          {success && (
            <Alert type="success" message={success} onClose={() => setSuccess(null)} />
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
              {/* Select de Categoría */}
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Categoría *
                </label>
                <select
                  value={categoriaId || ''}
                  onChange={(e) => setCategoriaId(e.target.value ? parseInt(e.target.value) : null)}
                  className="w-full border border-gray-300 rounded px-4 py-2 focus:ring-2 focus:ring-red-500 focus:border-red-500 outline-none transition"
                  disabled={loading || modoEdicion}
                  required
                >
                  <option value="">Seleccionar categoría</option>
                  {categorias.map((categoria) => (
                    <option key={categoria.id} value={categoria.id}>
                      {categoria.nombre}
                    </option>
                  ))}
                </select>
              </div>

              {/* Solo mostrar el resto del formulario si se ha seleccionado una categoría */}
              {categoriaId && (
                <>
                {/* Campo para el nombre del producto */}
<div className="md:col-span-2">
  <label className="block text-sm font-medium text-gray-700 mb-1">
    Nombre del Producto *
  </label>
  <input
    type="text"
    placeholder="Nombre del producto"
    value={nombre}
    onChange={(e) => setNombre(e.target.value)}
    className="w-full border border-gray-300 rounded px-4 py-2 focus:ring-2 focus:ring-red-500 focus:border-red-500 outline-none transition"
    disabled={loading}
    required
  />
</div>
                  

                  {/* Campos para categorías que necesitan tamaños y sabores (Pizza, Calzone, Pasta) */}
                  {necesitaTamaniosSabores() && (
                    <>
                      {/* Select de Tamaño */}
                      
                <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Tamaño *
                </label>
                <select
                  value={tamanioId || ''}
                  onChange={(e) => setTamanioId(e.target.value ? parseInt(e.target.value) : null)}
                  className="w-full border border-gray-300 rounded px-4 py-2 focus:ring-2 focus:ring-red-500 focus:border-red-500 outline-none transition"
                  disabled={loading || modoEdicion}
                  required
                >
                  <option value="">Seleccionar Tamaño</option>
                  {tamanios.map((tamanio) => (
                    <option key={tamanio.id} value={tamanio.id}>
                      {tamanio.nombre}
                    </option>
                  ))}
                </select>
              </div>    
{/* Select de TamanioSabor */}
<div className="md:col-span-2">
  <label className="block text-sm font-medium text-gray-700 mb-1">
    Combinación Tamaño-Sabor *
  </label>
  <select
    value={tamanioSaborId || ''}
    onChange={(e) => setTamanioSaborId(e.target.value ? parseInt(e.target.value) : null)}
    className="w-full border border-gray-300 rounded px-4 py-2 focus:ring-2 focus:ring-red-500 focus:border-red-500 outline-none transition"
    disabled={loading}
    required
  >
    <option value="">Seleccionar combinación</option>
    {tamanioSabores.map((ts) => {
      // Buscar el tamaño correspondiente
      const tamanio = tamanios.find(t => t.id === ts.tamanio_id);
      // Buscar el sabor correspondiente (asumiendo que tienes acceso a los sabores)
      const sabor = sabores.find(s => s.id === ts.sabor_id);
      
      return (
        <option key={ts.id} value={ts.id}>
          {tamanio?.nombre || `Tamaño ID:${ts.tamanio_id}`} - 
          {sabor?.nombre || `Sabor ID:${ts.sabor_id}`} - 
          ${ts.precio.toFixed(2)}
        </option>
      );
    })}
  </select>
</div>
                    </>
                  )}

                  {/* Campos para categorías que necesitan precio directo (Bebidas, Agregados) */}
                  {necesitaPrecioDirecto() && (
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
                  )}

                  {/* Stock */}
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

                  {/* Imagen */}
                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Imagen
                    </label>
                    <div className="flex items-center space-x-4">
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
                          className="cursor-pointer bg-gray-100 hover:bg-gray-200 text-gray-700 px-4 py-2 rounded-md transition-colors"
                        >
                          Seleccionar imagen
                        </label>
                      </div>
                      {imagenPreview && (
                        <div className="w-16 h-16 border border-gray-300 rounded-md overflow-hidden">
                          <img 
                            src={imagenPreview} 
                            alt="Preview" 
                            className="w-full h-full object-cover"
                          />
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Descripción */}
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

                  {/* Impuesto */}
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

                  {/* Descuento */}
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

                  {/* Checkboxes */}
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
                </>
              )}
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
              {categoriaId && (
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
              )}
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
                      <th className="px-4 py-3 font-semibold text-gray-700">Categoría</th>
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
                        <td className="px-4 py-3">
                          {categorias.find(c => c.id === producto.categoria_id)?.nombre || '-'}
                        </td>
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
                        <td colSpan={7} className="px-4 py-6 text-center text-gray-500">
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