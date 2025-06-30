// ModalPCA.tsx 
'use client';
import { useState, useEffect } from 'react';
import LoadingSpinner from '@/components/adminComponents/LoadingSpinner';

// Types (mantén los mismos tipos que ya tienes)
type Categoria = { id: number; nombre: string };
type Tamanio = { id: number; nombre: string; tipo: string };
type TamanioSabor = { id: number; tamanio_id: number; sabor_id: number };
type Sabor = { id: number; nombre: string };
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
  unico_sabor: boolean | null;
  tamanio_sabor_ids?: number[];
  imagen?: string;
};

type Combinacion = {
  id?: number;
  tamanio_id: number | null;
  sabor_id: number | null;
};

type Props = {
  // Removemos isOpen y onClose ya que se manejará desde el componente padre
  loading: boolean;
  modoEdicion: boolean;
  productoEditando: Producto | null;
  onError: (msg: string) => void;
  onSave: (msg: string, producto?: Producto) => void;
  refreshProductos: () => void;
  tipoProducto: 'Calzone' | 'Pasta' | 'Agregado' | 'Bebida';
  categoriaId: number;
  // Agregamos estas props que vienen del componente padre
  onClose: () => void;
  categorias: Categoria[];
};

export default function ModalPCA({
  loading: parentLoading,
  modoEdicion,
  productoEditando,
  onError,
  onSave,
  refreshProductos,
  tipoProducto,
  categoriaId,
  onClose,
  categorias,
}: Props) {
  const [loading, setLoading] = useState(false);
  
  const [nombre, setNombre] = useState('');
  const [stock, setStock] = useState<number | null>(null);
  const [descripcion, setDescripcion] = useState('');
  const [impuesto, setImpuesto] = useState<number | null>(null);
  const [descuento, setDescuento] = useState<number | null>(null);
  const [destacado, setDestacado] = useState(false);
  const [habilitado, setHabilitado] = useState(true);
  const [imagenPreview, setImagenPreview] = useState<string | null>(null);
  const [fileInputRef, setFileInputRef] = useState<HTMLInputElement | null>(null);

  const [tamanios, setTamanios] = useState<Tamanio[]>([]);
  const [tamanioSabores, setTamanioSabores] = useState<TamanioSabor[]>([]);
  const [sabores, setSabores] = useState<Sabor[]>([]);
  const [combinacion, setCombinacion] = useState<Combinacion>({ tamanio_id: null, sabor_id: null });
  const [combinacionesExistentes, setCombinacionesExistentes] = useState<{tamanio: Tamanio, sabor: Sabor, id: number}[]>([]);

  const TAMANIOS_URL = `${process.env.NEXT_PUBLIC_BACK_HOST}api/tamanios`;
  const TAMANIO_SABORES_URL = `${process.env.NEXT_PUBLIC_BACK_HOST}api/tamanioSabor`;
  const SABORES_URL = `${process.env.NEXT_PUBLIC_BACK_HOST}api/sabores`;
  const PRODUCTOS_URL = `${process.env.NEXT_PUBLIC_BACK_HOST}api/productos`;

  const handleNumberChange = (e: React.ChangeEvent<HTMLInputElement>, setState: (val: number | null) => void) => {
    const value = e.target.value;
    setState(value === '' ? null : parseFloat(value));
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

  const resetForm = () => {
    setNombre('');
    setStock(null);
    setDescripcion('');
    setImpuesto(null);
    setDescuento(null);
    setDestacado(false);
    setHabilitado(true);
    setImagenPreview(null);
    setCombinacion({ tamanio_id: null, sabor_id: null });
    if (fileInputRef) {
      fileInputRef.value = '';
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const [tRes, tsRes, sRes] = await Promise.all([
          fetch(TAMANIOS_URL),
          fetch(TAMANIO_SABORES_URL),
          fetch(SABORES_URL),
        ]);
        
        if (!tRes.ok || !tsRes.ok || !sRes.ok) throw new Error('Error al cargar datos');
        
        const [tData, tsData, sData] = await Promise.all([
          tRes.json(),
          tsRes.json(),
          sRes.json()
        ]);

        setTamanios(tData);
        setTamanioSabores(tsData);
        setSabores(sData);

        const comb = tsData.map((ts: TamanioSabor) => {
          const tamanio = tData.find((t: Tamanio) => t.id === ts.tamanio_id);
          const sabor = sData.find((s: Sabor) => s.id === ts.sabor_id);
          return {
            tamanio,
            sabor,
            id: ts.id
          };
        }).filter((c: any) => c.tamanio && c.sabor);

        setCombinacionesExistentes(comb);
      } catch (err: any) {
        onError(err.message || `Error al cargar los datos de ${tipoProducto}`);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  useEffect(() => {
    if (modoEdicion && productoEditando) {
      setNombre(productoEditando.nombre);
      setStock(productoEditando.stock);
      setDescripcion(productoEditando.descripcion || '');
      setImpuesto(productoEditando.impuesto || 0);
      setDescuento(productoEditando.descuento || 0);
      setDestacado(productoEditando.destacado);
      setHabilitado(productoEditando.habilitado);
      
      if (productoEditando.tamanio_sabor_ids && productoEditando.tamanio_sabor_ids.length > 0) {
        const ts = tamanioSabores.find(ts => ts.id === productoEditando.tamanio_sabor_ids?.[0]);
        if (ts) {
          setCombinacion({ 
            id: ts.id,
            tamanio_id: ts.tamanio_id, 
            sabor_id: ts.sabor_id 
          });
        }
      }
    } else {
      resetForm();
    }
  }, [modoEdicion, productoEditando, tamanioSabores]);

  const actualizarCombinacion = (campo: 'tamanio_id' | 'sabor_id', valor: number | null) => {
    const nuevaCombinacion = { ...combinacion, [campo]: valor };
    
    if (campo === 'tamanio_id') {
      nuevaCombinacion.sabor_id = null;
    }
    
    setCombinacion(nuevaCombinacion);
  };

  const renderSelectTamanio = () => {
    const categoriaNombre = categorias.find(c => c.id === categoriaId)?.nombre?.toLowerCase().replace(/s$/, '').trim() || '';
    const tamaniosFiltrados = tamanios.filter(t => t.tipo?.toLowerCase().trim() === categoriaNombre);
    
    return (
      <select
        value={combinacion.tamanio_id || ''}
        onChange={(e) => actualizarCombinacion('tamanio_id', e.target.value ? parseInt(e.target.value) : null)}
        className="w-full border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-red-500"
        disabled={loading || parentLoading}
        required
      >
        <option value="">Seleccione un tamaño</option>
        {tamaniosFiltrados.map((tamanio) => (
          <option key={tamanio.id} value={tamanio.id}>
            {tamanio.nombre}
          </option>
        ))}
      </select>
    );
  };

  const renderSelectSabor = () => {
    const tamanioId = combinacion.tamanio_id;
    
    const saboresDisponibles = tamanioId 
      ? combinacionesExistentes
          .filter(c => c.tamanio.id === tamanioId)
          .map(c => c.sabor)
      : [];

    return (
      <select
        value={combinacion.sabor_id || ''}
        onChange={(e) => actualizarCombinacion('sabor_id', e.target.value ? parseInt(e.target.value) : null)}
        className="w-full border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-red-500"
        disabled={loading || parentLoading || !tamanioId}
        required
      >
        <option value="">Seleccione un sabor</option>
        {saboresDisponibles.map((sabor) => (
          <option key={sabor.id} value={sabor.id}>
            {sabor.nombre}
          </option>
        ))}
      </select>
    );
  };

  const handleGuardar = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      if (!nombre) {
        throw new Error('El nombre es obligatorio');
      }

      if (!combinacion.tamanio_id || !combinacion.sabor_id) {
        throw new Error('Debe seleccionar un tamaño y un sabor');
      }

      const relacion = tamanioSabores.find(
        ts => ts.tamanio_id === combinacion.tamanio_id && ts.sabor_id === combinacion.sabor_id
      );
      
      if (!relacion) {
        throw new Error('No se encontró la combinación tamaño-sabor seleccionada');
      }

      const formData = new FormData();
      const unicoSabor = true; // Siempre true para PCA

      formData.append('nombre', nombre);
      formData.append('stock', stock?.toString() || '0');
      formData.append('categoria_id', categoriaId.toString());
      formData.append('descripcion', descripcion);
      formData.append('impuesto', impuesto?.toString() || '0');
      formData.append('descuento', descuento?.toString() || '0');
      formData.append('destacado', destacado.toString());
      formData.append('habilitado', habilitado.toString());
      formData.append('unico_sabor', unicoSabor.toString());
      formData.append('tamanio_sabor_ids', JSON.stringify([relacion.id]));

      if (fileInputRef?.files?.[0]) {
        formData.append('imagen', fileInputRef.files[0]);
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
        throw new Error(errorData.error || `Error al guardar el ${tipoProducto}`);
      }

      const data = await response.json();
      onSave(
        modoEdicion ? `${tipoProducto} actualizado correctamente` : `${tipoProducto} creado correctamente`,
        data.producto
      );
      refreshProductos();
      onClose();

    } catch (error: any) {
      onError(error.message || `Error al guardar el ${tipoProducto}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleGuardar} className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Primera columna */}
        <div className="space-y-4">
          {/* Nombre */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Nombre del {tipoProducto} *
            </label>
            <input
              type="text"
              value={nombre}
              onChange={(e) => setNombre(e.target.value)}
              className="w-full border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-red-500"
              disabled={loading}
              required
            />
          </div>

          {/* Combinación Tamaño-Sabor */}
          <div className="space-y-4">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Combinación Tamaño-Sabor *
            </label>
            
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <div className="flex-1">
                  <div className="text-xs text-gray-500 mb-1">Tamaño</div>
                  {renderSelectTamanio()}
                </div>
                <div className="flex-1">
                  <div className="text-xs text-gray-500 mb-1">Sabor</div>
                  {renderSelectSabor()}
                </div>
              </div>
            </div>
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
              className="w-full border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-red-500"
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
              className="w-full border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-red-500"
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
              className="w-full border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-red-500"
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
                  ref={(ref) => setFileInputRef(ref)}
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
              className="w-full border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-red-500"
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
              <label htmlFor="destacado" className="ml-2 text-sm text-gray-700">
                Producto destacado
              </label>
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
              <label htmlFor="habilitado" className="ml-2 text-sm text-gray-700">
                Producto habilitado
              </label>
            </div>
          </div>
        </div>
      </div>

      {/* Botones */}
      <div className="flex justify-end gap-3 pt-4 border-t border-gray-200">
        <button
          type="button"
          onClick={onClose}
          className="px-4 py-2 border border-gray-300 rounded hover:bg-gray-50 text-gray-700"
          disabled={loading}
        >
          Cancelar
        </button>
        <button
          type="submit"
          className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 flex items-center justify-center min-w-[100px]"
          disabled={loading}
        >
          {loading ? <LoadingSpinner size={5} /> : modoEdicion ? 'Actualizar' : 'Guardar'}
        </button>
      </div>
    </form>
  );
}