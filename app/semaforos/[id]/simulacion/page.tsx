"use client";

import { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { TrafficCone, ArrowLeft, Play, Pause, RotateCcw, Clock, Settings } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Slider } from "@/components/ui/slider";
import { Label } from "@/components/ui/label";

const semaforoData = { id: "1", codigo: "SEM-001", nombre: "Semaforo Cruce Principal" };

const fasesConfig = [
  { id: "1", nombre: "Verde", estado: "verde", duracion: 45, color: "#10b981" },
  { id: "2", nombre: "Amarillo", estado: "amarillo", duracion: 5, color: "#eab308" },
  { id: "3", nombre: "Rojo", estado: "rojo", duracion: 30, color: "#ef4444" },
];

export default function SimulacionPage() {
  const params = useParams();
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentFaseIndex, setCurrentFaseIndex] = useState(0);
  const [timeInFase, setTimeInFase] = useState(0);
  const [speed, setSpeed] = useState(1);
  const [totalCycles, setTotalCycles] = useState(0);

  const currentFase = fasesConfig[currentFaseIndex];
  const cicloTotal = fasesConfig.reduce((acc, fase) => acc + fase.duracion, 0);
  const progress = (timeInFase / currentFase.duracion) * 100;

  const resetSimulation = useCallback(() => {
    setCurrentFaseIndex(0);
    setTimeInFase(0);
    setTotalCycles(0);
    setIsPlaying(false);
  }, []);

  useEffect(() => {
    if (!isPlaying) return;
    const interval = setInterval(() => {
      setTimeInFase((prev) => {
        if (prev >= currentFase.duracion - 1) {
          setCurrentFaseIndex((prevIndex) => {
            const nextIndex = (prevIndex + 1) % fasesConfig.length;
            if (nextIndex === 0) setTotalCycles((c) => c + 1);
            return nextIndex;
          });
          return 0;
        }
        return prev + 1;
      });
    }, 1000 / speed);
    return () => clearInterval(interval);
  }, [isPlaying, currentFase.duracion, speed]);

  const getTimeElapsedInCycle = () => {
    let elapsed = 0;
    for (let i = 0; i < currentFaseIndex; i++) elapsed += fasesConfig[i].duracion;
    return elapsed + timeInFase;
  };

  return (
    <div className="space-y-6">
      <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3 }}>
        <Link href={`/semaforos/${params.id}`}>
          <Button variant="ghost" className="mb-4 text-muted-foreground hover:text-foreground">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Volver a {semaforoData.codigo}
          </Button>
        </Link>

        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="flex h-14 w-14 items-center justify-center rounded-xl bg-blue-500/10 border border-blue-500/20">
              <TrafficCone className="h-7 w-7 text-blue-500" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-foreground">Simulacion</h1>
              <p className="text-muted-foreground mt-1">{semaforoData.codigo} - {semaforoData.nombre}</p>
            </div>
          </div>
          <Badge className="bg-blue-500/20 text-blue-400 border-blue-500/30 text-sm">Ciclos completados: {totalCycles}</Badge>
        </div>
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.4, delay: 0.1 }} className="lg:col-span-1">
          <Card className="bg-card border-border/50">
            <CardHeader className="text-center"><CardTitle>Estado Actual</CardTitle></CardHeader>
            <CardContent className="flex flex-col items-center">
              <div className="bg-gray-900 rounded-3xl p-6 border-4 border-gray-700 shadow-2xl">
                <div className="flex flex-col gap-4">
                  {fasesConfig.map((fase) => (
                    <motion.div
                      key={fase.id}
                      animate={{ scale: currentFase.estado === fase.estado ? 1.1 : 1, boxShadow: currentFase.estado === fase.estado ? `0 0 40px ${fase.color}80` : "none" }}
                      transition={{ duration: 0.3 }}
                      className={`h-20 w-20 rounded-full border-4 border-gray-600 transition-all duration-300 ${currentFase.estado === fase.estado ? "" : "opacity-20"}`}
                      style={{ backgroundColor: currentFase.estado === fase.estado ? fase.color : `${fase.color}30` }}
                    />
                  ))}
                </div>
              </div>

              <AnimatePresence mode="wait">
                <motion.div key={currentFase.estado} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }} className="mt-6 text-center">
                  <Badge className="text-xl px-6 py-2" style={{ backgroundColor: `${currentFase.color}20`, color: currentFase.color, borderColor: `${currentFase.color}50` }}>
                    {currentFase.nombre.toUpperCase()}
                  </Badge>
                  <p className="mt-3 text-3xl font-bold text-foreground">{currentFase.duracion - timeInFase}s</p>
                  <p className="text-sm text-muted-foreground">restantes</p>
                </motion.div>
              </AnimatePresence>

              <div className="w-full mt-6">
                <Progress value={progress} className="h-3" />
              </div>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4, delay: 0.2 }} className="lg:col-span-2 space-y-6">
          <Card className="bg-card border-border/50">
            <CardHeader><CardTitle className="flex items-center gap-2"><Settings className="h-5 w-5 text-primary" />Controles de Simulacion</CardTitle></CardHeader>
            <CardContent>
              <div className="flex flex-wrap items-center gap-4">
                <Button onClick={() => setIsPlaying(!isPlaying)} className={isPlaying ? "bg-yellow-600 hover:bg-yellow-700" : "bg-emerald-600 hover:bg-emerald-700"} size="lg">
                  {isPlaying ? <><Pause className="h-5 w-5 mr-2" />Pausar</> : <><Play className="h-5 w-5 mr-2" />Iniciar</>}
                </Button>
                <Button onClick={resetSimulation} variant="outline" className="border-border/50" size="lg"><RotateCcw className="h-5 w-5 mr-2" />Reiniciar</Button>
                <div className="flex-1 min-w-[200px]">
                  <Label className="text-sm text-muted-foreground mb-2 block">Velocidad: {speed}x</Label>
                  <Slider value={[speed]} onValueChange={(v) => setSpeed(v[0])} min={0.5} max={5} step={0.5} className="w-full" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-card border-border/50">
            <CardHeader><CardTitle className="flex items-center gap-2"><Clock className="h-5 w-5 text-primary" />Timeline del Ciclo</CardTitle></CardHeader>
            <CardContent>
              <div className="relative mb-6">
                <div className="flex h-12 rounded-lg overflow-hidden">
                  {fasesConfig.map((fase, index) => {
                    const width = (fase.duracion / cicloTotal) * 100;
                    const isActive = index === currentFaseIndex;
                    return (
                      <motion.div key={fase.id} className="relative flex items-center justify-center text-sm font-medium" style={{ width: `${width}%`, backgroundColor: isActive ? fase.color : `${fase.color}40` }} animate={{ opacity: isActive ? 1 : 0.6 }}>
                        <span className={isActive ? "text-white" : "text-white/70"}>{fase.nombre} ({fase.duracion}s)</span>
                      </motion.div>
                    );
                  })}
                </div>
                <motion.div className="absolute top-0 h-full w-1 bg-white shadow-lg" style={{ left: `${(getTimeElapsedInCycle() / cicloTotal) * 100}%` }} animate={{ left: `${(getTimeElapsedInCycle() / cicloTotal) * 100}%` }} transition={{ duration: 0.1 }} />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {fasesConfig.map((fase, index) => (
                  <motion.div key={fase.id} className={`p-4 rounded-lg border transition-all ${index === currentFaseIndex ? "border-2" : "border-border/30 bg-muted/30"}`} style={{ borderColor: index === currentFaseIndex ? fase.color : undefined, backgroundColor: index === currentFaseIndex ? `${fase.color}10` : undefined }} animate={{ scale: index === currentFaseIndex ? 1.02 : 1 }}>
                    <div className="flex items-center gap-3 mb-2">
                      <div className="h-4 w-4 rounded-full" style={{ backgroundColor: fase.color }} />
                      <span className="font-medium">{fase.nombre}</span>
                    </div>
                    <div className="text-2xl font-bold" style={{ color: fase.color }}>{fase.duracion}s</div>
                    <p className="text-xs text-muted-foreground mt-1">{((fase.duracion / cicloTotal) * 100).toFixed(0)}% del ciclo</p>
                  </motion.div>
                ))}
              </div>

              <div className="mt-6 p-4 rounded-lg bg-muted/30 border border-border/30">
                <div className="flex justify-between items-center">
                  <div>
                    <p className="text-sm text-muted-foreground">Duracion total del ciclo</p>
                    <p className="text-xl font-bold text-primary">{cicloTotal} segundos</p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm text-muted-foreground">Tiempo en ciclo actual</p>
                    <p className="text-xl font-bold">{getTimeElapsedInCycle()}s / {cicloTotal}s</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  );
}
