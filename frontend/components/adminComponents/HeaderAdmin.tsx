'use client';

import { usePathname, useRouter } from 'next/navigation';

const menuItems = [
  { label: 'Dashboard', path: '/admin/dashboard' },
  { label: 'Tamaños', path: '/admin/tamanio' },
  { label: 'Sabores', path: '/admin/sabores' },
  { label: 'Categorias', path: '/admin/categorias' },
  { label: 'Productos', path: '/admin/productos' },
  { label: 'Carta', path: '/admin/tamanioSabor' },
  { label: 'Promociones', path: '/admin/promociones' },

];

export default function HeaderAdmin() {
  const router = useRouter();
  const pathname = usePathname();

  return (
    <div className="w-64 bg-[#1A2226] text-white">
      <div className="p-4 border-b border-[#2C3E50] flex items-center">
        <span className="text-2xl mr-2">🍕</span>
        <h1 className="text-xl font-bold">MammaPizza</h1>
      </div>

      <nav className="p-4">
        <ul className="space-y-2">
          {menuItems.map((item) => (
            <li key={item.path}>
              <button
                onClick={() => router.push(item.path)}
                className={`w-full cursor-pointer text-left px-4 py-2 rounded-md transition-colors ${
                  pathname === item.path ? 'bg-red-600 text-white' : 'text-gray-300 hover:bg-[#2C3E50]'
                }`}
              >
                {item.label}
              </button>
            </li>
          ))}
        </ul>
      </nav>
    </div>
  );
}
