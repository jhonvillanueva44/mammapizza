//ModalTamanio.tsx
'use client';
import { useEffect } from 'react';
import LoadingSpinner from '@/components/adminComponents/LoadingSpinner';
// hola
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
  tipo: string;
  setTipo: (value: string) => void;
};

const tiposDisponibles = ['Pizza', 'Calzone', 'Pasta', 'Agregado', 'Bebida'];

export default function ModalFormularioTamano({
  isOpen,
  onClose,
  onSave,
  loading,
  modoEdicion,
  nombre,
  setNombre,
  descripcion,
  setDescripcion,
  tipo,
  setTipo,
}: Props) {
  useEffect(() => {
    if (!isOpen) {
      setNombre('');
      setDescripcion('');
      setTipo('');
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

      {/* Contenedor del modal con borde rojo */}
      <div className="relative z-50 bg-white rounded-lg shadow-lg p-6 w-full max-w-2xl mx-4 border-2">
        <h2 className="text-xl font-bold mb-4">
          {modoEdicion ? 'Editar Tamaño' : 'Agregar Tamaño'}
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
              className={`w-full border ${nombre ? 'border-red-500' : 'border-gray-300'} rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-red-500`}
              placeholder="Ej: Familiar"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Tipo 
            </label>
            <select
              value={tipo}
              onChange={(e) => setTipo(e.target.value)}
              disabled={loading}
  className={`w-full border ${tipo ? 'border-red-500' : 'border-gray-300'} rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-red-500`}
            >
              <option value="">Seleccione un tipo</option>
              {tiposDisponibles.map((t) => (
                <option key={t} value={t}>{t}</option>
              ))}
            </select>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Descripción
            </label>
            <textarea
              value={descripcion}
              onChange={(e) => setDescripcion(e.target.value)}
              disabled={loading}
  className={`w-full border ${descripcion ? 'border-red-500' : 'border-gray-300'} rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-red-500 min-h-[100px] resize-y`}
              placeholder="Descripción opcional"
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