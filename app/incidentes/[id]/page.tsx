"use client";

import { useState } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { motion } from "framer-motion";
import { FileWarning, ArrowLeft, Edit, MapPin, User, Truck, Calendar, Clock, MessageSquare, Send } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";
import { MiningMap } from "@/components/maps/mining-map";

const incidenteData = {
  id: "1",
  tipo: "cuasi_accidente",
  severidad: "moderado",
  titulo: "Frenado brusco por vehiculo en cruce",
  descripcion: "El camion CAM-003 tuvo que realizar un frenado de emergencia al detectar un vehiculo liviano que ingreso al cruce sin respetar la senalizacion del semaforo.",
  fecha: "2024-01-15 10:30:00",
  unidad: "CAM-003",
  mina: "Mina Norte",
  lugar: "Cruce Principal",
  latitud: -23.6509,
  longitud: -70.3975,
  estado: "en_investigacion",
  trabajador: { nombre: "Juan Perez", cargo: "Operador de Camion", rut: "12.345.678-9" },
  danos: "Sin danos materiales ni personales reportados.",
  causaProbable: "Falta de atencion del conductor del vehiculo liviano a la senalizacion del semaforo.",
  accionesCorrectivas: "Se reforzara la senalizacion en el cruce y se realizara una charla de seguridad.",
};

const timelineData = [
  { id: "1", tipo: "creacion", descripcion: "Incidente reportado por Juan Perez", usuario: "Juan Perez", fecha: "2024-01-15 10:35:00" },
  { id: "2", tipo: "cambio_estado", descripcion: "Estado cambiado a En Investigacion", usuario: "Supervisor Maria Gonzalez", fecha: "2024-01-15 11:00:00" },
  { id: "3", tipo: "comentario", descripcion: "Se revisaron las camaras del cruce. Se confirma que el vehiculo liviano no respeto el semaforo.", usuario: "Supervisor Maria Gonzalez", fecha: "2024-01-15 14:30:00" },
];

const getTipoBadge = (tipo: string) => {
  const tipos: Record<string, { label: string; className: string }> = {
    accidente: { label: "Accidente", className: "bg-red-500/20 text-red-400 border-red-500/30" },
    cuasi_accidente: { label: "Cuasi Accidente", className: "bg-orange-500/20 text-orange-400 border-orange-500/30" },
  };
  const info = tipos[tipo] || { label: tipo, className: "" };
  return <Badge className={info.className}>{info.label}</Badge>;
};

const getSeveridadBadge = (severidad: string) => {
  switch (severidad) {
    case "grave": return <Badge className="bg-red-500/20 text-red-400 border-red-500/30">Grave</Badge>;
    case "moderado": return <Badge className="bg-yellow-500/20 text-yellow-400 border-yellow-500/30">Moderado</Badge>;
    case "leve": return <Badge className="bg-blue-500/20 text-blue-400 border-blue-500/30">Leve</Badge>;
    default: return <Badge variant="outline">{severidad}</Badge>;
  }
};

const getEstadoBadge = (estado: string) => {
  switch (estado) {
    case "reportado": return <Badge className="bg-yellow-500/20 text-yellow-400 border-yellow-500/30">Reportado</Badge>;
    case "en_investigacion": return <Badge className="bg-blue-500/20 text-blue-400 border-blue-500/30">En Investigacion</Badge>;
    case "cerrado": return <Badge className="bg-emerald-500/20 text-emerald-400 border-emerald-500/30">Cerrado</Badge>;
    default: return <Badge variant="outline">{estado}</Badge>;
  }
};

const getTimelineIcon = (tipo: string) => {
  switch (tipo) {
    case "creacion": return "bg-emerald-500";
    case "cambio_estado": return "bg-blue-500";
    case "comentario": return "bg-purple-500";
    default: return "bg-gray-500";
  }
};

