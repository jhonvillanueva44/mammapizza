import Image from "next/image";
import Footer from "@/components/Footer";

export default function SobreNosotros() {
  return (
    <div className="min-h-screen font-['Inter'] bg-gradient-to-br from-red-50/30 via-white to-red-50/20">

      {/* HERO SECTION */}
      <section className="relative py-16 px-4 bg-gradient-to-r from-red-900 via-red-800 to-red-900 overflow-hidden">
        <div className="absolute inset-0 bg-black/10"></div>
        <div className="relative max-w-7xl mx-auto text-center">
          <div className="mb-8">
            <Image
              src="/images/logo-blanco.png"
              alt="Logo Mammapizza"
              width={120}
              height={120}
              className="mx-auto w-24 h-24 sm:w-32 sm:h-32 md:w-40 md:h-40 object-contain drop-shadow-lg"
            />
          </div>
          <h1 className="text-white text-2xl sm:text-3xl md:text-5xl lg:text-6xl font-bold font-['Playfair_Display'] mb-6 leading-tight">
            Nuestra Historia de Amor
            <span className="block text-red-200 text-lg sm:text-xl md:text-2xl lg:text-3xl font-normal mt-2">
              Más de 60 años creando momentos especiales
            </span>
          </h1>
          <div className="w-24 h-1 bg-red-400 mx-auto rounded-full"></div>
        </div>
      </section>

      {/* SECCIÓN PRINCIPAL DE HISTORIA */}
      <section className="py-12 md:py-20 px-4">
        <div className="max-w-7xl mx-auto">

          {/* Card principal con historia */}
          <div className="bg-white rounded-2xl shadow-2xl overflow-hidden mb-12 transform hover:scale-[1.02] transition-all duration-300">

            {/* Header con gradiente */}
            <div className="bg-gradient-to-r from-red-900 to-red-800 p-8 md:p-12">
              <div className="text-center">
                <h2 className="text-white text-xl sm:text-2xl md:text-4xl font-bold font-['Playfair_Display'] leading-tight">
                  ASÍ ES COMO AGREGAMOS MÁS DE 60 AÑOS
                  <span className="block text-red-200 mt-2">DE AMOR A TU PIZZA</span>
                </h2>
              </div>
            </div>

            {/* Contenido principal */}
            <div className="p-8 md:p-12">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 md:gap-12 items-center">

                {/* Imagen del pizzero */}
                <div className="relative group">
                  <div className="relative w-full h-64 sm:h-80 md:h-96 rounded-2xl overflow-hidden shadow-lg">
                    <Image
                      src="/images/pizzero.png"
                      alt="Pizzero cocinando con pasión"
                      fill
                      className="object-cover group-hover:scale-110 transition-transform duration-500"
                      sizes="(max-width: 768px) 100vw, 50vw"
                      priority
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent"></div>
                  </div>
                </div>

                {/* Contenido de texto */}
                <div className="space-y-6">
                  <div className="text-center lg:text-left">
                    <span className="inline-block px-4 py-2 bg-red-100 text-red-800 rounded-full text-sm font-semibold mb-4">
                      El Comienzo
                    </span>
                    <h3 className="text-3xl sm:text-4xl md:text-5xl font-bold text-red-900 font-['Playfair_Display'] mb-6">
                      1959
                      <span className="block text-xl sm:text-2xl md:text-3xl text-gray-600 font-normal mt-2">
                        Grandes Sueños
                      </span>
                    </h3>
                    <p className="text-base sm:text-lg md:text-xl text-gray-700 leading-relaxed font-['Open_Sans']">
                      Los jóvenes empresarios <span className="font-bold text-red-900">Mike y Marian Ilitch</span> invierten los
                      ahorros de toda su vida para abrir un pequeño restaurante de pizzas
                      en Garden City, Michigan. Con dedicación y amor por la cocina, crearon
                      las bases de lo que hoy conocemos como la tradición Mammapizza.
                    </p>
                  </div>

                  {/* Elementos decorativos */}
                  <div className="flex justify-center lg:justify-start space-x-4 pt-4">
                    <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                    <div className="w-3 h-3 bg-red-400 rounded-full"></div>
                    <div className="w-3 h-3 bg-red-300 rounded-full"></div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Sección de valores */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
            {[
              {
                icon: "❤️",
                title: "Pasión",
                description: "Cada pizza se hace con amor y dedicación desde 1959"
              },
              {
                icon: "👨‍🍳",
                title: "Tradición",
                description: "Recetas artesanales transmitidas de generación en generación"
              },
              {
                icon: "🏆",
                title: "Calidad",
                description: "Solo utilizamos los mejores ingredientes frescos y naturales"
              }
            ].map((valor, index) => (
              <div key={index} className="bg-white rounded-xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 text-center group hover:bg-red-50">
                <div className="text-4xl mb-4 group-hover:scale-110 transition-transform duration-300">
                  {valor.icon}
                </div>
                <h4 className="text-xl font-bold text-red-900 font-['Playfair_Display'] mb-3">
                  {valor.title}
                </h4>
                <p className="text-gray-600 font-['Open_Sans']">
                  {valor.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* SECCIÓN DE UBICACIÓN */}
      <section className="py-12 md:py-20 px-4 bg-gradient-to-r from-red-50/50 to-red-50/50">
        <div className="max-w-7xl mx-auto">

          {/* Título de sección */}
          <div className="text-center mb-12">
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-800 font-['Playfair_Display'] mb-4">
              📍 Visítanos en Nuestros Locales
            </h2>
            <p className="text-base sm:text-lg text-gray-600 font-['Open_Sans'] max-w-2xl mx-auto">
              Encuentra tu local más cercano y vive la experiencia Mammapizza.
              ¡Te esperamos con los brazos abiertos y la mejor pizza!
            </p>
            <div className="w-24 h-1 bg-red-500 mx-auto mt-6 rounded-full"></div>
          </div>

          {/* Card de ubicación */}
          <div className="bg-white rounded-2xl shadow-2xl overflow-hidden">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-0">

              {/* Información de contacto */}
              <div className="p-8 md:p-12 flex flex-col justify-center bg-gradient-to-br from-white to-red-50/30">
                <div className="space-y-6">
                  <div>
                    <h3 className="text-2xl sm:text-3xl font-bold text-red-900 font-['Playfair_Display'] mb-4">
                      Nuestra Ubicación
                    </h3>
                    <div className="space-y-4">
                      <div className="flex items-start space-x-3">
                        <span className="text-red-500 text-xl mt-1">📍</span>
                        <div>
                          <p className="font-semibold text-gray-800">Dirección:</p>
                          <p className="text-gray-600 font-['Open_Sans']">
                            Calle Granados 529 California<br />
                            Víctor Larco Herrera, Perú 13001
                          </p>
                        </div>
                      </div>

                      <div className="flex items-start space-x-3">
                        <span className="text-red-500 text-xl mt-1">🕒</span>
                        <div>
                          <p className="font-semibold text-gray-800">Horarios:</p>
                          <p className="text-gray-600 font-['Open_Sans']">
                            Lunes a Domingo: 11:00 AM - 11:00 PM
                          </p>
                        </div>
                      </div>

                      <div className="flex items-start space-x-3">
                        <span className="text-red-500 text-xl mt-1">📞</span>
                        <div>
                          <p className="font-semibold text-gray-800">Contacto:</p>
                          <p className="text-gray-600 font-['Open_Sans']">
                            +51 44 123-4567
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Botón de acción */}
                  <a
                    href="https://www.google.com/maps/place/MammaPizza/@-8.1326004,-79.03972,17z/data=!3m1!4b1!4m6!3m5!1s0x91ad3d12d4889cad:0x6fa247c62dc910ed!8m2!3d-8.1326004!4d-79.03972!16s%2Fg%2F11cn949l64?hl=es-419&entry=ttu&g_ep=EgoyMDI1MDUxMy4xIKXMDSoJLDEwMjExNDUzSAFQAw%3D%3D"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-red-600 to-red-700 text-white font-semibold rounded-xl hover:from-red-700 hover:to-red-800 transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl"
                  >
                    <span className="mr-2">🗺️</span>
                    Ver en Google Maps
                  </a>
                </div>
              </div>

              {/* Imagen del mapa */}
              <div className="relative group">
                <a
                  href="https://www.google.com/maps/place/MammaPizza/@-8.1326004,-79.03972,17z/data=!3m1!4b1!4m6!3m5!1s0x91ad3d12d4889cad:0x6fa247c62dc910ed!8m2!3d-8.1326004!4d-79.03972!16s%2Fg%2F11cn949l64?hl=es-419&entry=ttu&g_ep=EgoyMDI1MDUxMy4xIKXMDSoJLDEwMjExNDUzSAFQAw%3D%3D"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="block w-full h-full min-h-[300px] lg:min-h-[400px]"
                >
                  <div className="relative w-full h-full">
                    <Image
                      src="/images/ubicacion.png"
                      alt="Ubicación de Mammapizza en el mapa"
                      fill
                      className="object-cover group-hover:scale-110 transition-transform duration-500"
                      sizes="(max-width: 768px) 100vw, 50vw"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/10 to-transparent group-hover:from-black/20 transition-all duration-300"></div>
                    <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                      <div className="bg-white/90 backdrop-blur-sm rounded-full p-4 transform scale-75 group-hover:scale-100 transition-transform duration-300">
                        <span className="text-2xl">🗺️</span>
                      </div>
                    </div>
                  </div>
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CALL TO ACTION */}
      <section className="py-16 px-4 bg-gradient-to-r from-red-900 to-red-800 text-white">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold font-['Playfair_Display'] mb-6">
            ¿Listo para probar la tradición?
          </h2>
          <p className="text-lg sm:text-xl text-red-100 mb-8 font-['Open_Sans']">
            Ven y descubre por qué somos la pizzería favorita de la familia peruana desde hace décadas
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <a
              href="/menu/pizzas"
              className="inline-flex items-center px-8 py-4 bg-white text-red-900 font-bold rounded-xl hover:bg-red-50 transition-all duration-300 transform hover:scale-105 shadow-lg"
            >
              <span className="mr-2">🍕</span>
              Ver Nuestro Menú
            </a>
            <a
              href="https://wa.me/51929302775"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center px-8 py-4 border-2 border-white text-white font-bold rounded-xl hover:bg-white hover:text-red-900 transition-all duration-300 transform hover:scale-105"
            >
              <span className="mr-2">📞</span>
              Hacer Pedido
            </a>

          </div>
        </div>
      </section>

      {/* FOOTER */}
      <div className="mt-0">
        <Footer />
      </div>
    </div>
  );
}