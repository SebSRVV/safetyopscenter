"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import {
  AlertTriangle,
  Search,
  Bell,
  CheckCircle,
  Clock,
  Eye,
  RefreshCw,
  Loader2,
  Mountain,
  Plus,
  X,
  AlertCircle,
  Shield,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
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
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useAlarmas, useCrearAlarma } from "@/hooks/use-alarmas";
import { useToast } from "@/hooks/use-toast";

const tipoEventoColors = {
  emergencia: "bg-red-500 text-white",
  alarma: "bg-orange-500 text-white",
  advertencia: "bg-yellow-500 text-white",
  informativo: "bg-blue-500 text-white",
};

const severidadColors = {
  5: "bg-red-600 text-white",
  4: "bg-red-500 text-white",
  3: "bg-orange-500 text-white",
  2: "bg-yellow-500 text-white",
  1: "bg-blue-500 text-white",
};

const estadoColors = {
  activo: "bg-red-100 text-red-800",
  revisado: "bg-yellow-100 text-yellow-800",
  resuelto: "bg-green-100 text-green-800",
  falso_positivo: "bg-gray-100 text-gray-800",
};

export default function AlarmasPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [filterTipo, setFilterTipo] = useState<string>("all");
  const [filterSeveridad, setFilterSeveridad] = useState<string>("all");
  const [filterEstado, setFilterEstado] = useState<string>("all");
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [selectedAlarma, setSelectedAlarma] = useState<any>(null);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
  
  const { alarmas, loading, error, refetch } = useAlarmas({
    tipo: filterTipo !== "all" ? filterTipo : undefined,
    severidad: filterSeveridad !== "all" ? parseInt(filterSeveridad) : undefined,
    estado: filterEstado !== "all" ? filterEstado : undefined,
  });
  
  const { crearAlarma, actualizarAlarma, eliminarAlarma, loading: loadingAction } = useCrearAlarma();
  const { toast } = useToast();

  const [formData, setFormData] = useState({
    tipo_evento: "",
    categoria: "",
    descripcion: "",
    severidad: 1,
    id_dispositivo: "",
    id_flota: "",
    id_lugar: "",
    id_trabajador: "",
    latitud: "",
    longitud: "",
    altitud_metros: "",
    datos_adicionales: "",
  });

  const handleCrearAlarma = async () => {
    try {
      await crearAlarma({
        ...formData,
        severidad: parseInt(formData.severidad.toString()),
        id_dispositivo: formData.id_dispositivo ? parseInt(formData.id_dispositivo) : undefined,
        id_flota: formData.id_flota ? parseInt(formData.id_flota) : undefined,
        id_lugar: formData.id_lugar ? parseInt(formData.id_lugar) : undefined,
        id_trabajador: formData.id_trabajador ? parseInt(formData.id_trabajador) : undefined,
        latitud: formData.latitud ? parseFloat(formData.latitud) : undefined,
        longitud: formData.longitud ? parseFloat(formData.longitud) : undefined,
        altitud_metros: formData.altitud_metros ? parseInt(formData.altitud_metros) : undefined,
        datos_adicionales: formData.datos_adicionales ? JSON.parse(formData.datos_adicionales) : undefined,
      });

      toast({
        title: "Alarma creada",
        description: "La alarma ha sido creada exitosamente",
      });
      
      setIsCreateModalOpen(false);
      setFormData({
        tipo_evento: "",
        categoria: "",
        descripcion: "",
        severidad: 1,
        id_dispositivo: "",
        id_flota: "",
        id_lugar: "",
        id_trabajador: "",
        latitud: "",
        longitud: "",
        altitud_metros: "",
        datos_adicionales: "",
      });
      refetch();
    } catch (error) {
      toast({
        title: "Error",
        description: "No se pudo crear la alarma",
        variant: "destructive",
      });
    }
  };

  const handleReconocer = async (id: number) => {
    try {
      await actualizarAlarma(id, "reconocer");
      toast({
        title: "Alarma reconocida",
        description: "La alarma ha sido marcada como revisada",
      });
      refetch();
    } catch (error) {
      toast({
        title: "Error",
        description: "No se pudo reconocer la alarma",
        variant: "destructive",
      });
    }
  };

  const handleResolver = async (id: number, observaciones: string) => {
    try {
      await actualizarAlarma(id, "resolver", { observaciones_resolucion: observaciones });
      toast({
        title: "Alarma resuelta",
        description: "La alarma ha sido marcada como resuelta",
      });
      refetch();
    } catch (error) {
      toast({
        title: "Error",
        description: "No se pudo resolver la alarma",
        variant: "destructive",
      });
    }
  };

  const handleEliminar = async (id: number) => {
    try {
      await eliminarAlarma(id);
      toast({
        title: "Alarma eliminada",
        description: "La alarma ha sido eliminada exitosamente",
      });
      refetch();
    } catch (error) {
      toast({
        title: "Error",
        description: "No se pudo eliminar la alarma",
        variant: "destructive",
      });
    }
  };

  const filteredAlarmas = alarmas.filter((alarma) =>
    alarma.descripcion.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (error) {
    return (
      <div className="container mx-auto px-6 py-8">
        <Card className="border-red-200 bg-red-50">
          <CardContent className="pt-6">
            <div className="flex items-center space-x-2 text-red-600">
              <AlertCircle className="h-5 w-5" />
              <span className="font-medium">Error al cargar las alarmas</span>
            </div>
            <p className="text-red-600 mt-2">{error}</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-6 py-8 space-y-8">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4"
      >
        <div>
          <h1 className="text-3xl font-bold text-foreground flex items-center gap-3">
            <Bell className="h-8 w-8 text-orange-500" />
            Gestión de Alarmas
          </h1>
          <p className="text-muted-foreground mt-1">
            Monitorea y gestiona todas las alarmas y eventos del sistema
          </p>
        </div>
        <div className="flex items-center gap-3">
          <Button
            onClick={() => refetch()}
            variant="outline"
            size="sm"
            disabled={loading}
          >
            <RefreshCw className={`h-4 w-4 mr-2 ${loading ? 'animate-spin' : ''}`} />
            Actualizar
          </Button>
          <Dialog open={isCreateModalOpen} onOpenChange={setIsCreateModalOpen}>
            <DialogTrigger asChild>
              <Button size="sm">
                <Plus className="h-4 w-4 mr-2" />
                Nueva Alarma
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[600px]">
              <DialogHeader>
                <DialogTitle>Crear Nueva Alarma</DialogTitle>
                <DialogDescription>
                  Registra una nueva alarma en el sistema
                </DialogDescription>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="tipo_evento">Tipo de Evento</Label>
                    <Select value={formData.tipo_evento} onValueChange={(value) => setFormData({...formData, tipo_evento: value})}>
                      <SelectTrigger>
                        <SelectValue placeholder="Seleccionar tipo" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="emergencia">Emergencia</SelectItem>
                        <SelectItem value="alarma">Alarma</SelectItem>
                        <SelectItem value="advertencia">Advertencia</SelectItem>
                        <SelectItem value="informativo">Informativo</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label htmlFor="severidad">Severidad</Label>
                    <Select value={formData.severidad.toString()} onValueChange={(value) => setFormData({...formData, severidad: parseInt(value)})}>
                      <SelectTrigger>
                        <SelectValue placeholder="Seleccionar severidad" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="1">1 - Muy Baja</SelectItem>
                        <SelectItem value="2">2 - Baja</SelectItem>
                        <SelectItem value="3">3 - Media</SelectItem>
                        <SelectItem value="4">4 - Alta</SelectItem>
                        <SelectItem value="5">5 - Crítica</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <div>
                  <Label htmlFor="categoria">Categoría</Label>
                  <Input
                    id="categoria"
                    value={formData.categoria}
                    onChange={(e) => setFormData({...formData, categoria: e.target.value})}
                    placeholder="Ej: Seguridad, Operación, Mantenimiento"
                  />
                </div>
                <div>
                  <Label htmlFor="descripcion">Descripción</Label>
                  <Textarea
                    id="descripcion"
                    value={formData.descripcion}
                    onChange={(e) => setFormData({...formData, descripcion: e.target.value})}
                    placeholder="Describe la alarma en detalle"
                    rows={3}
                  />
                </div>
                <div className="grid grid-cols-3 gap-4">
                  <div>
                    <Label htmlFor="latitud">Latitud</Label>
                    <Input
                      id="latitud"
                      value={formData.latitud}
                      onChange={(e) => setFormData({...formData, latitud: e.target.value})}
                      placeholder="-12.0464"
                    />
                  </div>
                  <div>
                    <Label htmlFor="longitud">Longitud</Label>
                    <Input
                      id="longitud"
                      value={formData.longitud}
                      onChange={(e) => setFormData({...formData, longitud: e.target.value})}
                      placeholder="-77.0428"
                    />
                  </div>
                  <div>
                    <Label htmlFor="altitud">Altitud (m)</Label>
                    <Input
                      id="altitud"
                      value={formData.altitud_metros}
                      onChange={(e) => setFormData({...formData, altitud_metros: e.target.value})}
                      placeholder="2700"
                    />
                  </div>
                </div>
              </div>
              <DialogFooter>
                <Button variant="outline" onClick={() => setIsCreateModalOpen(false)}>
                  Cancelar
                </Button>
                <Button onClick={handleCrearAlarma} disabled={loadingAction}>
                  {loadingAction ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Creando...
                    </>
                  ) : (
                    "Crear Alarma"
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
        transition={{ delay: 0.1 }}
        className="flex flex-wrap gap-4 items-center p-4 bg-card rounded-lg border border-border/50"
      >
        <div className="flex-1 min-w-[200px]">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Buscar alarmas..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
        </div>
        <Select value={filterTipo} onValueChange={setFilterTipo}>
          <SelectTrigger className="w-[150px]">
            <SelectValue placeholder="Tipo" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Todos los tipos</SelectItem>
            <SelectItem value="emergencia">Emergencia</SelectItem>
            <SelectItem value="alarma">Alarma</SelectItem>
            <SelectItem value="advertencia">Advertencia</SelectItem>
            <SelectItem value="informativo">Informativo</SelectItem>
          </SelectContent>
        </Select>
        <Select value={filterSeveridad} onValueChange={setFilterSeveridad}>
          <SelectTrigger className="w-[150px]">
            <SelectValue placeholder="Severidad" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Todas las severidades</SelectItem>
            <SelectItem value="5">5 - Crítica</SelectItem>
            <SelectItem value="4">4 - Alta</SelectItem>
            <SelectItem value="3">3 - Media</SelectItem>
            <SelectItem value="2">2 - Baja</SelectItem>
            <SelectItem value="1">1 - Muy Baja</SelectItem>
          </SelectContent>
        </Select>
        <Select value={filterEstado} onValueChange={setFilterEstado}>
          <SelectTrigger className="w-[150px]">
            <SelectValue placeholder="Estado" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Todos los estados</SelectItem>
            <SelectItem value="activo">Activo</SelectItem>
            <SelectItem value="revisado">Revisado</SelectItem>
            <SelectItem value="resuelto">Resuelto</SelectItem>
            <SelectItem value="falso_positivo">Falso Positivo</SelectItem>
          </SelectContent>
        </Select>
      </motion.div>

      {/* Stats Cards */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="grid grid-cols-1 md:grid-cols-4 gap-6"
      >
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Alarmas</p>
                <p className="text-2xl font-bold">{alarmas.length}</p>
              </div>
              <Bell className="h-8 w-8 text-orange-500" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Activas</p>
                <p className="text-2xl font-bold text-red-600">
                  {alarmas.filter(a => a.estado === 'activo').length}
                </p>
              </div>
              <AlertTriangle className="h-8 w-8 text-red-500" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Resueltas</p>
                <p className="text-2xl font-bold text-green-600">
                  {alarmas.filter(a => a.estado === 'resuelto').length}
                </p>
              </div>
              <CheckCircle className="h-8 w-8 text-green-500" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Críticas</p>
                <p className="text-2xl font-bold text-red-600">
                  {alarmas.filter(a => a.severidad >= 4).length}
                </p>
              </div>
              <Shield className="h-8 w-8 text-red-500" />
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Alarmas Table */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="bg-card rounded-lg border border-border/50"
      >
        <div className="p-6">
          <h2 className="text-lg font-semibold text-foreground mb-4">Alarmas Recientes</h2>
          {loading ? (
            <div className="space-y-4">
              {[...Array(5)].map((_, i) => (
                <div key={i} className="flex items-center space-x-4 p-4 border border-border/50 rounded-lg">
                  <Skeleton className="h-4 w-4" />
                  <div className="space-y-2 flex-1">
                    <Skeleton className="h-4 w-1/4" />
                    <Skeleton className="h-3 w-1/2" />
                  </div>
                  <Skeleton className="h-8 w-20" />
                </div>
              ))}
            </div>
          ) : (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Tipo</TableHead>
                    <TableHead>Descripción</TableHead>
                    <TableHead>Severidad</TableHead>
                    <TableHead>Estado</TableHead>
                    <TableHead>Fecha</TableHead>
                    <TableHead>Acciones</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredAlarmas.map((alarma) => (
                    <TableRow key={alarma.id_evento} className="hover:bg-muted/50">
                      <TableCell>
                        <Badge className={tipoEventoColors[alarma.tipo_evento as keyof typeof tipoEventoColors]}>
                          {alarma.tipo_evento}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <div>
                          <p className="font-medium">{alarma.descripcion}</p>
                          <p className="text-sm text-muted-foreground">{alarma.categoria}</p>
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge className={severidadColors[alarma.severidad as keyof typeof severidadColors]}>
                          {alarma.severidad}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <Badge className={estadoColors[alarma.estado as keyof typeof estadoColors]}>
                          {alarma.estado}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <div className="text-sm text-muted-foreground">
                          {new Date(alarma.creado_en).toLocaleString()}
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center space-x-2">
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => {
                              setSelectedAlarma(alarma);
                              setIsDetailModalOpen(true);
                            }}
                          >
                            <Eye className="h-4 w-4" />
                          </Button>
                          {alarma.estado === 'activo' && (
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => handleReconocer(alarma.id_evento)}
                            >
                              <CheckCircle className="h-4 w-4" />
                            </Button>
                          )}
                          {(alarma.estado === 'activo' || alarma.estado === 'revisado') && (
                            <Button
                              size="sm"
                              onClick={() => handleResolver(alarma.id_evento, "Resuelto por operador")}
                            >
                              <CheckCircle className="h-4 w-4" />
                            </Button>
                          )}
                          <Button
                            size="sm"
                            variant="destructive"
                            onClick={() => handleEliminar(alarma.id_evento)}
                          >
                            <X className="h-4 w-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </div>
      </motion.div>

      {/* Detail Modal */}
      <Dialog open={isDetailModalOpen} onOpenChange={setIsDetailModalOpen}>
        <DialogContent className="sm:max-w-[800px]">
          <DialogHeader>
            <DialogTitle>Detalles de la Alarma</DialogTitle>
            <DialogDescription>
              Información completa de la alarma seleccionada
            </DialogDescription>
          </DialogHeader>
          {selectedAlarma && (
            <div className="space-y-6">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label className="text-sm font-medium text-muted-foreground">Tipo</Label>
                  <Badge className={tipoEventoColors[selectedAlarma.tipo_evento as keyof typeof tipoEventoColors]}>
                    {selectedAlarma.tipo_evento}
                  </Badge>
                </div>
                <div>
                  <Label className="text-sm font-medium text-muted-foreground">Severidad</Label>
                  <Badge className={severidadColors[selectedAlarma.severidad as keyof typeof severidadColors]}>
                    {selectedAlarma.severidad}
                  </Badge>
                </div>
                <div>
                  <Label className="text-sm font-medium text-muted-foreground">Estado</Label>
                  <Badge className={estadoColors[selectedAlarma.estado as keyof typeof estadoColors]}>
                    {selectedAlarma.estado}
                  </Badge>
                </div>
                <div>
                  <Label className="text-sm font-medium text-muted-foreground">Categoría</Label>
                  <p className="text-sm">{selectedAlarma.categoria}</p>
                </div>
              </div>
              <div>
                <Label className="text-sm font-medium text-muted-foreground">Descripción</Label>
                <p className="text-sm">{selectedAlarma.descripcion}</p>
              </div>
              <div className="grid grid-cols-3 gap-4">
                {selectedAlarma.latitud && (
                  <div>
                    <Label className="text-sm font-medium text-muted-foreground">Latitud</Label>
                    <p className="text-sm">{selectedAlarma.latitud}</p>
                  </div>
                )}
                {selectedAlarma.longitud && (
                  <div>
                    <Label className="text-sm font-medium text-muted-foreground">Longitud</Label>
                    <p className="text-sm">{selectedAlarma.longitud}</p>
                  </div>
                )}
                {selectedAlarma.altitud_metros && (
                  <div>
                    <Label className="text-sm font-medium text-muted-foreground">Altitud</Label>
                    <p className="text-sm">{selectedAlarma.altitud_metros} m</p>
                  </div>
                )}
              </div>
              {selectedAlarma.datos_adicionales && (
                <div>
                  <Label className="text-sm font-medium text-muted-foreground">Datos Adicionales</Label>
                  <pre className="text-xs bg-muted p-2 rounded overflow-x-auto">
                    {JSON.stringify(selectedAlarma.datos_adicionales, null, 2)}
                  </pre>
                </div>
              )}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label className="text-sm font-medium text-muted-foreground">Fecha Creación</Label>
                  <p className="text-sm">{new Date(selectedAlarma.creado_en).toLocaleString()}</p>
                </div>
                {selectedAlarma.fecha_resolucion && (
                  <div>
                    <Label className="text-sm font-medium text-muted-foreground">Fecha Resolución</Label>
                    <p className="text-sm">{new Date(selectedAlarma.fecha_resolucion).toLocaleString()}</p>
                  </div>
                )}
              </div>
              {selectedAlarma.observaciones_resolucion && (
                <div>
                  <Label className="text-sm font-medium text-muted-foreground">Observaciones de Resolución</Label>
                  <p className="text-sm">{selectedAlarma.observaciones_resolucion}</p>
                </div>
              )}
            </div>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDetailModalOpen(false)}>
              Cerrar
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
