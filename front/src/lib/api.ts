// src/lib/api.ts

import { 
  RegisterAgricultorDTO, 
  RegisterEmpresaDTO, 
  LoginDTO, 
  AuthResponse, 
  User,
  ApiError 
} from '@/types';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000';

class ApiClient {
  private baseURL: string;

  constructor() {
    this.baseURL = API_URL;
  }

  private async request<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<T> {
    const url = `${this.baseURL}${endpoint}`;
    
    const config: RequestInit = {
      ...options,
      headers: {
        'Content-Type': 'application/json',
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

  // Auth endpoints
  async register(data: RegisterAgricultorDTO | RegisterEmpresaDTO): Promise<AuthResponse> {
    return this.request<AuthResponse>('/api/auth/register', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  async login(data: LoginDTO): Promise<AuthResponse> {
    return this.request<AuthResponse>('/api/auth/login', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  async getProfile(token: string): Promise<User> {
    return this.request<User>('/api/auth/profile', {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
  }
}

export const apiClient = new ApiClient();

// Storage helpers
export const storage = {
  setToken: (token: string) => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('agrocane_token', token);
    }
  },
  
  getToken: (): string | null => {
    if (typeof window !== 'undefined') {
      return localStorage.getItem('agrocane_token');
    }
    return null;
  },
  
  removeToken: () => {
    if (typeof window !== 'undefined') {
      localStorage.removeItem('agrocane_token');
    }
  },
  
  setUser: (user: User) => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('agrocane_user', JSON.stringify(user));
    }
  },
  
  getUser: (): User | null => {
    if (typeof window !== 'undefined') {
      const user = localStorage.getItem('agrocane_user');
      return user ? JSON.parse(user) : null;
    }
    return null;
  },
  
  removeUser: () => {
    if (typeof window !== 'undefined') {
      localStorage.removeItem('agrocane_user');
    }
  },
  
  clear: () => {
    if (typeof window !== 'undefined') {
      localStorage.removeItem('agrocane_token');
      localStorage.removeItem('agrocane_user');
    }
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