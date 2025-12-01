"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import {
  BarChart3,
  AlertTriangle,
  Truck,
  FileWarning,
  Mountain,
  RefreshCw,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { StatCard } from "@/components/cards/stat-card";
import { LineChart } from "@/components/charts/line-chart";
import { BarChart } from "@/components/charts/bar-chart";
import { MiningMap } from "@/components/maps/mining-map";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useMinas, useAlarmas, useFlota, useIncidentes, useDashboardResumen } from "@/hooks/use-dashboard";
import { useToast } from "@/hooks/use-toast";

// Mock data
const kpisGlobales = {
  incidentesHoy: 3,
  incidentesMes: 24,
  alarmasCriticasHoy: 7,
  alarmasActivas: 12,
  flotaActiva: 24,
  flotaTotal: 30,
  trabajadoresTurno: 156,
  dispositivosActivos: 45,
  dispositivosTotal: 52,
};

const comparativaMinas = [
  { mina: "Mina Norte", incidentes: 12, alarmas: 45, flota: 15, trabajadores: 89 },
  { mina: "Mina Sur", incidentes: 8, alarmas: 32, flota: 10, trabajadores: 56 },
  { mina: "Mina Central", incidentes: 4, alarmas: 18, flota: 5, trabajadores: 23 },
];

const top5Unidades = [
  { codigo: "CAM-003", tipo: "Camión", mina: "Mina Norte", incidentes: 5 },
  { codigo: "EXC-001", tipo: "Excavadora", mina: "Mina Norte", incidentes: 4 },
  { codigo: "CAM-001", tipo: "Camión", mina: "Mina Norte", incidentes: 3 },
  { codigo: "CAR-002", tipo: "Cargador", mina: "Mina Sur", incidentes: 3 },
  { codigo: "VEH-005", tipo: "Vehículo Liviano", mina: "Mina Sur", incidentes: 2 },
];

const tendenciaIncidentes = [
  { mes: "Ago", cantidad: 28 },
  { mes: "Sep", cantidad: 32 },
  { mes: "Oct", cantidad: 25 },
  { mes: "Nov", cantidad: 30 },
  { mes: "Dic", cantidad: 22 },
  { mes: "Ene", cantidad: 24 },
];

const distribucionAlarmas = [
  { tipo: "Velocidad", cantidad: 45, porcentaje: 38 },
  { tipo: "Proximidad", cantidad: 32, porcentaje: 27 },
  { tipo: "Zona Rest.", cantidad: 18, porcentaje: 15 },
  { tipo: "Fatiga", cantidad: 12, porcentaje: 10 },
  { tipo: "Otros", cantidad: 12, porcentaje: 10 },
];

const zonasPeligrosas = [
  { id: "1", nombre: "Cruce Principal", latitud: -23.6509, longitud: -70.3975, nivel: 85, incidentes: 8, alarmas: 23 },
  { id: "2", nombre: "Zona de Carga A", latitud: -23.6529, longitud: -70.3955, nivel: 72, incidentes: 5, alarmas: 18 },
  { id: "3", nombre: "Ruta Sur", latitud: -23.6549, longitud: -70.3935, nivel: 65, incidentes: 4, alarmas: 15 },
  { id: "4", nombre: "Acceso Taller", latitud: -23.6489, longitud: -70.3995, nivel: 45, incidentes: 2, alarmas: 8 },
];

const mapMarkers = zonasPeligrosas.map((zona) => ({
  id: zona.id,
  position: [zona.latitud, zona.longitud] as [number, number],
  type: "alarma" as const,
  name: zona.nombre,
  status: zona.nivel >= 70 ? ("critical" as const) : zona.nivel >= 50 ? ("warning" as const) : ("active" as const),
  details: `Nivel de riesgo: ${zona.nivel}% | Incidentes: ${zona.incidentes} | Alarmas: ${zona.alarmas}`,
}));

