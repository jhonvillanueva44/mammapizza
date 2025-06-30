'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import HeaderAdmin from '@/components/adminComponents/HeaderAdmin';
import Topbar from '@/components/adminComponents/Topbar';
import Alert from '@/components/adminComponents/Alert';
import ConfirmationModal from '@/components/adminComponents/ConfirmationModal';
import LoadingSpinner from '@/components/adminComponents/LoadingSpinner';
import ModalFormularioCategoria from '@/adminModals/ModalFormularioCategoria';
import ProtectedRoute from '@/components/adminComponents/ProtectedRoute';

type Categoria = {
  id: number;
  nombre: string;
  descripcion: string;
};

const backendUrl = process.env.NEXT_PUBLIC_BACK_HOST;

export default function CrudCategoriasPage() {
  const [user, setUser] = useState<any>(null);
  const router = useRouter();
  const [categorias, setCategorias] = useState<Categoria[]>([]);
  const [nombre, setNombre] = useState('');
  const [descripcion, setDescripcion] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [mostrarModal, setMostrarModal] = useState(false);
  const [modoEdicion, setModoEdicion] = useState(false);
  const [idEditando, setIdEditando] = useState<number | null>(null);
  const [mostrarConfirmacion, setMostrarConfirmacion] = useState(false);
  const [idAEliminar, setIdAEliminar] = useState<number | null>(null);
  const [paginaActual, setPaginaActual] = useState(1);
  const [busqueda, setBusqueda] = useState('');
  const categoriasPorPagina = 15;

  const API_URL = `${backendUrl}api/categorias`;

  const obtenerCategorias = async () => {
    try {
      setLoading(true);
      const res = await fetch(API_URL);
      if (!res.ok) throw new Error('Error al obtener categorías');
      const data = await res.json();
      setCategorias(data);
      setError(null);
    } catch (error: any) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    obtenerCategorias();
  }, []);

  useEffect(() => {
    setPaginaActual(1);
  }, [busqueda]);

  const categoriasFiltradas = busqueda
    ? categorias.filter(cat => 
        cat.nombre.toLowerCase().includes(busqueda.toLowerCase()) || 
        (cat.descripcion && cat.descripcion.toLowerCase().includes(busqueda.toLowerCase()))
      )
    : categorias;

  const totalPaginas = Math.ceil(categoriasFiltradas.length / categoriasPorPagina);
  const indexInicio = (paginaActual - 1) * categoriasPorPagina;
  const indexFin = indexInicio + categoriasPorPagina;
  const categoriasPagina = categoriasFiltradas.slice(indexInicio, indexFin);

  const handleGuardar = async () => {
    if (!nombre.trim()) {
      setError('El nombre es obligatorio');
      return;
    }

    try {
      setLoading(true);
      const nuevaCategoria = {
        nombre: nombre.trim(),
        descripcion: descripcion.trim(),
      };

      const res = await fetch(
        modoEdicion ? `${API_URL}/${idEditando}` : API_URL,
        {
          method: modoEdicion ? 'PUT' : 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(nuevaCategoria),
        }
      );

      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.message || 'Error al guardar');
      }

      await obtenerCategorias();
      setMostrarModal(false);
      setModoEdicion(false);
      setNombre('');
      setDescripcion('');
      setSuccess(modoEdicion ? 'Categoría actualizada' : 'Categoría creada');
      setError(null);
    } catch (error: any) {
      setError(error.message);
      setSuccess(null);
    } finally {
      setLoading(false);
    }
  };

  const handleEditarClick = (categoria: Categoria) => {
    setModoEdicion(true);
    setIdEditando(categoria.id);
    setNombre(categoria.nombre);
    setDescripcion(categoria.descripcion);
    setMostrarModal(true);
  };

  const handleEliminarClick = (id: number) => {
    setIdAEliminar(id);
    setMostrarConfirmacion(true);
  };

  const handleConfirmarEliminar = async () => {
    try {
      if (idAEliminar === null) return;
      setLoading(true);
      const res = await fetch(`${API_URL}/${idAEliminar}`, { method: 'DELETE' });
      if (!res.ok) throw new Error('Error al eliminar');
      await obtenerCategorias();
      setSuccess('Categoría eliminada correctamente');
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

  return (
    <ProtectedRoute>
      <div className="min-h-screen flex bg-gray-50">
        <HeaderAdmin />

        <div className="flex-1 overflow-auto min-w-0">
          <Topbar title="Gestión de Categorías" />

          <main className="p-6 space-y-6">
            {error && <Alert message={error} onClose={() => setError(null)} type="error" />}
            {success && <Alert message={success} onClose={() => setSuccess(null)} type="success" />}

            <ConfirmationModal
              message="¿Estás seguro de eliminar esta categoría?"
              isOpen={mostrarConfirmacion}
              onClose={() => setMostrarConfirmacion(false)}
              onConfirm={handleConfirmarEliminar}
              title="Confirmar eliminación"
            />

            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-semibold text-gray-800">Listado de Categorías</h2>
              <button
                onClick={() => {
                  setMostrarModal(true);
                  setModoEdicion(false);
                  setNombre('');
                  setDescripcion('');
                }}
                className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-md shadow-sm transition-colors duration-200 flex items-center gap-2 cursor-pointer"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M10 5a1 1 0 011 1v3h3a1 1 0 110 2h-3v3a1 1 0 11-2 0v-3H6a1 1 0 110-2h3V6a1 1 0 011-1z" clipRule="evenodd" />
                </svg>
                Agregar Categoría
              </button>
            </div>

            <div className="mb-4">
              <input
                type="text"
                placeholder="Buscar categorías..."
                className="border border-gray-300 rounded-md px-3 py-2 shadow-sm focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-red-500 w-full max-w-md"
                value={busqueda}
                onChange={(e) => setBusqueda(e.target.value)}
              />
            </div>

            <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
              {loading && categorias.length === 0 ? (
                <div className="flex justify-center py-12">
                  <LoadingSpinner size={10} />
                </div>
              ) : (
                <>
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
                          <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Acciones
                          </th>
                        </tr>
                      </thead>
                      <tbody className="bg-white divide-y divide-gray-200">
                        {categoriasPagina.map((cat) => (
                          <tr key={cat.id} className="hover:bg-gray-50 transition-colors">
                            <td className="px-6 py-4 whitespace-nowrap">
                              <div className="text-sm font-medium text-gray-900">{cat.nombre}</div>
                            </td>
                            <td className="px-6 py-4">
                              <div className="text-sm text-gray-500 max-w-xs line-clamp-2">
                                {cat.descripcion || <span className="text-gray-400">Sin descripción</span>}
                              </div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                              <div className="flex justify-end space-x-3">
                                <button
                                  onClick={() => handleEditarClick(cat)}
                                  className="text-indigo-600 hover:text-indigo-900 transition-colors cursor-pointer"
                                  disabled={loading}
                                >
                                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                                    <path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z" />
                                  </svg>
                                </button>
                                <button
                                  onClick={() => handleEliminarClick(cat.id)}
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
                        {categoriasPagina.length === 0 && !loading && (
                          <tr>
                            <td colSpan={3} className="px-6 py-8 text-center">
                              <div className="flex flex-col items-center justify-center text-gray-500">
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 opacity-50 mb-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                                </svg>
                                <p className="text-lg font-medium">No hay categorías registradas</p>
                                <p className="text-sm mt-1">Comienza agregando una nueva categoría</p>
                              </div>
                            </td>
                          </tr>
                        )}
                      </tbody>
                    </table>
                  </div>

                  {totalPaginas > 1 && (
                  <div className="flex justify-center mt-4 pb-4">
                    <nav className="flex items-center gap-1">
                      {Array.from({ length: totalPaginas }, (_, i) => (
                        <button
                          key={i}
                          onClick={() => setPaginaActual(i + 1)}
                          className={`w-10 h-10 flex items-center justify-center rounded-md border ${
                            paginaActual === i + 1
                              ? 'bg-red-600 text-white border-red-600'
                              : 'border-gray-300 text-gray-700 hover:bg-gray-100'
                          } cursor-pointer`}
                        >
                          {i + 1}
                        </button>
                      ))}
                    </nav>
                  </div>
                )}
                </>
              )}
            </div>
          </main>
        </div>

        <ModalFormularioCategoria
          isOpen={mostrarModal}
          onClose={() => {
            setMostrarModal(false);
            setModoEdicion(false);
            setNombre('');
            setDescripcion('');
          }}
          onSave={handleGuardar}
          loading={loading}
          modoEdicion={modoEdicion}
          nombre={nombre}
          setNombre={setNombre}
          descripcion={descripcion}
          setDescripcion={setDescripcion}
        />
      </div>
      </ProtectedRoute>
  );
}