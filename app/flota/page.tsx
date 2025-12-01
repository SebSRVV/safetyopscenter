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
  Loader2,
  RefreshCw,
  AlertCircle,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Label } from "@/components/ui/label";
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
import { useMinas, useFlota, useCrearFlota } from "@/hooks/use-dashboard";
import { useToast } from "@/hooks/use-toast";
import { ClaseFlota, FamiliaFlota } from "@/lib/rpc/flota";

const clasesFlota: { value: ClaseFlota; label: string }[] = [
  { value: "vehiculo_liviano", label: "Vehículo Liviano" },
  { value: "vehiculo_pesado", label: "Vehículo Pesado" },
  { value: "maquinaria", label: "Maquinaria" },
];

const familiasFlota: { value: FamiliaFlota; label: string; icon: string }[] = [
  { value: "camioneta", label: "Camioneta", icon: "🚗" },
  { value: "camion", label: "Camión", icon: "🚛" },
  { value: "bus", label: "Bus", icon: "🚌" },
  { value: "scooptram", label: "Scooptram", icon: "🏗️" },
  { value: "dumper", label: "Dumper", icon: "🚜" },
  { value: "jumbo", label: "Jumbo", icon: "⚙️" },
  { value: "otro", label: "Otro", icon: "🔧" },
];

const getFamiliaIcon = (familia: string) => {
  return familiasFlota.find((f) => f.value === familia)?.icon || "🚗";
};

const getFamiliaLabel = (familia: string) => {
  return familiasFlota.find((f) => f.value === familia)?.label || familia;
};

const getClaseLabel = (clase: string) => {
  return clasesFlota.find((c) => c.value === clase)?.label || clase;
};

