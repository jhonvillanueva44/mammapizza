"use client";
import Image from "next/image";

export default function Footer() {
  return (

<div className="w-full bg-[#0C1011] text-white px-2 sm:px-4 md:px-8 py-6 sm:py-10 md:py-14 text-base sm:text-lg md:text-xl mt-8 sm:mt-16">
<div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-10">
        
        {/* Columna 1: Sobre nosotros + QR */}
        <div className="text-left">
          <h3 className="text-lg sm:text-xl font-bold mb-3 sm:mb-6">Sobre nosotros</h3>
          <p className="text-gray-300 mb-2 sm:mb-4 font-semibold">
            En Mamma Pizza sentimos pasión por las pizzas y las pastas. Te invitamos a probar las especialidades de la casa.
          </p>
          <p className="text-gray-300 font-semibold mb-6">
            Nuestros exquisitos calzones, nuestras tan pedidas pastas y unas pizzas que definitivamente te darán la excusa ideal para regresar!!
          </p>
          <div className="mt-4">
            <h4 className="font-bold mb-2">Escanea nuestro QR:</h4>
            <Image
              src="/images/qr.png" //imagen
              alt="QR para promociones"
              width={100}
              height={100}
              className="rounded-lg border border-white"
            />
          </div>
        </div>

        {/* Columna 2: Contáctenos */}
        <div className="text-left">
          <h3 className="text-lg sm:text-xl font-bold mb-3 sm:mb-6">Contáctenos</h3>
          <a
            href="https://api.whatsapp.com/message/C6GK35HNPVDBH1?autoload=1&app_absent=0"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 text-green-500 hover:text-green-700 font-semibold mb-6"
          >
            📱 WhatsApp
          </a>
          <ul className="text-gray-300 space-y-3">
            <li>
              💌 <a href="mailto:Mammapizza@pizzarico.com" className="underline hover:text-yellow-400">Mammapizza@pizzarico.com</a>
            </li>
            <li>
              ☎️ <a href="tel:+51989481847" className="underline hover:text-yellow-400">+51 989 481 847</a>
            </li>
          </ul>
        </div>

        {/* Columna 3: Redes Sociales */}
        <div className="text-left">
          <h3 className="text-lg sm:text-xl font-bold mb-3 sm:mb-6">Redes Sociales</h3>
          <div className="flex flex-col gap-4">
            <a href="https://facebook.com/mammapizza" target="_blank" className="hover:text-yellow-400">📘 Facebook</a>
            <a href="https://www.instagram.com/mammapizzatrujillo" target="_blank" className="hover:text-yellow-400">📸 Instagram</a>
          </div>
        </div>

        {/* Columna 4: Menú Express */}
        <div className="text-left">
          <h3 className="text-lg sm:text-xl font-bold mb-3 sm:mb-6">¡Elige tu antojo!</h3>
          <ul className="space-y-3">
            <li><a href="#" className="hover:text-yellow-400">Pedir</a></li>
            <li><a href="/bebidas" className="hover:text-yellow-400">Bebidas</a></li>
            <li><a href="/desayunos" className="hover:text-yellow-400">Desayunos</a></li>
          </ul>
        </div>
      </div>

      {/* Powered by */}
      <div className="mt-10 text-center text-sm text-gray-500">
        Powered by <span className="font-bold text-white">Mamma Pizza</span>
      </div>
    </div>
  );
}
