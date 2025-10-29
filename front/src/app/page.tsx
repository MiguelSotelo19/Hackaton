'use client';
import React, { useState, useEffect } from 'react';
import { Leaf, TrendingUp, Globe, Shield, Users, Zap, ArrowRight, CheckCircle, MapPin, DollarSign, BarChart3, Sparkles, Award, Target, Clock, FileCheck, Briefcase, Sprout, Package } from 'lucide-react';

type UserType = 'agricultor' | 'empresa';

export default function LandingPage() {
  const [userType, setUserType] = useState<UserType>('agricultor');
  const [counter, setCounter] = useState({ parcelas: 0, co2: 0, empresas: 0 });
  const [isVisible, setIsVisible] = useState(false);
  const [isTransitioning, setIsTransitioning] = useState(false);

  useEffect(() => {
    setIsVisible(true);
    
    const duration = 2000;
    const steps = 60;
    const interval = duration / steps;
    
    const targets = { parcelas: 847, co2: 18234, empresas: 156 };
    let current = { parcelas: 0, co2: 0, empresas: 0 };
    
    const timer = setInterval(() => {
      current.parcelas = Math.min(current.parcelas + Math.ceil(targets.parcelas / steps), targets.parcelas);
      current.co2 = Math.min(current.co2 + Math.ceil(targets.co2 / steps), targets.co2);
      current.empresas = Math.min(current.empresas + Math.ceil(targets.empresas / steps), targets.empresas);
      
      setCounter({ ...current });
      
      if (current.parcelas >= targets.parcelas) {
        clearInterval(timer);
      }
    }, interval);
    
    return () => clearInterval(timer);
  }, []);

  const handleUserTypeChange = (type: UserType) => {
    if (type === userType) return;
    setIsTransitioning(true);
    setTimeout(() => {
      setUserType(type);
      setIsTransitioning(false);
    }, 300);
  };

  const config = {
    agricultor: {
      theme: {
        primary: 'emerald',
        secondary: 'teal',
        gradient: 'from-emerald-500 to-teal-600',
        bgGradient: 'from-emerald-950 via-teal-900 to-green-950',
        glowColor: 'emerald-500',
        logo:'from-emerald-200 via-teal-400 to-green-200'
      },
      hero: {
        badge: 'Ingreso adicional para tu campo',
        title: 'Tu Campo,',
        titleHighlight: 'Tu Activo Digital',
        description: 'Transforma el CO₂ capturado por tu caña de azúcar en tokens verificados en blockchain. Empresas compran tus créditos y tú generas ingresos adicionales mientras ayudas al planeta.',
        ctaMain: 'Registrar Mi Parcela',
        ctaSecondary: 'Ver Calculadora',
        statsTitle: 'Tu parcela de 10 hectáreas genera:',
        statsValue: '200 tokens/año',
        statsSubtext: '≈ $6,000 USD ingreso anual adicional',
        icon: Leaf,
      },
      benefits: [
        { icon: CheckCircle, text: 'Registro gratuito en 20 minutos' },
        { icon: CheckCircle, text: 'Pagos directos a tu cuenta' },
        { icon: CheckCircle, text: 'Sin costos ocultos' },
        { icon: CheckCircle, text: 'Asesoría personalizada' },
      ],
      howItWorks: {
        title: '¿Cómo Monetizo Mi Parcela?',
        subtitle: '3 pasos simples para generar ingresos adicionales',
        steps: [
          {
            number: 1,
            title: 'Registra tu Parcela',
            description: 'Sube fotos, coordenadas GPS y documentos de propiedad. Nuestro equipo verifica en 48 horas.',
            icon: MapPin,
            gradient: 'from-emerald-500 to-teal-600',
            bgGradient: 'from-emerald-500/10 to-teal-500/10',
            borderColor: 'emerald-400',
            iconColor: 'emerald-400',
          },
          {
            number: 2,
            title: 'Tokenización Automática',
            description: 'Calculamos el CO₂ capturado por tu caña y creamos tokens verificados en blockchain Stellar.',
            icon: Zap,
            gradient: 'from-blue-500 to-indigo-600',
            bgGradient: 'from-blue-500/10 to-indigo-500/10',
            borderColor: 'blue-400',
            iconColor: 'blue-400',
          },
          {
            number: 3,
            title: 'Recibe Pagos Directos',
            description: 'Las empresas compran tus tokens. Recibe el dinero directamente en tu cuenta bancaria o billetera digital.',
            icon: DollarSign,
            gradient: 'from-purple-500 to-pink-600',
            bgGradient: 'from-purple-500/10 to-pink-500/10',
            borderColor: 'purple-400',
            iconColor: 'purple-400',
          },
        ],
      },
      stats: [
        {
          icon: MapPin,
          value: counter.parcelas.toLocaleString(),
          label: 'Agricultores Registrados',
          sublabel: 'Generando ingresos adicionales',
          color: 'emerald',
        },
        {
          icon: DollarSign,
          value: '$2.8M',
          label: 'Pagados a Agricultores',
          sublabel: 'En los últimos 6 meses',
          color: 'teal',
        },
        {
          icon: TrendingUp,
          value: '200%',
          label: 'Crecimiento Anual',
          sublabel: 'Mercado en expansión',
          color: 'blue',
        },
      ],
    },
    empresa: {
      theme: {
        primary: 'blue',
        secondary: 'indigo',
        gradient: 'from-blue-500 to-indigo-600',
        bgGradient: 'from-blue-950 via-indigo-900 to-purple-950',
        glowColor: 'blue-500',
        logo:'from-blue-200 via-indigo-500 to-purple-200'
      },
      hero: {
        badge: 'Cumple tus objetivos ESG',
        title: 'Carbono Neutral,',
        titleHighlight: 'Impacto Real',
        description: 'Compensa las emisiones de tu empresa con créditos verificados de agricultores mexicanos. Blockchain garantiza transparencia total y reportes automáticos para tus stakeholders.',
        ctaMain: 'Comprar Créditos',
        ctaSecondary: 'Ver Dashboard Demo',
        statsTitle: 'Compensación promedio:',
        statsValue: '500 ton CO₂',
        statsSubtext: 'Equivale a 110 autos fuera de circulación',
        icon: BarChart3,
      },
      benefits: [
        { icon: CheckCircle, text: 'Créditos certificados ISO 14064' },
        { icon: CheckCircle, text: 'Reportes automáticos para ESG' },
        { icon: CheckCircle, text: 'Trazabilidad blockchain' },
        { icon: CheckCircle, text: 'Impacto social medible' },
      ],
      howItWorks: {
        title: '¿Por Qué Elegir AgroCane?',
        subtitle: 'Ventajas competitivas para tu estrategia de sostenibilidad',
        steps: [
          {
            number: 1,
            title: 'Transparencia Total',
            description: 'Cada token está respaldado por blockchain. Verifica el origen, agricultor y cantidad exacta de CO₂ en tiempo real.',
            icon: Shield,
            gradient: 'from-blue-500 to-cyan-600',
            bgGradient: 'from-blue-500/10 to-cyan-500/10',
            borderColor: 'blue-400',
            iconColor: 'blue-400',
          },
          {
            number: 2,
            title: 'Impacto Social Directo',
            description: 'Tu compra beneficia directamente a agricultores mexicanos. Genera empleo rural y fortalece comunidades locales.',
            icon: Users,
            gradient: 'from-indigo-500 to-purple-600',
            bgGradient: 'from-indigo-500/10 to-purple-500/10',
            borderColor: 'indigo-400',
            iconColor: 'indigo-400',
          },
          {
            number: 3,
            title: 'Reportes Automáticos',
            description: 'Dashboard en tiempo real con métricas ESG, certificados descargables y reportes listos para tus stakeholders.',
            icon: BarChart3,
            gradient: 'from-purple-500 to-pink-600',
            bgGradient: 'from-purple-500/10 to-pink-500/10',
            borderColor: 'purple-400',
            iconColor: 'purple-400',
          },
        ],
      },
      stats: [
        {
          icon: Briefcase,
          value: counter.empresas.toString(),
          label: 'Empresas Comprometidas',
          sublabel: 'Con carbono neutral',
          color: 'blue',
        },
        {
          icon: Globe,
          value: counter.co2.toLocaleString(),
          label: 'Toneladas CO₂ Compensadas',
          sublabel: 'Impacto ambiental verificado',
          color: 'indigo',
        },
        {
          icon: Award,
          value: '< 5 seg',
          label: 'Tiempo de Transacción',
          sublabel: 'Compra instantánea',
          color: 'purple',
        },
      ],
    },
  };

  const activeConfig = config[userType];

  return (
    <div className={`min-h-screen bg-gradient-to-br ${activeConfig.theme.bgGradient} overflow-hidden transition-all duration-700`}>
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className={`absolute top-20 left-10 w-72 h-72 bg-${activeConfig.theme.primary}-500/10 rounded-full blur-3xl animate-pulse`}></div>
        <div className={`absolute bottom-20 right-10 w-96 h-96 bg-${activeConfig.theme.secondary}-500/10 rounded-full blur-3xl animate-pulse`} style={{ animationDelay: '1s' }}></div>
        <div className={`absolute top-1/2 left-1/2 w-64 h-64 bg-${activeConfig.theme.primary}-500/10 rounded-full blur-3xl animate-pulse`} style={{ animationDelay: '2s' }}></div>
      </div>

      <nav className="relative z-50 bg-black/20 backdrop-blur-xl border-b border-white/10">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className={`bg-gradient-to-br ${activeConfig.theme.gradient} p-2.5 rounded-xl shadow-lg shadow-${activeConfig.theme.glowColor}/50 transition-all duration-500`}>
                <Leaf className="w-7 h-7 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-white tracking-tight">
                  Agro<strong className={`bg-gradient-to-r ${activeConfig.theme.logo} bg-clip-text text-transparent`}>Can</strong>e
                </h1>
                <p className={`text-${activeConfig.theme.primary}-300 text-xs font-medium transition-colors duration-500`}>
                  Powered by Stellar Blockchain
                </p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <button className="px-5 py-2.5 bg-white/5 hover:bg-white/10 text-white rounded-xl transition-all border border-white/10 font-medium">
                Iniciar Sesión
              </button>
              <button className={`px-5 py-2.5 bg-gradient-to-r ${activeConfig.theme.gradient} hover:opacity-90 text-white rounded-xl transition-all font-semibold shadow-lg shadow-${activeConfig.theme.glowColor}/30 flex items-center gap-2`}>
                Comenzar Ahora
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      </nav>

      <div className="relative z-50 bg-black/30 backdrop-blur-sm border-b border-white/10">
        <div className="container mx-auto px-6 py-4">
          <div className="flex justify-center">
            <div className="inline-flex bg-black/40 rounded-2xl p-2 gap-2 border border-white/10">
              <button
                onClick={() => handleUserTypeChange('agricultor')}
                className={`px-8 py-4 rounded-xl font-bold text-lg transition-all transform ${
                  userType === 'agricultor'
                    ? 'bg-gradient-to-r from-emerald-500 to-teal-600 text-white shadow-lg shadow-emerald-500/50 scale-105'
                    : 'text-white/60 hover:text-white hover:bg-white/5'
                }`}
              >
                <div className="flex items-center gap-3">
                  <Sprout className="w-6 h-6" />
                  <span>Soy Agricultor</span>
                </div>
              </button>
              
              <button
                onClick={() => handleUserTypeChange('empresa')}
                className={`px-8 py-4 rounded-xl font-bold text-lg transition-all transform ${
                  userType === 'empresa'
                    ? 'bg-gradient-to-r from-blue-500 to-indigo-600 text-white shadow-lg shadow-blue-500/50 scale-105'
                    : 'text-white/60 hover:text-white hover:bg-white/5'
                }`}
              >
                <div className="flex items-center gap-3">
                  <Briefcase className="w-6 h-6" />
                  <span>Soy Empresa</span>
                </div>
              </button>
            </div>
          </div>
        </div>
      </div>

      <section className={`relative z-10 container mx-auto px-6 pt-16 pb-12 transition-opacity duration-300 ${isTransitioning ? 'opacity-0' : 'opacity-100'}`}>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div className="space-y-8">
            <div className={`inline-flex items-center gap-2 bg-${activeConfig.theme.primary}-500/20 border border-${activeConfig.theme.primary}-400/30 rounded-full px-4 py-2 backdrop-blur-sm transition-all duration-500`}>
              <Sparkles className={`w-4 h-4 text-${activeConfig.theme.primary}-400`} />
              <span className={`text-${activeConfig.theme.primary}-300 text-sm font-semibold`}>
                {activeConfig.hero.badge}
              </span>
            </div>
            
            <h1 className="text-5xl lg:text-7xl font-black text-white leading-tight">
              {activeConfig.hero.title}
              <br />
              <span className={`bg-gradient-to-r ${activeConfig.theme.gradient} via-${activeConfig.theme.secondary}-400 to-${activeConfig.theme.primary}-400 bg-clip-text text-transparent`}>
                {activeConfig.hero.titleHighlight}
              </span>
            </h1>
            
            <p className="text-xl text-white/90 leading-relaxed">
              {activeConfig.hero.description}
            </p>

            <div className="flex flex-col sm:flex-row gap-4">
              <button className={`group flex-1 px-8 py-5 bg-gradient-to-r ${activeConfig.theme.gradient} hover:opacity-90 text-white rounded-2xl font-bold text-lg transition-all transform hover:scale-105 shadow-2xl shadow-${activeConfig.theme.glowColor}/50 flex items-center justify-center gap-2`}>
                {activeConfig.hero.ctaMain}
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </button>
              
              <button className="flex-1 px-8 py-5 bg-white/10 hover:bg-white/20 text-white rounded-2xl font-bold text-lg transition-all border-2 border-white/20">
                {activeConfig.hero.ctaSecondary}
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-4">
              {activeConfig.benefits.map((benefit, idx) => (
                <div key={idx} className="flex items-center gap-3 bg-white/5 backdrop-blur-sm rounded-xl p-4 border border-white/10 transition-all duration-300 hover:bg-white/10">
                  <benefit.icon className={`w-5 h-5 text-${activeConfig.theme.primary}-400 flex-shrink-0`} />
                  <span className="text-white text-sm font-medium">{benefit.text}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="animate-float">
            <div className={`bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-2xl rounded-3xl p-8 border border-white/20 shadow-2xl transition-all duration-500`}>
              <div className="space-y-6">
                <div className="flex items-center gap-3 pb-4 border-b border-white/20">
                  <div className={`bg-${activeConfig.theme.primary}-500/20 p-3 rounded-xl`}>
                    <activeConfig.hero.icon className={`w-8 h-8 text-${activeConfig.theme.primary}-400`} />
                  </div>
                  <div>
                    <h3 className="text-2xl font-bold text-white">
                      {userType === 'agricultor' ? 'Para Agricultores' : 'Para Empresas'}
                    </h3>
                    <p className={`text-${activeConfig.theme.primary}-300 text-sm`}>
                      {userType === 'agricultor' ? 'Monetiza tu impacto ambiental' : 'Estrategia de sostenibilidad'}
                    </p>
                  </div>
                </div>

                <div className={`bg-gradient-to-r ${activeConfig.theme.gradient}/20 border border-${activeConfig.theme.primary}-400/30 rounded-2xl p-6`}>
                  <div className="flex items-start justify-between mb-3">
                    <div>
                      <p className={`text-${activeConfig.theme.primary}-300 text-sm font-medium mb-1`}>
                        {activeConfig.hero.statsTitle}
                      </p>
                      <p className="text-4xl font-black text-white">{activeConfig.hero.statsValue}</p>
                    </div>
                    <TrendingUp className={`w-10 h-10 text-${activeConfig.theme.primary}-400`} />
                  </div>
                  <div className={`flex items-center gap-2 text-${activeConfig.theme.primary}-300 text-sm`}>
                    {userType === 'agricultor' ? <DollarSign className="w-4 h-4" /> : <Globe className="w-4 h-4" />}
                    <span>{activeConfig.hero.statsSubtext}</span>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-white/5 rounded-xl p-4 border border-white/10">
                    {userType === 'agricultor' ? (
                      <>
                        <Clock className={`w-6 h-6 text-${activeConfig.theme.secondary}-400 mb-2`} />
                        <p className="text-white text-2xl font-bold">20 min</p>
                        <p className={`text-${activeConfig.theme.secondary}-300 text-xs`}>Registro rápido</p>
                      </>
                    ) : (
                      <>
                        <Shield className={`w-6 h-6 text-${activeConfig.theme.secondary}-400 mb-2`} />
                        <p className="text-white text-2xl font-bold">ISO</p>
                        <p className={`text-${activeConfig.theme.secondary}-300 text-xs`}>Certificado</p>
                      </>
                    )}
                  </div>
                  <div className="bg-white/5 rounded-xl p-4 border border-white/10">
                    {userType === 'agricultor' ? (
                      <>
                        <Shield className="w-6 h-6 text-blue-400 mb-2" />
                        <p className="text-white text-2xl font-bold">100%</p>
                        <p className="text-blue-300 text-xs">Verificado</p>
                      </>
                    ) : (
                      <>
                        <FileCheck className="w-6 h-6 text-purple-400 mb-2" />
                        <p className="text-white text-2xl font-bold">Auto</p>
                        <p className="text-purple-300 text-xs">Reportes ESG</p>
                      </>
                    )}
                  </div>
                </div>

                <button className={`w-full bg-gradient-to-r ${activeConfig.theme.gradient} hover:opacity-90 text-white font-bold py-4 rounded-xl transition-all transform hover:scale-105 shadow-lg shadow-${activeConfig.theme.glowColor}/30 flex items-center justify-center gap-2`}>
                  {activeConfig.hero.ctaMain}
                  <ArrowRight className="w-5 h-5" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className={`relative z-10 bg-black/30 backdrop-blur-xl border-y border-white/10 py-8 transition-opacity duration-300 ${isTransitioning ? 'opacity-0' : 'opacity-100'}`}>
        <div className="container mx-auto px-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {activeConfig.stats.map((stat, idx) => (
              <div key={idx} className="text-center">
                <div className="flex items-center justify-center gap-3 mb-2">
                  <stat.icon className={`w-8 h-8 text-${stat.color}-400`} />
                  <p className="text-5xl font-black text-white">{stat.value}</p>
                </div>
                <p className={`text-${stat.color}-300 font-semibold text-lg`}>{stat.label}</p>
                <p className="text-white/60 text-sm mt-1">{stat.sublabel}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className={`relative z-10 container mx-auto px-6 py-20 transition-opacity duration-300 ${isTransitioning ? 'opacity-0' : 'opacity-100'}`}>
        <div className="text-center mb-16">
          <div className={`inline-flex items-center gap-2 bg-white/5 border border-white/10 rounded-full px-4 py-2 mb-6`}>
            <Zap className="w-4 h-4 text-yellow-400" />
            <span className="text-white text-sm font-semibold">
              {userType === 'agricultor' ? 'Proceso Simple y Rápido' : 'Ventajas Competitivas'}
            </span>
          </div>
          <h2 className="text-4xl lg:text-5xl font-black text-white mb-4">
            {activeConfig.howItWorks.title}
          </h2>
          <p className="text-xl text-white/80 max-w-2xl mx-auto">
            {activeConfig.howItWorks.subtitle}
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {activeConfig.howItWorks.steps.map((step) => (
            <div
              key={step.number}
              className={`group relative bg-gradient-to-br ${step.bgGradient} backdrop-blur-sm rounded-3xl p-8 border border-${step.borderColor}/20 hover:border-${step.borderColor}/50 transition-all hover:scale-105`}
            >
              <div className={`absolute -top-6 left-8 bg-gradient-to-r ${step.gradient} text-white w-12 h-12 rounded-full flex items-center justify-center text-2xl font-black shadow-lg`}>
                {step.number}
              </div>
              <step.icon className={`w-12 h-12 text-${step.iconColor} mb-4 mt-4`} />
              <h3 className="text-2xl font-bold text-white mb-3">{step.title}</h3>
              <p className={`text-${step.iconColor}/80 leading-relaxed`}>{step.description}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="relative z-10 bg-gradient-to-r from-black/40 to-black/30 backdrop-blur-xl border-y border-white/10 py-12">
        <div className="container mx-auto px-6">
          <div className="flex flex-wrap items-center justify-center gap-12">
            <div className="flex items-center gap-3">
              <Shield className={`w-8 h-8 text-${activeConfig.theme.primary}-400`} />
              <div>
                <p className="text-white font-bold">Certificado ISO 14064</p>
                <p className={`text-${activeConfig.theme.primary}-300 text-sm`}>Estándar internacional</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <Globe className="w-8 h-8 text-blue-400" />
              <div>
                <p className="text-white font-bold">Stellar Blockchain</p>
                <p className="text-blue-300 text-sm">Red descentralizada</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <Zap className="w-8 h-8 text-yellow-400" />
              <div>
                <p className="text-white font-bold">Transacciones &lt;5 seg</p>
                <p className="text-yellow-300 text-sm">Procesamiento instantáneo</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className={`relative z-10 container mx-auto px-6 py-20 transition-opacity duration-300 ${isTransitioning ? 'opacity-0' : 'opacity-100'}`}>
        <div className={`bg-gradient-to-r ${activeConfig.theme.gradient} rounded-3xl p-12 text-center shadow-2xl border border-${activeConfig.theme.primary}-400/50`}>
          <h2 className="text-4xl lg:text-5xl font-black text-white mb-6">¿Listo para Comenzar?</h2>
          <p className="text-xl text-white/90 mb-8 max-w-2xl mx-auto">
            {userType === 'agricultor' 
              ? 'Únete a cientos de agricultores que ya están generando ingresos adicionales'
              : 'Únete a empresas líderes que ya están alcanzando carbono neutral'}
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button className="group px-10 py-5 bg-white text-black font-bold text-lg rounded-xl transition-all transform hover:scale-105 shadow-xl flex items-center justify-center gap-2">
              {activeConfig.hero.ctaMain}
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </button>
            <button className="px-10 py-5 bg-white/10 hover:bg-white/20 text-white font-bold text-lg rounded-xl transition-all border-2 border-white/30">
              {activeConfig.hero.ctaSecondary}
            </button>
          </div>
        </div>
      </section>

      <footer className="relative z-10 bg-black/40 backdrop-blur-xl border-t border-white/10 py-8">
        <div className="container mx-auto px-6">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className={`bg-gradient-to-br ${activeConfig.theme.gradient} p-2 rounded-lg`}>
                <Leaf className="w-5 h-5 text-white" />
              </div>
              <div>
                <h1 className="text-lg font-bold text-white tracking-tight">
                  AgroCane
                </h1>
                <p className="text-emerald-300 text-xs">© 2025 Todos los derechos reservados</p>
              </div>
            </div>
            <div className="flex gap-6 text-emerald-300 text-sm">
              <a href="#" className="hover:text-white transition-colors">Términos</a>
              <a href="#" className="hover:text-white transition-colors">Privacidad</a>
              <a href="#" className="hover:text-white transition-colors">Contacto</a>
              <a href="#" className="hover:text-white transition-colors">Soporte</a>
            </div>
          </div>
        </div>
      </footer>

      <style jsx>{`
        @keyframes float {
          0%, 100% {
            transform: translateY(0px);
          }
          50% {
            transform: translateY(-20px);
          }
        }
        
        .animate-float {
          animation: float 6s ease-in-out infinite;
        }
      `}</style>
    </div>
  );
}