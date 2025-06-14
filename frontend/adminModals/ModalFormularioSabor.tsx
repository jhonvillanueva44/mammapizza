'use client';

import { useEffect, useState } from 'react';
import LoadingSpinner from '@/components/adminComponents/LoadingSpinner';

type Sabor = {
  id: number;
  nombre: string;
  descripcion: string;
  tipo: 'Pizza' | 'Calzone' | 'Pasta';
  especial: boolean;
};

type Props = {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: (message: string) => void;
  modoEdicion: boolean;
  idEditando: number | null;
};

const API_URL = 'http://localhost:4000/api/sabores';

export default function ModalFormularioSabor({
  isOpen,
  onClose,
  onSuccess,
  modoEdicion,
  idEditando,
}: Props) {
  const [nombre, setNombre] = useState('');
  const [descripcion, setDescripcion] = useState('');
  const [tipo, setTipo] = useState<'Pizza' | 'Calzone' | 'Pasta' | ''>('');
  const [especial, setEspecial] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (isOpen && modoEdicion && idEditando) {
      fetchSabor(idEditando);
    } else {
      resetForm();
    }
  }, [isOpen, modoEdicion, idEditando]);

  const fetchSabor = async (id: number) => {
    try {
      setLoading(true);
      const res = await fetch(`${API_URL}/${id}`);
      if (!res.ok) throw new Error('Error al cargar el sabor');
      const data: Sabor = await res.json();
      setNombre(data.nombre);
      setDescripcion(data.descripcion);
      setTipo(data.tipo);
      setEspecial(data.especial);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setNombre('');
    setDescripcion('');
    setTipo('');
    setEspecial(false);
    setError(null);
  };

  const handleSubmit = async () => {
    if (!nombre.trim() || !descripcion.trim() || !tipo) {
      setError('Nombre, descripción y tipo son obligatorios.');
      return;
    }

    const saborData = {
      nombre: nombre.trim(),
      descripcion: descripcion.trim(),
      tipo: tipo as 'Pizza' | 'Calzone' | 'Pasta',
      especial: tipo === 'Pizza' ? especial : null,
    };

    try {
      setLoading(true);
      setError(null);
      let res: Response;

      if (modoEdicion && idEditando) {
        res = await fetch(`${API_URL}/${idEditando}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(saborData),
        });
        if (!res.ok) throw new Error('Error al actualizar el sabor');
        onSuccess('Sabor actualizado con éxito.');
      } else {
        res = await fetch(API_URL, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(saborData),
        });
        if (!res.ok) throw new Error('Error al crear el sabor');
        onSuccess('Sabor guardado con éxito.');
      }
    } catch (err: any) {
      setError(err.message || 'Error al guardar el sabor.');
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
          {modoEdicion ? 'Editar Sabor' : 'Agregar Sabor'}
        </h2>
        
        {error && (
          <div className="mb-4 p-3 bg-red-100 text-red-700 rounded">
            {error}
          </div>
        )}

        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Nombre 
            </label>
            <input
              value={nombre}
              onChange={(e) => setNombre(e.target.value)}
              disabled={loading}
              className={`w-full border ${nombre ? 'border-red-500' : 'border-gray-300'} rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-red-500`}
              placeholder="Nombre del sabor"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Descripción 
            </label>
            <input
              value={descripcion}
              onChange={(e) => setDescripcion(e.target.value)}
              disabled={loading}
              className={`w-full border ${descripcion ? 'border-red-500' : 'border-gray-300'} rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-red-500`}
              placeholder="Descripción del sabor"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Tipo 
            </label>
            <select
              value={tipo}
              onChange={(e) => setTipo(e.target.value as 'Pizza' | 'Calzone' | 'Pasta')}
              disabled={loading}
              className={`w-full border ${tipo ? 'border-red-500' : 'border-gray-300'} rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-red-500`}
            >
              <option value="">Seleccionar un tipo</option>
              <option value="Pizza">Pizza</option>
              <option value="Calzone">Calzone</option>
              <option value="Pasta">Pasta</option>
            </select>
          </div>

          {tipo === 'Pizza' && (
            <div className="flex items-center space-x-2">
              <input
                type="checkbox"
                id="especial"
                checked={especial}
                onChange={(e) => setEspecial(e.target.checked)}
                disabled={loading}
                className="w-5 h-5 text-red-600 rounded focus:ring-red-500"
              />
              <label htmlFor="especial" className="text-gray-700">
                ¿Es especial?
              </label>
            </div>
          )}
        </div>

        <div className="mt-6 flex justify-end gap-3">
          <button
            onClick={onClose}
            className="px-4 py-2 border border-gray-300 rounded hover:bg-gray-50 text-gray-700"
            disabled={loading}
          >
            Cancelar
          </button>
          <button
            onClick={handleSubmit}
            className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 flex items-center justify-center min-w-[100px]"
            disabled={loading}
          >
            {loading ? <LoadingSpinner size={5} /> : modoEdicion ? 'Actualizar' : 'Guardar'}
          </button>
        </div>
      </div>
    </div>
  );
}