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
};

const API_BASE_URL = 'http://localhost:4000/api/tamanioSabor';

export default function TamanioSaborModal({
  isOpen,
  onClose,
  tamanios,
  sabores,
  editingItem,
  onSubmitSuccess,
  onError,
  setLoading,
}: TamanioSaborModalProps) {
  const [precio, setPrecio] = useState('');
  const [tamanioId, setTamanioId] = useState<number | null>(null);
  const [saborId, setSaborId] = useState<number | null>(null);
  const [saboresFiltrados, setSaboresFiltrados] = useState<Sabor[]>([]);


const tipoTamanioSeleccionado = tamanios.find(t => t.id === tamanioId)?.tipo || '';
  useEffect(() => {
    if (tipoTamanioSeleccionado) {
      const saboresFiltrados = sabores.filter(s => s.tipo === tipoTamanioSeleccionado);
      setSaboresFiltrados(saboresFiltrados);
      
      if (saborId && !saboresFiltrados.some(s => s.id === saborId)) {
        setSaborId(null);
      }
    } else {
      setSaboresFiltrados([]);
      setSaborId(null);
    }
  }, [tipoTamanioSeleccionado, sabores, saborId]);

  useEffect(() => {
    if (editingItem) {
      setPrecio(editingItem.precio.toString());
      setTamanioId(editingItem.tamanio_id);
      setSaborId(editingItem.sabor_id);
      
      const tamanioEditado = tamanios.find(t => t.id === editingItem.tamanio_id);
      if (tamanioEditado) {
        setSaboresFiltrados(sabores.filter(s => s.tipo === tamanioEditado.tipo));
      }
    } else {
      resetForm();
    }
  }, [editingItem, tamanios, sabores]);

  const resetForm = () => {
    setPrecio('');
    setTamanioId(null);
    setSaborId(null);
    setSaboresFiltrados([]);
  };

  const handleGuardar = async () => {
    if (!precio || isNaN(Number(precio))) {
      onError('El precio debe ser un número válido');
      return;
    }

    if (!tamanioId || !saborId) {
      onError('Debes seleccionar un tamaño y un sabor');
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

      <div className="relative z-50 bg-white rounded-lg shadow-lg p-6 w-full max-w-2xl mx-4 border-2">
        <h2 className="text-xl font-bold mb-4">
          {editingItem ? 'Editar Combinación' : 'Agregar Combinación'}
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Tamaño *</label>
            <select
              value={tamanioId || ''}
              onChange={(e) => {
                setTamanioId(e.target.value ? Number(e.target.value) : null);
                setSaborId(null); // Resetear sabor al cambiar tamaño
              }}
              className={`w-full border ${!tamanioId ? 'border-red-500' : 'border-gray-300'} rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-red-500`}
            >
              <option value="">Seleccione un tamaño</option>
              {tamanios.map((t) => (
                <option key={t.id} value={t.id}>{t.nombre}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Sabor *</label>
            <select
              value={saborId || ''}
              onChange={(e) => setSaborId(e.target.value ? Number(e.target.value) : null)}
              className={`w-full border ${!saborId ? 'border-red-500' : 'border-gray-300'} rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-red-500`}
              disabled={!tamanioId}
            >
              <option value="">{tamanioId ? 'Seleccione un sabor' : 'Primero seleccione un tamaño'}</option>
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
              className={`w-full border ${!precio ? 'border-red-500' : 'border-gray-300'} rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-red-500`}
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
            disabled={!precio || !tamanioId || !saborId}
          >
            {editingItem ? 'Actualizar' : 'Guardar'}
          </button>
        </div>
      </div>
    </div>
  );
}