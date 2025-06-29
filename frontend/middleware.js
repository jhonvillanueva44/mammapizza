import { NextResponse } from 'next/server';

export function middleware(request) {
  const { pathname } = request.nextUrl;
  
  // Solo proteger rutas admin
  if (pathname.startsWith('/admin')) {
    const token = request.cookies.get('authToken');
    
    if (!token && pathname !== '/admin') {
      return NextResponse.redirect(new URL('/admin', request.url));
    }
  }
  
  return NextResponse.next();
}

export const config = {
  matcher: ['/admin/:path*']
};