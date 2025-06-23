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

  const [tamanoSeleccionado, setTamanoSeleccionado] = useState<string>('1')
  const [agregadosSeleccionados, setAgregadosSeleccionados] = useState<string[]>([])
  const [precioFinal, setPrecioFinal] = useState(0)
  const [saborPrincipalId, setSaborPrincipalId] = useState<string>('')

  // Estados para controlar los acordeones
  const [openSections, setOpenSections] = useState({
    tamanio: true,
    sabor: true,
    agregados: false
  })

  const toggleSection = (section: keyof typeof openSections) => {
    setOpenSections(prev => ({
      ...prev,
      [section]: !prev[section]
    }))
  }

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
        const tamanioId = calzoneData.unicos?.[0]?.tamanios_sabor?.tamanio?.id?.toString() || '1'
        const saborId = calzoneData.unicos?.[0]?.tamanios_sabor?.sabor?.id?.toString() || ''
        const precioInicial = calzoneData.unicos?.[0]?.tamanios_sabor?.precio || '0'

        setTamanoSeleccionado(tamanioId)
        setSaborPrincipalId(saborId)
        setPrecioFinal(parseFloat(precioInicial))
        actualizarPrecio(tamanioId, saborId, [])
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
    actualizarPrecio(id, saborPrincipalId, [])
  }

  const onChangeAgregado = (id: string) => {
    let nuevosAgregados = [...agregadosSeleccionados]
    if (nuevosAgregados.includes(id)) {
      nuevosAgregados = nuevosAgregados.filter(a => a !== id)
    } else {
      nuevosAgregados.push(id)
    }
    setAgregadosSeleccionados(nuevosAgregados)
    actualizarPrecio(tamanoSeleccionado, saborPrincipalId, nuevosAgregados)
  }

  const actualizarPrecio = (
    tamanoId: string,
    saborId: string,
    agregadosIds: string[]
  ) => {
    // Precio base del calzone (tamaño + sabor principal)
    const combPrincipal = tamaniosSabores.find(
      (ts: any) =>
        ts.tamanio_id.toString() === tamanoId &&
        ts.sabor_id.toString() === saborId
    )
    const precioBase = combPrincipal ? parseFloat(combPrincipal.precio) : 0

    // Obtener el índice del tamaño de calzone seleccionado
    const indiceTamanoCalzone = tamanios.findIndex(t => t.id.toString() === tamanoId)
    
    // Obtener el tamaño de agregado correspondiente (mismo índice)
    const tamanoAgregadoCorrespondiente = tamaniosAgregados[indiceTamanoCalzone]
    const tamanoAgregadoId = tamanoAgregadoCorrespondiente?.id?.toString() || ''

    // Precio de los agregados usando el tamaño de agregado correspondiente
    const precioAgregados = agregadosIds.reduce((acc, aid) => {
      const combAgregado = tamaniosSabores.find(
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
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="bg-white rounded-2xl shadow-xl p-8 text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-4 border-red-500 border-t-transparent mx-auto mb-4"></div>
          <p className="text-gray-600 text-lg font-medium">Cargando tu calzone perfecto...</p>
        </div>
      </div>
    )
  }

  // Obtener nombre del sabor principal
  const nombreSaborPrincipal = sabores.find(s => s.id.toString() === saborPrincipalId)?.nombre || calzone.nombre

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
    <div className="min-h-screen bg-gray-50 font-['Poppins']">
      {/* Header */}
      <div className="w-full bg-red-600 text-white py-6 px-6 shadow-md mt-20">
        <div className="max-w-7xl mx-auto text-center">
          <h1 className="text-3xl font-bold tracking-tight">MAMMA PIZZA</h1>
          <p className="mt-2 text-red-100">Personaliza tu calzone al gusto</p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex flex-col xl:flex-row gap-8">
          {/* Panel Izquierdo - Imagen y Precio */}
          <div className="xl:w-2/5 flex flex-col">
            <div className="bg-white rounded-xl shadow-md p-6 sticky top-24">
              <img
                src={calzone.imagen}
                alt={calzone.nombre}
                className="w-full h-64 object-cover rounded-lg mb-4"
              />
              
              <div className="text-center">
                <h2 className="text-2xl font-bold text-gray-800 mb-2">
                  Calzone {nombreSaborPrincipal}
                </h2>
                
                <div className="bg-red-600 text-white rounded-lg p-3 mb-4">
                  <p className="text-sm font-medium mb-1">PRECIO TOTAL</p>
                  <p className="text-3xl font-bold">S/ {precioFinal.toFixed(2)}</p>
                </div>

                <button className="w-full bg-red-600 hover:bg-red-700 text-white font-bold py-3 px-6 rounded-lg shadow transition-colors">
                  Añadir al Carrito
                </button>
              </div>
            </div>
          </div>

          {/* Panel Derecho - Opciones */}
          <div className="xl:w-3/5 space-y-4">
            {/* Tamaños */}
            <div className="bg-white rounded-xl shadow-md overflow-hidden">
              <button 
                onClick={() => toggleSection('tamanio')}
                className="w-full flex items-center justify-between p-4 hover:bg-gray-50 transition-colors"
              >
                <h3 className="text-lg font-bold text-gray-800">Tamaño de Calzone</h3>
                <span className="text-gray-500">
                  {openSections.tamanio ? '−' : '+'}
                </span>
              </button>
              
              {openSections.tamanio && (
                <div className="px-4 pb-4">
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2">
                    {tamanios.map((t) => (
                      <label 
                        key={t.id} 
                        className={`relative flex items-center gap-2 p-3 rounded-lg border transition-all ${
                          tamanoSeleccionado === t.id.toString()
                            ? 'border-red-500 bg-red-50'
                            : 'border-gray-200 hover:border-red-300 hover:bg-red-50'
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
                        <div className={`w-4 h-4 rounded-full border-2 flex items-center justify-center ${
                          tamanoSeleccionado === t.id.toString()
                            ? 'border-red-500 bg-red-500'
                            : 'border-gray-300'
                        }`}>
                          {tamanoSeleccionado === t.id.toString() && (
                            <div className="w-1.5 h-1.5 bg-white rounded-full"></div>
                          )}
                        </div>
                        <span className="text-sm text-gray-700">
                          {t.nombre}
                        </span>
                      </label>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Sabor Principal */}
            <div className="bg-white rounded-xl shadow-md overflow-hidden">
              <button 
                onClick={() => toggleSection('sabor')}
                className="w-full flex items-center justify-between p-4 hover:bg-gray-50 transition-colors"
              >
                <h3 className="text-lg font-bold text-gray-800">Sabor Principal</h3>
                <span className="text-gray-500">
                  {openSections.sabor ? '−' : '+'}
                </span>
              </button>
              
              {openSections.sabor && (
                <div className="px-4 pb-4">
                  <div className="grid grid-cols-1 gap-2">
                    <label 
                      className={`relative flex items-center gap-2 p-3 rounded-lg border transition-all border-red-400 bg-red-50`}
                    >
                      <input
                        type="radio"
                        name="saborPrincipal"
                        checked={true}
                        readOnly
                        className="sr-only"
                      />
                      <div className={`w-4 h-4 rounded-full border-2 flex items-center justify-center border-red-500 bg-red-500`}>
                        <div className="w-1.5 h-1.5 bg-white rounded-full"></div>
                      </div>
                      <div className="flex-1">
                        <span className="text-sm text-gray-700">
                          {nombreSaborPrincipal}
                        </span>
                        <span className="block text-xs text-red-600 font-semibold">Sabor principal (no se puede cambiar)</span>
                      </div>
                    </label>
                  </div>
                </div>
              )}
            </div>

            {/* Agregados */}
            {agregadosDisponibles.length > 0 && (
              <div className="bg-white rounded-xl shadow-md overflow-hidden">
                <button 
                  onClick={() => toggleSection('agregados')}
                  className="w-full flex items-center justify-between p-4 hover:bg-gray-50 transition-colors"
                >
                  <h3 className="text-lg font-bold text-gray-800">Agregados Extra</h3>
                  <span className="text-gray-500">
                    {openSections.agregados ? '−' : '+'}
                  </span>
                </button>
                
                {openSections.agregados && (
                  <div className="px-4 pb-4">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
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
                            className={`flex items-center gap-2 p-3 rounded-lg border transition-all ${
                              checked
                                ? 'border-green-500 bg-green-50'
                                : 'border-gray-200 hover:border-green-300 hover:bg-green-50'
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
                            <div className={`w-4 h-4 rounded border-2 flex items-center justify-center ${
                              checked
                                ? 'border-green-500 bg-green-500'
                                : 'border-gray-300'
                            }`}>
                              {checked && <span className="text-white text-xs">✓</span>}
                            </div>
                            <div className="flex-1">
                              <span className="text-sm text-gray-700">{a.nombre}</span>
                              <span className="block text-xs text-green-600 font-semibold">+S/ {precioAgregado}</span>
                            </div>
                          </label>
                        )
                      })}
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

export default CalzoneDetailPage