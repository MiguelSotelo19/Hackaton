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
  rfc: string; // ✅ RFC obligatorio (puede ser CURP para agricultores)
  // Nota: Ya NO incluimos los datos de parcela aquí
}

export interface RegisterEmpresaDTO {
  email: string;
  password: string;
  nombre: string;
  rfc: string;
  tipo: 'empresa';
}

export interface CreateParcelaDTO {
  hectareas: number;
  toneladas_co2: number;
  precio_por_tonelada: number;
  ubicacion_estado: string;
  ubicacion_lat: number;
  ubicacion_lng: number;
  foto_url: string;
  fecha_siembra: string;
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
  badge_level?: string;
  wallet_address?: string | null;
  createdAt?: string;
}

export interface ApiError {
  message: string;
  statusCode: number;
}

// ===== BLOCKCHAIN TYPES =====

export interface BlockchainConfig {
  network: string;
  contractAddress: string;
  rpcUrl: string;
}

export interface CompraBlockchainDTO {
  empresa_id: number;
  parcela_id: number;
  toneladas: number;
  precio_total: number;
  tx_hash: string;
}

export interface MintBlockchainDTO {
  parcela_id: number;
  toneladas: number;
  tx_hash: string;
}

export interface BadgeBlockchainDTO {
  usuario_id: number;
  badge_level: string;
  tx_hash: string;
}

export interface VerificarTransaccionResponse {
  success: boolean;
  transaction: {
    hash: string;
    status: string;
    blockNumber: number;
    timestamp: number;
  };
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