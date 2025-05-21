import Image from "next/image";
import Footer from "@/components/Footer";
// Componente principal de la página de inicio
export default function Home() {
  return (
    <div className="min-h-screen bg-white text-black font-sans w-full text-base sm:text-lg md:text-xl">
      {/* === SECCIÓN SOBRE NOSOTROS === */}
      <section className="py-8 sm:py-12 md:py-20 px-2 sm:px-4 md:px-8 bg-white w-full">
        <div className="w-full max-w-7xl mx-auto space-y-10 sm:space-y-16">
          {/* === CONTENEDOR INTERIOR GRANDE === */}
          <section className="bg-white rounded-lg p-2 sm:p-6 md:p-12 text-center shadow text-black w-full">
            {/* === Sección superior marrón con logo y texto blanco === */}
            <div className="bg-[#5A2A1D] py-4 sm:py-8 px-2 sm:px-6 w-full rounded-t-lg">
              <div className="w-full flex flex-col md:flex-row items-center justify-between gap-4 sm:gap-8">
                {/* Logo a la izquierda */}
                <div className="flex-shrink-0 mb-4 md:mb-0 flex justify-center md:justify-start w-full md:w-auto">
                  <Image
                    src="/images/logo-blanco.png"
                    alt="Logo Mammapizza"
                    width={120}
                    height={120}
                    className="w-24 h-24 sm:w-36 sm:h-36 md:w-44 md:h-44 object-contain"
                  />
                </div>
                {/* Título blanco a la derecha del logo */}
                <div className="text-center md:text-left w-full">
                  <h2 className="text-white text-xl sm:text-2xl md:text-4xl font-bold">
                    ASÍ ES COMO AGREGAMOS MÁS DE 60 AÑOS DE AMOR A TU PIZZA
                  </h2>
                </div>
              </div>
            </div>

            {/* === Sección inferior blanca con imagen y texto alineados === */}
            <div className="bg-white py-6 sm:py-10 md:py-14 w-full">
              <div className="w-full px-0 sm:px-2 md:px-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-12 items-center w-full">
                  {/* Imagen */}
                  <div className="relative w-full min-h-[180px] sm:min-h-[250px] md:min-h-[350px] h-[180px] sm:h-[250px] md:h-[350px] bg-white flex items-center justify-center">
                    <Image
                      src="/images/pizzero.png"
                      alt="Pizzero cocinando"
                      fill
                      className="object-cover rounded-md bg-white"
                      sizes="(max-width: 768px) 100vw, 50vw"
                      priority
                    />
                  </div>

                  {/* Texto a la derecha */}
                  <div className="flex flex-col justify-center items-center w-full">
                    <div className="text-center bg-white">
                      <h3 className="text-xl sm:text-3xl md:text-4xl font-extrabold text-[#5A2A1D]">
                        1959 <br /> Grandes Sueños
                      </h3>
                      <p className="mt-3 sm:mt-6 text-base sm:text-lg md:text-xl text-gray-800 leading-relaxed">
                        Los jóvenes empresarios <strong>Mike y Marian Ilitch</strong> invierten los
                        ahorros de toda su vida para abrir un pequeño restaurante de pizzas
                        en Garden City, Michigan.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            {/* Texto a la derecha */}
          </section>
        </div>
      </section>

      {/* === SECCIÓN LOCALES === */}
      <section className="px-2 sm:px-4 md:px-8 py-8 sm:py-12 md:py-20 bg-white w-full">
        <div className="flex flex-col md:flex-row gap-6 md:gap-12 items-center w-full max-w-7xl mx-auto">
          {/* Texto de invitación a visitar locales */}
          <div className="flex-1 order-2 md:order-1 w-full">
            <h3 className="text-xl sm:text-3xl font-bold">
              <strong>Visítanos en Nuestros Locales</strong>
            </h3>
            <p className="mt-3 sm:mt-6 text-gray-700 text-base sm:text-lg">
              <strong>
                Encuentra tu local más cercano y vive la experiencia Mammapizza.
                ¡Te esperamos con los brazos abiertos y la mejor pizza!
              </strong>
            </p>
            <p className="mt-2 sm:mt-4 text-base sm:text-lg">
              <strong>
                Nos Ubicamos en la Calle Granados 529 California, Víctor Larco Herrera, Peru, 13001
              </strong>
            </p>
          </div>

          {/* Imagen que enlaza a mapa en Waze */}
          <a
            href="https://www.google.com/maps/place/MammaPizza/@-8.1326004,-79.03972,17z/data=!3m1!4b1!4m6!3m5!1s0x91ad3d12d4889cad:0x6fa247c62dc910ed!8m2!3d-8.1326004!4d-79.03972!16s%2Fg%2F11cn949l64?hl=es-419&entry=ttu&g_ep=EgoyMDI1MDUxMy4xIKXMDSoJLDEwMjExNDUzSAFQAw%3D%3D"
            target="_blank"
            rel="noopener noreferrer"
            className="flex-shrink-0 w-full md:w-1/2 lg:w-[500px] order-1 md:order-2"
            title="Ver mapa en Waze"
          >
            <Image
              src="/images/ubicacion.png"
              alt="Ver mapa de locales"
              width={800}
              height={400}
              className="rounded shadow hover:scale-105 transition-transform w-full h-auto"
            />
          </a>
        </div>
      </section>
      {/* === FOOTER / PIE DE PÁGINA === */}
      <div>
      <Footer />
      </div>
    </div>
  );
}
