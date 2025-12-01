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
  RefreshCw,
  AlertCircle,
  Radio,
  Gauge,
  Camera,
  CircleDot,
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
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useMinas, useDispositivos, useCrearDispositivo } from "@/hooks/use-dashboard";
import { useToast } from "@/hooks/use-toast";
import { TipoDispositivo } from "@/lib/rpc/dispositivos";
import { Mountain } from "lucide-react";

const tiposDispositivo: { value: TipoDispositivo; label: string; icon: typeof Cpu }[] = [
  { value: "gps", label: "GPS", icon: MapPin },
  { value: "semaforo", label: "Semáforo", icon: CircleDot },
  { value: "velocimetro", label: "Velocímetro", icon: Gauge },
  { value: "proximidad", label: "Sensor Proximidad", icon: Radio },
  { value: "camara", label: "Cámara", icon: Camera },
  { value: "sensor_gas", label: "Sensor de Gas", icon: Cpu },
];

const getTipoIcon = (tipo: string) => {
  const tipoInfo = tiposDispositivo.find((t) => t.value === tipo);
  const Icon = tipoInfo?.icon || Cpu;
  return <Icon className="h-4 w-4" />;
};

const getTipoLabel = (tipo: string) => {
  return tiposDispositivo.find((t) => t.value === tipo)?.label || tipo;
};

