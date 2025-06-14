'use client';

import { useEffect, useState } from 'react';
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

export default function CrudCategoriasPage() {
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

  const API_URL = 'http://localhost:4000/api/categorias';

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

          <div className="flex justify-end mb-4">
            <button
              onClick={() => {
                setMostrarModal(true);
                setModoEdicion(false);
                setNombre('');
                setDescripcion('');
              }}
              className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700"
            >
              Agregar Categoría
            </button>
          </div>

          <div className="bg-white rounded shadow p-4">
            {loading && categorias.length === 0 ? (
              <div className="flex justify-center py-8">
                <LoadingSpinner size={8} />
              </div>
            ) : (
              <table className="w-full table-auto">
                <thead>
                  <tr className="bg-gray-100">
                    <th className="px-4 py-2 text-left">Nombre</th>
                    <th className="px-4 py-2 text-left">Descripción</th>
                    <th className="px-4 py-2 text-left">Acciones</th>
                  </tr>
                </thead>
                <tbody>
                  {categorias.map((cat) => (
                    <tr key={cat.id} className="border-t">
                      <td className="px-4 py-2">{cat.nombre}</td>
                      <td className="px-4 py-2">{cat.descripcion || '-'}</td>
                      <td className="px-4 py-2 space-x-2">
                        <button
                          onClick={() => handleEditarClick(cat)}
                          className="text-blue-600 hover:text-blue-800"
                          disabled={loading}
                        >
                          Editar
                        </button>
                        <button
                          onClick={() => handleEliminarClick(cat.id)}
                          className="text-red-600 hover:text-red-800"
                          disabled={loading}
                        >
                          Eliminar
                        </button>
                      </td>
                    </tr>
                  ))}
                  {categorias.length === 0 && !loading && (
                    <tr>
                      <td colSpan={3} className="text-center py-4 text-gray-500">
                        No hay categorías registradas.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
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
  );
}
