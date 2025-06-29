'use client';
// hola
import { useEffect } from 'react';
import LoadingSpinner from '@/components/adminComponents/LoadingSpinner';

type Props = {
  isOpen: boolean;
  onClose: () => void;
  onSave: () => void;
  loading: boolean;
  modoEdicion: boolean;
  nombre: string;
  setNombre: (value: string) => void;
  descripcion: string;
  setDescripcion: (value: string) => void;
};

export default function ModalFormularioCategoria({
  isOpen,
  onClose,
  onSave,
  loading,
  modoEdicion,
  nombre,
  setNombre,
  descripcion,
  setDescripcion,
}: Props) {
  useEffect(() => {
    if (!isOpen) {
      setNombre('');
      setDescripcion('');
    }
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div
        className="absolute inset-0 bg-black opacity-60"
        onClick={onClose}
      />

      <div className="relative z-50 bg-white rounded-lg shadow-lg p-6 w-full max-w-md border-2">
        <h2 className="text-xl font-bold mb-4">
          {modoEdicion ? 'Editar Categoría' : 'Agregar Categoría'}
        </h2>

        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Nombre
            </label>
            <input
              value={nombre}
              onChange={(e) => setNombre(e.target.value)}
              disabled={loading}
              className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-red-500"
              placeholder="Ej: Bebidas"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Descripción
            </label>
            <textarea
              value={descripcion}
              onChange={(e) => setDescripcion(e.target.value)}
              disabled={loading}
              className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-red-500 min-h-[100px] resize-y"
              placeholder="Opcional"
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
            onClick={onSave}
            className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 min-w-[100px] flex justify-center"
            disabled={loading}
          >
            {loading ? <LoadingSpinner size={5} /> : modoEdicion ? 'Actualizar' : 'Guardar'}
          </button>
        </div>
      </div>
    </div>
  );
}
