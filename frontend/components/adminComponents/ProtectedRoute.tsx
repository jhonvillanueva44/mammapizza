'use client';

import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

export default function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const router = useRouter();

  useEffect(() => {
    const nombre = localStorage.getItem('admin_nombre');
    
    if (!nombre) {
      router.replace('/admin');
    }
  }, []);

  return <>{children}</>;
}