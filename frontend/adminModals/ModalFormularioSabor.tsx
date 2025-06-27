//modalsabor
'use client';
import LoadingSpinner from '@/components/adminComponents/LoadingSpinner';
import { useEffect } from 'react';

type Props = {
  isOpen: boolean;
  onClose: () => void;
  onSave: () => void;
  onSuccess: (mensaje: string) => void;
  loading: boolean;
  modoEdicion: boolean;
  idEditando: number | null;
  nombre: string;
  setNombre: (value: string) => void;
  descripcion: string;
  setDescripcion: (value: string) => void;
  tipo: string;
  setTipo: (value: string) => void;
  especial: boolean;
  setEspecial: (value: boolean) => void;

};

const tiposDisponibles = ['Pizza', 'Calzone', 'Pasta', 'Agregado', 'Bebida'];

export default function ModalFormularioSabor({
  isOpen,
  onClose,
  onSave,
  onSuccess,
  loading,
  modoEdicion,
  idEditando,
  nombre,
  setNombre,
  descripcion,
  setDescripcion,
  tipo,
  setTipo,
  especial,
  setEspecial,
}: Props) {
  useEffect(() => {
    if (!isOpen) {
      setNombre('');
      setDescripcion('');
      setTipo('');
      setEspecial(false);
    }
  }, [isOpen]);

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

        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Nombre</label>
            <input
              value={nombre}
              onChange={(e) => setNombre(e.target.value)}
              disabled={loading}
              className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-red-500"
              placeholder="Nombre del sabor"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Tipo</label>
            <select
              value={tipo}
              onChange={(e) => setTipo(e.target.value)}
              disabled={loading}
              className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-red-500"
            >
              <option value="">Seleccionar un tipo</option>
              {tiposDisponibles.map((t) => (
                <option key={t} value={t}>
                  {t}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Descripción</label>
            <textarea
              value={descripcion}
              onChange={(e) => setDescripcion(e.target.value)}
              disabled={loading}
              className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-red-500 min-h-[100px] resize-y"
              placeholder="Descripción del sabor"
            />
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
            onClick={onSave}
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
