'use client'

import { useState } from 'react'
import { ChevronDown } from 'lucide-react'

interface FilterButtonsProps {
  onChange: (
    value:
      | { filter: 'todos' }
      | { filter: 'tamanio'; selected: string } 
  ) => void
}

export default function FilterButtons({ onChange }: FilterButtonsProps) {
  const [activeFilter, setActiveFilter] = useState<'todos' | 'tamanio'>('todos')
  const [selectedValue, setSelectedValue] = useState('Regular')
  const [dropdownOpen, setDropdownOpen] = useState(false)

  const options = [
    { id: '1', label: 'Regular' },
    { id: '2', label: 'Mediana' },
    { id: '3', label: 'Grande' },
    { id: '4', label: 'Familiar' },
    { id: '5', label: 'Super Familiar' },
  ]

  const handleSelect = (value: string) => {
    setSelectedValue(value)
    setActiveFilter('tamanio')
    setDropdownOpen(false)
    onChange({ filter: 'tamanio', selected: value })
  }

  return (
    <div className="flex gap-3 flex-wrap">
      {/* Botón "Todos" */}
      <button
        onClick={() => {
          setActiveFilter('todos')
          setDropdownOpen(false)
          onChange({ filter: 'todos' })
        }}
        className={`px-4 py-2 rounded-full border font-medium transition text-sm sm:text-base ${
          activeFilter === 'todos'
            ? 'bg-red-600 text-white border-black'
            : 'bg-white text-black border-black hover:bg-[#DC0000]'
        }`}
      >
        Todos
      </button>

      {/* Botón desplegable "Tamaño" */}
      <div className="relative">
        <button
          onClick={() => {
            setDropdownOpen(!dropdownOpen)
            setActiveFilter('tamanio')
          }}
          className={`flex items-center gap-1 px-4 py-2 w-[140px] sm:w-[160px] rounded-full border font-medium transition text-sm sm:text-base ${
            activeFilter === 'tamanio'
              ? 'bg-red-600 text-white border-black'
              : 'bg-white text-black border-black hover:bg-[#DC0000]'
          }`}
          style={{ minWidth: '140px' }}
        >
          <span className="truncate">{selectedValue}</span>
          <ChevronDown size={16} />
        </button>

        {dropdownOpen && (
          <div className="absolute top-full mt-2 w-full bg-white border rounded shadow z-10">
            {options.map((opt) => (
              <button
                key={opt.id}
                onClick={() => handleSelect(opt.label)}
                className="w-full text-left px-4 py-2 hover:bg-[#DC0000] text-sm"
              >
                {opt.label}
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
