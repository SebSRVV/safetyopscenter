"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Shield, Truck, Users, Radio, AlertTriangle, Wrench } from "lucide-react";
import { supabase } from "@/lib/supabase/client";
import { generarTodosLosDatosMock } from "@/lib/mock-data";

interface DashboardStats {
  total_minas: number;
  total_flota: number;
  total_trabajadores: number;
  total_dispositivos: number;
  eventos_activos: number;
  mantenimientos_pendientes: number;
}

interface StatCard {
  title: string;
  value: string | number;
  icon: React.ElementType;
  color: string;
  trend?: {
    value: string;
    isPositive: boolean;
  };
}

export function DashboardStats() {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [lastUpdate, setLastUpdate] = useState(new Date());

  useEffect(() => {
    const fetchStats = async () => {
      try {
        setLoading(true);
        
        // Usar datos mockup directamente para la homepage
        const mockData = generarTodosLosDatosMock();
        const mockStats = {
          total_minas: mockData.minas.length,
          total_flota: mockData.estadisticas_minas.reduce((acc, mina) => acc + mina.flota_operando, 0),
          total_trabajadores: mockData.estadisticas_minas.reduce((acc, mina) => acc + mina.trabajadores_presentes, 0),
          total_dispositivos: mockData.alarmas_activas.length * 3, // Simular dispositivos
          eventos_activos: mockData.alarmas_activas.filter(a => a.estado === 'activo').length,
          mantenimientos_pendientes: Math.floor(Math.random() * 8),
        };

        setStats(mockStats);
        setError(null);
        setLastUpdate(new Date());
        
      } catch (err) {
        console.error("Error fetching dashboard stats:", err);
        setError("Error al cargar las estadísticas");
        
        // Mostrar datos de ejemplo si hay error
        setStats({
          total_minas: 0,
          total_flota: 0,
          total_trabajadores: 0,
          total_dispositivos: 0,
          eventos_activos: 0,
          mantenimientos_pendientes: 0,
        });
      } finally {
        setLoading(false);
      }
    };

    // Actualizar cada 30 segundos
    fetchStats();
    const interval = setInterval(fetchStats, 30000);
    
    return () => clearInterval(interval);
  }, []);

  const getStatCards = (): StatCard[] => {
    if (!stats) return [];

    return [
      {
        title: "Minas Activas",
        value: stats.total_minas,
        icon: Shield,
        color: "bg-blue-500/10 border-blue-500/20 text-blue-500",
        trend: {
          value: "Operativas",
          isPositive: true,
        },
      },
      {
        title: "Flota Total",
        value: stats.total_flota,
        icon: Truck,
        color: "bg-emerald-500/10 border-emerald-500/20 text-emerald-500",
        trend: {
          value: "Equipos",
          isPositive: true,
        },
      },
      {
        title: "Trabajadores",
        value: stats.total_trabajadores,
        icon: Users,
        color: "bg-cyan-500/10 border-cyan-500/20 text-cyan-500",
        trend: {
          value: "Activos",
          isPositive: true,
        },
      },
      {
        title: "Dispositivos IoT",
        value: stats.total_dispositivos,
        icon: Radio,
        color: "bg-orange-500/10 border-orange-500/20 text-orange-500",
        trend: {
          value: "Conectados",
          isPositive: true,
        },
      },
      {
        title: "Eventos Activos",
        value: stats.eventos_activos,
        icon: AlertTriangle,
        color: stats.eventos_activos > 0 ? "bg-red-500/10 border-red-500/20 text-red-500" : "bg-green-500/10 border-green-500/20 text-green-500",
        trend: {
          value: stats.eventos_activos > 0 ? "Requieren atención" : "Sin novedades",
          isPositive: stats.eventos_activos === 0,
        },
      },
      {
        title: "Mantenimiento",
        value: stats.mantenimientos_pendientes,
        icon: Wrench,
        color: stats.mantenimientos_pendientes > 0 ? "bg-yellow-500/10 border-yellow-500/20 text-yellow-500" : "bg-green-500/10 border-green-500/20 text-green-500",
        trend: {
          value: stats.mantenimientos_pendientes > 0 ? "Pendientes" : "Al día",
          isPositive: stats.mantenimientos_pendientes === 0,
        },
      },
    ];
  };

  // Eliminar skeleton - mostrar directamente los datos
  if (!stats) {
    return null;
  }

  const statCards = getStatCards();

  return (
    <div className="space-y-4">
      {/* Indicador de actualización */}
      <div className="text-right">
        <span className="text-xs text-muted-foreground">
          Última actualización: {lastUpdate.toLocaleTimeString("es-PE")}
        </span>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
        {statCards.map((stat, index) => (
          <motion.div
            key={stat.title}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: index * 0.1 }}
            className="relative overflow-hidden rounded-xl border border-border/50 bg-background p-6 hover:shadow-lg transition-all duration-300 hover:scale-105"
          >
            <div className="flex items-center justify-between mb-4">
              <div className={`flex h-10 w-10 items-center justify-center rounded-lg border ${stat.color}`}>
                <stat.icon className="h-5 w-5" />
              </div>
              {stat.trend && (
                <span className={`text-xs font-medium ${
                  stat.trend.isPositive ? "text-green-500" : "text-red-500"
                }`}>
                  {stat.trend.value}
                </span>
              )}
            </div>
            
            <div className="space-y-1">
              <h3 className="text-2xl font-bold text-foreground">
                {typeof stat.value === 'number' ? stat.value.toLocaleString() : stat.value}
              </h3>
              <p className="text-sm text-muted-foreground">{stat.title}</p>
            </div>

            {/* Animated background effect */}
            <motion.div
              className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent -skew-x-12"
              animate={{
                x: ["-100%", "200%"],
              }}
              transition={{
                duration: 3,
                repeat: Infinity,
                ease: "linear",
                delay: index * 0.2,
              }}
            />
          </motion.div>
        ))}
      </div>
    </div>
  );
}