export default function FlotaPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [filterFamilia, setFilterFamilia] = useState<string>("all");
  const [selectedMina, setSelectedMina] = useState<number | null>(null);
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [formData, setFormData] = useState({
    nombre: "",
    clase: "" as ClaseFlota,
    familia: "" as FamiliaFlota,
    tipo_especifico: "",
    placa: "",
    marca: "",
    modelo: "",
    anio: undefined as number | undefined,
    capacidad: undefined as number | undefined,
  });

  const { toast } = useToast();
  const { data: minas } = useMinas();
  const { data: flota, isLoading, error, refetch, isFetching } = useFlota(selectedMina);
  const crearFlotaMutation = useCrearFlota();

  // Auto-select first mina if available
  if (!selectedMina && minas && minas.length > 0) {
    setSelectedMina(minas[0].id_mina);
  }

  const filteredFlota = (flota || []).filter((unidad) => {
    const matchesSearch =
      unidad.nombre.toLowerCase().includes(searchQuery.toLowerCase()) ||
      unidad.placa_o_credencial?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      unidad.marca?.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesFamilia = filterFamilia === "all" || unidad.familia === filterFamilia;
    return matchesSearch && matchesFamilia;
  });

  const handleCreateFlota = async () => {
    if (!formData.nombre || !formData.clase || !formData.familia || !selectedMina) {
      toast({
        title: "Error",
        description: "Nombre, clase, familia y mina son requeridos",
        variant: "destructive",
      });
      return;
    }

    try {
      await crearFlotaMutation.mutateAsync({
        ...formData,
        id_mina: selectedMina,
      });
      toast({
        title: "Unidad creada",
        description: `${formData.nombre} ha sido registrada exitosamente`,
      });
      setIsCreateDialogOpen(false);
      setFormData({
        nombre: "",
        clase: "" as ClaseFlota,
        familia: "" as FamiliaFlota,
        tipo_especifico: "",
        placa: "",
        marca: "",
        modelo: "",
        anio: undefined,
        capacidad: undefined,
      });
    } catch (err) {
      toast({
        title: "Error al crear unidad",
        description: err instanceof Error ? err.message : "Error desconocido",
        variant: "destructive",
      });
    }
  };

  const handleRefresh = () => {
    refetch();
    toast({
      title: "Actualizando",
      description: "Cargando flota desde Supabase...",
    });
  };

  // Loading skeleton
  if (isLoading && selectedMina) {
    return (
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <div>
            <Skeleton className="h-8 w-32 mb-2" />
            <Skeleton className="h-4 w-64" />
          </div>
          <Skeleton className="h-10 w-40" />
        </div>
        <div className="flex gap-4">
          <Skeleton className="h-10 w-64" />
          <Skeleton className="h-10 w-40" />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <Card key={i} className="bg-card border-border/50">
              <CardContent className="p-4">
                <Skeleton className="h-12 w-12 rounded-lg mb-4" />
                <Skeleton className="h-6 w-24 mb-2" />
                <Skeleton className="h-4 w-32" />
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="flex flex-col items-center justify-center h-[50vh] space-y-4">
        <AlertCircle className="h-16 w-16 text-destructive" />
        <h2 className="text-xl font-semibold">Error al cargar flota</h2>
        <p className="text-muted-foreground text-center max-w-md">
          {error.message || "No se pudo conectar con Supabase"}
        </p>
        <Button onClick={() => refetch()} variant="outline">
          <RefreshCw className="h-4 w-4 mr-2" />
          Reintentar
        </Button>
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
          <h1 className="text-3xl font-bold text-foreground">Flota</h1>
          <p className="text-muted-foreground mt-1">
            Vehículos y maquinaria ({flota?.length || 0} registrados)
          </p>
        </div>
        <div className="flex gap-2">
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
              <Button 
                className="bg-primary text-primary-foreground hover:bg-primary/90"
                disabled={!selectedMina}
              >
                <Plus className="h-4 w-4 mr-2" />
                Nueva Unidad
              </Button>
            </DialogTrigger>
            <DialogContent className="bg-card border-border max-w-lg">
              <DialogHeader>
                <DialogTitle>Registrar Nueva Unidad</DialogTitle>
                <DialogDescription>
                  Los datos se guardarán en Supabase
                </DialogDescription>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <div className="grid gap-2">
                  <Label htmlFor="nombre">Nombre *</Label>
                  <Input
                    id="nombre"
                    placeholder="Scooptram SC-003"
                    value={formData.nombre}
                    onChange={(e) => setFormData({ ...formData, nombre: e.target.value })}
                    className="bg-background border-border/50"
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="grid gap-2">
                    <Label htmlFor="clase">Clase *</Label>
                    <Select
                      value={formData.clase}
                      onValueChange={(v) => setFormData({ ...formData, clase: v as ClaseFlota })}
                    >
                      <SelectTrigger className="bg-background border-border/50">
                        <SelectValue placeholder="Seleccionar" />
                      </SelectTrigger>
                      <SelectContent className="bg-card border-border">
                        {clasesFlota.map((clase) => (
                          <SelectItem key={clase.value} value={clase.value}>
                            {clase.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="familia">Familia *</Label>
                    <Select
                      value={formData.familia}
                      onValueChange={(v) => setFormData({ ...formData, familia: v as FamiliaFlota })}
                    >
                      <SelectTrigger className="bg-background border-border/50">
                        <SelectValue placeholder="Seleccionar" />
                      </SelectTrigger>
                      <SelectContent className="bg-card border-border">
                        {familiasFlota.map((familia) => (
                          <SelectItem key={familia.value} value={familia.value}>
                            {familia.icon} {familia.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="grid gap-2">
                    <Label htmlFor="placa">Placa / Credencial</Label>
                    <Input
                      id="placa"
                      placeholder="ABC-123"
                      value={formData.placa}
                      onChange={(e) => setFormData({ ...formData, placa: e.target.value })}
                      className="bg-background border-border/50"
                    />
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="marca">Marca</Label>
                    <Input
                      id="marca"
                      placeholder="Caterpillar"
                      value={formData.marca}
                      onChange={(e) => setFormData({ ...formData, marca: e.target.value })}
                      className="bg-background border-border/50"
                    />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="grid gap-2">
                    <Label htmlFor="modelo">Modelo</Label>
                    <Input
                      id="modelo"
                      placeholder="R1700"
                      value={formData.modelo}
                      onChange={(e) => setFormData({ ...formData, modelo: e.target.value })}
                      className="bg-background border-border/50"
                    />
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="anio">Año</Label>
                    <Input
                      id="anio"
                      type="number"
                      placeholder="2023"
                      value={formData.anio || ""}
                      onChange={(e) => setFormData({ ...formData, anio: parseInt(e.target.value) || undefined })}
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
                  onClick={handleCreateFlota}
                  disabled={crearFlotaMutation.isPending}
                  className="bg-primary text-primary-foreground"
                >
                  {crearFlotaMutation.isPending ? (
                    <>
                      <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                      Guardando...
                    </>
                  ) : (
                    "Crear Unidad"
                  )}
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
      </motion.div>

      {/* Mina selector + Filters */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, delay: 0.1 }}
        className="flex flex-col sm:flex-row gap-4"
      >
        <Select
          value={selectedMina?.toString() || ""}
          onValueChange={(v) => setSelectedMina(parseInt(v))}
        >
          <SelectTrigger className="w-[200px] bg-card border-border/50">
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
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            type="search"
            placeholder="Buscar por nombre, placa, marca..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10 bg-card border-border/50"
          />
        </div>
        <Select value={filterFamilia} onValueChange={setFilterFamilia}>
          <SelectTrigger className="w-[180px] bg-card border-border/50">
            <Filter className="h-4 w-4 mr-2" />
            <SelectValue placeholder="Familia" />
          </SelectTrigger>
          <SelectContent className="bg-card border-border">
            <SelectItem value="all">Todas las familias</SelectItem>
            {familiasFlota.map((familia) => (
              <SelectItem key={familia.value} value={familia.value}>
                {familia.icon} {familia.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </motion.div>

      {/* No mina selected */}
      {!selectedMina && (
        <div className="flex flex-col items-center justify-center h-[40vh] space-y-4">
          <Truck className="h-16 w-16 text-muted-foreground/50" />
          <h2 className="text-xl font-semibold">Selecciona una mina</h2>
          <p className="text-muted-foreground text-center max-w-md">
            Primero debes seleccionar una mina para ver su flota
          </p>
        </div>
      )}

      {/* Empty state */}
      {selectedMina && filteredFlota.length === 0 && (
        <div className="flex flex-col items-center justify-center h-[40vh] space-y-4">
          <Truck className="h-16 w-16 text-muted-foreground/50" />
          <h2 className="text-xl font-semibold">No hay unidades registradas</h2>
          <p className="text-muted-foreground text-center max-w-md">
            {searchQuery || filterFamilia !== "all"
              ? "No se encontraron unidades con ese criterio"
              : "Registra tu primera unidad de flota"}
          </p>
          {!searchQuery && filterFamilia === "all" && (
            <Button onClick={() => setIsCreateDialogOpen(true)}>
              <Plus className="h-4 w-4 mr-2" />
              Registrar Primera Unidad
            </Button>
          )}
        </div>
      )}

      {/* Flota Grid */}
      {filteredFlota.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredFlota.map((unidad, index) => (
            <motion.div
              key={unidad.id_flota}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: index * 0.05 }}
            >
              <Card className="bg-card border-border/50 hover:border-primary/30 transition-all duration-300 group">
                <CardContent className="p-4">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center gap-3">
                      <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10 border border-primary/20 text-2xl">
                        {getFamiliaIcon(unidad.familia)}
                      </div>
                      <div>
                        <h3 className="font-bold text-lg">{unidad.nombre}</h3>
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
                          <Link href={`/flota/${unidad.id_flota}`}>
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
                      <span className="text-sm text-muted-foreground">Clase</span>
                      <Badge variant="outline">{getClaseLabel(unidad.clase)}</Badge>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-muted-foreground">Familia</span>
                      <span className="text-sm font-medium">{getFamiliaLabel(unidad.familia)}</span>
                    </div>
                    {unidad.placa_o_credencial && (
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-muted-foreground">Placa</span>
                        <Badge className="bg-blue-500/20 text-blue-400 border-blue-500/30">
                          {unidad.placa_o_credencial}
                        </Badge>
                      </div>
                    )}
                    {unidad.anio_fabricacion && (
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-muted-foreground">Año</span>
                        <span className="text-sm">{unidad.anio_fabricacion}</span>
                      </div>
                    )}
                  </div>

                  <Link href={`/flota/${unidad.id_flota}`}>
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
      )}

      {/* Fetching indicator */}
      {isFetching && !isLoading && (
        <div className="fixed bottom-4 right-4 bg-card border border-border rounded-lg px-4 py-2 shadow-lg flex items-center gap-2">
          <Loader2 className="h-4 w-4 animate-spin text-primary" />
          <span className="text-sm">Actualizando...</span>
        </div>
      )}
    </div>
  );
}
