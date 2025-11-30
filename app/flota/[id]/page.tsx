"use client";

import { useState } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { motion } from "framer-motion";
import { Truck, ArrowLeft, Edit, MapPin, Gauge, User, Cpu, Activity, AlertTriangle, Calendar } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { LineChart } from "@/components/charts/line-chart";
import { MiningMap } from "@/components/maps/mining-map";

const unidadData = {
  id: "1",
  codigo: "CAM-001",
  tipo: "camion",
  marca: "Caterpillar",
  modelo: "797F",
  anio: 2022,
  mina: "Mina Norte",
  estado: "activo",
  operador: "Juan Perez",
  dispositivo: "GPS-001",
  ultimaUbicacion: { latitud: -23.6509, longitud: -70.3975 },
};

const telemetriaData = [
  { hora: "08:00", velocidad: 25, combustible: 95 },
  { hora: "09:00", velocidad: 32, combustible: 88 },
  { hora: "10:00", velocidad: 28, combustible: 82 },
  { hora: "11:00", velocidad: 35, combustible: 75 },
  { hora: "12:00", velocidad: 0, combustible: 74 },
  { hora: "13:00", velocidad: 30, combustible: 68 },
  { hora: "14:00", velocidad: 28, combustible: 62 },
];

const alarmasRecientes = [
  { id: "1", tipo: "Velocidad", mensaje: "Exceso de velocidad en Zona A", tiempo: "Hace 2 horas", severidad: "alta" },
  { id: "2", tipo: "Proximidad", mensaje: "Acercamiento a vehiculo CAM-002", tiempo: "Hace 5 horas", severidad: "media" },
];

