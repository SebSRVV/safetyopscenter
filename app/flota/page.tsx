"use client";

import { useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import {
  Truck,
  Plus,
  Search,
  Filter,
  MoreVertical,
  Eye,
  Edit,
  Trash2,
  MapPin,
  Gauge,
  Loader2,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
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
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

// Mock data
const flotaData = [
  {
    id: "1",
    codigo: "CAM-001",
    tipo: "camion",
    marca: "Caterpillar",
    modelo: "797F",
    anio: 2022,
    mina: "Mina Norte",
    estado: "activo",
    operador: "Juan Pérez",
    velocidad: 28,
    ubicacion: "Zona de Carga A",
  },
  {
    id: "2",
    codigo: "CAM-002",
    tipo: "camion",
    marca: "Komatsu",
    modelo: "980E-4",
    anio: 2021,
    mina: "Mina Norte",
    estado: "activo",
    operador: "María González",
    velocidad: 32,
    ubicacion: "Ruta Principal",
  },
  {
    id: "3",
    codigo: "EXC-001",
    tipo: "excavadora",
    marca: "Caterpillar",
    modelo: "6060",
    anio: 2020,
    mina: "Mina Norte",
    estado: "mantenimiento",
    operador: "-",
    velocidad: 0,
    ubicacion: "Taller Mecánico",
  },
  {
    id: "4",
    codigo: "CAR-001",
    tipo: "cargador",
    marca: "Komatsu",
    modelo: "WA1200-6",
    anio: 2023,
    mina: "Mina Sur",
    estado: "activo",
    operador: "Roberto Silva",
    velocidad: 15,
    ubicacion: "Zona de Descarga B",
  },
  {
    id: "5",
    codigo: "PER-001",
    tipo: "perforadora",
    marca: "Atlas Copco",
    modelo: "PV-351",
    anio: 2021,
    mina: "Mina Sur",
    estado: "activo",
    operador: "Carlos Muñoz",
    velocidad: 0,
    ubicacion: "Frente de Trabajo 3",
  },
  {
    id: "6",
    codigo: "VEH-001",
    tipo: "vehiculo_liviano",
    marca: "Toyota",
    modelo: "Hilux",
    anio: 2023,
    mina: "Mina Norte",
    estado: "activo",
    operador: "Ana Torres",
    velocidad: 45,
    ubicacion: "Oficinas Centrales",
  },
];

const tiposVehiculo = [
  { value: "camion", label: "Camión", icon: "🚛" },
  { value: "excavadora", label: "Excavadora", icon: "🏗️" },
  { value: "cargador", label: "Cargador", icon: "🚜" },
  { value: "perforadora", label: "Perforadora", icon: "⚙️" },
  { value: "vehiculo_liviano", label: "Vehículo Liviano", icon: "🚗" },
];

const getEstadoBadge = (estado: string) => {
  switch (estado) {
    case "activo":
      return <Badge className="bg-emerald-500/20 text-emerald-400 border-emerald-500/30">Activo</Badge>;
    case "inactivo":
      return <Badge className="bg-gray-500/20 text-gray-400 border-gray-500/30">Inactivo</Badge>;
    case "mantenimiento":
      return <Badge className="bg-yellow-500/20 text-yellow-400 border-yellow-500/30">Mantenimiento</Badge>;
    case "fuera_servicio":
      return <Badge className="bg-red-500/20 text-red-400 border-red-500/30">Fuera de Servicio</Badge>;
    default:
      return <Badge variant="outline">{estado}</Badge>;
  }
};

const getTipoIcon = (tipo: string) => {
  const tipoInfo = tiposVehiculo.find((t) => t.value === tipo);
  return tipoInfo?.icon || "🚗";
};

export default function FlotaPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [filterTipo, setFilterTipo] = useState<string>("all");
  const [filterEstado, setFilterEstado] = useState<string>("all");
  const [viewMode, setViewMode] = useState<"cards" | "table">("cards");
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const filteredFlota = flotaData.filter((unidad) => {
    const matchesSearch =
      unidad.codigo.toLowerCase().includes(searchQuery.toLowerCase()) ||
      unidad.marca.toLowerCase().includes(searchQuery.toLowerCase()) ||
      unidad.modelo.toLowerCase().includes(searchQuery.toLowerCase()) ||
      unidad.operador.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesTipo = filterTipo === "all" || unidad.tipo === filterTipo;
    const matchesEstado = filterEstado === "all" || unidad.estado === filterEstado;
    return matchesSearch && matchesTipo && matchesEstado;
  });

  const handleCreateUnidad = async () => {
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
          <h1 className="text-3xl font-bold text-foreground">Flota</h1>
          <p className="text-muted-foreground mt-1">
            Gestión de vehículos y maquinaria minera
          </p>
        </div>
        <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
          <DialogTrigger asChild>
            <Button className="bg-primary text-primary-foreground hover:bg-primary/90">
              <Plus className="h-4 w-4 mr-2" />
              Nueva Unidad
            </Button>
          </DialogTrigger>
          <DialogContent className="bg-card border-border max-w-lg">
            <DialogHeader>
              <DialogTitle>Registrar Nueva Unidad</DialogTitle>
              <DialogDescription>
                Ingresa los datos del vehículo o maquinaria
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="grid gap-2">
                  <Label htmlFor="codigo">Código</Label>
                  <Input
                    id="codigo"
                    placeholder="CAM-001"
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
                      {tiposVehiculo.map((tipo) => (
                        <SelectItem key={tipo.value} value={tipo.value}>
                          {tipo.icon} {tipo.label}
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
                    placeholder="Caterpillar"
                    className="bg-background border-border/50"
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="modelo">Modelo</Label>
                  <Input
                    id="modelo"
                    placeholder="797F"
                    className="bg-background border-border/50"
                  />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="grid gap-2">
                  <Label htmlFor="anio">Año</Label>
                  <Input
                    id="anio"
                    type="number"
                    placeholder="2023"
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
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsCreateDialogOpen(false)}>
                Cancelar
              </Button>
              <Button
                onClick={handleCreateUnidad}
                disabled={isLoading}
                className="bg-primary text-primary-foreground"
              >
                {isLoading ? (
                  <>
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    Creando...
                  </>
                ) : (
                  "Crear Unidad"
                )}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </motion.div>

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
            placeholder="Buscar por código, marca, modelo..."
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
            {tiposVehiculo.map((tipo) => (
              <SelectItem key={tipo.value} value={tipo.value}>
                {tipo.icon} {tipo.label}
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
            <SelectItem value="mantenimiento">Mantenimiento</SelectItem>
            <SelectItem value="fuera_servicio">Fuera de Servicio</SelectItem>
          </SelectContent>
        </Select>
      </motion.div>

      {/* View Toggle */}
      <Tabs value={viewMode} onValueChange={(v) => setViewMode(v as "cards" | "table")}>
        <TabsList className="bg-card border border-border/50">
          <TabsTrigger value="cards">Tarjetas</TabsTrigger>
          <TabsTrigger value="table">Tabla</TabsTrigger>
        </TabsList>

        {/* Cards View */}
        <TabsContent value="cards" className="mt-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredFlota.map((unidad, index) => (
              <motion.div
                key={unidad.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: index * 0.05 }}
              >
                <Card className="bg-card border-border/50 hover:border-primary/30 transition-all duration-300 group">
                  <CardContent className="p-4">
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex items-center gap-3">
                        <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10 border border-primary/20 text-2xl">
                          {getTipoIcon(unidad.tipo)}
                        </div>
                        <div>
                          <h3 className="font-bold text-lg">{unidad.codigo}</h3>
                          <p className="text-sm text-muted-foreground">
                            {unidad.marca} {unidad.modelo}
                          </p>
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
                            <Link href={`/flota/${unidad.id}`}>
                              <Eye className="h-4 w-4 mr-2" />
                              Ver detalles
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

                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-muted-foreground">Estado</span>
                        {getEstadoBadge(unidad.estado)}
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-muted-foreground">Mina</span>
                        <span className="text-sm font-medium">{unidad.mina}</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-muted-foreground">Operador</span>
                        <span className="text-sm font-medium">{unidad.operador}</span>
                      </div>

                      <div className="pt-3 border-t border-border/50 flex items-center justify-between">
                        <div className="flex items-center gap-1 text-sm">
                          <Gauge className="h-4 w-4 text-primary" />
                          <span className="font-medium">{unidad.velocidad} km/h</span>
                        </div>
                        <div className="flex items-center gap-1 text-sm text-muted-foreground">
                          <MapPin className="h-4 w-4" />
                          <span className="truncate max-w-[120px]">{unidad.ubicacion}</span>
                        </div>
                      </div>
                    </div>

                    <Link href={`/flota/${unidad.id}`}>
                      <Button
                        variant="outline"
                        className="w-full mt-4 border-primary/30 text-primary hover:bg-primary/10"
                      >
                        Ver Detalles
                      </Button>
                    </Link>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </TabsContent>

        {/* Table View */}
        <TabsContent value="table" className="mt-4">
          <Card className="bg-card border-border/50">
            <CardContent className="p-0">
              <Table>
                <TableHeader>
                  <TableRow className="border-border/50">
                    <TableHead>Código</TableHead>
                    <TableHead>Tipo</TableHead>
                    <TableHead>Marca / Modelo</TableHead>
                    <TableHead>Mina</TableHead>
                    <TableHead>Estado</TableHead>
                    <TableHead>Operador</TableHead>
                    <TableHead>Velocidad</TableHead>
                    <TableHead className="text-right">Acciones</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredFlota.map((unidad) => (
                    <TableRow key={unidad.id} className="border-border/50">
                      <TableCell className="font-medium">{unidad.codigo}</TableCell>
                      <TableCell>
                        <span className="text-lg mr-2">{getTipoIcon(unidad.tipo)}</span>
                        {tiposVehiculo.find((t) => t.value === unidad.tipo)?.label}
                      </TableCell>
                      <TableCell>
                        {unidad.marca} {unidad.modelo}
                      </TableCell>
                      <TableCell>{unidad.mina}</TableCell>
                      <TableCell>{getEstadoBadge(unidad.estado)}</TableCell>
                      <TableCell>{unidad.operador}</TableCell>
                      <TableCell>
                        <span className="font-medium">{unidad.velocidad} km/h</span>
                      </TableCell>
                      <TableCell className="text-right">
                        <Link href={`/flota/${unidad.id}`}>
                          <Button variant="ghost" size="sm">
                            <Eye className="h-4 w-4" />
                          </Button>
                        </Link>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
