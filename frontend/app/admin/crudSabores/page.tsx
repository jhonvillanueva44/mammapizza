'use client';

import { useState } from 'react';
import HeaderAdmin from '@/components/adminComponents/HeaderAdmin';
import Topbar from '@/components/adminComponents/Topbar';

type Sabor = {
  id: number;
  nombre: string;
  descripcion: string;
  tipo: 'Pizza' | 'Calzone' | 'Pasta';
};

export default function CrudSaborPage() {
  const [sabores, setSabores] = useState<Sabor[]>([
    { id: 1, nombre: 'Jamón y Queso', descripcion: 'ohana es familia', tipo: 'Pizza' },
    { id: 2, nombre: 'Napolitana', descripcion: 'ohana es familia', tipo: 'Calzone' },
    { id: 3, nombre: 'Carbonara', descripcion: 'ohana es familia', tipo: 'Pasta' },
  ]);

  const [nombre, setNombre] = useState('');
  const [descripcion, setDescripcion] = useState('');
  const [tipo, setTipo] = useState<'Pizza' | 'Calzone' | 'Pasta'>('Pizza');
  const [modoEdicion, setModoEdicion] = useState(false);
  const [idEditando, setIdEditando] = useState<number | null>(null);

  const handleGuardar = () => {
    if (!nombre.trim()) return;

    const nuevo: Sabor = {
      id: modoEdicion && idEditando !== null ? idEditando : Date.now(),
      nombre: nombre.trim(),
      descripcion: descripcion.trim(),
      tipo,
    };

    if (modoEdicion) {
      setSabores(sabores.map(s => s.id === idEditando ? nuevo : s));
      setModoEdicion(false);
      setIdEditando(null);
    } else {
      setSabores([...sabores, nuevo]);
    }

    setNombre('');
    setDescripcion('');
    setTipo('Pizza');
  };

  const handleEditar = (sabor: Sabor) => {
    setModoEdicion(true);
    setIdEditando(sabor.id);
    setNombre(sabor.nombre);
    setDescripcion(sabor.descripcion);
    setTipo(sabor.tipo);
  };

  const handleEliminar = (id: number) => {
    setSabores(sabores.filter(s => s.id !== id));
  };

  return (
    <div className="min-h-screen bg-gray-50 flex">
      <HeaderAdmin />
      <div className="flex-1 overflow-auto">
        <Topbar title="Gestión de Sabores" />

        <main className="p-6 space-y-6">
          {/* Formulario */}
          <div className="bg-white p-6 rounded-lg shadow">
            <h2 className="text-xl font-bold mb-4">
              {modoEdicion ? 'Editar Sabor' : 'Agregar Sabor'}
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <input
                type="text"
                placeholder="Nombre del nuevo Sabor"
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

            <div className="mt-4 flex justify-end space-x-3">
              {modoEdicion && (
                <button
                  onClick={() => {
                    setModoEdicion(false);
                    setIdEditando(null);
                    setNombre('');
                    setDescripcion('');
                    setTipo('Pizza');
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
            <h2 className="text-xl font-bold mb-4">Lista de Sabores</h2>
            <table className="w-full table-auto">
              <thead>
                <tr className="bg-gray-100">
                  <th className="text-left px-4 py-2">Nombre</th>
                  <th className="text-left px-4 py-2">Descripción</th>
                  <th className="text-left px-4 py-2">Tipo</th>
                  <th className="text-left px-4 py-2">Acciones</th>
                </tr>
              </thead>
              <tbody>
                {sabores.map((sabor) => (
                  <tr key={sabor.id} className="border-t">
                    <td className="px-4 py-2">{sabor.nombre}</td>
                    <td className="px-4 py-2">{sabor.descripcion}</td>
                    <td className="px-4 py-2">{sabor.tipo}</td>
                    <td className="px-4 py-2 space-x-3">
                      <button
                        onClick={() => handleEditar(sabor)}
                        className="text-blue-600 hover:underline"
                      >
                        Editar
                      </button>
                      <button
                        onClick={() => handleEliminar(sabor.id)}
                        className="text-red-600 hover:underline"
                      >
                        Eliminar
                      </button>
                    </td>
                  </tr>
                ))}
                {sabores.length === 0 && (
                  <tr>
                    <td colSpan={4} className="px-4 py-4 text-center text-gray-500">
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
