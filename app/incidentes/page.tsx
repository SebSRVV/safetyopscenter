"use client";

import { useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import {
  FileWarning,
  Plus,
  Search,
  Eye,
  MoreVertical,
  Edit,
  Loader2,
  RefreshCw,
  Mountain,
  AlertCircle,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Skeleton } from "@/components/ui/skeleton";
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
import { useMinas, useIncidentes, useCrearIncidente } from "@/hooks/use-dashboard";
import { useToast } from "@/hooks/use-toast";
import { ClasificacionIncidente } from "@/lib/rpc/incidentes";

const getClasificacionColor = (clasificacion: string) => {
  switch (clasificacion) {
    case "fatal":
      return "bg-red-500/20 text-red-400 border-red-500/30";
    case "grave":
      return "bg-orange-500/20 text-orange-400 border-orange-500/30";
    case "moderado":
      return "bg-yellow-500/20 text-yellow-400 border-yellow-500/30";
    case "leve":
      return "bg-blue-500/20 text-blue-400 border-blue-500/30";
    default:
      return "bg-gray-500/20 text-gray-400 border-gray-500/30";
  }
};

const clasificaciones: { value: ClasificacionIncidente; label: string }[] = [
  { value: "leve", label: "Leve" },
  { value: "moderado", label: "Moderado" },
  { value: "grave", label: "Grave" },
  { value: "fatal", label: "Fatal" },
];

export default function IncidentesPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedMina, setSelectedMina] = useState<number | null>(null);
  const [filterClasificacion, setFilterClasificacion] = useState<string>("all");
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [formData, setFormData] = useState({
    tipo: "",
    clasificacion: "" as ClasificacionIncidente,
    descripcion: "",
    causa_probable: "",
  });

  const { toast } = useToast();
  const { data: minas, isLoading: loadingMinas } = useMinas();
  const { data: incidentes, isLoading: loadingIncidentes, refetch, isFetching } = useIncidentes(selectedMina);
  const crearIncidenteMutation = useCrearIncidente();

  // Auto-select first mina
  if (!selectedMina && minas && minas.length > 0) {
    setSelectedMina(minas[0].id_mina);
  }

  const filteredIncidentes = (incidentes || []).filter((incidente) => {
    const matchesSearch =
      incidente.descripcion?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      incidente.tipo?.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesClasificacion =
      filterClasificacion === "all" || incidente.clasificacion === filterClasificacion;
    return matchesSearch && matchesClasificacion;
  });

  const stats = {
    total: incidentes?.length || 0,
    graves: incidentes?.filter((i) => i.clasificacion === "grave" || i.clasificacion === "fatal").length || 0,
    moderados: incidentes?.filter((i) => i.clasificacion === "moderado").length || 0,
    leves: incidentes?.filter((i) => i.clasificacion === "leve").length || 0,
  };

  const handleCreateIncidente = async () => {
    if (!formData.tipo || !formData.clasificacion || !selectedMina) {
      toast({
        title: "Error",
        description: "Tipo, clasificación y mina son requeridos",
        variant: "destructive",
      });
      return;
    }

    try {
      await crearIncidenteMutation.mutateAsync({
        id_mina: selectedMina,
        tipo: formData.tipo,
        clasificacion: formData.clasificacion,
        descripcion: formData.descripcion || undefined,
        causa_probable: formData.causa_probable || undefined,
      });
      toast({
        title: "Incidente registrado",
        description: "El incidente ha sido registrado exitosamente",
      });
      setIsCreateDialogOpen(false);
      setFormData({ tipo: "", clasificacion: "" as ClasificacionIncidente, descripcion: "", causa_probable: "" });
    } catch (err) {
      toast({
        title: "Error al crear incidente",
        description: err instanceof Error ? err.message : "Error desconocido",
        variant: "destructive",
      });
    }
  };

  const handleRefresh = () => {
    refetch();
    toast({
      title: "Actualizando",
      description: "Cargando incidentes desde Supabase...",
    });
  };

  const minaActual = minas?.find((m) => m.id_mina === selectedMina);

  // Loading
  if (loadingMinas) {
    return (
      <div className="space-y-6">
        <Skeleton className="h-8 w-48" />
        <div className="grid grid-cols-4 gap-4">
          {[1, 2, 3, 4].map((i) => (
            <Skeleton key={i} className="h-24" />
          ))}
        </div>
        <Skeleton className="h-96" />
      </div>
    );
  }

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
            {minaActual?.nombre || "Selecciona una mina"} - Registro de incidentes de seguridad
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
          <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
            <DialogTrigger asChild>
              <Button className="bg-primary text-primary-foreground" disabled={!selectedMina}>
                <Plus className="h-4 w-4 mr-2" />
                Nuevo Incidente
              </Button>
            </DialogTrigger>
            <DialogContent className="bg-card border-border max-w-lg">
              <DialogHeader>
                <DialogTitle>Registrar Incidente</DialogTitle>
                <DialogDescription>Los datos se guardarán en Supabase</DialogDescription>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <div className="grid gap-2">
                  <Label htmlFor="tipo">Tipo de Incidente *</Label>
                  <Input
                    id="tipo"
                    placeholder="Ej: Cuasi accidente, Falla equipo..."
                    value={formData.tipo}
                    onChange={(e) => setFormData({ ...formData, tipo: e.target.value })}
                    className="bg-background border-border/50"
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="clasificacion">Clasificación *</Label>
                  <Select
                    value={formData.clasificacion}
                    onValueChange={(v) => setFormData({ ...formData, clasificacion: v as ClasificacionIncidente })}
                  >
                    <SelectTrigger className="bg-background border-border/50">
                      <SelectValue placeholder="Seleccionar clasificación" />
                    </SelectTrigger>
                    <SelectContent className="bg-card border-border">
                      {clasificaciones.map((c) => (
                        <SelectItem key={c.value} value={c.value}>
                          {c.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="descripcion">Descripción</Label>
                  <Textarea
                    id="descripcion"
                    placeholder="Descripción del incidente..."
                    value={formData.descripcion}
                    onChange={(e) => setFormData({ ...formData, descripcion: e.target.value })}
                    className="bg-background border-border/50"
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="causa">Causa Probable</Label>
                  <Input
                    id="causa"
                    placeholder="Causa probable del incidente"
                    value={formData.causa_probable}
                    onChange={(e) => setFormData({ ...formData, causa_probable: e.target.value })}
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
                  disabled={crearIncidenteMutation.isPending}
                  className="bg-primary text-primary-foreground"
                >
                  {crearIncidenteMutation.isPending ? (
                    <>
                      <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                      Guardando...
                    </>
                  ) : (
                    "Registrar Incidente"
                  )}
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
      </motion.div>

      {/* Stats */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, delay: 0.1 }}
        className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4"
      >
        <StatCard
          title="Total Incidentes"
          value={stats.total}
          icon={FileWarning}
          trend={{ value: 0, isPositive: true }}
        />
        <StatCard
          title="Graves/Fatales"
          value={stats.graves}
          icon={AlertCircle}
          trend={{ value: 0, isPositive: false }}
        />
        <StatCard
          title="Moderados"
          value={stats.moderados}
          icon={FileWarning}
          trend={{ value: 0, isPositive: false }}
        />
        <StatCard
          title="Leves"
          value={stats.leves}
          icon={FileWarning}
          trend={{ value: 0, isPositive: true }}
        />
      </motion.div>

      {/* Filters */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, delay: 0.2 }}
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
        <Select value={filterClasificacion} onValueChange={setFilterClasificacion}>
          <SelectTrigger className="w-[180px] bg-card border-border/50">
            <SelectValue placeholder="Clasificación" />
          </SelectTrigger>
          <SelectContent className="bg-card border-border">
            <SelectItem value="all">Todas</SelectItem>
            {clasificaciones.map((c) => (
              <SelectItem key={c.value} value={c.value}>
                {c.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </motion.div>

      {/* No mina selected */}
      {!selectedMina && (
        <div className="flex flex-col items-center justify-center h-[40vh] space-y-4">
          <Mountain className="h-16 w-16 text-muted-foreground/50" />
          <h2 className="text-xl font-semibold">Selecciona una mina</h2>
          <p className="text-muted-foreground">Elige una mina para ver sus incidentes</p>
        </div>
      )}

      {/* Loading */}
      {selectedMina && loadingIncidentes && (
        <Card className="bg-card border-border/50">
          <CardContent className="p-8 flex items-center justify-center">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
            <span className="ml-3">Cargando incidentes...</span>
          </CardContent>
        </Card>
      )}

      {/* Empty state */}
      {selectedMina && !loadingIncidentes && filteredIncidentes.length === 0 && (
        <div className="flex flex-col items-center justify-center h-[40vh] space-y-4">
          <FileWarning className="h-16 w-16 text-muted-foreground/50" />
          <h2 className="text-xl font-semibold">No hay incidentes</h2>
          <p className="text-muted-foreground">
            {searchQuery || filterClasificacion !== "all"
              ? "No se encontraron incidentes con ese criterio"
              : "No hay incidentes registrados para esta mina"}
          </p>
          {!searchQuery && filterClasificacion === "all" && (
            <Button onClick={() => setIsCreateDialogOpen(true)}>
              <Plus className="h-4 w-4 mr-2" />
              Registrar Primer Incidente
            </Button>
          )}
        </div>
      )}

      {/* Table */}
      {selectedMina && !loadingIncidentes && filteredIncidentes.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.3 }}
        >
          <Card className="bg-card border-border/50">
            <CardHeader className="pb-3">
              <CardTitle className="text-lg flex items-center gap-2">
                <FileWarning className="h-5 w-5 text-primary" />
                Incidentes Registrados ({filteredIncidentes.length})
              </CardTitle>
            </CardHeader>
            <CardContent className="p-0">
              <Table>
                <TableHeader>
                  <TableRow className="border-border/50">
                    <TableHead>ID</TableHead>
                    <TableHead>Tipo</TableHead>
                    <TableHead>Clasificación</TableHead>
                    <TableHead>Descripción</TableHead>
                    <TableHead>Fecha</TableHead>
                    <TableHead className="text-right">Acciones</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredIncidentes.map((incidente) => (
                    <TableRow key={incidente.id_incidente} className="border-border/50">
                      <TableCell className="font-mono">#{incidente.id_incidente}</TableCell>
                      <TableCell className="capitalize">{incidente.tipo || "-"}</TableCell>
                      <TableCell>
                        <Badge variant="outline" className={getClasificacionColor(incidente.clasificacion)}>
                          {incidente.clasificacion}
                        </Badge>
                      </TableCell>
                      <TableCell className="max-w-xs truncate">
                        {incidente.descripcion || "Sin descripción"}
                      </TableCell>
                      <TableCell className="text-muted-foreground text-sm">
                        {incidente.creado_en
                          ? new Date(incidente.creado_en).toLocaleString("es-PE")
                          : "-"}
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
                              <Link href={`/incidentes/${incidente.id_incidente}`}>
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
      )}

      {/* Fetching indicator */}
      {isFetching && !loadingIncidentes && (
        <div className="fixed bottom-4 right-4 bg-card border border-border rounded-lg px-4 py-2 shadow-lg flex items-center gap-2">
          <Loader2 className="h-4 w-4 animate-spin text-primary" />
          <span className="text-sm">Actualizando...</span>
        </div>
      )}
    </div>
  );
}
