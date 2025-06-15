'use client';

import { useState, useEffect } from 'react';
import HeaderAdmin from '@/components/adminComponents/HeaderAdmin';
import Topbar from '@/components/adminComponents/Topbar';
import Alert from '@/components/adminComponents/Alert';
import ConfirmationModal from '@/components/adminComponents/ConfirmationModal';
import LoadingSpinner from '@/components/adminComponents/LoadingSpinner';
import TamanioSaborModal from '@/adminModals/ModalFormularioTamanioSabor';

export type TamanioSabor = {
  id: number;
  precio: number;
  tamanio_id: number;
  sabor_id: number;
  tamanio?: { id: number; nombre: string };
  sabor?: { id: number; nombre: string };
};

export type Tamanio = { id: number; nombre: string };
export type Sabor = { id: number; nombre: string };

export default function CrudTamanioSaborPage() {
  const [data, setData] = useState<TamanioSabor[]>([]);
  const [tamanios, setTamanios] = useState<Tamanio[]>([]);
  const [sabores, setSabores] = useState<Sabor[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [editingItem, setEditingItem] = useState<TamanioSabor | null>(null);
  const [modalAbierto, setModalAbierto] = useState(false);
  const [confirmarEliminar, setConfirmarEliminar] = useState(false);
  const [idEliminar, setIdEliminar] = useState<number | null>(null);
  const [filtroTamanio, setFiltroTamanio] = useState('');
  const [busqueda, setBusqueda] = useState('');
  const [pagina, setPagina] = useState(1);
  const ITEMS_POR_PAGINA = 15;

  const API_BASE_URL = 'http://localhost:4000/api/tamanioSabor';

  const obtenerDatos = async () => {
    try {
      setLoading(true);
      const [resComb, resTam, resSab] = await Promise.all([
        fetch(`${API_BASE_URL}?include=tamanio,sabor`),
        fetch('http://localhost:4000/api/tamanios'),
        fetch('http://localhost:4000/api/sabores')
      ]);
      const [combinaciones, tamaniosList, saboresList] = await Promise.all([
        resComb.json(),
        resTam.json(),
        resSab.json()
      ]);
      setData(combinaciones);
      setTamanios(tamaniosList);
      setSabores(saboresList);
    } catch (e: any) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    obtenerDatos();
  }, []);

  useEffect(() => {
    setPagina(1);
  }, [filtroTamanio, busqueda]);

  const datosFiltrados = data.filter(item => {
    const coincideTamanio = filtroTamanio ? item.tamanio?.id === Number(filtroTamanio) : true;
    const texto = busqueda.toLowerCase();
    const coincideBusqueda = item.sabor?.nombre.toLowerCase().includes(texto) || item.precio.toString().includes(texto);
    return coincideTamanio && coincideBusqueda;
  });

  const totalPaginas = Math.ceil(datosFiltrados.length / ITEMS_POR_PAGINA);
  const datosPagina = datosFiltrados.slice((pagina - 1) * ITEMS_POR_PAGINA, pagina * ITEMS_POR_PAGINA);

  const handleGuardarExito = (msg: string) => {
    setSuccess(msg);
    setModalAbierto(false);
    obtenerDatos();
  };

  const handleEditar = (item: TamanioSabor) => {
    setEditingItem(item);
    setModalAbierto(true);
  };

  const handleEliminar = (id: number) => {
    setIdEliminar(id);
    setConfirmarEliminar(true);
  };

  const confirmarEliminacion = async () => {
    if (!idEliminar) return;
    try {
      setLoading(true);
      const res = await fetch(`${API_BASE_URL}/${idEliminar}`, { method: 'DELETE' });
      if (!res.ok) throw new Error('Error al eliminar');
      setSuccess('Combinación eliminada correctamente');
      obtenerDatos();
    } catch (e: any) {
      setError(e.message);
    } finally {
      setLoading(false);
      setConfirmarEliminar(false);
      setIdEliminar(null);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex">
      <HeaderAdmin />

      <div className="flex-1 overflow-auto">
        <Topbar title="Gestión de Combinaciones Tamaño-Sabor" />

        <main className="p-6 space-y-6">
          {error && <Alert message={error} onClose={() => setError(null)} type="error" />}
          {success && <Alert message={success} onClose={() => setSuccess(null)} type="success" />}

          <ConfirmationModal
            isOpen={confirmarEliminar}
            onClose={() => setConfirmarEliminar(false)}
            onConfirm={confirmarEliminacion}
            title="Confirmar eliminación"
            message="¿Estás seguro de que deseas eliminar esta combinación?"
            confirmText="Eliminar"
          />

          <div className="bg-white p-6 rounded shadow">
            <div className="flex flex-wrap justify-between items-center gap-4 mb-4">
              <select
                className="border border-gray-300 rounded px-3 py-2"
                value={filtroTamanio}
                onChange={(e) => setFiltroTamanio(e.target.value)}
              >
                <option value="">Todos los tamaños</option>
                {tamanios.map((t) => (
                  <option key={t.id} value={t.id}>{t.nombre}</option>
                ))}
              </select>

              <input
                type="text"
                placeholder="Buscar por sabor o precio..."
                className="border border-gray-300 rounded px-3 py-2 flex-1"
                value={busqueda}
                onChange={(e) => setBusqueda(e.target.value)}
              />

              <button
                className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700"
                onClick={() => {
                  setEditingItem(null);
                  setModalAbierto(true);
                }}
              >
                Agregar Combinación
              </button>
            </div>

            {loading ? (
              <div className="flex justify-center py-8">
                <LoadingSpinner size={8} />
              </div>
            ) : (
              <>
                <div className="overflow-x-auto">
                  <table className="w-full table-fixed">
                <thead>
                  <tr className="bg-gray-100">
                    <th className="px-4 py-2 text-left w-1/4">Tamaño</th>
                    <th className="px-4 py-2 text-left w-1/4">Sabor</th>
                    <th className="px-4 py-2 text-left w-1/4">Precio</th>
                    <th className="px-4 py-2 text-left w-1/4">Acciones</th>
                  </tr>
                </thead>
                    <tbody>
                      {datosPagina.map((item) => (
                        <tr key={item.id} className="border-t">
                          <td className="px-4 py-2 truncate">{item.tamanio?.nombre}</td>
                              <td className="px-4 py-2 truncate">{item.sabor?.nombre}</td>
                              <td className="px-4 py-2">${Number(item.precio).toFixed(2)}</td>
                              <td className="px-4 py-2 space-x-2">
                            <button
                              className="text-blue-600 hover:text-blue-800"
                              onClick={() => handleEditar(item)}
                            >
                              Editar
                            </button>
                            <button
                              className="text-red-600 hover:text-red-800"
                              onClick={() => handleEliminar(item.id)}
                            >
                              Eliminar
                            </button>
                          </td>
                        </tr>
                      ))}
                      {datosPagina.length === 0 && (
                        <tr>
                          <td colSpan={4} className="text-center py-4 text-gray-500">
                            No hay combinaciones registradas.
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>

                {totalPaginas > 1 && (
                  <div className="flex justify-center mt-4 space-x-2">
                    {Array.from({ length: totalPaginas }, (_, i) => (
                      <button
                        key={i}
                        className={`px-3 py-1 rounded border ${
                          pagina === i + 1
                            ? 'bg-red-600 text-white border-red-600'
                            : 'border-gray-300 text-gray-700 hover:bg-gray-100'
                        }`}
                        onClick={() => setPagina(i + 1)}
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

      <TamanioSaborModal
        isOpen={modalAbierto}
        onClose={() => setModalAbierto(false)}
        tamanios={tamanios}
        sabores={sabores}
        editingItem={editingItem}
        onSubmitSuccess={handleGuardarExito}
        onError={(msg) => setError(msg)}
        setLoading={setLoading}
      />
    </div>
  );
}