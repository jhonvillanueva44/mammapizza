"use client";
import {
  FaWhatsapp,
  FaFacebook,
  FaInstagram,
  FaEnvelope,
  FaPizzaSlice,
  FaGlassCheers,
} from "react-icons/fa";

export default function Footer() {
  return (
    <footer className="w-full bg-[#0C1011] text-white px-4 sm:px-6 py-12 border-t border-gray-800">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 md:gap-12">
        
          <div className="space-y-4">
            <h3 className="text-xl font-bold text-red-600 border-b border-red-600 pb-2 inline-block">
              Sobre nosotros
            </h3>
            <p className="text-gray-300 leading-relaxed">
              En <span className="text-red-600 font-semibold">Mamma Pizza</span> sentimos pasión por las pizzas y pastas artesanales. Te invitamos a probar nuestras especialidades preparadas con ingredientes frescos y amor italiano.
            </p>
          </div>

          <div className="space-y-4">
            <h3 className="text-xl font-bold text-red-600 border-b border-red-600 pb-2 inline-block">
              Contáctenos
            </h3>
            <div className="space-y-3">
              <a
                href={`https://web.whatsapp.com/send?phone=${process.env.NEXT_PUBLIC_WHATSAPP_NUMBER}`}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-3 text-green-400 hover:text-green-300 transition-colors"
              >
                <FaWhatsapp className="text-xl" />
                <span>WhatsApp</span>
              </a>
              <a
                href={`https://mail.google.com/mail/?view=cm&fs=1&to=${process.env.NEXT_PUBLIC_EMAIL_ADDRESS}`}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-3 text-gray-300 hover:text-red-600 transition-colors"
              >
                <FaEnvelope className="text-lg" />
                <span>Correo</span>
              </a>
            </div>
          </div>

          {/* Social Media Section */}
          <div className="space-y-4">
            <h3 className="text-xl font-bold text-red-600 border-b border-red-600 pb-2 inline-block">
              Redes Sociales
            </h3>
            <div className="space-y-3">
              <a
                href="https://www.facebook.com/share/14DTtQHt138/?mibextid=wwXIfr"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-3 text-gray-300 hover:text-blue-400 transition-colors"
              >
                <FaFacebook className="text-xl" />
                <span>Facebook</span>
              </a>
              <a
                href="https://www.instagram.com/mammapizzatrujillo?igsh=cXU3ZDlvZjYxNGh2"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-3 text-gray-300 hover:text-pink-500 transition-colors"
              >
                <FaInstagram className="text-xl" />
                <span>Instagram</span>
              </a>
            </div>

            {/* Hours Section */}
            <div className="pt-4">
              <h4 className="font-semibold text-red-600">Horario de atención:</h4>
              <p className="text-gray-300 text-sm">Lunes a Domingo</p>
              <p className="text-gray-300 text-sm">06:00 PM - 11:00 PM</p>
            </div>
          </div>

          {/* Quick Menu Section */}
          <div className="space-y-4">
            <h3 className="text-xl font-bold text-red-600 border-b border-red-600 pb-2 inline-block">
              Menú Express
            </h3>
            <ul className="space-y-3">
              <li>
                <a
                  href="/menu/pizzas"
                  className="flex items-center gap-3 text-gray-300 hover:text-red-600 transition-colors"
                >
                  <FaPizzaSlice />
                  <span>Pedir</span>
                </a>
              </li>
              <li>
                <a
                  href="/bebidas"
                  className="flex items-center gap-3 text-gray-300 hover:text-red-600 transition-colors"
                >
                  <FaGlassCheers />
                  <span>Bebidas</span>
                </a>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-gray-800 my-8"></div>

        <div className="flex flex-col md:flex-row justify-between items-center text-sm text-gray-400">
          <div className="mb-4 md:mb-0">
            © {new Date().getFullYear()} Mamma Pizza. Todos los derechos reservados.
          </div>
        </div>
      </div>
    </footer>
  );
}