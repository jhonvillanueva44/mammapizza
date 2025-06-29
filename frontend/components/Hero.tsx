//hero.tsx
'use client';

import { useEffect, useState } from 'react';

const texts = [
    {
        title: '¡El sabor que conquista!',
        subtitle: 'Pizzas artesanales, recién horneadas',
        description: 'Descubre el auténtico sabor de nuestras pizzas hechas con ingredientes frescos y masa artesanal.',
        emoji: '🍕'
    },
    {
        title: 'Tradición en cada mordida',
        subtitle: 'Recetas italianas auténticas',
        description: 'Nuestra masa se fermenta por 48 horas para lograr una textura perfecta y un sabor inolvidable.',
        emoji: '🇮🇹'
    },
    {
        title: 'Ingredientes frescos',
        subtitle: 'Calidad en cada pizza',
        description: 'Seleccionamos los mejores ingredientes del mercado para ofrecerte una pizza gourmet sin igual.',
        emoji: '🌟'
    },
];

export default function Hero() {
    const [index, setIndex] = useState(0);
    const [isAnimating, setIsAnimating] = useState(false);

    useEffect(() => {
        const interval = setInterval(() => {
            setIsAnimating(true);
            setTimeout(() => {
                setIndex((prevIndex) => (prevIndex + 1) % texts.length);
                setIsAnimating(false);
            }, 300);
        }, 7000);
        return () => clearInterval(interval);
    }, []);

    const handleSlideChange = (newIndex: number) => {
        if (newIndex === index || isAnimating) return;
        setIsAnimating(true);
        setTimeout(() => {
            setIndex(newIndex);
            setIsAnimating(false);
        }, 300);
    };

    return (
        <section className="relative w-full h-[60vh] sm:h-[70vh] md:h-[80vh] lg:h-[100vh] overflow-hidden">
          
            <div className="absolute inset-0 bg-gradient-to-br from-gray-900 via-gray-800 to-black">
              
                <div className="absolute top-0 left-0 w-full h-full opacity-10">
                    <div className="absolute top-20 left-20 w-32 h-32 rounded-full bg-red-500 blur-3xl"></div>
                    <div className="absolute bottom-20 right-20 w-40 h-40 rounded-full bg-red-600 blur-3xl"></div>
                    <div className="absolute top-1/2 left-1/3 w-24 h-24 rounded-full bg-red-400 blur-2xl"></div>
                </div>

             
                <div className="absolute inset-0 opacity-5" style={{
                    backgroundImage: `radial-gradient(circle at 50% 50%, rgba(220, 38, 38, 0.3) 1px, transparent 1px)`,
                    backgroundSize: '50px 50px'
                }}></div>
            </div>

            <div className="max-w-7xl mx-auto h-full px-6 sm:px-12 flex flex-col md:flex-row items-center md:items-start justify-between gap-10 relative z-10">
              
                <div className="flex-1 text-white flex flex-col justify-center h-full mt-15">

                    <div className={`transition-all duration-300 ${isAnimating ? 'opacity-0 transform translate-y-4' : 'opacity-100 transform translate-y-0'}`}>
                        <h1 className="text-left text-4xl sm:text-5xl lg:text-7xl font-bold mb-3 sm:mb-5 bg-gradient-to-r from-white via-red-100 to-red-200 bg-clip-text text-transparent leading-tight font-['Playfair_Display']">
                            {texts[index].title}
                        </h1>

            
                        <p className="text-left text-xl sm:text-2xl lg:text-4xl mb-4 sm:mb-6 text-red-300 font-['Dancing_Script'] font-semibold">
                            {texts[index].subtitle}
                        </p>

                
                        <p className="text-left max-w-md sm:max-w-xl mb-8 text-base sm:text-lg lg:text-xl text-gray-300 leading-relaxed font-['Open_Sans']">
                            {texts[index].description}
                        </p>
                    </div>

                    <div className="flex flex-col sm:flex-row gap-4 mb-8">
                        <a
                            href={`https://web.whatsapp.com/send?phone=${process.env.NEXT_PUBLIC_WHATSAPP_NUMBER}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="group relative overflow-hidden bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 text-white px-8 py-4 rounded-2xl text-base font-medium font-['Open_Sans'] transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-2xl cursor-pointer inline-block"
                        >
                            <span className="relative z-10 flex items-center justify-center gap-2">
                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21L6.16 11.37a11.045 11.045 0 005.516 5.516l1.983-2.034a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                                </svg>
                                Comunícate Ahora
                            </span>
                            <div className="absolute inset-0 bg-gradient-to-r from-red-500 to-red-600 transform translate-x-full group-hover:translate-x-0 transition-transform duration-300"></div>
                        </a>


                        <a
                            href="/menu/pizzas"
                            className="group border-2 border-red-500 hover:border-red-400 text-red-400 hover:text-white px-8 py-4 rounded-2xl text-base font-medium font-['Open_Sans'] transition-all duration-300 hover:bg-red-500 backdrop-blur-sm cursor-pointer inline-block"
                        >
                            <span className="flex items-center justify-center gap-2">
                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                                </svg>
                                Ver Menú
                            </span>
                        </a>

                    </div>

                    <div className="flex gap-3">
                        {texts.map((_, i) => (
                            <button
                                key={i}
                                onClick={() => handleSlideChange(i)}
                                className={`relative h-3 rounded-full transition-all duration-300 ${i === index
                                    ? 'w-12 bg-red-500 shadow-lg shadow-red-500/50'
                                    : 'w-3 bg-gray-600 hover:bg-gray-500'
                                    }`}
                                aria-label={`Slide ${i + 1}`}
                            >
                                {i === index && (
                                    <div className="absolute inset-0 bg-red-400 rounded-full animate-pulse"></div>
                                )}
                            </button>
                        ))}
                    </div>

                    <div className="mt-4 w-full max-w-xs bg-gray-700 rounded-full h-1 overflow-hidden">
                        <div
                            className="h-full bg-gradient-to-r from-red-500 to-red-600 rounded-full transition-all duration-75 ease-linear"
                            style={{
                                width: `${((index + 1) / texts.length) * 100}%`
                            }}
                        ></div>
                    </div>
                </div>

                <div className="hidden md:flex flex-1 justify-end items-center h-full relative">
             
                    <div className="absolute inset-0 flex items-center justify-center">
                        <div className="w-96 h-96 rounded-full border-4 border-red-500/20 animate-pulse"></div>
                        <div className="absolute w-80 h-80 rounded-full border-2 border-red-600/30 animate-ping"></div>
                    </div>

                   
                    <div className="relative z-10 group">
                        <img
                            src="/images/pizza-hero.png"
                            alt="Pizza deliciosa"
                            className="w-full max-w-xs sm:max-w-sm lg:max-w-md object-contain transition-all duration-700 group-hover:scale-110 group-hover:rotate-6 drop-shadow-2xl"
                        />

                        <div className="absolute -top-4 -right-4 bg-red-500 text-white px-3 py-1 rounded-full text-sm font-bold animate-bounce shadow-lg">
                            ¡Recién horneada!
                        </div>

                        <div className="absolute inset-0 bg-gradient-to-r from-red-500/20 to-transparent rounded-full blur-3xl -z-10 group-hover:from-red-400/30 transition-all duration-700"></div>
                    </div>
                </div>
            </div>

            <div className="absolute bottom-0 left-0 w-full h-20 bg-gradient-to-t from-red-900/20 to-transparent"></div>
        </section>
    );
}