import { useState, useEffect, RefObject } from 'react';

// Types
type Categoria = { id: number; nombre: string };
type Tamanio = { id: number; nombre: string; tipo: string };
type TamanioSabor = { id: number; tamanio_id: number; sabor_id: number; precio: number };
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
  const [tamanioSeleccionado, setTamanioSeleccionado] = useState<number | null>(null);
  const [saborSeleccionado, setSaborSeleccionado] = useState<number | null>(null);
  const [precioCalculado, setPrecioCalculado] = useState<number | null>(null);
  const [combinaciones, setCombinaciones] = useState<{tamanio: Tamanio, sabor: Sabor, precio: number}[]>([]);

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

        // Crear combinaciones de tamaño-sabor
        const comb = tsData.map((ts: TamanioSabor) => {
          const tamanio = tData.find((t: Tamanio) => t.id === ts.tamanio_id);
          const sabor = sData.find((s: Sabor) => s.id === ts.sabor_id);
          return {
            tamanio,
            sabor,
            precio: ts.precio,
            id: ts.id
          };
        }).filter((c: any) => c.tamanio && c.sabor);

        setCombinaciones(comb);
      } catch (err: any) {
        onError(err.message || 'Error al cargar los datos de Pizza');
      } finally {
        setLoading(false);
      }
    };

    if (categoriaId) fetchData();
  }, [categoriaId]);

  useEffect(() => {
    if (modoEdicion && productoEditando) {
      // Cargar datos del producto en edición
      if (productoEditando.tamanio_sabor_ids && productoEditando.tamanio_sabor_ids.length > 0) {
        const relacion = tamanioSabores.find(ts => ts.id === productoEditando.tamanio_sabor_ids?.[0]);
        if (relacion) {
          setTamanioSeleccionado(relacion.tamanio_id);
          setSaborSeleccionado(relacion.sabor_id);
          setPrecioCalculado(relacion.precio || null);
          setPrecio(relacion.precio || null);
        }
      }
    }
  }, [modoEdicion, productoEditando, tamanioSabores]);

  useEffect(() => {
    if (tamanioSeleccionado && saborSeleccionado) {
      const relacion = tamanioSabores.find(
        ts => ts.tamanio_id === tamanioSeleccionado && ts.sabor_id === saborSeleccionado
      );
      if (relacion) {
        setPrecioCalculado(relacion.precio);
        setPrecio(relacion.precio);
      }
    } else {
      setPrecioCalculado(null);
    }
  }, [tamanioSeleccionado, saborSeleccionado, tamanioSabores]);

  const renderFormularioPizza = () => {
    const categoriaNombre = categorias.find(c => c.id === categoriaId)?.nombre?.toLowerCase().replace(/s$/, '').trim() || '';
    const tamaniosFiltrados = tamanios.filter(t => t.tipo?.toLowerCase().trim() === categoriaNombre);
    
    // Obtener sabores disponibles para el tamaño seleccionado
    const saboresDisponibles = tamanioSeleccionado 
      ? combinaciones
          .filter(c => c.tamanio.id === tamanioSeleccionado)
          .map(c => c.sabor)
      : [];

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

          {/* Tamaño */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Tamaño *</label>
            <select
              value={tamanioSeleccionado || ''}
              onChange={(e) => {
                const value = e.target.value ? parseInt(e.target.value) : null;
                setTamanioSeleccionado(value);
                setSaborSeleccionado(null); // Resetear sabor al cambiar tamaño
              }}
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
          </div>

          {/* Sabor */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Sabor *</label>
            <select
              value={saborSeleccionado || ''}
              onChange={(e) => {
                const value = e.target.value ? parseInt(e.target.value) : null;
                setSaborSeleccionado(value);
              }}
              className="w-full border border-gray-300 rounded px-3 py-2 text-sm"
              disabled={loading || !tamanioSeleccionado}
              required
            >
              <option value="">Seleccione un sabor</option>
              {saboresDisponibles.map((sabor) => (
                <option key={sabor.id} value={sabor.id}>
                  {sabor.nombre}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Segunda columna */}
        <div className="space-y-4">
          {/* Precio */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Precio *</label>
            <input
              type="text"
              value={precioCalculado !== null ? `$${precioCalculado.toFixed(2)}` : 'Seleccione tamaño y sabor'}
              className="w-full border border-gray-300 rounded px-3 py-2 text-sm bg-gray-100"
              readOnly
            />
          </div>

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

        {/* Tercera columna (se mantiene igual) */}
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

  const handleGuardar = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      // Validaciones básicas
      if (!nombre || !categoriaId) {
        throw new Error('Nombre y categoría son obligatorios');
      }

      if (!tamanioSeleccionado || !saborSeleccionado) {
        throw new Error('Debe seleccionar un tamaño y un sabor');
      }

      // Buscar la relación tamaño-sabor para obtener el precio y el ID de la relación
      const relacion = tamanioSabores.find(
        ts => ts.tamanio_id === tamanioSeleccionado && ts.sabor_id === saborSeleccionado
      );

      if (!relacion) {
        throw new Error('No se encontró la combinación de tamaño y sabor seleccionada');
      }

      const formData = new FormData();
      formData.append('nombre', nombre);
      formData.append('precio', relacion.precio.toString());
      formData.append('stock', stock?.toString() || '0');
      formData.append('categoria_id', categoriaId.toString());
      formData.append('descripcion', descripcion);
      formData.append('impuesto', impuesto?.toString() || '0');
      formData.append('descuento', descuento?.toString() || '0');
      formData.append('destacado', destacado.toString());
      formData.append('habilitado', habilitado.toString());
      formData.append('unico_sabor', 'true');
      formData.append('tamanio_sabor_ids', JSON.stringify([relacion.id]));

      // Agregar la imagen si hay un archivo seleccionado
      if (fileInputRef.current?.files?.[0]) {
        formData.append('imagen', fileInputRef.current.files[0]);
      }

      let response;
      if (modoEdicion && productoEditando?.id) {
        // Modo edición
        response = await fetch(`${PRODUCTOS_URL}/${productoEditando.id}`, {
          method: 'PUT',
          body: formData,
        });
      } else {
        // Modo creación
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
      onSuccess(modoEdicion ? 'Producto actualizado correctamente' : 'Producto creado correctamente', data.producto);
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
      const relacion = tamanioSabores.find(ts => ts.id === producto.tamanio_sabor_ids?.[0]);
      if (relacion) {
        setTamanioSeleccionado(relacion.tamanio_id);
        setSaborSeleccionado(relacion.sabor_id);
        setPrecioCalculado(relacion.precio);
      }
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
    setTamanioSeleccionado(null);
    setSaborSeleccionado(null);
    setPrecioCalculado(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  return {
    renderFormularioPizza,
    resetForm,
    loadProductData,
    handleGuardar,
    tamanioSeleccionado,
    saborSeleccionado,
    precioCalculado,
  };
}