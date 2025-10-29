'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { storage } from '@/lib/api';
import { User } from '@/types';
import { Leaf, MapPin, TrendingUp, DollarSign, Calendar, Award, Briefcase, Building2, LogOut, ShoppingCart, BarChart3, Users, Globe, Package, Mail, Sprout, Wallet, TreePine, Clock } from 'lucide-react';
import Link from 'next/link';

export default function PerfilPage() {
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadUser = () => {
      const token = storage.getToken();
      const userData = storage.getUser();
        console.log("user:" ,user)
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

  // Cálculos para agricultor
  const valorTotal = (user.toneladas_co2 || 0) * (user.precio_por_tonelada || 0);
  const ingresoPotencial = valorTotal;
  const diasDesdeCreacion = user.createdAt 
    ? Math.floor((Date.now() - new Date(user.createdAt).getTime()) / (1000 * 60 * 60 * 24))
    : 0;

  // Badge levels para agricultores
  const getBadgeInfo = (level: string) => {
    const badges: any = {
      nuevo: { color: 'gray', emoji: '🌱', nombre: 'Nuevo' },
      bronce: { color: 'orange', emoji: '🥉', nombre: 'Bronce' },
      plata: { color: 'gray', emoji: '🥈', nombre: 'Plata' },
      oro: { color: 'yellow', emoji: '🥇', nombre: 'Oro' },
      platino: { color: 'blue', emoji: '💎', nombre: 'Platino' }
    };
    return badges[level || 'nuevo'] || badges.nuevo;
  };

  const badgeInfo = getBadgeInfo(user.badge_level || 'nuevo');

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
                {isAgricultor ? (
                  <h1 className="text-lg md:text-2xl font-bold text-white">
                    Agro<strong className="bg-gradient-to-r from-emerald-200 via-teal-400 to-green-200 bg-clip-text text-transparent">Can</strong>e
                  </h1>
                ) : (
                  <h1 className="text-lg md:text-2xl font-bold text-white">
                    Agro<strong className="bg-gradient-to-r from-blue-200 via-indigo-500 to-purple-200 bg-clip-text text-transparent">Can</strong>e
                  </h1>
                )}
                
                <p className={`text-${activeConfig.theme.primary}-300 text-xs hidden md:block`}>
                  Mi Perfil
                </p>
              </div>
            </Link>

            <div className="flex items-center gap-2 md:gap-3">
              {isAgricultor ? (
                <></>
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
          <div className="flex items-start justify-between flex-wrap gap-4">
            <div className="flex-1">
              <div className="flex items-center gap-3 mb-2">
                <activeConfig.icon className="w-8 h-8 md:w-10 md:h-10 text-white" />
                <h2 className="text-2xl md:text-4xl font-black text-white">
                  ¡Hola, {user.nombre}!
                </h2>
              </div>
              <p className="text-white/90 text-sm md:text-lg mb-3 md:mb-4">
                {activeConfig.subtitle}
              </p>
              <div className="flex flex-wrap items-center gap-3 text-white/80 text-xs md:text-sm">
                <div className="flex items-center gap-2">
                  <Mail className="w-4 h-4" />
                  <span>{user.email}</span>
                </div>
                {user.createdAt && (
                  <div className="flex items-center gap-2">
                    <Clock className="w-4 h-4" />
                    <span>Miembro desde hace {diasDesdeCreacion} días</span>
                  </div>
                )}
              </div>
            </div>

            {/* Badge Level */}
            {isAgricultor && (
              <div className="bg-white/20 backdrop-blur-sm rounded-xl p-4 border border-white/30">
                <p className="text-white/80 text-xs mb-1">Nivel de Badge</p>
                <div className="flex items-center gap-2">
                  <span className="text-3xl">{badgeInfo.emoji}</span>
                  <div>
                    <p className="text-white font-bold text-lg">{badgeInfo.nombre}</p>
                    <p className="text-white/60 text-xs">Usuario {badgeInfo.nombre}</p>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Agricultor Profile */}
        {isAgricultor && (
          <div className="space-y-6">
            {/* Stats Grid */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4">
              <div className="bg-white/10 backdrop-blur-xl rounded-xl md:rounded-2xl p-4 md:p-6 border border-white/20 hover:border-emerald-400/50 transition-all">
                <div className="flex items-center gap-2 mb-2">
                  <MapPin className="w-5 h-5 text-emerald-400" />
                  <span className="text-emerald-300 text-xs font-semibold">Hectáreas</span>
                </div>
                <p className="text-2xl md:text-4xl font-black text-white">{user.hectareas || 0}</p>
                <p className="text-emerald-300/60 text-xs mt-1">de cultivo</p>
              </div>

              <div className="bg-white/10 backdrop-blur-xl rounded-xl md:rounded-2xl p-4 md:p-6 border border-white/20 hover:border-teal-400/50 transition-all">
                <div className="flex items-center gap-2 mb-2">
                  <Leaf className="w-5 h-5 text-teal-400" />
                  <span className="text-teal-300 text-xs font-semibold">CO₂ Disponible</span>
                </div>
                <p className="text-2xl md:text-4xl font-black text-white">{user.toneladas_co2 || 0}</p>
                <p className="text-teal-300/60 text-xs mt-1">toneladas</p>
              </div>

              <div className="bg-white/10 backdrop-blur-xl rounded-xl md:rounded-2xl p-4 md:p-6 border border-white/20 hover:border-blue-400/50 transition-all">
                <div className="flex items-center gap-2 mb-2">
                  <DollarSign className="w-5 h-5 text-blue-400" />
                  <span className="text-blue-300 text-xs font-semibold">Precio/Ton</span>
                </div>
                <p className="text-2xl md:text-4xl font-black text-white">${user.precio_por_tonelada || 0}</p>
                <p className="text-blue-300/60 text-xs mt-1">USD</p>
              </div>

              <div className="bg-white/10 backdrop-blur-xl rounded-xl md:rounded-2xl p-4 md:p-6 border border-white/20 hover:border-purple-400/50 transition-all">
                <div className="flex items-center gap-2 mb-2">
                  <TrendingUp className="w-5 h-5 text-purple-400" />
                  <span className="text-purple-300 text-xs font-semibold">Valor Total</span>
                </div>
                <p className="text-2xl md:text-4xl font-black text-white">
                  ${valorTotal.toLocaleString('en-US', { maximumFractionDigits: 0 })}
                </p>
                <p className="text-purple-300/60 text-xs mt-1">USD</p>
              </div>
            </div>

            {/* Parcela Info */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div className="bg-white/10 backdrop-blur-xl rounded-2xl p-6 border border-white/20">
                <h3 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
                  <MapPin className="w-6 h-6 text-emerald-400" />
                  Información de la Parcela
                </h3>
                
                <div className="space-y-4">
                  <div className="flex items-start gap-3 bg-white/5 rounded-xl p-3 hover:bg-white/10 transition-all">
                    <MapPin className="w-5 h-5 text-emerald-400 mt-0.5 flex-shrink-0" />
                    <div className="flex-1">
                      <p className="text-white/60 text-xs">Ubicación</p>
                      <p className="text-white font-bold">{user.ubicacion_estado || 'No especificado'}</p>
                      {user.ubicacion_lat && user.ubicacion_lng && (
                        <p className="text-white/60 text-xs mt-1">
                          Lat: {user.ubicacion_lat.toFixed(4)}, Lng: {user.ubicacion_lng.toFixed(4)}
                        </p>
                      )}
                    </div>
                  </div>

                  <div className="flex items-start gap-3 bg-white/5 rounded-xl p-3 hover:bg-white/10 transition-all">
                    <Calendar className="w-5 h-5 text-teal-400 mt-0.5 flex-shrink-0" />
                    <div className="flex-1">
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

                  <div className="flex items-start gap-3 bg-white/5 rounded-xl p-3 hover:bg-white/10 transition-all">
                    <Award className="w-5 h-5 text-yellow-400 mt-0.5 flex-shrink-0" />
                    <div className="flex-1">
                      <p className="text-white/60 text-xs">Estado de Verificación</p>
                      <div className="flex items-center gap-2 mt-1">
                        <span className="px-3 py-1 bg-green-500/20 border border-green-400/30 rounded-full text-green-300 text-xs font-semibold">
                          ✓ Verificado
                        </span>
                      </div>
                    </div>
                  </div>

                  {user.wallet_address && (
                    <div className="flex items-start gap-3 bg-white/5 rounded-xl p-3 hover:bg-white/10 transition-all">
                      <Wallet className="w-5 h-5 text-orange-400 mt-0.5 flex-shrink-0" />
                      <div className="flex-1">
                        <p className="text-white/60 text-xs">Wallet Stellar</p>
                        <p className="text-white font-mono text-xs break-all">
                          {user.wallet_address.substring(0, 8)}...{user.wallet_address.substring(user.wallet_address.length - 8)}
                        </p>
                      </div>
                    </div>
                  )}

                  {user.rfc && (
                    <div className="flex items-start gap-3 bg-white/5 rounded-xl p-3 hover:bg-white/10 transition-all">
                      <Building2 className="w-5 h-5 text-blue-400 mt-0.5 flex-shrink-0" />
                      <div className="flex-1">
                        <p className="text-white/60 text-xs">RFC / CURP</p>
                        <p className="text-white font-bold uppercase">{user.rfc}</p>
                      </div>
                    </div>
                  )}
                </div>
              </div>

              <div className="bg-white/10 backdrop-blur-xl rounded-2xl p-6 border border-white/20">
                <h3 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
                  <Package className="w-6 h-6 text-blue-400" />
                  Foto de la Parcela
                </h3>
                
                {user.foto_url ? (
                  <div className="relative group">
                    <img 
                      src={user.foto_url} 
                      alt="Parcela"
                      className="w-full h-64 object-cover rounded-xl"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent rounded-xl opacity-0 group-hover:opacity-100 transition-all flex items-end p-4">
                      <p className="text-white text-sm">
                        📍 {user.ubicacion_estado}
                      </p>
                    </div>
                  </div>
                ) : (
                  <div className="w-full h-64 bg-white/5 rounded-xl flex items-center justify-center border-2 border-dashed border-white/20">
                    <div className="text-center">
                      <TreePine className="w-12 h-12 text-white/30 mx-auto mb-2" />
                      <p className="text-white/40 text-sm">Sin foto de parcela</p>
                    </div>
                  </div>
                )}

                <div className="mt-4 bg-emerald-500/10 border border-emerald-400/30 rounded-xl p-4">
                  <p className="text-emerald-300 text-sm">
                    💰 <strong>Ingreso potencial:</strong> Si vendes toda tu producción, podrías generar{' '}
                    <span className="font-bold text-emerald-200 text-lg">
                      ${ingresoPotencial.toLocaleString('en-US', { maximumFractionDigits: 0 })} USD
                    </span>
                  </p>
                </div>

                <div className="mt-3 bg-teal-500/10 border border-teal-400/30 rounded-xl p-4">
                  <p className="text-teal-300 text-sm">
                    🌍 <strong>Impacto ambiental:</strong> Tus {user.toneladas_co2 || 0} toneladas de CO₂ equivalen a{' '}
                    <span className="font-bold text-teal-200">
                      {Math.round((user.toneladas_co2 || 0) / 4.6)} autos
                    </span> fuera de circulación por un año.
                  </p>
                </div>
              </div>
            </div>

            {/* CTA */}
            <div className="bg-gradient-to-r from-emerald-500 to-teal-600 rounded-2xl p-6 md:p-8 text-center shadow-xl">
              <h3 className="text-2xl md:text-3xl font-bold text-white mb-2">¿Listo para vender tus créditos?</h3>
              <p className="text-white/90 mb-4 text-sm md:text-base">Conecta con empresas que buscan compensar sus emisiones</p>
              <button className="px-8 py-3 bg-white text-emerald-600 font-bold rounded-xl hover:bg-emerald-50 hover:scale-105 transition-all shadow-lg">
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
              <div className="bg-white/10 backdrop-blur-xl rounded-xl md:rounded-2xl p-4 md:p-6 border border-white/20 hover:border-blue-400/50 transition-all">
                <div className="flex items-center gap-2 mb-2">
                  <Building2 className="w-5 h-5 text-blue-400" />
                  <span className="text-blue-300 text-xs font-semibold">RFC</span>
                </div>
                <p className="text-sm pt-2 md:text-xl font-bold text-white uppercase">{user.rfc || 'N/A'}</p>
              </div>

              <div className="bg-white/10 backdrop-blur-xl rounded-xl md:rounded-2xl p-4 md:p-6 border border-white/20 hover:border-indigo-400/50 transition-all">
                <div className="flex items-center gap-2 mb-2">
                  <ShoppingCart className="w-5 h-5 text-indigo-400" />
                  <span className="text-indigo-300 text-xs font-semibold">Compras</span>
                </div>
                <p className="text-2xl md:text-4xl font-black text-white">0</p>
                <p className="text-indigo-300/60 text-xs mt-1">transacciones</p>
              </div>

              <div className="bg-white/10 backdrop-blur-xl rounded-xl md:rounded-2xl p-4 md:p-6 border border-white/20 hover:border-purple-400/50 transition-all">
                <div className="flex items-center gap-2 mb-2">
                  <Globe className="w-5 h-5 text-purple-400" />
                  <span className="text-purple-300 text-xs font-semibold">CO₂ Compensado</span>
                </div>
                <p className="text-2xl md:text-4xl font-black text-white">0</p>
                <p className="text-purple-300/60 text-xs mt-1">toneladas</p>
              </div>

              <div className="bg-white/10 backdrop-blur-xl rounded-xl md:rounded-2xl p-4 md:p-6 border border-white/20 hover:border-pink-400/50 transition-all">
                <div className="flex items-center gap-2 mb-2">
                  <Users className="w-5 h-5 text-pink-400" />
                  <span className="text-pink-300 text-xs font-semibold">Agricultores</span>
                </div>
                <p className="text-2xl md:text-4xl font-black text-white">0</p>
                <p className="text-pink-300/60 text-xs mt-1">apoyados</p>
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
                  <div className="bg-blue-500/10 border border-blue-400/30 rounded-xl p-4 hover:bg-blue-500/20 transition-all">
                    <div className="flex items-center justify-between mb-2">
                      <p className="text-blue-300 text-sm">Total Invertido</p>
                      <DollarSign className="w-5 h-5 text-blue-400" />
                    </div>
                    <p className="text-3xl font-black text-white">$0 USD</p>
                    <p className="text-blue-300/60 text-xs mt-1">Comienza comprando tu primer crédito</p>
                  </div>

                  <div className="bg-indigo-500/10 border border-indigo-400/30 rounded-xl p-4 hover:bg-indigo-500/20 transition-all">
                    <div className="flex items-center justify-between mb-2">
                      <p className="text-indigo-300 text-sm">Impacto Ambiental</p>
                      <TreePine className="w-5 h-5 text-indigo-400" />
                    </div>
                    <p className="text-white text-sm">
                      Equivalente a <span className="font-bold text-indigo-200 text-lg">0 autos</span> fuera de circulación
                    </p>
                    <p className="text-indigo-300/60 text-xs mt-1">Basado en estándar EPA</p>
                  </div>

                  <div className="bg-purple-500/10 border border-purple-400/30 rounded-xl p-4 hover:bg-purple-500/20 transition-all">
                    <div className="flex items-center justify-between mb-2">
                      <p className="text-purple-300 text-sm">Certificaciones</p>
                      <Award className="w-5 h-5 text-purple-400" />
                    </div>
                    <div className="flex flex-wrap gap-2 mt-2">
                      <span className="px-3 py-1 bg-purple-500/20 rounded-full text-purple-200 text-xs font-semibold">
                        ISO 14064
                      </span>
                      <span className="px-3 py-1 bg-purple-500/20 rounded-full text-purple-200 text-xs font-semibold">
                        Stellar Blockchain
                      </span>
                    </div>
                  </div>

                  {user.wallet_address && (
                    <div className="bg-orange-500/10 border border-orange-400/30 rounded-xl p-4">
                      <div className="flex items-center gap-2 mb-2">
                        <Wallet className="w-5 h-5 text-orange-400" />
                        <p className="text-orange-300 text-sm">Wallet Conectada</p>
                      </div>
                      <p className="text-white font-mono text-xs break-all">
                        {user.wallet_address}
                      </p>
                    </div>
                  )}
                </div>
              </div>

              <div className="bg-white/10 backdrop-blur-xl rounded-2xl p-6 border border-white/20">
                <h3 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
                  <Award className="w-6 h-6 text-yellow-400" />
                  Próximos Pasos
                </h3>

                <div className="space-y-3">
                  <div className="bg-white/5 rounded-xl p-4 border border-white/10 hover:bg-white/10 transition-all cursor-pointer">
                    <div className="flex items-start gap-3">
                      <div className="bg-blue-500 text-white rounded-full w-8 h-8 flex items-center justify-center flex-shrink-0 font-bold text-sm">
                        1
                      </div>
                      <div className="flex-1">
                        <p className="text-white font-semibold mb-1">Explora el Marketplace</p>
                        <p className="text-white/60 text-sm">Encuentra agricultores con créditos disponibles</p>
                        <Link 
                          href="/mapa"
                          className="inline-block mt-2 text-blue-400 text-xs font-semibold hover:text-blue-300"
                        >
                          Ir al mapa →
                        </Link>
                      </div>
                    </div>
                  </div>

                  <div className="bg-white/5 rounded-xl p-4 border border-white/10 hover:bg-white/10 transition-all">
                    <div className="flex items-start gap-3">
                      <div className="bg-indigo-500 text-white rounded-full w-8 h-8 flex items-center justify-center flex-shrink-0 font-bold text-sm">
                        2
                      </div>
                      <div className="flex-1">
                        <p className="text-white font-semibold mb-1">Compra Créditos Verificados</p>
                        <p className="text-white/60 text-sm">Selecciona y adquiere tokens certificados en blockchain</p>
                        <div className="mt-2 flex items-center gap-2">
                          <span className="px-2 py-1 bg-green-500/20 rounded text-green-300 text-xs">
                            Verificado ✓
                          </span>
                          <span className="px-2 py-1 bg-blue-500/20 rounded text-blue-300 text-xs">
                            Stellar
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="bg-white/5 rounded-xl p-4 border border-white/10 hover:bg-white/10 transition-all">
                    <div className="flex items-start gap-3">
                      <div className="bg-purple-500 text-white rounded-full w-8 h-8 flex items-center justify-center flex-shrink-0 font-bold text-sm">
                        3
                      </div>
                      <div className="flex-1">
                        <p className="text-white font-semibold mb-1">Descarga Reportes de Impacto</p>
                        <p className="text-white/60 text-sm">Obtén certificados ISO para stakeholders y reportes ESG</p>
                        <p className="text-purple-400 text-xs mt-2">
                          📊 Formato PDF y Excel disponibles
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="bg-gradient-to-r from-yellow-500/10 to-orange-500/10 border border-yellow-400/30 rounded-xl p-4">
                    <div className="flex items-start gap-3">
                      <Award className="w-6 h-6 text-yellow-400 flex-shrink-0" />
                      <div className="flex-1">
                        <p className="text-yellow-300 font-semibold mb-1">💡 Tip Pro</p>
                        <p className="text-white/80 text-sm">
                          Las empresas que compensan su huella de carbono mejoran su imagen corporativa y cumplen con regulaciones ambientales.
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Company Details */}
            <div className="bg-white/10 backdrop-blur-xl rounded-2xl p-6 border border-white/20">
              <h3 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
                <Building2 className="w-6 h-6 text-blue-400" />
                Información de la Empresa
              </h3>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="bg-white/5 rounded-xl p-4 hover:bg-white/10 transition-all">
                  <div className="flex items-center gap-3">
                    <Building2 className="w-5 h-5 text-blue-400 flex-shrink-0" />
                    <div className="flex-1">
                      <p className="text-white/60 text-xs">Razón Social</p>
                      <p className="text-white font-bold">{user.nombre}</p>
                    </div>
                  </div>
                </div>

                <div className="bg-white/5 rounded-xl p-4 hover:bg-white/10 transition-all">
                  <div className="flex items-center gap-3">
                    <Building2 className="w-5 h-5 text-indigo-400 flex-shrink-0" />
                    <div className="flex-1">
                      <p className="text-white/60 text-xs">RFC</p>
                      <p className="text-white font-bold font-mono">{user.rfc || 'No especificado'}</p>
                    </div>
                  </div>
                </div>

                <div className="bg-white/5 rounded-xl p-4 hover:bg-white/10 transition-all">
                  <div className="flex items-center gap-3">
                    <Mail className="w-5 h-5 text-purple-400 flex-shrink-0" />
                    <div className="flex-1">
                      <p className="text-white/60 text-xs">Email Corporativo</p>
                      <p className="text-white font-bold text-sm">{user.email}</p>
                    </div>
                  </div>
                </div>

                <div className="bg-white/5 rounded-xl p-4 hover:bg-white/10 transition-all">
                  <div className="flex items-center gap-3">
                    <Clock className="w-5 h-5 text-pink-400 flex-shrink-0" />
                    <div className="flex-1">
                      <p className="text-white/60 text-xs">Miembro Desde</p>
                      <p className="text-white font-bold">
                        {user.createdAt 
                          ? new Date(user.createdAt).toLocaleDateString('es-MX', {
                              year: 'numeric',
                              month: 'long',
                              day: 'numeric'
                            })
                          : 'N/A'
                        }
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {user.wallet_address && (
                <div className="mt-4 bg-orange-500/10 border border-orange-400/30 rounded-xl p-4">
                  <div className="flex items-start gap-3">
                    <Wallet className="w-5 h-5 text-orange-400 mt-0.5 flex-shrink-0" />
                    <div className="flex-1">
                      <p className="text-orange-300 text-sm font-semibold mb-1">Wallet Stellar Conectada</p>
                      <p className="text-white/80 font-mono text-xs break-all bg-black/20 rounded p-2">
                        {user.wallet_address}
                      </p>
                      <p className="text-orange-300/60 text-xs mt-2">
                        🔒 Conexión segura verificada en blockchain
                      </p>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* CTA */}
            <div className="bg-gradient-to-r from-blue-500 to-indigo-600 rounded-2xl p-6 md:p-8 text-center shadow-xl">
              <div className="max-w-2xl mx-auto">
                <h3 className="text-2xl md:text-3xl font-bold text-white mb-2">
                  Comienza tu Estrategia de Carbono Neutral
                </h3>
                <p className="text-white/90 mb-6 text-sm md:text-base">
                  Accede al marketplace y encuentra créditos certificados de agricultores mexicanos
                </p>
                <div className="flex flex-col sm:flex-row gap-3 justify-center">
                  <Link
                    href="/mapa"
                    className="inline-flex items-center justify-center gap-2 px-8 py-3 bg-white text-blue-600 font-bold rounded-xl hover:bg-blue-50 hover:scale-105 transition-all shadow-lg"
                  >
                    <ShoppingCart className="w-5 h-5" />
                    Ir al Marketplace
                  </Link>
                  <button className="inline-flex items-center justify-center gap-2 px-8 py-3 bg-white/10 backdrop-blur-sm text-white font-bold rounded-xl hover:bg-white/20 transition-all border border-white/30">
                    <BarChart3 className="w-5 h-5" />
                    Ver Tutorial
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}