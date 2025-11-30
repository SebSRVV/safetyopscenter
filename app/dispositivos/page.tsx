"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import {
  Cpu,
  Plus,
  Search,
  Filter,
  MoreVertical,
  Eye,
  Edit,
  Trash2,
  Wifi,
  WifiOff,
  MapPin,
  Truck,
  Loader2,
  Radio,
  Gauge,
  Camera,
  TrafficCone,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Label } from "@/components/ui/label";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
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
import { StatCard } from "@/components/cards/stat-card";

// Mock data
const dispositivosData = [
  {
    id: "1",
    codigo: "GPS-001",
    tipo: "gps",
    marca: "Trimble",
    modelo: "R12i",
    estado: "activo",
    asignadoA: "CAM-001",
    tipoAsignacion: "unidad",
    ultimaLectura: { valor: "Lat: -23.6509, Lon: -70.3975", timestamp: "Hace 1 min" },
  },
  {
    id: "2",
    codigo: "GPS-002",
    tipo: "gps",
    marca: "Trimble",
    modelo: "R12i",
    estado: "activo",
    asignadoA: "CAM-002",
    tipoAsignacion: "unidad",
    ultimaLectura: { valor: "Lat: -23.6529, Lon: -70.3955", timestamp: "Hace 2 min" },
  },
  {
    id: "3",
    codigo: "SEM-001",
    tipo: "semaforo",
    marca: "Industrial",
    modelo: "TL-300",
    estado: "activo",
    asignadoA: "Cruce Principal",
    tipoAsignacion: "lugar",
    ultimaLectura: { valor: "Verde", timestamp: "Hace 30 seg" },
  },
  {
    id: "4",
    codigo: "VEL-001",
    tipo: "sensor_velocidad",
    marca: "Radar",
    modelo: "RS-500",
    estado: "activo",
    asignadoA: "Ruta Principal",
    tipoAsignacion: "lugar",
    ultimaLectura: { valor: "32 km/h", timestamp: "Hace 1 min" },
  },
  {
    id: "5",
    codigo: "PROX-001",
    tipo: "sensor_proximidad",
    marca: "Hexagon",
    modelo: "CAS",
    estado: "error",
    asignadoA: "EXC-001",
    tipoAsignacion: "unidad",
    ultimaLectura: { valor: "Error de conexión", timestamp: "Hace 15 min" },
  },
  {
    id: "6",
    codigo: "CAM-V01",
    tipo: "camara",
    marca: "Hikvision",
    modelo: "DS-2CD2T47",
    estado: "activo",
    asignadoA: "Zona de Carga A",
    tipoAsignacion: "lugar",
    ultimaLectura: { valor: "Streaming activo", timestamp: "En vivo" },
  },
  {
    id: "7",
    codigo: "GPS-003",
    tipo: "gps",
    marca: "Trimble",
    modelo: "R12i",
    estado: "desconectado",
    asignadoA: null,
    tipoAsignacion: null,
    ultimaLectura: { valor: "Sin datos", timestamp: "Hace 2 horas" },
  },
];

const tiposDispositivo = [
  { value: "gps", label: "GPS", icon: MapPin },
  { value: "semaforo", label: "Semáforo", icon: TrafficCone },
  { value: "sensor_velocidad", label: "Sensor de Velocidad", icon: Gauge },
  { value: "sensor_proximidad", label: "Sensor de Proximidad", icon: Radio },
  { value: "camara", label: "Cámara", icon: Camera },
];

const getEstadoBadge = (estado: string) => {
  switch (estado) {
    case "activo":
      return (
        <Badge className="bg-emerald-500/20 text-emerald-400 border-emerald-500/30">
          <Wifi className="h-3 w-3 mr-1" />
          Activo
        </Badge>
      );
    case "inactivo":
      return (
        <Badge className="bg-gray-500/20 text-gray-400 border-gray-500/30">
          <WifiOff className="h-3 w-3 mr-1" />
          Inactivo
        </Badge>
      );
    case "error":
      return (
        <Badge className="bg-red-500/20 text-red-400 border-red-500/30">
          Error
        </Badge>
      );
    case "desconectado":
      return (
        <Badge className="bg-yellow-500/20 text-yellow-400 border-yellow-500/30">
          <WifiOff className="h-3 w-3 mr-1" />
          Desconectado
        </Badge>
      );
    default:
      return <Badge variant="outline">{estado}</Badge>;
  }
};

