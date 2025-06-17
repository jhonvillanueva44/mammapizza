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
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [modoEdicion, setModoEdicion] = useState(false);
  const [idEditando, setIdEditando] = useState<number | null>(null);
  const [mostrarConfirmacion, setMostrarConfirmacion] = useState(false);
  const [idAEliminar, setIdAEliminar] = useState<number | null>(null);

  const API_URL = 'http://localhost:4000/api/categorias';

  

  return (
    <div className="min-h-screen flex bg-gray-50">
      <HeaderAdmin />

      <div className="flex-1 overflow-auto min-w-0">
        <Topbar title="Gestión de Promoción" />

        <main className="p-6 space-y-6">
            <h1>MU HA HA HA</h1>
        </main>
      </div>

    </div>
  );
}