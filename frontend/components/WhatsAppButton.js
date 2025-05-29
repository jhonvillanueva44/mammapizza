'use client'; // Esto es necesario porque usaremos hooks y estado

import { useState } from 'react';
import { FaWhatsapp, FaTimes } from 'react-icons/fa';

export default function WhatsAppButton() {
  const [isOpen, setIsOpen] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    message: ''
  });

  const phoneNumber = '+51929302775'; // Reemplaza con tu número
  const welcomeMessage = '¡Hola! ¿En qué podemos ayudarte hoy?';

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    const message = `Nombre: ${formData.name}%0AEmail: ${formData.email}%0AMensaje: ${formData.message}`;
    const whatsappUrl = `https://wa.me/${phoneNumber}?text=${message}`;
    
    window.open(whatsappUrl, '_blank');
    
    // Resetear el formulario después de enviar
    setFormData({
      name: '',
      email: '',
      message: ''
    });
    setIsOpen(false);
  };

  return (
    <div className="fixed bottom-6 right-6 z-50">
      {isOpen && (
        <div className="bg-white shadow-lg rounded-lg p-4 mb-4 w-64">
          <div className="flex justify-between items-center mb-2">
            <h3 className="font-bold text-gray-800">WhatsApp</h3>
            <button 
              onClick={() => setIsOpen(false)}
              className="text-gray-500 hover:text-gray-700"
            >
              <FaTimes />
            </button>
          </div>
          <p className="text-sm text-gray-600 mb-3">{welcomeMessage}</p>
          
          <form onSubmit={handleSubmit}>
            <div className="mb-2">
              <input
                type="text"
                name="name"
                placeholder="Tu nombre"
                value={formData.name}
                onChange={handleChange}
                className="w-full p-2 border rounded text-sm"
                required
              />
            </div>
            <div className="mb-2">
              <input
                type="email"
                name="email"
                placeholder="Tu email"
                value={formData.email}
                onChange={handleChange}
                className="w-full p-2 border rounded text-sm"
                required
              />
            </div>
            <div className="mb-3">
              <textarea
                name="message"
                placeholder="Tu mensaje"
                value={formData.message}
                onChange={handleChange}
                className="w-full p-2 border rounded text-sm"
                rows="3"
                required
              />
            </div>
            <button
              type="submit"
              className="bg-green-500 hover:bg-green-600 text-white py-2 px-4 rounded text-sm w-full"
            >
              Enviar
            </button>
          </form>
        </div>
      )}
      
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="bg-green-500 hover:bg-green-600 text-white p-4 rounded-full shadow-lg flex items-center justify-center"
        aria-label="Chat de WhatsApp"
      >
        <FaWhatsapp size={28} />
      </button>
    </div>
  );
}