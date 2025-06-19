//calzone
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
    return (
      <div className="min-h-screen bg-gradient-to-br from-orange-50 to-red-50 flex items-center justify-center">
        <div className="bg-white rounded-2xl shadow-2xl p-8 text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-4 border-red-500 border-t-transparent mx-auto mb-4"></div>
          <p className="text-gray-600 text-lg font-medium">Cargando tu calzone perfecto...</p>
        </div>
      </div>
    )
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
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-red-50 to-yellow-50 font-[Poppins]">
      {/* Header */}
      <div className="relative w-full bg-gradient-to-r from-red-600 via-red-700 to-orange-600 text-white py-8 px-6 mt-20 shadow-2xl overflow-hidden">
        <div className="absolute inset-0 bg-black/10"></div>
        <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -translate-y-16 translate-x-16"></div>
        <div className="absolute bottom-0 left-0 w-24 h-24 bg-white/5 rounded-full translate-y-12 -translate-x-12"></div>
        <div className="relative z-10">
          <h1 className="text-3xl sm:text-4xl font-extrabold tracking-wide flex items-center gap-3">
            <span className="text-4xl">🥟</span>
            Personalizar Calzone
          </h1>
          <p className="text-red-100 mt-2 text-lg">Crea tu calzone perfecto con ingredientes frescos</p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex flex-col xl:flex-row gap-8">
          {/* Panel Izquierdo - Imagen y Precio */}
          <div className="xl:w-2/5 flex flex-col">
            <div className="bg-white rounded-3xl shadow-2xl p-8 border border-red-100 sticky top-24">
              <div className="relative group">
                <div className="absolute inset-0 bg-gradient-to-r from-red-200 to-orange-200 rounded-2xl blur-lg opacity-30 group-hover:opacity-50 transition-opacity duration-300"></div>
                <img
                  src={calzone.imagen}
                  alt={calzone.nombre}
                  className="relative w-full max-w-md mx-auto rounded-2xl shadow-xl object-cover border-4 border-white transform group-hover:scale-105 transition-transform duration-300"
                />
              </div>
              
              <div className="text-center mt-6">
                <h2 className="text-2xl sm:text-3xl font-bold text-gray-800 mb-2">
                  Calzone {nombreSaborPrincipal || calzone.nombre}
                </h2>
                
                <div className="bg-gradient-to-r from-green-500 to-green-500 text-white rounded-2xl p-4 shadow-lg">
                  <p className="text-sm font-medium opacity-90 mb-1">Precio Total</p>
                  <p className="text-3xl sm:text-4xl font-bold">${precioFinal.toFixed(2)}</p>
                </div>

                <button className="w-full mt-6 bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white font-bold py-4 px-6 rounded-2xl shadow-lg transform hover:scale-105 transition-all duration-200 flex items-center justify-center gap-2">
                  <span className="text-xl">🛒</span>
                  Añadir al Carrito
                </button>
              </div>
            </div>
          </div>

          {/* Panel Derecho - Opciones */}
          <div className="xl:w-3/5 space-y-6">
            {/* Tamaños */}
            <div className="bg-white rounded-2xl shadow-xl p-6 border border-red-100">
              <div className="flex items-center gap-3 mb-4">
                <span className="text-2xl">📏</span>
                <h3 className="text-xl font-bold text-gray-800">Tamaño de Calzone</h3>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                {tamanios.map((t) => (
                  <label 
                    key={t.id} 
                    className={`relative flex items-center gap-3 p-4 rounded-xl border-2 transition-all duration-200 cursor-pointer group ${
                      tamanoSeleccionado === t.id.toString()
                        ? 'border-red-500 bg-red-50 shadow-md'
                        : 'border-gray-200 bg-white hover:border-red-300 hover:bg-red-50 hover:shadow-md'
                    }`}
                  >
                    <input
                      type="radio"
                      name="tamano"
                      value={t.id}
                      checked={tamanoSeleccionado === t.id.toString()}
                      onChange={() => onChangeTamano(t.id.toString())}
                      className="sr-only"
                    />
                    <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${
                      tamanoSeleccionado === t.id.toString()
                        ? 'border-red-500 bg-red-500'
                        : 'border-gray-300 group-hover:border-red-400'
                    }`}>
                      {tamanoSeleccionado === t.id.toString() && (
                        <div className="w-2 h-2 bg-white rounded-full"></div>
                      )}
                    </div>
                    <span className="font-medium text-gray-700">{t.nombre}</span>
                  </label>
                ))}
              </div>
            </div>

            {/* Sabor Principal */}
            <div className="bg-white rounded-2xl shadow-xl p-6 border border-red-100">
              <div className="flex items-center gap-3 mb-4">
                <span className="text-2xl">🍅</span>
                <h3 className="text-xl font-bold text-gray-800">Sabor Principal</h3>
              </div>
              <div className="grid grid-cols-1 gap-3">
                <label className="relative flex items-center gap-3 p-4 rounded-xl border-2 border-red-400 bg-red-50 shadow-md">
                  <input
                    type="radio"
                    name="saborPrincipal"
                    checked={true}
                    readOnly
                    className="sr-only"
                  />
                  <div className="w-5 h-5 rounded-full border-2 border-red-500 bg-red-500 flex items-center justify-center">
                    <div className="w-2 h-2 bg-white rounded-full"></div>
                  </div>
                  <div className="flex-1">
                    <span className="font-medium text-gray-700">{nombreSaborPrincipal}</span>
                    <span className="block text-xs text-red-600 font-medium">Principal • Obligatorio</span>
                  </div>
                  <span className="text-red-500 text-lg">👑</span>
                </label>
              </div>
            </div>

            {/* Agregados */}
            {agregadosDisponibles.length > 0 && (
              <div className="bg-white rounded-2xl shadow-xl p-6 border border-red-100">
                <div className="flex items-center gap-3 mb-4">
                  <span className="text-2xl">🧀</span>
                  <h3 className="text-xl font-bold text-gray-800">Agregados Extra</h3>
                  <span className="bg-green-100 text-green-800 px-3 py-1 rounded-full text-xs font-medium">
                    Opcional
                  </span>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
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
                      <label 
                        key={aid} 
                        className={`flex items-center gap-3 p-4 rounded-xl border-2 transition-all duration-200 cursor-pointer ${
                          checked
                            ? 'border-green-500 bg-green-50 shadow-md'
                            : 'border-gray-200 bg-white hover:border-green-300 hover:bg-green-50'
                        }`}
                      >
                        <input
                          type="checkbox"
                          name="agregado"
                          value={aid}
                          checked={checked}
                          onChange={() => onChangeAgregado(aid)}
                          className="sr-only"
                        />
                        <div className={`w-5 h-5 rounded-md border-2 flex items-center justify-center ${
                          checked
                            ? 'border-green-500 bg-green-500'
                            : 'border-gray-300'
                        }`}>
                          {checked && <span className="text-white text-xs">✓</span>}
                        </div>
                        <div className="flex-1">
                          <span className="text-gray-700 font-medium">{a.nombre}</span>
                          <span className="block text-sm text-green-600 font-semibold">+${precioAgregado}</span>
                        </div>
                      </label>
                    )
                  })}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

export default CalzoneDetailPage