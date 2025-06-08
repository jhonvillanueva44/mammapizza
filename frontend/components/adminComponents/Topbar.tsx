'use client';

import { useRouter } from 'next/navigation';

export default function Topbar({ title }: { title: string }) {
  const router = useRouter();

  return (
    <header className="bg-white shadow-sm">
      <div className="flex justify-between items-center px-6 py-4">
        <h2 className="text-xl font-semibold text-gray-800">{title}</h2>
        <div className="flex items-center space-x-4">
          <span className="text-gray-600">Admin</span>
          <button
            onClick={() => router.push('/admin/login')}
            className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-md transition-colors"
          >
            Cerrar Sesión
          </button>
        </div>
      </div>
    </header>
  );
}
