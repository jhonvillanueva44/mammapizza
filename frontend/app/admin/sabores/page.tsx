'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import HeaderAdmin from '@/components/adminComponents/HeaderAdmin';
import Topbar from '@/components/adminComponents/Topbar';
import Alert from '@/components/adminComponents/Alert';
import ConfirmationModal from '@/components/adminComponents/ConfirmationModal';
import ModalFormularioSabor from '@/adminModals/ModalFormularioSabor';
import LoadingSpinner from '@/components/adminComponents/LoadingSpinner';
import ProtectedRoute from '@/components/adminComponents/ProtectedRoute';

type Sabor = {
  id: number;
  nombre: string;
  descripcion: string;
  tipo: 'Pizza' | 'Calzone' | 'Pasta' | 'Agregado' | 'Bebida';
  especial: boolean;
};

const tiposDisponibles = ['Pizza', 'Calzone', 'Pasta', 'Bebida'];

const backendUrl = process.env.NEXT_PUBLIC_BACK_HOST;

export default function CrudSaborPage() {
  const [user, setUser] = useState<any>(null);
  const router = useRouter();
  const [sabores, setSabores] = useState<Sabor[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [mostrarModal, setMostrarModal] = useState(false);
  const [modoEdicion, setModoEdicion] = useState(false);
  const [idEditando, setIdEditando] = useState<number | null>(null);
  const [mostrarConfirmacion, setMostrarConfirmacion] = useState(false);
  const [idAEliminar, setIdAEliminar] = useState<number | null>(null);

  const [nombre, setNombre] = useState('');
  const [descripcion, setDescripcion] = useState('');
  const [tipo, setTipo] = useState('');
  const [especial, setEspecial] = useState(false);

  const [busqueda, setBusqueda] = useState('');
  const [filtroTipo, setFiltroTipo] = useState('');
  const [pagina, setPagina] = useState(1);
  const ITEMS_POR_PAGINA = 15;

  const API_URL = `${backendUrl}api/sabores`;

  const obtenerSabores = async () => {
    try {
      setLoading(true);
      const res = await fetch(API_URL);
      if (!res.ok) throw new Error('Error al obtener los sabores');
      const data = await res.json();
      setSabores(data);
      setError(null);
    } catch (error: any) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    obtenerSabores();
  }, []);

  useEffect(() => {
    setPagina(1);
  }, [filtroTipo, busqueda]);

  const saboresFiltrados = sabores.filter((sabor) => {
    const matchesSearch = sabor.nombre.toLowerCase().includes(busqueda.toLowerCase()) ||
      sabor.descripcion.toLowerCase().includes(busqueda.toLowerCase());
    const matchesType = filtroTipo ? sabor.tipo === filtroTipo : true;
    return matchesSearch && matchesType;
  });

  const totalPaginas = Math.ceil(saboresFiltrados.length / ITEMS_POR_PAGINA);
  const saboresPagina = saboresFiltrados.slice((pagina - 1) * ITEMS_POR_PAGINA, pagina * ITEMS_POR_PAGINA);

  const handleEliminarClick = (id: number) => {
    setIdAEliminar(id);
    setMostrarConfirmacion(true);
  };

  const handleConfirmarEliminar = async () => {
    try {
      if (idAEliminar === null) return;
      setLoading(true);
      const res = await fetch(`${API_URL}/${idAEliminar}`, { method: 'DELETE' });
      if (!res.ok) throw new Error('Error al eliminar el sabor');
      await obtenerSabores();
      setSuccess('Sabor eliminado correctamente');
      setError(null);
    } catch (error: any) {
      setError(error.message);
      setSuccess(null);
    } finally {
      setLoading(false);
      setMostrarConfirmacion(false);
      setIdAEliminar(null);
    }
  };

  const handleEditarClick = (sabor: Sabor) => {
    setNombre(sabor.nombre);
    setDescripcion(sabor.descripcion);
    setTipo(sabor.tipo);
    setEspecial(sabor.especial);
    setModoEdicion(true);
    setIdEditando(sabor.id);
    setMostrarModal(true);
  };

  const handleSuccess = (message: string) => {
    setSuccess(message);
    obtenerSabores();
    setMostrarModal(false);
  };

  const handleGuardarSabor = async () => {
    try {
      setLoading(true);

      const saborData = {
        nombre,
        descripcion,
        tipo,
        especial,
      };

      const res = await fetch(
        modoEdicion ? `${API_URL}/${idEditando}` : API_URL,
        {
          method: modoEdicion ? 'PUT' : 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(saborData),
        }
      );

      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.message || 'Error al guardar el sabor');
      }

      handleSuccess(modoEdicion ? 'Sabor actualizado correctamente' : 'Sabor agregado correctamente');
    } catch (error: any) {
      setError(error.message);
      setSuccess(null);
    } finally {
      setLoading(false);
    }
  };

  const limpiarFormulario = () => {
    setNombre('');
    setDescripcion('');
    setTipo('');
    setEspecial(false);
    setModoEdicion(false);
    setIdEditando(null);
  };

  const handleAgregarClick = () => {
    limpiarFormulario();
    setMostrarModal(true);
  };

  return (
    <ProtectedRoute>
      <div className="min-h-screen flex bg-gray-50">
        <HeaderAdmin />

        <div className="flex-1 overflow-auto min-w-0">
          <Topbar title="Gestión de Sabores" />

          <main className="p-6 space-y-6">
            {error && <Alert message={error} onClose={() => setError(null)} type="error" />}
            {success && <Alert message={success} onClose={() => setSuccess(null)} type="success" />}

            <ConfirmationModal
              message="¿Estás seguro de eliminar este sabor?"
              isOpen={mostrarConfirmacion}
              onClose={() => setMostrarConfirmacion(false)}
              onConfirm={handleConfirmarEliminar}
              title="Confirmar eliminación"
            />

            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-semibold text-gray-800">Listado de Sabores</h2>
              <button
                onClick={handleAgregarClick}
                className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-md shadow-sm transition-colors duration-200 flex items-center gap-2 cursor-pointer"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M10 5a1 1 0 011 1v3h3a1 1 0 110 2h-3v3a1 1 0 11-2 0v-3H6a1 1 0 110-2h3V6a1 1 0 011-1z" clipRule="evenodd" />
                </svg>
                Agregar Sabor
              </button>
            </div>

            {/* Controles de filtro y búsqueda */}
            <div className="flex flex-wrap gap-4 mb-6">
              <div className="flex-1 min-w-64">
                <input
                  type="text"
                  placeholder="Buscar sabores..."
                  value={busqueda}
                  onChange={(e) => setBusqueda(e.target.value)}
                  className="w-full border border-gray-300 rounded-md px-3 py-2 shadow-sm focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-red-500"
                />
              </div>
              <select
                value={filtroTipo}
                onChange={(e) => setFiltroTipo(e.target.value)}
                className="border border-gray-300 rounded-md px-3 py-2 shadow-sm focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-red-500 cursor-pointer"
              >
                <option value="">Todos los tipos</option>
                {tiposDisponibles.map((tipo) => (
                  <option key={tipo} value={tipo}>
                    {tipo}
                  </option>
                ))}
              </select>
            </div>

            {/* Tabla de sabores */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
              {loading && sabores.length === 0 ? (
                <div className="flex justify-center py-12">
                  <LoadingSpinner size={10} />
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Nombre
                        </th>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Tipo
                        </th>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Descripción
                        </th>
                        <th scope="col" className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Especial
                        </th>
                        <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Acciones
                        </th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {saboresPagina.map((sabor) => (
                        <tr key={sabor.id} className="hover:bg-gray-50 transition-colors">
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="text-sm font-medium text-gray-900">{sabor.nombre}</div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                              {sabor.tipo}
                            </span>
                          </td>
                          <td className="px-6 py-4">
                            <div className="text-sm text-gray-500 max-w-xs line-clamp-2">
                              {sabor.descripcion || <span className="text-gray-400">Sin descripción</span>}
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-center">
                            {sabor.tipo === 'Pizza' ? (
                              sabor.especial ? (
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-green-500 mx-auto" viewBox="0 0 20 20" fill="currentColor">
                                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                                </svg>
                              ) : (
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-red-500 mx-auto" viewBox="0 0 20 20" fill="currentColor">
                                  <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                                </svg>
                              )
                            ) : (
                              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-400 mx-auto" viewBox="0 0 20 20" fill="currentColor">
                                <path fillRule="evenodd" d="M4 10a1 1 0 011-1h10a1 1 0 110 2H5a1 1 0 01-1-1z" clipRule="evenodd" />
                              </svg>
                            )}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                            <div className="flex justify-end space-x-3">
                              <button
                                onClick={() => handleEditarClick(sabor)}
                                className="text-indigo-600 hover:text-indigo-900 transition-colors cursor-pointer"
                                disabled={loading}
                              >
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                                  <path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z" />
                                </svg>
                              </button>
                              <button
                                onClick={() => handleEliminarClick(sabor.id)}
                                className="text-red-600 hover:text-red-900 transition-colors cursor-pointer"
                                disabled={loading}
                              >
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                                  <path fillRule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd" />
                                </svg>
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                      {saboresPagina.length === 0 && !loading && (
                        <tr>
                          <td colSpan={5} className="px-6 py-8 text-center">
                            <div className="flex flex-col items-center justify-center text-gray-500">
                              <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 opacity-50 mb-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                              </svg>
                              <p className="text-lg font-medium">No se encontraron sabores</p>
                              <p className="text-sm mt-1">Comienza agregando un nuevo sabor</p>
                            </div>
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              )}
            </div>

            {/* Paginación */}
            {totalPaginas > 1 && (
              <div className="flex justify-center mt-4">
                <nav className="inline-flex rounded-md shadow-sm -space-x-px" aria-label="Pagination">
                  <button
                    onClick={() => setPagina(pagina - 1)}
                    disabled={pagina === 1}
                    className={`relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium ${pagina === 1 ? 'text-gray-300 cursor-not-allowed' : 'text-gray-500 hover:bg-gray-50 cursor-pointer'}`}
                  >
                    <span className="sr-only">Anterior</span>
                    <svg className="h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                      <path fillRule="evenodd" d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                  </button>

                  {Array.from({ length: totalPaginas }, (_, i) => (
                    <button
                      key={i}
                      onClick={() => setPagina(i + 1)}
                      className={`relative inline-flex items-center px-4 py-2 border text-sm font-medium ${pagina === i + 1 ? 'z-10 bg-red-50 border-red-500 text-red-600 cursor-default' : 'bg-white border-gray-300 text-gray-500 hover:bg-gray-50 cursor-pointer'}`}
                    >
                      {i + 1}
                    </button>
                  ))}

                  <button
                    onClick={() => setPagina(pagina + 1)}
                    disabled={pagina === totalPaginas}
                    className={`relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 bg-white text-sm font-medium ${pagina === totalPaginas ? 'text-gray-300 cursor-not-allowed' : 'text-gray-500 hover:bg-gray-50 cursor-pointer'}`}
                  >
                    <span className="sr-only">Siguiente</span>
                    <svg className="h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                      <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
                    </svg>
                  </button>
                </nav>
              </div>
            )}

            <ModalFormularioSabor
              isOpen={mostrarModal}
              onClose={() => {
                setMostrarModal(false);
                limpiarFormulario();
              }}
              onSuccess={handleSuccess}
              modoEdicion={modoEdicion}
              idEditando={idEditando}
              nombre={nombre}
              setNombre={setNombre}
              descripcion={descripcion}
              setDescripcion={setDescripcion}
              tipo={tipo}
              setTipo={setTipo}
              especial={especial}
              setEspecial={setEspecial}
              onSave={handleGuardarSabor}
              loading={loading}
            />
          </main>
        </div>
      </div>
      </ProtectedRoute>
  );
}