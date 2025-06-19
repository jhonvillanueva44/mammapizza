'use client'

import React, { useState, useEffect } from 'react'
import { use } from 'react'

// Interfaces para tipar correctamente
interface Tamanio {
  id: number
  nombre: string
}

interface Sabor {
  id: number
  nombre: string
}

interface TamanioSabor {
  id: number
  tamanio_id: number
  sabor_id: number
  precio: string
}

interface Pasta {
  id: number
  nombre: string
  imagen: string
  unicos?: Array<{
    tamanios_sabor: {
      tamanio: { id: number }
      sabor: { id: number }
      precio: string
    }
  }>
}

const PastaDetailPage = ({ params: paramsPromise }: { params: Promise<{ id: string }> }) => {
  const params = use(paramsPromise)

  const [pasta, setPasta] = useState<Pasta | null>(null)
  const [tamanios, setTamanios] = useState<Tamanio[]>([])
  const [sabores, setSabores] = useState<Sabor[]>([])
  const [tamaniosSabores, setTamaniosSabores] = useState<TamanioSabor[]>([])

  const [tamanoSeleccionado, setTamanoSeleccionado] = useState<string>('')
  const [precioFinal, setPrecioFinal] = useState(0)
  const [saborPrincipalId, setSaborPrincipalId] = useState<string>('')
  const [esLazagna, setEsLazagna] = useState<boolean>(false)
  const [tamaniosDisponibles, setTamaniosDisponibles] = useState<Tamanio[]>([])

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [pastaRes, tamaniosRes, saboresRes, tamaniosSaboresRes] = await Promise.all([
          fetch(`http://localhost:4000/api/productos/pastas/${params.id}`),
          fetch('http://localhost:4000/api/tamanios/pasta'),
          fetch('http://localhost:4000/api/sabores/pasta'),
          fetch('http://localhost:4000/api/tamaniosabor'),
        ])

        const pastaData = await pastaRes.json()
        const tamaniosData = await tamaniosRes.json()
        const saboresData = await saboresRes.json()
        const tamaniosSaboresData = await tamaniosSaboresRes.json()

        setPasta(pastaData)
        setTamanios(tamaniosData)
        setSabores(saboresData)
        setTamaniosSabores(tamaniosSaboresData)

        // Obtener datos principales del producto
        const tamanioId = pastaData.unicos?.[0]?.tamanios_sabor?.tamanio?.id?.toString() || ''
        const saborId = pastaData.unicos?.[0]?.tamanios_sabor?.sabor?.id?.toString() || ''
        const precioInicial = pastaData.unicos?.[0]?.tamanios_sabor?.precio || '0'

        // Buscar el ID del tamaño 'Lazagna'
        const tamanoLazagna = tamaniosData.find((t: Tamanio) => t.nombre.toLowerCase() === 'lazagna')
        const idLazagna = tamanoLazagna?.id?.toString() || ''

        // Verificar si el producto tiene el tamaño Lazagna
        const tieneIdLazagna = tamanioId === idLazagna

        // Determinar tamaños disponibles
        let tamaniosParaMostrar: Tamanio[] = []
        if (tieneIdLazagna) {
          // Si tiene Lazagna, solo mostrar ese tamaño
          tamaniosParaMostrar = tamaniosData.filter((t: Tamanio) => t.id.toString() === idLazagna)
          setEsLazagna(true)
        } else {
          // Si no tiene Lazagna, mostrar todos menos Lazagna
          tamaniosParaMostrar = tamaniosData.filter((t: Tamanio) => t.id.toString() !== idLazagna)
          setEsLazagna(false)
        }

        setTamaniosDisponibles(tamaniosParaMostrar)
        setTamanoSeleccionado(tamanioId)
        setSaborPrincipalId(saborId)
        setPrecioFinal(parseFloat(precioInicial))
        
        // Actualizar precio inicial
        actualizarPrecio(tamanioId, saborId, tamaniosSaboresData)
      } catch (error) {
        console.error('Error al cargar los datos:', error)
      }
    }

    fetchData()
  }, [params.id])

  const onChangeTamano = (id: string) => {
    if (id === tamanoSeleccionado || esLazagna) return
    
    setTamanoSeleccionado(id)
    actualizarPrecio(id, saborPrincipalId, tamaniosSabores)
  }

  const actualizarPrecio = (
    tamanoId: string,
    saborId: string,
    tamaniosSaboresData: TamanioSabor[]
  ) => {
    // Precio base de la pasta (tamaño + sabor principal)
    const combPrincipal = tamaniosSaboresData.find(
      (ts: TamanioSabor) =>
        ts.tamanio_id.toString() === tamanoId &&
        ts.sabor_id.toString() === saborId
    )
    const precioBase = combPrincipal ? parseFloat(combPrincipal.precio) : 0

    if (precioBase > 0) {
      setPrecioFinal(precioBase)
    }
  }

  if (!pasta || !tamanios.length || !sabores.length || !tamaniosSabores.length || !tamaniosDisponibles.length) {
    return <div>Cargando...</div>
  }

  // Obtener nombre del sabor principal
  const nombreSaborPrincipal = sabores.find(s => s.id.toString() === saborPrincipalId)?.nombre || ''

  // Determinar el título a mostrar
  const tituloProducto = esLazagna ? pasta.nombre : `Pasta ${nombreSaborPrincipal || pasta.nombre}`

  return (
    <div className="font-[Poppins]">
      <div className="w-full bg-red-600 text-white py-4 px-6 mt-20 shadow-lg">
        <h1 className="text-2xl sm:text-3xl font-extrabold tracking-wide">🍝 Personalizar Pasta</h1>
      </div>

      <div className="flex flex-col md:flex-row gap-6 p-4 sm:p-6">
        <div className="w-full md:w-1/2 flex flex-col items-center">
          <img
            src={pasta.imagen}
            alt={pasta.nombre}
            className="w-full max-w-sm rounded-xl shadow-xl object-cover"
          />
          <h2 className="mt-5 text-3xl font-bold text-center text-[#333]">
            {tituloProducto}
          </h2>
          <p className="text-2xl font-bold text-red-600 mt-4">${precioFinal.toFixed(2)}</p>
        </div>

        <div className="w-full md:w-1/2 flex flex-col gap-6 bg-[#FDFDFD] p-4 rounded-xl border-2 border-red-500 shadow-sm">
          <div>
            <h3 className="text-md font-semibold mb-2 text-gray-800">Tamaño:</h3>
            <div className="flex flex-col gap-2">
              {tamaniosDisponibles.map((t: Tamanio) => (
                <label key={t.id} className={`flex items-center gap-3 px-3 py-2 rounded-lg border ${
                  esLazagna 
                    ? 'border-red-300 bg-red-50 cursor-default' 
                    : 'bg-white border-gray-200 cursor-pointer'
                }`}>
                  <input
                    type="radio"
                    name="tamano"
                    value={t.id}
                    checked={tamanoSeleccionado === t.id.toString()}
                    onChange={() => onChangeTamano(t.id.toString())}
                    disabled={esLazagna}
                    className="accent-red-600 w-4 h-4"
                  />
                  <span className="text-gray-700 text-sm">
                    {t.nombre}
                    {esLazagna && <span className="text-xs text-gray-500 ml-1">(Tamaño fijo)</span>}
                  </span>
                </label>
              ))}
            </div>
          </div>

          <div>
            <h3 className="text-md font-semibold mb-2 text-gray-800">Sabor:</h3>
            <div className="flex flex-col gap-2">
              <label className="flex items-center gap-3 px-3 py-2 rounded-lg border border-red-300 bg-red-50">
                <input
                  type="radio"
                  name="saborPrincipal"
                  checked={true}
                  readOnly
                  className="accent-red-600 w-4 h-4 cursor-default"
                />
                <span className="text-sm text-gray-700">
                  {nombreSaborPrincipal}
                  <span className="text-xs text-gray-500 ml-1">(Sabor fijo)</span>
                </span>
              </label>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default PastaDetailPage