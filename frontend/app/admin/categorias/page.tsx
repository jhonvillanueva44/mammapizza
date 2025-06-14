'use client';

import { useState, useEffect } from 'react';
import HeaderAdmin from '@/components/adminComponents/HeaderAdmin';
import Topbar from '@/components/adminComponents/Topbar';
import Alert from '@/components/adminComponents/Alert';
import ConfirmationModal from '@/components/adminComponents/ConfirmationModal';
import LoadingSpinner from '@/components/adminComponents/LoadingSpinner';
import ModalFormularioCategoria from '@/adminModals/ModalFormularioCategoria';

type Categoria = {
  id: number;
  nombre: string;
  descripcion: string;
};

export default function CrudCategoriaPage() {
  const [categorias, setCategorias] = useState<Categoria[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [itemToDelete, setItemToDelete] = useState<number | null>(null);
  const [showFormModal, setShowFormModal] = useState(false);
  const [modoEdicion, setModoEdicion] = useState(false);
  const [idEditando, setIdEditando] = useState<number | null>(null);

  const API_BASE_URL = 'http://localhost:4000/api/categorias';

  const fetchCategorias = async () => {
    try {
      setLoading(true);
      const res = await fetch(API_BASE_URL);
      if (!res.ok) throw new Error('Error al cargar categorías');
      const data = await res.json();
      setCategorias(data);
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

  const handleEditarClick = (categoria: Categoria) => {
    setModoEdicion(true);
    setIdEditando(categoria.id);
    setShowFormModal(true);
  };

  const handleSuccess = (message: string) => {
    setSuccess(message);
    fetchCategorias();
    setShowFormModal(false);
  };

  return (
    <div className="min-h-screen bg-gray-50 flex">
      <HeaderAdmin />
      <div className="flex-1 overflow-auto">
        <Topbar title="Gestión de Categorías" />

        <main className="p-6 space-y-6">
          {error && (
            <Alert type="error" message={error} onClose={() => setError(null)} />
          )}
          
          {success && (
            <Alert type="success" message={success} onClose={() => setSuccess(null)} />
          )}

          <ConfirmationModal
            isOpen={showDeleteModal}
            onClose={() => setShowDeleteModal(false)}
            onConfirm={handleConfirmDelete}
            title="Confirmar eliminación"
            message="¿Estás seguro de que deseas eliminar esta categoría? Esta acción no se puede deshacer."
            confirmText="Eliminar"
          />

          <div className="flex justify-end mb-4">
            <button
              onClick={() => {
                setShowFormModal(true);
                setModoEdicion(false);
                setIdEditando(null);
              }}
              className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700"
            >
              Agregar Categoría
            </button>
          </div>

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
                    {categorias.map((categoria) => (
                      <tr key={categoria.id} className="hover:bg-gray-50">
                        <td className="px-4 py-3">{categoria.nombre}</td>
                        <td className="px-4 py-3 text-gray-600">{categoria.descripcion || '-'}</td>
                        <td className="px-4 py-3">
                          <div className="flex space-x-3">
                            <button
                              onClick={() => handleEditarClick(categoria)}
                              className="text-blue-600 hover:text-blue-800 transition-colors font-medium"
                              disabled={loading}
                            >
                              Editar
                            </button>
                            <button
                              onClick={() => handleEliminarClick(categoria.id)}
                              className="text-red-600 hover:text-red-800 transition-colors font-medium"
                              disabled={loading}
                            >
                              Eliminar
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                    {categorias.length === 0 && (
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

      <ModalFormularioCategoria
        isOpen={showFormModal}
        onClose={() => {
          setShowFormModal(false);
          setModoEdicion(false);
          setIdEditando(null);
        }}
        onSuccess={handleSuccess}
        modoEdicion={modoEdicion}
        idEditando={idEditando}
      />
    </div>
  );
}