// src/lib/cart-assistant.ts

import { Parcela } from './mapbox-config';

export interface CartItem {
  parcela: Parcela;
  toneladas: number;
  total: number;
}

export interface AssistantResult {
  items: CartItem[];
  totalCO2: number;
  totalCost: number;
  message: string;
  success: boolean;
}

export function autoFillCart(
  targetCO2: number,
  parcelas: Parcela[]
): AssistantResult {
  
  if (targetCO2 <= 0) {
    return {
      items: [],
      totalCO2: 0,
      totalCost: 0,
      message: 'Por favor ingresa una cantidad válida de CO₂',
      success: false,
    };
  }

  // Prioridad: 1) Precio bajo, 2) Reputación alta, 3) Mayor disponibilidad
  const sortedParcelas = [...parcelas].sort((a, b) => {
    const scoreA = a.precio_por_tonelada - (a.reputacion * 2) - (a.co2_disponible * 0.01);
    const scoreB = b.precio_por_tonelada - (b.reputacion * 2) - (b.co2_disponible * 0.01);
    return scoreA - scoreB;
  });

  const cart: CartItem[] = [];
  let remainingCO2 = targetCO2;

  for (const parcela of sortedParcelas) {
    if (remainingCO2 <= 0) break;

    const toneladasAComprar = Math.min(remainingCO2, parcela.co2_disponible);
    
    if (toneladasAComprar > 0) {
      cart.push({
        parcela,
        toneladas: toneladasAComprar,
        total: toneladasAComprar * parcela.precio_por_tonelada,
      });

      remainingCO2 -= toneladasAComprar;
    }
  }

  const totalCO2 = cart.reduce((sum, item) => sum + item.toneladas, 0);
  const totalCost = cart.reduce((sum, item) => sum + item.total, 0);

  if (remainingCO2 > 0) {
    return {
      items: cart,
      totalCO2,
      totalCost,
      message: `⚠️ Solo pudimos conseguir ${totalCO2} de ${targetCO2} toneladas. No hay suficiente inventario disponible.`,
      success: false,
    };
  }

  let message = `✅ ¡Perfecto! Encontramos la mejor combinación:`;
  if (cart.length === 1) {
    message += ` 1 parcela con ${totalCO2} toneladas por ${formatCurrency(totalCost)}.`;
  } else {
    message += ` ${cart.length} parcelas optimizadas por ${formatCurrency(totalCost)}.`;
  }

  return {
    items: cart,
    totalCO2,
    totalCost,
    message,
    success: true,
  };
}

export function calculateCartStats(items: CartItem[]) {
  const totalCO2 = items.reduce((sum, item) => sum + item.toneladas, 0);
  const totalCost = items.reduce((sum, item) => sum + item.total, 0);
  const avgPricePerTon = totalCO2 > 0 ? totalCost / totalCO2 : 0;
  const equivalentCars = (totalCO2 * 0.22).toFixed(1);
  
  return {
    totalCO2,
    totalCost,
    avgPricePerTon,
    equivalentCars,
    parcelas: items.length,
  };
}

function formatCurrency(amount: number): string {
  return new Intl.NumberFormat('es-MX', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 0,
  }).format(amount);
}