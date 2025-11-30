"use client";

import { motion } from "framer-motion";
import {
  Settings,
  User,
  Bell,
  Shield,
  Database,
  Palette,
  Save,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export default function ConfiguracionPage() {
  return (
    <div className="space-y-6">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
      >
        <h1 className="text-3xl font-bold text-foreground">Configuración</h1>
        <p className="text-muted-foreground mt-1">
          Administra las preferencias del sistema
        </p>
      </motion.div>

      <Tabs defaultValue="perfil" className="space-y-6">
        <TabsList className="bg-card border border-border/50">
          <TabsTrigger value="perfil">
            <User className="h-4 w-4 mr-2" />
            Perfil
          </TabsTrigger>
          <TabsTrigger value="notificaciones">
            <Bell className="h-4 w-4 mr-2" />
            Notificaciones
          </TabsTrigger>
          <TabsTrigger value="seguridad">
            <Shield className="h-4 w-4 mr-2" />
            Seguridad
          </TabsTrigger>
          <TabsTrigger value="sistema">
            <Settings className="h-4 w-4 mr-2" />
            Sistema
          </TabsTrigger>
        </TabsList>

        {/* Perfil */}
        <TabsContent value="perfil">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
          >
            <Card className="bg-card border-border/50">
              <CardHeader>
                <CardTitle>Información Personal</CardTitle>
                <CardDescription>
                  Actualiza tu información de perfil
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="nombre">Nombre Completo</Label>
                    <Input
                      id="nombre"
                      defaultValue="Operador Demo"
                      className="bg-background border-border/50"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="email">Correo Electrónico</Label>
                    <Input
                      id="email"
                      type="email"
                      defaultValue="operador@mina.cl"
                      className="bg-background border-border/50"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="telefono">Teléfono</Label>
                    <Input
                      id="telefono"
                      defaultValue="+56 9 1234 5678"
                      className="bg-background border-border/50"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="cargo">Cargo</Label>
                    <Input
                      id="cargo"
                      defaultValue="Operador"
                      className="bg-background border-border/50"
                      disabled
                    />
                  </div>
                </div>
                <Button className="bg-primary text-primary-foreground">
                  <Save className="h-4 w-4 mr-2" />
                  Guardar Cambios
                </Button>
              </CardContent>
            </Card>
          </motion.div>
        </TabsContent>

        {/* Notificaciones */}
        <TabsContent value="notificaciones">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
          >
            <Card className="bg-card border-border/50">
              <CardHeader>
                <CardTitle>Preferencias de Notificaciones</CardTitle>
                <CardDescription>
                  Configura cómo y cuándo recibir notificaciones
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium">Alarmas Críticas</p>
                      <p className="text-sm text-muted-foreground">
                        Recibir notificaciones de alarmas críticas
                      </p>
                    </div>
                    <Switch defaultChecked />
                  </div>
                  <Separator className="bg-border/50" />
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium">Nuevos Incidentes</p>
                      <p className="text-sm text-muted-foreground">
                        Notificar cuando se reporte un nuevo incidente
                      </p>
                    </div>
                    <Switch defaultChecked />
                  </div>
                  <Separator className="bg-border/50" />
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium">Dispositivos Desconectados</p>
                      <p className="text-sm text-muted-foreground">
                        Alertar cuando un dispositivo pierda conexión
                      </p>
                    </div>
                    <Switch defaultChecked />
                  </div>
                  <Separator className="bg-border/50" />
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium">Resumen Diario</p>
                      <p className="text-sm text-muted-foreground">
                        Recibir un resumen diario por correo
                      </p>
                    </div>
                    <Switch />
                  </div>
                  <Separator className="bg-border/50" />
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium">Sonido de Notificaciones</p>
                      <p className="text-sm text-muted-foreground">
                        Reproducir sonido en notificaciones importantes
                      </p>
                    </div>
                    <Switch defaultChecked />
                  </div>
                </div>
                <Button className="bg-primary text-primary-foreground">
                  <Save className="h-4 w-4 mr-2" />
                  Guardar Preferencias
                </Button>
              </CardContent>
            </Card>
          </motion.div>
        </TabsContent>

        {/* Seguridad */}
        <TabsContent value="seguridad">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
            className="space-y-6"
          >
            <Card className="bg-card border-border/50">
              <CardHeader>
                <CardTitle>Cambiar Contraseña</CardTitle>
                <CardDescription>
                  Actualiza tu contraseña de acceso
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="current">Contraseña Actual</Label>
                  <Input
                    id="current"
                    type="password"
                    className="bg-background border-border/50 max-w-md"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="new">Nueva Contraseña</Label>
                  <Input
                    id="new"
                    type="password"
                    className="bg-background border-border/50 max-w-md"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="confirm">Confirmar Nueva Contraseña</Label>
                  <Input
                    id="confirm"
                    type="password"
                    className="bg-background border-border/50 max-w-md"
                  />
                </div>
                <Button className="bg-primary text-primary-foreground">
                  Actualizar Contraseña
                </Button>
              </CardContent>
            </Card>

            <Card className="bg-card border-border/50">
              <CardHeader>
                <CardTitle>Sesiones Activas</CardTitle>
                <CardDescription>
                  Administra tus sesiones activas en otros dispositivos
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center justify-between p-4 rounded-lg bg-muted/30 border border-border/30">
                    <div>
                      <p className="font-medium">Este dispositivo</p>
                      <p className="text-sm text-muted-foreground">
                        Windows • Chrome • Última actividad: Ahora
                      </p>
                    </div>
                    <Badge className="bg-emerald-500/20 text-emerald-400 border-emerald-500/30">
                      Activa
                    </Badge>
                  </div>
                </div>
                <Button variant="outline" className="mt-4 border-destructive text-destructive hover:bg-destructive/10">
                  Cerrar todas las otras sesiones
                </Button>
              </CardContent>
            </Card>
          </motion.div>
        </TabsContent>

        {/* Sistema */}
        <TabsContent value="sistema">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
            className="space-y-6"
          >
            <Card className="bg-card border-border/50">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Palette className="h-5 w-5" />
                  Apariencia
                </CardTitle>
                <CardDescription>
                  Personaliza la apariencia del sistema
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label>Tema</Label>
                  <Select defaultValue="dark">
                    <SelectTrigger className="bg-background border-border/50 max-w-xs">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent className="bg-card border-border">
                      <SelectItem value="dark">Oscuro (Industrial)</SelectItem>
                      <SelectItem value="light">Claro</SelectItem>
                      <SelectItem value="system">Sistema</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label>Idioma</Label>
                  <Select defaultValue="es">
                    <SelectTrigger className="bg-background border-border/50 max-w-xs">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent className="bg-card border-border">
                      <SelectItem value="es">Español</SelectItem>
                      <SelectItem value="en">English</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label>Zona Horaria</Label>
                  <Select defaultValue="america_santiago">
                    <SelectTrigger className="bg-background border-border/50 max-w-xs">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent className="bg-card border-border">
                      <SelectItem value="america_santiago">América/Santiago (UTC-3)</SelectItem>
                      <SelectItem value="america_lima">América/Lima (UTC-5)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-card border-border/50">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Database className="h-5 w-5" />
                  Datos y Almacenamiento
                </CardTitle>
                <CardDescription>
                  Información sobre el uso de datos
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="p-4 rounded-lg bg-muted/30 border border-border/30">
                    <p className="text-2xl font-bold text-primary">v1.0.0</p>
                    <p className="text-sm text-muted-foreground">Versión del Sistema</p>
                  </div>
                  <div className="p-4 rounded-lg bg-muted/30 border border-border/30">
                    <p className="text-2xl font-bold text-emerald-400">Conectado</p>
                    <p className="text-sm text-muted-foreground">Estado de Supabase</p>
                  </div>
                  <div className="p-4 rounded-lg bg-muted/30 border border-border/30">
                    <p className="text-2xl font-bold text-blue-400">45 ms</p>
                    <p className="text-sm text-muted-foreground">Latencia Promedio</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
