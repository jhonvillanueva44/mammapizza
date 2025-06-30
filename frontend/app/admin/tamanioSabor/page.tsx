'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import HeaderAdmin from '@/components/adminComponents/HeaderAdmin';
import Topbar from '@/components/adminComponents/Topbar';
import Alert from '@/components/adminComponents/Alert';
import ConfirmationModal from '@/components/adminComponents/ConfirmationModal';
import LoadingSpinner from '@/components/adminComponents/LoadingSpinner';
import TamanioSaborModal from '@/adminModals/ModalFormularioTamanioSabor';
import ProtectedRoute from '@/components/adminComponents/ProtectedRoute';

export type Tamanio = { 
  id: number; 
  nombre: string; 
  tipo: string; 
};

export type Sabor = { 
  id: number; 
  nombre: string; 
  tipo: string; 
};

export type TamanioSabor = {
  id?: number;  
  precio: number;
  tamanio_id: number;
  sabor_id: number;
  tamanio?: Tamanio;
  sabor?: Sabor;    
};

const backendUrl = process.env.NEXT_PUBLIC_BACK_HOST;

export default function CrudTamanioSaborPage() {
  const [user, setUser] = useState<any>(null);
  const router = useRouter();
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

  const API_BASE_URL = `${backendUrl}api/tamanioSabor`;

  const obtenerDatos = async () => {
    try {
      setLoading(true);
      const [resComb, resTam, resSab] = await Promise.all([
        fetch(`${API_BASE_URL}?include=tamanio,sabor`),
        fetch(`${backendUrl}api/tamanios`),
        fetch(`${backendUrl}api/sabores`)
      ]);
      
      if (!resComb.ok || !resTam.ok || !resSab.ok) {
        throw new Error('Error al obtener los datos');
      }

      const [combinaciones, tamaniosList, saboresList] = await Promise.all([
        resComb.json(),
        resTam.json(),
        resSab.json()
      ]);

      setData(combinaciones);
      setTamanios(tamaniosList);
      setSabores(
        saboresList.map((s: any) => ({
          id: s.id,
          nombre: s.nombre,
          tipo: s.tipo ?? '', 
        }))
      );
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
    const coincideBusqueda = item.sabor?.nombre.toLowerCase().includes(texto) || 
                           item.tamanio?.nombre.toLowerCase().includes(texto) ||
                           item.tamanio?.tipo.toLowerCase().includes(texto) ||
                           item.precio.toString().includes(texto);
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
    <ProtectedRoute>
      <div className="min-h-screen flex bg-gray-50">
        <HeaderAdmin />

        <div className="flex-1 overflow-auto min-w-0">
          <Topbar title="Gestión de Carta" />

          <main className="p-6 space-y-6">
            {error && <Alert message={error} onClose={() => setError(null)} type="error" />}
            {success && <Alert message={success} onClose={() => setSuccess(null)} type="success" />}

            <ConfirmationModal
              message="¿Estás seguro de eliminar esta combinación?"
              isOpen={confirmarEliminar}
              onClose={() => setConfirmarEliminar(false)}
              onConfirm={confirmarEliminacion}
              title="Confirmar eliminación"
            />

            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-semibold text-gray-800">Listado de Carta</h2>
              <button
                onClick={() => {
                  setEditingItem(null);
                  setModalAbierto(true);
                }}
                className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-md shadow-sm transition-colors duration-200 flex items-center gap-2 cursor-pointer"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M10 5a1 1 0 011 1v3h3a1 1 0 110 2h-3v3a1 1 0 11-2 0v-3H6a1 1 0 110-2h3V6a1 1 0 011-1z" clipRule="evenodd" />
                </svg>
                Agregar Carta
              </button>
            </div>

            <div className="flex flex-wrap gap-4 mb-6">
              <select
                className="border border-gray-300 rounded-md px-3 py-2 shadow-sm focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-red-500 cursor-pointer"
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
                placeholder="Buscar por sabor, tamaño, tipo o precio..."
                className="border border-gray-300 rounded-md px-3 py-2 shadow-sm focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-red-500 flex-1 min-w-[200px]"
                value={busqueda}
                onChange={(e) => setBusqueda(e.target.value)}
              />
            </div>

            <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
              {loading && data.length === 0 ? (
                <div className="flex justify-center py-12">
                  <LoadingSpinner size={10} />
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Tipo
                        </th>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Tamaño
                        </th>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Sabor
                        </th>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Precio
                        </th>
                        
                        <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Acciones
                        </th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {datosPagina.map((item) => (
                        <tr key={item.id} className="hover:bg-gray-50 transition-colors">
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="text-sm font-medium text-gray-900">{item.tamanio?.tipo}</div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="text-sm font-medium text-gray-900">{item.tamanio?.nombre}</div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="text-sm text-gray-900">{item.sabor?.nombre}</div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="text-sm text-gray-900">S/.{Number(item.precio).toFixed(2)}</div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                            <div className="flex justify-end space-x-3">
                              <button
                                onClick={() => handleEditar(item)}
                                className="text-indigo-600 hover:text-indigo-900 transition-colors cursor-pointer"
                                disabled={loading}
                              >
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                                  <path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z" />
                                </svg>
                              </button>
                              <button
                                onClick={() => handleEliminar(item.id!)} 
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
                      {datosPagina.length === 0 && !loading && (
                        <tr>
                          <td colSpan={5} className="px-6 py-8 text-center">
                            <div className="flex flex-col items-center justify-center text-gray-500">
                              <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 opacity-50 mb-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                              </svg>
                              <p className="text-lg font-medium">No hay combinaciones registradas</p>
                              <p className="text-sm mt-1">Comienza agregando una nueva combinación</p>
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
              <div className="flex justify-center mt-4">
                <nav className="inline-flex rounded-md shadow-sm -space-x-px" aria-label="Pagination">
                  <button
                    onClick={() => setPagina(p => Math.max(1, p - 1))}
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
                    onClick={() => setPagina(p => Math.min(totalPaginas, p + 1))}
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
      </ProtectedRoute>
  );
}