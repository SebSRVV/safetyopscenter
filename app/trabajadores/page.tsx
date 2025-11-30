"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import {
  Users,
  Plus,
  Search,
  Filter,
  MoreVertical,
  Eye,
  Edit,
  Trash2,
  Mail,
  Phone,
  Shield,
  Loader2,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Label } from "@/components/ui/label";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
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

// Mock data
const trabajadoresData = [
  {
    id: "1",
    nombre: "Juan Pérez",
    rut: "12.345.678-9",
    email: "jperez@mina.cl",
    telefono: "+56 9 1234 5678",
    cargo: "Operador de Camión",
    mina: "Mina Norte",
    turno: "A",
    estado: "en_turno",
    unidadAsignada: "CAM-001",
  },
  {
    id: "2",
    nombre: "María González",
    rut: "13.456.789-0",
    email: "mgonzalez@mina.cl",
    telefono: "+56 9 2345 6789",
    cargo: "Operador de Camión",
    mina: "Mina Norte",
    turno: "A",
    estado: "en_turno",
    unidadAsignada: "CAM-002",
  },
  {
    id: "3",
    nombre: "Roberto Silva",
    rut: "14.567.890-1",
    email: "rsilva@mina.cl",
    telefono: "+56 9 3456 7890",
    cargo: "Operador de Cargador",
    mina: "Mina Sur",
    turno: "B",
    estado: "disponible",
    unidadAsignada: null,
  },
  {
    id: "4",
    nombre: "Ana Torres",
    rut: "15.678.901-2",
    email: "atorres@mina.cl",
    telefono: "+56 9 4567 8901",
    cargo: "Supervisor",
    mina: "Mina Norte",
    turno: "A",
    estado: "en_turno",
    unidadAsignada: "VEH-001",
  },
  {
    id: "5",
    nombre: "Carlos Muñoz",
    rut: "16.789.012-3",
    email: "cmunoz@mina.cl",
    telefono: "+56 9 5678 9012",
    cargo: "Operador de Perforadora",
    mina: "Mina Sur",
    turno: "A",
    estado: "descanso",
    unidadAsignada: null,
  },
];

const getEstadoBadge = (estado: string) => {
  switch (estado) {
    case "en_turno":
      return <Badge className="bg-emerald-500/20 text-emerald-400 border-emerald-500/30">En Turno</Badge>;
    case "disponible":
      return <Badge className="bg-blue-500/20 text-blue-400 border-blue-500/30">Disponible</Badge>;
    case "descanso":
      return <Badge className="bg-yellow-500/20 text-yellow-400 border-yellow-500/30">Descanso</Badge>;
    case "licencia":
      return <Badge className="bg-gray-500/20 text-gray-400 border-gray-500/30">Licencia</Badge>;
    default:
      return <Badge variant="outline">{estado}</Badge>;
  }
};

const getInitials = (nombre: string) => {
  return nombre
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);
};

