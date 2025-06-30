//modalPromociones.tsx
'use client';
import { useState, useEffect } from 'react';
import LoadingSpinner from '@/components/adminComponents/LoadingSpinner';
import ModalVisualizarProductos from '@/adminModals/ModalVisualizarProducto';
// Types
type Categoria = { id: number; nombre: string };
type Producto = {
  id: number;
  nombre: string;
  precio: number;
  stock: number;
  categoria_id: number;
  descripcion: string;
  impuesto: number;
  descuento: number;
  destacado: boolean;
  habilitado: boolean;
  unico_sabor: boolean | null;
  tamanio_sabor_ids: number[];
  imagen: string;
};

type ProductoPromocion = {
  producto_id: number;
  cantidad: number;
};

type Promocion = {
  id?: number;
  nombre: string;
  precio: number;
  stock: number;
  imagen?: string;
  descripcion: string;
  impuesto: number;
  descuento: number;
  destacado: boolean;
  habilitado: boolean;
  unico_sabor: string; // null como string
  categoria_id: number;
  tamanio_sabor_ids: string; // string vacío
  productos: ProductoPromocion[];
};

type Props = {
  loading: boolean;
  modoEdicion: boolean;
  promocionEditando: Promocion | null;
  onError: (msg: string) => void;
  onSave: (msg: string, promocion?: Promocion) => void;
  refreshPromociones: () => void;
  onClose: () => void;
  categorias: Categoria[];
};

