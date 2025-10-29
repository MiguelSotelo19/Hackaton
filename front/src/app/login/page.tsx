'use client';
import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Leaf, Mail, Lock, User, MapPin, Briefcase, Building2, ArrowRight, AlertCircle, CheckCircle, Eye, EyeOff, Sprout, Calendar, DollarSign, TrendingUp } from 'lucide-react';
import { apiClient, storage, getRandomFoto } from '@/lib/api';
import { UserType, RegisterAgricultorDTO, RegisterEmpresaDTO } from '@/types';
import Link from 'next/link';

type AuthMode = 'login' | 'register';
type RegisterStep = 1 | 2;

export default function AuthPage() {
  const router = useRouter();
  const [userType, setUserType] = useState<UserType>('agricultor');
  const [authMode, setAuthMode] = useState<AuthMode>('login');
  const [registerStep, setRegisterStep] = useState<RegisterStep>(1);
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const [formData, setFormData] = useState({
    email: '',
    password: '',
    confirmPassword: '',
    nombre: '',
    rfc: '',
    // Datos de parcela (paso 2 - agricultor)
    hectareas: '',
    toneladas_co2: '',
    precio_por_tonelada: '',
    ubicacion_estado: 'Morelos',
    ubicacion_lat: '',
    ubicacion_lng: '',
    fecha_siembra: '',
  });


  const config = {
    agricultor: {
      theme: {
        primary: 'emerald',
        secondary: 'teal',
        gradient: 'from-emerald-500 to-teal-600',
        bgGradient: 'from-emerald-950 via-teal-900 to-green-950',
        glowColor: 'emerald-500',
      },
      icon: Sprout,
      title: authMode === 'login' ? 'Bienvenido Agricultor' : registerStep === 1 ? 'Registra tu Cuenta' : 'Datos de tu Parcela',
      subtitle: authMode === 'login'
        ? 'Accede para gestionar tus créditos'
        : registerStep === 1
          ? 'Comienza a generar ingresos adicionales'
          : 'Completa la información de tu parcela',
    },
    empresa: {
      theme: {
        primary: 'blue',
        secondary: 'indigo',
        gradient: 'from-blue-500 to-indigo-600',
        bgGradient: 'from-blue-950 via-indigo-900 to-purple-950',
        glowColor: 'blue-500',
      },
      icon: Briefcase,
      title: authMode === 'login' ? 'Bienvenido Empresa' : 'Únete a la Sostenibilidad',
      subtitle: authMode === 'login'
        ? 'Accede a tu dashboard de impacto'
        : 'Comienza tu estrategia carbono neutral',
    }
  };

  const activeConfig = config[userType];

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setError('');
  };

  const validateStep1 = () => {
    if (!formData.email || !formData.password) {
      setError('Por favor completa todos los campos');
      return false;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
      setError('Email inválido');
      return false;
    }

    if (authMode === 'register') {
      if (formData.password !== formData.confirmPassword) {
        setError('Las contraseñas no coinciden');
        return false;
      }
      if (formData.password.length < 8) {
        setError('La contraseña debe tener mínimo 8 caracteres');
        return false;
      }
      if (!formData.nombre) {
        setError('El nombre es requerido');
        return false;
      }
      if (userType === 'empresa' && !formData.rfc) {
        setError('El RFC es requerido');
        return false;
      }
    }

    return true;
  };

  const validateStep2 = () => {
    if (!formData.hectareas || !formData.toneladas_co2 || !formData.precio_por_tonelada) {
      setError('Completa todos los campos de la parcela');
      return false;
    }

    if (!formData.ubicacion_lat || !formData.ubicacion_lng) {
      setError('Ingresa las coordenadas GPS');
      return false;
    }

    if (!formData.fecha_siembra) {
      setError('Ingresa la fecha de siembra');
      return false;
    }

    return true;
  };

  const handleLogin = async () => {
    if (!validateStep1()) return;

    setIsLoading(true);
    setError('');

    try {
      const response = await apiClient.login({
        email: formData.email,
        password: formData.password,
      });

      storage.setToken(response.token);
      storage.setUser(response.user);

      setSuccess('¡Inicio de sesión exitoso!');

      setTimeout(() => {
        router.push('/perfil');
      }, 1000);

    } catch (err: any) {
      setError(err.message || 'Error al iniciar sesión');
    } finally {
      setIsLoading(false);
    }
  };

  const handleRegisterStep1 = () => {
    if (!validateStep1()) return;

    if (userType === 'empresa') {
      handleRegisterEmpresa();
    } else {
      setRegisterStep(2);
    }
  };

  const handleRegisterStep2 = () => {
    if (!validateStep2()) return;
    handleRegisterAgricultor();
  };

  const handleRegisterAgricultor = async () => {
    setIsLoading(true);
    setError('');

    try {
      const data: RegisterAgricultorDTO = {
        email: formData.email,
        password: formData.password,
        nombre: formData.nombre,
        tipo: 'agricultor',
        hectareas: parseFloat(formData.hectareas),
        toneladas_co2: parseFloat(formData.toneladas_co2),
        precio_por_tonelada: parseFloat(formData.precio_por_tonelada),
        ubicacion_estado: formData.ubicacion_estado,
        ubicacion_lat: parseFloat(formData.ubicacion_lat),
        ubicacion_lng: parseFloat(formData.ubicacion_lng),
        foto_url: getRandomFoto(),
        fecha_siembra: formData.fecha_siembra,
      };

      const response = await apiClient.register(data);

      storage.setToken(response.token);
      storage.setUser(response.user);

      setSuccess('¡Registro exitoso! Redirigiendo...');

      setTimeout(() => {
        router.push('/perfil');
      }, 1500);

    } catch (err: any) {
      setError(err.message || 'Error al registrar');
    } finally {
      setIsLoading(false);
    }
  };

  const handleRegisterEmpresa = async () => {
    setIsLoading(true);
    setError('');

    try {
      const data: RegisterEmpresaDTO = {
        email: formData.email,
        password: formData.password,
        nombre: formData.nombre,
        rfc: formData.rfc,
        tipo: 'empresa',
      };

      const response = await apiClient.register(data);

      storage.setToken(response.token);
      storage.setUser(response.user);

      setSuccess('¡Registro exitoso! Redirigiendo...');

      setTimeout(() => {
        router.push('/perfil');
      }, 1500);

    } catch (err: any) {
      setError(err.message || 'Error al registrar');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = () => {
    if (authMode === 'login') {
      handleLogin();
    } else {
      if (registerStep === 1) {
        handleRegisterStep1();
      } else {
        handleRegisterStep2();
      }
    }
  };

  return (
    <div className={`min-h-screen bg-gradient-to-br ${activeConfig.theme.bgGradient} overflow-hidden flex items-center justify-center p-4`}>
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className={`absolute top-20 left-10 w-72 h-72 bg-${activeConfig.theme.primary}-500/10 rounded-full blur-3xl animate-pulse`}></div>
        <div className={`absolute bottom-20 right-10 w-96 h-96 bg-${activeConfig.theme.secondary}-500/10 rounded-full blur-3xl animate-pulse`} style={{ animationDelay: '1s' }}></div>
      </div>

      <nav className="fixed top-0 left-0 right-0 z-50 bg-black/20 backdrop-blur-xl border-b border-white/10">
        <div className="container mx-auto px-4 md:px-6 py-3 md:py-4">
          <div className="flex items-center justify-between">
            <Link href="/" className="flex items-center gap-2 md:gap-3">
              <div className={`bg-gradient-to-br ${activeConfig.theme.gradient} p-2 md:p-2.5 rounded-xl shadow-lg`}>
                <Leaf className="w-5 h-5 md:w-7 md:h-7 text-white" />
              </div>
              <div>
                <h1 className="text-lg md:text-2xl font-bold text-white">AgroCane</h1>
                <p className={`text-${activeConfig.theme.primary}-300 text-xs hidden md:block`}>
                  Powered by Stellar
                </p>
              </div>
            </Link>
          </div>
        </div>
      </nav>

      <div className="relative z-10 w-full max-w-6xl mt-20 md:mt-24">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 md:gap-8 items-center">
          <div className="hidden lg:block space-y-6">
            <div className={`inline-flex items-center gap-2 bg-${activeConfig.theme.primary}-500/20 border border-${activeConfig.theme.primary}-400/30 rounded-full px-4 py-2`}>
              <activeConfig.icon className={`w-5 h-5 text-${activeConfig.theme.primary}-400`} />
              <span className={`text-${activeConfig.theme.primary}-300 text-sm font-semibold`}>
                {userType === 'agricultor' ? 'Para Agricultores' : 'Para Empresas'}
              </span>
            </div>

            <h1 className="text-5xl font-black text-white leading-tight">
              {activeConfig.title}
            </h1>

            <p className="text-xl text-white/80 leading-relaxed">
              {activeConfig.subtitle}
            </p>

            <div className="space-y-4 pt-4">
              {[
                userType === 'agricultor' ? 'Registro en 2 pasos' : 'Dashboard en tiempo real',
                userType === 'agricultor' ? 'Pagos directos' : 'Créditos certificados ISO',
                userType === 'agricultor' ? 'Sin costos ocultos' : 'Impacto social medible'
              ].map((text, i) => (
                <div key={i} className="flex items-center gap-3 bg-white/5 rounded-xl p-4 border border-white/10">
                  <CheckCircle className={`w-6 h-6 text-${activeConfig.theme.primary}-400`} />
                  <span className="text-white">{text}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="w-full">
            <div className="bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-2xl rounded-2xl md:rounded-3xl p-6 md:p-8 border border-white/20 shadow-2xl">
              
                <div className="flex bg-black/30 rounded-xl p-1 mb-6 gap-1">
                  <button
                    onClick={() => {
                      setUserType('agricultor');
                      setRegisterStep(1);
                    }}
                    className={`flex-1 py-3 rounded-lg font-bold transition-all ${userType === 'agricultor'
                      ? 'bg-gradient-to-r from-emerald-500 to-teal-600 text-white shadow-lg'
                      : 'text-white/60 hover:text-white'
                      }`}
                  >
                    <div className="flex items-center justify-center gap-2">
                      <Sprout className="w-4 h-4 md:w-5 md:h-5" />
                      <span className="text-sm md:text-base">Agricultor</span>
                    </div>
                  </button>
                  <button
                    onClick={() => {
                      setUserType('empresa');
                      setRegisterStep(1);
                    }}
                    className={`flex-1 py-3 rounded-lg font-bold transition-all ${userType === 'empresa'
                      ? 'bg-gradient-to-r from-blue-500 to-indigo-600 text-white shadow-lg'
                      : 'text-white/60 hover:text-white'
                      }`}
                  >
                    <div className="flex items-center justify-center gap-2">
                      <Briefcase className="w-4 h-4 md:w-5 md:h-5" />
                      <span className="text-sm md:text-base">Empresa</span>
                    </div>
                  </button>
                </div>

              <div className="flex mb-6">
                <button
                  onClick={() => {
                    setAuthMode('login');
                    setRegisterStep(1);
                  }}
                  className={`flex-1 pb-3 font-bold text-base md:text-lg transition-all border-b-2 ${authMode === 'login'
                    ? `border-${activeConfig.theme.primary}-400 text-white`
                    : 'border-transparent text-white/50'
                    }`}
                >
                  Iniciar Sesión
                </button>
                <button
                  onClick={() => {
                    setAuthMode('register');
                    setRegisterStep(1);
                  }}
                  className={`flex-1 pb-3 font-bold text-base md:text-lg transition-all border-b-2 ${authMode === 'register'
                    ? `border-${activeConfig.theme.primary}-400 text-white`
                    : 'border-transparent text-white/50'
                    }`}
                >
                  Registrarse
                </button>
              </div>

              {error && (
                <div className="mb-4 p-3 md:p-4 bg-red-500/20 border border-red-400/30 rounded-xl flex items-start gap-3">
                  <AlertCircle className="w-5 h-5 text-red-400 flex-shrink-0 mt-0.5" />
                  <p className="text-red-300 text-sm">{error}</p>
                </div>
              )}

              {success && (
                <div className="mb-4 p-3 md:p-4 bg-green-500/20 border border-green-400/30 rounded-xl flex items-center gap-3">
                  <CheckCircle className="w-5 h-5 text-green-400 flex-shrink-0" />
                  <p className="text-green-300 text-sm">{success}</p>
                </div>
              )}

              {/* PASO 1 o LOGIN */}
              {(authMode === 'login' || registerStep === 1) && (
                <div className="space-y-4">
                  {authMode === 'register' && (
                    <div>
                      <label className="block text-white text-sm font-medium mb-2">
                        {userType === 'agricultor' ? 'Nombre Completo' : 'Razón Social'}
                      </label>
                      <div className="relative">
                        <User className={`absolute left-3 md:left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-${activeConfig.theme.primary}-400`} />
                        <input
                          type="text"
                          name="nombre"
                          value={formData.nombre}
                          onChange={handleInputChange}
                          placeholder={userType === 'agricultor' ? 'Juan Pérez' : 'Empresa S.A.'}
                          className="w-full pl-10 md:pl-12 pr-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-white/40 focus:outline-none focus:border-white/30 text-sm md:text-base"
                        />
                      </div>
                    </div>
                  )}

                  <div>
                    <label className="block text-white text-sm font-medium mb-2">Email</label>
                    <div className="relative">
                      <Mail className={`absolute left-3 md:left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-${activeConfig.theme.primary}-400`} />
                      <input
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleInputChange}
                        placeholder="tu@email.com"
                        className="w-full pl-10 md:pl-12 pr-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-white/40 focus:outline-none focus:border-white/30 text-sm md:text-base"
                      />
                    </div>
                  </div>

                  {authMode === 'register' && userType === 'empresa' && (
                    <div>
                      <label className="block text-white text-sm font-medium mb-2">RFC</label>
                      <div className="relative">
                        <Building2 className={`absolute left-3 md:left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-${activeConfig.theme.primary}-400`} />
                        <input
                          type="text"
                          name="rfc"
                          value={formData.rfc}
                          onChange={handleInputChange}
                          placeholder="ABC123456XYZ"
                          className="w-full pl-10 md:pl-12 pr-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-white/40 focus:outline-none focus:border-white/30 text-sm md:text-base uppercase"
                        />
                      </div>
                    </div>
                  )}

                  <div>
                    <label className="block text-white text-sm font-medium mb-2">Contraseña</label>
                    <div className="relative">
                      <Lock className={`absolute left-3 md:left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-${activeConfig.theme.primary}-400`} />
                      <input
                        type={showPassword ? 'text' : 'password'}
                        name="password"
                        value={formData.password}
                        onChange={handleInputChange}
                        placeholder="••••••••"
                        className="w-full pl-10 md:pl-12 pr-12 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-white/40 focus:outline-none focus:border-white/30 text-sm md:text-base"
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-4 top-1/2 -translate-y-1/2 text-white/40"
                      >
                        {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                      </button>
                    </div>
                  </div>

                  {authMode === 'register' && (
                    <div>
                      <label className="block text-white text-sm font-medium mb-2">Confirmar Contraseña</label>
                      <div className="relative">
                        <Lock className={`absolute left-3 md:left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-${activeConfig.theme.primary}-400`} />
                        <input
                          type={showPassword ? 'text' : 'password'}
                          name="confirmPassword"
                          value={formData.confirmPassword}
                          onChange={handleInputChange}
                          placeholder="••••••••"
                          className="w-full pl-10 md:pl-12 pr-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-white/40 focus:outline-none focus:border-white/30 text-sm md:text-base"
                        />
                      </div>
                    </div>
                  )}

                  <button
                    onClick={handleSubmit}
                    disabled={isLoading}
                    className={`w-full py-3 md:py-4 bg-gradient-to-r ${activeConfig.theme.gradient} hover:opacity-90 text-white font-bold rounded-xl transition-all shadow-lg flex items-center justify-center gap-2 disabled:opacity-50 text-sm md:text-base`}
                  >
                    {isLoading ? (
                      <div className="w-6 h-6 border-3 border-white/30 border-t-white rounded-full animate-spin"></div>
                    ) : (
                      <>
                        <span>
                          {authMode === 'login'
                            ? 'Iniciar Sesión'
                            : userType === 'empresa' ? 'Crear Cuenta' : 'Continuar'}
                        </span>
                        <ArrowRight className="w-5 h-5" />
                      </>
                    )}
                  </button>
                </div>
              )}

              {/* PASO 2 - Solo Agricultor */}
              {authMode === 'register' && registerStep === 2 && userType === 'agricultor' && (
                <div className="space-y-4">
                  <div className="bg-emerald-500/10 border border-emerald-400/30 rounded-xl p-3 mb-4">
                    <p className="text-emerald-300 text-sm">
                      📍 <strong>Paso 2 de 2:</strong> Información de tu parcela
                    </p>
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-white text-sm font-medium mb-2">Hectáreas</label>
                      <input
                        type="number"
                        step="0.1"
                        name="hectareas"
                        value={formData.hectareas}
                        onChange={handleInputChange}
                        placeholder="10.5"
                        className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-white/40 focus:outline-none focus:border-white/30"
                      />
                    </div>

                    <div>
                      <label className="block text-white text-sm font-medium mb-2">Ton CO₂</label>
                      <input
                        type="number"
                        step="0.1"
                        name="toneladas_co2"
                        value={formData.toneladas_co2}
                        onChange={handleInputChange}
                        placeholder="200"
                        className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-white/40 focus:outline-none focus:border-white/30"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-white text-sm font-medium mb-2">Precio por Tonelada (USD)</label>
                    <div className="relative">
                      <DollarSign className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-emerald-400" />
                      <input
                        type="number"
                        step="0.1"
                        name="precio_por_tonelada"
                        value={formData.precio_por_tonelada}
                        onChange={handleInputChange}
                        placeholder="28.50"
                        className="w-full pl-12 pr-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-white/40 focus:outline-none focus:border-white/30"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-white text-sm font-medium mb-2">Estado</label>
                    <div className="relative">
                      <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-emerald-400" />
                      <select

                        name="ubicacion_estado"
                        value={formData.ubicacion_estado}
                        onChange={handleInputChange}
                        className="w-full pl-12 pr-4 py-3 bg-emerald-800/70 border border-white/10 rounded-xl text-white focus:outline-none focus:border-white/30"
                      >
                        <option value="Aguascalientes">Aguascalientes</option>
                        <option value="Baja California">Baja California</option>
                        <option value="Baja California Sur">Baja California Sur</option>
                        <option value="Campeche">Campeche</option>
                        <option value="Chiapas">Chiapas</option>
                        <option value="Chihuahua">Chihuahua</option>
                        <option value="Ciudad de México">Ciudad de México</option>
                        <option value="Coahuila">Coahuila</option>
                        <option value="Colima">Colima</option>
                        <option value="Durango">Durango</option>
                        <option value="Guanajuato">Guanajuato</option>
                        <option value="Guerrero">Guerrero</option>
                        <option value="Hidalgo">Hidalgo</option>
                        <option value="Jalisco">Jalisco</option>
                        <option value="México">México</option>
                        <option value="Michoacán">Michoacán</option>
                        <option value="Morelos">Morelos</option>
                        <option value="Nayarit">Nayarit</option>
                        <option value="Nuevo León">Nuevo León</option>
                        <option value="Oaxaca">Oaxaca</option>
                        <option value="Puebla">Puebla</option>
                        <option value="Querétaro">Querétaro</option>
                        <option value="Quintana Roo">Quintana Roo</option>
                        <option value="San Luis Potosí">San Luis Potosí</option>
                        <option value="Sinaloa">Sinaloa</option>
                        <option value="Sonora">Sonora</option>
                        <option value="Tabasco">Tabasco</option>
                        <option value="Tamaulipas">Tamaulipas</option>
                        <option value="Tlaxcala">Tlaxcala</option>
                        <option value="Veracruz">Veracruz</option>
                        <option value="Yucatán">Yucatán</option>
                        <option value="Zacatecas">Zacatecas</option>
                      </select>

                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-white text-sm font-medium mb-2">Latitud GPS</label>
                      <input
                        type="number"
                        step="0.000001"
                        name="ubicacion_lat"
                        value={formData.ubicacion_lat}
                        onChange={handleInputChange}
                        placeholder="18.7983"
                        className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-white/40 focus:outline-none focus:border-white/30"
                      />
                    </div>

                    <div>
                      <label className="block text-white text-sm font-medium mb-2">Longitud GPS</label>
                      <input
                        type="number"
                        step="0.000001"
                        name="ubicacion_lng"
                        value={formData.ubicacion_lng}
                        onChange={handleInputChange}
                        placeholder="-99.2358"
                        className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-white/40 focus:outline-none focus:border-white/30"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-white text-sm font-medium mb-2">Fecha de Siembra</label>
                    <div className="relative">
                      <Calendar className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-emerald-400" />
                      <input
                        type="date"
                        name="fecha_siembra"
                        value={formData.fecha_siembra}
                        onChange={handleInputChange}
                        className="w-full pl-12 pr-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white focus:outline-none focus:border-white/30"
                      />
                    </div>
                  </div>

                  <div className="flex gap-3 pt-2">
                    <button
                      onClick={() => setRegisterStep(1)}
                      className="flex-1 py-3 bg-white/10 hover:bg-white/20 text-white font-semibold rounded-xl transition-all"
                    >
                      Atrás
                    </button>
                    <button
                      onClick={handleSubmit}
                      disabled={isLoading}
                      className="flex-1 py-3 bg-gradient-to-r from-emerald-500 to-teal-600 hover:opacity-90 text-white font-bold rounded-xl transition-all shadow-lg flex items-center justify-center gap-2 disabled:opacity-50"
                    >
                      {isLoading ? (
                        <div className="w-6 h-6 border-3 border-white/30 border-t-white rounded-full animate-spin"></div>
                      ) : (
                        <>
                          <span>Crear Cuenta</span>
                          <CheckCircle className="w-5 h-5" />
                        </>
                      )}
                    </button>
                  </div>
                </div>
              )}

              <div className="mt-6 text-center text-sm text-white/60">
                {authMode === 'login' ? (
                  <p>
                    ¿No tienes cuenta?{' '}
                    <button
                      onClick={() => setAuthMode('register')}
                      className={`text-${activeConfig.theme.primary}-400 hover:text-${activeConfig.theme.primary}-300 font-semibold`}
                    >
                      Regístrate gratis
                    </button>
                  </p>
                ) : (
                  <p>
                    ¿Ya tienes cuenta?{' '}
                    <button
                      onClick={() => {
                        setAuthMode('login');
                        setRegisterStep(1);
                      }}
                      className={`text-${activeConfig.theme.primary}-400 hover:text-${activeConfig.theme.primary}-300 font-semibold`}
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