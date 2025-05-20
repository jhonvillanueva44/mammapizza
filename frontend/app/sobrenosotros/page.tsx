import Image from "next/image";

// Componente principal de la página de inicio
export default function Home() {
  return (
    <div className="min-h-screen bg-white text-black font-sans">
      {/* === SECCIÓN SOBRE NOSOTROS === */}
      <section className="py-20 px-6 bg-white">
        <div className="max-w-6xl mx-auto space-y-16">

          {/* === CONTENEDOR INTERIOR CON FONDO MARRÓN (puedes cambiar bg-[#6B3F22] a blanco si quieres fondo claro) === */}
            <div className="bg-[#6B3F22] rounded-lg p-8 text-center shadow text-white">
            {/* === Logo y título alineados en fila en pantallas medianas o mayores === */}
            <div className="flex flex-col md:flex-row items-center justify-center gap-6">
              {/* Logo a la izquierda */}
              <div className="flex-shrink-0 mb-4 md:mb-0">
                <Image
                  src="/images/logo-blanco.png"
                  alt="Logo Mammapizza"
                  width={180}
                  height={180}
                  className="mx-auto md:mx-0"
                  style={{ minWidth: 180, minHeight: 180 }}
                />
              </div>
              {/* Título a la derecha */}
                <h2 className="text-4xl font-bold text-center md:text-left">
                <strong>ASÍ ES COMO AGREGAMOS MÁS DE 60 AÑOS DE AMOR A TU PIZZA</strong>
                </h2>
            </div>

            {/* === Imagen + descripción histórica en columnas (en pantallas grandes) === */}
            <div className="grid md:grid-cols-2 gap-10 items-center mt-10">
              {/* Imagen con enlace externo a la historia */}
              <a
                href="https://www.mammapizza.com/historia"
                target="_blank"
                rel="noopener noreferrer"
                title="Conoce más sobre nuestra historia"
                className="block w-full h-[400px] relative"
              >
                <Image
                  src="/images/pizzero.png"
                  alt="Pizzero cocinando"
                  fill
                  className="object-cover rounded-lg"
                />
              </a>

              {/* Texto con año y descripción */}
                <div className="flex-1 flex flex-col items-center justify-center text-center">
                <h3 className="text-4xl font-extrabold">
                  <strong>1959 Grandes Sueños</strong>
                </h3>
                <p className="mt-6 text-lg md:text-xl">
                  <strong>
                  Los jóvenes empresarios Mike y Marian Ilitch invierten los
                  ahorros de toda su vida para abrir un pequeño restaurante de
                  pizzas en Garden City, Michigan.
                  </strong>
                </p>
                </div>
            </div>
          </div>
        </div>
      </section>

      {/* === SECCIÓN LOCALES === */}
      <section className="px-6 py-16 bg-white">
        <div className="flex flex-col md:flex-row gap-10 items-center max-w-6xl mx-auto">
          {/* Texto de invitación a visitar locales */}
            <div className="flex-1 order-2 md:order-1">
            <h3 className="text-3xl font-bold">
              <strong>Visítanos en Nuestros Locales</strong>
            </h3>
            <p className="mt-4 text-gray-700">
              <strong>
              Encuentra tu local más cercano y vive la experiencia Mammapizza.
              ¡Te esperamos con los brazos abiertos y la mejor pizza!
              </strong>
            </p>
            <p>
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
      <div className="w-full">
        <div className="mt-16">
          {/* Footer con fondo oscuro que abarca todo el ancho */}
          <div className="bg-[#1a0f0a] text-white px-6 py-16 w-screen relative left-1/2 right-1/2 -mx-[50vw]">
            <div className="max-w-full mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">

                {/* Columna 1: Información sobre la empresa */}
                <div className="text-left">
                <h3 className="text-2xl font-bold mb-4">Sobre nosotros</h3>
                <p className="text-gray-300 mb-2">
                  <strong>
                  En Mamma Pizza sentimos pasión por las pizzas y las pastas. Te invitamos a probar las especialidades de la casa.
                  </strong>
                </p>
                <p className="text-gray-300">
                  <strong>
                  Nuestros exquisitos calzones, nuestras tan pedidas pastas y unas pizzas que definitivamente te darán la excusa ideal para regresar!!
                  </strong>
                </p>
                </div>

              {/* Columna 2: Contacto */}
              <div className="text-left">
                <h3 className="text-2xl font-bold mb-4">Contáctenos</h3>
                <a
                  href="https://api.whatsapp.com/message/C6GK35HNPVDBH1?autoload=1&app_absent=0"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 text-green-500 hover:text-green-700 font-semibold mb-4"
                  title="Contáctanos por WhatsApp"
                >
                  <svg width="24" height="24" fill="currentColor" className="shrink-0">
                  <path d="M20.52 3.48A11.93 11.93 0 0 0 12 0C5.37 0 0 5.37 0 12c0 2.11.55 4.16 1.6 5.97L0 24l6.22-1.62A11.93 11.93 0 0 0 12 24c6.63 0 12-5.37 12-12 0-3.19-1.24-6.19-3.48-8.52zM12 22c-1.77 0-3.5-.46-5.01-1.33l-.36-.21-3.69.96.99-3.59-.23-.37A9.93 9.93 0 0 1 2 12c0-5.52 4.48-10 10-10s10 4.48 10 10-4.48 10-10 10zm5.2-7.6c-.29-.15-1.7-.84-1.96-.93-.26-.1-.45-.15-.64.15-.19.29-.74.93-.9 1.12-.17.19-.33.21-.62.07-.29-.15-1.22-.45-2.33-1.43-.86-.77-1.44-1.72-1.61-2.01-.17-.29-.02-.45.13-.6.13-.13.29-.34.43-.51.14-.17.19-.29.29-.48.1-.19.05-.36-.02-.51-.07-.15-.64-1.54-.88-2.11-.23-.56-.47-.48-.64-.49-.16-.01-.36-.01-.56-.01-.19 0-.51.07-.78.36-.27.29-1.02 1-1.02 2.43 0 1.43 1.04 2.81 1.19 3 .15.19 2.05 3.13 5.01 4.27.7.3 1.25.48 1.68.61.71.23 1.36.2 1.87.12.57-.09 1.7-.69 1.94-1.36.24-.67.24-1.25.17-1.36-.07-.11-.26-.18-.55-.33z"/>
                  </svg>
                  Contáctenos
                </a>
                <ul className="text-gray-300 space-y-2">
                 
                  <li className="flex items-start gap-2">
                    💌 {<span><a href="Mammpizza@pizzarico.com" className="underline hover:text-yellow-400">Mammapizza@pizzarico.com</a></span>}
                  </li>
                  <li className="flex items-start gap-2">
                    ☎️ <span><a href="tel:+51 989 481 847" className="underline hover:text-yellow-400">+51 989 481 847</a></span>
                  </li>
                </ul>
              </div>

              {/* Columna 3: Redes sociales con iconos SVG */}
              <div className="text-left">
                <h3 className="text-2xl font-bold mb-4">Redes Sociales</h3>
                <div className="flex flex-col gap-4">
                  <a
                    href="https://facebook.com/mammapizza"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-2 hover:text-yellow-400"
                  >
                    {/* Icono de Facebook */}
                    <svg width="24" height="24" fill="currentColor" className="shrink-0">
                      <path d="M22 12c0-5.522-4.477-10-10-10S2 6.478 2 12c0 5.004 3.657 9.128 8.438 9.877v-6.987h-2.54v-2.89h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.242 0-1.632.771-1.632 1.562v1.875h2.773l-.443 2.89h-2.33v6.987C18.343 21.128 22 17.004 22 12"/>
                    </svg>
                    Facebook
                  </a>
                  <a
                    href="https://www.instagram.com/mammapizzatrujillo/?igsh=NGc2czFkYm9pbXJp#"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-2 hover:text-yellow-400"
                  >
                    {/* Icono de Instagram */}
                    <svg width="24" height="24" fill="currentColor" className="shrink-0">
                      <path d="M7.75 2h8.5A5.75 5.75 0 0 1 22 7.75v8.5A5.75 5.75 0 0 1 16.25 22h-8.5A5.75 5.75 0 0 1 2 16.25v-8.5A5.75 5.75 0 0 1 7.75 2zm0 1.5A4.25 4.25 0 0 0 3.5 7.75v8.5A4.25 4.25 0 0 0 7.75 20.5h8.5A4.25 4.25 0 0 0 20.5 16.25v-8.5A4.25 4.25 0 0 0 16.25 3.5h-8.5zm4.25 3.25a5.25 5.25 0 1 1 0 10.5 5.25 5.25 0 0 1 0-10.5zm0 1.5a3.75 3.75 0 1 0 0 7.5 3.75 3.75 0 0 0 0-7.5zm5.25.75a1 1 0 1 1-2 0 1 1 0 0 1 2 0z"/>
                    </svg>
                    Instagram
                  </a>
                </div>
              </div>

            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
