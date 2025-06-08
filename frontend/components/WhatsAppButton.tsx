'use client';

import { FaWhatsapp } from 'react-icons/fa';

export default function WhatsAppButton() {
  const phoneNumber: string = '+51929302775';
  const welcomeMessage: string = '¡Hola! ¿En qué podemos ayudarte hoy?';

  const handleClick = (): void => {
    const whatsappUrl: string = `https://wa.me/${phoneNumber}?text=${encodeURIComponent(welcomeMessage)}`;
    window.open(whatsappUrl, '_blank');
  };

  return (
    <div className="fixed bottom-8 right-8 z-50">
      <div className="relative">
        {/* Anillos de animación gigantes */}
        <div className="absolute border-4 border-green-400 rounded-full animate-ping-slow opacity-75" 
             style={{
               top: '-30px',
               left: '-30px',
               right: '-30px',
               bottom: '-30px',
               width: 'calc(100% + 60px)',
               height: 'calc(100% + 60px)'
             }}></div>
        <div className="absolute border-4 border-green-400 rounded-full animate-ping-slower opacity-50" 
             style={{
               top: '-60px',
               left: '-60px',
               right: '-60px',
               bottom: '-60px',
               width: 'calc(100% + 120px)',
               height: 'calc(100% + 120px)'
             }}></div>
        <div className="absolute border-4 border-green-400 rounded-full animate-ping-slowest opacity-25" 
             style={{
               top: '-90px',
               left: '-90px',
               right: '-90px',
               bottom: '-90px',
               width: 'calc(100% + 180px)',
               height: 'calc(100% + 180px)'
             }}></div>
        
        {/* Botón gigante */}
        <button
          onClick={handleClick}
          className="bg-green-500 hover:bg-green-600 text-white rounded-full shadow-2xl flex items-center justify-center relative z-10 transition-all duration-300 transform hover:scale-105"
          aria-label="Chat de WhatsApp"
          style={{
            width: '80px',
            height: '80px',
            fontSize: '2rem'
          }}
        >
          <FaWhatsapp size={40} />
        </button>
      </div>
    </div>
  );
}