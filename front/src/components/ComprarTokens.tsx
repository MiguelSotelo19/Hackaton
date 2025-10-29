// src/components/ComprarTokens.tsx
'use client';

import { useState, useEffect } from 'react';
import { Wallet, Coins, ExternalLink, AlertCircle, CheckCircle2 } from 'lucide-react';
import { conectarFreighter, obtenerBalance, comprarTokens } from '@/lib/stellar-client';
import { getExplorerTxUrl, STELLAR_CONFIG } from '@/lib/stellar-config';
import { apiClient } from '@/lib/api';
import type { Agricultor, CompraState } from '@/types';

// Agricultores mock (reemplazar con datos reales de tu API)
const AGRICULTORES_MOCK: Agricultor[] = [
  {
    id: 1,
    nombre: 'Juan Pérez',
    wallet_address: STELLAR_CONFIG.ACCOUNTS.AGRICULTOR1,
    balance_tokens: 500,
    badge_level: 'verificado',
    precio_por_token: 10,
    parcela: {
      id: 1,
      nombre: 'Parcela Norte',
      hectareas: 5.2,
      captura_co2_anual: 26000,
    },
  },
  {
    id: 2,
    nombre: 'María González',
    wallet_address: STELLAR_CONFIG.ACCOUNTS.AGRICULTOR2,
    balance_tokens: 500,
    badge_level: 'confiable',
    precio_por_token: 12,
    parcela: {
      id: 2,
      nombre: 'Parcela Sur',
      hectareas: 3.8,
      captura_co2_anual: 19000,
    },
  },
];

