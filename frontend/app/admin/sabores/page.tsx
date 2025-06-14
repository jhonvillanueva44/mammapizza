'use client';

import { useEffect, useState } from 'react';
import HeaderAdmin from '@/components/adminComponents/HeaderAdmin';
import Topbar from '@/components/adminComponents/Topbar';
import Alert from '@/components/adminComponents/Alert';
import ConfirmationModal from '@/components/adminComponents/ConfirmationModal';
import LoadingSpinner from '@/components/adminComponents/LoadingSpinner';
import ModalFormularioSabor from '@/adminModals/ModalFormularioSabor';

type Sabor = {
  id: number;
  nombre: string;
  descripcion: string;
  tipo: 'Pizza' | 'Calzone' | 'Pasta';
  especial: boolean;
};

export default function CrudSaborPage() {
  const [sabores, setSabores] = useState<Sabor[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [itemToDelete, setItemToDelete] = useState<number | null>(null);
  const [showFormModal, setShowFormModal] = useState(false);
  const [modoEdicion, setModoEdicion] = useState(false);
  const [idEditando, setIdEditando] = useState<number | null>(null);

  const [search, setSearch] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 15;

  const API_URL = 'http://localhost:4000/api/sabores';

  const fetchSabores = async () => {
    try {
      setLoading(true);
      const res = await fetch(API_URL);
      if (!res.ok) throw new Error('Error al obtener los sabores');
      const data = await res.json();
      setSabores(data);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSabores();
  }, []);

  const handleEliminarClick = (id: number) => {
    setItemToDelete(id);
    setShowDeleteModal(true);
  };

  const handleConfirmDelete = async () => {
    if (!itemToDelete) return;
    try {
      setLoading(true);
      const res = await fetch(`${API_URL}/${itemToDelete}`, {
        method: 'DELETE',
      });
      if (!res.ok) throw new Error('Error al eliminar el sabor');
      await fetchSabores();
      setSuccess('Sabor eliminado con éxito.');
    } catch (err: any) {
      setError(err.message || 'Error al eliminar el sabor.');
    } finally {
      setLoading(false);
      setShowDeleteModal(false);
      setItemToDelete(null);
    }
  };

  const handleEditarClick = (sabor: Sabor) => {
    setModoEdicion(true);
    setIdEditando(sabor.id);
    setShowFormModal(true);
  };

  const handleSuccess = (message: string) => {
    setSuccess(message);
    fetchSabores();
    setShowFormModal(false);
  };

  const filteredSabores = sabores.filter((sabor) =>
    sabor.nombre.toLowerCase().includes(search.toLowerCase())
  );

  const totalPages = Math.ceil(filteredSabores.length / itemsPerPage);
  const currentSabores = filteredSabores.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const handlePageChange = (page: number) => {
    if (page >= 1 && page <= totalPages) setCurrentPage(page);
  };

  return (
    <div className="min-h-screen bg-gray-50 flex">
      <HeaderAdmin />
      <div className="flex-1 overflow-auto">
        <Topbar title="Gestión de Sabores" />

        <main className="p-6 space-y-6">
          {loading && <LoadingSpinner />}

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
            message="¿Estás seguro de que deseas eliminar este sabor? Esta acción no se puede deshacer."
            confirmText="Eliminar"
          />

          <div className="flex justify-between mb-4">
            <input
              type="text"
              placeholder="Buscar sabor por nombre..."
              value={search}
              onChange={(e) => {
                setSearch(e.target.value);
                setCurrentPage(1);
              }}
              className="border border-gray-300 rounded px-3 py-2 w-64 focus:ring-2 focus:ring-red-500 focus:outline-none"
            />

            <button
              onClick={() => {
                setShowFormModal(true);
                setModoEdicion(false);
                setIdEditando(null);
              }}
              className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700"
            >
              Agregar Sabor
            </button>
          </div>

          <div className="bg-white p-6 rounded-lg shadow">
            <h2 className="text-xl font-bold mb-4">Lista de Sabores</h2>

            <table className="w-full table-auto">
              <thead>
                <tr className="bg-gray-100">
                  <th className="text-left px-4 py-2">Nombre</th>
                  <th className="text-left px-4 py-2">Descripción</th>
                  <th className="text-left px-4 py-2">Tipo</th>
                  <th className="text-left px-4 py-2">Especial</th>
                  <th className="text-left px-4 py-2">Acciones</th>
                </tr>
              </thead>
              <tbody>
                {currentSabores.map((sabor) => (
                  <tr key={sabor.id} className="border-t">
                    <td className="px-4 py-2">{sabor.nombre}</td>
                    <td className="px-4 py-2">{sabor.descripcion}</td>
                    <td className="px-4 py-2">{sabor.tipo}</td>
                    <td className="px-4 py-2">
                      {sabor.tipo === 'Pizza' ? (sabor.especial ? '✅' : '❌') : '➖'}
                    </td>
                    <td className="px-4 py-2 space-x-3">
                      <button
                        onClick={() => handleEditarClick(sabor)}
                        className="text-blue-600 hover:underline"
                      >
                        Editar
                      </button>
                      <button
                        onClick={() => handleEliminarClick(sabor.id)}
                        className="text-red-600 hover:underline"
                      >
                        Eliminar
                      </button>
                    </td>
                  </tr>
                ))}
                {currentSabores.length === 0 && (
                  <tr>
                    <td colSpan={5} className="px-4 py-4 text-center text-gray-500">
                      No hay sabores registrados.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>

            {totalPages > 1 && (
              <div className="flex justify-center items-center mt-4 space-x-2">
                <button
                  onClick={() => handlePageChange(currentPage - 1)}
                  className="px-3 py-1 border rounded disabled:opacity-50"
                  disabled={currentPage === 1}
                >
                  Anterior
                </button>
                {Array.from({ length: totalPages }, (_, i) => (
                  <button
                    key={i + 1}
                    onClick={() => handlePageChange(i + 1)}
                    className={`px-3 py-1 border rounded ${
                      currentPage === i + 1
                        ? 'bg-red-600 text-white'
                        : 'bg-white text-gray-700'
                    }`}
                  >
                    {i + 1}
                  </button>
                ))}
                <button
                  onClick={() => handlePageChange(currentPage + 1)}
                  className="px-3 py-1 border rounded disabled:opacity-50"
                  disabled={currentPage === totalPages}
                >
                  Siguiente
                </button>
              </div>
            )}
          </div>
        </main>
      </div>

      <ModalFormularioSabor
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