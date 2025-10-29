// src/lib/api.ts

import Cookies from 'js-cookie';
import {
  RegisterAgricultorDTO,
  RegisterEmpresaDTO,
  LoginDTO,
  AuthResponse,
  User,
  ApiError,
  BlockchainConfig,
  CompraBlockchainDTO,
  MintBlockchainDTO,
  BadgeBlockchainDTO,
  VerificarTransaccionResponse,
  CreateParcelaDTO,
} from '@/types';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000';

// Configuración de cookies
const COOKIE_CONFIG = {
  expires: 7, // 7 días
  secure: process.env.NODE_ENV === 'production',
  sameSite: 'lax' as const,
  path: '/',
};

class ApiClient {
  private baseURL: string;

  constructor() {
    this.baseURL = API_URL;
  }

  async request<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<T> {
    const url = `${this.baseURL}${endpoint}`;
    
    // Obtener token de cookies para requests autenticados
    const token = storage.getToken();
    
    const config: RequestInit = {
      ...options,
      credentials: 'include', // Importante para cookies
      headers: {
        'Content-Type': 'application/json',
        ...(token && { Authorization: `Bearer ${token}` }),
        ...options.headers,
      },
    };

    try {
      const response = await fetch(url, config);
      const data = await response.json();

      if (!response.ok) {
        throw {
          message: data.message || 'Error en la petición',
          statusCode: response.status,
        } as ApiError;
      }

      return data;
    } catch (error: any) {
      if (error.statusCode) {
        throw error;
      }
      throw {
        message: 'Error de conexión con el servidor',
        statusCode: 0,
      } as ApiError;
    }
  }

  // ===== AUTH ENDPOINTS =====
  
  async register(data: RegisterAgricultorDTO | RegisterEmpresaDTO): Promise<AuthResponse> {
    const response = await this.request<any>('/api/auth/register', {
      method: 'POST',
      body: JSON.stringify(data),
    });

    // Normalizar respuesta del backend (usuario -> user)
    return {
      token: response.token,
      user: response.usuario || response.user,
    };
  }

  async login(data: LoginDTO): Promise<AuthResponse> {
    const response = await this.request<any>('/api/auth/login', {
      method: 'POST',
      body: JSON.stringify(data),
    });

    // Normalizar respuesta del backend (usuario -> user)
    return {
      token: response.token,
      user: response.usuario || response.user,
    };
  }

  async getProfile(token: string): Promise<User> {
    return this.request<User>('/api/auth/profile', {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
  }

  async logout(): Promise<void> {
    try {
      await this.request('/api/auth/logout', {
        method: 'POST',
      });
    } catch (error) {
      console.error('Error al hacer logout en el servidor:', error);
    }
  }

  // ===== PARCELA ENDPOINTS =====

  async createParcela(data: CreateParcelaDTO): Promise<{ message: string; parcela: any }> {
    return this.request('/api/parcelas/', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  // ===== BLOCKCHAIN ENDPOINTS =====

  async getBlockchainConfig(): Promise<BlockchainConfig> {
    return this.request<BlockchainConfig>('/api/blockchain/config', {
      method: 'GET',
    });
  }

  async guardarCompraBlockchain(data: CompraBlockchainDTO): Promise<{ message: string; compra: any }> {
    return this.request('/api/blockchain/compra', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  async guardarMinteoBlockchain(data: MintBlockchainDTO): Promise<{ message: string; minteo: any }> {
    return this.request('/api/blockchain/mint', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  async guardarBadgeBlockchain(data: BadgeBlockchainDTO): Promise<{ message: string; badge: any }> {
    return this.request('/api/blockchain/badge', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  async verificarTransaccion(txHash: string): Promise<VerificarTransaccionResponse> {
    return this.request<VerificarTransaccionResponse>(`/api/blockchain/verificar/${txHash}`, {
      method: 'GET',
    });
  }
}

export const apiClient = new ApiClient();

// Storage helpers con COOKIES
export const storage = {
  setToken: (token: string) => {
    Cookies.set('agrocane_token', token, COOKIE_CONFIG);
  },
  
  getToken: (): string | null => {
    return Cookies.get('agrocane_token') || null;
  },
  
  removeToken: () => {
    Cookies.remove('agrocane_token', { path: '/' });
  },
  
  setUser: (user: User) => {
    // Guardar user en cookie como JSON string
    Cookies.set('agrocane_user', JSON.stringify(user), COOKIE_CONFIG);
  },
  
  getUser: (): User | null => {
    try {
      const userCookie = Cookies.get('agrocane_user');
      if (!userCookie) return null;
      
      const user = JSON.parse(userCookie);
      return user;
    } catch (error) {
      console.error('Error al parsear user de cookie:', error);
      // Limpiar cookie corrupta
      Cookies.remove('agrocane_user', { path: '/' });
      return null;
    }
  },
  
  removeUser: () => {
    Cookies.remove('agrocane_user', { path: '/' });
  },
  
  clear: () => {
    Cookies.remove('agrocane_token', { path: '/' });
    Cookies.remove('agrocane_user', { path: '/' });
  }
};

// Fotos aleatorias para agricultores
export const FOTOS_PARCELAS = [
  'https://images.unsplash.com/photo-1625246333195-78d9c38ad449?w=800',
  'https://images.unsplash.com/photo-1574943320219-553eb213f72d?w=800',
  'https://images.unsplash.com/photo-1464226184884-fa280b87c399?w=800',
  'https://images.unsplash.com/photo-1500382017468-9049fed747ef?w=800',
  'https://images.unsplash.com/photo-1530836369250-ef72a3f5cda8?w=800',
  'https://images.unsplash.com/photo-1523348837708-15d4a09cfac2?w=800',
  'https://images.unsplash.com/photo-1560493676-04071c5f467b?w=800',
];

export const getRandomFoto = (): string => {
  return FOTOS_PARCELAS[Math.floor(Math.random() * FOTOS_PARCELAS.length)];
};