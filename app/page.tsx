"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { Shield, ArrowRight, Truck, AlertTriangle, BarChart3, MapPin, Users, Radio, Github, User } from "lucide-react";
import { Button } from "@/components/ui/button";
import { DashboardStats } from "@/components/dashboard-stats";

const fadeInUp = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.4, ease: "easeOut" }
};

const staggerContainer = {
  initial: {},
  animate: { transition: { staggerChildren: 0.08, delayChildren: 0.1 } }
};

const features = [
  {
    icon: Truck,
    title: "Control de Flota",
    description: "Monitoreo GPS en tiempo real de camiones, scooptrams y vehiculos en interior mina.",
    href: "/flota",
    color: "blue"
  },
  {
    icon: AlertTriangle,
    title: "Sistema de Alarmas",
    description: "Alertas automaticas por exceso de velocidad, proximidad y zonas de riesgo.",
    href: "/alarmas",
    color: "red"
  },
  {
    icon: BarChart3,
    title: "Métricas y KPIs",
    description: "Dashboards con indicadores de seguridad y productividad operacional.",
    href: "/metrics",
    color: "emerald"
  },
  {
    icon: MapPin,
    title: "Semaforización",
    description: "Control de trafico en cruces y accesos criticos de operaciones subterraneas.",
    href: "/semaforos",
    color: "purple"
  },
  {
    icon: Radio,
    title: "IoT Industrial",
    description: "Sensores de proximidad, gases, velocidad y dispositivos conectados.",
    href: "/dispositivos",
    color: "orange"
  },
  {
    icon: Users,
    title: "Gestión de Personal",
    description: "Control de acceso y ubicacion de trabajadores en tiempo real.",
    href: "/trabajadores",
    color: "cyan"
  }
];

const stats = [
  { value: "-45%", label: "Reducción de incidentes", color: "text-primary" },
  { value: "5+", label: "Minas operativas", color: "text-emerald-400" },
  { value: "24/7", label: "Monitoreo continuo", color: "text-blue-400" },
  { value: "99.9%", label: "Uptime del sistema", color: "text-yellow-400" }
];

const getColorClasses = (color: string) => {
  const colors: Record<string, string> = {
    blue: "bg-blue-500/10 border-blue-500/20 text-blue-500",
    red: "bg-red-500/10 border-red-500/20 text-red-500",
    emerald: "bg-emerald-500/10 border-emerald-500/20 text-emerald-500",
    purple: "bg-purple-500/10 border-purple-500/20 text-purple-500",
    orange: "bg-orange-500/10 border-orange-500/20 text-orange-500",
    cyan: "bg-cyan-500/10 border-cyan-500/20 text-cyan-500"
  };
  return colors[color] || colors.blue;
};