export default function ModalPromociones({
  loading: parentLoading,
  modoEdicion,
  promocionEditando,
  onError,
  onSave,
  refreshPromociones,
  onClose,
  categorias,
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
  const [fileInputRef, setFileInputRef] = useState<HTMLInputElement | null>(null);

  // Estados para productos
  const [productos, setProductos] = useState<Producto[]>([]);
  const [categoriaFiltro, setCategoriaFiltro] = useState<number | null>(null);
  const [productosSeleccionados, setProductosSeleccionados] = useState<ProductoPromocion[]>([]);

  // Estado para el modal de visualización
  const [showModalVisualizacion, setShowModalVisualizacion] = useState(false);

  const PROMOCIONES_URL = `${process.env.NEXT_PUBLIC_BACK_HOST}api/promociones`;
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
    setPrecio(null);
    setStock(null);
    setDescripcion('');
    setImpuesto(null);
    setDescuento(null);
    setDestacado(false);
    setHabilitado(true);
    setImagenPreview(null);
    setCategoriaFiltro(null);
    setProductosSeleccionados([]);
    if (fileInputRef) {
      fileInputRef.value = '';
    }
  };

  // Cargar productos
  useEffect(() => {
    const fetchProductos = async () => {
      try {
        setLoading(true);
        const response = await fetch(PRODUCTOS_URL);
        if (!response.ok) throw new Error('Error al cargar productos');
        const data = await response.json();
        setProductos(data);
      } catch (err: any) {
        onError(err.message || 'Error al cargar los productos');
      } finally {
        setLoading(false);
      }
    };

    fetchProductos();
  }, []);

  // Cargar datos en modo edición
  useEffect(() => {
    if (modoEdicion && promocionEditando) {
      setNombre(promocionEditando.nombre);
      setPrecio(promocionEditando.precio);
      setStock(promocionEditando.stock);
      setDescripcion(promocionEditando.descripcion || '');
      setImpuesto(promocionEditando.impuesto || 0);
      setDescuento(promocionEditando.descuento || 0);
      setDestacado(promocionEditando.destacado);
      setHabilitado(promocionEditando.habilitado);
      setProductosSeleccionados(promocionEditando.productos || []);
    } else {
      resetForm();
    }
  }, [modoEdicion, promocionEditando]);

  const agregarProducto = (productoId: number) => {
    const productoExiste = productosSeleccionados.find(p => p.producto_id === productoId);
    if (!productoExiste) {
      setProductosSeleccionados([...productosSeleccionados, { producto_id: productoId, cantidad: 1 }]);
    }
  };

  const removerProducto = (productoId: number) => {
    setProductosSeleccionados(productosSeleccionados.filter(p => p.producto_id !== productoId));
  };

  const actualizarCantidad = (productoId: number, cantidad: number | string) => {
    // Si es string vacío, permitirlo temporalmente
    if (cantidad === '') {
      setProductosSeleccionados(
        productosSeleccionados.map(p => 
          p.producto_id === productoId ? { ...p, cantidad: cantidad as any } : p
        )
      );
      return;
    }
    
    // Solo permitir números positivos enteros
    const numero = typeof cantidad === 'string' ? parseInt(cantidad) : cantidad;
    const cantidadValida = numero <= 0 ? 1 : numero;
    
    setProductosSeleccionados(
      productosSeleccionados.map(p => 
        p.producto_id === productoId ? { ...p, cantidad: cantidadValida } : p
      )
    );
  };

  const getProductoInfo = (productoId: number) => {
    return productos.find(p => p.id === productoId);
  };

  const getCategoriaNombre = (categoriaId: number) => {
    return categorias.find(c => c.id === categoriaId)?.nombre || '';
  };

  const productosFiltrados = productos.filter(producto => {
    if (!categoriaFiltro) return true;
    return producto.categoria_id === categoriaFiltro;
  });

  const handleGuardar = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      if (!nombre || precio === null) {
        throw new Error('El nombre y precio son obligatorios');
      }

      if (productosSeleccionados.length === 0) {
        throw new Error('Debe seleccionar al menos un producto');
      }

      const formData = new FormData();
      
      formData.append('nombre', nombre);
      formData.append('precio', precio.toString());
      formData.append('stock', stock?.toString() || '0');
      formData.append('categoria_id', '5');
      formData.append('descripcion', descripcion);
      formData.append('impuesto', impuesto?.toString() || '0');
      formData.append('descuento', descuento?.toString() || '0');
      formData.append('destacado', destacado.toString());
      formData.append('habilitado', habilitado.toString());
      formData.append('unico_sabor', 'null');
      formData.append('tamanio_sabor_ids', '');
      formData.append('productos', JSON.stringify(productosSeleccionados));

      if (fileInputRef?.files?.[0]) {
        formData.append('imagen', fileInputRef.files[0]);
      }

      const response = await fetch(
        modoEdicion && promocionEditando?.id
          ? `${PROMOCIONES_URL}/${promocionEditando.id}`
          : PROMOCIONES_URL,
        {
          method: modoEdicion ? 'PUT' : 'POST',
          body: formData,
        }
      );

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Error al guardar la promoción');
      }

      const data = await response.json();
      onSave(
        modoEdicion ? 'Promoción actualizada correctamente' : 'Promoción creada correctamente',
        data.promocion
      );
      refreshPromociones();
      onClose();

    } catch (error: any) {
      onError(error.message || 'Error al guardar la promoción');
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <form onSubmit={handleGuardar} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Primera columna */}
          <div className="space-y-4">
            {/* Nombre */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Nombre de la Promoción *
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

            {/* Precio */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Precio *</label>
              <input
                type="number"
                value={precio ?? ''}
                onChange={(e) => handleNumberChange(e, setPrecio)}
                className="w-full border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-red-500"
                disabled={loading}
                min="0"
                step="0.01"
                required
              />
            </div>

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
          </div>

          {/* Segunda columna */}
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

            {/* Descripción */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Descripción</label>
              <textarea
                value={descripcion}
                onChange={(e) => setDescripcion(e.target.value)}
                className="w-full border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-red-500"
                rows={3}
                disabled={loading}
              />
            </div>
          </div>

          {/* Tercera columna */}
          <div className="space-y-4">
            {/* Checkboxes */}
            <div className="space-y-2">
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
                  Promoción destacada
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
                  Promoción habilitada
                </label>
              </div>
            </div>
          </div>
        </div>

        {/* Sección de productos */}
        <div className="border-t border-gray-200 pt-6">
          <div className="flex items-center justify-between mb-4">
            <h4 className="text-lg font-medium text-gray-800">Productos de la Promoción</h4>
          </div>
          
          {/* Filtro por categoría */}
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Filtrar por categoría
            </label>
            <select
              value={categoriaFiltro || ''}
              onChange={(e) => setCategoriaFiltro(e.target.value ? parseInt(e.target.value) : null)}
              className="w-full md:w-64 border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-red-500"
              disabled={loading}
            >
              <option value="">Todas las categorías</option>
              {categorias.map((categoria) => (
                <option key={categoria.id} value={categoria.id}>
                  {categoria.nombre}
                </option>
              ))}
            </select>
          </div>

          {/* Selector de productos */}
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Agregar producto
            </label>
            <select
              onChange={(e) => {
                if (e.target.value) {
                  agregarProducto(parseInt(e.target.value));
                  e.target.value = '';
                }
              }}
              className="w-full border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-red-500"
              disabled={loading}
            >
              <option value="">Seleccionar producto...</option>
              {productosFiltrados
                .filter(producto => !productosSeleccionados.find(p => p.producto_id === producto.id))
                .map((producto) => (
                  <option key={producto.id} value={producto.id}>
                    {producto.nombre} - {getCategoriaNombre(producto.categoria_id)} - ${producto.precio}
                  </option>
                ))}
            </select>
          </div>

          {/* Lista de productos seleccionados */}
          {productosSeleccionados.length > 0 && (
            <div className="bg-gray-50 rounded-lg p-4">
              <h5 className="font-medium text-gray-800 mb-3">Productos seleccionados:</h5>
              <div className="space-y-2">
                {productosSeleccionados.map((productoPromo) => {
                  const producto = getProductoInfo(productoPromo.producto_id);
                  if (!producto) return null;
                  
                  return (
                    <div key={productoPromo.producto_id} className="flex items-center justify-between bg-white p-3 rounded border">
                      <div className="flex-1">
                        <div className="font-medium text-sm">{producto.nombre}</div>
                        <div className="text-xs text-gray-500">{getCategoriaNombre(producto.categoria_id)} - ${producto.precio}</div>
                      </div>
                      <div className="flex items-center gap-2">
                        <label className="text-xs text-gray-600">Cant:</label>
                        <input
                          type="text"
                          value={productoPromo.cantidad}
                          onChange={(e) => {
                            const valor = e.target.value;
                            
                            // Permitir campo vacío temporalmente
                            if (valor === '') {
                              // Actualizar el estado pero permitir campo vacío
                              setProductosSeleccionados(
                                productosSeleccionados.map(p => 
                                  p.producto_id === productoPromo.producto_id ? { ...p, cantidad: '' as any } : p
                                )
                              );
                              return;
                            }
                            
                            // Solo permitir números enteros (sin decimales)
                            if (/^\d+$/.test(valor)) {
                              const numero = parseInt(valor);
                              if (numero > 0) {
                                actualizarCantidad(productoPromo.producto_id, numero);
                              }
                            }
                          }}
                          className="w-16 border border-gray-300 rounded px-2 py-1 text-sm"
                          onBlur={(e) => {
                            const valor = e.target.value;
                            // Al perder el foco, asegurar que hay un valor válido
                            if (valor === '' || parseInt(valor) <= 0 || !(/^\d+$/.test(valor))) {
                              actualizarCantidad(productoPromo.producto_id, 1);
                            }
                          }}
                          onKeyDown={(e) => {
                            // Prevenir teclas que no sean números, backspace, delete, tab, escape, enter, o flechas
                            if (
                              ![8, 9, 27, 13, 46].includes(e.keyCode) && // backspace, tab, escape, enter, delete
                              (e.keyCode < 37 || e.keyCode > 40) && // flechas
                              (e.keyCode < 48 || e.keyCode > 57) && // números principales
                              (e.keyCode < 96 || e.keyCode > 105) // números del teclado numérico
                            ) {
                              e.preventDefault();
                            }
                          }}
                          placeholder="1"
                        />
                        <button
                          type="button"
                          onClick={() => removerProducto(productoPromo.producto_id)}
                          className="text-red-600 hover:text-red-800 ml-2"
                        >
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                          </svg>
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}
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

      {/* Modal de visualización de productos */}
      <ModalVisualizarProductos
        isOpen={showModalVisualizacion}
        onClose={() => setShowModalVisualizacion(false)}
        productosSeleccionados={productosSeleccionados}
        productos={productos}
        categorias={categorias}
      />
    </>
  );
}