"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { User, Mail, Shield, Building, MapPin, Calendar, Save, Loader2 } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Skeleton } from "@/components/ui/skeleton";
import { Badge } from "@/components/ui/badge";
import { supabase } from "@/lib/supabase/client";

interface UserProfile {
  email: string;
  nombre: string;
  rol: string;
  createdAt: string;
}

export default function PerfilPage() {
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [nombre, setNombre] = useState("");

  useEffect(() => {
    const loadProfile = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        setProfile({
          email: user.email || "",
          nombre: user.user_metadata?.nombre || user.user_metadata?.name || user.email?.split("@")[0] || "",
          rol: user.user_metadata?.rol || "operador",
          createdAt: user.created_at || new Date().toISOString(),
        });
        setNombre(user.user_metadata?.nombre || user.user_metadata?.name || "");
      }
      setIsLoading(false);
    };
    loadProfile();
  }, []);

  const handleSave = async () => {
    setIsSaving(true);
    try {
      await supabase.auth.updateUser({
        data: { nombre },
      });
      setProfile(prev => prev ? { ...prev, nombre } : null);
    } catch (error) {
      console.error("Error updating profile:", error);
    }
    setIsSaving(false);
  };

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="space-y-1">
          <Skeleton className="h-8 w-48" />
          <Skeleton className="h-4 w-72" />
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <Card className="bg-card border-border/50">
            <CardContent className="pt-6">
              <div className="flex flex-col items-center space-y-4">
                <Skeleton className="h-24 w-24 rounded-full" />
                <Skeleton className="h-6 w-32" />
                <Skeleton className="h-4 w-48" />
              </div>
            </CardContent>
          </Card>
          <Card className="lg:col-span-2 bg-card border-border/50">
            <CardHeader>
              <Skeleton className="h-6 w-40" />
            </CardHeader>
            <CardContent className="space-y-4">
              {[...Array(3)].map((_, i) => (
                <div key={i} className="space-y-2">
                  <Skeleton className="h-4 w-24" />
                  <Skeleton className="h-10 w-full" />
                </div>
              ))}
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }}>
        <h1 className="text-3xl font-bold">Mi Perfil</h1>
        <p className="text-muted-foreground mt-1">Gestiona tu informacion personal</p>
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.1 }}>
          <Card className="bg-card border-border/50">
            <CardContent className="pt-6">
              <div className="flex flex-col items-center space-y-4">
                <Avatar className="h-24 w-24 border-2 border-primary/20">
                  <AvatarFallback className="bg-primary/10 text-primary text-2xl">
                    {profile?.nombre?.substring(0, 2).toUpperCase() || "OP"}
                  </AvatarFallback>
                </Avatar>
                <div className="text-center">
                  <h2 className="text-xl font-semibold">{profile?.nombre || "Usuario"}</h2>
                  <p className="text-sm text-muted-foreground">{profile?.email}</p>
                </div>
                <Badge className="bg-primary/20 text-primary capitalize">{profile?.rol}</Badge>
                <div className="w-full pt-4 border-t border-border/50 space-y-3">
                  <div className="flex items-center gap-3 text-sm">
                    <Building className="h-4 w-4 text-muted-foreground" />
                    <span>Mina Poderosa S.A.</span>
                  </div>
                  <div className="flex items-center gap-3 text-sm">
                    <MapPin className="h-4 w-4 text-muted-foreground" />
                    <span>La Libertad, Peru</span>
                  </div>
                  <div className="flex items-center gap-3 text-sm">
                    <Calendar className="h-4 w-4 text-muted-foreground" />
                    <span>Desde {new Date(profile?.createdAt || "").toLocaleDateString("es-PE")}</span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.2 }} className="lg:col-span-2">
          <Card className="bg-card border-border/50">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <User className="h-5 w-5 text-primary" />
                Informacion Personal
              </CardTitle>
              <CardDescription>Actualiza tu informacion de perfil</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="nombre">Nombre Completo</Label>
                <Input
                  id="nombre"
                  value={nombre}
                  onChange={(e) => setNombre(e.target.value)}
                  className="bg-background border-border/50"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="email">Correo Electronico</Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="email"
                    value={profile?.email || ""}
                    disabled
                    className="bg-muted/30 border-border/50 pl-10"
                  />
                </div>
                <p className="text-xs text-muted-foreground">El correo no puede ser modificado</p>
              </div>
              <div className="space-y-2">
                <Label htmlFor="rol">Rol</Label>
                <div className="relative">
                  <Shield className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="rol"
                    value={profile?.rol || "operador"}
                    disabled
                    className="bg-muted/30 border-border/50 pl-10 capitalize"
                  />
                </div>
              </div>
              <div className="pt-4">
                <Button onClick={handleSave} disabled={isSaving}>
                  {isSaving ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Guardando...
                    </>
                  ) : (
                    <>
                      <Save className="mr-2 h-4 w-4" />
                      Guardar Cambios
                    </>
                  )}
                </Button>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  );
}
