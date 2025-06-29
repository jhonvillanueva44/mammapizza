import Image from "next/image";
import Footer from "@/components/Footer";
import { MapPin, Clock, Phone, Heart, Star, Trophy } from "lucide-react";

export default function SobreNosotros() {
  return (
    <div className="min-h-screen font-['Inter'] bg-gradient-to-br from-red-50/40 via-white to-red-50/30 mt-20">
      
      <section className="relative h-[70vh] flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-red-900/95 via-red-800/90 to-red-900/95"></div>
        
        <div className="relative z-10 max-w-5xl mx-auto px-4 text-center">
          
          <div className="space-y-4 mb-8">
            <h1 className="text-white text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold font-['Playfair_Display'] leading-tight">
              Nuestra{" "}
              <span className="block bg-gradient-to-r from-red-300 to-red-400 bg-clip-text text-transparent">
                Historia
              </span>
            </h1>
            <div className="flex items-center justify-center space-x-4 mb-6">
              <div className="h-1 w-12 bg-gradient-to-r from-transparent to-red-400 rounded-full"></div>
              <div className="h-1 w-12 bg-gradient-to-l from-transparent to-red-400 rounded-full"></div>
            </div>
            <p className="text-lg sm:text-xl md:text-2xl text-red-100 font-light max-w-3xl mx-auto leading-relaxed">
              Desde septiembre 2014, creando momentos especiales
              <span className="block text-red-200 text-base sm:text-lg mt-2">
                Una historia real de familia, pasión y superación
              </span>
            </p>
          </div>
        </div>
      </section>

      {/* HISTORIA PRINCIPAL */}
      <section className="py-20 px-4 relative">
        {/* Decorative elements */}
        <div className="absolute top-0 left-0 w-full h-32 bg-gradient-to-b from-red-800/5 to-transparent"></div>
        
        <div className="max-w-7xl mx-auto">
          {/* El Comienzo */}
          <div className="mb-20">
            <div className="bg-white rounded-3xl shadow-2xl overflow-hidden hover:shadow-3xl transition-all duration-500 border border-red-100/50">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-0">
                {/* Imagen vertical */}
                <div className="relative order-2 lg:order-1">
                  <div className="relative w-full h-96 lg:h-full min-h-[400px] overflow-hidden">
                    <Image
                      src="/images/imagenpartepizza.jpg"
                      alt="Inicio de Mamma Pizza 2014"
                      fill
                      className="object-cover hover:scale-110 transition-transform duration-700"
                      sizes="(max-width: 768px) 100vw, 50vw"
                    />
                    <div className="absolute inset-0 bg-gradient-to-tr from-red-900/20 via-transparent to-red-500/10"></div>
                    <div className="absolute top-6 left-6">
                      <div className="bg-white/95 backdrop-blur-sm px-4 py-2 rounded-full shadow-lg">
                        <span className="text-red-800 font-bold text-sm">Septiembre 2014</span>
                      </div>
                    </div>
                  </div>
                </div>
                
                {/* Contenido */}
                <div className="p-8 md:p-12 lg:p-16 order-1 lg:order-2 flex flex-col justify-center">
                  <div className="space-y-8">
                    <div>
                      <span className="inline-block px-6 py-3 bg-gradient-to-r from-red-100 to-red-200 text-red-800 rounded-full text-sm font-bold mb-6 shadow-lg">
                        El Comienzo
                      </span>
                      <h2 className="text-4xl sm:text-5xl md:text-6xl font-bold text-transparent bg-gradient-to-r from-red-900 to-red-700 bg-clip-text font-['Playfair_Display'] mb-6 leading-tight">
                        2014
                      </h2>
                    </div>
                    
                    <div className="space-y-6 text-gray-700 text-lg leading-relaxed font-['Open_Sans']">
                      <p className="text-xl font-medium text-red-900">
                        Todo comenzó en septiembre del 2014, cuando decidimos transformar una simple idea en un espacio donde el buen sabor y los momentos especiales fueran protagonistas.
                      </p>
                      <p>
                        Nació un sueño: llevar a cada mesa una pizza hecha con amor, tradición y ese toque casero que solo una verdadera familia puede ofrecer. Así comenzó la historia de <span className="font-bold text-red-800">Mamma Pizza</span>, un pequeño emprendimiento que fue creciendo a pulso, entre sonrisas, esfuerzo y muchas ganas de compartir momentos inolvidables con cada cliente.
                      </p>
                    </div>
                    
                    <div className="flex space-x-3 pt-4">
                      <div className="w-4 h-4 bg-gradient-to-r from-red-500 to-red-600 rounded-full animate-pulse"></div>
                      <div className="w-4 h-4 bg-gradient-to-r from-red-600 to-red-700 rounded-full animate-pulse delay-100"></div>
                      <div className="w-4 h-4 bg-gradient-to-r from-red-700 to-red-800 rounded-full animate-pulse delay-200"></div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Los Desafíos - IMAGEN HORIZONTAL CORREGIDA */}
          <div className="mb-20">
            <div className="bg-gradient-to-br from-white to-red-50/30 rounded-3xl shadow-2xl overflow-hidden hover:shadow-3xl transition-all duration-500 border border-red-100/50">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-0">
                {/* Contenido */}
                <div className="p-8 md:p-12 lg:p-16 flex flex-col justify-center">
                  <div className="space-y-8">
                    <div>
                      <span className="inline-block px-6 py-3 bg-gradient-to-r from-red-100 to-red-200 text-red-800 rounded-full text-sm font-bold mb-6 shadow-lg">
                        Los Desafíos
                      </span>
                      <h2 className="text-4xl sm:text-5xl font-bold text-transparent bg-gradient-to-r from-red-600 to-red-700 bg-clip-text font-['Playfair_Display'] mb-6 leading-tight">
                        Creciendo Juntos
                      </h2>
                    </div>
                    
                    <div className="space-y-6 text-gray-700 text-lg leading-relaxed font-['Open_Sans']">
                      <p className="text-xl font-medium text-red-900">
                        Pero nuestro camino no ha sido fácil. Como toda familia, hemos pasado por momentos de unión… y también de diferencia.
                      </p>
                      <p>
                        Hubo días de acuerdos y otros de largas conversaciones para encontrar un rumbo común. Disputas familiares que pusieron a prueba no solo nuestro negocio, sino también nuestros vínculos.
                      </p>
                      <p className="font-medium text-red-800 bg-red-50 p-4 rounded-xl border-l-4 border-red-400">
                        Porque detrás de cada pizza que sale de nuestro horno hay una historia real, con personas que aman lo que hacen, pero que también han aprendido a crecer juntos, incluso en la adversidad.
                      </p>
                    </div>
                  </div>
                </div>
                
                {/* Imagen horizontal - CORREGIDA PARA QUE SE VEA COMPLETA */}
                <div className="relative">
                  <div className="relative w-full h-64 lg:h-full min-h-[300px] overflow-hidden">
                    <Image
                      src="/images/imagenpizzero.jpg"
                      alt="Familia trabajando en Mamma Pizza"
                      fill
                      className="object-cover object-center hover:scale-110 transition-transform duration-700"
                      sizes="(max-width: 768px) 100vw, 50vw"
                    />
                    <div className="absolute inset-0 bg-gradient-to-tl from-red-900/20 via-transparent to-red-500/10"></div>
                    <div className="absolute bottom-6 right-6">
                      <div className="bg-white/95 backdrop-blur-sm px-4 py-2 rounded-full shadow-lg">
                        <span className="text-red-800 font-bold text-sm">Más de una década</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* El Presente - CON IMAGEN VERTICAL AÑADIDA */}
          <div className="mb-20">
            <div className="bg-white rounded-3xl shadow-2xl overflow-hidden hover:shadow-3xl transition-all duration-500 border border-red-100/50">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-0">
                {/* Imagen vertical */}
                <div className="relative order-2 lg:order-1">
                  <div className="relative w-full h-96 lg:h-full min-h-[500px] overflow-hidden">
                    <Image
                      src="/images/imagenpizza.jpg"
                      alt="Mamma Pizza hoy en día"
                      fill
                      className="object-cover hover:scale-110 transition-transform duration-700"
                      sizes="(max-width: 768px) 100vw, 50vw"
                    />
                    <div className="absolute inset-0 bg-gradient-to-tr from-red-900/20 via-transparent to-red-500/10"></div>
                    <div className="absolute top-6 left-6">
                      <div className="bg-white/95 backdrop-blur-sm px-4 py-2 rounded-full shadow-lg">
                        <span className="text-red-800 font-bold text-sm">2024</span>
                      </div>
                    </div>
                  </div>
                </div>
                
                {/* Contenido */}
                <div className="p-8 md:p-12 lg:p-16 order-1 lg:order-2 flex flex-col justify-center">
                  <div className="space-y-8">
                    <div>
                      <span className="inline-block px-6 py-3 bg-gradient-to-r from-red-100 to-red-200 text-red-800 rounded-full text-sm font-bold mb-6 shadow-lg">
                        Hoy en Día
                      </span>
                      <h2 className="text-4xl sm:text-5xl font-bold text-transparent bg-gradient-to-r from-red-600 to-red-700 bg-clip-text font-['Playfair_Display'] mb-6 leading-tight">
                        Más que una Pizzería
                      </h2>
                    </div>
                    
                    <div className="space-y-6 text-gray-700 text-lg leading-relaxed font-['Open_Sans']">
                      <p className="text-xl font-medium text-red-900">
                        Hoy, después de más de una década, podemos decir con orgullo que Mamma Pizza es mucho más que una pizzería.
                      </p>
                      <p>
                        Es un símbolo de constancia, de lucha y de pasión por el buen sabor. Hemos visto crecer a clientes que llegaron siendo niños y hoy nos visitan con sus propios hijos.
                      </p>
                      <div className="bg-gradient-to-r from-red-50 to-red-100 p-6 rounded-2xl border border-red-200">
                        <p className="text-lg font-bold text-red-800 italic">
                          "Cada masa que amasamos, cada ingrediente que elegimos, cada horno encendido… es el resultado de años de trabajo y compromiso inquebrantable."
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* VALORES - CON ICONOS */}
      <section className="py-20 px-4 bg-gradient-to-br from-red-50/50 to-red-100/30">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl sm:text-5xl font-bold text-transparent bg-gradient-to-r from-red-900 to-red-700 bg-clip-text font-['Playfair_Display'] mb-6">
              Nuestros Valores
            </h2>
            <div className="w-32 h-1 bg-gradient-to-r from-red-500 to-red-600 mx-auto rounded-full"></div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                title: "Amor Familiar",
                description: "Cada pizza lleva el cariño y la dedicación de una familia que cree en lo que hace",
                gradient: "from-red-500 to-red-600",
                icon: Heart
              },
              {
                title: "Pasión Constante",
                description: "Más de una década perfeccionando recetas y creando momentos especiales",
                gradient: "from-red-600 to-red-700",
                icon: Star
              },
              {
                title: "Superación",
                description: "Hemos convertido cada desafío en una oportunidad para crecer y mejorar",
                gradient: "from-red-700 to-red-800",
                icon: Trophy
              }
            ].map((valor, index) => {
              const IconComponent = valor.icon;
              return (
                <div key={index} className="group">
                  <div className="bg-white rounded-2xl p-8 shadow-lg hover:shadow-2xl transition-all duration-500 text-center transform hover:-translate-y-2 border border-red-100/50">
                    <div className={`w-20 h-20 bg-gradient-to-r ${valor.gradient} rounded-full flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform duration-300 shadow-lg`}>
                      <IconComponent className="w-8 h-8 text-white" />
                    </div>
                    <h3 className="text-2xl font-bold text-red-900 font-['Playfair_Display'] mb-4">
                      {valor.title}
                    </h3>
                    <p className="text-gray-600 font-['Open_Sans'] leading-relaxed">
                      {valor.description}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* UBICACIÓN */}
      <section className="py-20 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl sm:text-5xl font-bold text-transparent bg-gradient-to-r from-red-900 to-red-700 bg-clip-text font-['Playfair_Display'] mb-6">
              Encuéntranos
            </h2>
            <p className="text-xl text-gray-600 font-['Open_Sans'] max-w-3xl mx-auto">
              Te esperamos en nuestro hogar, donde cada pizza tiene historia y cada cliente se convierte en familia
            </p>
            <div className="w-32 h-1 bg-gradient-to-r from-red-500 to-red-600 mx-auto mt-6 rounded-full"></div>
          </div>

          <div className="bg-white rounded-3xl shadow-2xl overflow-hidden border border-red-100/50">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-0">
              <div className="p-8 md:p-12 flex flex-col justify-center bg-gradient-to-br from-white to-red-50/20">
                <div className="space-y-8">
                  <h3 className="text-3xl font-bold text-red-900 font-['Playfair_Display']">
                    Nuestra Casa
                  </h3>
                  
                  <div className="space-y-6">
                    <div className="flex items-start space-x-4 p-4 bg-red-50/50 rounded-xl">
                      <div className="w-12 h-12 bg-gradient-to-r from-red-500 to-red-600 rounded-full flex items-center justify-center flex-shrink-0">
                        <MapPin className="w-6 h-6 text-white" />
                      </div>
                      <div>
                        <h4 className="font-bold text-red-900 mb-1">Dirección</h4>
                        <p className="text-gray-700 font-['Open_Sans']">
                          Calle Granados 529 California<br />
                          Víctor Larco Herrera, Perú 13001, Trujillo
                        </p>
                      </div>
                    </div>

                    <div className="flex items-start space-x-4 p-4 bg-red-50/50 rounded-xl">
                      <div className="w-12 h-12 bg-gradient-to-r from-red-600 to-red-700 rounded-full flex items-center justify-center flex-shrink-0">
                        <Clock className="w-6 h-6 text-white" />
                      </div>
                      <div>
                        <h4 className="font-bold text-red-900 mb-1">Horarios</h4>
                        <p className="text-gray-700 font-['Open_Sans']">
                          Lunes a Domingo<br />
                          06:00 PM - 11:00 PM
                        </p>
                      </div>
                    </div>

                    <div className="flex items-start space-x-4 p-4 bg-red-50/50 rounded-xl">
                      <div className="w-12 h-12 bg-gradient-to-r from-red-700 to-red-800 rounded-full flex items-center justify-center flex-shrink-0">
                        <Phone className="w-6 h-6 text-white" />
                      </div>
                      <div>
                        <h4 className="font-bold text-red-900 mb-1">Contacto</h4>
                        <p className="text-gray-700 font-['Open_Sans']">
                          989 481 847
                        </p>
                      </div>
                    </div>
                  </div>

                  <a
                    href="https://www.google.com/maps/place/MammaPizza/@-8.1326004,-79.03972,17z/data=!3m1!4b1!4m6!3m5!1s0x91ad3d12d4889cad:0x6fa247c62dc910ed!8m2!3d-8.1326004!4d-79.03972!16s%2Fg%2F11cn949l64?hl=es-419&entry=ttu"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center justify-center w-full px-8 py-4 bg-gradient-to-r from-red-600 to-red-700 text-white font-bold rounded-xl hover:from-red-700 hover:to-red-800 transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl"
                  >
                    Ver en Google Maps
                  </a>
                </div>
              </div>

              <div className="relative group min-h-[400px]">
                <a
                  href="https://www.google.com/maps/place/MammaPizza/@-8.1326004,-79.03972,17z/data=!3m1!4b1!4m6!3m5!1s0x91ad3d12d4889cad:0x6fa247c62dc910ed!8m2!3d-8.1326004!4d-79.03972!16s%2Fg%2F11cn949l64?hl=es-419&entry=ttu"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="block w-full h-full"
                >
                  <div className="relative w-full h-full">
                    <Image
                      src="/images/ubicacion.png"
                      alt="Ubicación de Mamma Pizza"
                      fill
                      className="object-cover group-hover:scale-110 transition-transform duration-700"
                      sizes="(max-width: 768px) 100vw, 50vw"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-transparent group-hover:from-black/40 transition-all duration-300"></div>
                    <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                      <div className="bg-white/95 backdrop-blur-sm rounded-2xl p-6 transform scale-75 group-hover:scale-100 transition-transform duration-300 shadow-2xl">
                        <div className="text-center">
                          <p className="text-red-900 font-bold">Ver en mapa</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA FINAL */}
      <section className="py-20 px-4 bg-gradient-to-r from-red-900 via-red-800 to-red-900 relative overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="w-full h-full bg-repeat" style={{backgroundImage: "url('data:image/svg+xml,%3Csvg width=\"60\" height=\"60\" viewBox=\"0 0 60 60\" xmlns=\"http://www.w3.org/2000/svg\"%3E%3Cg fill=\"none\" fill-rule=\"evenodd\"%3E%3Cg fill=\"%23ffffff\" fill-opacity=\"0.1\"%3E%3Ccircle cx=\"30\" cy=\"30\" r=\"2\"/%3E%3C/g%3E%3C/g%3E%3C/svg%3E')"}}></div>
        </div>
        
        <div className="relative max-w-5xl mx-auto text-center text-white">
          <div className="mb-8">
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold font-['Playfair_Display'] mb-6">
              El sabor de la felicidad
            </h2>
            <p className="text-xl sm:text-2xl text-red-100 leading-relaxed font-['Open_Sans'] max-w-3xl mx-auto">
              Ven y forma parte de nuestra historia. Porque en Mamma Pizza, cada cliente se convierte en familia.
            </p>
          </div>
          
          <div className="flex flex-col sm:flex-row gap-6 justify-center items-center">
            <a
              href="/menu/pizzas"
              className="group inline-flex items-center px-10 py-5 bg-white text-red-900 font-bold rounded-2xl hover:bg-red-50 transition-all duration-300 transform hover:scale-105 shadow-2xl hover:shadow-3xl"
            >
              <span className="text-lg">Descubre Nuestro Menú</span>
            </a>
            <a
              href={`https://web.whatsapp.com/send?phone=${process.env.NEXT_PUBLIC_WHATSAPP_NUMBER}`}
              target="_blank"
              rel="noopener noreferrer"
              className="group inline-flex items-center px-10 py-5 border-3 border-white text-white font-bold rounded-2xl hover:bg-white hover:text-red-900 transition-all duration-300 transform hover:scale-105 shadow-2xl hover:shadow-3xl"
            >
              <span className="text-lg">Haz tu Pedido</span>
            </a>
          </div>
          
          <div className="mt-12 text-center">
            <p className="text-red-200 text-lg font-['Playfair_Display'] italic">
              "Mamma Pizza – El sabor de la felicidad"
            </p>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}