// components/MenuNav.tsx
'use client';

import Link from "next/link";
import { usePathname } from "next/navigation";

export default function MenuNav() {
  const pathname = usePathname();

  // Mapea cada enlace con su path y nombre
  const navItems = [
    { name: "Pizzas", path: "/menu/pizzas" },
    { name: "Calzone", path: "/menu/calzone" },
    { name: "Pastas", path: "/menu/pastas" },
    { name: "Adicionales", path: "/menu/adicionales" },
    { name: "Promociones o Combos", path: "/menu/promos" },
  ];

  return (
    <nav className="grid grid-cols-3 sm:grid-cols-5 gap-2 p-2 text-center bg-gray-100 border-b border-gray-100 mt-3">
      {navItems.map(({ name, path }) => {
        const isActive = pathname === path;

        return (
          <Link
            key={path}
            href={path}
            className={`px-2 py-1 rounded-full text-sm transition 
              ${isActive 
                ? "bg-red-700 text-white font-semibold" 
                : "hover:bg-red-300 hover:text-white"} 
            `}
          >
            {name}
          </Link>
        );
      })}
    </nav>
  );
}
