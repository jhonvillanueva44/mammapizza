// app/admin/crud-tamano/page.tsx
'use client';

import { useState, useEffect } from 'react';
import HeaderAdmin from '@/components/adminComponents/HeaderAdmin';
import Topbar from '@/components/adminComponents/Topbar';
import Alert from '@/components/adminComponents/Alert';
import ConfirmationModal from '@/components/adminComponents/ConfirmationModal';
import LoadingSpinner from '@/components/adminComponents/LoadingSpinner';

type Tamano = {
  id: number;
  nombre: string;
  descripcion: string;
};

export default function CrudTamanoPage() {
  const [tamanos, setTamanos] = useState<Tamano[]>([]);
  const [nombre, setNombre] = useState('');
  const [descripcion, setDescripcion] = useState('');
  const [modoEdicion, setModoEdicion] = useState(false);
  const [idEditando, setIdEditando] = useState<number | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [itemToDelete, setItemToDelete] = useState<number | null>(null);

  const API_BASE_URL = 'http://localhost:4000/api/categorias';

  const fetchCategorias = async () => {
    try {
      setLoading(true);
      const res = await fetch(API_BASE_URL);
      if (!res.ok) throw new Error('Error al cargar categorías');
      const data = await res.json();
      setTamanos(data);
      setError(null);
    } catch (e: any) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCategorias();
  }, []);

  const handleGuardar = async () => {
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
      if (modoEdicion && idEditando !== null) {
        const res = await fetch(`${API_BASE_URL}/${idEditando}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(categoriaPayload),
        });
        if (!res.ok) {
          const err = await res.json();
          throw new Error(err.error || 'Error al actualizar categoría');
        }
        setSuccess('Categoría actualizada correctamente');
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
        setSuccess('Categoría creada correctamente');
      }

      await fetchCategorias();
      setModoEdicion(false);
      setIdEditando(null);
      setNombre('');
      setDescripcion('');
      setError(null);
    } catch (e: any) {
      setError(e.message);
      setSuccess(null);
    } finally {
      setLoading(false);
    }
  };

  const handleEditar = (tamano: Tamano) => {
    setModoEdicion(true);
    setIdEditando(tamano.id);
    setNombre(tamano.nombre);
    setDescripcion(tamano.descripcion);
  };

  const handleEliminarClick = (id: number) => {
    setItemToDelete(id);
    setShowDeleteModal(true);
  };

  const handleConfirmDelete = async () => {
    if (!itemToDelete) return;

    try {
      setLoading(true);
      const res = await fetch(`${API_BASE_URL}/${itemToDelete}`, { 
        method: 'DELETE' 
      });
      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.error || 'Error al eliminar categoría');
      }
      setSuccess('Categoría eliminada correctamente');
      await fetchCategorias();
      setError(null);
    } catch (e: any) {
      setError(e.message);
      setSuccess(null);
    } finally {
      setLoading(false);
      setShowDeleteModal(false);
      setItemToDelete(null);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex">
      <HeaderAdmin />
      <div className="flex-1 overflow-auto">
        <Topbar title="Gestión de Categorías" />

        <main className="p-6 space-y-6">
          {/* Alertas */}
          {error && (
            <Alert
              type="error"
              message={error}
              onClose={() => setError(null)}
            />
          )}
          
          {success && (
            <Alert
              type="success"
              message={success}
              onClose={() => setSuccess(null)}
            />
          )}

          {/* Modal de confirmación para eliminar */}
          <ConfirmationModal
            isOpen={showDeleteModal}
            onClose={() => setShowDeleteModal(false)}
            onConfirm={handleConfirmDelete}
            title="Confirmar eliminación"
            message="¿Estás seguro de que deseas eliminar esta categoría? Esta acción no se puede deshacer."
            confirmText="Eliminar"
          />

          {/* Formulario */}
          <div className="bg-white p-6 rounded-lg shadow">
            <h2 className="text-xl font-bold mb-4">
              {modoEdicion ? 'Editar Categoría' : 'Agregar Categoría'}
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Nombre de la Categoría *
                </label>
                <input
                  type="text"
                  placeholder="Ej: Bebidas, Postres, etc."
                  value={nombre}
                  onChange={(e) => setNombre(e.target.value)}
                  className="w-full border border-gray-300 rounded px-4 py-2 focus:ring-2 focus:ring-red-500 focus:border-red-500 outline-none transition"
                  disabled={loading}
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
                  className="w-full border border-gray-300 rounded px-4 py-2 focus:ring-2 focus:ring-red-500 focus:border-red-500 outline-none transition"
                  disabled={loading}
                />
              </div>
            </div>

            <div className="mt-6 flex justify-end space-x-3">
              {modoEdicion && (
                <button
                  onClick={() => {
                    setModoEdicion(false);
                    setIdEditando(null);
                    setNombre('');
                    setDescripcion('');
                    setError(null);
                  }}
                  className="px-4 py-2 text-gray-600 hover:text-gray-800 font-medium rounded-md border border-gray-300 hover:bg-gray-50 transition-colors"
                  disabled={loading}
                >
                  Cancelar
                </button>
              )}
              <button
                onClick={handleGuardar}
                className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white font-medium rounded-md transition-colors flex items-center justify-center min-w-[100px]"
                disabled={loading}
              >
                {loading ? (
                  <LoadingSpinner size={6} />
                ) : modoEdicion ? (
                  'Actualizar'
                ) : (
                  'Guardar'
                )}
              </button>
            </div>
          </div>

          {/* Tabla */}
          <div className="bg-white p-6 rounded-lg shadow">
            <h2 className="text-xl font-bold mb-4">Lista de Categorías</h2>

            {loading ? (
              <div className="flex justify-center py-8">
                <LoadingSpinner size={8} />
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full table-auto">
                  <thead>
                    <tr className="bg-gray-100 text-left">
                      <th className="px-4 py-3 font-semibold text-gray-700">Nombre</th>
                      <th className="px-4 py-3 font-semibold text-gray-700">Descripción</th>
                      <th className="px-4 py-3 font-semibold text-gray-700">Acciones</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    {tamanos.map((tamano) => (
                      <tr key={tamano.id} className="hover:bg-gray-50">
                        <td className="px-4 py-3">{tamano.nombre}</td>
                        <td className="px-4 py-3 text-gray-600">{tamano.descripcion || '-'}</td>
                        <td className="px-4 py-3">
                          <div className="flex space-x-3">
                            <button
                              onClick={() => handleEditar(tamano)}
                              className="text-blue-600 hover:text-blue-800 transition-colors font-medium"
                              disabled={loading}
                            >
                              Editar
                            </button>
                            <button
                              onClick={() => handleEliminarClick(tamano.id)}
                              className="text-red-600 hover:text-red-800 transition-colors font-medium"
                              disabled={loading}
                            >
                              Eliminar
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                    {tamanos.length === 0 && (
                      <tr>
                        <td colSpan={3} className="px-4 py-6 text-center text-gray-500">
                          No hay categorías registradas.
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </main>
      </div>
    </div>
  );
}