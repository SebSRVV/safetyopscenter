"use client";

import { useState } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { motion } from "framer-motion";
import { TrafficCone, ArrowLeft, Edit, MapPin, Play, Clock, History, Settings, Circle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { MiningMap } from "@/components/maps/mining-map";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

const semaforoData = {
  id: "1",
  codigo: "SEM-001",
  nombre: "Semaforo Cruce Principal",
  lugar: "Cruce Principal",
  mina: "Mina Norte",
  latitud: -23.6509,
  longitud: -70.3975,
  estado: "verde",
  modo: "automatico",
};

const historialData = [
  { id: "1", estadoAnterior: "rojo", estadoNuevo: "verde", motivo: "Ciclo automatico", fecha: "Hace 2 min" },
  { id: "2", estadoAnterior: "amarillo", estadoNuevo: "rojo", motivo: "Ciclo automatico", fecha: "Hace 5 min" },
  { id: "3", estadoAnterior: "verde", estadoNuevo: "amarillo", motivo: "Ciclo automatico", fecha: "Hace 7 min" },
];

const fasesData = [
  { id: "1", nombre: "Fase Verde", estado: "verde", duracion: 45, orden: 1 },
  { id: "2", nombre: "Fase Amarilla", estado: "amarillo", duracion: 5, orden: 2 },
  { id: "3", nombre: "Fase Roja", estado: "rojo", duracion: 30, orden: 3 },
];

const getEstadoColor = (estado: string) => {
  switch (estado) {
    case "verde": return "bg-emerald-500";
    case "amarillo": return "bg-yellow-500";
    case "rojo": return "bg-red-500";
    default: return "bg-gray-500";
  }
};

export default function SemaforoDetailPage() {
  const params = useParams();
  const [activeTab, setActiveTab] = useState("estado");
  const [currentEstado, setCurrentEstado] = useState(semaforoData.estado);

  const mapMarkers = [{
    id: semaforoData.id,
    position: [semaforoData.latitud, semaforoData.longitud] as [number, number],
    type: "semaforo" as const,
    name: semaforoData.nombre,
    status: "active" as const,
    details: `Estado: ${currentEstado}`,
  }];

  return (
    <div className="space-y-6">
      <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3 }}>
        <Link href="/semaforos">
          <Button variant="ghost" className="mb-4 text-muted-foreground hover:text-foreground">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Volver a Semaforos
          </Button>
        </Link>

        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="flex h-16 w-16 items-center justify-center rounded-xl bg-primary/10 border border-primary/20 glow-yellow">
              <TrafficCone className="h-8 w-8 text-primary" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-foreground">{semaforoData.codigo}</h1>
              <p className="text-muted-foreground mt-1">{semaforoData.nombre}</p>
            </div>
          </div>
          <div className="flex gap-2">
            <Link href={`/semaforos/${params.id}/simulacion`}>
              <Button className="bg-blue-600 hover:bg-blue-700 text-white"><Play className="h-4 w-4 mr-2" />Simulacion</Button>
            </Link>
            <Button variant="outline" className="border-border/50"><Edit className="h-4 w-4 mr-2" />Editar</Button>
          </div>
        </div>
      </motion.div>

      <Card className="bg-card border-border/50">
        <CardContent className="p-6">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="flex flex-col items-center gap-4">
              <div className="bg-gray-900 rounded-2xl p-4 border-4 border-gray-700">
                <div className="flex flex-col gap-3">
                  <div className={`h-16 w-16 rounded-full border-4 border-gray-600 transition-all duration-500 ${currentEstado === "rojo" ? "bg-red-500 shadow-[0_0_30px_rgba(239,68,68,0.8)]" : "bg-red-900/30"}`} />
                  <div className={`h-16 w-16 rounded-full border-4 border-gray-600 transition-all duration-500 ${currentEstado === "amarillo" ? "bg-yellow-500 shadow-[0_0_30px_rgba(234,179,8,0.8)]" : "bg-yellow-900/30"}`} />
                  <div className={`h-16 w-16 rounded-full border-4 border-gray-600 transition-all duration-500 ${currentEstado === "verde" ? "bg-emerald-500 shadow-[0_0_30px_rgba(16,185,129,0.8)]" : "bg-emerald-900/30"}`} />
                </div>
              </div>
              <Badge className={`text-lg px-4 py-1 ${currentEstado === "verde" ? "bg-emerald-500/20 text-emerald-400 border-emerald-500/30" : currentEstado === "amarillo" ? "bg-yellow-500/20 text-yellow-400 border-yellow-500/30" : "bg-red-500/20 text-red-400 border-red-500/30"}`}>
                {currentEstado.toUpperCase()}
              </Badge>
            </div>

            <div className="flex-1 grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="p-4 rounded-lg bg-muted/30 border border-border/30">
                <p className="text-sm text-muted-foreground">Ubicacion</p>
                <div className="flex items-center gap-2 mt-1">
                  <MapPin className="h-4 w-4 text-primary" />
                  <span className="font-medium">{semaforoData.lugar}</span>
                </div>
              </div>
              <div className="p-4 rounded-lg bg-muted/30 border border-border/30">
                <p className="text-sm text-muted-foreground">Mina</p>
                <span className="font-medium">{semaforoData.mina}</span>
              </div>
              <div className="p-4 rounded-lg bg-muted/30 border border-border/30">
                <p className="text-sm text-muted-foreground">Modo Actual</p>
                <Badge className="mt-1 bg-blue-500/20 text-blue-400 border-blue-500/30">{semaforoData.modo}</Badge>
              </div>
              <div className="p-4 rounded-lg bg-muted/30 border border-border/30">
                <p className="text-sm text-muted-foreground mb-2">Control Manual</p>
                <Select value={currentEstado} onValueChange={setCurrentEstado}>
                  <SelectTrigger className="bg-background border-border/50"><SelectValue /></SelectTrigger>
                  <SelectContent className="bg-card border-border">
                    <SelectItem value="verde">Verde</SelectItem>
                    <SelectItem value="amarillo">Amarillo</SelectItem>
                    <SelectItem value="rojo">Rojo</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      <MiningMap title="Ubicacion del Semaforo" center={[semaforoData.latitud, semaforoData.longitud]} zoom={16} markers={mapMarkers} height="250px" showLegend={false} />

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="bg-card border border-border/50">
          <TabsTrigger value="estado"><Clock className="h-4 w-4 mr-2" />Fases</TabsTrigger>
          <TabsTrigger value="historial"><History className="h-4 w-4 mr-2" />Historial</TabsTrigger>
        </TabsList>

        <TabsContent value="estado" className="mt-4">
          <Card className="bg-card border-border/50">
            <CardHeader><CardTitle>Fases del Ciclo</CardTitle></CardHeader>
            <CardContent>
              <div className="space-y-4">
                {fasesData.map((fase, index) => (
                  <div key={fase.id} className={`flex items-center justify-between p-4 rounded-lg border transition-all ${currentEstado === fase.estado ? "bg-primary/10 border-primary/30" : "bg-muted/30 border-border/30"}`}>
                    <div className="flex items-center gap-4">
                      <div className="flex items-center justify-center h-8 w-8 rounded-full bg-muted text-sm font-bold">{index + 1}</div>
                      <Circle className={`h-6 w-6 ${getEstadoColor(fase.estado)} rounded-full`} />
                      <div>
                        <p className="font-medium">{fase.nombre}</p>
                        <p className="text-sm text-muted-foreground">Duracion: {fase.duracion} segundos</p>
                      </div>
                    </div>
                    {currentEstado === fase.estado && <Badge className="bg-primary/20 text-primary border-primary/30">Activo</Badge>}
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="historial" className="mt-4">
          <Card className="bg-card border-border/50">
            <CardHeader><CardTitle>Historial de Cambios</CardTitle></CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow className="border-border/50">
                    <TableHead>Estado Anterior</TableHead>
                    <TableHead>Estado Nuevo</TableHead>
                    <TableHead>Motivo</TableHead>
                    <TableHead>Fecha</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {historialData.map((item) => (
                    <TableRow key={item.id} className="border-border/50">
                      <TableCell><div className="flex items-center gap-2"><Circle className={`h-4 w-4 ${getEstadoColor(item.estadoAnterior)} rounded-full`} />{item.estadoAnterior}</div></TableCell>
                      <TableCell><div className="flex items-center gap-2"><Circle className={`h-4 w-4 ${getEstadoColor(item.estadoNuevo)} rounded-full`} />{item.estadoNuevo}</div></TableCell>
                      <TableCell>{item.motivo}</TableCell>
                      <TableCell className="text-muted-foreground">{item.fecha}</TableCell>
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
