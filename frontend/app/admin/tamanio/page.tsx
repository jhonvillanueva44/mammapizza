//tamañopage.tsx
'use client';

import { useEffect, useState } from 'react';
import HeaderAdmin from '@/components/adminComponents/HeaderAdmin';
import Topbar from '@/components/adminComponents/Topbar';
import Alert from '@/components/adminComponents/Alert';
import ConfirmationModal from '@/components/adminComponents/ConfirmationModal';
import ModalFormularioTamano from '@/adminModals/ModalFormularioTamano';
import LoadingSpinner from '@/components/adminComponents/LoadingSpinner';

type Tamano = {
  id: number;
  nombre: string;
  descripcion: string;
  tipo: string;
};

const tiposDisponibles = ['Pizza', 'Calzone', 'Pasta', 'Agregado'];

export default function CrudTamaniosPage() {
  const [tamanos, setTamanos] = useState<Tamano[]>([]);
  const [nombre, setNombre] = useState('');
  const [descripcion, setDescripcion] = useState('');
  const [tipo, setTipo] = useState(''); 
  const [filtroTipo, setFiltroTipo] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [mostrarModal, setMostrarModal] = useState(false);
  const [modoEdicion, setModoEdicion] = useState(false);
  const [idEditando, setIdEditando] = useState<number | null>(null);
  const [mostrarConfirmacion, setMostrarConfirmacion] = useState(false);
  const [idAEliminar, setIdAEliminar] = useState<number | null>(null);

  const [paginaActual, setPaginaActual] = useState(1);
  const tamanosPorPagina = 15;

  const API_URL = 'http://localhost:4000/api/tamanios';

  const obtenerTamanos = async () => {
    try {
      setLoading(true);
      const res = await fetch(API_URL);
      if (!res.ok) throw new Error('Error al obtener tamaños');
      const data = await res.json();
      setTamanos(data);
      setError(null);
    } catch (error: any) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    obtenerTamanos();
  }, []);

  useEffect(() => {
    setPaginaActual(1);
  }, [filtroTipo]);

  const tamanosFiltrados = filtroTipo
    ? tamanos.filter((t) => t.tipo === filtroTipo)
    : tamanos;

  const totalPaginas = Math.ceil(tamanosFiltrados.length / tamanosPorPagina);
  const indexInicio = (paginaActual - 1) * tamanosPorPagina;
  const indexFin = indexInicio + tamanosPorPagina;
  const tamanosPagina = tamanosFiltrados.slice(indexInicio, indexFin);

  const handleGuardar = async () => {
    if (!nombre.trim() || !tipo.trim()) {
      setError('Nombre y tipo son obligatorios');
      return;
    }

    try {
      setLoading(true);
      const nuevoTamano = {
        nombre: nombre.trim(),
        descripcion: descripcion.trim(),
        tipo: tipo.trim()
      };

      const res = await fetch(
        modoEdicion ? `${API_URL}/${idEditando}` : API_URL,
        {
          method: modoEdicion ? 'PUT' : 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(nuevoTamano),
        }
      );

      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.message || 'Error al guardar');
      }

      await obtenerTamanos();
      setMostrarModal(false);
      setModoEdicion(false);
      setNombre('');
      setDescripcion('');
      setTipo('');
      setSuccess(modoEdicion ? 'Tamaño actualizado correctamente' : 'Tamaño creado correctamente');
      setError(null);
    } catch (error: any) {
      setError(error.message);
      setSuccess(null);
    } finally {
      setLoading(false);
    }
  };

  const handleEditarClick = (tamano: Tamano) => {
    setModoEdicion(true);
    setIdEditando(tamano.id);
    setNombre(tamano.nombre);
    setDescripcion(tamano.descripcion);
    setTipo(tamano.tipo);
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
      await obtenerTamanos();
      setSuccess('Tamaño eliminado correctamente');
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
    <div className="min-h-screen flex bg-gray-50">
      <HeaderAdmin />

      <div className="flex-1 overflow-auto min-w-0">
        <Topbar title="Gestión de Tamaños" />

        <main className="p-6 space-y-6">
          {error && <Alert message={error} onClose={() => setError(null)} type="error" />}
          {success && <Alert message={success} onClose={() => setSuccess(null)} type="success" />}

          <ConfirmationModal
            message="¿Estás seguro de eliminar este tamaño?"
            isOpen={mostrarConfirmacion}
            onClose={() => setMostrarConfirmacion(false)}
            onConfirm={handleConfirmarEliminar}
            title="Confirmar eliminación"
          />

          <div className="flex flex-wrap justify-between items-center gap-4 mb-4">
            {/* Cambiar a filtroTipo */}
            <select
              className="border border-gray-300 rounded px-3 py-2"
              value={filtroTipo}
              onChange={(e) => setFiltroTipo(e.target.value)}
            >
              <option value="">Todos los tipos</option>
              {tiposDisponibles.map((t) => (
                <option key={t} value={t}>{t}</option>
              ))}
            </select>

            <button
              onClick={() => {
                setMostrarModal(true);
                setModoEdicion(false);
                setNombre('');
                setDescripcion('');
                setTipo('');
              }}
              className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700"
            >
              Agregar Tamaño
            </button>
          </div>

          <div className="bg-white rounded shadow p-4">
            {loading && tamanos.length === 0 ? (
              <div className="flex justify-center py-8">
                <LoadingSpinner size={8} />
              </div>
            ) : (
              <>
                <table className="w-full table-fixed">
                  <thead>
                    <tr className="bg-gray-100">
                      <th className="px-4 py-2 text-left w-1/4">Nombre</th>
                      <th className="px-4 py-2 text-left w-1/4">Tipo</th>
                      <th className="px-4 py-2 text-left w-1/4">Descripción</th>
                      <th className="px-4 py-2 text-left w-1/4">Acciones</th>
                    </tr>
                  </thead>
                  <tbody>
                    {tamanosPagina.map((t) => (
                      <tr key={t.id} className="border-t">
                        <td className="px-4 py-2 truncate">{t.nombre}</td>
                        <td className="px-4 py-2 truncate">{t.tipo}</td>
                        <td className="px-4 py-2">{t.descripcion || '-'}</td>
                        <td className="px-4 py-2 space-x-2">
                          <button
                            onClick={() => handleEditarClick(t)}
                            className="text-blue-600 hover:text-blue-800"
                            disabled={loading}
                          >
                            Editar
                          </button>
                          <button
                            onClick={() => handleEliminarClick(t.id)}
                            className="text-red-600 hover:text-red-800"
                            disabled={loading}
                          >
                            Eliminar
                          </button>
                        </td>
                      </tr>
                    ))}
                    {tamanosPagina.length === 0 && !loading && (
                      <tr>
                        <td colSpan={4} className="text-center py-4 text-gray-500">
                          No hay tamaños registrados.
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>

                {totalPaginas > 1 && (
                  <div className="flex justify-center mt-4 space-x-2">
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
                  </div>
                )}
              </>
            )}
          </div>
        </main>
      </div>

      <ModalFormularioTamano
        isOpen={mostrarModal}
        onClose={() => {
          setMostrarModal(false);
          setModoEdicion(false);
          setNombre('');
          setDescripcion('');
          setTipo('');
        }}
        onSave={handleGuardar}
        loading={loading}
        modoEdicion={modoEdicion}
        nombre={nombre}
        setNombre={setNombre}
        descripcion={descripcion}
        setDescripcion={setDescripcion}
        tipo={tipo}
        setTipo={setTipo}
      />
    </div>
  );
}