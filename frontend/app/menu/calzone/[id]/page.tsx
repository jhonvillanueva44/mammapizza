'use client'

import React, { useState, useEffect } from 'react'
import { use } from 'react'

const CalzoneDetailPage = ({ params: paramsPromise }: { params: Promise<{ id: string }> }) => {
  const params = use(paramsPromise)

  const [calzone, setCalzone] = useState<any>(null)
  const [tamanios, setTamanios] = useState<any[]>([])
  const [sabores, setSabores] = useState<any[]>([])
  const [agregados, setAgregados] = useState<any[]>([])
  const [tamaniosAgregados, setTamaniosAgregados] = useState<any[]>([])
  const [tamaniosSabores, setTamaniosSabores] = useState<any[]>([])

  const [tamanoSeleccionado, setTamanoSeleccionado] = useState<string>('')
  const [agregadosSeleccionados, setAgregadosSeleccionados] = useState<string[]>([])
  const [precioFinal, setPrecioFinal] = useState(0)
  const [saborPrincipalId, setSaborPrincipalId] = useState<string>('')

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [calzoneRes, tamaniosRes, saboresRes, agregadosRes, tamaniosAgregadosRes, tamaniosSaboresRes] = await Promise.all([
          fetch(`http://localhost:4000/api/productos/calzones/${params.id}`),
          fetch('http://localhost:4000/api/tamanios/calzone'),
          fetch('http://localhost:4000/api/sabores/calzone'),
          fetch('http://localhost:4000/api/sabores/agregado'),
          fetch('http://localhost:4000/api/tamanios/agregado'),
          fetch('http://localhost:4000/api/tamaniosabor'),
        ])

        const calzoneData = await calzoneRes.json()
        const tamaniosData = await tamaniosRes.json()
        const saboresData = await saboresRes.json()
        const agregadosData = await agregadosRes.json()
        const tamaniosAgregadosData = await tamaniosAgregadosRes.json()
        const tamaniosSaboresData = await tamaniosSaboresRes.json()

        setCalzone(calzoneData)
        setTamanios(tamaniosData)
        setSabores(saboresData)
        setAgregados(agregadosData)
        setTamaniosAgregados(tamaniosAgregadosData)
        setTamaniosSabores(tamaniosSaboresData)

        // Obtener datos principales del producto
        const tamanioId = calzoneData.unicos?.[0]?.tamanios_sabor?.tamanio?.id?.toString() || ''
        const saborId = calzoneData.unicos?.[0]?.tamanios_sabor?.sabor?.id?.toString() || ''
        const precioInicial = calzoneData.unicos?.[0]?.tamanios_sabor?.precio || '0'

        setTamanoSeleccionado(tamanioId)
        setSaborPrincipalId(saborId)
        setPrecioFinal(parseFloat(precioInicial))
        
        // Obtener agregados para el tamaño inicial
        actualizarPrecio(tamanioId, saborId, [], tamaniosData, tamaniosAgregadosData, tamaniosSaboresData)
      } catch (error) {
        console.error('Error al cargar los datos:', error)
      }
    }

    fetchData()
  }, [params.id])

  const onChangeTamano = (id: string) => {
    if (id === tamanoSeleccionado) return
    
    setTamanoSeleccionado(id)
    // Limpiar agregados al cambiar tamaño
    setAgregadosSeleccionados([])
    actualizarPrecio(id, saborPrincipalId, [], tamanios, tamaniosAgregados, tamaniosSabores)
  }

  const onChangeAgregado = (id: string) => {
    let nuevosAgregados = [...agregadosSeleccionados]
    if (nuevosAgregados.includes(id)) {
      nuevosAgregados = nuevosAgregados.filter(a => a !== id)
    } else {
      nuevosAgregados.push(id)
    }
    setAgregadosSeleccionados(nuevosAgregados)
    actualizarPrecio(tamanoSeleccionado, saborPrincipalId, nuevosAgregados, tamanios, tamaniosAgregados, tamaniosSabores)
  }

  const actualizarPrecio = (
    tamanoId: string,
    saborId: string,
    agregadosIds: string[],
    tamaniosData: any[],
    tamaniosAgregadosData: any[],
    tamaniosSaboresData: any[]
  ) => {
    // Precio base del calzone (tamaño + sabor principal)
    const combPrincipal = tamaniosSaboresData.find(
      (ts: any) =>
        ts.tamanio_id.toString() === tamanoId &&
        ts.sabor_id.toString() === saborId
    )
    const precioBase = combPrincipal ? parseFloat(combPrincipal.precio) : 0

    // Obtener el índice del tamaño de calzone seleccionado
    const indiceTamanoCalzone = tamaniosData.findIndex(t => t.id.toString() === tamanoId)
    
    // Obtener el tamaño de agregado correspondiente (mismo índice)
    const tamanoAgregadoCorrespondiente = tamaniosAgregadosData[indiceTamanoCalzone]
    const tamanoAgregadoId = tamanoAgregadoCorrespondiente?.id?.toString() || ''

    // Precio de los agregados usando el tamaño de agregado correspondiente
    const precioAgregados = agregadosIds.reduce((acc, aid) => {
      const combAgregado = tamaniosSaboresData.find(
        (ts: any) =>
          ts.tamanio_id.toString() === tamanoAgregadoId &&
          ts.sabor_id.toString() === aid
      )
      return acc + (combAgregado ? parseFloat(combAgregado.precio) : 0)
    }, 0)

    const nuevoPrecio = precioBase + precioAgregados
    if (nuevoPrecio > 0) {
      setPrecioFinal(nuevoPrecio)
    }
  }

  if (!calzone || !tamanios.length || !sabores.length || !tamaniosSabores.length || !tamaniosAgregados.length) {
    return <div>Cargando...</div>
  }

  // Obtener nombre del sabor principal
  const nombreSaborPrincipal = sabores.find(s => s.id.toString() === saborPrincipalId)?.nombre || ''

  // Obtener el índice del tamaño de calzone seleccionado
  const indiceTamanoCalzone = tamanios.findIndex(t => t.id.toString() === tamanoSeleccionado)
  
  // Obtener el tamaño de agregado correspondiente (mismo índice)
  const tamanoAgregadoCorrespondiente = tamaniosAgregados[indiceTamanoCalzone]
  const tamanoAgregadoId = tamanoAgregadoCorrespondiente?.id?.toString() || ''

  // Filtrar agregados disponibles para el tamaño de agregado correspondiente
  const agregadosDisponibles = agregados.filter(a => {
    return tamaniosSabores.some(
      (ts: any) =>
        ts.tamanio_id.toString() === tamanoAgregadoId &&
        ts.sabor_id.toString() === a.id.toString()
    )
  })

  return (
    <div className="font-[Poppins]">
      <div className="w-full bg-red-600 text-white py-4 px-6 mt-20 shadow-lg">
        <h1 className="text-2xl sm:text-3xl font-extrabold tracking-wide">🥟 Personalizar Calzone</h1>
      </div>

      <div className="flex flex-col md:flex-row gap-6 p-4 sm:p-6">
        <div className="w-full md:w-1/2 flex flex-col items-center">
          <img
            src={calzone.imagen}
            alt={calzone.nombre}
            className="w-full max-w-sm rounded-xl shadow-xl object-cover"
          />
          <h2 className="mt-5 text-3xl font-bold text-center text-[#333]">
            Calzone {nombreSaborPrincipal || calzone.nombre}
          </h2>
          <p className="text-2xl font-bold text-red-600 mt-4">${precioFinal.toFixed(2)}</p>
        </div>

        <div className="w-full md:w-1/2 flex flex-col gap-6 bg-[#FDFDFD] p-4 rounded-xl border-2 border-red-500 shadow-sm">
          <div>
            <h3 className="text-md font-semibold mb-2 text-gray-800">Tamaño:</h3>
            <div className="flex flex-col gap-2">
              {tamanios.map((t) => (
                <label key={t.id} className="flex items-center gap-3 bg-white px-3 py-2 rounded-lg border border-gray-200 cursor-pointer">
                  <input
                    type="radio"
                    name="tamano"
                    value={t.id}
                    checked={tamanoSeleccionado === t.id.toString()}
                    onChange={() => onChangeTamano(t.id.toString())}
                    className="accent-red-600 w-4 h-4"
                  />
                  <span className="text-gray-700 text-sm">{t.nombre}</span>
                </label>
              ))}
            </div>
          </div>

          <div>
            <h3 className="text-md font-semibold mb-2 text-gray-800">Sabor Principal:</h3>
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
                  <span className="text-xs text-gray-500 ml-1">(Obligatorio)</span>
                </span>
              </label>
            </div>
          </div>

          {agregadosDisponibles.length > 0 && (
            <div>
              <h3 className="text-md font-semibold mb-2 text-gray-800">Agregados:</h3>
              <div className="flex flex-col gap-2">
                {agregadosDisponibles.map((a) => {
                  const aid = a.id.toString()
                  const checked = agregadosSeleccionados.includes(aid)
                  const combAgregado = tamaniosSabores.find(
                    (ts: any) =>
                      ts.tamanio_id.toString() === tamanoAgregadoId &&
                      ts.sabor_id.toString() === aid
                  )
                  const precioAgregado = combAgregado ? parseFloat(combAgregado.precio).toFixed(2) : '0.00'

                  return (
                    <label key={aid} className="flex items-center gap-3 bg-white px-3 py-2 rounded-lg border border-gray-200">
                      <input
                        type="checkbox"
                        name="agregado"
                        value={aid}
                        checked={checked}
                        onChange={() => onChangeAgregado(aid)}
                        className="accent-red-600 w-4 h-4"
                      />
                      <span className="text-sm text-gray-700">{a.nombre} (+${precioAgregado})</span>
                    </label>
                  )
                })}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default CalzoneDetailPage