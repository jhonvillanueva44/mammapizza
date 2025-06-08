'use client';

import Link from "next/link";
import { usePathname } from "next/navigation";

export default function DesayunosNav() {
  const pathname = usePathname();

  const navItems = [
    { name: "Bebidas Calientes", path: "/desayunos/bebidascalientes" },
    { name: "Jugos", path: "/desayunos/jugos" },
    { name: "Batidos", path: "/desayunos/batidos" },
    { name: "Sandwiches", path: "/desayunos/sandwiches" },
    { name: "Combos", path: "/desayunos/combos" },
    { name: "Agregados", path: "/desayunos/agregados" },
  ];

  return (
    <nav className="grid grid-cols-3 sm:grid-cols-6 gap-2 p-2 text-center bg-gray-100 border-b border-gray-100 mt-3">
      {navItems.map(({ name, path }) => {
        const isActive = pathname === path;
        return (
          <Link
            key={path}
            href={path}
            className={`px-2 py-1 rounded-full text-sm transition
              ${isActive
                ? "bg-red-700 text-white font-semibold"
                : "hover:bg-red-300 hover:text-white"
              }`}
          >
            {name}
          </Link>
        );
      })}
    </nav>
  );
}
