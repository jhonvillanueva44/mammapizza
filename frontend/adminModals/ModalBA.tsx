'use client';
import { useState, useEffect, useRef } from 'react';
import LoadingSpinner from '@/components/adminComponents/LoadingSpinner';

type Props = {
  loading: boolean;
  modoEdicion: boolean;
  productoEditando: any;
  onError: (msg: string) => void;
  onSave: (msg: string, producto?: any) => void;
  refreshProductos: () => void;
  tipoProducto: 'Bebida' | 'Adicional';
  disabled?: boolean;
};

export default function ModalBA({
  loading: parentLoading,
  modoEdicion,
  productoEditando,
  onError,
  onSave,
  refreshProductos,
  tipoProducto,
  disabled = false
}: Props) {
  const [loading, setLoading] = useState(false);
  const [nombre, setNombre] = useState('');
  const [precio, setPrecio] = useState<number | null>(null);
  const [stock, setStock] = useState<number | null>(null);
  const [descripcion, setDescripcion] = useState('');
  const [impuesto, setImpuesto] = useState<number | null>(null);
  const [descuento, setDescuento] = useState<number | null>(null);
  const [destacado, setDestacado] = useState(false);
  const [habilitado, setHabilitado] = useState(true);
  const [imagenPreview, setImagenPreview] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const PRODUCTOS_URL = `${process.env.NEXT_PUBLIC_BACK_HOST}api/productos`;

  // Si es tipo "Bebida", no renderizar el modal
  if (tipoProducto === 'Bebida') {
    return null;
  }

  const resetForm = () => {
    setNombre('');
    setPrecio(null);
    setStock(null);
    setDescripcion('');
    setImpuesto(null);
    setDescuento(null);
    setDestacado(false);
    setHabilitado(true);
    setImagenPreview(null);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        setImagenPreview(e.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleNumberChange = (e: React.ChangeEvent<HTMLInputElement>, setState: (val: number | null) => void) => {
    const value = e.target.value;
    setState(value === '' ? null : parseFloat(value));
  };

  useEffect(() => {
    if (modoEdicion && productoEditando) {
      setNombre(productoEditando.nombre);
      setPrecio(productoEditando.precio);
      setStock(productoEditando.stock);
      setDescripcion(productoEditando.descripcion || '');
      setImpuesto(productoEditando.impuesto || null);
      setDescuento(productoEditando.descuento || null);
      setDestacado(productoEditando.destacado);
      setHabilitado(productoEditando.habilitado);
      if (productoEditando.imagen) {
        setImagenPreview(productoEditando.imagen);
      }
    } else if (!modoEdicion) {
      resetForm();
    }
  }, [modoEdicion, productoEditando]);

const handleSubmit = async (e: React.FormEvent) => {
  e.preventDefault();
  if (disabled) return;
  
  setLoading(true);

  try {
    // Validaciones
    if (!nombre) throw new Error('El nombre es obligatorio');
    if (precio === null) throw new Error('El precio es obligatorio');
    if (precio <= 0) throw new Error('El precio debe ser mayor a 0');

    const formData = new FormData();
    
    // Campos principales
    formData.append('nombre', nombre);
    formData.append('precio', precio.toString());
    formData.append('stock', stock?.toString() || '0');
    // Solo categoria 6 para Adicionales (ya que eliminamos Bebidas)
    formData.append('categoria_id', '6');
    
    formData.append('tamanio', ''); 
    formData.append('sabor', ''); 
    formData.append('unico_sabor', 'null');
    
    formData.append('descripcion', descripcion);
    formData.append('impuesto', impuesto?.toString() || '0');
    formData.append('descuento', descuento?.toString() || '0');
    formData.append('destacado', destacado.toString());
    formData.append('habilitado', habilitado.toString());

    if (fileInputRef.current?.files?.[0]) {
      formData.append('imagen', fileInputRef.current.files[0]);
    } else if (modoEdicion && productoEditando?.imagen) {
      formData.append('imagen', productoEditando.imagen);
    }

    console.log('Datos a enviar:');
    for (let [key, value] of formData.entries()) {
      console.log(key, value);
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
      const errorText = await response.text();
      try {
        const errorData = JSON.parse(errorText);
        throw new Error(errorData.message || errorData.error || 'Error al guardar');
      } catch {
        throw new Error(errorText || 'Error en el servidor');
      }
    }

    const data = await response.json();
    onSave(
      modoEdicion 
        ? `${tipoProducto} actualizado correctamente` 
        : `${tipoProducto} creado correctamente`,
      data.producto
    );
    refreshProductos();
  } catch (error: any) {
    console.error('Error al guardar:', error);
    onError(error.message || 'Error al guardar el producto');
  } finally {
    setLoading(false);
  }
};

  return (
    <form onSubmit={handleSubmit}>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Nombre *</label>
            <input
              type="text"
              value={nombre}
              onChange={(e) => setNombre(e.target.value)}
              className="w-full border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-red-500"
              disabled={loading || disabled}
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Precio *</label>
            <input
              type="number"
              value={precio ?? ''}
              onChange={(e) => handleNumberChange(e, setPrecio)}
              className="w-full border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-red-500"
              disabled={loading || disabled}
              required
              min="0"
              step="0.01"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Stock</label>
            <input
              type="number"
              value={stock ?? ''}
              onChange={(e) => handleNumberChange(e, setStock)}
              className="w-full border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-red-500"
              disabled={loading || disabled}
              min="0"
            />
          </div>
        </div>

        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Impuesto (%)</label>
            <input
              type="number"
              value={impuesto ?? ''}
              onChange={(e) => handleNumberChange(e, setImpuesto)}
              className="w-full border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-red-500"
              disabled={loading || disabled}
              min="0"
              max="100"
              step="0.01"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Descuento (%)</label>
            <input
              type="number"
              value={descuento ?? ''}
              onChange={(e) => handleNumberChange(e, setDescuento)}
              className="w-full border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-red-500"
              disabled={loading || disabled}
              min="0"
              max="100"
              step="0.01"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Imagen</label>
            <input
              type="file"
              ref={fileInputRef}
              onChange={handleImageChange}
              accept="image/*"
              className="w-full border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-red-500"
              disabled={loading || disabled}
            />
            {imagenPreview && (
              <div className="mt-2 w-32 h-32 border rounded overflow-hidden">
                <img src={imagenPreview} alt="Preview" className="w-full h-full object-cover" />
              </div>
            )}
          </div>
        </div>

        <div className="md:col-span-2">
          <label className="block text-sm font-medium text-gray-700 mb-1">Descripción</label>
          <textarea
            value={descripcion}
            onChange={(e) => setDescripcion(e.target.value)}
            className="w-full border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-red-500"
            rows={3}
            disabled={loading || disabled}
          />
        </div>

        <div className="md:col-span-2 space-y-2">
          <div className="flex items-center">
            <input
              type="checkbox"
              id="destacado"
              checked={destacado}
              onChange={(e) => setDestacado(e.target.checked)}
              className="h-4 w-4 text-red-600 border-gray-300 rounded focus:ring-red-500"
              disabled={loading || disabled}
            />
            <label htmlFor="destacado" className="ml-2 text-sm text-gray-700">Destacado</label>
          </div>

          <div className="flex items-center">
            <input
              type="checkbox"
              id="habilitado"
              checked={habilitado}
              onChange={(e) => setHabilitado(e.target.checked)}
              className="h-4 w-4 text-red-600 border-gray-300 rounded focus:ring-red-500"
              disabled={loading || disabled}
            />
            <label htmlFor="habilitado" className="ml-2 text-sm text-gray-700">Habilitado</label>
          </div>
        </div>
      </div>

      <div className="mt-6 flex justify-end gap-3">
        <button
          type="submit"
          className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 flex items-center justify-center min-w-[100px]"
          disabled={loading || disabled || !nombre || precio === null}
        >
          {loading ? <LoadingSpinner size={5} /> : modoEdicion ? 'Actualizar' : 'Guardar'}
        </button>
      </div>
    </form>
  );
}