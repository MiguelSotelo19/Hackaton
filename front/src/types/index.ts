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