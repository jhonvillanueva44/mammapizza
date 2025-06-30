'use client';

import { useState, useEffect } from 'react';

export type Tamanio = {
  id: number;
  nombre: string;
  tipo: string;
};

export type Sabor = {
  id: number;
  nombre: string;
  tipo: string;
};

export type TamanioSabor = {
  id?: number;
  precio: number;
  tamanio_id: number;
  sabor_id: number;
  tamanio?: Tamanio;
  sabor?: Sabor;
};

type TamanioSaborModalProps = {
  isOpen: boolean;
  onClose: () => void;
  tamanios: Tamanio[];
  sabores: Sabor[];
  editingItem: TamanioSabor | null;
  onSubmitSuccess: (message: string) => void;
  onError: (message: string) => void;
  setLoading: (loading: boolean) => void;
  loading?: boolean;
};

const API_BASE_URL = `${process.env.NEXT_PUBLIC_BACK_HOST}api/tamanioSabor`;

const TIPOS_DISPONIBLES = ['Pizza', 'Calzone', 'Pasta', 'Bebida', 'Agregado'];

export default function TamanioSaborModal({
  isOpen,
  onClose,
  tamanios,
  sabores,
  editingItem,
  onSubmitSuccess,
  onError,
  setLoading,
  loading = false,
}: TamanioSaborModalProps) {
  const [precio, setPrecio] = useState('');
  const [tipoSeleccionado, setTipoSeleccionado] = useState('');
  const [tamanioId, setTamanioId] = useState<number | null>(null);
  const [saborId, setSaborId] = useState<number | null>(null);
  const [saboresFiltrados, setSaboresFiltrados] = useState<Sabor[]>([]);
  const [tamaniosFiltrados, setTamaniosFiltrados] = useState<Tamanio[]>([]);
  const [tipos, setTipos] = useState<string[]>(TIPOS_DISPONIBLES);
  
  // Estado para rastrear si los campos han sido tocados
  const [touched, setTouched] = useState({
    tipo: false,
    tamanio: false,
    sabor: false,
    precio: false
  });

  // Filtrar tamaños según el tipo seleccionado
  useEffect(() => {
    if (tipoSeleccionado) {
      const tamaniosFiltradosPorTipo = tamanios.filter(t => t.tipo === tipoSeleccionado);
      setTamaniosFiltrados(tamaniosFiltradosPorTipo);
      
      // Resetear tamaño si el actual no está en los filtrados
      if (tamanioId && !tamaniosFiltradosPorTipo.some(t => t.id === tamanioId)) {
        setTamanioId(null);
      }
    } else {
      setTamaniosFiltrados([]);
      setTamanioId(null);
    }
  }, [tipoSeleccionado, tamanios]);

  // Filtrar sabores según el tipo de tamaño
  useEffect(() => {
    if (tipoSeleccionado) {
      const saboresFiltradosPorTipo = sabores.filter(s => s.tipo === tipoSeleccionado);
      setSaboresFiltrados(saboresFiltradosPorTipo);
      
      // Resetear sabor si el actual no está en los filtrados
      if (saborId && !saboresFiltradosPorTipo.some(s => s.id === saborId)) {
        setSaborId(null);
      }
    } else {
      setSaboresFiltrados([]);
      setSaborId(null);
    }
  }, [tipoSeleccionado, sabores]);

  // Restaurar estado de edición
  useEffect(() => {
    if (editingItem) {
      setPrecio(editingItem.precio.toString());
      
      // Encontrar el tamaño y su tipo
      const tamanioEditado = tamanios.find(t => t.id === editingItem.tamanio_id);
      if (tamanioEditado) {
        setTipoSeleccionado(tamanioEditado.tipo);
        setTamanioId(editingItem.tamanio_id);
        setSaborId(editingItem.sabor_id);
        
        // Establecer touched para todos los campos
        setTouched({
          tipo: true,
          tamanio: true,
          sabor: true,
          precio: true
        });
      }
    } else {
      resetForm();
    }
  }, [editingItem, tamanios, sabores]);

  // Filtrar tipos basados en los tamaños y sabores disponibles
  useEffect(() => {
    const tiposTamanios = new Set(tamanios.map(t => t.tipo));
    const tiposSabores = new Set(sabores.map(s => s.tipo));
    
    // Intersección de tipos de tamaños y sabores
    const tiposFiltrados = TIPOS_DISPONIBLES.filter(tipo => 
      tiposTamanios.has(tipo) && tiposSabores.has(tipo)
    );

    setTipos(tiposFiltrados);
  }, [tamanios, sabores]);

  const resetForm = () => {
    setPrecio('');
    setTipoSeleccionado('');
    setTamanioId(null);
    setSaborId(null);
    setSaboresFiltrados([]);
    setTamaniosFiltrados([]);
    // Restablecer estado de touched
    setTouched({
      tipo: false,
      tamanio: false,
      sabor: false,
      precio: false
    });
  };

  const handleGuardar = async () => {
    if (!precio || isNaN(Number(precio))) {
      onError('El precio debe ser un número válido');
      return;
    }

    if (!tipoSeleccionado || !tamanioId || !saborId) {
      onError('Debes seleccionar un tipo, tamaño y sabor');
      return;
    }

    const payload = {
      precio: parseFloat(precio),
      tamanio_id: tamanioId,
      sabor_id: saborId,
    };

    try {
      setLoading(true);
      const res = editingItem?.id
        ? await fetch(`${API_BASE_URL}/${editingItem.id}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload),
          })
        : await fetch(API_BASE_URL, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload),
          });

      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.error || 'Error al guardar combinación');
      }

      onSubmitSuccess(editingItem ? 'Combinación actualizada' : 'Combinación creada');
      resetForm();
      onClose();
    } catch (e: any) {
      onError(e.message);
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div
        className="absolute inset-0"
        style={{ backgroundColor: 'rgba(0, 0, 0, 0.6)' }}
        onClick={onClose}
      />

      <div className="relative z-50 bg-white rounded-lg shadow-lg p-6 w-full max-w-md mx-4 border-2">
        <h2 className="text-xl font-bold mb-4">
          {editingItem ? 'Editar Combinación' : 'Agregar Combinación'}
        </h2>

        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Tipo *</label>
            <select
              value={tipoSeleccionado}
              onChange={(e) => {
                setTipoSeleccionado(e.target.value);
                // Resetear tamaño y sabor al cambiar tipo
                setTamanioId(null);
                setSaborId(null);
              }}
              disabled={loading}
              className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-red-500"
            >
              <option value="">Seleccione un tipo</option>
              {tipos.map((tipo) => (
                <option key={tipo} value={tipo}>{tipo}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Tamaño *</label>
            <select
              value={tamanioId || ''}
              onChange={(e) => {
                setTamanioId(e.target.value ? Number(e.target.value) : null);
                setSaborId(null); // Resetear sabor al cambiar tamaño
              }}
              disabled={!tipoSeleccionado || loading}
              className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-red-500"
            >
              <option value="">{tipoSeleccionado ? 'Seleccione un tamaño' : 'Primero seleccione un tipo'}</option>
              {tamaniosFiltrados.map((t) => (
                <option key={t.id} value={t.id}>{t.nombre}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Sabor *</label>
            <select
              value={saborId || ''}
              onChange={(e) => setSaborId(e.target.value ? Number(e.target.value) : null)}
              disabled={!tipoSeleccionado || !tamanioId || loading}
              className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-red-500"
            >
              <option value="">{!tipoSeleccionado ? 'Primero seleccione un tipo' : !tamanioId ? 'Primero seleccione un tamaño' : 'Seleccione un sabor'}</option>
              {saboresFiltrados.map((s) => (
                <option key={s.id} value={s.id}>{s.nombre}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Precio *</label>
            <input
              type="number"
              placeholder="Ej: 10.99"
              value={precio}
              onChange={(e) => setPrecio(e.target.value)}
              disabled={loading}
              className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-red-500"
              step="0.01"
              min="0"
            />
          </div>
        </div>

        <div className="mt-6 flex justify-end gap-3">
          <button
            onClick={onClose}
            className="px-4 py-2 border border-gray-300 rounded hover:bg-gray-50 text-gray-700"
          >
            Cancelar
          </button>
          <button
            onClick={handleGuardar}
            className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 flex items-center justify-center min-w-[100px]"
            disabled={!touched.tipo || !touched.tamanio || !touched.sabor || !touched.precio}
          >
            {editingItem ? 'Actualizar' : 'Guardar'}
          </button>
        </div>
      </div>
    </div>
  );
}