"use client";
import { useRef } from "react";

export default function Footer() {
  return (
    <div className="w-full bg-[#1a0f0a] text-white px-2 sm:px-4 md:px-8 py-6 sm:py-10 md:py-14 text-base sm:text-lg md:text-xl mt-8 sm:mt-16">
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-10">
        
        {/* Columna 1: Información sobre la empresa */}
        <div className="text-left">
          <h3 className="text-lg sm:text-xl font-bold mb-3 sm:mb-6">Sobre nosotros</h3>
          <p className="text-gray-300 mb-2 sm:mb-4">
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
          <h3 className="text-lg sm:text-xl font-bold mb-3 sm:mb-6">Contáctenos</h3>
          <a
            href="https://api.whatsapp.com/message/C6GK35HNPVDBH1?autoload=1&app_absent=0"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 sm:gap-4 text-green-500 hover:text-green-700 font-semibold mb-3 sm:mb-6 text-base sm:text-lg"
            title="Contáctanos por WhatsApp"
          >
            <svg width="24" height="24" fill="currentColor" className="shrink-0">
              <path d="M20.52 3.48A11.93 11.93 0 0 0 12 0C5.37 0 0 5.37 0 12c0 2.11.55 4.16 1.6 5.97L0 24l6.22-1.62A11.93 11.93 0 0 0 12 24c6.63 0 12-5.37 12-12 0-3.19-1.24-6.19-3.48-8.52zM12 22c-1.77 0-3.5-.46-5.01-1.33l-.36-.21-3.69.96.99-3.59-.23-.37A9.93 9.93 0 0 1 2 12c0-5.52 4.48-10 10-10s10 4.48 10 10-4.48 10-10 10zm5.2-7.6c-.29-.15-1.7-.84-1.96-.93-.26-.1-.45-.15-.64.15-.19.29-.74.93-.9 1.12-.17.19-.33.21-.62.07-.29-.15-1.22-.45-2.33-1.43-.86-.77-1.44-1.72-1.61-2.01-.17-.29-.02-.45.13-.6.13-.13.29-.34.43-.51.14-.17.19-.29.29-.48.1-.19.05-.36-.02-.51-.07-.15-.64-1.54-.88-2.11-.23-.56-.47-.48-.64-.49-.16-.01-.36-.01-.56-.01-.19 0-.51.07-.78.36-.27.29-1.02 1-1.02 2.43 0 1.43 1.04 2.81 1.19 3 .15.19 2.05 3.13 5.01 4.27.7.3 1.25.48 1.68.61.71.23 1.36.2 1.87.12.57-.09 1.7-.69 1.94-1.36.24-.67.24-1.25.17-1.36-.07-.11-.26-.18-.55-.33z" />
            </svg>
            Contáctenos
          </a>
          <ul className="text-gray-300 space-y-2 sm:space-y-3 text-base sm:text-lg">
            <li className="flex items-start gap-2 sm:gap-3">
              💌{" "}
              <span>
                <a href="mailto:Mammapizza@pizzarico.com" className="underline hover:text-yellow-400">
                  Mammapizza@pizzarico.com
                </a>
              </span>
            </li>
            <li className="flex items-start gap-2 sm:gap-3">
              ☎️{" "}
              <span>
                <a href="tel:+51989481847" className="underline hover:text-yellow-400">
                  +51 989 481 847
                </a>
              </span>
            </li>
          </ul>
        </div>

        {/* Columna 3: Redes Sociales */}
        <div className="text-left">
          <h3 className="text-lg sm:text-xl font-bold mb-3 sm:mb-6">Redes Sociales</h3>
          <div className="flex flex-col gap-3 sm:gap-6 text-base sm:text-lg">
            <a
              href="https://facebook.com/mammapizza"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 sm:gap-3 hover:text-yellow-400"
            >
              <svg width="24" height="24" fill="currentColor" className="shrink-0">
                <path d="M22 12c0-5.522-4.477-10-10-10S2 6.478 2 12c0 5.004 3.657 9.128 8.438 9.877v-6.987h-2.54v-2.89h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.242 0-1.632.771-1.632 1.562v1.875h2.773l-.443 2.89h-2.33v6.987C18.343 21.128 22 17.004 22 12" />
              </svg>
              Facebook
            </a>
            <a
              href="https://www.instagram.com/mammapizzatrujillo/?igsh=NGc2czFkYm9pbXJp#"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 sm:gap-3 hover:text-yellow-400"
            >
              <svg width="24" height="24" fill="currentColor" className="shrink-0">
                <path d="M7.75 2h8.5A5.75 5.75 0 0 1 22 7.75v8.5A5.75 5.75 0 0 1 16.25 22h-8.5A5.75 5.75 0 0 1 2 16.25v-8.5A5.75 5.75 0 0 1 7.75 2zm0 1.5A4.25 4.25 0 0 0 3.5 7.75v8.5A4.25 4.25 0 0 0 7.75 20.5h8.5A4.25 4.25 0 0 0 20.5 16.25v-8.5A4.25 4.25 0 0 0 16.25 3.5h-8.5zm4.25 3.25a5.25 5.25 0 1 1 0 10.5 5.25 5.25 0 0 1 0-10.5zm0 1.5a3.75 3.75 0 1 0 0 7.5 3.75 3.75 0 0 0 0-7.5zm5.25.75a1 1 0 1 1-2 0 1 1 0 0 1 2 0z" />
              </svg>
              Instagram
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