export default function IncidenteDetailPage() {
  const params = useParams();
  const [newComment, setNewComment] = useState("");

  const mapMarkers = [{
    id: "incidente",
    position: [incidenteData.latitud, incidenteData.longitud] as [number, number],
    type: "alarma" as const,
    name: "Ubicacion del Incidente",
    status: "critical" as const,
    details: incidenteData.lugar,
  }];

  return (
    <div className="space-y-6">
      <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3 }}>
        <Link href="/incidentes">
          <Button variant="ghost" className="mb-4 text-muted-foreground hover:text-foreground">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Volver a Incidentes
          </Button>
        </Link>

        <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
          <div className="flex items-start gap-4">
            <div className="flex h-14 w-14 items-center justify-center rounded-xl bg-orange-500/10 border border-orange-500/20">
              <FileWarning className="h-7 w-7 text-orange-500" />
            </div>
            <div>
              <div className="flex items-center gap-2 mb-1">
                {getTipoBadge(incidenteData.tipo)}
                {getSeveridadBadge(incidenteData.severidad)}
                {getEstadoBadge(incidenteData.estado)}
              </div>
              <h1 className="text-2xl font-bold text-foreground">{incidenteData.titulo}</h1>
              <p className="text-muted-foreground mt-1">ID: #{incidenteData.id} - Reportado el {new Date(incidenteData.fecha).toLocaleDateString("es-CL")}</p>
            </div>
          </div>
          <Button variant="outline" className="border-border/50"><Edit className="h-4 w-4 mr-2" />Editar</Button>
        </div>
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <Card className="bg-card border-border/50">
            <CardHeader><CardTitle>Descripcion del Incidente</CardTitle></CardHeader>
            <CardContent><p className="text-muted-foreground leading-relaxed">{incidenteData.descripcion}</p></CardContent>
          </Card>

          <Card className="bg-card border-border/50">
            <CardHeader><CardTitle>Detalles</CardTitle></CardHeader>
            <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="p-4 rounded-lg bg-muted/30 border border-border/30">
                <p className="text-sm text-muted-foreground mb-1">Danos</p>
                <p className="text-sm">{incidenteData.danos}</p>
              </div>
              <div className="p-4 rounded-lg bg-muted/30 border border-border/30">
                <p className="text-sm text-muted-foreground mb-1">Causa Probable</p>
                <p className="text-sm">{incidenteData.causaProbable}</p>
              </div>
              <div className="md:col-span-2 p-4 rounded-lg bg-muted/30 border border-border/30">
                <p className="text-sm text-muted-foreground mb-1">Acciones Correctivas</p>
                <p className="text-sm">{incidenteData.accionesCorrectivas}</p>
              </div>
            </CardContent>
          </Card>

          <MiningMap title="Ubicacion del Incidente" center={[incidenteData.latitud, incidenteData.longitud]} zoom={16} markers={mapMarkers} height="250px" showLegend={false} />

          <Card className="bg-card border-border/50">
            <CardHeader><CardTitle className="flex items-center gap-2"><Clock className="h-5 w-5 text-primary" />Linea de Tiempo</CardTitle></CardHeader>
            <CardContent>
              <div className="space-y-4">
                {timelineData.map((evento, index) => (
                  <div key={evento.id} className="flex gap-4">
                    <div className="flex flex-col items-center">
                      <div className={`h-3 w-3 rounded-full ${getTimelineIcon(evento.tipo)}`} />
                      {index < timelineData.length - 1 && <div className="w-px h-full bg-border/50 my-1" />}
                    </div>
                    <div className="flex-1 pb-4">
                      <p className="text-sm">{evento.descripcion}</p>
                      <div className="flex items-center gap-2 mt-1 text-xs text-muted-foreground">
                        <span>{evento.usuario}</span>
                        <span>-</span>
                        <span>{new Date(evento.fecha).toLocaleString("es-CL")}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
              <Separator className="my-4" />
              <div className="space-y-3">
                <p className="text-sm font-medium flex items-center gap-2"><MessageSquare className="h-4 w-4" />Agregar Comentario</p>
                <Textarea placeholder="Escriba un comentario..." value={newComment} onChange={(e) => setNewComment(e.target.value)} className="bg-background border-border/50" />
                <Button className="bg-primary text-primary-foreground"><Send className="h-4 w-4 mr-2" />Enviar</Button>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="space-y-6">
          <Card className="bg-card border-border/50">
            <CardHeader><CardTitle className="text-base">Informacion</CardTitle></CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center gap-3">
                <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-purple-500/10 border border-purple-500/20"><MapPin className="h-4 w-4 text-purple-500" /></div>
                <div>
                  <p className="text-xs text-muted-foreground">Ubicacion</p>
                  <p className="text-sm font-medium">{incidenteData.lugar}</p>
                  <p className="text-xs text-muted-foreground">{incidenteData.mina}</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-blue-500/10 border border-blue-500/20"><Truck className="h-4 w-4 text-blue-500" /></div>
                <div>
                  <p className="text-xs text-muted-foreground">Unidad Involucrada</p>
                  <p className="text-sm font-medium">{incidenteData.unidad}</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary/10 border border-primary/20"><Calendar className="h-4 w-4 text-primary" /></div>
                <div>
                  <p className="text-xs text-muted-foreground">Fecha y Hora</p>
                  <p className="text-sm font-medium">{new Date(incidenteData.fecha).toLocaleString("es-CL")}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          {incidenteData.trabajador && (
            <Card className="bg-card border-border/50">
              <CardHeader><CardTitle className="text-base flex items-center gap-2"><User className="h-4 w-4" />Trabajador Involucrado</CardTitle></CardHeader>
              <CardContent>
                <div className="flex items-center gap-3">
                  <Avatar className="h-12 w-12 border border-primary/20">
                    <AvatarFallback className="bg-primary/10 text-primary">{incidenteData.trabajador.nombre.split(" ").map((n) => n[0]).join("")}</AvatarFallback>
                  </Avatar>
                  <div>
                    <p className="font-medium">{incidenteData.trabajador.nombre}</p>
                    <p className="text-sm text-muted-foreground">{incidenteData.trabajador.cargo}</p>
                    <p className="text-xs text-muted-foreground font-mono">{incidenteData.trabajador.rut}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          <Card className="bg-card border-border/50">
            <CardHeader><CardTitle className="text-base">Acciones</CardTitle></CardHeader>
            <CardContent className="space-y-2">
              <Button className="w-full bg-blue-600 hover:bg-blue-700 text-white">Cambiar Estado</Button>
              <Button variant="outline" className="w-full border-border/50">Generar Reporte PDF</Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