export default function HomePage() {
  return (
    <div className="min-h-screen bg-background">
      <motion.header 
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="border-b border-border/50 sticky top-0 z-50 bg-background/95 backdrop-blur"
      >
        <div className="container mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <motion.div 
              whileHover={{ scale: 1.05 }}
              className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10 border border-primary/20"
            >
              <Shield className="h-6 w-6 text-primary" />
            </motion.div>
            <div className="flex flex-col">
              <span className="text-xl font-bold">SafetyOps Center</span>
              <span className="text-xs text-muted-foreground">Sistema de Prevención Minera</span>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <Link href="/dashboard">
              <Button variant="outline" size="sm">
                Dashboard
              </Button>
            </Link>
            <Link href="/auth/login">
              <Button size="sm">
                Iniciar Sesión
              </Button>
            </Link>
          </div>
        </div>
      </motion.header>

      <main className="container mx-auto px-6 py-12">
        {/* Hero Section */}
        <motion.section 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          {/* Logo Principal */}
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, delay: 0.1 }}
            className="flex justify-center mb-8"
          >
            <div className="flex h-20 w-20 items-center justify-center rounded-2xl bg-gradient-to-br from-primary/20 to-primary/10 border-2 border-primary/30 shadow-2xl backdrop-blur-sm">
              <Shield className="h-12 w-12 text-primary drop-shadow-lg" />
            </div>
          </motion.div>

          {/* Título Principal */}
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="text-4xl md:text-6xl lg:text-7xl font-bold mb-6"
          >
            <span className="bg-gradient-to-r from-primary via-primary/80 to-primary/60 bg-clip-text text-transparent drop-shadow-lg">
              Seguridad Minera Inteligente
            </span>
          </motion.h1>
          
          {/* Subtítulo */}
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="text-xl md:text-2xl text-muted-foreground mb-8 max-w-3xl mx-auto leading-relaxed"
          >
            Monitoreo en tiempo real, alertas automáticas y análisis predictivo para 
            <span className="text-primary font-semibold"> operaciones mineras más seguras y eficientes</span>
          </motion.p>
          
          {/* Botones de Acción */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="flex flex-col sm:flex-row gap-4 justify-center items-center"
          >
            <Link href="/dashboard">
              <Button size="lg" className="group relative overflow-hidden bg-gradient-to-r from-primary to-primary/80 hover:from-primary/90 hover:to-primary/70 shadow-lg hover:shadow-xl transition-all duration-300">
                <span className="relative z-10 flex items-center">
                  Ver Dashboard
                  <ArrowRight className="ml-2 h-5 w-5 transition-transform group-hover:translate-x-1" />
                </span>
                {/* Efecto de onda */}
                <motion.div
                  className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent"
                  animate={{
                    x: ["-100%", "200%"],
                  }}
                  transition={{
                    duration: 2,
                    repeat: Infinity,
                    ease: "linear",
                  }}
                />
              </Button>
            </Link>
            <Link href="/minas">
              <Button variant="outline" size="lg" className="border-2 border-primary/20 hover:border-primary/40 hover:bg-primary/5 transition-all duration-300">
                Explorar Minas
              </Button>
            </Link>
          </motion.div>
        </motion.section>

        {/* Real-time Dashboard Stats */}
        <motion.section 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="mb-16"
        >
          <div className="text-center mb-12">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
            >
              <h2 className="text-3xl md:text-4xl font-bold mb-4 bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent">
                Estado en Tiempo Real
              </h2>
              <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                Métricas actualizadas de todas las operaciones mineras
              </p>
            </motion.div>
          </div>
          
          {/* Tarjeta de fondo para las estadísticas */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="relative overflow-hidden rounded-2xl border border-border/50 bg-gradient-to-br from-background via-background to-muted/30 p-8 backdrop-blur-sm"
          >
            {/* Efecto de fondo animado */}
            <motion.div
              className="absolute inset-0 bg-gradient-to-r from-primary/5 via-transparent to-primary/5"
              animate={{
                x: ["-100%", "100%"],
              }}
              transition={{
                duration: 8,
                repeat: Infinity,
                ease: "linear",
              }}
            />
            
            <div className="relative z-10">
              <DashboardStats />
            </div>
          </motion.div>
        </motion.section>

        {/* Features Grid */}
        <motion.section 
          variants={staggerContainer}
          initial="initial"
          animate="animate"
          className="mb-16"
        >
          <div className="text-center mb-16">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
            >
              <h2 className="text-3xl md:text-4xl font-bold mb-4 bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent">
                Características Principales
              </h2>
              <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                Tecnología de vanguardia para la seguridad y productividad en operaciones mineras
              </p>
            </motion.div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <motion.div
                key={feature.title}
                variants={fadeInUp}
                className="group relative overflow-hidden rounded-2xl border border-border/50 bg-gradient-to-br from-background via-background to-muted/20 p-8 hover:shadow-2xl hover:border-primary/30 transition-all duration-500 hover:scale-105"
              >
                <Link href={feature.href}>
                  <div className="flex flex-col h-full">
                    {/* Icono con efecto */}
                    <motion.div 
                      whileHover={{ scale: 1.1, rotate: 5 }}
                      transition={{ duration: 0.3 }}
                      className={`flex h-16 w-16 items-center justify-center rounded-2xl border-2 ${getColorClasses(feature.color)} mb-6 mx-auto`}
                    >
                      <feature.icon className="h-8 w-8" />
                    </motion.div>
                    
                    {/* Título */}
                    <h3 className="text-xl font-bold mb-4 text-center group-hover:text-primary transition-colors">
                      {feature.title}
                    </h3>
                    
                    {/* Descripción */}
                    <p className="text-muted-foreground mb-6 flex-grow text-center leading-relaxed">
                      {feature.description}
                    </p>
                    
                    {/* Botón de exploración */}
                    <div className="flex items-center justify-center text-primary group-hover:translate-x-2 transition-transform">
                      <span className="text-sm font-medium">Explorar</span>
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </div>
                  </div>
                </Link>
                
                {/* Efecto de brillo hover */}
                <motion.div
                  className="absolute inset-0 bg-gradient-to-r from-transparent via-primary/10 to-transparent -skew-x-12 opacity-0 group-hover:opacity-100 transition-opacity duration-500"
                  animate={{
                    x: ["-100%", "200%"],
                  }}
                  transition={{
                    duration: 2,
                    repeat: Infinity,
                    ease: "linear",
                    delay: index * 0.1,
                  }}
                />
              </motion.div>
            ))}
          </div>
        </motion.section>

        {/* Stats Section */}
        <motion.section 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.5 }}
          className="mb-16"
        >
          <div className="relative overflow-hidden rounded-2xl border border-border/50 bg-gradient-to-br from-primary/5 via-background to-muted/30 p-12 backdrop-blur-sm">
            {/* Efecto de fondo */}
            <motion.div
              className="absolute inset-0 bg-gradient-to-r from-transparent via-primary/10 to-transparent"
              animate={{
                x: ["-100%", "100%"],
              }}
              transition={{
                duration: 10,
                repeat: Infinity,
                ease: "linear",
              }}
            />
            
            <div className="relative z-10">
              <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
                {stats.map((stat, index) => (
                  <motion.div
                    key={stat.label}
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.4, delay: 0.6 + index * 0.1 }}
                    className="text-center"
                  >
                    <div className={`text-3xl md:text-4xl font-bold ${stat.color} mb-2 drop-shadow-lg`}>
                      {stat.value}
                    </div>
                    <div className="text-sm text-muted-foreground font-medium">
                      {stat.label}
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          </div>
        </motion.section>

        {/* CTA Section */}
        <motion.section 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.7 }}
          className="text-center"
        >
          <div className="relative overflow-hidden rounded-3xl border border-border/50 bg-gradient-to-br from-primary/10 via-background to-primary/5 p-16 backdrop-blur-sm">
            {/* Efectos de fondo */}
            <motion.div
              className="absolute inset-0 bg-gradient-to-r from-transparent via-primary/20 to-transparent"
              animate={{
                x: ["-100%", "100%"],
              }}
              transition={{
                duration: 12,
                repeat: Infinity,
                ease: "linear",
              }}
            />
            
            <div className="relative z-10">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.1 }}
              >
                <h2 className="text-3xl md:text-4xl font-bold mb-6 bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent">
                  Comienza a Monitorear tus Operaciones
                </h2>
                <p className="text-lg text-muted-foreground mb-10 max-w-2xl mx-auto leading-relaxed">
                  Únete a las mineras líderes que ya confían en SafetyOps Center para sus operaciones de seguridad
                </p>
              </motion.div>
              
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.2 }}
                className="flex flex-col sm:flex-row gap-6 justify-center items-center"
              >
                <Link href="/dashboard">
                  <Button size="lg" className="group relative overflow-hidden bg-gradient-to-r from-primary to-primary/80 hover:from-primary/90 hover:to-primary/70 shadow-lg hover:shadow-xl transition-all duration-300 px-8 py-4">
                    <span className="relative z-10 flex items-center text-lg">
                      Comenzar Ahora
                      <ArrowRight className="ml-2 h-5 w-5 transition-transform group-hover:translate-x-1" />
                    </span>
                    {/* Efecto de onda */}
                    <motion.div
                      className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent"
                      animate={{
                        x: ["-100%", "200%"],
                      }}
                      transition={{
                        duration: 2,
                        repeat: Infinity,
                        ease: "linear",
                      }}
                    />
                  </Button>
                </Link>
                <Link href="https://github.com/SebSRVV/safetyopscenter">
                  <Button variant="outline" size="lg" className="border-2 border-primary/20 hover:border-primary/40 hover:bg-primary/5 transition-all duration-300 px-8 py-4">
                    <Github className="mr-2 h-5 w-5" />
                    Ver Código
                  </Button>
                </Link>
              </motion.div>
            </div>
          </div>
        </motion.section>
      </main>

      <motion.footer 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.6, delay: 0.8 }}
        className="border-t border-border/50 mt-20"
      >
        <div className="container mx-auto px-6 py-8">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="flex items-center gap-2 mb-4 md:mb-0">
              <Shield className="h-5 w-5 text-primary" />
              <span className="text-sm text-muted-foreground">
                © 2024 SafetyOps Center. Todos los derechos reservados.
              </span>
            </div>
            <div className="flex items-center gap-6">
              <Link href="/minas" className="text-sm text-muted-foreground hover:text-primary transition-colors">
                Minas
              </Link>
              <Link href="/flota" className="text-sm text-muted-foreground hover:text-primary transition-colors">
                Flota
              </Link>
              <Link href="/dispositivos" className="text-sm text-muted-foreground hover:text-primary transition-colors">
                Dispositivos
              </Link>
              <Link href="/dashboard" className="text-sm text-muted-foreground hover:text-primary transition-colors">
                Dashboard
              </Link>
            </div>
          </div>
        </div>
      </motion.footer>
    </div>
  );
}
