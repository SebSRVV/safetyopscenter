"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import {
  AlertTriangle,
  Search,
  Filter,
  Bell,
  CheckCircle,
  Clock,
  Settings,
  Eye,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
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
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { StatCard } from "@/components/cards/stat-card";
import { BarChart } from "@/components/charts/bar-chart";

// Mock data
const alarmasData = [
  {
    id: "1",
    tipo: "velocidad",
    severidad: "critica",
    mensaje: "CAM-001 excede límite de velocidad en Zona A",
    unidad: "CAM-001",
    lugar: "Zona de Carga A",
    mina: "Mina Norte",
    valorDetectado: 65,
    umbral: 40,
    estado: "activa",
    fecha: "2024-01-15 10:30:00",
  },
  {
    id: "2",
    tipo: "proximidad",
    severidad: "alta",
    mensaje: "Vehículos muy cerca en cruce principal",
    unidad: "CAM-002",
    lugar: "Cruce Principal",
    mina: "Mina Norte",
    valorDetectado: 3,
    umbral: 10,
    estado: "activa",
    fecha: "2024-01-15 10:25:00",
  },
  {
    id: "3",
    tipo: "zona_restringida",
    severidad: "media",
    mensaje: "EXC-001 cerca de área restringida",
    unidad: "EXC-001",
    lugar: "Polvorín",
    mina: "Mina Norte",
    valorDetectado: null,
    umbral: null,
    estado: "reconocida",
    fecha: "2024-01-15 10:15:00",
  },
  {
    id: "4",
    tipo: "fatiga",
    severidad: "alta",
    mensaje: "Operador muestra signos de fatiga",
    unidad: "CAM-003",
    lugar: "Ruta Principal",
    mina: "Mina Sur",
    valorDetectado: null,
    umbral: null,
    estado: "activa",
    fecha: "2024-01-15 10:00:00",
  },
  {
    id: "5",
    tipo: "velocidad",
    severidad: "media",
    mensaje: "VEH-001 velocidad elevada",
    unidad: "VEH-001",
    lugar: "Oficinas",
    mina: "Mina Norte",
    valorDetectado: 50,
    umbral: 40,
    estado: "resuelta",
    fecha: "2024-01-15 09:45:00",
  },
];

const alarmasPorTipo = [
  { tipo: "Velocidad", cantidad: 45 },
  { tipo: "Proximidad", cantidad: 32 },
  { tipo: "Zona Rest.", cantidad: 18 },
  { tipo: "Fatiga", cantidad: 12 },
  { tipo: "Colisión", cantidad: 5 },
];

const getSeveridadBadge = (severidad: string) => {
  switch (severidad) {
    case "critica":
      return <Badge className="bg-red-500/20 text-red-400 border-red-500/30">Crítica</Badge>;
    case "alta":
      return <Badge className="bg-orange-500/20 text-orange-400 border-orange-500/30">Alta</Badge>;
    case "media":
      return <Badge className="bg-yellow-500/20 text-yellow-400 border-yellow-500/30">Media</Badge>;
    case "baja":
      return <Badge className="bg-blue-500/20 text-blue-400 border-blue-500/30">Baja</Badge>;
    default:
      return <Badge variant="outline">{severidad}</Badge>;
  }
};

const getEstadoBadge = (estado: string) => {
  switch (estado) {
    case "activa":
      return (
        <Badge className="bg-red-500/20 text-red-400 border-red-500/30">
          <Bell className="h-3 w-3 mr-1" />
          Activa
        </Badge>
      );
    case "reconocida":
      return (
        <Badge className="bg-yellow-500/20 text-yellow-400 border-yellow-500/30">
          <Clock className="h-3 w-3 mr-1" />
          Reconocida
        </Badge>
      );
    case "resuelta":
      return (
        <Badge className="bg-emerald-500/20 text-emerald-400 border-emerald-500/30">
          <CheckCircle className="h-3 w-3 mr-1" />
          Resuelta
        </Badge>
      );
    default:
      return <Badge variant="outline">{estado}</Badge>;
  }
};

const getTipoBadge = (tipo: string) => {
  const tipos: Record<string, string> = {
    velocidad: "Velocidad",
    proximidad: "Proximidad",
    zona_restringida: "Zona Restringida",
    fatiga: "Fatiga",
    colision: "Colisión",
  };
  return tipos[tipo] || tipo;
};

