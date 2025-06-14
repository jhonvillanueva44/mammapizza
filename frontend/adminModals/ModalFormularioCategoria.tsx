'use client';

import { useState, useEffect } from 'react';
import LoadingSpinner from '@/components/adminComponents/LoadingSpinner';

type Categoria = {
  id: number;
  nombre: string;
  descripcion: string;
};

type Props = {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: (message: string) => void;
  modoEdicion: boolean;
  idEditando: number | null;
};

const API_BASE_URL = 'http://localhost:4000/api/categorias';

export default function ModalFormularioCategoria({
  isOpen,
  onClose,
  onSuccess,
  modoEdicion,
  idEditando,
}: Props) {
  const [nombre, setNombre] = useState('');
  const [descripcion, setDescripcion] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (isOpen && modoEdicion && idEditando) {
      fetchCategoria(idEditando);
    } else {
      resetForm();
    }
  }, [isOpen, modoEdicion, idEditando]);

  const fetchCategoria = async (id: number) => {
    try {
      setLoading(true);
      const res = await fetch(`${API_BASE_URL}/${id}`);
      if (!res.ok) throw new Error('Error al cargar la categoría');
      const data: Categoria = await res.json();
      setNombre(data.nombre);
      setDescripcion(data.descripcion);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setNombre('');
    setDescripcion('');
    setError(null);
  };

  const handleSubmit = async () => {
    if (!nombre.trim()) {
      setError('El nombre es obligatorio');
      return;
    }

    const categoriaPayload = {
      nombre: nombre.trim(),
      descripcion: descripcion.trim(),
    };

    try {
      setLoading(true);
      setError(null);

      if (modoEdicion && idEditando) {
        const res = await fetch(`${API_BASE_URL}/${idEditando}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(categoriaPayload),
        });
        if (!res.ok) {
          const err = await res.json();
          throw new Error(err.error || 'Error al actualizar categoría');
        }
        onSuccess('Categoría actualizada correctamente');
      } else {
        const res = await fetch(API_BASE_URL, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(categoriaPayload),
        });
        if (!res.ok) {
          const err = await res.json();
          throw new Error(err.error || 'Error al crear categoría');
        }
        onSuccess('Categoría creada correctamente');
      }
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div 
        className="absolute inset-0 bg-black bg-opacity-40"
        onClick={onClose}
      />
      
      <div className="relative z-50 bg-white rounded-lg shadow-lg p-6 w-full max-w-2xl mx-4 border-2 border-red-600">
        <h2 className="text-xl font-bold mb-4">
          {modoEdicion ? 'Editar Categoría' : 'Agregar Categoría'}
        </h2>
        
        {error && (
          <div className="mb-4 p-3 bg-red-100 text-red-700 rounded">
            {error}
          </div>
        )}

        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Nombre *
            </label>
            <input
              type="text"
              placeholder="Ej: Bebidas, Postres, etc."
              value={nombre}
              onChange={(e) => setNombre(e.target.value)}
              disabled={loading}
              className="w-full border border-gray-300 rounded px-4 py-2 focus:ring-2 focus:ring-red-500 focus:border-red-500 outline-none transition"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Descripción
            </label>
            <input
              type="text"
              placeholder="Descripción opcional"
              value={descripcion}
              onChange={(e) => setDescripcion(e.target.value)}
              disabled={loading}
              className="w-full border border-gray-300 rounded px-4 py-2 focus:ring-2 focus:ring-red-500 focus:border-red-500 outline-none transition"
            />
          </div>
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