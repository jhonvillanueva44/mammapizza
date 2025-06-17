'use client';

import { useEffect, useState } from 'react';
import HeaderAdmin from '@/components/adminComponents/HeaderAdmin';
import Topbar from '@/components/adminComponents/Topbar';
import Alert from '@/components/adminComponents/Alert';
import ConfirmationModal from '@/components/adminComponents/ConfirmationModal';
import ModalFormularioSabor from '@/adminModals/ModalFormularioSabor';
import LoadingSpinner from '@/components/adminComponents/LoadingSpinner';

type Sabor = {
  id: number;
  nombre: string;
  descripcion: string;
  tipo: 'Pizza' | 'Calzone' | 'Pasta';
  especial: boolean;
};

const tiposDisponibles = ['Pizza', 'Calzone', 'Pasta'];

export default function CrudSaborPage() {
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

  const [search, setSearch] = useState('');
  const [filtroTipo, setFiltroTipo] = useState<string>('');
  const [paginaActual, setPaginaActual] = useState(1);
  const saboresPorPagina = 15;

  const API_URL = 'http://localhost:4000/api/sabores';

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
    setPaginaActual(1);
  }, [filtroTipo, search]);

  const saboresFiltrados = sabores.filter((sabor) => {
    const matchesSearch = sabor.nombre.toLowerCase().includes(search.toLowerCase());
    const matchesType = filtroTipo ? sabor.tipo === filtroTipo : true;
    return matchesSearch && matchesType;
  });

  const totalPaginas = Math.ceil(saboresFiltrados.length / saboresPorPagina);
  const indexInicio = (paginaActual - 1) * saboresPorPagina;
  const indexFin = indexInicio + saboresPorPagina;
  const saboresPagina = saboresFiltrados.slice(indexInicio, indexFin);

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

  return (
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
            confirmText="Eliminar"
          />

          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-semibold text-gray-800">Listado de Sabores</h2>
            <button
              onClick={() => {
                setNombre('');
                setDescripcion('');
                setTipo('');
                setEspecial(false);
                setMostrarModal(true);
                setModoEdicion(false);
                setIdEditando(null);
              }}
              className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-md shadow-sm transition-colors duration-200 flex items-center gap-2 cursor-pointer"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10 5a1 1 0 011 1v3h3a1 1 0 110 2h-3v3a1 1 0 11-2 0v-3H6a1 1 0 110-2h3V6a1 1 0 011-1z" clipRule="evenodd" />
              </svg>
              Agregar Sabor
            </button>
          </div>

          <div className="flex flex-wrap gap-4 mb-6">
            <div className="relative flex-1 min-w-[200px]">
              <input
                type="text"
                placeholder="Buscar por nombre..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full border border-gray-300 rounded-md px-4 py-2 focus:ring-2 focus:ring-red-500 focus:outline-none cursor-text"
              />
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5 absolute right-3 top-2.5 text-gray-400"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>
            <select
              value={filtroTipo}
              onChange={(e) => setFiltroTipo(e.target.value)}
              className="border border-gray-300 rounded-md px-4 py-2 focus:ring-2 focus:ring-red-500 focus:outline-none cursor-pointer"
            >
              <option value="">Todos los tipos</option>
              {tiposDisponibles.map((tipo) => (
                <option key={tipo} value={tipo}>
                  {tipo}
                </option>
              ))}
            </select>
          </div>

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
                        Descripción
                      </th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Tipo
                      </th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
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
                        <td className="px-6 py-4">
                          <div className="text-sm text-gray-500 max-w-xs line-clamp-2">
                            {sabor.descripcion || <span className="text-gray-400">Sin descripción</span>}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-500">{sabor.tipo}</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-500">
                            {sabor.tipo === 'Pizza' ? (sabor.especial ? '✅' : '❌') : '➖'}
                          </div>
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
                            <p className="text-lg font-medium">No hay sabores registrados</p>
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

          {totalPaginas > 1 && (
            <div className="flex justify-center items-center gap-2 mt-6">
              <button
                onClick={() => setPaginaActual(paginaActual - 1)}
                disabled={paginaActual === 1}
                className="px-4 py-2 border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer transition-colors"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z" clipRule="evenodd" />
                </svg>
              </button>
              
              {Array.from({ length: Math.min(totalPaginas, 5) }, (_, i) => {
                let pageNum;
                if (totalPaginas <= 5) {
                  pageNum = i + 1;
                } else if (paginaActual <= 3) {
                  pageNum = i + 1;
                } else if (paginaActual >= totalPaginas - 2) {
                  pageNum = totalPaginas - 4 + i;
                } else {
                  pageNum = paginaActual - 2 + i;
                }

                return (
                  <button
                    key={pageNum}
                    onClick={() => setPaginaActual(pageNum)}
                    className={`px-4 py-2 border rounded-md cursor-pointer transition-colors ${
                      paginaActual === pageNum
                        ? 'bg-red-600 text-white border-red-600'
                        : 'border-gray-300 hover:bg-gray-50'
                    }`}
                  >
                    {pageNum}
                  </button>
                );
              })}
              
              <button
                onClick={() => setPaginaActual(paginaActual + 1)}
                disabled={paginaActual === totalPaginas}
                className="px-4 py-2 border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer transition-colors"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
                </svg>
              </button>
            </div>
          )}
        </main>
      </div>

      <ModalFormularioSabor
        isOpen={mostrarModal}
        onClose={() => {
          setMostrarModal(false);
          setModoEdicion(false);
          setIdEditando(null);
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
        onSave={function (): void {
          throw new Error('Function not implemented.');
        }}
        loading={false}
      />
    </div>
  );
}