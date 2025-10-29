'use client';
import React, { useState } from 'react';
import { Leaf, Mail, Lock, User, Phone, MapPin, Briefcase, Building2, ArrowRight, AlertCircle, CheckCircle, Eye, EyeOff, Sprout } from 'lucide-react';

type UserType = 'agricultor' | 'empresa';
type AuthMode = 'login' | 'register';

export default function AuthPage() {
  const [userType, setUserType] = useState<UserType>('agricultor');
  const [authMode, setAuthMode] = useState<AuthMode>('login');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const [formData, setFormData] = useState({
    email: '',
    password: '',
    confirmPassword: '',
    nombre: '',
    telefono: '',
    ubicacion: '',
    hectareas: '',
    razonSocial: '',
    rfc: '',
    sector: ''
  });

  const config = {
    agricultor: {
      theme: {
        primary: 'emerald',
        secondary: 'teal',
        gradient: 'from-emerald-500 to-teal-600',
        bgGradient: 'from-emerald-950 via-teal-900 to-green-950',
        glowColor: 'emerald-500',
        borderColor: 'emerald-400'
      },
      icon: Sprout,
      title: authMode === 'login' ? 'Bienvenido Agricultor' : 'Registra tu Parcela',
      subtitle: authMode === 'login' 
        ? 'Accede a tu cuenta para gestionar tus créditos' 
        : 'Comienza a generar ingresos adicionales hoy',
    },
    empresa: {
      theme: {
        primary: 'blue',
        secondary: 'indigo',
        gradient: 'from-blue-500 to-indigo-600',
        bgGradient: 'from-blue-950 via-indigo-900 to-purple-950',
        glowColor: 'blue-500',
        borderColor: 'blue-400'
      },
      icon: Briefcase,
      title: authMode === 'login' ? 'Bienvenido Empresa' : 'Únete a la Sostenibilidad',
      subtitle: authMode === 'login' 
        ? 'Accede a tu dashboard de impacto ambiental' 
        : 'Comienza tu estrategia de carbono neutral',
    }
  };

  const activeConfig = config[userType];

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setError('');
  };

  const validateForm = () => {
    if (!formData.email || !formData.password) {
      setError('Por favor completa todos los campos requeridos');
      return false;
    }

    if (authMode === 'register') {
      if (formData.password !== formData.confirmPassword) {
        setError('Las contraseñas no coinciden');
        return false;
      }
      if (formData.password.length < 8) {
        setError('La contraseña debe tener al menos 8 caracteres');
        return false;
      }
      if (!formData.nombre && !formData.razonSocial) {
        setError('Por favor ingresa tu nombre o razón social');
        return false;
      }
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
      setError('Por favor ingresa un email válido');
      return false;
    }

    return true;
  };

  const handleSubmit = (e: React.MouseEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (!validateForm()) return;

    setIsLoading(true);

    setTimeout(() => {
      setIsLoading(false);
      setSuccess(authMode === 'login' ? '¡Inicio de sesión exitoso!' : '¡Registro exitoso! Redirigiendo...');
    }, 1500);
  };

  return (
    <div className={`min-h-screen bg-gradient-to-br ${activeConfig.theme.bgGradient} overflow-hidden flex items-center justify-center p-4`}>
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className={`absolute top-20 left-10 w-72 h-72 bg-${activeConfig.theme.primary}-500/10 rounded-full blur-3xl animate-pulse`}></div>
        <div className={`absolute bottom-20 right-10 w-96 h-96 bg-${activeConfig.theme.secondary}-500/10 rounded-full blur-3xl animate-pulse`} style={{ animationDelay: '1s' }}></div>
      </div>

      <nav className="fixed top-0 left-0 right-0 z-50 bg-black/20 backdrop-blur-xl border-b border-white/10">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className={`bg-gradient-to-br ${activeConfig.theme.gradient} p-2.5 rounded-xl shadow-lg`}>
                <Leaf className="w-7 h-7 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-white tracking-tight">AgroCane</h1>
                <p className={`text-${activeConfig.theme.primary}-300 text-xs font-medium`}>
                  Powered by Stellar Blockchain
                </p>
              </div>
            </div>
          </div>
        </div>
      </nav>

      <div className="relative z-10 w-full max-w-6xl mt-20">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
          <div className="hidden lg:block space-y-6">
            <div className={`inline-flex items-center gap-2 bg-${activeConfig.theme.primary}-500/20 border border-${activeConfig.theme.primary}-400/30 rounded-full px-4 py-2 backdrop-blur-sm`}>
              <activeConfig.icon className={`w-5 h-5 text-${activeConfig.theme.primary}-400`} />
              <span className={`text-${activeConfig.theme.primary}-300 text-sm font-semibold`}>
                {userType === 'agricultor' ? 'Plataforma para Agricultores' : 'Plataforma para Empresas'}
              </span>
            </div>

            <h1 className="text-5xl font-black text-white leading-tight">
              {activeConfig.title}
            </h1>
            
            <p className="text-xl text-white/80 leading-relaxed">
              {activeConfig.subtitle}
            </p>

            <div className="space-y-4 pt-4">
              <div className="flex items-center gap-3 bg-white/5 backdrop-blur-sm rounded-xl p-4 border border-white/10">
                <CheckCircle className={`w-6 h-6 text-${activeConfig.theme.primary}-400`} />
                <span className="text-white">
                  {userType === 'agricultor' ? 'Registro gratuito en 20 minutos' : 'Dashboard en tiempo real'}
                </span>
              </div>
              <div className="flex items-center gap-3 bg-white/5 backdrop-blur-sm rounded-xl p-4 border border-white/10">
                <CheckCircle className={`w-6 h-6 text-${activeConfig.theme.primary}-400`} />
                <span className="text-white">
                  {userType === 'agricultor' ? 'Pagos directos a tu cuenta' : 'Créditos certificados ISO 14064'}
                </span>
              </div>
              <div className="flex items-center gap-3 bg-white/5 backdrop-blur-sm rounded-xl p-4 border border-white/10">
                <CheckCircle className={`w-6 h-6 text-${activeConfig.theme.primary}-400`} />
                <span className="text-white">
                  {userType === 'agricultor' ? 'Sin costos ocultos' : 'Impacto social directo'}
                </span>
              </div>
            </div>
          </div>

          <div className="w-full">
            <div className="bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-2xl rounded-3xl p-8 border border-white/20 shadow-2xl">
              <div className="flex bg-black/30 rounded-xl p-1 mb-8 gap-1">
                <button
                  onClick={() => setUserType('agricultor')}
                  className={`flex-1 py-3 rounded-lg font-bold transition-all ${
                    userType === 'agricultor'
                      ? 'bg-gradient-to-r from-emerald-500 to-teal-600 text-white shadow-lg'
                      : 'text-white/60 hover:text-white'
                  }`}
                >
                  <div className="flex items-center justify-center gap-2">
                    <Sprout className="w-5 h-5" />
                    <span>Agricultor</span>
                  </div>
                </button>
                <button
                  onClick={() => setUserType('empresa')}
                  className={`flex-1 py-3 rounded-lg font-bold transition-all ${
                    userType === 'empresa'
                      ? 'bg-gradient-to-r from-blue-500 to-indigo-600 text-white shadow-lg'
                      : 'text-white/60 hover:text-white'
                  }`}
                >
                  <div className="flex items-center justify-center gap-2">
                    <Briefcase className="w-5 h-5" />
                    <span>Empresa</span>
                  </div>
                </button>
              </div>

              <div className="flex mb-6">
                <button
                  onClick={() => setAuthMode('login')}
                  className={`flex-1 pb-3 font-bold text-lg transition-all border-b-2 ${
                    authMode === 'login'
                      ? `border-${activeConfig.theme.primary}-400 text-white`
                      : 'border-transparent text-white/50 hover:text-white/80'
                  }`}
                >
                  Iniciar Sesión
                </button>
                <button
                  onClick={() => setAuthMode('register')}
                  className={`flex-1 pb-3 font-bold text-lg transition-all border-b-2 ${
                    authMode === 'register'
                      ? `border-${activeConfig.theme.primary}-400 text-white`
                      : 'border-transparent text-white/50 hover:text-white/80'
                  }`}
                >
                  Registrarse
                </button>
              </div>

              {error && (
                <div className="mb-4 p-4 bg-red-500/20 border border-red-400/30 rounded-xl flex items-center gap-3">
                  <AlertCircle className="w-5 h-5 text-red-400 flex-shrink-0" />
                  <p className="text-red-300 text-sm">{error}</p>
                </div>
              )}

              {success && (
                <div className="mb-4 p-4 bg-green-500/20 border border-green-400/30 rounded-xl flex items-center gap-3">
                  <CheckCircle className="w-5 h-5 text-green-400 flex-shrink-0" />
                  <p className="text-green-300 text-sm">{success}</p>
                </div>
              )}

              <div className="space-y-4">
                {authMode === 'register' && (
                  <div>
                    <label className="block text-white text-sm font-medium mb-2">
                      {userType === 'agricultor' ? 'Nombre Completo' : 'Razón Social'}
                    </label>
                    <div className="relative">
                      <User className={`absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-${activeConfig.theme.primary}-400`} />
                      <input
                        type="text"
                        name={userType === 'agricultor' ? 'nombre' : 'razonSocial'}
                        value={userType === 'agricultor' ? formData.nombre : formData.razonSocial}
                        onChange={handleInputChange}
                        placeholder={userType === 'agricultor' ? 'Juan Pérez' : 'Empresa S.A. de C.V.'}
                        className="w-full pl-12 pr-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-white/40 focus:outline-none focus:border-white/30 transition-all"
                      />
                    </div>
                  </div>
                )}

                <div>
                  <label className="block text-white text-sm font-medium mb-2">Email</label>
                  <div className="relative">
                    <Mail className={`absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-${activeConfig.theme.primary}-400`} />
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      placeholder="tu@email.com"
                      className="w-full pl-12 pr-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-white/40 focus:outline-none focus:border-white/30 transition-all"
                    />
                  </div>
                </div>

                {authMode === 'register' && userType === 'empresa' && (
                  <div>
                    <label className="block text-white text-sm font-medium mb-2">RFC</label>
                    <div className="relative">
                      <Building2 className={`absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-${activeConfig.theme.primary}-400`} />
                      <input
                        type="text"
                        name="rfc"
                        value={formData.rfc}
                        onChange={handleInputChange}
                        placeholder="ABC123456XYZ"
                        className="w-full pl-12 pr-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-white/40 focus:outline-none focus:border-white/30 transition-all"
                      />
                    </div>
                  </div>
                )}

                {authMode === 'register' && userType === 'agricultor' && (
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-white text-sm font-medium mb-2">Ubicación</label>
                      <div className="relative">
                        <MapPin className={`absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-${activeConfig.theme.primary}-400`} />
                        <input
                          type="text"
                          name="ubicacion"
                          value={formData.ubicacion}
                          onChange={handleInputChange}
                          placeholder="Morelos, MX"
                          className="w-full pl-12 pr-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-white/40 focus:outline-none focus:border-white/30 transition-all"
                        />
                      </div>
                    </div>
                    <div>
                      <label className="block text-white text-sm font-medium mb-2">Hectáreas</label>
                      <input
                        type="number"
                        name="hectareas"
                        value={formData.hectareas}
                        onChange={handleInputChange}
                        placeholder="10"
                        className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-white/40 focus:outline-none focus:border-white/30 transition-all"
                      />
                    </div>
                  </div>
                )}

                <div>
                  <label className="block text-white text-sm font-medium mb-2">Contraseña</label>
                  <div className="relative">
                    <Lock className={`absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-${activeConfig.theme.primary}-400`} />
                    <input
                      type={showPassword ? 'text' : 'password'}
                      name="password"
                      value={formData.password}
                      onChange={handleInputChange}
                      placeholder="••••••••"
                      className="w-full pl-12 pr-12 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-white/40 focus:outline-none focus:border-white/30 transition-all"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-4 top-1/2 -translate-y-1/2 text-white/40 hover:text-white transition-colors"
                    >
                      {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                    </button>
                  </div>
                </div>

                {authMode === 'register' && (
                  <div>
                    <label className="block text-white text-sm font-medium mb-2">Confirmar Contraseña</label>
                    <div className="relative">
                      <Lock className={`absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-${activeConfig.theme.primary}-400`} />
                      <input
                        type={showPassword ? 'text' : 'password'}
                        name="confirmPassword"
                        value={formData.confirmPassword}
                        onChange={handleInputChange}
                        placeholder="••••••••"
                        className="w-full pl-12 pr-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-white/40 focus:outline-none focus:border-white/30 transition-all"
                      />
                    </div>
                  </div>
                )}

                {authMode === 'login' && (
                  <div className="flex items-center justify-between text-sm">
                    <label className="flex items-center gap-2 text-white/60 cursor-pointer">
                      <input type="checkbox" className="rounded" />
                      <span>Recordarme</span>
                    </label>
                    <button className={`text-${activeConfig.theme.primary}-400 hover:text-${activeConfig.theme.primary}-300 transition-colors`}>
                      ¿Olvidaste tu contraseña?
                    </button>
                  </div>
                )}

                <button
                  onClick={handleSubmit}
                  disabled={isLoading}
                  className={`w-full py-4 bg-gradient-to-r ${activeConfig.theme.gradient} hover:opacity-90 text-white font-bold rounded-xl transition-all transform hover:scale-[1.02] shadow-lg shadow-${activeConfig.theme.glowColor}/30 flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed`}
                >
                  {isLoading ? (
                    <div className="w-6 h-6 border-3 border-white/30 border-t-white rounded-full animate-spin"></div>
                  ) : (
                    <>
                      <span>{authMode === 'login' ? 'Iniciar Sesión' : 'Crear Cuenta'}</span>
                      <ArrowRight className="w-5 h-5" />
                    </>
                  )}
                </button>
              </div>

              <div className="mt-6 text-center text-sm text-white/60">
                {authMode === 'login' ? (
                  <p>
                    ¿No tienes cuenta?{' '}
                    <button
                      onClick={() => setAuthMode('register')}
                      className={`text-${activeConfig.theme.primary}-400 hover:text-${activeConfig.theme.primary}-300 font-semibold transition-colors`}
                    >
                      Regístrate gratis
                    </button>
                  </p>
                ) : (
                  <p>
                    ¿Ya tienes cuenta?{' '}
                    <button
                      onClick={() => setAuthMode('login')}
                      className={`text-${activeConfig.theme.primary}-400 hover:text-${activeConfig.theme.primary}-300 font-semibold transition-colors`}
                    >
                      Inicia sesión
                    </button>
                  </p>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}