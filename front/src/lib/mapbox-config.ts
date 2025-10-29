// src/lib/mapbox-config.ts

export interface Parcela {
  id: number;
  nombre: string;
  apellido: string;
  hectareas: number;
  co2_disponible: number;
  lat: number;
  lng: number;
  reputacion: number; // 1-5 estrellas
  foto: string;
  estado: string;
  municipio: string;
  precio_por_tonelada: number;
  certificaciones: string[];
  anos_experiencia: number;
}

// Datos de 20 parcelas en Xochitepec, Morelos
export const PARCELAS_MOCK: Parcela[] = [
  {
    id: 1,
    nombre: "Juan",
    apellido: "Pérez García",
    hectareas: 12.5,
    co2_disponible: 245,
    lat: 18.7983,
    lng: -99.2358,
    reputacion: 5,
    foto: "https://images.unsplash.com/photo-1625246333195-78d9c38ad449?w=400",
    estado: "Morelos",
    municipio: "Xochitepec",
    precio_por_tonelada: 28,
    certificaciones: ["ISO 14064", "Rainforest Alliance"],
    anos_experiencia: 15
  },
  {
    id: 2,
    nombre: "María",
    apellido: "González López",
    hectareas: 8.3,
    co2_disponible: 163,
    lat: 18.8045,
    lng: -99.2289,
    reputacion: 4,
    foto: "https://images.unsplash.com/photo-1574943320219-553eb213f72d?w=400",
    estado: "Morelos",
    municipio: "Xochitepec",
    precio_por_tonelada: 26,
    certificaciones: ["ISO 14064"],
    anos_experiencia: 8
  },
  {
    id: 3,
    nombre: "Carlos",
    apellido: "Ramírez Torres",
    hectareas: 15.2,
    co2_disponible: 298,
    lat: 18.7920,
    lng: -99.2410,
    reputacion: 5,
    foto: "https://images.unsplash.com/photo-1464226184884-fa280b87c399?w=400",
    estado: "Morelos",
    municipio: "Xochitepec",
    precio_por_tonelada: 30,
    certificaciones: ["ISO 14064", "Rainforest Alliance", "Fair Trade"],
    anos_experiencia: 22
  },
  {
    id: 4,
    nombre: "Ana",
    apellido: "López Martínez",
    hectareas: 6.8,
    co2_disponible: 134,
    lat: 18.8012,
    lng: -99.2195,
    reputacion: 4,
    foto: "https://images.unsplash.com/photo-1500382017468-9049fed747ef?w=400",
    estado: "Morelos",
    municipio: "Xochitepec",
    precio_por_tonelada: 25,
    certificaciones: ["ISO 14064"],
    anos_experiencia: 6
  },
  {
    id: 5,
    nombre: "Roberto",
    apellido: "Sánchez Cruz",
    hectareas: 10.5,
    co2_disponible: 206,
    lat: 18.7875,
    lng: -99.2502,
    reputacion: 5,
    foto: "https://images.unsplash.com/photo-1530836369250-ef72a3f5cda8?w=400",
    estado: "Morelos",
    municipio: "Xochitepec",
    precio_por_tonelada: 27,
    certificaciones: ["ISO 14064", "Rainforest Alliance"],
    anos_experiencia: 18
  },
  {
    id: 6,
    nombre: "Laura",
    apellido: "Martínez Flores",
    hectareas: 9.2,
    co2_disponible: 181,
    lat: 18.8098,
    lng: -99.2342,
    reputacion: 4,
    foto: "https://images.unsplash.com/photo-1523348837708-15d4a09cfac2?w=400",
    estado: "Morelos",
    municipio: "Xochitepec",
    precio_por_tonelada: 26,
    certificaciones: ["ISO 14064"],
    anos_experiencia: 10
  },
  {
    id: 7,
    nombre: "Diego",
    apellido: "Flores Hernández",
    hectareas: 14.1,
    co2_disponible: 277,
    lat: 18.7952,
    lng: -99.2145,
    reputacion: 5,
    foto: "https://previews.123rf.com/images/keantian/keantian1611/keantian161100022/65612572-garden-plots-were-planted-with-sugar-cane-which-was-the-scene-of-trees-and-shrubs-in-the-background.jpg",
    estado: "Morelos",
    municipio: "Xochitepec",
    precio_por_tonelada: 29,
    certificaciones: ["ISO 14064", "Fair Trade"],
    anos_experiencia: 20
  },
  {
    id: 8,
    nombre: "Sofía",
    apellido: "Torres Reyes",
    hectareas: 7.6,
    co2_disponible: 149,
    lat: 18.8131,
    lng: -99.2428,
    reputacion: 4,
    foto: "https://images.unsplash.com/photo-1472214103451-9374bd1c798e?w=400",
    estado: "Morelos",
    municipio: "Xochitepec",
    precio_por_tonelada: 25,
    certificaciones: ["ISO 14064"],
    anos_experiencia: 7
  },
  {
    id: 9,
    nombre: "Miguel Ángel",
    apellido: "Ruiz Morales",
    hectareas: 11.8,
    co2_disponible: 232,
    lat: 18.7891,
    lng: -99.2278,
    reputacion: 5,
    foto: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQF9-WRvspBne-sOYTjGMXbZWqrrPhgcuJkbA&s",
    estado: "Morelos",
    municipio: "Xochitepec",
    precio_por_tonelada: 28,
    certificaciones: ["ISO 14064", "Rainforest Alliance"],
    anos_experiencia: 16
  },
  {
    id: 10,
    nombre: "Patricia",
    apellido: "Herrera Vega",
    hectareas: 8.9,
    co2_disponible: 175,
    lat: 18.8067,
    lng: -99.2512,
    reputacion: 4,
    foto: "https://images.unsplash.com/photo-1500382017468-9049fed747ef?w=400",
    estado: "Morelos",
    municipio: "Xochitepec",
    precio_por_tonelada: 26,
    certificaciones: ["ISO 14064"],
    anos_experiencia: 9
  },
  {
    id: 11,
    nombre: "Fernando",
    apellido: "Castro Jiménez",
    hectareas: 13.4,
    co2_disponible: 263,
    lat: 18.7938,
    lng: -99.2389,
    reputacion: 5,
    foto: "https://images.unsplash.com/photo-1625246333195-78d9c38ad449?w=400",
    estado: "Morelos",
    municipio: "Xochitepec",
    precio_por_tonelada: 29,
    certificaciones: ["ISO 14064", "Rainforest Alliance", "Fair Trade"],
    anos_experiencia: 19
  },
  {
    id: 12,
    nombre: "Gabriela",
    apellido: "Morales Ortiz",
    hectareas: 6.2,
    co2_disponible: 122,
    lat: 18.8109,
    lng: -99.2156,
    reputacion: 3,
    foto: "https://www.gob.mx/cms/uploads/article/main_image/106187/WhatsApp_Image_2020-03-11_at_2.32.07_PM__4_.jpeg",
    estado: "Morelos",
    municipio: "Xochitepec",
    precio_por_tonelada: 24,
    certificaciones: ["ISO 14064"],
    anos_experiencia: 5
  },
  {
    id: 13,
    nombre: "Javier",
    apellido: "Ortiz Mendoza",
    hectareas: 16.7,
    co2_disponible: 328,
    lat: 18.7862,
    lng: -99.2445,
    reputacion: 5,
    foto: "https://images.unsplash.com/photo-1464226184884-fa280b87c399?w=400",
    estado: "Morelos",
    municipio: "Xochitepec",
    precio_por_tonelada: 31,
    certificaciones: ["ISO 14064", "Rainforest Alliance", "Fair Trade"],
    anos_experiencia: 25
  },
  {
    id: 14,
    nombre: "Carmen",
    apellido: "Vega Navarro",
    hectareas: 9.8,
    co2_disponible: 192,
    lat: 18.8023,
    lng: -99.2223,
    reputacion: 4,
    foto: "https://images.unsplash.com/photo-1500382017468-9049fed747ef?w=400",
    estado: "Morelos",
    municipio: "Xochitepec",
    precio_por_tonelada: 27,
    certificaciones: ["ISO 14064"],
    anos_experiencia: 11
  },
  {
    id: 15,
    nombre: "Andrés",
    apellido: "Jiménez Vargas",
    hectareas: 12.1,
    co2_disponible: 238,
    lat: 18.7969,
    lng: -99.2534,
    reputacion: 5,
    foto: "https://images.unsplash.com/photo-1530836369250-ef72a3f5cda8?w=400",
    estado: "Morelos",
    municipio: "Xochitepec",
    precio_por_tonelada: 28,
    certificaciones: ["ISO 14064", "Rainforest Alliance"],
    anos_experiencia: 17
  },
  {
    id: 16,
    nombre: "Beatriz",
    apellido: "Mendoza Castro",
    hectareas: 7.4,
    co2_disponible: 145,
    lat: 18.8142,
    lng: -99.2312,
    reputacion: 4,
    foto: "https://images.unsplash.com/photo-1523348837708-15d4a09cfac2?w=400",
    estado: "Morelos",
    municipio: "Xochitepec",
    precio_por_tonelada: 25,
    certificaciones: ["ISO 14064"],
    anos_experiencia: 8
  },
  {
    id: 17,
    nombre: "Ricardo",
    apellido: "Vargas Ruiz",
    hectareas: 10.9,
    co2_disponible: 214,
    lat: 18.7906,
    lng: -99.2167,
    reputacion: 5,
    foto: "https://images.unsplash.com/photo-1560493676-04071c5f467b?w=400",
    estado: "Morelos",
    municipio: "Xochitepec",
    precio_por_tonelada: 27,
    certificaciones: ["ISO 14064", "Fair Trade"],
    anos_experiencia: 14
  },
  {
    id: 18,
    nombre: "Elena",
    apellido: "Reyes Sánchez",
    hectareas: 8.6,
    co2_disponible: 169,
    lat: 18.8076,
    lng: -99.2467,
    reputacion: 4,
    foto: "https://images.unsplash.com/photo-1472214103451-9374bd1c798e?w=400",
    estado: "Morelos",
    municipio: "Xochitepec",
    precio_por_tonelada: 26,
    certificaciones: ["ISO 14064"],
    anos_experiencia: 9
  },
  {
    id: 19,
    nombre: "Pablo",
    apellido: "Navarro Cruz",
    hectareas: 14.8,
    co2_disponible: 291,
    lat: 18.7927,
    lng: -99.2301,
    reputacion: 5,
    foto: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400",
    estado: "Morelos",
    municipio: "Xochitepec",
    precio_por_tonelada: 30,
    certificaciones: ["ISO 14064", "Rainforest Alliance"],
    anos_experiencia: 21
  },
  {
    id: 20,
    nombre: "Daniela",
    apellido: "Cruz Herrera",
    hectareas: 11.3,
    co2_disponible: 222,
    lat: 18.8054,
    lng: -99.2378,
    reputacion: 5,
    foto: "https://images.unsplash.com/photo-1625246333195-78d9c38ad449?w=400",
    estado: "Morelos",
    municipio: "Xochitepec",
    precio_por_tonelada: 28,
    certificaciones: ["ISO 14064", "Rainforest Alliance"],
    anos_experiencia: 13
  }
];

// Configuración del mapa
export const MAP_CONFIG = {
  center: [-99.2358, 18.7983] as [number, number], // Xochitepec, Morelos
  zoom: 12.5,
  pitch: 55, // Inclinación 3D
  bearing: 0,
  style: 'mapbox://styles/mapbox/satellite-streets-v12', // Estilo satélite con calles
};

// Helpers
export const getStarRating = (rating: number): string => {
  return '⭐'.repeat(rating);
};

export const formatCurrency = (amount: number): string => {
  return new Intl.NumberFormat('es-MX', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 0,
  }).format(amount);
};

export const calculateImpactoAutos = (co2Tons: number): number => {
  return parseFloat((co2Tons * 0.22).toFixed(1));
};