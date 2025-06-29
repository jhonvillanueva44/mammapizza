// app/admin/page.tsx
'use client';
// hola
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useEffect, useRef } from 'react';

export default function AdminLogin() {
  const [credentials, setCredentials] = useState({
    username: '',
    password: ''
  });
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const isMounted = useRef(true);
  
  useEffect(() => {
    return () => {
      isMounted.current = false;
    };
  }, []);
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
  
    setTimeout(() => {
      if (isMounted.current) {
        setLoading(false);
        router.push('/admin/dashboard');
      }
    }, 1000);
  };
  
  return (
    <div className="min-h-screen bg-[#0C1011] flex items-center justify-center px-4 relative overflow-hidden">
      <div className="absolute -top-20 -left-20 w-64 h-64 rounded-full bg-[#E74C3C]/10 blur-xl"></div>
      <div className="absolute -bottom-20 -right-20 w-64 h-64 rounded-full bg-[#E74C3C]/10 blur-xl"></div>
      
      <div className="max-w-md w-full bg-[#1A2226] rounded-xl shadow-2xl p-10 backdrop-blur-sm border border-[#2C3E50]/30 relative z-10">
        <div className="text-center mb-10">
          <div className="mx-auto w-24 h-24 bg-[#E74C3C]/10 rounded-full flex items-center justify-center mb-6 border border-[#E74C3C]/20">
            <span className="text-4xl text-[#E74C3C]">🍕</span>
          </div>
          <h2 className="text-3xl font-bold text-white mb-2 font-serif">MammaPizza</h2>
          <p className="text-[#95A5A6] text-sm">Panel de Administración</p>
          <div className="mt-4 h-px bg-gradient-to-r from-transparent via-[#E74C3C]/40 to-transparent"></div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label htmlFor="username" className="block text-sm font-medium text-[#ECF0F1] mb-2">
              Usuario
            </label>
            <input
              id="username"
              type="text"
              required
              value={credentials.username}
              onChange={(e) => setCredentials({...credentials, username: e.target.value})}
              className="w-full px-4 py-3 bg-[#2C3E50]/30 border border-[#2C3E50] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#E74C3C]/50 focus:border-transparent text-white placeholder-[#95A5A6] transition-all"
              placeholder="Ingresa tu usuario"
            />
          </div>

          <div>
            <label htmlFor="password" className="block text-sm font-medium text-[#ECF0F1] mb-2">
              Contraseña
            </label>
            <input
              id="password"
              type="password"
              required
              value={credentials.password}
              onChange={(e) => setCredentials({...credentials, password: e.target.value})}
              className="w-full px-4 py-3 bg-[#2C3E50]/30 border border-[#2C3E50] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#E74C3C]/50 focus:border-transparent text-white placeholder-[#95A5A6] transition-all"
              placeholder="••••••••"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-gradient-to-r from-[#E74C3C] to-[#C0392B] text-white py-3 px-4 rounded-lg hover:opacity-90 focus:outline-none focus:ring-2 focus:ring-[#E74C3C]/50 focus:ring-offset-2 focus:ring-offset-[#1A2226] disabled:opacity-50 disabled:cursor-not-allowed transition-all flex items-center justify-center"
          >
            {loading ? (
              <>
                <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Iniciando sesión...
              </>
            ) : 'Iniciar Sesión'}
          </button>
        </form>

        <div className="mt-8 text-center text-xs text-[#95A5A6]">
          <p>@Tecsup - 2025</p>
          <div className="mt-2 flex items-center justify-center space-x-2">
            <div className="w-2 h-2 rounded-full bg-[#27AE60] animate-pulse"></div>
            <span>Sistema en línea</span>
          </div>
        </div>
      </div>
    </div>
  );
}