"use client";
import Image from "next/image";
import { FaWhatsapp, FaFacebook, FaInstagram, FaPhone, FaEnvelope, FaPizzaSlice, FaGlassCheers, FaCoffee } from "react-icons/fa";

export default function Footer() {
  return (
    <footer className="w-full bg-[#0C1011] text-white px-4 sm:px-6 py-12 border-t border-gray-800">
      <div className="max-w-7xl mx-auto">
        {/* Main Content */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 md:gap-12">
          
          {/* About Section */}
          <div className="space-y-4">
            <h3 className="text-xl font-bold text-yellow-400 border-b border-yellow-400 pb-2 inline-block">Sobre nosotros</h3>
            <p className="text-gray-300 leading-relaxed">
              En <span className="text-yellow-400 font-semibold">Mamma Pizza</span> sentimos pasión por las pizzas y pastas artesanales. 
              Te invitamos a probar nuestras especialidades preparadas con ingredientes frescos y amor italiano.
            </p>
            <div className="pt-4">
              <div className="bg-white p-2 inline-block rounded-lg shadow-lg">
                <Image
                  src="/images/qr.png"
                  alt="QR para promociones"
                  width={120}
                  height={120}
                  className="rounded-md"
                />
              </div>
              <p className="text-sm text-gray-400 mt-2">Escanea para promociones exclusivas</p>
            </div>
          </div>

          {/* Contact Section */}
          <div className="space-y-4">
            <h3 className="text-xl font-bold text-yellow-400 border-b border-yellow-400 pb-2 inline-block">Contáctenos</h3>
            <div className="space-y-3">
              <a
                href="https://api.whatsapp.com/message/C6GK35HNPVDBH1?autoload=1&app_absent=0"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-3 text-green-400 hover:text-green-300 transition-colors"
              >
                <FaWhatsapp className="text-xl" />
                <span>WhatsApp</span>
              </a>
              <a 
                href="mailto:Mammapizza@pizzarico.com" 
                className="flex items-center gap-3 text-gray-300 hover:text-yellow-400 transition-colors"
              >
                <FaEnvelope className="text-lg" />
                <span>Mammapizza@pizzarico.com</span>
              </a>
              <a 
                href="tel:+51989481847" 
                className="flex items-center gap-3 text-gray-300 hover:text-yellow-400 transition-colors"
              >
                <FaPhone className="text-lg" />
                <span>+51 989 481 847</span>
              </a>
            </div>
          </div>

          {/* Social Media Section */}
          <div className="space-y-4">
            <h3 className="text-xl font-bold text-yellow-400 border-b border-yellow-400 pb-2 inline-block">Redes Sociales</h3>
            <div className="space-y-3">
              <a 
                href="https://facebook.com/mammapizza" 
                target="_blank"
                className="flex items-center gap-3 text-gray-300 hover:text-blue-400 transition-colors"
              >
                <FaFacebook className="text-xl" />
                <span>Facebook</span>
              </a>
              <a 
                href="https://www.instagram.com/mammapizzatrujillo" 
                target="_blank"
                className="flex items-center gap-3 text-gray-300 hover:text-pink-500 transition-colors"
              >
                <FaInstagram className="text-xl" />
                <span>Instagram</span>
              </a>
            </div>
            
            {/* Hours Section */}
            <div className="pt-4">
              <h4 className="font-semibold text-yellow-400">Horario de atención:</h4>
              <p className="text-gray-300 text-sm">Lunes a Domingo</p>
              <p className="text-gray-300 text-sm">10:00 AM - 10:00 PM</p>
            </div>
          </div>

          {/* Quick Menu Section */}
          <div className="space-y-4">
            <h3 className="text-xl font-bold text-yellow-400 border-b border-yellow-400 pb-2 inline-block">Menú Express</h3>
            <ul className="space-y-3">
              <li>
                <a href="#" className="flex items-center gap-3 text-gray-300 hover:text-yellow-400 transition-colors">
                  <FaPizzaSlice />
                  <span>Pedir</span>
                </a>
              </li>
              <li>
                <a href="/bebidas" className="flex items-center gap-3 text-gray-300 hover:text-yellow-400 transition-colors">
                  <FaGlassCheers />
                  <span>Bebidas</span>
                </a>
              </li>
            </ul>
            
            
          </div>
        </div>

        {/* Divider */}
        <div className="border-t border-gray-800 my-8"></div>

        {/* Footer Bottom */}
        <div className="flex flex-col md:flex-row justify-between items-center text-sm text-gray-400">
          <div className="mb-4 md:mb-0">
            © {new Date().getFullYear()} Mamma Pizza. Todos los derechos reservados.
          </div>
          <div className="flex space-x-4">
            <a href="#" className="hover:text-yellow-400 transition-colors">Términos y condiciones</a>
            <a href="#" className="hover:text-yellow-400 transition-colors">Política de privacidad</a>
          </div>
        </div>
      </div>
    </footer>
  );
}