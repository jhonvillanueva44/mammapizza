'use client';

import { useState, useEffect } from 'react';
import HeaderAdmin from '@/components/adminComponents/HeaderAdmin';
import Topbar from '@/components/adminComponents/Topbar';
import Alert from '@/components/adminComponents/Alert';
import ConfirmationModal from '@/components/adminComponents/ConfirmationModal';
import LoadingSpinner from '@/components/adminComponents/LoadingSpinner';

type TamanioSabor = {
  id: number;
  precio: number;
  tamanio_id: number;
  sabor_id: number;
  tamanio?: {
    id: number;
    nombre: string;
  };
  sabor?: {
    id: number;
    nombre: string;
  };
};

type Tamanio = {
  id: number;
  nombre: string;
};

type Sabor = {
  id: number;
  nombre: string;
};

export default function CrudTamanioSaborPage() {
  const [tamaniosSabores, setTamaniosSabores] = useState<TamanioSabor[]>([]);
  const [tamanios, setTamanios] = useState<Tamanio[]>([]);
  const [sabores, setSabores] = useState<Sabor[]>([]);
  const [precio, setPrecio] = useState('');
  const [tamanioId, setTamanioId] = useState<number | null>(null);
  const [saborId, setSaborId] = useState<number | null>(null);
  const [modoEdicion, setModoEdicion] = useState(false);
  const [idEditando, setIdEditando] = useState<number | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [itemToDelete, setItemToDelete] = useState<number | null>(null);

  const API_BASE_URL = 'http://localhost:4000/api/tamanioSabor';
  const API_TAMANIOS_URL = 'http://localhost:4000/api/tamanios';
  const API_SABORES_URL = 'http://localhost:4000/api/sabores';

  const fetchTamaniosSabores = async () => {
    try {
      setLoading(true);
      const res = await fetch(`${API_BASE_URL}?include=tamanio,sabor`);
      if (!res.ok) throw new Error('Error al cargar tamaños-sabores');
      const data = await res.json();
      setTamaniosSabores(data);
      setError(null);
    } catch (e: any) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  };

  const fetchTamanios = async () => {
    try {
      const res = await fetch(API_TAMANIOS_URL);
      if (!res.ok) throw new Error('Error al cargar tamaños');
      const data = await res.json();
      setTamanios(data);
    } catch (e: any) {
      console.error('Error fetching tamaños:', e.message);
    }
  };

  const fetchSabores = async () => {
    try {
      const res = await fetch(API_SABORES_URL);
      if (!res.ok) throw new Error('Error al cargar sabores');
      const data = await res.json();
      setSabores(data);
    } catch (e: any) {
      console.error('Error fetching sabores:', e.message);
    }
  };

  useEffect(() => {
    fetchTamaniosSabores();
    fetchTamanios();
    fetchSabores();
  }, []);

  const handleGuardar = async () => {
    if (!precio || isNaN(Number(precio))) {
      setError('El precio debe ser un número válido');
      return;
    }

    if (!tamanioId || !saborId) {
      setError('Debes seleccionar un tamaño y un sabor');
      return;
    }

    const payload = {
      precio: parseFloat(precio),
      tamanio_id: tamanioId,
      sabor_id: saborId
    };

    try {
      setLoading(true);
      if (modoEdicion && idEditando !== null) {
        const res = await fetch(`${API_BASE_URL}/${idEditando}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload),
        });
        if (!res.ok) {
          const err = await res.json();
          throw new Error(err.error || 'Error al actualizar tamaño-sabor');
        }
        setSuccess('Tamaño-sabor actualizado correctamente');
      } else {
        const res = await fetch(API_BASE_URL, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload),
        });
        if (!res.ok) {
          const err = await res.json();
          throw new Error(err.error || 'Error al crear tamaño-sabor');
        }
        setSuccess('Tamaño-sabor creado correctamente');
      }

      await fetchTamaniosSabores();
      resetForm();
      setError(null);
    } catch (e: any) {
      setError(e.message);
      setSuccess(null);
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setModoEdicion(false);
    setIdEditando(null);
    setPrecio('');
    setTamanioId(null);
    setSaborId(null);
  };

  const handleEditar = (tamanioSabor: TamanioSabor) => {
    setModoEdicion(true);
    setIdEditando(tamanioSabor.id);
    setPrecio(tamanioSabor.precio.toString());
    setTamanioId(tamanioSabor.tamanio_id);
    setSaborId(tamanioSabor.sabor_id);
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
        method: 'DELETE',
      });
      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.error || 'Error al eliminar tamaño-sabor');
      }
      setSuccess('Tamaño-sabor eliminado correctamente');
      await fetchTamaniosSabores();
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
        <Topbar title="Gestión de Combinaciones Tamaño-Sabor" />

        <main className="p-6 space-y-6">
          {error && <Alert type="error" message={error} onClose={() => setError(null)} />}
          {success && <Alert type="success" message={success} onClose={() => setSuccess(null)} />}

          <ConfirmationModal
            isOpen={showDeleteModal}
            onClose={() => setShowDeleteModal(false)}
            onConfirm={handleConfirmDelete}
            title="Confirmar eliminación"
            message="¿Estás seguro de que deseas eliminar esta combinación? Esta acción no se puede deshacer."
            confirmText="Eliminar"
          />

          {/* Formulario */}
          <div className="bg-white p-6 rounded-lg shadow">
            <h2 className="text-xl font-bold mb-4">
              {modoEdicion ? 'Editar Combinación' : 'Crear Combinación'}
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Tamaño *
                </label>
                <select
                  value={tamanioId || ''}
                  onChange={(e) => setTamanioId(Number(e.target.value))}
                  className="w-full border border-gray-300 rounded px-4 py-2 focus:ring-2 focus:ring-red-500 focus:border-red-500 outline-none transition"
                  disabled={loading}
                >
                  <option value="">Seleccione un tamaño</option>
                  {tamanios.map((t) => (
                    <option key={t.id} value={t.id}>
                      {t.nombre}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Sabor *
                </label>
                <select
                  value={saborId || ''}
                  onChange={(e) => setSaborId(Number(e.target.value))}
                  className="w-full border border-gray-300 rounded px-4 py-2 focus:ring-2 focus:ring-red-500 focus:border-red-500 outline-none transition"
                  disabled={loading}
                >
                  <option value="">Seleccione un sabor</option>
                  {sabores.map((s) => (
                    <option key={s.id} value={s.id}>
                      {s.nombre}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Precio *
                </label>
                <input
                  type="number"
                  placeholder="Ej: 10.99"
                  value={precio}
                  onChange={(e) => setPrecio(e.target.value)}
                  className="w-full border border-gray-300 rounded px-4 py-2 focus:ring-2 focus:ring-red-500 focus:border-red-500 outline-none transition"
                  disabled={loading}
                  step="0.01"
                  min="0"
                />
              </div>
            </div>

            <div className="mt-6 flex justify-end space-x-3">
              {modoEdicion && (
                <button
                  onClick={resetForm}
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
                {loading ? <LoadingSpinner size={6} /> : modoEdicion ? 'Actualizar' : 'Guardar'}
              </button>
            </div>
          </div>

          {/* Tabla */}
          <div className="bg-white p-6 rounded-lg shadow">
            <h2 className="text-xl font-bold mb-4">Lista de Combinaciones</h2>

            {loading ? (
              <div className="flex justify-center py-8">
                <LoadingSpinner size={8} />
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full table-auto">
                  <thead>
                    <tr className="bg-gray-100 text-left">
                      <th className="px-4 py-3 font-semibold text-gray-700">Tamaño</th>
                      <th className="px-4 py-3 font-semibold text-gray-700">Sabor</th>
                      <th className="px-4 py-3 font-semibold text-gray-700">Precio</th>
                      <th className="px-4 py-3 font-semibold text-gray-700">Acciones</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    {tamaniosSabores.map((tamanioSabor) => (
                      <tr key={tamanioSabor.id} className="hover:bg-gray-50">
                        <td className="px-4 py-3">
                          {tamanioSabor.tamanio?.nombre || 'N/A'}
                        </td>
                        <td className="px-4 py-3">
                          {tamanioSabor.sabor?.nombre || 'N/A'}
                        </td>
                        <td className="px-4 py-3">
                          {typeof tamanioSabor.precio === 'number'
                            ? `$${tamanioSabor.precio.toFixed(2)}`
                            : `$${parseFloat(tamanioSabor.precio as any).toFixed(2)}`}
                        </td>
                        <td className="px-4 py-3">
                          <div className="flex space-x-3">
                            <button
                              onClick={() => handleEditar(tamanioSabor)}
                              className="text-blue-600 hover:text-blue-800 transition-colors font-medium"
                              disabled={loading}
                            >
                              Editar
                            </button>
                            <button
                              onClick={() => handleEliminarClick(tamanioSabor.id)}
                              className="text-red-600 hover:text-red-800 transition-colors font-medium"
                              disabled={loading}
                            >
                              Eliminar
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                    {tamaniosSabores.length === 0 && (
                      <tr>
                        <td colSpan={4} className="px-4 py-6 text-center text-gray-500">
                          No hay combinaciones registradas.
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