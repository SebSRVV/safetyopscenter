"use client";

import { motion } from "framer-motion";
import { Bell, Shield, Building, MapPin, Phone, Globe } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";

export default function ConfiguracionPage() {
  return (
    <div className="space-y-6">
      <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }}>
        <h1 className="text-3xl font-bold">Configuracion</h1>
        <p className="text-muted-foreground mt-1">Administra las preferencias de SafetyOps Center</p>
      </motion.div>

      <Tabs defaultValue="mina" className="space-y-6">
        <TabsList className="bg-card border border-border/50">
          <TabsTrigger value="mina"><Building className="h-4 w-4 mr-2" />Mina</TabsTrigger>
          <TabsTrigger value="notificaciones"><Bell className="h-4 w-4 mr-2" />Notificaciones</TabsTrigger>
          <TabsTrigger value="seguridad"><Shield className="h-4 w-4 mr-2" />Seguridad</TabsTrigger>
        </TabsList>

        <TabsContent value="mina">
          <Card className="bg-card border-border/50">
            <CardHeader>
              <CardTitle className="flex items-center gap-2"><Building className="h-5 w-5 text-primary" />Informacion de la Mina</CardTitle>
              <CardDescription>Datos de Mina Poderosa - La Libertad, Peru</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2"><Label>Nombre</Label><Input value="Mina Poderosa" disabled className="bg-muted/30" /></div>
                <div className="space-y-2"><Label>Codigo</Label><Input value="MP-001" disabled className="bg-muted/30" /></div>
                <div className="space-y-2"><Label>Empresa</Label><Input value="Compania Minera Poderosa S.A." disabled className="bg-muted/30" /></div>
                <div className="space-y-2"><Label>Ubicacion</Label><Input value="Pataz, La Libertad, Peru" disabled className="bg-muted/30" /></div>
              </div>
              <Separator />
              <div className="grid grid-cols-3 gap-4">
                <div className="p-4 rounded-lg bg-muted/30 text-center"><p className="text-2xl font-bold text-primary">-8.0833</p><p className="text-sm text-muted-foreground">Latitud</p></div>
                <div className="p-4 rounded-lg bg-muted/30 text-center"><p className="text-2xl font-bold text-primary">-77.5833</p><p className="text-sm text-muted-foreground">Longitud</p></div>
                <div className="p-4 rounded-lg bg-muted/30 text-center"><p className="text-2xl font-bold text-emerald-400">3,200 msnm</p><p className="text-sm text-muted-foreground">Altitud</p></div>
              </div>
              <div className="p-4 rounded-lg bg-primary/5 border border-primary/20">
                <h4 className="font-medium mb-2">Contacto de Emergencia</h4>
                <div className="flex gap-8 text-sm"><div className="flex items-center gap-2"><Phone className="h-4 w-4" /><span>+51 44 461000</span></div><div className="flex items-center gap-2"><Globe className="h-4 w-4" /><span>www.poderosa.com.pe</span></div></div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="notificaciones">
          <Card className="bg-card border-border/50">
            <CardHeader><CardTitle>Preferencias de Notificaciones</CardTitle></CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between"><div><p className="font-medium">Alarmas Criticas</p><p className="text-sm text-muted-foreground">Recibir notificaciones de alarmas criticas</p></div><Switch defaultChecked /></div>
              <Separator />
              <div className="flex items-center justify-between"><div><p className="font-medium">Nuevos Incidentes</p><p className="text-sm text-muted-foreground">Notificar cuando se reporte un nuevo incidente</p></div><Switch defaultChecked /></div>
              <Separator />
              <div className="flex items-center justify-between"><div><p className="font-medium">Dispositivos Desconectados</p><p className="text-sm text-muted-foreground">Alertar cuando un dispositivo pierda conexion</p></div><Switch defaultChecked /></div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="seguridad">
          <Card className="bg-card border-border/50">
            <CardHeader><CardTitle>Cambiar Contrasena</CardTitle></CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2"><Label>Contrasena Actual</Label><Input type="password" className="max-w-md" /></div>
              <div className="space-y-2"><Label>Nueva Contrasena</Label><Input type="password" className="max-w-md" /></div>
              <div className="space-y-2"><Label>Confirmar</Label><Input type="password" className="max-w-md" /></div>
              <Button>Actualizar Contrasena</Button>
            </CardContent>
          </Card>
          <Card className="bg-card border-border/50 mt-6">
            <CardHeader><CardTitle>Sesiones Activas</CardTitle></CardHeader>
            <CardContent>
              <div className="flex items-center justify-between p-4 rounded-lg bg-muted/30">
                <div><p className="font-medium">Este dispositivo</p><p className="text-sm text-muted-foreground">Windows - Chrome</p></div>
                <Badge className="bg-emerald-500/20 text-emerald-400">Activa</Badge>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
