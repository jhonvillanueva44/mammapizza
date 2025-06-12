import { useState, useEffect, RefObject } from 'react';

// Types
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

export function usePizzaForm({
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
  const [tamanios, setTamanios] = useState<Tamanio[]>([]);
  const [tamanioSabores, setTamanioSabores] = useState<TamanioSabor[]>([]);
  const [sabores, setSabores] = useState<Sabor[]>([]);
  const [combinaciones, setCombinaciones] = useState<Combinacion[]>([]);
  const [combinacionesExistentes, setCombinacionesExistentes] = useState<{tamanio: Tamanio, sabor: Sabor, id: number}[]>([]);

  const TAMANIOS_URL = 'http://localhost:4000/api/tamanios';
  const TAMANIO_SABORES_URL = 'http://localhost:4000/api/tamanioSabor';
  const SABORES_URL = 'http://localhost:4000/api/sabores';
  const PRODUCTOS_URL = 'http://localhost:4000/api/productos';

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

        // Crear combinaciones de tamaño-sabor existentes
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
        onError(err.message || 'Error al cargar los datos de Pizza');
      } finally {
        setLoading(false);
      }
    };

    if (categoriaId) fetchData();
  }, [categoriaId]);

  useEffect(() => {
    // Inicializar con una combinación vacía si no hay ninguna
    if (combinaciones.length === 0) {
      setCombinaciones([{ tamanio_id: null, sabor_id: null }]);
    }
  }, []);

  useEffect(() => {
    if (modoEdicion && productoEditando) {
      // Cargar datos del producto en edición
      if (productoEditando.tamanio_sabor_ids && productoEditando.tamanio_sabor_ids.length > 0) {
        const comb = productoEditando.tamanio_sabor_ids.map(id => {
          const ts = tamanioSabores.find(ts => ts.id === id);
          return ts ? { 
            id: ts.id,
            tamanio_id: ts.tamanio_id, 
            sabor_id: ts.sabor_id 
          } : null;
        }).filter(Boolean) as Combinacion[];
        
        setCombinaciones(comb.length > 0 ? comb : [{ tamanio_id: null, sabor_id: null }]);
      }
    }
  }, [modoEdicion, productoEditando, tamanioSabores]);

  const agregarCombinacion = () => {
    if (combinaciones.length < 2) {
      setCombinaciones([...combinaciones, { tamanio_id: null, sabor_id: null }]);
    } else {
      onError('Solo se permiten 2 combinaciones como máximo');
    }
  };

  const eliminarCombinacion = (index: number) => {
    const nuevasCombinaciones = [...combinaciones];
    nuevasCombinaciones.splice(index, 1);
    setCombinaciones(nuevasCombinaciones.length > 0 ? nuevasCombinaciones : [{ tamanio_id: null, sabor_id: null }]);
  };

  const actualizarCombinacion = (index: number, campo: 'tamanio_id' | 'sabor_id', valor: number | null) => {
    const nuevasCombinaciones = [...combinaciones];
    nuevasCombinaciones[index] = { ...nuevasCombinaciones[index], [campo]: valor };
    
    // Si se cambia el tamaño, resetear el sabor
    if (campo === 'tamanio_id') {
      nuevasCombinaciones[index].sabor_id = null;
    }
    
    setCombinaciones(nuevasCombinaciones);
  };

  const renderSelectTamanio = (index: number) => {
    const categoriaNombre = categorias.find(c => c.id === categoriaId)?.nombre?.toLowerCase().replace(/s$/, '').trim() || '';
    const tamaniosFiltrados = tamanios.filter(t => t.tipo?.toLowerCase().trim() === categoriaNombre);
    
    return (
      <select
        value={combinaciones[index].tamanio_id || ''}
        onChange={(e) => actualizarCombinacion(index, 'tamanio_id', e.target.value ? parseInt(e.target.value) : null)}
        className="w-full border border-gray-300 rounded px-3 py-2 text-sm"
        disabled={loading}
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

  const renderSelectSabor = (index: number) => {
    const tamanioId = combinaciones[index].tamanio_id;
    
    // Obtener sabores disponibles para el tamaño seleccionado
    const saboresDisponibles = tamanioId 
      ? combinacionesExistentes
          .filter(c => c.tamanio.id === tamanioId)
          .map(c => c.sabor)
      : [];

    return (
      <select
        value={combinaciones[index].sabor_id || ''}
        onChange={(e) => actualizarCombinacion(index, 'sabor_id', e.target.value ? parseInt(e.target.value) : null)}
        className="w-full border border-gray-300 rounded px-3 py-2 text-sm"
        disabled={loading || !tamanioId}
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

  const renderFormularioPizza = () => {
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

          {/* Combinaciones Tamaño-Sabor */}
          <div className="space-y-4">
            <label className="block text-sm font-medium text-gray-700 mb-1">Combinaciones Tamaño-Sabor *</label>
            
            {combinaciones.map((combinacion, index) => (
              <div key={index} className="space-y-2">
                <div className="flex items-center gap-2">
                  <div className="flex-1">
                    <div className="text-xs text-gray-500 mb-1">Tamaño</div>
                    {renderSelectTamanio(index)}
                  </div>
                  <div className="flex-1">
                    <div className="text-xs text-gray-500 mb-1">Sabor</div>
                    {renderSelectSabor(index)}
                  </div>
                  {index > 0 && (
                    <button
                      type="button"
                      onClick={() => eliminarCombinacion(index)}
                      className="text-red-500 hover:text-red-700 mt-5"
                      disabled={loading}
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd" />
                      </svg>
                    </button>
                  )}
                </div>
              </div>
            ))}

            {combinaciones.length < 2 && (
              <button
                type="button"
                onClick={agregarCombinacion}
                className="flex items-center gap-1 text-sm text-blue-600 hover:text-blue-800"
                disabled={loading}
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M10 5a1 1 0 011 1v3h3a1 1 0 110 2h-3v3a1 1 0 11-2 0v-3H6a1 1 0 110-2h3V6a1 1 0 011-1z" clipRule="evenodd" />
                </svg>
                Agregar otra combinación
              </button>
            )}
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
    if (!nombre || !categoriaId) {
      throw new Error('Nombre y categoría son obligatorios');
    }

    const combinacionesValidas = combinaciones.filter(c => c.tamanio_id && c.sabor_id);
    if (combinacionesValidas.length === 0) {
      throw new Error('Debe completar al menos una combinación tamaño-sabor');
    }

    const tamanioSaborIds = combinacionesValidas.map(c => {
      const relacion = tamanioSabores.find(
        ts => ts.tamanio_id === c.tamanio_id && ts.sabor_id === c.sabor_id
      );
      if (!relacion) {
        throw new Error(`No se encontró la combinación tamaño-sabor seleccionada`);
      }
      return relacion.id;
    });

    const formData = new FormData();
    const unicoSabor = tamanioSaborIds.length === 1;

    formData.append('nombre', nombre);
    formData.append('stock', stock?.toString() || '0');
    formData.append('categoria_id', categoriaId.toString());
    formData.append('descripcion', descripcion);
    formData.append('impuesto', impuesto?.toString() || '0');
    formData.append('descuento', descuento?.toString() || '0');
    formData.append('destacado', destacado.toString());
    formData.append('habilitado', habilitado.toString());
    formData.append('unico_sabor', unicoSabor.toString());
    formData.append('tamanio_sabor_ids', JSON.stringify(tamanioSaborIds));

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
    
    if (producto.tamanio_sabor_ids && producto.tamanio_sabor_ids.length > 0) {
      const comb = producto.tamanio_sabor_ids.map(id => {
        const ts = tamanioSabores.find(ts => ts.id === id);
        return ts ? { 
          id: ts.id,
          tamanio_id: ts.tamanio_id, 
          sabor_id: ts.sabor_id 
        } : null;
      }).filter(Boolean) as Combinacion[];
      
      setCombinaciones(comb.length > 0 ? comb : [{ tamanio_id: null, sabor_id: null }]);
    }
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
    setCombinaciones([{ tamanio_id: null, sabor_id: null }]);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  return {
    renderFormularioPizza,
    resetForm,
    loadProductData,
    handleGuardar,
    combinaciones,
  };
}