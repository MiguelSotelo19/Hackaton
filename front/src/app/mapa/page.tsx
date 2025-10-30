'use client';

import React, { useState } from 'react';
import dynamic from 'next/dynamic';
import { Leaf, MapPin, TrendingUp, Filter, ShoppingCart, Sparkles, X, CheckCircle, DollarSign, Menu, Zap, Package } from 'lucide-react';
import { PARCELAS_MOCK, Parcela } from '@/lib/mapbox-config';
import { autoFillCart, CartItem, calculateCartStats } from '@/lib/cart-assistant';
import { STELLAR_CONFIG } from '@/lib/stellar-config';
import BlockchainCheckout from '@/components/BlockchainCheckout';
import Toast from '@/components/Toast';
import Link from 'next/link';

const Map3DInteractive = dynamic(
  () => import('@/components/Map3DInteractive'),
  { 
    ssr: false,
    loading: () => (
      <div className="w-full h-full bg-gradient-to-br from-blue-950 to-indigo-900 flex items-center justify-center">
        <div className="text-white text-center">
          <div className="w-16 h-16 border-4 border-blue-400 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p>Cargando mapa...</p>
        </div>
      </div>
    ),
  }
);

export default function MapaPage() {
  const [showFilters, setShowFilters] = useState(false);
  const [showCart, setShowCart] = useState(false);
  const [showAssistant, setShowAssistant] = useState(false);
  const [showMobileMenu, setShowMobileMenu] = useState(false);
  const [showBlockchainCheckout, setShowBlockchainCheckout] = useState(false);
  
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 100]);
  const [co2Range, setCo2Range] = useState<[number, number]>([0, 500]);
  const [minReputacion, setMinReputacion] = useState(0);
  
  const [cart, setCart] = useState<CartItem[]>([]);
  const [targetCO2, setTargetCO2] = useState('');

  const [toasts, setToasts] = useState<Array<{ id: number; message: string; type: 'success' | 'error' | 'warning' | 'info' }>>([]);

  const showToast = (message: string, type: 'success' | 'error' | 'warning' | 'info' = 'info') => {
    const id = Date.now();
    setToasts((prev) => [...prev, { id, message, type }]);
  };

  const removeToast = (id: number) => {
    setToasts((prev) => prev.filter((toast) => toast.id !== id));
  };

  const filteredParcelas = PARCELAS_MOCK.filter(parcela => {
    const priceMatch = parcela.precio_por_tonelada >= priceRange[0] && parcela.precio_por_tonelada <= priceRange[1];
    const co2Match = parcela.co2_disponible >= co2Range[0] && parcela.co2_disponible <= co2Range[1];
    const reputacionMatch = parcela.reputacion >= minReputacion;
    return priceMatch && co2Match && reputacionMatch;
  });

  const stats = {
    totalParcelas: filteredParcelas.length,
    totalCO2: filteredParcelas.reduce((sum, p) => sum + p.co2_disponible, 0),
    avgPrice: filteredParcelas.length > 0 
      ? filteredParcelas.reduce((sum, p) => sum + p.precio_por_tonelada, 0) / filteredParcelas.length 
      : 0,
  };

  const cartStats = calculateCartStats(cart);

  const handleAutoFill = () => {
    const target = parseFloat(targetCO2);
    if (isNaN(target) || target <= 0) {
      showToast('Por favor ingresa una cantidad válida', 'warning');
      return;
    }

    const result = autoFillCart(target, filteredParcelas);
    setCart(result.items);
    setShowAssistant(false);
    setShowCart(true);
    setTimeout(() => showToast(result.message, 'success'), 300);
  };

  const handleAddToCart = (parcela: Parcela) => {
    const existingItem = cart.find(item => item.parcela.id === parcela.id);
    
    if (existingItem) {
      showToast('Esta parcela ya está en tu carrito', 'warning');
      return;
    }

    const newItem: CartItem = {
      parcela,
      toneladas: parcela.co2_disponible,
      total: parcela.co2_disponible * parcela.precio_por_tonelada,
    };

    setCart([...cart, newItem]);
    showToast(`✅ Parcela #${parcela.id} agregada al carrito`, 'success');
  };

  const handlePagarConBlockchain = () => {
    setShowCart(false);
    setShowBlockchainCheckout(true);
  };

  // Mapear ID de parcela a agricultor (simplificado)
  const getAgricultorData = (parcelaId: number) => {
    // Distribuir parcelas entre los 3 agricultores
    const agricultorIndex = (parcelaId % 3) + 1;
    const wallets = [
      STELLAR_CONFIG.ACCOUNTS.AGRICULTOR1,
      STELLAR_CONFIG.ACCOUNTS.AGRICULTOR2,
      STELLAR_CONFIG.ACCOUNTS.AGRICULTOR3,
    ];
    return {
      id: agricultorIndex,
      wallet: wallets[agricultorIndex - 1],
      nombre: `Agricultor ${agricultorIndex}`,
    };
  };

  return (
    <div className="h-screen flex flex-col bg-gradient-to-br from-blue-950 via-indigo-900 to-purple-950">
      {/* Mobile Header */}
      <header className="bg-black/40 backdrop-blur-xl border-b border-white/10 z-50">
        <div className="px-4 py-3 md:px-6 md:py-4">
          <div className="flex items-center justify-between">
            <Link href="/" className="flex items-center gap-2 md:gap-3">
              <div className="bg-gradient-to-br from-blue-400 to-indigo-600 p-2 rounded-xl shadow-lg">
                <Leaf className="w-5 h-5 md:w-6 md:h-6 text-white" />
              </div>
              <div>
                <h1 className="text-base md:text-xl font-bold text-white">
                  Agro<strong className="bg-gradient-to-r from-blue-200 via-indigo-500 to-purple-200 bg-clip-text text-transparent">Can</strong>e
                </h1>
                <p className="text-blue-300 text-xs hidden md:block">Marketplace</p>
              </div>
            </Link>

            <div className="flex items-center gap-2">
              <button
                onClick={() => setShowAssistant(true)}
                className="md:flex items-center gap-2 px-3 py-2 bg-gradient-to-r from-purple-500 to-pink-600 text-white rounded-lg font-semibold text-sm shadow-lg hidden"
              >
                <Sparkles className="w-4 h-4" />
                <span className="hidden lg:inline">Asistente</span>
              </button>

              <button
                onClick={() => setShowCart(true)}
                className="relative px-3 py-2 bg-gradient-to-r from-blue-500 to-indigo-600 text-white rounded-lg font-semibold text-sm shadow-lg flex items-center gap-1"
              >
                <ShoppingCart className="w-4 h-4" />
                <span className="hidden sm:inline">Carrito</span>
                {cart.length > 0 && (
                  <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center">
                    {cart.length}
                  </span>
                )}
              </button>

              <button
                onClick={() => setShowMobileMenu(!showMobileMenu)}
                className="p-2 bg-white/10 text-white rounded-lg md:hidden"
              >
                <Menu className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Mobile Stats Bar */}
          <div className="mt-3 grid grid-cols-3 gap-2 md:hidden">
            <div className="bg-blue-500/20 rounded-lg p-2 text-center">
              <p className="text-white text-lg font-bold">{stats.totalParcelas}</p>
              <p className="text-blue-300 text-xs">Parcelas</p>
            </div>
            <div className="bg-indigo-500/20 rounded-lg p-2 text-center">
              <p className="text-white text-lg font-bold">{stats.totalCO2.toLocaleString('es-MX')}</p>
              <p className="text-indigo-300 text-xs">Ton CO₂</p>
            </div>
            <div className="bg-purple-500/20 rounded-lg p-2 text-center">
              <p className="text-white text-lg font-bold">${stats.avgPrice.toFixed(0)}</p>
              <p className="text-purple-300 text-xs">Promedio</p>
            </div>
          </div>
        </div>
      </header>

      {/* Mobile Menu Overlay */}
      {showMobileMenu && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 md:hidden">
          <div className="bg-gradient-to-br from-blue-900 to-indigo-900 h-full p-6 pt-20 space-y-4">
            <button
              onClick={() => {
                setShowMobileMenu(false);
                setShowFilters(true);
              }}
              className="w-full flex items-center gap-3 p-4 bg-white/10 rounded-xl text-white"
            >
              <Filter className="w-5 h-5" />
              <span className="font-semibold">Filtros</span>
            </button>

            <button
              onClick={() => {
                setShowMobileMenu(false);
                setShowAssistant(true);
              }}
              className="w-full flex items-center gap-3 p-4 bg-gradient-to-r from-purple-500 to-pink-600 rounded-xl text-white"
            >
              <Sparkles className="w-5 h-5" />
              <span className="font-semibold">Asistente IA</span>
            </button>

            <button
              onClick={() => setShowMobileMenu(false)}
              className="w-full p-4 bg-white/10 rounded-xl text-white font-semibold"
            >
              Cerrar
            </button>
          </div>
        </div>
      )}

      {/* Quick Actions Bar - Mobile */}
      <div className="bg-black/20 backdrop-blur-sm border-b border-white/10 p-3 flex gap-2 overflow-x-auto md:hidden">
        <button
          onClick={() => setShowFilters(true)}
          className="flex items-center gap-2 px-4 py-2 bg-blue-500/20 rounded-lg text-white text-sm whitespace-nowrap flex-shrink-0"
        >
          <Filter className="w-4 h-4" />
          Filtros ({filteredParcelas.length})
        </button>

        <button
          onClick={() => setShowAssistant(true)}
          className="flex items-center gap-2 px-4 py-2 bg-purple-500/20 rounded-lg text-white text-sm whitespace-nowrap flex-shrink-0"
        >
          <Sparkles className="w-4 h-4" />
          Asistente IA
        </button>

        <button
          onClick={() => {
            setPriceRange([0, 100]);
            setCo2Range([0, 500]);
            setMinReputacion(0);
          }}
          className="flex items-center gap-2 px-4 py-2 bg-white/10 rounded-lg text-white text-sm whitespace-nowrap flex-shrink-0"
        >
          <X className="w-4 h-4" />
          Limpiar
        </button>
      </div>

      {/* Desktop Stats Bar */}
      <div className="hidden md:block bg-black/20 backdrop-blur-sm border-b border-white/10 py-3">
        <div className="container mx-auto px-6">
          <div className="flex items-center justify-between">
            <div className="flex gap-6">
              <div className="flex items-center gap-2">
                <MapPin className="w-5 h-5 text-blue-400" />
                <div>
                  <p className="text-white text-lg font-bold">{stats.totalParcelas}</p>
                  <p className="text-blue-300 text-xs">Disponibles</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Leaf className="w-5 h-5 text-indigo-400" />
                <div>
                  <p className="text-white text-lg font-bold">{stats.totalCO2.toLocaleString('es-MX')}</p>
                  <p className="text-indigo-300 text-xs">Ton CO₂</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <DollarSign className="w-5 h-5 text-purple-400" />
                <div>
                  <p className="text-white text-lg font-bold">${stats.avgPrice.toFixed(0)}</p>
                  <p className="text-purple-300 text-xs">Promedio/ton</p>
                </div>
              </div>
            </div>

            <button
              onClick={() => setShowFilters(!showFilters)}
              className="flex items-center gap-2 px-4 py-2 bg-blue-500/20 hover:bg-blue-500/30 text-white rounded-lg transition-all border border-blue-400/30"
            >
              <Filter className="w-5 h-5" />
              <span className="font-semibold">Filtros</span>
              <span className="text-xs bg-blue-500 px-2 py-1 rounded-full">
                {filteredParcelas.length}
              </span>
            </button>
          </div>
        </div>
      </div>

      {/* Main Content - Map */}
      <div className="flex-1 relative overflow-hidden">
        <Map3DInteractive 
          parcelas={filteredParcelas}
          onAddToCart={handleAddToCart}
        />
      </div>

      {/* Filters Modal */}
      {showFilters && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-end md:items-center justify-center p-0 md:p-6">
          <div className="bg-gradient-to-br from-blue-900/95 to-indigo-900/95 backdrop-blur-xl rounded-t-3xl md:rounded-3xl w-full md:max-w-md p-6 md:p-8 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-3">
                <div className="bg-blue-500 p-2 rounded-xl">
                  <Filter className="w-5 h-5 text-white" />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-white">Filtros</h3>
                  <p className="text-blue-300 text-sm">{filteredParcelas.length} resultados</p>
                </div>
              </div>
              <button
                onClick={() => setShowFilters(false)}
                className="text-white/60 hover:text-white"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            <div className="space-y-6">
              <div>
                <label className="text-white font-semibold mb-3 block flex items-center gap-2">
                  <DollarSign className="w-4 h-4 text-blue-400" />
                  Precio Máximo por Tonelada
                </label>
                <input
                  type="range"
                  min="0"
                  max="100"
                  value={priceRange[1]}
                  onChange={(e) => setPriceRange([0, parseInt(e.target.value)])}
                  className="w-full h-2 bg-blue-500/30 rounded-lg appearance-none cursor-pointer accent-blue-500"
                />
                <div className="flex justify-between mt-2">
                  <span className="text-white/60 text-sm">$0</span>
                  <span className="text-blue-400 font-bold text-lg">${priceRange[1]}</span>
                </div>
              </div>

              <div>
                <label className="text-white font-semibold mb-3 block flex items-center gap-2">
                  <Leaf className="w-4 h-4 text-indigo-400" />
                  CO₂ Mínimo Disponible
                </label>
                <input
                  type="range"
                  min="0"
                  max="500"
                  value={co2Range[1]}
                  onChange={(e) => setCo2Range([0, parseInt(e.target.value)])}
                  className="w-full h-2 bg-indigo-500/30 rounded-lg appearance-none cursor-pointer accent-indigo-500"
                />
                <div className="flex justify-between mt-2">
                  <span className="text-white/60 text-sm">0 ton</span>
                  <span className="text-indigo-400 font-bold text-lg">{co2Range[1]} ton</span>
                </div>
              </div>

              <div>
                <label className="text-white font-semibold mb-3 block flex items-center gap-2">
                  <TrendingUp className="w-4 h-4 text-purple-400" />
                  Reputación Mínima
                </label>
                <div className="grid grid-cols-5 gap-2">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      key={star}
                      onClick={() => setMinReputacion(star)}
                      className={`aspect-square rounded-xl transition-all text-2xl ${
                        minReputacion >= star
                          ? 'bg-yellow-500 shadow-lg scale-110'
                          : 'bg-white/10 hover:bg-white/20'
                      }`}
                    >
                      ⭐
                    </button>
                  ))}
                </div>
              </div>

              <div className="pt-4 space-y-3">
                <button
                  onClick={() => {
                    setPriceRange([0, 100]);
                    setCo2Range([0, 500]);
                    setMinReputacion(0);
                  }}
                  className="w-full px-4 py-3 bg-white/10 hover:bg-white/20 text-white rounded-xl font-semibold transition-all"
                >
                  Restablecer Filtros
                </button>
                <button
                  onClick={() => setShowFilters(false)}
                  className="w-full px-4 py-3 bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 text-white rounded-xl font-bold transition-all"
                >
                  Aplicar Filtros
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Assistant Modal */}
      {showAssistant && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-end md:items-center justify-center p-0 md:p-6">
          <div className="bg-gradient-to-br from-purple-900/95 to-pink-900/95 backdrop-blur-xl rounded-t-3xl md:rounded-3xl w-full md:max-w-md p-6 md:p-8">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-3">
                <div className="bg-gradient-to-r from-purple-500 to-pink-600 p-3 rounded-xl">
                  <Sparkles className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h3 className="text-xl md:text-2xl font-bold text-white">Asistente IA</h3>
                  <p className="text-purple-300 text-sm">Optimización inteligente</p>
                </div>
              </div>
              <button
                onClick={() => setShowAssistant(false)}
                className="text-white/60 hover:text-white"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            <div className="space-y-6">
              <div>
                <label className="text-white font-semibold mb-2 block">
                  ¿Cuántas toneladas de CO₂ necesitas?
                </label>
                <input
                  type="number"
                  value={targetCO2}
                  onChange={(e) => setTargetCO2(e.target.value)}
                  placeholder="Ej: 60"
                  className="w-full bg-white/10 border-2 border-white/30 rounded-xl px-4 py-4 text-white text-2xl font-bold placeholder-white/40 focus:outline-none focus:border-purple-400 transition-all"
                />
              </div>

              <div className="bg-white/10 rounded-xl p-4 border border-white/20">
                <p className="text-white/80 text-sm mb-2">
                  <Zap className="w-4 h-4 inline mr-1" />
                  <strong>El asistente:</strong>
                </p>
                <ul className="space-y-1 text-white/70 text-sm">
                  <li>✓ Selecciona mejor precio</li>
                  <li>✓ Prioriza alta reputación</li>
                  <li>✓ Optimiza automáticamente</li>
                </ul>
              </div>

              <button
                onClick={handleAutoFill}
                disabled={!targetCO2}
                className="w-full bg-gradient-to-r from-purple-500 to-pink-600 hover:from-purple-600 hover:to-pink-700 disabled:opacity-50 text-white font-bold py-4 rounded-xl transition-all active:scale-95 shadow-lg flex items-center justify-center gap-2"
              >
                <Sparkles className="w-5 h-5" />
                Llenar Carrito
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Cart Modal */}
      {showCart && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-end md:items-center justify-center p-0 md:p-6">
          <div className="bg-gradient-to-br from-blue-900/95 to-indigo-900/95 backdrop-blur-xl rounded-t-3xl md:rounded-3xl w-full md:max-w-2xl p-6 md:p-8 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-3">
                <div className="bg-gradient-to-r from-blue-500 to-indigo-600 p-3 rounded-xl">
                  <ShoppingCart className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h3 className="text-xl md:text-2xl font-bold text-white">Mi Carrito</h3>
                  <p className="text-blue-300 text-sm">{cart.length} parcela(s)</p>
                </div>
              </div>
              <button
                onClick={() => setShowCart(false)}
                className="text-white/60 hover:text-white"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            {cart.length === 0 ? (
              <div className="text-center py-12">
                <Package className="w-16 h-16 text-white/30 mx-auto mb-4" />
                <p className="text-white/60 mb-4 text-lg">Tu carrito está vacío</p>
                <button
                  onClick={() => {
                    setShowCart(false);
                    setShowAssistant(true);
                  }}
                  className="px-6 py-3 bg-gradient-to-r from-purple-500 to-pink-600 text-white rounded-xl font-semibold inline-flex items-center gap-2"
                >
                  <Sparkles className="w-4 h-4" />
                  Usar Asistente IA
                </button>
              </div>
            ) : (
              <div className="space-y-6">
                <div className="space-y-3">
                  {cart.map((item, index) => (
                    <div key={index} className="bg-white/5 rounded-xl p-4 border border-white/10">
                      <div className="flex gap-3">
                        <img
                          src={item.parcela.foto}
                          alt="Parcela"
                          className="w-16 h-16 md:w-20 md:h-20 rounded-lg object-cover"
                        />
                        <div className="flex-1 min-w-0">
                          <h4 className="text-white font-bold">Parcela #{item.parcela.id}</h4>
                          <p className="text-yellow-400 text-sm">{'⭐'.repeat(item.parcela.reputacion)}</p>
                          <div className="flex items-center gap-3 mt-1 text-sm">
                            <span className="text-indigo-400 font-semibold">{item.toneladas} ton</span>
                            <span className="text-white/60">${item.parcela.precio_por_tonelada}/ton</span>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className="text-xl md:text-2xl font-bold text-white">
                            ${item.total.toLocaleString('es-MX')}
                          </p>
                          <button
                            onClick={() => setCart(cart.filter((_, i) => i !== index))}
                            className="mt-2 text-red-400 hover:text-red-300 text-sm"
                          >
                            Eliminar
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="bg-gradient-to-r from-blue-500/20 to-indigo-500/20 rounded-xl p-6 border border-blue-400/30">
                  <h4 className="text-white font-bold text-lg mb-4">Resumen</h4>
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm md:text-base">
                      <span className="text-white/70">Total CO₂:</span>
                      <span className="text-white font-bold">{cartStats.totalCO2} ton</span>
                    </div>
                    <div className="flex justify-between text-sm md:text-base">
                      <span className="text-white/70">Impacto:</span>
                      <span className="text-emerald-400 font-bold">{cartStats.equivalentCars} autos/año</span>
                    </div>
                    <div className="border-t border-white/20 pt-3 mt-3 flex justify-between items-center">
                      <span className="text-white text-lg font-bold">TOTAL:</span>
                      <span className="text-2xl md:text-3xl font-black text-white">${cartStats.totalCost.toLocaleString('es-MX')}</span>
                    </div>
                  </div>
                </div>

                <div className="flex flex-col sm:flex-row gap-3">
                  <button
                    onClick={() => setCart([])}
                    className="flex-1 px-6 py-3 bg-white/10 hover:bg-white/20 text-white rounded-xl font-semibold transition-all"
                  >
                    Vaciar
                  </button>
                  <button 
                    onClick={handlePagarConBlockchain}
                    className="flex-1 px-6 py-3 bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 text-white rounded-xl font-bold transition-all active:scale-95 shadow-lg flex items-center justify-center gap-2"
                  >
                    <CheckCircle className="w-5 h-5" />
                    Pagar con Blockchain
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Blockchain Checkout Modal */}
      {showBlockchainCheckout && cart.length > 0 && (
        <div className="fixed inset-0 bg-black/90 backdrop-blur-sm z-[60] flex items-center justify-center p-6">
          <div className="bg-gradient-to-br from-blue-900/95 to-indigo-900/95 backdrop-blur-xl rounded-3xl w-full max-w-md p-8">
            <BlockchainCheckout
              agricultorId={getAgricultorData(cart[0].parcela.id).id}
              agricultorWallet={getAgricultorData(cart[0].parcela.id).wallet}
              agricultorNombre={getAgricultorData(cart[0].parcela.id).nombre}
              cantidadTokens={cartStats.totalCO2}
              precioTotal={cartStats.totalCost}
              parcelaId={cart[0].parcela.id}
              onSuccess={(txHash) => {
                console.log('✅ Compra exitosa en blockchain:', txHash);
                showToast('¡Compra exitosa! Tokens transferidos en Stellar blockchain', 'success');
                setCart([]);
                setShowBlockchainCheckout(false);
                setShowCart(false);
              }}
              onCancel={() => setShowBlockchainCheckout(false)}
            />
          </div>
        </div>
      )}

      {/* Toasts */}
      {toasts.map((toast) => (
        <Toast
          key={toast.id}
          message={toast.message}
          type={toast.type}
          onClose={() => removeToast(toast.id)}
        />
      ))}
    </div>
  );
}