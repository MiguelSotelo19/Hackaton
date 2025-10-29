'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { storage } from '@/lib/api';
import { User } from '@/types';
import { Leaf, MapPin, TrendingUp, DollarSign, Calendar, Award, Briefcase, Building2, LogOut, ShoppingCart, BarChart3, Users, Globe, Package, Mail, Sprout } from 'lucide-react';
import Link from 'next/link';

export default function PerfilPage() {
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadUser = () => {
      const token = storage.getToken();
      const userData = storage.getUser();

      if (!token || !userData) {
        router.push('/auth');
        return;
      }

      setUser(userData);
      setLoading(false);
    };

    loadUser();
  }, [router]);

  const handleLogout = () => {
    storage.clear();
    router.push('/');
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-950 to-indigo-900 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-blue-400 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-white text-lg">Cargando perfil...</p>
        </div>
      </div>
    );
  }

  if (!user) return null;

  const isAgricultor = user.tipo === 'agricultor';

  const config = {
    agricultor: {
      theme: {
        primary: 'emerald',
        secondary: 'teal',
        gradient: 'from-emerald-500 to-teal-600',
        bgGradient: 'from-emerald-950 via-teal-900 to-green-950',
        glowColor: 'emerald-500',
      },
      title: 'Mi Perfil de Agricultor',
      subtitle: 'Gestiona tu parcela y créditos de carbono',
      icon: Sprout,
    },
    empresa: {
      theme: {
        primary: 'blue',
        secondary: 'indigo',
        gradient: 'from-blue-500 to-indigo-600',
        bgGradient: 'from-blue-950 via-indigo-900 to-purple-950',
        glowColor: 'blue-500',
      },
      title: 'Mi Perfil Empresarial',
      subtitle: 'Dashboard de impacto ambiental',
      icon: Briefcase,
    }
  };

  const activeConfig = config[user.tipo];

  return (
    <div className={`min-h-screen bg-gradient-to-br ${activeConfig.theme.bgGradient}`}>
      {/* Background Effects */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className={`absolute top-20 left-10 w-72 h-72 bg-${activeConfig.theme.primary}-500/10 rounded-full blur-3xl animate-pulse`}></div>
        <div className={`absolute bottom-20 right-10 w-96 h-96 bg-${activeConfig.theme.secondary}-500/10 rounded-full blur-3xl animate-pulse`} style={{ animationDelay: '1s' }}></div>
      </div>

      {/* Header */}
      <header className="relative z-50 bg-black/30 backdrop-blur-xl border-b border-white/10">
        <div className="container mx-auto px-4 md:px-6 py-3 md:py-4">
          <div className="flex items-center justify-between">
            <Link href="/" className="flex items-center gap-2 md:gap-3">
              <div className={`bg-gradient-to-br ${activeConfig.theme.gradient} p-2 md:p-2.5 rounded-xl shadow-lg`}>
                <Leaf className="w-5 h-5 md:w-7 md:h-7 text-white" />
              </div>
              <div>
                <h1 className="text-lg md:text-2xl font-bold text-white">
                  Agro<strong className="bg-gradient-to-r from-emerald-200 via-teal-400 to-green-200 bg-clip-text text-transparent">Can</strong>e
                </h1>
                <p className={`text-${activeConfig.theme.primary}-300 text-xs hidden md:block`}>
                  Mi Perfil
                </p>
              </div>
            </Link>

            <div className="flex items-center gap-2 md:gap-3">
              {isAgricultor ? (
                <Link
                  href="/mapa"
                  className={`hidden md:flex items-center gap-2 px-4 py-2 bg-white/10 hover:bg-white/20 text-white rounded-lg transition-all font-medium`}
                >
                  <MapPin className="w-4 h-4" />
                  Ver Mapa
                </Link>
              ) : (
                <Link
                  href="/mapa"
                  className={`flex items-center gap-2 px-3 md:px-4 py-2 bg-gradient-to-r ${activeConfig.theme.gradient} hover:opacity-90 text-white rounded-lg transition-all font-semibold shadow-lg`}
                >
                  <ShoppingCart className="w-4 h-4" />
                  <span className="hidden sm:inline">Comprar Créditos</span>
                </Link>
              )}

              <button
                onClick={handleLogout}
                className="flex items-center gap-2 px-3 md:px-4 py-2 bg-red-500/20 hover:bg-red-500/30 text-red-300 hover:text-red-200 rounded-lg transition-all border border-red-400/30 font-medium"
              >
                <LogOut className="w-4 h-4" />
                <span className="hidden sm:inline">Salir</span>
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="relative z-10 container mx-auto px-4 md:px-6 py-6 md:py-12">
        {/* Welcome Banner */}
        <div className={`bg-gradient-to-r ${activeConfig.theme.gradient} rounded-2xl md:rounded-3xl p-6 md:p-8 mb-6 md:mb-8 shadow-2xl`}>
          <div className="flex items-start justify-between">
            <div>
              <div className="flex items-center gap-3 mb-2">
                <activeConfig.icon className="w-8 h-8 md:w-10 md:h-10 text-white" />
                <h2 className="text-2xl md:text-4xl font-black text-white">
                  ¡Hola, {user.nombre}!
                </h2>
              </div>
              <p className="text-white/90 text-sm md:text-lg mb-3 md:mb-4">
                {activeConfig.subtitle}
              </p>
              <div className="flex items-center gap-2 text-white/80 text-xs md:text-sm">
                <Mail className="w-4 h-4" />
                <span>{user.email}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Agricultor Profile */}
        {isAgricultor && (
          <div className="space-y-6">
            {/* Stats Grid */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4">
              <div className="bg-white/10 backdrop-blur-xl rounded-xl md:rounded-2xl p-4 md:p-6 border border-white/20">
                <div className="flex items-center gap-2 mb-2">
                  <MapPin className={`w-5 h-5 text-${activeConfig.theme.primary}-400`} />
                  <span className={`text-${activeConfig.theme.primary}-300 text-xs font-semibold`}>Hectáreas</span>
                </div>
                <p className="text-2xl md:text-4xl font-black text-white">{user.hectareas}</p>
              </div>

              <div className="bg-white/10 backdrop-blur-xl rounded-xl md:rounded-2xl p-4 md:p-6 border border-white/20">
                <div className="flex items-center gap-2 mb-2">
                  <Leaf className={`w-5 h-5 text-${activeConfig.theme.secondary}-400`} />
                  <span className={`text-${activeConfig.theme.secondary}-300 text-xs font-semibold`}>CO₂ Disponible</span>
                </div>
                <p className="text-2xl md:text-4xl font-black text-white">{user.toneladas_co2}</p>
                <p className={`text-${activeConfig.theme.secondary}-300 text-xs mt-1`}>toneladas</p>
              </div>

              <div className="bg-white/10 backdrop-blur-xl rounded-xl md:rounded-2xl p-4 md:p-6 border border-white/20">
                <div className="flex items-center gap-2 mb-2">
                  <DollarSign className="w-5 h-5 text-blue-400" />
                  <span className="text-blue-300 text-xs font-semibold">Precio/Ton</span>
                </div>
                <p className="text-2xl md:text-4xl font-black text-white">${user.precio_por_tonelada}</p>
              </div>

              <div className="bg-white/10 backdrop-blur-xl rounded-xl md:rounded-2xl p-4 md:p-6 border border-white/20">
                <div className="flex items-center gap-2 mb-2">
                  <TrendingUp className="w-5 h-5 text-purple-400" />
                  <span className="text-purple-300 text-xs font-semibold">Valor Total</span>
                </div>
                <p className="text-2xl md:text-4xl font-black text-white">
                  ${((user.toneladas_co2 || 0) * (user.precio_por_tonelada || 0)).toFixed(0)}
                </p>
              </div>
            </div>

            {/* Parcela Info */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div className="bg-white/10 backdrop-blur-xl rounded-2xl p-6 border border-white/20">
                <h3 className={`text-xl font-bold text-white mb-4 flex items-center gap-2`}>
                  <MapPin className={`w-6 h-6 text-${activeConfig.theme.primary}-400`} />
                  Información de la Parcela
                </h3>
                
                <div className="space-y-4">
                  <div className="flex items-start gap-3 bg-white/5 rounded-xl p-3">
                    <MapPin className="w-5 h-5 text-emerald-400 mt-0.5 flex-shrink-0" />
                    <div>
                      <p className="text-white/60 text-xs">Ubicación</p>
                      <p className="text-white font-bold">{user.ubicacion_estado}</p>
                      <p className="text-white/60 text-xs mt-1">
                        Lat: {user.ubicacion_lat?.toFixed(4)}, Lng: {user.ubicacion_lng?.toFixed(4)}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3 bg-white/5 rounded-xl p-3">
                    <Calendar className="w-5 h-5 text-teal-400 mt-0.5 flex-shrink-0" />
                    <div>
                      <p className="text-white/60 text-xs">Fecha de Siembra</p>
                      <p className="text-white font-bold">
                        {user.fecha_siembra ? new Date(user.fecha_siembra).toLocaleDateString('es-MX', {
                          year: 'numeric',
                          month: 'long',
                          day: 'numeric'
                        }) : 'No especificada'}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3 bg-white/5 rounded-xl p-3">
                    <Award className="w-5 h-5 text-yellow-400 mt-0.5 flex-shrink-0" />
                    <div>
                      <p className="text-white/60 text-xs">Estado</p>
                      <div className="flex items-center gap-2 mt-1">
                        <span className="px-3 py-1 bg-green-500/20 border border-green-400/30 rounded-full text-green-300 text-xs font-semibold">
                          ✓ Verificado
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="bg-white/10 backdrop-blur-xl rounded-2xl p-6 border border-white/20">
                <h3 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
                  <Package className="w-6 h-6 text-blue-400" />
                  Foto de la Parcela
                </h3>
                
                {user.foto_url ? (
                  <img 
                    src={user.foto_url} 
                    alt="Parcela"
                    className="w-full h-64 object-cover rounded-xl"
                  />
                ) : (
                  <div className="w-full h-64 bg-white/5 rounded-xl flex items-center justify-center">
                    <p className="text-white/40">Sin foto</p>
                  </div>
                )}

                <div className="mt-4 bg-emerald-500/10 border border-emerald-400/30 rounded-xl p-4">
                  <p className="text-emerald-300 text-sm">
                    💰 <strong>Ingreso potencial:</strong> Si vendes toda tu producción, podrías generar{' '}
                    <span className="font-bold text-emerald-200">
                      ${((user.toneladas_co2 || 0) * (user.precio_por_tonelada || 0)).toLocaleString()} USD
                    </span>
                  </p>
                </div>
              </div>
            </div>

            {/* CTA */}
            <div className={`bg-gradient-to-r ${activeConfig.theme.gradient} rounded-2xl p-6 text-center shadow-xl`}>
              <h3 className="text-2xl font-bold text-white mb-2">¿Listo para vender tus créditos?</h3>
              <p className="text-white/90 mb-4">Conecta con empresas que buscan compensar sus emisiones</p>
              <button className="px-8 py-3 bg-white text-emerald-600 font-bold rounded-xl hover:bg-emerald-50 transition-all shadow-lg">
                Ver Compradores Interesados
              </button>
            </div>
          </div>
        )}

        {/* Empresa Profile */}
        {!isAgricultor && (
          <div className="space-y-6">
            {/* Stats Grid */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4">
              <div className="bg-white/10 backdrop-blur-xl rounded-xl md:rounded-2xl p-4 md:p-6 border border-white/20">
                <div className="flex items-center gap-2 mb-2">
                  <Building2 className="w-5 h-5 text-blue-400" />
                  <span className="text-blue-300 text-xs font-semibold">RFC</span>
                </div>
                <p className="text-xl md:text-2xl font-bold text-white">{user.rfc || 'N/A'}</p>
              </div>

              <div className="bg-white/10 backdrop-blur-xl rounded-xl md:rounded-2xl p-4 md:p-6 border border-white/20">
                <div className="flex items-center gap-2 mb-2">
                  <ShoppingCart className="w-5 h-5 text-indigo-400" />
                  <span className="text-indigo-300 text-xs font-semibold">Compras</span>
                </div>
                <p className="text-2xl md:text-4xl font-black text-white">0</p>
                <p className="text-indigo-300 text-xs mt-1">créditos</p>
              </div>

              <div className="bg-white/10 backdrop-blur-xl rounded-xl md:rounded-2xl p-4 md:p-6 border border-white/20">
                <div className="flex items-center gap-2 mb-2">
                  <Globe className="w-5 h-5 text-purple-400" />
                  <span className="text-purple-300 text-xs font-semibold">CO₂ Compensado</span>
                </div>
                <p className="text-2xl md:text-4xl font-black text-white">0</p>
                <p className="text-purple-300 text-xs mt-1">toneladas</p>
              </div>

              <div className="bg-white/10 backdrop-blur-xl rounded-xl md:rounded-2xl p-4 md:p-6 border border-white/20">
                <div className="flex items-center gap-2 mb-2">
                  <Users className="w-5 h-5 text-pink-400" />
                  <span className="text-pink-300 text-xs font-semibold">Agricultores</span>
                </div>
                <p className="text-2xl md:text-4xl font-black text-white">0</p>
                <p className="text-pink-300 text-xs mt-1">apoyados</p>
              </div>
            </div>

            {/* Info Cards */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div className="bg-white/10 backdrop-blur-xl rounded-2xl p-6 border border-white/20">
                <h3 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
                  <BarChart3 className="w-6 h-6 text-blue-400" />
                  Dashboard de Impacto
                </h3>
                
                <div className="space-y-3">
                  <div className="bg-blue-500/10 border border-blue-400/30 rounded-xl p-4">
                    <p className="text-blue-300 text-sm mb-1">Total Invertido</p>
                    <p className="text-3xl font-black text-white">$0 USD</p>
                  </div>

                  <div className="bg-indigo-500/10 border border-indigo-400/30 rounded-xl p-4">
                    <p className="text-indigo-300 text-sm mb-1">Impacto Ambiental</p>
                    <p className="text-white text-sm">
                      Equivalente a <span className="font-bold text-indigo-200">0 autos</span> fuera de circulación
                    </p>
                  </div>

                  <div className="bg-purple-500/10 border border-purple-400/30 rounded-xl p-4">
                    <p className="text-purple-300 text-sm mb-1">Certificaciones</p>
                    <span className="px-3 py-1 bg-purple-500/20 rounded-full text-purple-200 text-xs font-semibold">
                      ISO 14064
                    </span>
                  </div>
                </div>
              </div>

              <div className="bg-white/10 backdrop-blur-xl rounded-2xl p-6 border border-white/20">
                <h3 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
                  <Award className="w-6 h-6 text-yellow-400" />
                  Próximos Pasos
                </h3>

                <div className="space-y-3">
                  <div className="bg-white/5 rounded-xl p-4 border border-white/10">
                    <div className="flex items-start gap-3">
                      <div className="bg-blue-500 text-white rounded-full w-6 h-6 flex items-center justify-center flex-shrink-0 font-bold text-sm">
                        1
                      </div>
                      <div>
                        <p className="text-white font-semibold">Explora el Marketplace</p>
                        <p className="text-white/60 text-sm">Encuentra agricultores con créditos disponibles</p>
                      </div>
                    </div>
                  </div>

                  <div className="bg-white/5 rounded-xl p-4 border border-white/10">
                    <div className="flex items-start gap-3">
                      <div className="bg-indigo-500 text-white rounded-full w-6 h-6 flex items-center justify-center flex-shrink-0 font-bold text-sm">
                        2
                      </div>
                      <div>
                        <p className="text-white font-semibold">Compra Créditos</p>
                        <p className="text-white/60 text-sm">Selecciona y adquiere tokens verificados</p>
                      </div>
                    </div>
                  </div>

                  <div className="bg-white/5 rounded-xl p-4 border border-white/10">
                    <div className="flex items-start gap-3">
                      <div className="bg-purple-500 text-white rounded-full w-6 h-6 flex items-center justify-center flex-shrink-0 font-bold text-sm">
                        3
                      </div>
                      <div>
                        <p className="text-white font-semibold">Descarga Reportes</p>
                        <p className="text-white/60 text-sm">Obtén certificados para stakeholders</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* CTA */}
            <div className={`bg-gradient-to-r ${activeConfig.theme.gradient} rounded-2xl p-6 md:p-8 text-center shadow-xl`}>
              <h3 className="text-2xl md:text-3xl font-bold text-white mb-2">Comienza tu Estrategia de Carbono Neutral</h3>
              <p className="text-white/90 mb-4 text-sm md:text-base">Accede al marketplace y encuentra los mejores créditos certificados</p>
              <Link
                href="/mapa"
                className="inline-flex items-center gap-2 px-8 py-3 bg-white text-blue-600 font-bold rounded-xl hover:bg-blue-50 transition-all shadow-lg"
              >
                <ShoppingCart className="w-5 h-5" />
                Ir al Marketplace
              </Link>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}