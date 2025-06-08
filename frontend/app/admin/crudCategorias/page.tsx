'use client';

import { useState } from 'react';
import HeaderAdmin from '@/components/adminComponents/HeaderAdmin';
import Topbar from '@/components/adminComponents/Topbar';

type Tamano = {
  id: number;
  nombre: string;
  descripcion: string;
};

export default function CrudTamanoPage() {
  const [tamanos, setTamanos] = useState<Tamano[]>([
    { id: 1, nombre: 'Pequeña', descripcion: 'ohana es familia' },
    { id: 2, nombre: 'Mediana', descripcion: 'ohana es familia' },
    { id: 3, nombre: 'Familiar', descripcion: 'ohana es familia' },
  ]);

  const [nombre, setNombre] = useState('');
  const [descripcion, setDescripcion] = useState('');
  const [modoEdicion, setModoEdicion] = useState(false);
  const [idEditando, setIdEditando] = useState<number | null>(null);

  const handleGuardar = () => {
    if (!nombre.trim()) return;

    const nuevo: Tamano = {
      id: modoEdicion && idEditando !== null ? idEditando : Date.now(),
      nombre: nombre.trim(),
      descripcion: descripcion.trim(),
    };

    if (modoEdicion) {
      setTamanos(tamanos.map(t => t.id === idEditando ? nuevo : t));
      setModoEdicion(false);
      setIdEditando(null);
    } else {
      setTamanos([...tamanos, nuevo]);
    }

    setNombre('');
    setDescripcion('');
  };

  const handleEditar = (tamano: Tamano) => {
    setModoEdicion(true);
    setIdEditando(tamano.id);
    setNombre(tamano.nombre);
    setDescripcion(tamano.descripcion);
  };

  const handleEliminar = (id: number) => {
    setTamanos(tamanos.filter(t => t.id !== id));
  };

  return (
    <div className="min-h-screen bg-gray-50 flex">
      <HeaderAdmin />
      <div className="flex-1 overflow-auto">
        <Topbar title="Gestión de Categorias" />

        <main className="p-6 space-y-6">
          {/* Formulario */}
          <div className="bg-white p-6 rounded-lg shadow">
            <h2 className="text-xl font-bold mb-4">
              {modoEdicion ? 'Editar Categoria' : 'Agregar Categoria'}
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <input
                type="text"
                placeholder="Nombre de la Categoria"
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
            </div>

            <div className="mt-4 flex justify-end space-x-3">
              {modoEdicion && (
                <button
                  onClick={() => {
                    setModoEdicion(false);
                    setIdEditando(null);
                    setNombre('');
                    setDescripcion('');
                  }}
                  className="text-gray-600 hover:text-gray-900"
                >
                  Cancelar
                </button>
              )}
              <button
                onClick={handleGuardar}
                className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded"
              >
                {modoEdicion ? 'Actualizar' : 'Guardar'}
              </button>
            </div>
          </div>

          {/* Tabla */}
          <div className="bg-white p-6 rounded-lg shadow">
            <h2 className="text-xl font-bold mb-4">Lista de Categorias</h2>
            <table className="w-full table-auto">
              <thead>
                <tr className="bg-gray-100">
                  <th className="text-left px-4 py-2">Nombre</th>
                  <th className="text-left px-4 py-2">Descripción</th>
                  <th className="text-left px-4 py-2">Acciones</th>
                </tr>
              </thead>
              <tbody>
                {tamanos.map((tamano) => (
                  <tr key={tamano.id} className="border-t">
                    <td className="px-4 py-2">{tamano.nombre}</td>
                    <td className="px-4 py-2">{tamano.descripcion}</td>
                    <td className="px-4 py-2 space-x-3">
                      <button
                        onClick={() => handleEditar(tamano)}
                        className="text-blue-600 hover:underline"
                      >
                        Editar
                      </button>
                      <button
                        onClick={() => handleEliminar(tamano.id)}
                        className="text-red-600 hover:underline"
                      >
                        Eliminar
                      </button>
                    </td>
                  </tr>
                ))}
                {tamanos.length === 0 && (
                  <tr>
                    <td colSpan={3} className="px-4 py-4 text-center text-gray-500">
                      No hay Categorias registradas.
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
