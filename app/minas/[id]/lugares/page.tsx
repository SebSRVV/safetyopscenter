"use client";

import { useState } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { motion } from "framer-motion";
import { MapPin, ArrowLeft, Plus, Search, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Label } from "@/components/ui/label";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { MiningMap } from "@/components/maps/mining-map";

const lugaresData = [
  { id: "1", nombre: "Zona de Carga A", tipo: "zona_carga", latitud: -23.6509, longitud: -70.3975 },
  { id: "2", nombre: "Cruce Principal", tipo: "cruce", latitud: -23.6529, longitud: -70.3955 },
  { id: "3", nombre: "Taller Mecanico", tipo: "taller", latitud: -23.6549, longitud: -70.3935 },
  { id: "4", nombre: "Polvorin", tipo: "zona_restringida", latitud: -23.6489, longitud: -70.3995 },
  { id: "5", nombre: "Oficinas", tipo: "oficina", latitud: -23.6469, longitud: -70.4015 },
];

const tiposLugar = [
  { value: "zona_carga", label: "Zona de Carga" },
  { value: "cruce", label: "Cruce" },
  { value: "taller", label: "Taller" },
  { value: "zona_restringida", label: "Zona Restringida" },
  { value: "oficina", label: "Oficina" },
  { value: "estacionamiento", label: "Estacionamiento" },
];

export default function LugaresPage() {
  const params = useParams();
  const [searchQuery, setSearchQuery] = useState("");
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const filteredLugares = lugaresData.filter((lugar) =>
    lugar.nombre.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const mapMarkers = filteredLugares.map((lugar) => ({
    id: lugar.id,
    position: [lugar.latitud, lugar.longitud] as [number, number],
    type: "lugar" as const,
    name: lugar.nombre,
    status: "active" as const,
    details: lugar.tipo.replace("_", " "),
  }));

  const handleCreateLugar = async () => {
    setIsLoading(true);
    await new Promise((resolve) => setTimeout(resolve, 1000));
    setIsLoading(false);
    setIsCreateDialogOpen(false);
  };

  return (
    <div className="space-y-6">
      <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3 }}>
        <Link href={`/minas/${params.id}`}>
          <Button variant="ghost" className="mb-4 text-muted-foreground hover:text-foreground">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Volver a Mina
          </Button>
        </Link>

        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold text-foreground">Lugares</h1>
            <p className="text-muted-foreground mt-1">Gestion de lugares de la mina</p>
          </div>
          <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
            <DialogTrigger asChild>
              <Button className="bg-primary text-primary-foreground">
                <Plus className="h-4 w-4 mr-2" />
                Nuevo Lugar
              </Button>
            </DialogTrigger>
            <DialogContent className="bg-card border-border">
              <DialogHeader>
                <DialogTitle>Crear Nuevo Lugar</DialogTitle>
                <DialogDescription>Ingresa los datos del lugar</DialogDescription>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <div className="grid gap-2">
                  <Label>Nombre</Label>
                  <Input placeholder="Nombre del lugar" className="bg-background border-border/50" />
                </div>
                <div className="grid gap-2">
                  <Label>Tipo</Label>
                  <Select>
                    <SelectTrigger className="bg-background border-border/50">
                      <SelectValue placeholder="Seleccionar tipo" />
                    </SelectTrigger>
                    <SelectContent className="bg-card border-border">
                      {tiposLugar.map((tipo) => (
                        <SelectItem key={tipo.value} value={tipo.value}>{tipo.label}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="grid gap-2">
                    <Label>Latitud</Label>
                    <Input type="number" step="0.0001" className="bg-background border-border/50" />
                  </div>
                  <div className="grid gap-2">
                    <Label>Longitud</Label>
                    <Input type="number" step="0.0001" className="bg-background border-border/50" />
                  </div>
                </div>
              </div>
              <DialogFooter>
                <Button variant="outline" onClick={() => setIsCreateDialogOpen(false)}>Cancelar</Button>
                <Button onClick={handleCreateLugar} disabled={isLoading} className="bg-primary text-primary-foreground">
                  {isLoading ? <><Loader2 className="h-4 w-4 mr-2 animate-spin" />Creando...</> : "Crear Lugar"}
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
      </motion.div>

      <div className="relative max-w-md">
        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
        <Input
          type="search"
          placeholder="Buscar lugares..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="pl-10 bg-card border-border/50"
        />
      </div>

      <MiningMap title="Mapa de Lugares" center={[-23.6509, -70.3975]} zoom={14} markers={mapMarkers} height="300px" />

      <Card className="bg-card border-border/50">
        <CardHeader>
          <CardTitle>Lista de Lugares</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow className="border-border/50">
                <TableHead>Nombre</TableHead>
                <TableHead>Tipo</TableHead>
                <TableHead>Coordenadas</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredLugares.map((lugar) => (
                <TableRow key={lugar.id} className="border-border/50">
                  <TableCell className="font-medium">
                    <div className="flex items-center gap-2">
                      <MapPin className="h-4 w-4 text-primary" />
                      {lugar.nombre}
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge variant="outline">{lugar.tipo.replace("_", " ")}</Badge>
                  </TableCell>
                  <TableCell className="font-mono text-sm text-muted-foreground">
                    {lugar.latitud.toFixed(4)}, {lugar.longitud.toFixed(4)}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
