'use client'

import { useState } from 'react'
import { ChevronDown } from 'lucide-react'

interface FilterButtonsProps {
  onChange: (value: { filter: 'todos' | 'personas'; selected?: string }) => void
}

export default function FilterButtons({ onChange }: FilterButtonsProps) {
  const [activeFilter, setActiveFilter] = useState<'todos' | 'personas'>('todos')
  const [selectedValue, setSelectedValue] = useState('1')
  const [dropdownOpen, setDropdownOpen] = useState(false)

  const options = ['1', '2', '3', '+5']

  const handleSelect = (value: string) => {
    setSelectedValue(value)
    setActiveFilter('personas')
    setDropdownOpen(false)
    onChange({ filter: 'personas', selected: value })
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

      {/* Botón desplegable "Personas" */}
      <div className="relative">
        <button
          onClick={() => {
            setDropdownOpen(!dropdownOpen)
            setActiveFilter('personas')
          }}
          className={`flex items-center gap-1 px-4 py-2 w-[88px] sm:w-[100px] rounded-full border font-medium transition text-sm sm:text-base ${
            activeFilter === 'personas'
              ? 'bg-red-600 text-white border-black'
              : 'bg-white text-black border-black hover:bg-[#DC0000]'
          }`}
          style={{ minWidth: '88px' }}
        >
          <span className="truncate">👤 {selectedValue}</span>
          <ChevronDown size={16} />
        </button>

        {dropdownOpen && (
          <div className="absolute top-full mt-2 w-full bg-white border rounded shadow z-10">
            {options.map((opt) => (
              <button
                key={opt}
                onClick={() => handleSelect(opt)}
                className="w-full text-left px-4 py-2 hover:bg-[#DC0000] text-sm"
              >
                {opt}
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