export default function ComprarTokens() {
  const [state, setState] = useState<CompraState>({
    agricultorSeleccionado: null,
    cantidadTokens: 10,
    precioTotal: 0,
    walletConectada: null,
    balanceActual: 0,
    procesando: false,
    error: null,
    txHash: null,
  });

  // Calcular precio total cuando cambia cantidad o agricultor
  useEffect(() => {
    if (state.agricultorSeleccionado) {
      setState(prev => ({
        ...prev,
        precioTotal: prev.cantidadTokens * state.agricultorSeleccionado!.precio_por_token,
      }));
    }
  }, [state.cantidadTokens, state.agricultorSeleccionado]);

  // Conectar Freighter Wallet
  const handleConectarWallet = async () => {
    setState(prev => ({ ...prev, error: null, procesando: true }));
    
    try {
      const { publicKey } = await conectarFreighter();
      
      // Obtener balance actual
      const { balance, error } = await obtenerBalance(publicKey);
      
      if (error) {
        throw new Error(error);
      }

      setState(prev => ({
        ...prev,
        walletConectada: publicKey,
        balanceActual: balance || 0,
        procesando: false,
      }));
    } catch (error: any) {
      setState(prev => ({
        ...prev,
        error: error.message,
        procesando: false,
      }));
    }
  };

  // Seleccionar agricultor
  const handleSeleccionarAgricultor = (agricultor: Agricultor) => {
    setState(prev => ({
      ...prev,
      agricultorSeleccionado: agricultor,
      error: null,
      txHash: null,
    }));
  };

  // Ejecutar compra
  const handleComprar = async () => {
    if (!state.walletConectada || !state.agricultorSeleccionado) {
      setState(prev => ({ ...prev, error: 'Conecta tu wallet y selecciona un agricultor' }));
      return;
    }

    if (state.cantidadTokens <= 0 || state.cantidadTokens > state.agricultorSeleccionado.balance_tokens) {
      setState(prev => ({ ...prev, error: 'Cantidad inválida de tokens' }));
      return;
    }

    // VERIFICAR: Usuario debe conectar wallet del AGRICULTOR (no empresa)
    /*if (state.walletConectada !== state.agricultorSeleccionado.wallet_address) {
      const walletPreview = state.agricultorSeleccionado.wallet_address.substring(0, 8);
      setState(prev => ({ 
        ...prev, 
        error: `Para esta demo, conecta la wallet del agricultor: ${walletPreview}...` 
      }));
      return;
    }*/ 

    setState(prev => ({ ...prev, procesando: true, error: null, txHash: null }));

    try {
      // 1. Ejecutar transferencia en blockchain (agricultor envía a empresa)
      // Nota: Usamos EMPRESA1 como destinatario fijo para la demo
      const empresaDestino = 'GA4D7WA54FHEXCFSDXWTQF2BAK3CNQEZZ4QHH3Z5ZMYO4AVAJ2FDDCNR';
      
      const { success, txHash, error } = await comprarTokens(
        state.walletConectada, // FROM: agricultor (quien firma)
        empresaDestino,         // TO: empresa (quien recibe)
        state.cantidadTokens
      );

      if (!success || !txHash) {
        throw new Error(error || 'Error en la transacción blockchain');
      }

      // 2. Guardar en backend
      await apiClient.guardarCompraBlockchain({
        stellar_tx_hash: txHash,
        comprador_wallet: empresaDestino,
        vendedor_wallet: state.walletConectada, // El agricultor que firmó
        cantidad_tokens: state.cantidadTokens,
        precio_total: state.precioTotal,
        parcela_id: state.agricultorSeleccionado.parcela?.id || 0,
      } as any);

      // 3. Actualizar balance
      const { balance } = await obtenerBalance(state.walletConectada);

      setState(prev => ({
        ...prev,
        txHash,
        balanceActual: balance || 0,
        procesando: false,
        error: null,
      }));

    } catch (error: any) {
      setState(prev => ({
        ...prev,
        error: error.message || 'Error al procesar la compra',
        procesando: false,
      }));
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-6">
      {/* Header */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <h1 className="text-3xl font-bold text-green-800 mb-2">
          Comprar Créditos de Carbono
        </h1>
        <p className="text-gray-600">
          Compra tokens CarbonCaña directamente en Stellar Blockchain
        </p>
      </div>

      {/* Wallet Connection */}
      <div className="bg-white rounded-lg shadow-md p-6">
        {!state.walletConectada ? (
          <button
            onClick={handleConectarWallet}
            disabled={state.procesando}
            className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white font-semibold py-3 px-6 rounded-lg flex items-center justify-center gap-2 transition"
          >
            <Wallet size={20} />
            {state.procesando ? 'Conectando...' : 'Conectar Freighter Wallet'}
          </button>
        ) : (
          <div className="space-y-3">
            <div className="flex items-center gap-2 text-green-600">
              <CheckCircle2 size={20} />
              <span className="font-semibold">Wallet Conectada</span>
            </div>
            <div className="bg-gray-50 p-3 rounded">
              <p className="text-sm text-gray-600">Dirección:</p>
              <p className="text-xs font-mono break-all">{state.walletConectada}</p>
            </div>
            <div className="flex items-center gap-2">
              <Coins size={20} className="text-yellow-600" />
              <span className="font-semibold">Balance: {state.balanceActual} tokens</span>
            </div>
          </div>
        )}
      </div>

      {/* Error Alert */}
      {state.error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4 flex items-start gap-3">
          <AlertCircle size={20} className="text-red-600 flex-shrink-0 mt-0.5" />
          <p className="text-red-800">{state.error}</p>
        </div>
      )}

      {/* Success Alert */}
      {state.txHash && (
        <div className="bg-green-50 border border-green-200 rounded-lg p-4">
          <div className="flex items-start gap-3">
            <CheckCircle2 size={20} className="text-green-600 flex-shrink-0 mt-0.5" />
            <div className="flex-1">
              <p className="text-green-800 font-semibold mb-2">¡Compra exitosa!</p>
              <p className="text-sm text-gray-600 mb-2">Hash de transacción:</p>
              <p className="text-xs font-mono bg-white p-2 rounded break-all">{state.txHash}</p>
              <a
                href={getExplorerTxUrl(state.txHash)}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1 text-blue-600 hover:text-blue-700 mt-2 text-sm"
              >
                Ver en Stellar Explorer <ExternalLink size={14} />
              </a>
            </div>
          </div>
        </div>
      )}

      {/* Agricultores List */}
      {state.walletConectada && (
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-xl font-bold text-gray-800 mb-4">Selecciona un Agricultor</h2>
          <div className="grid gap-4 md:grid-cols-2">
            {AGRICULTORES_MOCK.map((agricultor) => (
              <div
                key={agricultor.id}
                onClick={() => handleSeleccionarAgricultor(agricultor)}
                className={`border-2 rounded-lg p-4 cursor-pointer transition ${
                  state.agricultorSeleccionado?.id === agricultor.id
                    ? 'border-green-500 bg-green-50'
                    : 'border-gray-200 hover:border-green-300'
                }`}
              >
                <h3 className="font-bold text-lg">{agricultor.nombre}</h3>
                <p className="text-sm text-gray-600">{agricultor.parcela?.nombre}</p>
                <div className="mt-2 space-y-1 text-sm">
                  <p><span className="font-semibold">Tokens disponibles:</span> {agricultor.balance_tokens}</p>
                  <p><span className="font-semibold">Precio:</span> ${agricultor.precio_por_token} MXN/token</p>
                  <p><span className="font-semibold">Badge:</span> {agricultor.badge_level}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Compra Form */}
      {state.agricultorSeleccionado && (
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-xl font-bold text-gray-800 mb-4">Detalles de Compra</h2>
          
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Cantidad de tokens
              </label>
              <input
                type="number"
                min="1"
                max={state.agricultorSeleccionado.balance_tokens}
                value={state.cantidadTokens}
                onChange={(e) => setState(prev => ({ ...prev, cantidadTokens: parseInt(e.target.value) || 0 }))}
                className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-green-500 focus:border-transparent"
              />
            </div>

            <div className="bg-gray-50 p-4 rounded-lg space-y-2">
              <div className="flex justify-between">
                <span className="text-gray-600">Precio por token:</span>
                <span className="font-semibold">${state.agricultorSeleccionado.precio_por_token} MXN</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Cantidad:</span>
                <span className="font-semibold">{state.cantidadTokens} tokens</span>
              </div>
              <div className="border-t pt-2 flex justify-between text-lg">
                <span className="font-bold">Total:</span>
                <span className="font-bold text-green-600">${state.precioTotal} MXN</span>
              </div>
            </div>

            <button
              onClick={handleComprar}
              disabled={state.procesando || state.cantidadTokens <= 0}
              className="w-full bg-green-600 hover:bg-green-700 disabled:bg-gray-400 text-white font-semibold py-3 px-6 rounded-lg transition"
            >
              {state.procesando ? 'Procesando...' : 'Comprar Tokens'}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}