// src/types/index.ts

export type UserType = 'agricultor' | 'empresa';

export interface RegisterAgricultorDTO {
  email: string;
  password: string;
  nombre: string;
  tipo: 'agricultor';
  hectareas: number;
  toneladas_co2: number;
  precio_por_tonelada: number;
  ubicacion_estado: string;
  ubicacion_lat: number;
  ubicacion_lng: number;
  foto_url: string;
  fecha_siembra: string;
}

export interface RegisterEmpresaDTO {
  email: string;
  password: string;
  nombre: string;
  rfc: string;
  tipo: 'empresa';
}

export interface LoginDTO {
  email: string;
  password: string;
}

export interface AuthResponse {
  token: string;
  user: User;
}

export interface User {
  id: number;
  email: string;
  nombre: string;
  tipo: UserType;
  rfc?: string;
  hectareas?: number;
  toneladas_co2?: number;
  precio_por_tonelada?: number;
  ubicacion_estado?: string;
  ubicacion_lat?: number;
  ubicacion_lng?: number;
  foto_url?: string;
  fecha_siembra?: string;
  createdAt: string;
}

export interface ApiError {
  message: string;
  statusCode: number;
}

// ===== BLOCKCHAIN TYPES =====

export interface BlockchainConfig {
  contractId: string;
  network: string;
  rpcUrl: string;
  explorerUrl: string;
}

export interface CompraBlockchainDTO {
  stellar_tx_hash: string;
  comprador_wallet: string;
  vendedor_wallet: string;
  cantidad_tokens: number;
  precio_total: number;
  parcela_id?: number;
}

export interface MintBlockchainDTO {
  stellar_tx_hash: string;
  destinatario_wallet: string;
  cantidad_tokens: number;
  parcela_id?: number;
}

export interface BadgeBlockchainDTO {
  stellar_tx_hash: string;
  wallet_address: string;
  badge_level: 'nuevo' | 'verificado' | 'confiable' | 'elite';
  motivo?: string;
}

export interface VerificarTransaccionResponse {
  existe: boolean;
  tipo?: 'compra' | 'minteo' | 'badge';
  fecha?: string;
  detalles?: any;
}

// Para el componente de compra
export interface Agricultor {
  id: number;
  nombre: string;
  wallet_address: string;
  balance_tokens: number;
  badge_level: string;
  precio_por_token: number;
  parcela?: {
    id: number;
    nombre: string;
    hectareas: number;
    captura_co2_anual: number;
  };
}

export interface CompraState {
  agricultorSeleccionado: Agricultor | null;
  cantidadTokens: number;
  precioTotal: number;
  walletConectada: string | null;
  balanceActual: number;
  procesando: boolean;
  error: string | null;
  txHash: string | null;
}