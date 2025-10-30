'use client';

import { useState } from 'react';
import Cookies from 'js-cookie';
import { Wallet, ExternalLink, AlertCircle, CheckCircle2, Loader2, AlertTriangle } from 'lucide-react';
import { conectarFreighter, comprarTokens, obtenerBalance } from '@/lib/stellar-client';
import { getExplorerTxUrl } from '@/lib/stellar-config';
import { apiClient } from '@/lib/api';

interface BlockchainCheckoutProps {
  // Datos de la compra
  agricultorId: number;
  agricultorWallet: string;
  agricultorNombre: string;
  cantidadTokens: number;
  precioTotal: number;
  parcelaId?: number;
  
  // Callbacks
  onSuccess?: (txHash: string) => void;
  onCancel?: () => void;
}

export default function BlockchainCheckout({
  agricultorId,
  agricultorWallet,
  agricultorNombre,
  cantidadTokens,
  precioTotal,
  parcelaId,
  onSuccess,
  onCancel,
}: BlockchainCheckoutProps) {
  const [step, setStep] = useState<'connect' | 'confirm' | 'processing' | 'success' | 'error' | 'warning'>('connect');
  const [walletAddress, setWalletAddress] = useState<string | null>(null);
  const [balance, setBalance] = useState<number>(0);
  const [txHash, setTxHash] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleConnectWallet = async () => {
    try {
      setError(null);
      const { publicKey } = await conectarFreighter();
      
      const { balance: userBalance, error: balanceError } = await obtenerBalance(publicKey);
      
      if (balanceError) {
        throw new Error(balanceError);
      }

      setWalletAddress(publicKey);
      setBalance(userBalance || 0);
      setStep('confirm');
    } catch (err: any) {
      setError(err.message);
      setStep('error');
    }
  };

  const handleConfirmPurchase = async () => {
    if (!walletAddress) return;

    setStep('processing');
    setError(null);

    try {
      // 1. Ejecutar transacción blockchain
      const empresaDestino = 'GA4D7WA54FHEXCFSDXWTQF2BAK3CNQEZZ4QHH3Z5ZMYO4AVAJ2FDDCNR'; // Empresa fija

      // Validar balance ANTES de comprar
      if (balance < cantidadTokens) {
        setError(`⚠️ Fondos insuficientes. Tienes ${balance} tokens pero necesitas ${cantidadTokens}`);
        setStep('warning'); // Nuevo step
        return;
      }

      const { success, txHash: hash, error: txError } = await comprarTokens(
        walletAddress, // FROM: agricultor (quien firma)
        empresaDestino, // TO: empresa (quien recibe)
        cantidadTokens
      );

      if (!success || !hash) {
        throw new Error(txError || 'Error en la transacción blockchain');
      }

      setTxHash(hash);

      // 2. Guardar en backend
      const token = Cookies.get('agrocane_token');
      if (token) {
        try {
          console.log('Guardando en backend con token:', token); // DEBUG
          console.log('Datos a enviar:', {
            empresa_id: 1,
            empresa_wallet: empresaDestino,
            agricultor_id: agricultorId,
            agricultor_wallet: agricultorWallet,
            toneladas: cantidadTokens,
            precio_total: precioTotal,
            stellar_tx_hash: hash,
          }); // DEBUG
          
          await apiClient.guardarCompraBlockchain(token, {
            empresa_id: 1,
            empresa_wallet: empresaDestino,
            agricultor_id: agricultorId,
            agricultor_wallet: agricultorWallet,
            toneladas: cantidadTokens,
            precio_total: precioTotal,
            stellar_tx_hash: hash,
          });
          
          console.log('✅ Guardado en backend exitosamente');
        } catch (backendError: any) {
          console.error('❌ Error guardando en backend:', backendError);
        }
      } else {
        console.warn('⚠️ No hay token, no se guardó en backend');
      }

      // 3. Actualizar balance
      const { balance: newBalance } = await obtenerBalance(walletAddress);
      setBalance(newBalance || 0);

      setStep('success');
      
      if (onSuccess) {
        onSuccess(hash);
      }
    } catch (err: any) {
      setError(err.message || 'Error al procesar la compra');
      setStep('error');
    }
  };

  return (
    <div className="space-y-6">
      {/* Step: Connect Wallet */}
      {step === 'connect' && (
        <div className="text-center space-y-4">
          <div className="w-20 h-20 bg-blue-500/20 rounded-full flex items-center justify-center mx-auto">
            <Wallet className="w-10 h-10 text-blue-400" />
          </div>
          <h3 className="text-2xl font-bold text-white">Conectar Wallet</h3>
          <p className="text-white/70">
            Conecta tu wallet Freighter para completar la compra en blockchain
          </p>
          <button
            onClick={handleConnectWallet}
            className="w-full bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 text-white font-bold py-4 rounded-xl transition-all"
          >
            Conectar Freighter Wallet
          </button>
          {onCancel && (
            <button
              onClick={onCancel}
              className="w-full bg-white/10 hover:bg-white/20 text-white font-semibold py-3 rounded-xl transition-all"
            >
              Cancelar
            </button>
          )}
        </div>
      )}

      {/* Step: Confirm */}
      {step === 'confirm' && walletAddress && (
        <div className="space-y-4">
          <div className="bg-green-500/20 border border-green-500/30 rounded-xl p-4">
            <div className="flex items-center gap-2 text-green-400 mb-2">
              <CheckCircle2 className="w-5 h-5" />
              <span className="font-semibold">Wallet Conectada</span>
            </div>
            <p className="text-xs font-mono text-white/70 break-all">{walletAddress}</p>
            <p className="text-white mt-2">
              Balance: <span className="font-bold text-yellow-400">{balance} tokens</span>
            </p>
          </div>

          <div className="bg-white/5 rounded-xl p-6 space-y-3">
            <h4 className="text-white font-bold text-lg">Resumen de Compra</h4>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-white/70">Vendedor:</span>
                <span className="text-white font-semibold">{agricultorNombre}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-white/70">Cantidad:</span>
                <span className="text-white font-semibold">{cantidadTokens} tokens</span>
              </div>
              <div className="flex justify-between">
                <span className="text-white/70">Precio/token:</span>
                <span className="text-white">${(precioTotal / cantidadTokens).toFixed(2)} MXN</span>
              </div>
              <div className="border-t border-white/20 pt-2 mt-2 flex justify-between">
                <span className="text-white font-bold">TOTAL:</span>
                <span className="text-2xl font-black text-white">${precioTotal.toLocaleString('es-MX')}</span>
              </div>
            </div>
          </div>

          <div className="bg-yellow-500/20 border border-yellow-500/30 rounded-xl p-4">
            <p className="text-yellow-200 text-sm">
              ⚠️ <strong>Nota:</strong> Para esta demo, debes conectar la wallet del agricultor que autoriza la venta.
            </p>
          </div>

          <div className="flex gap-3">
            <button
              onClick={onCancel}
              className="flex-1 bg-white/10 hover:bg-white/20 text-white font-semibold py-3 rounded-xl transition-all"
            >
              Cancelar
            </button>
            <button
              onClick={handleConfirmPurchase}
              className="flex-1 bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white font-bold py-3 rounded-xl transition-all"
            >
              Confirmar Compra
            </button>
          </div>
        </div>
      )}

      {/* Step: Warning (fondos insuficientes) */}
      {step === 'warning' && (
        <div className="text-center space-y-4">
          <div className="w-20 h-20 bg-yellow-500/20 rounded-full flex items-center justify-center mx-auto">
            <AlertTriangle className="w-10 h-10 text-yellow-400" />
          </div>
          <h3 className="text-2xl font-bold text-white">Advertencia</h3>
          <div className="bg-yellow-500/20 border border-yellow-500/30 rounded-xl p-4">
            <p className="text-yellow-200">{error}</p>
          </div>
          <p className="text-white/70 text-sm">
            El agricultor no tiene suficientes tokens disponibles para esta compra.
          </p>
          <div className="flex gap-3">
            {onCancel && (
              <button
                onClick={onCancel}
                className="flex-1 bg-white/10 hover:bg-white/20 text-white font-semibold py-3 rounded-xl transition-all"
              >
                Cancelar
              </button>
            )}
            <button
              onClick={() => setStep('confirm')}
              className="flex-1 bg-yellow-500 hover:bg-yellow-600 text-white font-bold py-3 rounded-xl transition-all"
            >
                Volver
              </button>
          </div>
        </div>
      )}

      {/* Step: Processing */}
      {step === 'processing' && (
        <div className="text-center space-y-4 py-8">
          <Loader2 className="w-16 h-16 text-blue-400 animate-spin mx-auto" />
          <h3 className="text-2xl font-bold text-white">Procesando...</h3>
          <p className="text-white/70">
            Esperando confirmación de la transacción en Stellar
          </p>
          <div className="text-sm text-white/50">
            Esto puede tomar 30-60 segundos
          </div>
        </div>
      )}

      {/* Step: Success */}
      {step === 'success' && txHash && (
        <div className="text-center space-y-4">
          <div className="w-20 h-20 bg-green-500/20 rounded-full flex items-center justify-center mx-auto">
            <CheckCircle2 className="w-10 h-10 text-green-400" />
          </div>
          <h3 className="text-2xl font-bold text-white">¡Compra Exitosa!</h3>
          <p className="text-white/70">
            Tu compra se registró correctamente en blockchain
          </p>

          <div className="bg-white/5 rounded-xl p-4">
            <p className="text-white/70 text-sm mb-2">Hash de transacción:</p>
            <p className="text-xs font-mono text-white break-all bg-black/30 p-3 rounded-lg">
              {txHash}
            </p>
          </div>

          <a
            href={getExplorerTxUrl(txHash)}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 text-blue-400 hover:text-blue-300 text-sm"
          >
            Ver en Stellar Explorer <ExternalLink className="w-4 h-4" />
          </a>

          <button
            onClick={onCancel}
            className="w-full bg-gradient-to-r from-blue-500 to-indigo-600 text-white font-bold py-3 rounded-xl"
          >
            Cerrar
          </button>
        </div>
      )}

      {/* Step: Error */}
      {step === 'error' && (
        <div className="text-center space-y-4">
          <div className="w-20 h-20 bg-red-500/20 rounded-full flex items-center justify-center mx-auto">
            <AlertCircle className="w-10 h-10 text-red-400" />
          </div>
          <h3 className="text-2xl font-bold text-white">Error</h3>
          <div className="bg-red-500/20 border border-red-500/30 rounded-xl p-4">
            <p className="text-red-200">{error}</p>
          </div>
          <div className="flex gap-3">
            {onCancel && (
              <button
                onClick={onCancel}
                className="flex-1 bg-white/10 hover:bg-white/20 text-white font-semibold py-3 rounded-xl transition-all"
              >
                Cancelar
              </button>
            )}
            <button
              onClick={() => setStep('connect')}
              className="flex-1 bg-blue-500 hover:bg-blue-600 text-white font-bold py-3 rounded-xl transition-all"
            >
              Reintentar
            </button>
          </div>
        </div>
      )}
    </div>
  );
}