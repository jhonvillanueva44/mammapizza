import { useState, useEffect, RefObject } from 'react';

type Categoria = { id: number; nombre: string };
type Tamanio = { id: number; nombre: string; tipo: string };
type TamanioSabor = { id: number; tamanio_id: number; sabor_id: number };
type Sabor = { id: number; nombre: string };
type Producto = any;

type Props = {
  categoriaId: number | null;
  categorias: Categoria[];
  nombre: string;
  setNombre: (value: string) => void;
  tamanioId: number | null;
  setTamanioId: (value: number | null) => void;
  tamanioSaborId: number | null;
  setTamanioSaborId: (value: number | null) => void;
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
  modoEdicion: boolean;
  onError: (msg: string) => void;
  handleNumberChange: (e: React.ChangeEvent<HTMLInputElement>, setState: (val: number | null) => void) => void;
};

export function usePizzaForm({
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
  onError,
  handleNumberChange,
}: Props) {
  const [tamanios, setTamanios] = useState<Tamanio[]>([]);
  const [tamanioSabores, setTamanioSabores] = useState<TamanioSabor[]>([]);
  const [sabores, setSabores] = useState<Sabor[]>([]);

  const TAMANIOS_URL = 'http://localhost:4000/api/tamanios';
  const TAMANIO_SABORES_URL = 'http://localhost:4000/api/tamanioSabor';
  const SABORES_URL = 'http://localhost:4000/api/sabores';

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [tRes, tsRes, sRes] = await Promise.all([
          fetch(TAMANIOS_URL),
          fetch(TAMANIO_SABORES_URL),
          fetch(SABORES_URL),
        ]);
        if (!tRes.ok || !tsRes.ok || !sRes.ok) throw new Error('Error al cargar datos');
        const [tData, tsData, sData] = await Promise.all([
          tRes.json(), tsRes.json(), sRes.json()
        ]);

        setTamanios(tData);
        setTamanioSabores(tsData);
        setSabores(sData);
      } catch (err: any) {
        onError('Error al cargar los datos de Pizza');
      }
    };

    if (categoriaId) fetchData();
  }, [categoriaId]);

  const renderFormularioPizza = () => {
    const categoriaNombre = categorias.find(c => c.id === categoriaId)?.nombre?.toLowerCase().replace(/s$/, '').trim() || '';
    const tamaniosFiltrados = tamanios.filter(t => t.tipo?.toLowerCase().trim() === categoriaNombre);
    const tamanioSaboresFiltrados = tamanioSabores.filter(ts =>
      tamaniosFiltrados.some(t => t.id === ts.tamanio_id)
    );

    return (
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Nombre */}
        <div className="md:col-span-2">
          <label className="block text-sm font-medium text-gray-700 mb-1">Nombre del Producto *</label>
          <input
            type="text"
            value={nombre}
            onChange={(e) => setNombre(e.target.value)}
            className="w-full border border-gray-300 rounded px-4 py-2"
            disabled={loading}
            required
          />
        </div>

        {/* Tamaño */}
        <div className="md:col-span-2">
          <label className="block text-sm font-medium text-gray-700 mb-1">Tamaño *</label>
          <select
            value={tamanioId || ''}
            onChange={(e) => setTamanioId(parseInt(e.target.value) || null)}
            className="w-full border border-gray-300 rounded px-4 py-2"
            disabled={loading || modoEdicion}
          >
            <option value="">Seleccionar Tamaño</option>
            {tamaniosFiltrados.map(t => (
              <option key={t.id} value={t.id}>{t.nombre}</option>
            ))}
          </select>
        </div>

        {/* Tamaño y Sabor */}
        <div className="md:col-span-2">
          <label className="block text-sm font-medium text-gray-700 mb-1">Tamaño y Sabor *</label>
          <select
            value={tamanioSaborId || ''}
            onChange={(e) => setTamanioSaborId(parseInt(e.target.value) || null)}
            className="w-full border border-gray-300 rounded px-4 py-2"
            disabled={loading || modoEdicion}
          >
            <option value="">Seleccionar sabor</option>
            {tamanioSaboresFiltrados.map((ts) => {
              const t = tamanios.find(t => t.id === ts.tamanio_id);
              const s = sabores.find(s => s.id === ts.sabor_id);
              return (
                <option key={ts.id} value={ts.id}>
                  {(t?.nombre || 'Sin tamaño')} - {(s?.nombre || 'Sin sabor')}
                </option>
              );
            })}
          </select>
        </div>

        {/* Stock */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Stock</label>
          <input
            type="number"
            value={stock ?? ''}
            onChange={(e) => handleNumberChange(e, setStock)}
            className="w-full border border-gray-300 rounded px-4 py-2"
            disabled={loading}
            min="0"
          />
        </div>

        {/* Imagen */}
        <div className="md:col-span-2">
          <label className="block text-sm font-medium text-gray-700 mb-1">Imagen</label>
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
                className="cursor-pointer bg-gray-100 hover:bg-gray-200 text-gray-700 px-4 py-2 rounded-md"
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
        <div className="md:col-span-2">
          <label className="block text-sm font-medium text-gray-700 mb-1">Descripción</label>
          <textarea
            value={descripcion}
            onChange={(e) => setDescripcion(e.target.value)}
            className="w-full border border-gray-300 rounded px-4 py-2"
            rows={3}
            disabled={loading}
          />
        </div>

        {/* Impuesto */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Impuesto (%)</label>
          <input
            type="number"
            value={impuesto ?? ''}
            onChange={(e) => handleNumberChange(e, setImpuesto)}
            className="w-full border border-gray-300 rounded px-4 py-2"
            disabled={loading}
            min="0"
            max="100"
          />
        </div>

        {/* Descuento */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Descuento (%)</label>
          <input
            type="number"
            value={descuento ?? ''}
            onChange={(e) => handleNumberChange(e, setDescuento)}
            className="w-full border border-gray-300 rounded px-4 py-2"
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
            className="h-4 w-4 text-red-600 border-gray-300 rounded"
            disabled={loading}
          />
          <label htmlFor="destacado" className="text-sm text-gray-700">Producto destacado</label>
        </div>

        <div className="flex items-center space-x-2">
          <input
            type="checkbox"
            id="habilitado"
            checked={habilitado}
            onChange={(e) => setHabilitado(e.target.checked)}
            className="h-4 w-4 text-red-600 border-gray-300 rounded"
            disabled={loading}
          />
          <label htmlFor="habilitado" className="text-sm text-gray-700">Producto habilitado</label>
        </div>
      </div>
    );
  };

  return {
    renderFormularioPizza,
    resetForm: () => {
      setTamanioId(null);
      setTamanioSaborId(null);
    },
    loadProductData: (producto: Producto) => {
      setNombre(producto.nombre || '');
      setTamanioId(producto.tamanio_id || null);
      setTamanioSaborId(null);
      setPrecio(producto.precio);
      setStock(producto.stock);
      setDescripcion(producto.descripcion || '');
      setImpuesto(producto.impuesto || 0);
      setDescuento(producto.descuento || 0);
      setDestacado(producto.destacado);
      setHabilitado(producto.habilitado);
    },
    handleGuardar: () => {
      alert('Función guardar aún por implementar');
    }
  };
}