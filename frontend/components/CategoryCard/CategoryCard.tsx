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
      <div className="w-48 h-56 bg-gradient-to-br from-white via-red-50/30 to-red-50/20 border-2 border-red-100/50 transition-all duration-500 cursor-pointer flex flex-col items-center p-4 rounded-2xl overflow-hidden transform scale-90 hover:scale-100 hover:border-red-400/80 hover:shadow-[0_15px_35px_rgba(255,0,0,0.2)] backdrop-blur-sm font-['Inter'] relative group">
        
        {/* Decorative gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-r from-red-400/5 to-red-400/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
        
        {/* Title with enhanced styling */}
        <div className="relative z-10 text-base font-bold text-gray-700 bg-gray-100/80 px-4 py-2 mb-4 rounded-full transition-all duration-300 text-center backdrop-blur-sm border border-gray-200/50 group-hover:bg-gradient-to-r group-hover:from-red-500 group-hover:to-red-600 group-hover:text-white group-hover:shadow-lg font-['Playfair_Display']">
          {title}
        </div>
        
        {/* Image container with modern effects */}
        <div className="relative z-10 w-full flex-grow overflow-hidden rounded-xl flex items-center justify-center group-hover:scale-105 transition-transform duration-500">
          <div className="absolute inset-0 bg-gradient-to-t from-black/10 via-transparent to-transparent"></div>
          <img 
            src={image} 
            alt={title} 
            className="w-full h-full object-cover object-center transition-all duration-700 group-hover:brightness-110 group-hover:contrast-105" 
          />
          
          {/* Floating icon overlay */}
          <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
            <div className="bg-white/90 backdrop-blur-sm rounded-full p-3 shadow-lg transform translate-y-2 group-hover:translate-y-0 transition-transform duration-300">
              <svg className="w-5 h-5 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
              </svg>
            </div>
          </div>
        </div>
        
        {/* Subtle decorative elements */}
        <div className="absolute top-0 right-0 w-16 h-16 bg-gradient-to-br from-red-200/20 to-transparent rounded-full -translate-y-8 translate-x-8"></div>
        <div className="absolute bottom-0 left-0 w-12 h-12 bg-gradient-to-tr from-red-200/20 to-transparent rounded-full translate-y-6 -translate-x-6"></div>
        
        {/* Mobile responsive adjustments */}
        <style jsx>{`
          @media (max-width: 600px) {
            .w-48 {
              width: 10rem;
            }
            .h-56 {
              height: auto;
              min-height: 3rem;
            }
            .flex-grow {
              display: none;
            }
          }
        `}</style>
      </div>
    </Link>
  );
}