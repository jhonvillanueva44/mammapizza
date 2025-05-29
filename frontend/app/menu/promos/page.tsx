'use client'
import Link from "next/link";
import FilterButtons from '@/components/Btn-ctnd-pers'
import ProductoCard from "@/components/ProductoCard";


export default function MenuPromosPage() {
  const handleFilterChange = (value: { filter: 'todos' | 'personas'; selected?: string }) => {
    console.log('Filtro aplicado:', value)
  }
  return (
    <div className="min-h-screen p-6 sm:p-10 font-[var(--font-geist-sans)]">
      <div className="flex flex-col items-start gap-4 max-w-[300px]">
        <h1 className="text-2xl font-bold">Menú - Promociones</h1>
        <FilterButtons onChange={handleFilterChange} />

      </div>
    </div>
  )
}
