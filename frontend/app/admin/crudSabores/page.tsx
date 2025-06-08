'use client';

import { useEffect, useState } from 'react';
import HeaderAdmin from '@/components/adminComponents/HeaderAdmin';
import Topbar from '@/components/adminComponents/Topbar';
import Alert from '@/components/adminComponents/Alert';
import ConfirmationModal from '@/components/adminComponents/ConfirmationModal';
import LoadingSpinner from '@/components/adminComponents/LoadingSpinner';

type Sabor = {
  id: number;
  nombre: string;
  descripcion: string;
  tipo: 'Pizza' | 'Calzone' | 'Pasta';
  especial: boolean;
};

export default function CrudSaborPage() {
  const [sabores, setSabores] = useState<Sabor[]>([]);
  const [nombre, setNombre] = useState('');
  const [descripcion, setDescripcion] = useState('');
  const [tipo, setTipo] = useState<'Pizza' | 'Calzone' | 'Pasta'>('Pizza');
  const [especial, setEspecial] = useState(false);
  const [modoEdicion, setModoEdicion] = useState(false);
  const [idEditando, setIdEditando] = useState<number | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [itemToDelete, setItemToDelete] = useState<number | null>(null);

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

  const handleGuardar = async () => {
    if (!nombre.trim() || !descripcion.trim()) {
      setError('Nombre y descripción son obligatorios.');
      return;
    }

    const saborData = {
      nombre: nombre.trim(),
      descripcion: descripcion.trim(),
      tipo,
      especial,
    };

    try {
      setLoading(true);
      setError(null);
      setSuccess(null);
      let res: Response;

      if (modoEdicion && idEditando !== null) {
        res = await fetch(`${API_URL}/${idEditando}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(saborData),
        });
        if (!res.ok) throw new Error('Error al actualizar el sabor');
        setSuccess('Sabor actualizado con éxito.');
      } else {
        res = await fetch(API_URL, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(saborData),
        });
        if (!res.ok) throw new Error('Error al crear el sabor');
        setSuccess('Sabor guardado con éxito.');
      }

      await fetchSabores();
      setNombre('');
      setDescripcion('');
      setTipo('Pizza');
      setEspecial(false);
      setModoEdicion(false);
      setIdEditando(null);
    } catch (err: any) {
      setError(err.message || 'Error al guardar el sabor.');
    } finally {
      setLoading(false);
    }
  };

  const handleEditar = (sabor: Sabor) => {
    setModoEdicion(true);
    setIdEditando(sabor.id);
    setNombre(sabor.nombre);
    setDescripcion(sabor.descripcion);
    setTipo(sabor.tipo);
    setEspecial(sabor.especial);
    setError(null);
    setSuccess(null);
  };

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

          {/* Formulario */}
          <div className="bg-white p-6 rounded-lg shadow">
            <h2 className="text-xl font-bold mb-4">
              {modoEdicion ? 'Editar Sabor' : 'Agregar Sabor'}
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <input
                type="text"
                placeholder="Nombre del sabor"
                value={nombre}
                onChange={(e) => setNombre(e.target.value)}
                className="border border-gray-300 rounded px-4 py-2"
              />
              <input
                type="text"
                placeholder="Descripción"
                value={descripcion}
                onChange={(e) => setDescripcion(e.target.value)}
                className="border border-gray-300 rounded px-4 py-2"
              />
              <select
                value={tipo}
                onChange={(e) => setTipo(e.target.value as 'Pizza' | 'Calzone' | 'Pasta')}
                className="border border-gray-300 rounded px-4 py-2"
              >
                <option value="Pizza">Pizza</option>
                <option value="Calzone">Calzone</option>
                <option value="Pasta">Pasta</option>
              </select>
            </div>

            <div className="mt-4 flex items-center space-x-2">
              <input
                type="checkbox"
                id="especial"
                checked={especial}
                onChange={(e) => setEspecial(e.target.checked)}
                className="w-5 h-5 text-red-600"
              />
              <label htmlFor="especial" className="text-gray-700 select-none">
                ¿Es especial?
              </label>
            </div>

            <div className="mt-4 flex justify-end space-x-3">
              {modoEdicion && (
                <button
                  onClick={() => {
                    setModoEdicion(false);
                    setIdEditando(null);
                    setNombre('');
                    setDescripcion('');
                    setTipo('Pizza');
                    setEspecial(false);
                    setError(null);
                    setSuccess(null);
                  }}
                  className="text-gray-600 hover:text-gray-900"
                >
                  Cancelar
                </button>
              )}
              <button
                onClick={handleGuardar}
                disabled={loading}
                className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded"
              >
                {modoEdicion ? 'Actualizar' : 'Guardar'}
              </button>
            </div>
          </div>

          {/* Tabla */}
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
                {sabores.map((sabor) => (
                  <tr key={sabor.id} className="border-t">
                    <td className="px-4 py-2">{sabor.nombre}</td>
                    <td className="px-4 py-2">{sabor.descripcion}</td>
                    <td className="px-4 py-2">{sabor.tipo}</td>
                    <td className="px-4 py-2">{sabor.especial ? '✅' : '❌'}</td>
                    <td className="px-4 py-2 space-x-3">
                      <button
                        onClick={() => handleEditar(sabor)}
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
                {sabores.length === 0 && (
                  <tr>
                    <td colSpan={5} className="px-4 py-4 text-center text-gray-500">
                      No hay sabores registrados.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </main>
      </div>
    </div>
  );
}
