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

          <div className="flex flex-wrap justify-between items-center gap-4 mb-4">
            <div className="flex gap-4">
              <input
                type="text"
                placeholder="Buscar sabor por nombre..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="border border-gray-300 rounded px-3 py-2 focus:ring-2 focus:ring-red-500 focus:outline-none"
              />

              
            </div>

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
              className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700"
            >
              Agregar Sabor
            </button>
          </div>

          <div className="bg-white rounded shadow p-4">
            {loading && sabores.length === 0 ? (
              <div className="flex justify-center py-8">
                <LoadingSpinner size={8} />
              </div>
            ) : (
              <>
                <table className="w-full table-auto">
                  <thead>
                    <tr className="bg-gray-100">
                      <th className="px-4 py-2 text-left">Nombre</th>
                      <th className="px-4 py-2 text-left">Descripción</th>
                      <th className="px-4 py-2 text-left">Tipo</th>
                      <th className="px-4 py-2 text-left">Especial</th>
                      <th className="px-4 py-2 text-left">Acciones</th>
                    </tr>
                  </thead>
                  <tbody>
                    {saboresPagina.map((sabor) => (
                      <tr key={sabor.id} className="border-t">
                        <td className="px-4 py-2">{sabor.nombre}</td>
                        <td className="px-4 py-2">{sabor.descripcion}</td>
                        <td className="px-4 py-2">{sabor.tipo}</td>
                        <td className="px-4 py-2">
                          {sabor.tipo === 'Pizza' ? (sabor.especial ? '✅' : '❌') : '➖'}
                        </td>
                        <td className="px-4 py-2 space-x-2">
                          <button
                            onClick={() => handleEditarClick(sabor)}
                            className="text-blue-600 hover:text-blue-800"
                            disabled={loading}
                          >
                            Editar
                          </button>
                          <button
                            onClick={() => handleEliminarClick(sabor.id)}
                            className="text-red-600 hover:text-red-800"
                            disabled={loading}
                          >
                            Eliminar
                          </button>
                        </td>
                      </tr>
                    ))}
                    {saboresPagina.length === 0 && !loading && (
                      <tr>
                        <td colSpan={5} className="text-center py-4 text-gray-500">
                          No hay sabores registrados.
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>

                {totalPaginas > 1 && (
                  <div className="flex justify-center mt-4 space-x-2">
                    <button
                      onClick={() => setPaginaActual(paginaActual - 1)}
                      disabled={paginaActual === 1}
                      className="px-3 py-1 rounded border border-gray-300 disabled:opacity-50"
                    >
                      Anterior
                    </button>
                    
                    {Array.from({ length: totalPaginas }, (_, i) => (
                      <button
                        key={i}
                        className={`px-3 py-1 rounded border ${
                          paginaActual === i + 1
                            ? 'bg-red-600 text-white border-red-600'
                            : 'border-gray-300 text-gray-700 hover:bg-gray-100'
                        }`}
                        onClick={() => setPaginaActual(i + 1)}
                      >
                        {i + 1}
                      </button>
                    ))}
                    
                    <button
                      onClick={() => setPaginaActual(paginaActual + 1)}
                      disabled={paginaActual === totalPaginas}
                      className="px-3 py-1 rounded border border-gray-300 disabled:opacity-50"
                    >
                      Siguiente
                    </button>
                  </div>
                )}
              </>
            )}
          </div>
        </main>
      </div>

      <ModalFormularioSabor
        isOpen={mostrarModal}
        onClose={() => {
          setMostrarModal(false);
          setModoEdicion(false);
          setIdEditando(null);
        } }
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
        setEspecial={setEspecial} onSave={function (): void {
          throw new Error('Function not implemented.');
        } } loading={false}      />
    </div>
  );
}
