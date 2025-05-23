import Link from "next/link";

export default function DesayunosNav() {
  return (
    <nav className="grid grid-cols-3 sm:grid-cols-6 gap-2 p-2 text-center bg-gray-100 border-b border-gray-100 mt-3">
      <Link href="/desayunos/bebidascalientes" className="px-2 py-1 rounded-full text-sm hover:bg-[#DC0000] hover:text-white transition">Bebidas Calientes</Link>
      <Link href="/desayunos/jugos" className="px-2 py-1 rounded-full text-sm hover:bg-[#DC0000] hover:text-white transition">Jugos</Link>
      <Link href="/desayunos/batidos" className="px-2 py-1 rounded-full text-sm hover:bg-[#DC0000] hover:text-white transition">Batidos</Link>
      <Link href="/desayunos/sandwiches" className="px-2 py-1 rounded-full text-sm hover:bg-[#DC0000] hover:text-white transition">Sandwiches</Link>
      <Link href="/desayunos/combos" className="px-2 py-1 rounded-full text-sm hover:bg-[#DC0000] hover:text-white transition">Combos</Link>
      <Link href="/desayunos/agregados" className="px-2 py-1 rounded-full text-sm hover:bg-[#DC0000] hover:text-white transition">Agregados</Link>
    </nav>
  );
}
