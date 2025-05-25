'use client'

import FilterButtons from '@/components/btn-ctnd-pers'

export default function MenuPage() {
  const handleFilterChange = (value: { filter: 'todos' | 'personas'; selected?: string }) => {
    console.log('Filtro aplicado:', value)
    // Aquí puedes aplicar lógica para mostrar resultados según el filtro
  }

  return (
    <div className="min-h-screen p-6 sm:p-10 font-[var(--font-geist-sans)]">
      <div className="flex flex-col items-start gap-4 max-w-[300px]">
        <h1 className="text-2xl font-bold">Menu Principal</h1>
        <FilterButtons onChange={handleFilterChange} />
      </div>
    </div>
  )
}
