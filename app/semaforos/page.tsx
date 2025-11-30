"use client";

import { useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import {
  TrafficCone,
  Plus,
  Search,
  MoreVertical,
  Eye,
  Edit,
  Trash2,
  Play,
  MapPin,
  Loader2,
  Circle,
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
import { MiningMap } from "@/components/maps/mining-map";

// Mock data
const semaforosData = [
  {
    id: "1",
    codigo: "SEM-001",
    nombre: "Semáforo Cruce Principal",
    lugar: "Cruce Principal",
    mina: "Mina Norte",
    latitud: -23.6509,
    longitud: -70.3975,
    estado: "verde",
    modo: "automatico",
  },
  {
    id: "2",
    codigo: "SEM-002",
    nombre: "Semáforo Zona de Carga",
    lugar: "Zona de Carga A",
    mina: "Mina Norte",
    latitud: -23.6529,
    longitud: -70.3955,
    estado: "rojo",
    modo: "automatico",
  },
  {
    id: "3",
    codigo: "SEM-003",
    nombre: "Semáforo Acceso Taller",
    lugar: "Taller Mecánico",
    mina: "Mina Norte",
    latitud: -23.6489,
    longitud: -70.3995,
    estado: "amarillo",
    modo: "manual",
  },
  {
    id: "4",
    codigo: "SEM-004",
    nombre: "Semáforo Ruta Sur",
    lugar: "Ruta Principal Sur",
    mina: "Mina Sur",
    latitud: -27.3668,
    longitud: -70.3323,
    estado: "verde",
    modo: "automatico",
  },
  {
    id: "5",
    codigo: "SEM-005",
    nombre: "Semáforo Emergencia",
    lugar: "Punto de Emergencia",
    mina: "Mina Norte",
    latitud: -23.6549,
    longitud: -70.3935,
    estado: "intermitente",
    modo: "emergencia",
  },
];

const getEstadoIndicator = (estado: string) => {
  switch (estado) {
    case "verde":
      return (
        <div className="flex items-center gap-2">
          <Circle className="h-4 w-4 fill-emerald-500 text-emerald-500" />
          <span className="text-emerald-400">Verde</span>
        </div>
      );
    case "amarillo":
      return (
        <div className="flex items-center gap-2">
          <Circle className="h-4 w-4 fill-yellow-500 text-yellow-500" />
          <span className="text-yellow-400">Amarillo</span>
        </div>
      );
    case "rojo":
      return (
        <div className="flex items-center gap-2">
          <Circle className="h-4 w-4 fill-red-500 text-red-500" />
          <span className="text-red-400">Rojo</span>
        </div>
      );
    case "intermitente":
      return (
        <div className="flex items-center gap-2">
          <Circle className="h-4 w-4 fill-yellow-500 text-yellow-500 animate-pulse" />
          <span className="text-yellow-400">Intermitente</span>
        </div>
      );
    case "apagado":
      return (
        <div className="flex items-center gap-2">
          <Circle className="h-4 w-4 fill-gray-500 text-gray-500" />
          <span className="text-gray-400">Apagado</span>
        </div>
      );
    default:
      return <span>{estado}</span>;
  }
};

const getModoBadge = (modo: string) => {
  switch (modo) {
    case "automatico":
      return <Badge className="bg-blue-500/20 text-blue-400 border-blue-500/30">Automático</Badge>;
    case "manual":
      return <Badge className="bg-yellow-500/20 text-yellow-400 border-yellow-500/30">Manual</Badge>;
    case "emergencia":
      return <Badge className="bg-red-500/20 text-red-400 border-red-500/30">Emergencia</Badge>;
    default:
      return <Badge variant="outline">{modo}</Badge>;
  }
};

export default function SemaforosPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const filteredSemaforos = semaforosData.filter(
    (semaforo) =>
      semaforo.codigo.toLowerCase().includes(searchQuery.toLowerCase()) ||
      semaforo.nombre.toLowerCase().includes(searchQuery.toLowerCase()) ||
      semaforo.lugar.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const mapMarkers = filteredSemaforos.map((semaforo) => ({
    id: semaforo.id,
    position: [semaforo.latitud, semaforo.longitud] as [number, number],
    type: "semaforo" as const,
    name: semaforo.nombre,
    status:
      semaforo.estado === "rojo"
        ? ("critical" as const)
        : semaforo.estado === "amarillo"
        ? ("warning" as const)
        : ("active" as const),
    details: `Estado: ${semaforo.estado} | Modo: ${semaforo.modo}`,
  }));

  const handleCreateSemaforo = async () => {
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
          <h1 className="text-3xl font-bold text-foreground">Semáforos</h1>
          <p className="text-muted-foreground mt-1">
            Control y monitoreo de semáforos de tráfico minero
          </p>
        </div>
        <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
          <DialogTrigger asChild>
            <Button className="bg-primary text-primary-foreground hover:bg-primary/90">
              <Plus className="h-4 w-4 mr-2" />
              Nuevo Semáforo
            </Button>
          </DialogTrigger>
          <DialogContent className="bg-card border-border max-w-lg">
            <DialogHeader>
              <DialogTitle>Registrar Nuevo Semáforo</DialogTitle>
              <DialogDescription>
                Configura un nuevo semáforo de tráfico
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="grid gap-2">
                  <Label htmlFor="codigo">Código</Label>
                  <Input
                    id="codigo"
                    placeholder="SEM-001"
                    className="bg-background border-border/50"
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="mina">Mina</Label>
                  <Select>
                    <SelectTrigger className="bg-background border-border/50">
                      <SelectValue placeholder="Seleccionar" />
                    </SelectTrigger>
                    <SelectContent className="bg-card border-border">
                      <SelectItem value="1">Mina Norte</SelectItem>
                      <SelectItem value="2">Mina Sur</SelectItem>
                      <SelectItem value="3">Mina Central</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div className="grid gap-2">
                <Label htmlFor="nombre">Nombre</Label>
                <Input
                  id="nombre"
                  placeholder="Semáforo Cruce Principal"
                  className="bg-background border-border/50"
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="lugar">Lugar</Label>
                <Select>
                  <SelectTrigger className="bg-background border-border/50">
                    <SelectValue placeholder="Seleccionar lugar" />
                  </SelectTrigger>
                  <SelectContent className="bg-card border-border">
                    <SelectItem value="1">Cruce Principal</SelectItem>
                    <SelectItem value="2">Zona de Carga A</SelectItem>
                    <SelectItem value="3">Taller Mecánico</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="grid gap-2">
                  <Label htmlFor="latitud">Latitud</Label>
                  <Input
                    id="latitud"
                    type="number"
                    step="0.0001"
                    placeholder="-23.6509"
                    className="bg-background border-border/50"
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="longitud">Longitud</Label>
                  <Input
                    id="longitud"
                    type="number"
                    step="0.0001"
                    placeholder="-70.3975"
                    className="bg-background border-border/50"
                  />
                </div>
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsCreateDialogOpen(false)}>
                Cancelar
              </Button>
              <Button
                onClick={handleCreateSemaforo}
                disabled={isLoading}
                className="bg-primary text-primary-foreground"
              >
                {isLoading ? (
                  <>
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    Creando...
                  </>
                ) : (
                  "Crear Semáforo"
                )}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </motion.div>

      {/* Search */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, delay: 0.1 }}
      >
        <div className="relative max-w-md">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            type="search"
            placeholder="Buscar semáforos..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10 bg-card border-border/50"
          />
        </div>
      </motion.div>

      {/* Map */}
      <MiningMap
        title="Ubicación de Semáforos"
        center={[-23.6509, -70.3975]}
        zoom={13}
        markers={mapMarkers}
        height="300px"
        delay={0.2}
        showLegend={false}
      />

      {/* Semaforos Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredSemaforos.map((semaforo, index) => (
          <motion.div
            key={semaforo.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: 0.2 + index * 0.05 }}
          >
            <Card className="bg-card border-border/50 hover:border-primary/30 transition-all duration-300">
              <CardHeader className="pb-2">
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10 border border-primary/20">
                      <TrafficCone className="h-5 w-5 text-primary" />
                    </div>
                    <div>
                      <CardTitle className="text-base">{semaforo.codigo}</CardTitle>
                      <p className="text-sm text-muted-foreground">{semaforo.nombre}</p>
                    </div>
                  </div>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="icon" className="h-8 w-8">
                        <MoreVertical className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end" className="bg-card border-border">
                      <DropdownMenuItem asChild>
                        <Link href={`/semaforos/${semaforo.id}`}>
                          <Eye className="h-4 w-4 mr-2" />
                          Ver detalles
                        </Link>
                      </DropdownMenuItem>
                      <DropdownMenuItem asChild>
                        <Link href={`/semaforos/${semaforo.id}/simulacion`}>
                          <Play className="h-4 w-4 mr-2" />
                          Simulación
                        </Link>
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
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">Estado</span>
                    {getEstadoIndicator(semaforo.estado)}
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">Modo</span>
                    {getModoBadge(semaforo.modo)}
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">Ubicación</span>
                    <div className="flex items-center gap-1 text-sm">
                      <MapPin className="h-3 w-3" />
                      {semaforo.lugar}
                    </div>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">Mina</span>
                    <span className="text-sm">{semaforo.mina}</span>
                  </div>

                  <div className="flex gap-2 pt-2">
                    <Link href={`/semaforos/${semaforo.id}`} className="flex-1">
                      <Button
                        variant="outline"
                        className="w-full border-primary/30 text-primary hover:bg-primary/10"
                        size="sm"
                      >
                        <Eye className="h-4 w-4 mr-2" />
                        Detalles
                      </Button>
                    </Link>
                    <Link href={`/semaforos/${semaforo.id}/simulacion`}>
                      <Button
                        variant="outline"
                        className="border-blue-500/30 text-blue-400 hover:bg-blue-500/10"
                        size="sm"
                      >
                        <Play className="h-4 w-4" />
                      </Button>
                    </Link>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
