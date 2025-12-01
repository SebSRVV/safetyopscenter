"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import {
  Users,
  Plus,
  Search,
  MoreVertical,
  Eye,
  Edit,
  Trash2,
  Loader2,
  RefreshCw,
  AlertCircle,
  Mountain,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Label } from "@/components/ui/label";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
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
import { useMinas, useTrabajadores, useCrearTrabajador } from "@/hooks/use-dashboard";
import { useToast } from "@/hooks/use-toast";

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
  const [selectedMina, setSelectedMina] = useState<number | null>(null);
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [formData, setFormData] = useState({
    nombre: "",
    doc: "",
    cargo: "",
    empresa: "",
  });

  const { toast } = useToast();
  const { data: minas } = useMinas();
  const { data: trabajadores, isLoading, error, refetch, isFetching } = useTrabajadores();
  const crearTrabajadorMutation = useCrearTrabajador();

  // Auto-select first mina
  if (!selectedMina && minas && minas.length > 0) {
    setSelectedMina(minas[0].id_mina);
  }

  const minaActual = minas?.find((m) => m.id_mina === selectedMina);

  // Filtrar trabajadores por empresa (mina)
  const filteredTrabajadores = (trabajadores || []).filter((trabajador) => {
    const matchesSearch =
      trabajador.nombre_completo?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      trabajador.doc_identidad?.includes(searchQuery) ||
      trabajador.cargo?.toLowerCase().includes(searchQuery.toLowerCase());
    
    // Filtrar por empresa si hay mina seleccionada
    const matchesMina = !minaActual || 
      trabajador.empresa_contratista?.toLowerCase().includes(minaActual.empresa?.toLowerCase() || "") ||
      trabajador.empresa_contratista?.toLowerCase().includes(minaActual.nombre?.toLowerCase() || "");
    
    return matchesSearch && matchesMina;
  });

  const handleCreateTrabajador = async () => {
    if (!formData.nombre || !formData.doc) {
      toast({
        title: "Error",
        description: "Nombre y documento son requeridos",
        variant: "destructive",
      });
      return;
    }

    try {
      await crearTrabajadorMutation.mutateAsync({
        ...formData,
        empresa: formData.empresa || minaActual?.empresa || "",
      });
      toast({
        title: "Trabajador creado",
        description: `${formData.nombre} ha sido registrado exitosamente`,
      });
      setIsCreateDialogOpen(false);
      setFormData({ nombre: "", doc: "", cargo: "", empresa: "" });
    } catch (err) {
      toast({
        title: "Error al crear trabajador",
        description: err instanceof Error ? err.message : "Error desconocido",
        variant: "destructive",
      });
    }
  };

  const handleRefresh = () => {
    refetch();
    toast({
      title: "Actualizando",
      description: "Cargando trabajadores desde Supabase...",
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
        <Skeleton className="h-10 w-64" />
        <Card className="bg-card border-border/50">
          <CardContent className="p-4">
            {[1, 2, 3, 4, 5].map((i) => (
              <div key={i} className="flex items-center gap-4 py-3">
                <Skeleton className="h-10 w-10 rounded-full" />
                <Skeleton className="h-4 w-32" />
                <Skeleton className="h-4 w-24" />
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
        <h2 className="text-xl font-semibold">Error al cargar trabajadores</h2>
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
          <h1 className="text-3xl font-bold text-foreground">Trabajadores</h1>
          <p className="text-muted-foreground mt-1">
            {minaActual?.nombre || "Todas las minas"} - Personal registrado ({filteredTrabajadores.length})
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
                Nuevo Trabajador
              </Button>
            </DialogTrigger>
            <DialogContent className="bg-card border-border max-w-lg">
              <DialogHeader>
                <DialogTitle>Registrar Nuevo Trabajador</DialogTitle>
                <DialogDescription>
                  Los datos se guardarán en Supabase
                </DialogDescription>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <div className="grid gap-2">
                  <Label htmlFor="nombre">Nombre Completo *</Label>
                  <Input
                    id="nombre"
                    placeholder="Juan Pérez García"
                    value={formData.nombre}
                    onChange={(e) => setFormData({ ...formData, nombre: e.target.value })}
                    className="bg-background border-border/50"
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="doc">Documento de Identidad *</Label>
                  <Input
                    id="doc"
                    placeholder="12345678"
                    value={formData.doc}
                    onChange={(e) => setFormData({ ...formData, doc: e.target.value })}
                    className="bg-background border-border/50"
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="cargo">Cargo</Label>
                  <Input
                    id="cargo"
                    placeholder="Operador de Scooptram"
                    value={formData.cargo}
                    onChange={(e) => setFormData({ ...formData, cargo: e.target.value })}
                    className="bg-background border-border/50"
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="empresa">Empresa</Label>
                  <Input
                    id="empresa"
                    placeholder={minaActual?.empresa || "Empresa contratista"}
                    value={formData.empresa}
                    onChange={(e) => setFormData({ ...formData, empresa: e.target.value })}
                    className="bg-background border-border/50"
                  />
                </div>
              </div>
              <DialogFooter>
                <Button variant="outline" onClick={() => setIsCreateDialogOpen(false)}>
                  Cancelar
                </Button>
                <Button
                  onClick={handleCreateTrabajador}
                  disabled={crearTrabajadorMutation.isPending}
                  className="bg-primary text-primary-foreground"
                >
                  {crearTrabajadorMutation.isPending ? (
                    <>
                      <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                      Guardando...
                    </>
                  ) : (
                    "Crear Trabajador"
                  )}
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
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
            placeholder="Buscar por nombre, documento o cargo..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10 bg-card border-border/50"
          />
        </div>
      </motion.div>

      {/* Empty state */}
      {filteredTrabajadores.length === 0 && (
        <div className="flex flex-col items-center justify-center h-[40vh] space-y-4">
          <Users className="h-16 w-16 text-muted-foreground/50" />
          <h2 className="text-xl font-semibold">No hay trabajadores registrados</h2>
          <p className="text-muted-foreground text-center max-w-md">
            {searchQuery
              ? "No se encontraron trabajadores con ese criterio"
              : "Registra tu primer trabajador"}
          </p>
          {!searchQuery && (
            <Button onClick={() => setIsCreateDialogOpen(true)}>
              <Plus className="h-4 w-4 mr-2" />
              Registrar Primer Trabajador
            </Button>
          )}
        </div>
      )}

      {/* Table */}
      {filteredTrabajadores.length > 0 && (
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
                    <TableHead>Documento</TableHead>
                    <TableHead>Cargo</TableHead>
                    <TableHead>Empresa</TableHead>
                    <TableHead className="text-right">Acciones</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredTrabajadores.map((trabajador) => (
                    <TableRow key={trabajador.id_trabajador} className="border-border/50">
                      <TableCell>
                        <div className="flex items-center gap-3">
                          <Avatar className="h-9 w-9 border border-primary/20">
                            <AvatarFallback className="bg-primary/10 text-primary text-sm">
                              {getInitials(trabajador.nombre_completo || "NN")}
                            </AvatarFallback>
                          </Avatar>
                          <span className="font-medium">{trabajador.nombre_completo}</span>
                        </div>
                      </TableCell>
                      <TableCell className="font-mono text-sm">
                        {trabajador.doc_identidad || "-"}
                      </TableCell>
                      <TableCell>
                        <Badge variant="outline">{trabajador.cargo || "Sin cargo"}</Badge>
                      </TableCell>
                      <TableCell className="text-muted-foreground">
                        {trabajador.empresa_contratista || "-"}
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
