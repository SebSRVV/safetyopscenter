"use client";

import { useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import {
  FileWarning,
  Plus,
  Search,
  Filter,
  Eye,
  MoreVertical,
  Edit,
  Calendar,
  Loader2,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
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
import { LineChart } from "@/components/charts/line-chart";

// Mock data
const incidentesData = [
  {
    id: "1",
    tipo: "cuasi_accidente",
    severidad: "moderado",
    titulo: "Frenado brusco por vehículo en cruce",
    descripcion: "CAM-003 frenó bruscamente al detectar vehículo liviano en cruce",
    fecha: "2024-01-15 10:30:00",
    unidad: "CAM-003",
    mina: "Mina Norte",
    lugar: "Cruce Principal",
    estado: "reportado",
    trabajador: "Juan Pérez",
  },
  {
    id: "2",
    tipo: "falla_equipo",
    severidad: "leve",
    titulo: "Sensor GPS desconectado",
    descripcion: "GPS-012 perdió conexión durante 15 minutos",
    fecha: "2024-01-15 08:45:00",
    unidad: "EXC-001",
    mina: "Mina Norte",
    lugar: "Zona de Carga A",
    estado: "en_investigacion",
    trabajador: null,
  },
  {
    id: "3",
    tipo: "incidente_ambiental",
    severidad: "grave",
    titulo: "Derrame menor de combustible",
    descripcion: "Derrame de aproximadamente 5 litros de diesel durante carga",
    fecha: "2024-01-14 16:20:00",
    unidad: "CAM-001",
    mina: "Mina Norte",
    lugar: "Estación de Combustible",
    estado: "cerrado",
    trabajador: "María González",
  },
  {
    id: "4",
    tipo: "accidente",
    severidad: "moderado",
    titulo: "Colisión menor entre vehículos",
    descripcion: "Contacto lateral entre CAM-002 y vehículo liviano estacionado",
    fecha: "2024-01-13 14:00:00",
    unidad: "CAM-002",
    mina: "Mina Sur",
    lugar: "Estacionamiento",
    estado: "cerrado",
    trabajador: "Roberto Silva",
  },
];

const incidentesTendencia = [
  { fecha: "Sem 1", cantidad: 3 },
  { fecha: "Sem 2", cantidad: 5 },
  { fecha: "Sem 3", cantidad: 2 },
  { fecha: "Sem 4", cantidad: 4 },
];

const getTipoBadge = (tipo: string) => {
  const tipos: Record<string, { label: string; className: string }> = {
    accidente: { label: "Accidente", className: "bg-red-500/20 text-red-400 border-red-500/30" },
    cuasi_accidente: { label: "Cuasi Accidente", className: "bg-orange-500/20 text-orange-400 border-orange-500/30" },
    incidente_ambiental: { label: "Ambiental", className: "bg-emerald-500/20 text-emerald-400 border-emerald-500/30" },
    falla_equipo: { label: "Falla Equipo", className: "bg-blue-500/20 text-blue-400 border-blue-500/30" },
    otro: { label: "Otro", className: "bg-gray-500/20 text-gray-400 border-gray-500/30" },
  };
  const info = tipos[tipo] || tipos.otro;
  return <Badge className={info.className}>{info.label}</Badge>;
};

const getSeveridadBadge = (severidad: string) => {
  switch (severidad) {
    case "fatal":
      return <Badge className="bg-red-600/20 text-red-500 border-red-600/30">Fatal</Badge>;
    case "grave":
      return <Badge className="bg-red-500/20 text-red-400 border-red-500/30">Grave</Badge>;
    case "moderado":
      return <Badge className="bg-yellow-500/20 text-yellow-400 border-yellow-500/30">Moderado</Badge>;
    case "leve":
      return <Badge className="bg-blue-500/20 text-blue-400 border-blue-500/30">Leve</Badge>;
    default:
      return <Badge variant="outline">{severidad}</Badge>;
  }
};

const getEstadoBadge = (estado: string) => {
  switch (estado) {
    case "reportado":
      return <Badge className="bg-yellow-500/20 text-yellow-400 border-yellow-500/30">Reportado</Badge>;
    case "en_investigacion":
      return <Badge className="bg-blue-500/20 text-blue-400 border-blue-500/30">En Investigación</Badge>;
    case "cerrado":
      return <Badge className="bg-emerald-500/20 text-emerald-400 border-emerald-500/30">Cerrado</Badge>;
    default:
      return <Badge variant="outline">{estado}</Badge>;
  }
};

export default function IncidentesPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [filterTipo, setFilterTipo] = useState<string>("all");
  const [filterSeveridad, setFilterSeveridad] = useState<string>("all");
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const filteredIncidentes = incidentesData.filter((incidente) => {
    const matchesSearch =
      incidente.titulo.toLowerCase().includes(searchQuery.toLowerCase()) ||
      incidente.descripcion.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesTipo = filterTipo === "all" || incidente.tipo === filterTipo;
    const matchesSeveridad = filterSeveridad === "all" || incidente.severidad === filterSeveridad;
    return matchesSearch && matchesTipo && matchesSeveridad;
  });

  const stats = {
    total: incidentesData.length,
    hoy: incidentesData.filter((i) => i.fecha.startsWith("2024-01-15")).length,
    enInvestigacion: incidentesData.filter((i) => i.estado === "en_investigacion").length,
    graves: incidentesData.filter((i) => i.severidad === "grave" || i.severidad === "fatal").length,
  };

  const handleCreateIncidente = async () => {
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
          <h1 className="text-3xl font-bold text-foreground">Incidentes</h1>
          <p className="text-muted-foreground mt-1">
            Registro y seguimiento de incidentes en faenas
          </p>
        </div>
        <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
          <DialogTrigger asChild>
            <Button className="bg-primary text-primary-foreground hover:bg-primary/90">
              <Plus className="h-4 w-4 mr-2" />
              Reportar Incidente
            </Button>
          </DialogTrigger>
          <DialogContent className="bg-card border-border max-w-2xl">
            <DialogHeader>
              <DialogTitle>Reportar Nuevo Incidente</DialogTitle>
              <DialogDescription>
                Complete el formulario con los detalles del incidente
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4 max-h-[60vh] overflow-y-auto">
              <div className="grid grid-cols-2 gap-4">
                <div className="grid gap-2">
                  <Label htmlFor="tipo">Tipo de Incidente</Label>
                  <Select>
                    <SelectTrigger className="bg-background border-border/50">
                      <SelectValue placeholder="Seleccionar" />
                    </SelectTrigger>
                    <SelectContent className="bg-card border-border">
                      <SelectItem value="accidente">Accidente</SelectItem>
                      <SelectItem value="cuasi_accidente">Cuasi Accidente</SelectItem>
                      <SelectItem value="incidente_ambiental">Incidente Ambiental</SelectItem>
                      <SelectItem value="falla_equipo">Falla de Equipo</SelectItem>
                      <SelectItem value="otro">Otro</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="severidad">Severidad</Label>
                  <Select>
                    <SelectTrigger className="bg-background border-border/50">
                      <SelectValue placeholder="Seleccionar" />
                    </SelectTrigger>
                    <SelectContent className="bg-card border-border">
                      <SelectItem value="leve">Leve</SelectItem>
                      <SelectItem value="moderado">Moderado</SelectItem>
                      <SelectItem value="grave">Grave</SelectItem>
                      <SelectItem value="fatal">Fatal</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div className="grid gap-2">
                <Label htmlFor="titulo">Título</Label>
                <Input
                  id="titulo"
                  placeholder="Breve descripción del incidente"
                  className="bg-background border-border/50"
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="descripcion">Descripción Detallada</Label>
                <Textarea
                  id="descripcion"
                  placeholder="Describa el incidente con el mayor detalle posible..."
                  className="bg-background border-border/50 min-h-[100px]"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
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
                <div className="grid gap-2">
                  <Label htmlFor="lugar">Lugar</Label>
                  <Select>
                    <SelectTrigger className="bg-background border-border/50">
                      <SelectValue placeholder="Seleccionar" />
                    </SelectTrigger>
                    <SelectContent className="bg-card border-border">
                      <SelectItem value="1">Zona de Carga A</SelectItem>
                      <SelectItem value="2">Cruce Principal</SelectItem>
                      <SelectItem value="3">Taller Mecánico</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="grid gap-2">
                  <Label htmlFor="unidad">Unidad Involucrada</Label>
                  <Select>
                    <SelectTrigger className="bg-background border-border/50">
                      <SelectValue placeholder="Seleccionar (opcional)" />
                    </SelectTrigger>
                    <SelectContent className="bg-card border-border">
                      <SelectItem value="CAM-001">CAM-001</SelectItem>
                      <SelectItem value="CAM-002">CAM-002</SelectItem>
                      <SelectItem value="EXC-001">EXC-001</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="trabajador">Trabajador Involucrado</Label>
                  <Select>
                    <SelectTrigger className="bg-background border-border/50">
                      <SelectValue placeholder="Seleccionar (opcional)" />
                    </SelectTrigger>
                    <SelectContent className="bg-card border-border">
                      <SelectItem value="1">Juan Pérez</SelectItem>
                      <SelectItem value="2">María González</SelectItem>
                      <SelectItem value="3">Roberto Silva</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div className="grid gap-2">
                <Label htmlFor="danos">Daños (si aplica)</Label>
                <Textarea
                  id="danos"
                  placeholder="Describa los daños materiales o personales..."
                  className="bg-background border-border/50"
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="causa">Causa Probable</Label>
                <Textarea
                  id="causa"
                  placeholder="Describa la causa probable del incidente..."
                  className="bg-background border-border/50"
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="acciones">Acciones Correctivas</Label>
                <Textarea
                  id="acciones"
                  placeholder="Describa las acciones correctivas tomadas o recomendadas..."
                  className="bg-background border-border/50"
                />
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsCreateDialogOpen(false)}>
                Cancelar
              </Button>
              <Button
                onClick={handleCreateIncidente}
                disabled={isLoading}
                className="bg-primary text-primary-foreground"
              >
                {isLoading ? (
                  <>
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    Guardando...
                  </>
                ) : (
                  "Reportar Incidente"
                )}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </motion.div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          title="Total Incidentes"
          value={stats.total}
          description="Este mes"
          icon={FileWarning}
          variant="default"
          delay={0}
        />
        <StatCard
          title="Hoy"
          value={stats.hoy}
          icon={Calendar}
          variant="warning"
          delay={0.1}
        />
        <StatCard
          title="En Investigación"
          value={stats.enInvestigacion}
          icon={Search}
          variant="info"
          delay={0.2}
        />
        <StatCard
          title="Graves/Fatales"
          value={stats.graves}
          icon={FileWarning}
          variant="critical"
          delay={0.3}
        />
      </div>

      {/* Chart */}
      <LineChart
        title="Tendencia de Incidentes (Últimas 4 semanas)"
        data={incidentesTendencia}
        lines={[{ dataKey: "cantidad", name: "Incidentes", color: "#fbbf24" }]}
        xAxisKey="fecha"
        height={200}
        delay={0.4}
      />

      {/* Filters */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, delay: 0.5 }}
        className="flex flex-col sm:flex-row gap-4"
      >
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            type="search"
            placeholder="Buscar incidentes..."
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
            <SelectItem value="accidente">Accidente</SelectItem>
            <SelectItem value="cuasi_accidente">Cuasi Accidente</SelectItem>
            <SelectItem value="incidente_ambiental">Ambiental</SelectItem>
            <SelectItem value="falla_equipo">Falla Equipo</SelectItem>
          </SelectContent>
        </Select>
        <Select value={filterSeveridad} onValueChange={setFilterSeveridad}>
          <SelectTrigger className="w-[180px] bg-card border-border/50">
            <SelectValue placeholder="Severidad" />
          </SelectTrigger>
          <SelectContent className="bg-card border-border">
            <SelectItem value="all">Todas</SelectItem>
            <SelectItem value="leve">Leve</SelectItem>
            <SelectItem value="moderado">Moderado</SelectItem>
            <SelectItem value="grave">Grave</SelectItem>
            <SelectItem value="fatal">Fatal</SelectItem>
          </SelectContent>
        </Select>
      </motion.div>

      {/* Table */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, delay: 0.6 }}
      >
        <Card className="bg-card border-border/50">
          <CardContent className="p-0">
            <Table>
              <TableHeader>
                <TableRow className="border-border/50">
                  <TableHead>Tipo</TableHead>
                  <TableHead>Severidad</TableHead>
                  <TableHead>Título</TableHead>
                  <TableHead>Unidad</TableHead>
                  <TableHead>Mina / Lugar</TableHead>
                  <TableHead>Estado</TableHead>
                  <TableHead>Fecha</TableHead>
                  <TableHead className="text-right">Acciones</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredIncidentes.map((incidente) => (
                  <TableRow key={incidente.id} className="border-border/50">
                    <TableCell>{getTipoBadge(incidente.tipo)}</TableCell>
                    <TableCell>{getSeveridadBadge(incidente.severidad)}</TableCell>
                    <TableCell>
                      <div>
                        <p className="font-medium">{incidente.titulo}</p>
                        <p className="text-xs text-muted-foreground truncate max-w-[200px]">
                          {incidente.descripcion}
                        </p>
                      </div>
                    </TableCell>
                    <TableCell>
                      {incidente.unidad ? (
                        <Badge className="bg-blue-500/20 text-blue-400 border-blue-500/30">
                          {incidente.unidad}
                        </Badge>
                      ) : (
                        <span className="text-muted-foreground">-</span>
                      )}
                    </TableCell>
                    <TableCell>
                      <div>
                        <p className="text-sm">{incidente.mina}</p>
                        <p className="text-xs text-muted-foreground">{incidente.lugar}</p>
                      </div>
                    </TableCell>
                    <TableCell>{getEstadoBadge(incidente.estado)}</TableCell>
                    <TableCell className="text-muted-foreground text-sm">
                      {new Date(incidente.fecha).toLocaleDateString("es-CL")}
                    </TableCell>
                    <TableCell className="text-right">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon" className="h-8 w-8">
                            <MoreVertical className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end" className="bg-card border-border">
                          <DropdownMenuItem asChild>
                            <Link href={`/incidentes/${incidente.id}`}>
                              <Eye className="h-4 w-4 mr-2" />
                              Ver detalles
                            </Link>
                          </DropdownMenuItem>
                          <DropdownMenuItem>
                            <Edit className="h-4 w-4 mr-2" />
                            Editar
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