const getTipoIcon = (tipo: string) => {
  const tipoInfo = tiposDispositivo.find((t) => t.value === tipo);
  const Icon = tipoInfo?.icon || Cpu;
  return <Icon className="h-4 w-4" />;
};

export default function DispositivosPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [filterTipo, setFilterTipo] = useState<string>("all");
  const [filterEstado, setFilterEstado] = useState<string>("all");
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const filteredDispositivos = dispositivosData.filter((dispositivo) => {
    const matchesSearch =
      dispositivo.codigo.toLowerCase().includes(searchQuery.toLowerCase()) ||
      dispositivo.marca.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesTipo = filterTipo === "all" || dispositivo.tipo === filterTipo;
    const matchesEstado = filterEstado === "all" || dispositivo.estado === filterEstado;
    return matchesSearch && matchesTipo && matchesEstado;
  });

  const stats = {
    total: dispositivosData.length,
    activos: dispositivosData.filter((d) => d.estado === "activo").length,
    errores: dispositivosData.filter((d) => d.estado === "error").length,
    desconectados: dispositivosData.filter((d) => d.estado === "desconectado").length,
  };

  const handleCreateDispositivo = async () => {
    setIsLoading(true);
    await new Promise((resolve) => setTimeout(resolve, 1000));
    setIsLoading(false);
    setIsCreateDialogOpen(false);
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
          <h1 className="text-3xl font-bold text-foreground">Dispositivos IoT</h1>
          <p className="text-muted-foreground mt-1">
            Gestión de sensores y equipos de monitoreo
          </p>
        </div>
        <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
          <DialogTrigger asChild>
            <Button className="bg-primary text-primary-foreground hover:bg-primary/90">
              <Plus className="h-4 w-4 mr-2" />
              Nuevo Dispositivo
            </Button>
          </DialogTrigger>
          <DialogContent className="bg-card border-border max-w-lg">
            <DialogHeader>
              <DialogTitle>Registrar Nuevo Dispositivo</DialogTitle>
              <DialogDescription>
                Ingresa los datos del dispositivo IoT
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="grid gap-2">
                  <Label htmlFor="codigo">Código</Label>
                  <Input
                    id="codigo"
                    placeholder="GPS-001"
                    className="bg-background border-border/50"
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="tipo">Tipo</Label>
                  <Select>
                    <SelectTrigger className="bg-background border-border/50">
                      <SelectValue placeholder="Seleccionar" />
                    </SelectTrigger>
                    <SelectContent className="bg-card border-border">
                      {tiposDispositivo.map((tipo) => (
                        <SelectItem key={tipo.value} value={tipo.value}>
                          {tipo.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="grid gap-2">
                  <Label htmlFor="marca">Marca</Label>
                  <Input
                    id="marca"
                    placeholder="Trimble"
                    className="bg-background border-border/50"
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="modelo">Modelo</Label>
                  <Input
                    id="modelo"
                    placeholder="R12i"
                    className="bg-background border-border/50"
                  />
                </div>
              </div>
              <div className="grid gap-2">
                <Label htmlFor="numero_serie">Número de Serie</Label>
                <Input
                  id="numero_serie"
                  placeholder="SN-123456789"
                  className="bg-background border-border/50"
                />
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsCreateDialogOpen(false)}>
                Cancelar
              </Button>
              <Button
                onClick={handleCreateDispositivo}
                disabled={isLoading}
                className="bg-primary text-primary-foreground"
              >
                {isLoading ? (
                  <>
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    Creando...
                  </>
                ) : (
                  "Crear Dispositivo"
                )}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </motion.div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          title="Total Dispositivos"
          value={stats.total}
          icon={Cpu}
          variant="default"
          delay={0}
        />
        <StatCard
          title="Activos"
          value={stats.activos}
          icon={Wifi}
          variant="success"
          delay={0.1}
        />
        <StatCard
          title="Con Errores"
          value={stats.errores}
          icon={WifiOff}
          variant="critical"
          delay={0.2}
        />
        <StatCard
          title="Desconectados"
          value={stats.desconectados}
          icon={WifiOff}
          variant="warning"
          delay={0.3}
        />
      </div>

      {/* Filters */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, delay: 0.1 }}
        className="flex flex-col sm:flex-row gap-4"
      >
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            type="search"
            placeholder="Buscar por código, marca..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10 bg-card border-border/50"
          />
        </div>
        <Select value={filterTipo} onValueChange={setFilterTipo}>
          <SelectTrigger className="w-[180px] bg-card border-border/50">
            <Filter className="h-4 w-4 mr-2" />
            <SelectValue placeholder="Tipo" />
          </SelectTrigger>
          <SelectContent className="bg-card border-border">
            <SelectItem value="all">Todos los tipos</SelectItem>
            {tiposDispositivo.map((tipo) => (
              <SelectItem key={tipo.value} value={tipo.value}>
                {tipo.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <Select value={filterEstado} onValueChange={setFilterEstado}>
          <SelectTrigger className="w-[180px] bg-card border-border/50">
            <SelectValue placeholder="Estado" />
          </SelectTrigger>
          <SelectContent className="bg-card border-border">
            <SelectItem value="all">Todos los estados</SelectItem>
            <SelectItem value="activo">Activo</SelectItem>
            <SelectItem value="inactivo">Inactivo</SelectItem>
            <SelectItem value="error">Error</SelectItem>
            <SelectItem value="desconectado">Desconectado</SelectItem>
          </SelectContent>
        </Select>
      </motion.div>

      {/* Table */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, delay: 0.2 }}
      >
        <Card className="bg-card border-border/50">
          <CardContent className="p-0">
            <Table>
              <TableHeader>
                <TableRow className="border-border/50">
                  <TableHead>Dispositivo</TableHead>
                  <TableHead>Tipo</TableHead>
                  <TableHead>Marca / Modelo</TableHead>
                  <TableHead>Estado</TableHead>
                  <TableHead>Asignado a</TableHead>
                  <TableHead>Última Lectura</TableHead>
                  <TableHead className="text-right">Acciones</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredDispositivos.map((dispositivo) => (
                  <TableRow key={dispositivo.id} className="border-border/50">
                    <TableCell>
                      <div className="flex items-center gap-3">
                        <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary/10 border border-primary/20">
                          {getTipoIcon(dispositivo.tipo)}
                        </div>
                        <span className="font-medium">{dispositivo.codigo}</span>
                      </div>
                    </TableCell>
                    <TableCell>
                      {tiposDispositivo.find((t) => t.value === dispositivo.tipo)?.label}
                    </TableCell>
                    <TableCell>
                      {dispositivo.marca} {dispositivo.modelo}
                    </TableCell>
                    <TableCell>{getEstadoBadge(dispositivo.estado)}</TableCell>
                    <TableCell>
                      {dispositivo.asignadoA ? (
                        <div className="flex items-center gap-1">
                          {dispositivo.tipoAsignacion === "unidad" ? (
                            <Truck className="h-3 w-3 text-blue-400" />
                          ) : (
                            <MapPin className="h-3 w-3 text-purple-400" />
                          )}
                          <span>{dispositivo.asignadoA}</span>
                        </div>
                      ) : (
                        <span className="text-muted-foreground">Sin asignar</span>
                      )}
                    </TableCell>
                    <TableCell>
                      <div>
                        <p className="text-sm">{dispositivo.ultimaLectura.valor}</p>
                        <p className="text-xs text-muted-foreground">
                          {dispositivo.ultimaLectura.timestamp}
                        </p>
                      </div>
                    </TableCell>
                    <TableCell className="text-right">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon" className="h-8 w-8">
                            <MoreVertical className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end" className="bg-card border-border">
                          <DropdownMenuItem>
                            <Eye className="h-4 w-4 mr-2" />
                            Ver detalles
                          </DropdownMenuItem>
                          <DropdownMenuItem>
                            <Edit className="h-4 w-4 mr-2" />
                            Editar
                          </DropdownMenuItem>
                          <DropdownMenuItem className="text-destructive">
                            <Trash2 className="h-4 w-4 mr-2" />
                            Eliminar
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
}
