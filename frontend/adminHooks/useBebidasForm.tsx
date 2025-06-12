import { useState, useEffect, RefObject } from 'react';

// Types (los mismos que en usePizzaForm)
type Categoria = { id: number; nombre: string };
type Producto = {
  id?: number;
  nombre: string;
  precio: number | null;
  stock: number | null;
  categoria_id: number | null;
  descripcion: string;
  impuesto: number | null;
  descuento: number | null;
  destacado: boolean;
  habilitado: boolean;
  imagen?: string;
};

type Props = {
  categoriaId: number | null;
  categorias: Categoria[];
  nombre: string;
  setNombre: (value: string) => void;
  precio: number | null;
  setPrecio: (value: number | null) => void;
  stock: number | null;
  setStock: (value: number | null) => void;
  imagenPreview: string | null;
  handleImageChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  fileInputRef: RefObject<HTMLInputElement>;
  descripcion: string;
  setDescripcion: (value: string) => void;
  impuesto: number | null;
  setImpuesto: (value: number | null) => void;
  descuento: number | null;
  setDescuento: (value: number | null) => void;
  destacado: boolean;
  setDestacado: (value: boolean) => void;
  habilitado: boolean;
  setHabilitado: (value: boolean) => void;
  loading: boolean;
  setLoading: (value: boolean) => void;
  modoEdicion: boolean;
  productoEditando: Producto | null;
  onError: (msg: string) => void;
  onSuccess: (msg: string, producto?: Producto) => void;
  handleNumberChange: (e: React.ChangeEvent<HTMLInputElement>, setState: (val: number | null) => void) => void;
  refreshProductos: () => void;
};

export function useBebidasForm({
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
  productoEditando,
  onError,
  onSuccess,
  handleNumberChange,
  refreshProductos,
}: Props) {
  const PRODUCTOS_URL = 'http://localhost:4000/api/productos';

  useEffect(() => {
    if (modoEdicion && productoEditando) {
      // Cargar datos del producto en edición
      loadProductData(productoEditando);
    }
  }, [modoEdicion, productoEditando]);

  const renderFormularioBebidas = () => {
    return (
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Primera columna */}
        <div className="space-y-4">
          {/* Nombre */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Nombre del Producto *</label>
            <input
              type="text"
              value={nombre}
              onChange={(e) => setNombre(e.target.value)}
              className="w-full border border-gray-300 rounded px-3 py-2 text-sm"
              disabled={loading}
              required
            />
          </div>

          {/* Precio */}
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
          {/* Stock */}
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

          {/* Impuesto y Descuento */}
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
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Descuento (%)</label>
            <input
              type="number"
              value={descuento ?? ''}
              onChange={(e) => handleNumberChange(e, setDescuento)}
              className="w-full border border-gray-300 rounded px-3 py-2 text-sm"
              disabled={loading}
              min="0"
              max="100"
            />
          </div>
        </div>

        {/* Tercera columna */}
        <div className="space-y-4">
          {/* Imagen */}
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

          {/* Descripción */}
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

          {/* Checkboxes */}
          <div className="space-y-2 pt-2">
            <div className="flex items-center">
              <input
                type="checkbox"
                id="destacado"
                checked={destacado}
                onChange={(e) => setDestacado(e.target.checked)}
                className="h-4 w-4 text-red-600 border-gray-300 rounded focus:ring-red-500"
                disabled={loading}
              />
              <label htmlFor="destacado" className="ml-2 text-sm text-gray-700">Producto destacado</label>
            </div>

            <div className="flex items-center">
              <input
                type="checkbox"
                id="habilitado"
                checked={habilitado}
                onChange={(e) => setHabilitado(e.target.checked)}
                className="h-4 w-4 text-red-600 border-gray-300 rounded focus:ring-red-500"
                disabled={loading}
              />
              <label htmlFor="habilitado" className="ml-2 text-sm text-gray-700">Producto habilitado</label>
            </div>
          </div>
        </div>
      </div>
    );
  };

  const handleGuardar = async (e?: React.FormEvent) => {
    e?.preventDefault();
    setLoading(true);

    try {
      if (!nombre || !categoriaId || precio === null) {
        throw new Error('Nombre, categoría y precio son obligatorios');
      }

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

      if (fileInputRef.current?.files?.[0]) {
        formData.append('imagen', fileInputRef.current.files[0]);
      }

      const response = await fetch(
        modoEdicion && productoEditando?.id
          ? `${PRODUCTOS_URL}/${productoEditando.id}`
          : PRODUCTOS_URL,
        {
          method: modoEdicion ? 'PUT' : 'POST',
          body: formData,
        }
      );

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Error al guardar el producto');
      }

      const data = await response.json();
      onSuccess(
        modoEdicion ? 'Producto actualizado correctamente' : 'Producto creado correctamente',
        data.producto
      );
      refreshProductos();

    } catch (error: any) {
      onError(error.message || 'Error al guardar el producto');
    } finally {
      setLoading(false);
    }
  };

  const loadProductData = (producto: Producto) => {
    setNombre(producto.nombre);
    setPrecio(producto.precio);
    setStock(producto.stock);
    setDescripcion(producto.descripcion || '');
    setImpuesto(producto.impuesto || 0);
    setDescuento(producto.descuento || 0);
    setDestacado(producto.destacado);
    setHabilitado(producto.habilitado);
  };

  const resetForm = () => {
    setNombre('');
    setPrecio(null);
    setStock(null);
    setDescripcion('');
    setImpuesto(null);
    setDescuento(null);
    setDestacado(false);
    setHabilitado(true);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  return {
    renderFormularioBebidas,
    resetForm,
    loadProductData,
    handleGuardar,
  };
}