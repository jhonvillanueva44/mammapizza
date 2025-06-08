'use client';

import { useEffect, useState } from 'react';

const texts = [
    {
        title: '¡El sabor que conquista!',
        subtitle: 'Pizzas artesanales, recién horneadas',
        description: 'Descubre el auténtico sabor de nuestras pizzas hechas con ingredientes frescos y masa artesanal.',
    },
    {
        title: 'Tradición en cada mordida',
        subtitle: 'Recetas italianas auténticas',
        description: 'Nuestra masa se fermenta por 48 horas para lograr una textura perfecta y un sabor inolvidable.',
    },
    {
        title: 'Ingredientes frescos y deliciosos',
        subtitle: 'Calidad en cada pizza',
        description: 'Seleccionamos los mejores ingredientes del mercado para ofrecerte una pizza gourmet sin igual.',
    },
];

export default function Hero() {
    const [index, setIndex] = useState(0);

    useEffect(() => {
        const interval = setInterval(() => {
            setIndex((prevIndex) => (prevIndex + 1) % texts.length);
        }, 7000);
        return () => clearInterval(interval);
    }, []);

    return (
        <section className="relative w-full h-[60vh] sm:h-[70vh] md:h-[80vh] lg:h-[100vh] bg-gradient-to-b from-[#0C1011] to-[#1A1F20]">
            <div className="max-w-7xl mx-auto h-full px-6 sm:px-12 flex flex-col md:flex-row items-center md:items-start justify-between gap-10">
                <div className="flex-1 text-white flex flex-col justify-center h-full mt-15">
                    <h1
                        className="text-left text-4xl sm:text-5xl lg:text-7xl font-bold mb-3 sm:mb-5"
                        style={{ fontFamily: '"Dancing Script", cursive' }}
                    >
                        {texts[index].title}
                    </h1>
                    <p
                        className="text-left text-xl sm:text-2xl lg:text-4xl mb-2 sm:mb-3"
                        style={{ fontFamily: '"Dancing Script", cursive' }}
                    >
                        {texts[index].subtitle}
                    </p>
                    <p className="text-left max-w-md sm:max-w-xl mb-4 text-base sm:text-base lg:text-lg">
                        {texts[index].description}
                    </p>
                    <button
                        className="min-w-[120px] max-w-[200px] bg-red-600 hover:bg-red-700 text-white px-4 sm:px-6 py-2 rounded-2xl text-sm sm:text-base cursor-pointer"
                    >
                        Llámanos
                    </button>


                    <div className="mt-4 flex gap-2">
                        {texts.map((_, i) => (
                            <button
                                key={i}
                                onClick={() => setIndex(i)}
                                className={`w-3 h-3 rounded-full transition-colors duration-300 ${i === index ? 'bg-red-600' : 'bg-white'
                                    }`}
                                aria-label={`Slide ${i + 1}`}
                            />
                        ))}
                    </div>
                </div>

                <div className="hidden md:flex flex-1 justify-end items-center h-full hover:scale-110 transition-transform duration-300">
                    <img
                        src="/images/pizza-hero.png"
                        alt="Pizza deliciosa"
                        className="w-full max-w-xs sm:max-w-sm lg:max-w-md object-contain"
                    />
                </div>
            </div>
        </section>

    );
}
