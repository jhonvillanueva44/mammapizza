'use client';

import React from 'react';
import Link from 'next/link';

type Props = {
  title: string;
  image: string;
  link: string;
};

export default function CategoryCard({ title, image, link }: Props) {
  return (
    <Link href={link} className="group block">
      <div className="w-48 h-56 sm:w-52 sm:h-60 md:w-56 md:h-64 lg:w-60 lg:h-68 bg-gradient-to-br from-white via-white/80 to-white/60 border border-gray-200/40 transition-all duration-700 ease-out cursor-pointer flex flex-col items-center p-4 sm:p-5 md:p-6 rounded-3xl overflow-hidden shadow-[0_4px_20px_rgba(0,0,0,0.06)] hover:shadow-[0_20px_60px_rgba(136,19,55,0.25)] backdrop-blur-xl font-['Inter'] relative group hover:border-red-400/60 transform hover:scale-[1.02] hover:-translate-y-1">

        {/* Fondo rojo solo visible al hacer hover */}
        <div className="absolute inset-0 bg-gradient-to-br from-transparent via-transparent to-transparent group-hover:from-red-500/10 group-hover:via-red-600/8 group-hover:to-red-800/6 transition-all duration-700 rounded-3xl"></div>

        {/* Esferas decorativas solo con rojo al hover */}
        <div className="absolute top-4 right-4 w-2 h-2 bg-gradient-to-r from-gray-300 to-gray-500 rounded-full opacity-40 group-hover:from-red-500 group-hover:to-red-700 group-hover:opacity-80 transition-all duration-500 animate-pulse"></div>
        <div className="absolute top-8 right-8 w-1 h-1 bg-gradient-to-r from-gray-300 to-gray-500 rounded-full opacity-30 group-hover:from-red-400 group-hover:to-red-600 group-hover:opacity-70 transition-all duration-700 animate-pulse delay-150"></div>
        <div className="absolute bottom-6 left-4 w-1.5 h-1.5 bg-gradient-to-r from-gray-400 to-gray-600 rounded-full opacity-20 group-hover:from-red-500 group-hover:to-red-800 group-hover:opacity-60 transition-all duration-600 animate-pulse delay-300"></div>

        {/* Título con fondo blanco por defecto */}
        <div className="relative z-20 text-sm sm:text-base md:text-lg font-bold text-gray-900 bg-white/70 backdrop-blur-md px-4 py-2.5 sm:px-5 sm:py-3 mb-4 sm:mb-5 md:mb-6 rounded-full transition-all duration-500 text-center border border-white/30 shadow-[0_8px_32px_rgba(0,0,0,0.1)] group-hover:bg-gradient-to-r group-hover:from-red-600 group-hover:via-red-700 group-hover:to-red-800 group-hover:text-white group-hover:shadow-[0_12px_40px_rgba(136,19,55,0.4)] group-hover:border-white/50 font-['Playfair_Display'] group-hover:scale-105">
          <span className="relative z-10">{title}</span>
          <div className="absolute inset-0 bg-gradient-to-r from-white/20 to-transparent rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
        </div>

        <div className="relative z-10 w-full flex-grow overflow-hidden rounded-2xl flex items-center justify-center group-hover:scale-[1.03] transition-all duration-700 shadow-lg group-hover:shadow-[0_20px_50px_rgba(136,19,55,0.3)]">
          <div className="absolute inset-0 bg-gradient-to-t from-white/20 via-white/10 to-white/5 z-10"></div>
          <div className="absolute inset-0 bg-gradient-to-br from-transparent to-transparent group-hover:from-red-500/8 group-hover:to-red-700/5 transition-all duration-700 z-20"></div>

          <img 
            src={image} 
            alt={title} 
            className="w-full h-full object-cover object-center transition-all duration-1000 group-hover:brightness-110 group-hover:contrast-105 group-hover:saturate-110 group-hover:scale-105" 
          />

          <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-500 z-30">
            <div className="bg-white/95 backdrop-blur-lg rounded-full p-3 sm:p-4 shadow-[0_12px_40px_rgba(136,19,55,0.25)] transform translate-y-4 group-hover:translate-y-0 transition-all duration-500 border border-white/40 hover:bg-gradient-to-r hover:from-red-100 hover:to-red-200">
              <svg className="w-5 h-5 sm:w-6 sm:h-6 text-red-600 group-hover:text-red-800 transition-colors duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M13 7l5 5m0 0l-5 5m5-5H6" />
              </svg>
            </div>
          </div>

          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000 z-25 skew-x-12"></div>
        </div>

        {/* Decoración sutil por defecto, vibrante en hover */}
        <div className="absolute top-0 right-0 w-20 h-20 bg-gradient-to-br from-gray-100/20 via-gray-100/10 to-transparent rounded-full -translate-y-10 translate-x-10 group-hover:from-red-400/20 group-hover:via-red-500/10 group-hover:scale-125 transition-transform duration-700"></div>
        <div className="absolute bottom-0 left-0 w-16 h-16 bg-gradient-to-tr from-gray-200/15 via-gray-300/10 to-transparent rounded-full translate-y-8 -translate-x-8 group-hover:from-red-300/15 group-hover:via-red-400/10 group-hover:scale-110 transition-transform duration-600"></div>
        <div className="absolute top-1/2 left-0 w-1 h-8 bg-gradient-to-b from-gray-200/20 to-transparent -translate-x-full group-hover:from-red-500/20 group-hover:translate-x-0 transition-transform duration-500"></div>
        <div className="absolute top-1/2 right-0 w-1 h-6 bg-gradient-to-b from-gray-300/20 to-transparent translate-x-full group-hover:from-red-600/20 group-hover:translate-x-0 transition-transform duration-600 delay-100"></div>

        <div className="absolute inset-0 rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-700 bg-gradient-to-r from-red-500/5 via-red-600/5 to-red-800/5 blur-xl -z-10"></div>
      </div>
    </Link>
  );
}
