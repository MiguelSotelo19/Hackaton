'use client';

import React, { useEffect } from 'react';
import { CheckCircle, AlertCircle, AlertTriangle, X } from 'lucide-react';

interface ToastProps {
  message: string;
  type: 'success' | 'error' | 'warning' | 'info';
  onClose: () => void;
  duration?: number;
}

export default function Toast({ message, type, onClose, duration = 4000 }: ToastProps) {
  useEffect(() => {
    const timer = setTimeout(onClose, duration);
    return () => clearTimeout(timer);
  }, [duration, onClose]);

  const styles = {
    success: {
      bg: 'from-green-500/90 to-emerald-600/90',
      border: 'border-green-400/50',
      icon: <CheckCircle className="w-6 h-6" />,
    },
    error: {
      bg: 'from-red-500/90 to-rose-600/90',
      border: 'border-red-400/50',
      icon: <AlertCircle className="w-6 h-6" />,
    },
    warning: {
      bg: 'from-yellow-500/90 to-amber-600/90',
      border: 'border-yellow-400/50',
      icon: <AlertTriangle className="w-6 h-6" />,
    },
    info: {
      bg: 'from-blue-500/90 to-indigo-600/90',
      border: 'border-blue-400/50',
      icon: <CheckCircle className="w-6 h-6" />,
    },
  };

  const style = styles[type];

  return (
    <div className="fixed top-6 right-6 z-[100] animate-slide-in-right">
      <div
        className={`bg-gradient-to-r ${style.bg} backdrop-blur-xl border ${style.border} text-white px-6 py-4 rounded-2xl shadow-2xl max-w-md flex items-start gap-3`}
      >
        <div className="flex-shrink-0 mt-0.5">{style.icon}</div>
        <p className="flex-1 text-sm font-medium leading-relaxed">{message}</p>
        <button
          onClick={onClose}
          className="flex-shrink-0 hover:bg-white/20 rounded-full p-1 transition-colors"
        >
          <X className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}

// Hook para usar Toast fácilmente
export function useToast() {
  const [toasts, setToasts] = React.useState<Array<{ id: number; message: string; type: 'success' | 'error' | 'warning' | 'info' }>>([]);

  const showToast = (message: string, type: 'success' | 'error' | 'warning' | 'info' = 'info') => {
    const id = Date.now();
    setToasts((prev) => [...prev, { id, message, type }]);
  };

  const removeToast = (id: number) => {
    setToasts((prev) => prev.filter((toast) => toast.id !== id));
  };

  return { toasts, showToast, removeToast };
}