export default function AlarmasPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [filterTipo, setFilterTipo] = useState<string>("all");
  const [filterSeveridad, setFilterSeveridad] = useState<string>("all");
  const [filterEstado, setFilterEstado] = useState<string>("all");
  const [activeTab, setActiveTab] = useState("todas");

  const filteredAlarmas = alarmasData.filter((alarma) => {
    const matchesSearch =
      alarma.mensaje.toLowerCase().includes(searchQuery.toLowerCase()) ||
      alarma.unidad.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesTipo = filterTipo === "all" || alarma.tipo === filterTipo;
    const matchesSeveridad = filterSeveridad === "all" || alarma.severidad === filterSeveridad;
    const matchesEstado = filterEstado === "all" || alarma.estado === filterEstado;
    const matchesTab =
      activeTab === "todas" ||
      (activeTab === "activas" && alarma.estado === "activa") ||
      (activeTab === "resueltas" && alarma.estado === "resuelta");
    return matchesSearch && matchesTipo && matchesSeveridad && matchesEstado && matchesTab;
  });

  const stats = {
    total: alarmasData.length,
    activas: alarmasData.filter((a) => a.estado === "activa").length,
    criticas: alarmasData.filter((a) => a.severidad === "critica" && a.estado === "activa").length,
    resueltas: alarmasData.filter((a) => a.estado === "resuelta").length,
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
          <h1 className="text-3xl font-bold text-foreground">Alarmas</h1>
          <p className="text-muted-foreground mt-1">
            Monitoreo y gestión de alarmas del sistema
          </p>
        </div>
        <Button variant="outline" className="border-border/50">
          <Settings className="h-4 w-4 mr-2" />
          Configurar Umbrales
        </Button>
      </motion.div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          title="Total Alarmas"
          value={stats.total}
          description="Últimas 24 horas"
          icon={Bell}
          variant="default"
          delay={0}
        />
        <StatCard
          title="Activas"
          value={stats.activas}
          description="Requieren atención"
          icon={AlertTriangle}
          variant="warning"
          delay={0.1}
        />
        <StatCard
          title="Críticas"
          value={stats.criticas}
          description="Prioridad máxima"
          icon={AlertTriangle}
          variant="critical"
          delay={0.2}
        />
        <StatCard
          title="Resueltas"
          value={stats.resueltas}
          description="Hoy"
          icon={CheckCircle}
          variant="success"
          delay={0.3}
        />
      </div>

      {/* Chart */}
      <BarChart
        title="Alarmas por Tipo (Últimos 7 días)"
        data={alarmasPorTipo}
        bars={[{ dataKey: "cantidad", name: "Cantidad", color: "#ef4444" }]}
        xAxisKey="tipo"
        height={250}
        colorByValue
        delay={0.4}
      />

      {/* Tabs and Filters */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, delay: 0.5 }}
      >
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-4">
            <TabsList className="bg-card border border-border/50">
              <TabsTrigger value="todas">Todas</TabsTrigger>
              <TabsTrigger value="activas">Activas</TabsTrigger>
              <TabsTrigger value="resueltas">Resueltas</TabsTrigger>
            </TabsList>

            <div className="flex flex-wrap gap-2">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                  type="search"
                  placeholder="Buscar..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10 w-[200px] bg-card border-border/50"
                />
              </div>
              <Select value={filterTipo} onValueChange={setFilterTipo}>
                <SelectTrigger className="w-[150px] bg-card border-border/50">
                  <SelectValue placeholder="Tipo" />
                </SelectTrigger>
                <SelectContent className="bg-card border-border">
                  <SelectItem value="all">Todos</SelectItem>
                  <SelectItem value="velocidad">Velocidad</SelectItem>
                  <SelectItem value="proximidad">Proximidad</SelectItem>
                  <SelectItem value="zona_restringida">Zona Restringida</SelectItem>
                  <SelectItem value="fatiga">Fatiga</SelectItem>
                </SelectContent>
              </Select>
              <Select value={filterSeveridad} onValueChange={setFilterSeveridad}>
                <SelectTrigger className="w-[150px] bg-card border-border/50">
                  <SelectValue placeholder="Severidad" />
                </SelectTrigger>
                <SelectContent className="bg-card border-border">
                  <SelectItem value="all">Todas</SelectItem>
                  <SelectItem value="critica">Crítica</SelectItem>
                  <SelectItem value="alta">Alta</SelectItem>
                  <SelectItem value="media">Media</SelectItem>
                  <SelectItem value="baja">Baja</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <TabsContent value={activeTab} className="mt-0">
            <Card className="bg-card border-border/50">
              <CardContent className="p-0">
                <Table>
                  <TableHeader>
                    <TableRow className="border-border/50">
                      <TableHead>Tipo</TableHead>
                      <TableHead>Severidad</TableHead>
                      <TableHead>Mensaje</TableHead>
                      <TableHead>Unidad</TableHead>
                      <TableHead>Lugar</TableHead>
                      <TableHead>Estado</TableHead>
                      <TableHead>Fecha</TableHead>
                      <TableHead className="text-right">Acciones</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredAlarmas.map((alarma) => (
                      <TableRow key={alarma.id} className="border-border/50">
                        <TableCell>
                          <Badge variant="outline">{getTipoBadge(alarma.tipo)}</Badge>
                        </TableCell>
                        <TableCell>{getSeveridadBadge(alarma.severidad)}</TableCell>
                        <TableCell className="max-w-[250px]">
                          <p className="truncate">{alarma.mensaje}</p>
                          {alarma.valorDetectado && (
                            <p className="text-xs text-muted-foreground">
                              Valor: {alarma.valorDetectado} (Umbral: {alarma.umbral})
                            </p>
                          )}
                        </TableCell>
                        <TableCell>
                          <Badge className="bg-blue-500/20 text-blue-400 border-blue-500/30">
                            {alarma.unidad}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-muted-foreground">{alarma.lugar}</TableCell>
                        <TableCell>{getEstadoBadge(alarma.estado)}</TableCell>
                        <TableCell className="text-muted-foreground text-sm">
                          {new Date(alarma.fecha).toLocaleString("es-CL")}
                        </TableCell>
                        <TableCell className="text-right">
                          <div className="flex justify-end gap-1">
                            <Button variant="ghost" size="sm">
                              <Eye className="h-4 w-4" />
                            </Button>
                            {alarma.estado === "activa" && (
                              <Button
                                variant="ghost"
                                size="sm"
                                className="text-yellow-500 hover:text-yellow-400"
                              >
                                <CheckCircle className="h-4 w-4" />
                              </Button>
                            )}
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </motion.div>
    </div>
  );
}
