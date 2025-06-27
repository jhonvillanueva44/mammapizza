// components/MenuNav.tsx
'use client';

import Link from "next/link";
import { usePathname } from "next/navigation";

export default function MenuNav() {
  const pathname = usePathname();

  const navItems = [
    { name: "Pizzas", path: "/menu/pizzas" },
    { name: "Calzone", path: "/menu/calzone" },
    { name: "Pastas", path: "/menu/pastas" },
    { name: "Adicionales", path: "/menu/adicionales" },
    { name: "Promociones o Combos", path: "/menu/promos" },
  ];

  return (
    <nav className="relative">
      <div className="bg-gradient-to-r from-gray-50 to-gray-100 shadow-sm border-b border-gray-200/60 mt-3">
        <div className="px-4 py-4">
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3 max-w-6xl mx-auto">
            {navItems.map(({ name, path }) => {
              const isActive = pathname === path;

              return (
                <Link
                  key={path}
                  href={path}
                  className={`
                    relative px-4 py-3 rounded-xl text-sm font-medium 
                    transition-all duration-300 ease-in-out
                    transform hover:scale-105 hover:-translate-y-0.5
                    shadow-sm hover:shadow-md
                    ${isActive 
                      ? "bg-gradient-to-r from-red-600 to-red-700 text-white shadow-lg shadow-red-500/25 ring-2 ring-red-500/20" 
                      : "bg-white text-gray-700 hover:bg-gradient-to-r hover:from-red-100 hover:to-red-200 hover:text-red-800 border border-gray-200/50"
                    }
                  `}
                >
                  {isActive && (
                    <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent rounded-xl"></div>
                  )}
                  
                  <span className="relative z-10 block text-center leading-tight">
                    {name}
                  </span>
                  
                  {isActive && (
                    <div className="absolute -bottom-1 left-1/2 transform -translate-x-1/2 w-2 h-1 bg-red-300 rounded-full"></div>
                  )}
                </Link>
              );
            })}
          </div>
        </div>
        
        <div className="h-px bg-gradient-to-r from-transparent via-red-200 to-transparent"></div>
      </div>
    </nav>
  );
}