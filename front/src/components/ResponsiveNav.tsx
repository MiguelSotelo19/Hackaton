import React from 'react';
import { Leaf, ArrowRight } from 'lucide-react';

interface ResponsiveNavProps {
  theme: {
    gradient: string;
    logo: string;
    primary: string;
    glowColor: string;
  };
  onLogin: () => void;
}

export default function ResponsiveNav({ theme, onLogin }: ResponsiveNavProps) {
  return (
    <nav className="relative z-50 bg-black/20 backdrop-blur-xl border-b border-white/10">
      <div className="container mx-auto px-4 md:px-6 py-3 md:py-4">
        <div className="flex items-center justify-between gap-4">
          {/* Logo */}
          <div className="flex items-center gap-2 md:gap-3 flex-shrink-0">
            <div className={`bg-gradient-to-br ${theme.gradient} p-2 md:p-2.5 rounded-xl shadow-lg shadow-${theme.glowColor}/50 transition-all duration-500`}>
              <Leaf className="w-5 h-5 md:w-7 md:h-7 text-white" />
            </div>
            <div>
              <h1 className="text-lg md:text-2xl font-bold text-white tracking-tight">
                Agro<strong className={`bg-gradient-to-r ${theme.logo} bg-clip-text text-transparent`}>Can</strong>e
              </h1>
              <p className={`text-${theme.primary}-300 text-xs font-medium transition-colors duration-500 hidden md:block`}>
                Powered by Stellar Blockchain
              </p>
            </div>
          </div>

          {/* Actions */}
          <div className="flex items-center gap-2 md:gap-3">
            {/* Login Button - Always visible */}
            <button 
              onClick={onLogin}
              className="px-3 py-2 md:px-5 md:py-2.5 bg-white/5 hover:bg-white/10 text-white rounded-lg md:rounded-xl transition-all border border-white/10 font-medium text-sm md:text-base"
            >
              <span className="hidden sm:inline">Iniciar Sesión</span>
              <span className="sm:hidden">Entrar</span>
            </button>

            {/* CTA Button */}
            <button 
              onClick={onLogin}
              className={`px-3 py-2 md:px-5 md:py-2.5 bg-gradient-to-r ${theme.gradient} hover:opacity-90 text-white rounded-lg md:rounded-xl transition-all font-semibold shadow-lg shadow-${theme.glowColor}/30 flex items-center gap-1 md:gap-2 text-sm md:text-base`}
            >
              <span className="hidden sm:inline">Comenzar Ahora</span>
              <span className="sm:hidden">Empezar</span>
              <ArrowRight className="w-3 h-3 md:w-4 md:h-4" />
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
}