export default function DispositivosPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [filterTipo, setFilterTipo] = useState<string>("all");
  const [selectedMina, setSelectedMina] = useState<number | null>(null);
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [formData, setFormData] = useState({
    codigo: "",
    tipo: "" as TipoDispositivo,
    marca: "",
  });

  const { toast } = useToast();
  const { data: minas } = useMinas();
  const { data: dispositivos, isLoading, error, refetch, isFetching } = useDispositivos();
  const crearDispositivoMutation = useCrearDispositivo();

  // Auto-select first mina
  if (!selectedMina && minas && minas.length > 0) {
    setSelectedMina(minas[0].id_mina);
  }

  const minaActual = minas?.find((m) => m.id_mina === selectedMina);

  const filteredDispositivos = (dispositivos || []).filter((dispositivo) => {
    const matchesSearch = dispositivo.codigo.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesTipo = filterTipo === "all" || dispositivo.tipo === filterTipo;
    return matchesSearch && matchesTipo;
  });

  const handleCreateDispositivo = async () => {
    if (!formData.codigo || !formData.tipo) {
      toast({
        title: "Error",
        description: "Código y tipo son requeridos",
        variant: "destructive",
      });
      return;
    }

    try {
      await crearDispositivoMutation.mutateAsync(formData);
      toast({
        title: "Dispositivo creado",
        description: `${formData.codigo} ha sido registrado exitosamente`,
      });
      setIsCreateDialogOpen(false);
      setFormData({ codigo: "", tipo: "" as TipoDispositivo, marca: "" });
    } catch (err) {
      toast({
        title: "Error al crear dispositivo",
        description: err instanceof Error ? err.message : "Error desconocido",
        variant: "destructive",
      });
    }
  };

  const handleRefresh = () => {
    refetch();
    toast({
      title: "Actualizando",
      description: "Cargando dispositivos desde Supabase...",
    });
  };

  // Loading skeleton
  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <div>
            <Skeleton className="h-8 w-48 mb-2" />
            <Skeleton className="h-4 w-64" />
          </div>
          <Skeleton className="h-10 w-40" />
        </div>
        <div className="flex gap-4">
          <Skeleton className="h-10 w-64" />
          <Skeleton className="h-10 w-40" />
        </div>
        <Card className="bg-card border-border/50">
          <CardContent className="p-4">
            {[1, 2, 3, 4, 5].map((i) => (
              <div key={i} className="flex items-center gap-4 py-3">
                <Skeleton className="h-9 w-9 rounded-lg" />
                <Skeleton className="h-4 w-24" />
                <Skeleton className="h-4 w-20" />
                <Skeleton className="h-4 w-32" />
              </div>
            ))}
          </CardContent>
        </Card>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="flex flex-col items-center justify-center h-[50vh] space-y-4">
        <AlertCircle className="h-16 w-16 text-destructive" />
        <h2 className="text-xl font-semibold">Error al cargar dispositivos</h2>
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
          <h1 className="text-3xl font-bold text-foreground">Dispositivos IoT</h1>
          <p className="text-muted-foreground mt-1">
            {minaActual?.nombre || "Todas las minas"} - Sensores y equipos ({filteredDispositivos.length})
          </p>
        </div>
        <div className="flex gap-2">
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
            disabled={isFetching}
            className="border-border/50"
          >
            <RefreshCw className={`h-4 w-4 mr-2 ${isFetching ? "animate-spin" : ""}`} />
            Actualizar
          </Button>
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
                  Los datos se guardarán en Supabase
                </DialogDescription>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <div className="grid gap-2">
                  <Label htmlFor="codigo">Código *</Label>
                  <Input
                    id="codigo"
                    placeholder="GPS-001"
                    value={formData.codigo}
                    onChange={(e) => setFormData({ ...formData, codigo: e.target.value })}
                    className="bg-background border-border/50"
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="tipo">Tipo *</Label>
                  <Select
                    value={formData.tipo}
                    onValueChange={(v) => setFormData({ ...formData, tipo: v as TipoDispositivo })}
                  >
                    <SelectTrigger className="bg-background border-border/50">
                      <SelectValue placeholder="Seleccionar tipo" />
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
                <div className="grid gap-2">
                  <Label htmlFor="marca">Marca / Modelo</Label>
                  <Input
                    id="marca"
                    placeholder="Trimble R12i"
                    value={formData.marca}
                    onChange={(e) => setFormData({ ...formData, marca: e.target.value })}
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
                  disabled={crearDispositivoMutation.isPending}
                  className="bg-primary text-primary-foreground"
                >
                  {crearDispositivoMutation.isPending ? (
                    <>
                      <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                      Guardando...
                    </>
                  ) : (
                    "Crear Dispositivo"
                  )}
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
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
            placeholder="Buscar por código..."
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
      </motion.div>

      {/* Empty state */}
      {filteredDispositivos.length === 0 && (
        <div className="flex flex-col items-center justify-center h-[40vh] space-y-4">
          <Cpu className="h-16 w-16 text-muted-foreground/50" />
          <h2 className="text-xl font-semibold">No hay dispositivos registrados</h2>
          <p className="text-muted-foreground text-center max-w-md">
            {searchQuery || filterTipo !== "all"
              ? "No se encontraron dispositivos con ese criterio"
              : "Registra tu primer dispositivo IoT"}
          </p>
          {!searchQuery && filterTipo === "all" && (
            <Button onClick={() => setIsCreateDialogOpen(true)}>
              <Plus className="h-4 w-4 mr-2" />
              Registrar Primer Dispositivo
            </Button>
          )}
        </div>
      )}

      {/* Table */}
      {filteredDispositivos.length > 0 && (
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
                    <TableHead>Asignado a Flota</TableHead>
                    <TableHead>Asignado a Lugar</TableHead>
                    <TableHead className="text-right">Acciones</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredDispositivos.map((dispositivo) => (
                    <TableRow key={dispositivo.id_dispositivo} className="border-border/50">
                      <TableCell>
                        <div className="flex items-center gap-3">
                          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary/10 border border-primary/20">
                            {getTipoIcon(dispositivo.tipo)}
                          </div>
                          <span className="font-medium">{dispositivo.codigo}</span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge variant="outline">{getTipoLabel(dispositivo.tipo)}</Badge>
                      </TableCell>
                      <TableCell>
                        {dispositivo.id_flota ? (
                          <div className="flex items-center gap-1">
                            <Truck className="h-3 w-3 text-blue-400" />
                            <span>Flota #{dispositivo.id_flota}</span>
                          </div>
                        ) : (
                          <span className="text-muted-foreground">-</span>
                        )}
                      </TableCell>
                      <TableCell>
                        {dispositivo.id_lugar ? (
                          <div className="flex items-center gap-1">
                            <MapPin className="h-3 w-3 text-purple-400" />
                            <span>Lugar #{dispositivo.id_lugar}</span>
                          </div>
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