export default function TrabajadoresPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [filterMina, setFilterMina] = useState<string>("all");
  const [filterEstado, setFilterEstado] = useState<string>("all");
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const filteredTrabajadores = trabajadoresData.filter((trabajador) => {
    const matchesSearch =
      trabajador.nombre.toLowerCase().includes(searchQuery.toLowerCase()) ||
      trabajador.rut.includes(searchQuery) ||
      trabajador.cargo.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesMina = filterMina === "all" || trabajador.mina === filterMina;
    const matchesEstado = filterEstado === "all" || trabajador.estado === filterEstado;
    return matchesSearch && matchesMina && matchesEstado;
  });

  const handleCreateTrabajador = async () => {
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
          <h1 className="text-3xl font-bold text-foreground">Trabajadores</h1>
          <p className="text-muted-foreground mt-1">
            Gestión del personal de las faenas mineras
          </p>
        </div>
        <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
          <DialogTrigger asChild>
            <Button className="bg-primary text-primary-foreground hover:bg-primary/90">
              <Plus className="h-4 w-4 mr-2" />
              Nuevo Trabajador
            </Button>
          </DialogTrigger>
          <DialogContent className="bg-card border-border max-w-lg">
            <DialogHeader>
              <DialogTitle>Registrar Nuevo Trabajador</DialogTitle>
              <DialogDescription>
                Ingresa los datos del trabajador
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid gap-2">
                <Label htmlFor="nombre">Nombre Completo</Label>
                <Input
                  id="nombre"
                  placeholder="Juan Pérez"
                  className="bg-background border-border/50"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="grid gap-2">
                  <Label htmlFor="rut">RUT</Label>
                  <Input
                    id="rut"
                    placeholder="12.345.678-9"
                    className="bg-background border-border/50"
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="cargo">Cargo</Label>
                  <Select>
                    <SelectTrigger className="bg-background border-border/50">
                      <SelectValue placeholder="Seleccionar" />
                    </SelectTrigger>
                    <SelectContent className="bg-card border-border">
                      <SelectItem value="operador_camion">Operador de Camión</SelectItem>
                      <SelectItem value="operador_excavadora">Operador de Excavadora</SelectItem>
                      <SelectItem value="operador_cargador">Operador de Cargador</SelectItem>
                      <SelectItem value="supervisor">Supervisor</SelectItem>
                      <SelectItem value="mecanico">Mecánico</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="grid gap-2">
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="email@mina.cl"
                    className="bg-background border-border/50"
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="telefono">Teléfono</Label>
                  <Input
                    id="telefono"
                    placeholder="+56 9 1234 5678"
                    className="bg-background border-border/50"
                  />
                </div>
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
                  <Label htmlFor="turno">Turno</Label>
                  <Select>
                    <SelectTrigger className="bg-background border-border/50">
                      <SelectValue placeholder="Seleccionar" />
                    </SelectTrigger>
                    <SelectContent className="bg-card border-border">
                      <SelectItem value="A">Turno A (Día)</SelectItem>
                      <SelectItem value="B">Turno B (Noche)</SelectItem>
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
                onClick={handleCreateTrabajador}
                disabled={isLoading}
                className="bg-primary text-primary-foreground"
              >
                {isLoading ? (
                  <>
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    Creando...
                  </>
                ) : (
                  "Crear Trabajador"
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
            placeholder="Buscar por nombre, RUT, cargo..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10 bg-card border-border/50"
          />
        </div>
        <Select value={filterMina} onValueChange={setFilterMina}>
          <SelectTrigger className="w-[180px] bg-card border-border/50">
            <Filter className="h-4 w-4 mr-2" />
            <SelectValue placeholder="Mina" />
          </SelectTrigger>
          <SelectContent className="bg-card border-border">
            <SelectItem value="all">Todas las minas</SelectItem>
            <SelectItem value="Mina Norte">Mina Norte</SelectItem>
            <SelectItem value="Mina Sur">Mina Sur</SelectItem>
            <SelectItem value="Mina Central">Mina Central</SelectItem>
          </SelectContent>
        </Select>
        <Select value={filterEstado} onValueChange={setFilterEstado}>
          <SelectTrigger className="w-[180px] bg-card border-border/50">
            <SelectValue placeholder="Estado" />
          </SelectTrigger>
          <SelectContent className="bg-card border-border">
            <SelectItem value="all">Todos los estados</SelectItem>
            <SelectItem value="en_turno">En Turno</SelectItem>
            <SelectItem value="disponible">Disponible</SelectItem>
            <SelectItem value="descanso">Descanso</SelectItem>
            <SelectItem value="licencia">Licencia</SelectItem>
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
                  <TableHead>Trabajador</TableHead>
                  <TableHead>RUT</TableHead>
                  <TableHead>Cargo</TableHead>
                  <TableHead>Mina</TableHead>
                  <TableHead>Turno</TableHead>
                  <TableHead>Estado</TableHead>
                  <TableHead>Unidad</TableHead>
                  <TableHead className="text-right">Acciones</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredTrabajadores.map((trabajador) => (
                  <TableRow key={trabajador.id} className="border-border/50">
                    <TableCell>
                      <div className="flex items-center gap-3">
                        <Avatar className="h-9 w-9 border border-primary/20">
                          <AvatarImage src="" />
                          <AvatarFallback className="bg-primary/10 text-primary text-xs">
                            {getInitials(trabajador.nombre)}
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <p className="font-medium">{trabajador.nombre}</p>
                          <p className="text-xs text-muted-foreground">{trabajador.email}</p>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell className="font-mono text-sm">{trabajador.rut}</TableCell>
                    <TableCell>{trabajador.cargo}</TableCell>
                    <TableCell>{trabajador.mina}</TableCell>
                    <TableCell>
                      <Badge variant="outline">Turno {trabajador.turno}</Badge>
                    </TableCell>
                    <TableCell>{getEstadoBadge(trabajador.estado)}</TableCell>
                    <TableCell>
                      {trabajador.unidadAsignada ? (
                        <Badge className="bg-blue-500/20 text-blue-400 border-blue-500/30">
                          {trabajador.unidadAsignada}
                        </Badge>
                      ) : (
                        <span className="text-muted-foreground">-</span>
                      )}
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
