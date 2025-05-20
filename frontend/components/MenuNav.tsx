import Link from "next/link";

export default function MenuNav() {
  return (
    <nav className="grid grid-cols-3 sm:grid-cols-5 gap-2 p-2 text-center bg-gray-50 border-b border-gray-200">
      <Link href="/menu/pizzas" className="px-2 py-1 rounded-full text-sm hover:bg-red-100 hover:text-red-600 transition">Pizzas</Link>
      <Link href="/menu/calzone" className="px-2 py-1 rounded-full text-sm hover:bg-red-100 hover:text-red-600 transition">Calzone</Link>
      <Link href="/menu/pastas" className="px-2 py-1 rounded-full text-sm hover:bg-red-100 hover:text-red-600 transition">Pastas</Link>
      <Link href="/menu/adicionales" className="px-2 py-1 rounded-full text-sm hover:bg-red-100 hover:text-red-600 transition">Adicionales</Link>
      <Link href="/menu/promos" className="px-2 py-1 rounded-full text-sm hover:bg-red-100 hover:text-red-600 transition">Promociones o Combos</Link>
    </nav>
  );
}