export default function FlotaDetailPage() {
  const params = useParams();
  const [activeTab, setActiveTab] = useState("telemetria");

  const mapMarkers = [
    {
      id: "current",
      position: [unidadData.ultimaUbicacion.latitud, unidadData.ultimaUbicacion.longitud] as [number, number],
      type: "vehiculo" as const,
      name: unidadData.codigo,
      status: "active" as const,
      details: `Velocidad: 28 km/h | Operador: ${unidadData.operador}`,
    },
  ];

  return (
    <div className="space-y-6">
      <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3 }}>
        <Link href="/flota">
          <Button variant="ghost" className="mb-4 text-muted-foreground hover:text-foreground">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Volver a Flota
          </Button>
        </Link>

        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="flex h-16 w-16 items-center justify-center rounded-xl bg-primary/10 border border-primary/20 text-3xl">
              🚛
            </div>
            <div>
              <h1 className="text-3xl font-bold text-foreground">{unidadData.codigo}</h1>
              <p className="text-muted-foreground mt-1">{unidadData.marca} {unidadData.modelo} ({unidadData.anio})</p>
            </div>
          </div>
          <div className="flex gap-2">
            <Badge className="bg-emerald-500/20 text-emerald-400 border-emerald-500/30 text-sm px-3 py-1">{unidadData.estado}</Badge>
            <Button variant="outline" className="border-border/50"><Edit className="h-4 w-4 mr-2" />Editar</Button>
          </div>
        </div>
      </motion.div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="bg-card border-border/50">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-blue-500/10 border border-blue-500/20">
                <User className="h-5 w-5 text-blue-500" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Operador</p>
                <p className="font-semibold">{unidadData.operador}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className="bg-card border-border/50">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10 border border-primary/20">
                <Gauge className="h-5 w-5 text-primary" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Velocidad Actual</p>
                <p className="font-semibold">28 km/h</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className="bg-card border-border/50">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-purple-500/10 border border-purple-500/20">
                <MapPin className="h-5 w-5 text-purple-500" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Ubicacion</p>
                <p className="font-semibold">Zona de Carga A</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className="bg-card border-border/50">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-emerald-500/10 border border-emerald-500/20">
                <Cpu className="h-5 w-5 text-emerald-500" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Dispositivo</p>
                <p className="font-semibold">{unidadData.dispositivo}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <MiningMap
        title="Ubicacion y Ruta GPS"
        center={[unidadData.ultimaUbicacion.latitud, unidadData.ultimaUbicacion.longitud]}
        zoom={15}
        markers={mapMarkers}
        height="350px"
      />

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="bg-card border border-border/50">
          <TabsTrigger value="telemetria">Telemetria</TabsTrigger>
          <TabsTrigger value="alarmas">Alarmas</TabsTrigger>
          <TabsTrigger value="historial">Historial</TabsTrigger>
        </TabsList>

        <TabsContent value="telemetria" className="mt-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <LineChart title="Velocidad (km/h)" data={telemetriaData} lines={[{ dataKey: "velocidad", name: "Velocidad", color: "#fbbf24" }]} xAxisKey="hora" height={250} />
            <LineChart title="Nivel de Combustible (%)" data={telemetriaData} lines={[{ dataKey: "combustible", name: "Combustible", color: "#10b981" }]} xAxisKey="hora" height={250} />
          </div>
          <Card className="bg-card border-border/50 mt-6">
            <CardHeader><CardTitle className="flex items-center gap-2"><Activity className="h-5 w-5 text-primary" />Datos en Tiempo Real</CardTitle></CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="p-4 rounded-lg bg-muted/30 border border-border/30 text-center">
                  <p className="text-2xl font-bold text-primary">28</p>
                  <p className="text-sm text-muted-foreground">km/h</p>
                </div>
                <div className="p-4 rounded-lg bg-muted/30 border border-border/30 text-center">
                  <p className="text-2xl font-bold text-emerald-400">62%</p>
                  <p className="text-sm text-muted-foreground">Combustible</p>
                </div>
                <div className="p-4 rounded-lg bg-muted/30 border border-border/30 text-center">
                  <p className="text-2xl font-bold text-blue-400">1,250</p>
                  <p className="text-sm text-muted-foreground">RPM Motor</p>
                </div>
                <div className="p-4 rounded-lg bg-muted/30 border border-border/30 text-center">
                  <p className="text-2xl font-bold text-yellow-400">85C</p>
                  <p className="text-sm text-muted-foreground">Temperatura</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="alarmas" className="mt-4">
          <Card className="bg-card border-border/50">
            <CardHeader><CardTitle className="flex items-center gap-2"><AlertTriangle className="h-5 w-5 text-yellow-500" />Alarmas Recientes</CardTitle></CardHeader>
            <CardContent>
              <div className="space-y-3">
                {alarmasRecientes.map((alarma) => (
                  <div key={alarma.id} className="flex items-center justify-between p-4 rounded-lg bg-muted/30 border border-border/30">
                    <div className="flex items-center gap-3">
                      <Badge className={alarma.severidad === "alta" ? "bg-red-500/20 text-red-400 border-red-500/30" : "bg-yellow-500/20 text-yellow-400 border-yellow-500/30"}>{alarma.tipo}</Badge>
                      <span>{alarma.mensaje}</span>
                    </div>
                    <span className="text-sm text-muted-foreground">{alarma.tiempo}</span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="historial" className="mt-4">
          <Card className="bg-card border-border/50">
            <CardHeader><CardTitle className="flex items-center gap-2"><Calendar className="h-5 w-5 text-primary" />Historial de Actividad</CardTitle></CardHeader>
            <CardContent>
              <div className="space-y-4">
                {[
                  { fecha: "Hoy 10:30", evento: "Inicio de turno", tipo: "info" },
                  { fecha: "Hoy 08:00", evento: "Mantenimiento preventivo completado", tipo: "success" },
                  { fecha: "Ayer 18:00", evento: "Fin de turno", tipo: "info" },
                  { fecha: "Ayer 15:30", evento: "Alarma de velocidad", tipo: "warning" },
                ].map((item, index) => (
                  <div key={index} className="flex items-center gap-4">
                    <div className={`h-2 w-2 rounded-full ${item.tipo === "success" ? "bg-emerald-500" : item.tipo === "warning" ? "bg-yellow-500" : "bg-blue-500"}`} />
                    <div className="flex-1">
                      <p className="text-sm font-medium">{item.evento}</p>
                      <p className="text-xs text-muted-foreground">{item.fecha}</p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