export default function MetricsPage() {
  const [selectedMina, setSelectedMina] = useState<number | null>(null);
  const { toast } = useToast();
  
  const { data: minas } = useMinas();
  const { data: alarmas, refetch: refetchAlarmas, isFetching } = useAlarmas(selectedMina);
  const { data: flota } = useFlota(selectedMina);
  const { data: incidentes } = useIncidentes(selectedMina);
  const { data: resumen } = useDashboardResumen(selectedMina);
  
  // Auto-select first mina
  if (!selectedMina && minas && minas.length > 0) {
    setSelectedMina(minas[0].id_mina);
  }
  
  const minaActual = minas?.find((m) => m.id_mina === selectedMina);
  
  // Calcular KPIs reales
  const realKpis = {
    incidentesTotal: incidentes?.length || 0,
    alarmasCriticas: alarmas?.filter((a) => a.severidad === "critica").length || 0,
    alarmasTotal: alarmas?.length || 0,
    flotaActiva: flota?.length || 0,
    flotaTotal: flota?.length || 0,
  };
  
  const handleRefresh = () => {
    refetchAlarmas();
    toast({
      title: "Actualizando",
      description: "Cargando métricas desde Supabase...",
    });
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4"
      >
        <div>
          <h1 className="text-3xl font-bold text-foreground">Métricas</h1>
          <p className="text-muted-foreground mt-1">
            {minaActual?.nombre || "Selecciona una mina"} - Análisis y estadísticas
          </p>
        </div>
        <div className="flex items-center gap-3">
          <Select
            value={selectedMina?.toString() || ""}
            onValueChange={(v) => setSelectedMina(parseInt(v))}
          >
            <SelectTrigger className="w-[200px] bg-card border-border/50">
              <Mountain className="h-4 w-4 mr-2 text-primary" />
              <SelectValue placeholder="Seleccionar mina" />
            </SelectTrigger>
            <SelectContent className="bg-card border-border">
              {(minas || []).map((mina) => (
                <SelectItem key={mina.id_mina} value={mina.id_mina.toString()}>
                  {mina.nombre}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Button
            variant="outline"
            onClick={handleRefresh}
            disabled={isFetching || !selectedMina}
            className="border-border/50"
          >
            <RefreshCw className={`h-4 w-4 mr-2 ${isFetching ? "animate-spin" : ""}`} />
            Actualizar
          </Button>
        </div>
      </motion.div>

      {/* KPIs Globales - Datos reales de Supabase */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          title="Incidentes"
          value={realKpis.incidentesTotal}
          description="Total registrados"
          icon={FileWarning}
          variant="warning"
          trend={{ value: 0, isPositive: true }}
          delay={0}
        />
        <StatCard
          title="Alarmas Críticas"
          value={realKpis.alarmasCriticas}
          description={`${realKpis.alarmasTotal} alarmas total`}
          icon={AlertTriangle}
          variant="critical"
          delay={0.1}
        />
        <StatCard
          title="Flota"
          value={realKpis.flotaActiva}
          description="Unidades registradas"
          icon={Truck}
          variant="success"
          delay={0.2}
        />
        <StatCard
          title="Dashboard"
          value={resumen ? "Activo" : "Sin datos"}
          description={minaActual?.nombre || "Selecciona mina"}
          icon={BarChart3}
          variant="info"
          delay={0.3}
        />
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <LineChart
          title="Tendencia de Incidentes (Últimos 6 meses)"
          data={tendenciaIncidentes}
          lines={[{ dataKey: "cantidad", name: "Incidentes", color: "#fbbf24" }]}
          xAxisKey="mes"
          delay={0.4}
        />
        <BarChart
          title="Distribución de Alarmas por Tipo"
          data={distribucionAlarmas}
          bars={[{ dataKey: "cantidad", name: "Cantidad", color: "#ef4444" }]}
          xAxisKey="tipo"
          colorByValue
          delay={0.5}
        />
      </div>

      {/* Comparativa Minas */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.6 }}
      >
        <Card className="bg-card border-border/50">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Mountain className="h-5 w-5 text-primary" />
              Comparativa entre Minas
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {comparativaMinas.map((mina, index) => (
                <motion.div
                  key={mina.mina}
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.7 + index * 0.1 }}
                  className="p-4 rounded-lg bg-muted/30 border border-border/30"
                >
                  <h3 className="font-semibold text-lg mb-4">{mina.mina}</h3>
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <p className="text-2xl font-bold text-yellow-400">{mina.incidentes}</p>
                      <p className="text-xs text-muted-foreground">Incidentes</p>
                    </div>
                    <div>
                      <p className="text-2xl font-bold text-red-400">{mina.alarmas}</p>
                      <p className="text-xs text-muted-foreground">Alarmas</p>
                    </div>
                    <div>
                      <p className="text-2xl font-bold text-blue-400">{mina.flota}</p>
                      <p className="text-xs text-muted-foreground">Flota</p>
                    </div>
                    <div>
                      <p className="text-2xl font-bold text-emerald-400">{mina.trabajadores}</p>
                      <p className="text-xs text-muted-foreground">Trabajadores</p>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Heatmap and Top 5 */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Heatmap de Zonas Peligrosas */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.8 }}
        >
          <Card className="bg-card border-border/50">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <AlertTriangle className="h-5 w-5 text-red-500" />
                Zonas de Mayor Riesgo
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {zonasPeligrosas.map((zona, index) => (
                  <div
                    key={zona.id}
                    className="flex items-center justify-between p-3 rounded-lg bg-muted/30 border border-border/30"
                  >
                    <div className="flex items-center gap-3">
                      <div
                        className={`h-3 w-3 rounded-full ${
                          zona.nivel >= 70
                            ? "bg-red-500"
                            : zona.nivel >= 50
                            ? "bg-yellow-500"
                            : "bg-emerald-500"
                        }`}
                      />
                      <div>
                        <p className="font-medium">{zona.nombre}</p>
                        <p className="text-xs text-muted-foreground">
                          {zona.incidentes} incidentes • {zona.alarmas} alarmas
                        </p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p
                        className={`text-lg font-bold ${
                          zona.nivel >= 70
                            ? "text-red-400"
                            : zona.nivel >= 50
                            ? "text-yellow-400"
                            : "text-emerald-400"
                        }`}
                      >
                        {zona.nivel}%
                      </p>
                      <p className="text-xs text-muted-foreground">Nivel de riesgo</p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Top 5 Unidades con más Incidentes */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.9 }}
        >
          <Card className="bg-card border-border/50">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Truck className="h-5 w-5 text-blue-500" />
                Top 5 Unidades con más Incidentes
              </CardTitle>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow className="border-border/50">
                    <TableHead>#</TableHead>
                    <TableHead>Unidad</TableHead>
                    <TableHead>Tipo</TableHead>
                    <TableHead>Mina</TableHead>
                    <TableHead className="text-right">Incidentes</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {top5Unidades.map((unidad, index) => (
                    <TableRow key={unidad.codigo} className="border-border/50">
                      <TableCell>
                        <Badge
                          className={
                            index === 0
                              ? "bg-yellow-500/20 text-yellow-400 border-yellow-500/30"
                              : index === 1
                              ? "bg-gray-400/20 text-gray-300 border-gray-400/30"
                              : index === 2
                              ? "bg-orange-600/20 text-orange-400 border-orange-600/30"
                              : "bg-muted text-muted-foreground"
                          }
                        >
                          {index + 1}
                        </Badge>
                      </TableCell>
                      <TableCell className="font-medium">{unidad.codigo}</TableCell>
                      <TableCell className="text-muted-foreground">{unidad.tipo}</TableCell>
                      <TableCell className="text-muted-foreground">{unidad.mina}</TableCell>
                      <TableCell className="text-right">
                        <span className="text-lg font-bold text-red-400">{unidad.incidentes}</span>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </motion.div>
      </div>

      {/* Map */}
      <MiningMap
        title="Mapa de Calor - Zonas de Riesgo"
        center={[-23.6509, -70.3975]}
        zoom={14}
        markers={mapMarkers}
        height="400px"
        delay={1}
      />
    </div>
  );
}
