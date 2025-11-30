"use client";

import { useState, useCallback, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Play, RotateCcw, AlertTriangle, CheckCircle, XCircle, Truck, TrafficCone, Users } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Progress } from "@/components/ui/progress";

type SimulationState = "idle" | "running" | "success" | "accident";
type SemaforoState = "rojo" | "amarillo" | "verde";
type ScenarioType = "single-success" | "single-accident" | "dual-success" | "dual-accident";

interface VehicleState {
  x: number;
  y: number;
  rotation: number;
  speed: number;
  visible: boolean;
}

export default function SimulacionPage() {
  const [scenarioType, setScenarioType] = useState<ScenarioType>("single-success");
  const [simulationState, setSimulationState] = useState<SimulationState>("idle");
  const [vehicle1, setVehicle1] = useState<VehicleState>({ x: 0, y: 48, rotation: 0, speed: 0, visible: true });
  const [vehicle2, setVehicle2] = useState<VehicleState>({ x: 100, y: 52, rotation: 180, speed: 0, visible: true });
  const [semaforo1, setSemaforo1] = useState<SemaforoState>("rojo");
  const [semaforo2, setSemaforo2] = useState<SemaforoState>("rojo");
  const [progress, setProgress] = useState(0);
  const [showAlert, setShowAlert] = useState(false);
  const [alertMessage, setAlertMessage] = useState("");
  const [showExplosion, setShowExplosion] = useState(false);
  const [explosionPos, setExplosionPos] = useState({ x: 50, y: 50 });
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  const isDualMode = scenarioType.startsWith("dual");
  const isAccidentMode = scenarioType.endsWith("accident");

  const resetSimulation = useCallback(() => {
    if (intervalRef.current) clearInterval(intervalRef.current);
    setSimulationState("idle");
    setVehicle1({ x: 0, y: 48, rotation: 0, speed: 0, visible: true });
    setVehicle2({ x: 100, y: 52, rotation: 180, speed: 0, visible: true });
    setSemaforo1("rojo");
    setSemaforo2("rojo");
    setProgress(0);
    setShowAlert(false);
    setShowExplosion(false);
  }, []);

  const runSingleSuccess = useCallback(() => {
    setSimulationState("running");
    let step = 0;
    intervalRef.current = setInterval(() => {
      step++;
      setProgress(Math.min((step / 100) * 100, 100));
      if (step < 25) {
        setVehicle1(v => ({ ...v, x: step * 1.6, speed: 20 }));
      } else if (step === 25) {
        setSemaforo1("amarillo");
        setAlertMessage("Semaforo amarillo - Reducir velocidad");
        setShowAlert(true);
      } else if (step < 35) {
        setVehicle1(v => ({ ...v, x: 40 + (step - 25) * 0.8, speed: 12 }));
      } else if (step === 35) {
        setSemaforo1("rojo");
        setAlertMessage("Semaforo rojo - Detenerse");
      } else if (step < 55) {
        setVehicle1(v => ({ ...v, x: 48, speed: 0 }));
      } else if (step === 55) {
        setSemaforo1("verde");
        setAlertMessage("Semaforo verde - Continuar");
        setTimeout(() => setShowAlert(false), 1500);
      } else if (step < 100) {
        setVehicle1(v => ({ ...v, x: 48 + (step - 55) * 1.2, speed: 18 }));
      } else {
        if (intervalRef.current) clearInterval(intervalRef.current);
        setSimulationState("success");
      }
    }, 80);
  }, []);

  const runSingleAccident = useCallback(() => {
    setSimulationState("running");
    let step = 0;
    intervalRef.current = setInterval(() => {
      step++;
      setProgress(Math.min((step / 70) * 100, 100));
      if (step < 20) {
        setVehicle1(v => ({ ...v, x: step * 2.5, speed: 35 }));
      } else if (step === 20) {
        setSemaforo1("amarillo");
        setAlertMessage("ALERTA: Exceso de velocidad!");
        setShowAlert(true);
      } else if (step < 35) {
        setVehicle1(v => ({ ...v, x: 50 + (step - 20) * 2, speed: 42 }));
      } else if (step === 35) {
        setSemaforo1("rojo");
        setAlertMessage("PELIGRO: Semaforo ignorado!");
      } else if (step < 50) {
        const crash = (step - 35) / 15;
        setVehicle1(v => ({ ...v, x: 80 + crash * 15, y: 48 + crash * 25, rotation: crash * 60, speed: 45 - crash * 30 }));
      } else if (step === 50) {
        setExplosionPos({ x: 75, y: 70 });
        setShowExplosion(true);
        setAlertMessage("ACCIDENTE: Descarrilamiento!");
      } else if (step > 65) {
        if (intervalRef.current) clearInterval(intervalRef.current);
        setSimulationState("accident");
      }
    }, 80);
  }, []);

  const runDualSuccess = useCallback(() => {
    setSimulationState("running");
    let step = 0;
    intervalRef.current = setInterval(() => {
      step++;
      setProgress(Math.min((step / 120) * 100, 100));
      
      if (step < 20) {
        setVehicle1(v => ({ ...v, x: step * 1.5, speed: 18 }));
        setVehicle2(v => ({ ...v, x: 100 - step * 1.5, speed: 18 }));
      } else if (step === 20) {
        setSemaforo1("amarillo");
        setSemaforo2("amarillo");
        setAlertMessage("Semaforos en amarillo - Reducir velocidad");
        setShowAlert(true);
      } else if (step < 35) {
        setVehicle1(v => ({ ...v, x: 30 + (step - 20) * 0.5, speed: 10 }));
        setVehicle2(v => ({ ...v, x: 70 - (step - 20) * 0.5, speed: 10 }));
      } else if (step === 35) {
        setSemaforo1("rojo");
        setSemaforo2("rojo");
        setAlertMessage("Semaforos en rojo - Vehiculos detenidos");
      } else if (step < 60) {
        setVehicle1(v => ({ ...v, x: 37.5, speed: 0 }));
        setVehicle2(v => ({ ...v, x: 62.5, speed: 0 }));
      } else if (step === 60) {
        setSemaforo1("verde");
        setAlertMessage("SC-003 tiene via libre");
      } else if (step < 80) {
        setVehicle1(v => ({ ...v, x: 37.5 + (step - 60) * 3, speed: 20 }));
      } else if (step === 80) {
        setSemaforo1("rojo");
        setSemaforo2("verde");
        setAlertMessage("SC-007 tiene via libre");
      } else if (step < 100) {
        setVehicle2(v => ({ ...v, x: 62.5 - (step - 80) * 3, speed: 20 }));
      } else if (step === 100) {
        setShowAlert(false);
      } else if (step > 115) {
        if (intervalRef.current) clearInterval(intervalRef.current);
        setSimulationState("success");
      }
    }, 80);
  }, []);

  const runDualAccident = useCallback(() => {
    setSimulationState("running");
    let step = 0;
    intervalRef.current = setInterval(() => {
      step++;
      setProgress(Math.min((step / 60) * 100, 100));
      
      if (step < 15) {
        setVehicle1(v => ({ ...v, x: step * 2.5, speed: 30 }));
        setVehicle2(v => ({ ...v, x: 100 - step * 2.5, speed: 30 }));
      } else if (step === 15) {
        setSemaforo1("amarillo");
        setSemaforo2("amarillo");
        setAlertMessage("ALERTA: Vehiculos a alta velocidad!");
        setShowAlert(true);
      } else if (step < 25) {
        setVehicle1(v => ({ ...v, x: 37.5 + (step - 15) * 1.5, speed: 35 }));
        setVehicle2(v => ({ ...v, x: 62.5 - (step - 15) * 1.5, speed: 35 }));
      } else if (step === 25) {
        setSemaforo1("rojo");
        setSemaforo2("rojo");
        setAlertMessage("PELIGRO: Semaforos ignorados!");
      } else if (step < 35) {
        const approach = (step - 25) / 10;
        setVehicle1(v => ({ ...v, x: 52.5 + approach * 3, speed: 40 }));
        setVehicle2(v => ({ ...v, x: 47.5 - approach * 3, speed: 40 }));
      } else if (step === 35) {
        setExplosionPos({ x: 50, y: 50 });
        setShowExplosion(true);
        setAlertMessage("COLISION FRONTAL!");
      } else if (step < 45) {
        const crash = (step - 35) / 10;
        setVehicle1(v => ({ ...v, x: 55 + crash * 8, y: 48 - crash * 20, rotation: crash * 45, speed: 0 }));
        setVehicle2(v => ({ ...v, x: 45 - crash * 8, y: 52 + crash * 25, rotation: 180 - crash * 50, speed: 0 }));
      } else if (step > 55) {
        if (intervalRef.current) clearInterval(intervalRef.current);
        setSimulationState("accident");
      }
    }, 80);
  }, []);

  const startSimulation = () => {
    resetSimulation();
    setTimeout(() => {
      if (scenarioType === "single-success") runSingleSuccess();
      else if (scenarioType === "single-accident") runSingleAccident();
      else if (scenarioType === "dual-success") runDualSuccess();
      else runDualAccident();
    }, 100);
  };

  return (
    <div className="space-y-6">
      <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }}>
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold">Simulacion de Seguridad</h1>
            <p className="text-muted-foreground mt-1">Mina Poderosa - Control de Trafico en Tuneles</p>
          </div>
          <div className="flex gap-2">
            <Button onClick={startSimulation} disabled={simulationState === "running"} className="bg-emerald-600 hover:bg-emerald-700">
              <Play className="h-4 w-4 mr-2" />Iniciar
            </Button>
            <Button onClick={resetSimulation} variant="outline"><RotateCcw className="h-4 w-4 mr-2" />Reiniciar</Button>
          </div>
        </div>
      </motion.div>

      <Tabs value={scenarioType} onValueChange={(v) => { setScenarioType(v as ScenarioType); resetSimulation(); }}>
        <TabsList className="bg-card border border-border/50 grid grid-cols-4 w-full">
          <TabsTrigger value="single-success" className="data-[state=active]:bg-emerald-500/20 data-[state=active]:text-emerald-400 text-xs">
            <Truck className="h-3 w-3 mr-1" />1 Vehiculo OK
          </TabsTrigger>
          <TabsTrigger value="single-accident" className="data-[state=active]:bg-red-500/20 data-[state=active]:text-red-400 text-xs">
            <Truck className="h-3 w-3 mr-1" />1 Vehiculo Falla
          </TabsTrigger>
          <TabsTrigger value="dual-success" className="data-[state=active]:bg-emerald-500/20 data-[state=active]:text-emerald-400 text-xs">
            <Users className="h-3 w-3 mr-1" />2 Vehiculos OK
          </TabsTrigger>
          <TabsTrigger value="dual-accident" className="data-[state=active]:bg-red-500/20 data-[state=active]:text-red-400 text-xs">
            <Users className="h-3 w-3 mr-1" />2 Vehiculos Falla
          </TabsTrigger>
        </TabsList>
      </Tabs>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        <Card className="lg:col-span-3 bg-card border-border/50 overflow-hidden">
          <CardHeader className="border-b border-border/50 py-3">
            <CardTitle className="flex items-center gap-2 text-base">
              <TrafficCone className="h-5 w-5 text-primary" />
              {isDualMode ? "Cruce de Tuneles - Nivel 2000" : "Rampa Principal - Entrada Nivel 2000"}
            </CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            <div className="relative h-[480px] overflow-hidden bg-slate-900">
              {/* Fondo de tunel */}
              <div className="absolute inset-0 bg-gradient-to-b from-slate-800 via-stone-800 to-stone-900" />
              
              {/* Textura de roca */}
              <svg className="absolute inset-0 w-full h-full opacity-20">
                <pattern id="rock" width="60" height="60" patternUnits="userSpaceOnUse">
                  <circle cx="10" cy="10" r="3" fill="#78716c" />
                  <circle cx="40" cy="25" r="4" fill="#57534e" />
                  <circle cx="25" cy="45" r="2" fill="#a8a29e" />
                  <circle cx="50" cy="50" r="3" fill="#78716c" />
                </pattern>
                <rect width="100%" height="100%" fill="url(#rock)" />
              </svg>

              {/* Paredes del tunel */}
              <div className="absolute left-0 top-0 bottom-0 w-20 bg-gradient-to-r from-stone-950 via-stone-900 to-transparent">
                <div className="absolute right-0 top-0 bottom-0 w-2 bg-yellow-500/30" />
              </div>
              <div className="absolute right-0 top-0 bottom-0 w-20 bg-gradient-to-l from-stone-950 via-stone-900 to-transparent">
                <div className="absolute left-0 top-0 bottom-0 w-2 bg-yellow-500/30" />
              </div>

              {/* Techo del tunel */}
              <div className="absolute top-0 left-20 right-20 h-16 bg-gradient-to-b from-stone-950 to-transparent">
                <div className="absolute bottom-0 left-0 right-0 h-1 bg-stone-700" />
              </div>

              {/* Luces del tunel */}
              {[...Array(6)].map((_, i) => (
                <motion.div key={i} className="absolute top-8" style={{ left: `${15 + i * 14}%` }}
                  animate={{ opacity: [0.6, 1, 0.6] }} transition={{ repeat: Infinity, duration: 2, delay: i * 0.3 }}>
                  <div className="w-3 h-3 bg-yellow-400 rounded-full shadow-[0_0_20px_10px_rgba(250,204,21,0.4)]" />
                </motion.div>
              ))}

              {/* Pista/Carretera */}
              <div className="absolute left-20 right-20 top-[42%] h-20 bg-gradient-to-b from-gray-700 via-gray-600 to-gray-700">
                <div className="absolute inset-x-0 top-0 h-1 bg-white/40" />
                <div className="absolute inset-x-0 bottom-0 h-1 bg-white/40" />
                <div className="absolute inset-x-0 top-1/2 -translate-y-1/2 h-1 flex gap-6 px-4">
                  {[...Array(20)].map((_, i) => (<div key={i} className="w-8 h-full bg-yellow-400/70" />))}
                </div>
              </div>

              {/* Barranco inferior (zona de peligro) */}
              <div className="absolute left-20 right-20 bottom-0 h-28 bg-gradient-to-t from-red-950/80 via-stone-900 to-transparent">
                <div className="absolute top-4 left-0 right-0 h-1 bg-red-500/50" />
                <div className="absolute top-6 left-4 right-4 text-center">
                  <span className="text-red-400/60 text-xs font-bold tracking-widest">ZONA DE PELIGRO - BARRANCO</span>
                </div>
                {[...Array(12)].map((_, i) => (
                  <div key={i} className="absolute bg-stone-800 rounded" 
                    style={{ left: `${5 + i * 8}%`, top: `${30 + (i % 3) * 15}%`, width: "25px", height: "12px", transform: `rotate(${-10 + i * 3}deg)` }} />
                ))}
              </div>

              {/* Semaforo 1 (izquierda) */}
              <motion.div className="absolute left-[35%] top-[28%] flex flex-col items-center z-10"
                animate={{ scale: simulationState === "running" ? [1, 1.02, 1] : 1 }} transition={{ repeat: Infinity, duration: 1 }}>
                <div className="w-2 h-12 bg-gray-600 rounded" />
                <div className="bg-gray-800 rounded-lg p-1.5 border-2 border-gray-500 shadow-xl">
                  <div className="flex flex-col gap-1.5">
                    <motion.div className={`w-6 h-6 rounded-full border-2 border-gray-500 ${semaforo1 === "rojo" ? "bg-red-500 shadow-[0_0_15px_rgba(239,68,68,0.8)]" : "bg-red-900/30"}`}
                      animate={semaforo1 === "rojo" ? { scale: [1, 1.15, 1] } : {}} transition={{ repeat: Infinity, duration: 0.5 }} />
                    <motion.div className={`w-6 h-6 rounded-full border-2 border-gray-500 ${semaforo1 === "amarillo" ? "bg-yellow-400 shadow-[0_0_15px_rgba(250,204,21,0.8)]" : "bg-yellow-900/30"}`}
                      animate={semaforo1 === "amarillo" ? { scale: [1, 1.15, 1] } : {}} transition={{ repeat: Infinity, duration: 0.5 }} />
                    <motion.div className={`w-6 h-6 rounded-full border-2 border-gray-500 ${semaforo1 === "verde" ? "bg-emerald-500 shadow-[0_0_15px_rgba(16,185,129,0.8)]" : "bg-emerald-900/30"}`}
                      animate={semaforo1 === "verde" ? { scale: [1, 1.15, 1] } : {}} transition={{ repeat: Infinity, duration: 0.5 }} />
                  </div>
                </div>
              </motion.div>

              {/* Semaforo 2 (derecha) - solo en modo dual */}
              {isDualMode && (
                <motion.div className="absolute right-[35%] top-[28%] flex flex-col items-center z-10"
                  animate={{ scale: simulationState === "running" ? [1, 1.02, 1] : 1 }} transition={{ repeat: Infinity, duration: 1 }}>
                  <div className="w-2 h-12 bg-gray-600 rounded" />
                  <div className="bg-gray-800 rounded-lg p-1.5 border-2 border-gray-500 shadow-xl">
                    <div className="flex flex-col gap-1.5">
                      <motion.div className={`w-6 h-6 rounded-full border-2 border-gray-500 ${semaforo2 === "rojo" ? "bg-red-500 shadow-[0_0_15px_rgba(239,68,68,0.8)]" : "bg-red-900/30"}`}
                        animate={semaforo2 === "rojo" ? { scale: [1, 1.15, 1] } : {}} transition={{ repeat: Infinity, duration: 0.5 }} />
                      <motion.div className={`w-6 h-6 rounded-full border-2 border-gray-500 ${semaforo2 === "amarillo" ? "bg-yellow-400 shadow-[0_0_15px_rgba(250,204,21,0.8)]" : "bg-yellow-900/30"}`}
                        animate={semaforo2 === "amarillo" ? { scale: [1, 1.15, 1] } : {}} transition={{ repeat: Infinity, duration: 0.5 }} />
                      <motion.div className={`w-6 h-6 rounded-full border-2 border-gray-500 ${semaforo2 === "verde" ? "bg-emerald-500 shadow-[0_0_15px_rgba(16,185,129,0.8)]" : "bg-emerald-900/30"}`}
                        animate={semaforo2 === "verde" ? { scale: [1, 1.15, 1] } : {}} transition={{ repeat: Infinity, duration: 0.5 }} />
                    </div>
                  </div>
                </motion.div>
              )}

              {/* Vehiculo 1 */}
              {vehicle1.visible && (
                <motion.div className="absolute z-20" style={{ left: `${8 + vehicle1.x * 0.8}%`, top: `${vehicle1.y}%` }}
                  animate={{ rotate: vehicle1.rotation }} transition={{ type: "spring", stiffness: 80 }}>
                  <div className="relative">
                    <div className="w-16 h-9 bg-gradient-to-b from-yellow-400 to-yellow-600 rounded-md border-2 border-yellow-700 shadow-lg">
                      <div className="absolute top-0.5 left-0.5 w-5 h-5 bg-blue-400/60 rounded-sm border border-blue-300/50" />
                      <div className="absolute bottom-0 left-1.5 w-3 h-3 bg-gray-900 rounded-full border border-gray-600" />
                      <div className="absolute bottom-0 right-1.5 w-3 h-3 bg-gray-900 rounded-full border border-gray-600" />
                    </div>
                    {simulationState === "running" && vehicle1.speed > 0 && (
                      <motion.div className="absolute -top-1 left-0 right-0 flex justify-between px-0.5"
                        animate={{ opacity: [1, 0.3, 1] }} transition={{ repeat: Infinity, duration: 0.2 }}>
                        <div className="w-1.5 h-1.5 bg-yellow-300 rounded-full shadow-[0_0_6px_rgba(253,224,71,0.9)]" />
                        <div className="w-1.5 h-1.5 bg-yellow-300 rounded-full shadow-[0_0_6px_rgba(253,224,71,0.9)]" />
                      </motion.div>
                    )}
                    <div className="absolute -bottom-4 left-1/2 -translate-x-1/2 text-[10px] font-bold text-white bg-gray-900/90 px-1.5 rounded">SC-003</div>
                  </div>
                </motion.div>
              )}

              {/* Vehiculo 2 - solo en modo dual */}
              {isDualMode && vehicle2.visible && (
                <motion.div className="absolute z-20" style={{ left: `${8 + vehicle2.x * 0.8}%`, top: `${vehicle2.y}%` }}
                  animate={{ rotate: vehicle2.rotation }} transition={{ type: "spring", stiffness: 80 }}>
                  <div className="relative">
                    <div className="w-16 h-9 bg-gradient-to-b from-orange-400 to-orange-600 rounded-md border-2 border-orange-700 shadow-lg">
                      <div className="absolute top-0.5 right-0.5 w-5 h-5 bg-blue-400/60 rounded-sm border border-blue-300/50" />
                      <div className="absolute bottom-0 left-1.5 w-3 h-3 bg-gray-900 rounded-full border border-gray-600" />
                      <div className="absolute bottom-0 right-1.5 w-3 h-3 bg-gray-900 rounded-full border border-gray-600" />
                    </div>
                    {simulationState === "running" && vehicle2.speed > 0 && (
                      <motion.div className="absolute -top-1 left-0 right-0 flex justify-between px-0.5"
                        animate={{ opacity: [1, 0.3, 1] }} transition={{ repeat: Infinity, duration: 0.2 }}>
                        <div className="w-1.5 h-1.5 bg-orange-300 rounded-full shadow-[0_0_6px_rgba(253,186,116,0.9)]" />
                        <div className="w-1.5 h-1.5 bg-orange-300 rounded-full shadow-[0_0_6px_rgba(253,186,116,0.9)]" />
                      </motion.div>
                    )}
                    <div className="absolute -bottom-4 left-1/2 -translate-x-1/2 text-[10px] font-bold text-white bg-gray-900/90 px-1.5 rounded">SC-007</div>
                  </div>
                </motion.div>
              )}

              {/* Explosion */}
              <AnimatePresence>
                {showExplosion && (
                  <motion.div className="absolute z-30" style={{ left: `${explosionPos.x}%`, top: `${explosionPos.y}%` }}
                    initial={{ scale: 0, opacity: 0 }} animate={{ scale: [0, 2, 2.5, 2], opacity: [0, 1, 1, 0.8] }} transition={{ duration: 0.5 }}>
                    <div className="relative -translate-x-1/2 -translate-y-1/2">
                      <motion.div className="absolute w-32 h-32 rounded-full bg-gradient-to-r from-red-600 via-orange-500 to-yellow-400"
                        animate={{ scale: [1, 1.3, 1], opacity: [1, 0.7, 1] }} transition={{ repeat: Infinity, duration: 0.15 }} />
                      <motion.div className="absolute w-24 h-24 left-4 top-4 rounded-full bg-gradient-to-r from-yellow-400 via-orange-400 to-red-500"
                        animate={{ scale: [1.2, 0.9, 1.2], rotate: [0, 180, 360] }} transition={{ repeat: Infinity, duration: 0.3 }} />
                      <motion.div className="absolute w-16 h-16 left-8 top-8 rounded-full bg-white"
                        animate={{ scale: [1, 1.5, 1], opacity: [1, 0.5, 1] }} transition={{ repeat: Infinity, duration: 0.1 }} />
                      {/* Particulas */}
                      {[...Array(12)].map((_, i) => (
                        <motion.div key={i} className="absolute w-3 h-3 bg-orange-500 rounded-full left-14 top-14"
                          initial={{ x: 0, y: 0, opacity: 1 }}
                          animate={{ x: Math.cos(i * 30 * Math.PI / 180) * 80, y: Math.sin(i * 30 * Math.PI / 180) * 80, opacity: 0, scale: 0 }}
                          transition={{ duration: 0.8, delay: 0.1 }} />
                      ))}
                      {/* Humo */}
                      <motion.div className="absolute w-40 h-40 -left-4 -top-4 rounded-full bg-gray-800/60"
                        initial={{ scale: 0.5, opacity: 0 }} animate={{ scale: 2, opacity: [0, 0.6, 0.3] }} transition={{ duration: 1.5, delay: 0.3 }} />
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Alerta */}
              <AnimatePresence>
                {showAlert && (
                  <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
                    className={`absolute top-3 left-1/2 -translate-x-1/2 px-4 py-2 rounded-lg shadow-xl border-2 z-40 ${
                      alertMessage.includes("COLISION") || alertMessage.includes("ACCIDENTE") ? "bg-red-600 border-red-400 text-white" :
                      alertMessage.includes("PELIGRO") ? "bg-orange-600 border-orange-400 text-white" :
                      alertMessage.includes("ALERTA") ? "bg-yellow-500 border-yellow-400 text-black" :
                      "bg-blue-600 border-blue-400 text-white"
                    }`}>
                    <div className="flex items-center gap-2">
                      <AlertTriangle className="h-4 w-4" />
                      <span className="font-bold text-sm">{alertMessage}</span>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Resultado */}
              <AnimatePresence>
                {simulationState === "success" && (
                  <motion.div initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }} className="absolute inset-0 flex items-center justify-center bg-black/60 z-50">
                    <div className="bg-emerald-600 text-white px-8 py-6 rounded-xl shadow-2xl border-2 border-emerald-400 text-center">
                      <CheckCircle className="h-14 w-14 mx-auto mb-3" />
                      <h2 className="text-xl font-bold mb-2">Operacion Exitosa</h2>
                      <p className="text-sm">{isDualMode ? "Ambos vehiculos cruzaron de forma segura" : "El vehiculo cruzo de forma segura"}</p>
                    </div>
                  </motion.div>
                )}
                {simulationState === "accident" && (
                  <motion.div initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }} className="absolute inset-0 flex items-center justify-center bg-black/60 z-50">
                    <div className="bg-red-600 text-white px-8 py-6 rounded-xl shadow-2xl border-2 border-red-400 text-center">
                      <XCircle className="h-14 w-14 mx-auto mb-3" />
                      <h2 className="text-xl font-bold mb-2">{isDualMode ? "Colision Registrada" : "Accidente Registrado"}</h2>
                      <p className="text-sm">{isDualMode ? "Colision frontal por ignorar semaforos" : "Descarrilamiento hacia el barranco"}</p>
                      <p className="text-xs mt-2 opacity-80">Causa: Exceso de velocidad + Semaforo ignorado</p>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </CardContent>
        </Card>

        {/* Panel lateral */}
        <div className="space-y-4">
          <Card className="bg-card border-border/50">
            <CardHeader className="pb-2"><CardTitle className="text-base">Estado del Sistema</CardTitle></CardHeader>
            <CardContent className="space-y-3">
              <div>
                <div className="flex justify-between text-sm mb-1">
                  <span className="text-muted-foreground">Progreso</span>
                  <span className="font-medium">{Math.round(progress)}%</span>
                </div>
                <Progress value={progress} className="h-2" />
              </div>
              <div className={`grid ${isDualMode ? "grid-cols-2" : "grid-cols-1"} gap-2`}>
                <div className="p-2 rounded-lg bg-muted/30 border border-border/30 text-center">
                  <p className="text-lg font-bold" style={{ color: semaforo1 === "verde" ? "#10b981" : semaforo1 === "amarillo" ? "#eab308" : "#ef4444" }}>
                    {semaforo1.toUpperCase()}
                  </p>
                  <p className="text-[10px] text-muted-foreground">Semaforo 1</p>
                </div>
                {isDualMode && (
                  <div className="p-2 rounded-lg bg-muted/30 border border-border/30 text-center">
                    <p className="text-lg font-bold" style={{ color: semaforo2 === "verde" ? "#10b981" : semaforo2 === "amarillo" ? "#eab308" : "#ef4444" }}>
                      {semaforo2.toUpperCase()}
                    </p>
                    <p className="text-[10px] text-muted-foreground">Semaforo 2</p>
                  </div>
                )}
              </div>
              <div className="p-2 rounded-lg bg-yellow-500/10 border border-yellow-500/30">
                <div className="flex items-center gap-2 mb-1">
                  <Truck className="h-3 w-3 text-yellow-500" />
                  <span className="text-sm font-medium">SC-003</span>
                  <span className={`text-xs ml-auto ${vehicle1.speed > 30 ? "text-red-400" : "text-emerald-400"}`}>{vehicle1.speed} km/h</span>
                </div>
                <p className="text-[10px] text-muted-foreground">Op: Carlos Mendoza</p>
              </div>
              {isDualMode && (
                <div className="p-2 rounded-lg bg-orange-500/10 border border-orange-500/30">
                  <div className="flex items-center gap-2 mb-1">
                    <Truck className="h-3 w-3 text-orange-500" />
                    <span className="text-sm font-medium">SC-007</span>
                    <span className={`text-xs ml-auto ${vehicle2.speed > 30 ? "text-red-400" : "text-emerald-400"}`}>{vehicle2.speed} km/h</span>
                  </div>
                  <p className="text-[10px] text-muted-foreground">Op: Miguel Torres</p>
                </div>
              )}
              <Badge className={`w-full justify-center py-1.5 text-xs ${
                simulationState === "idle" ? "bg-gray-500/20 text-gray-400" :
                simulationState === "running" ? "bg-blue-500/20 text-blue-400" :
                simulationState === "success" ? "bg-emerald-500/20 text-emerald-400" : "bg-red-500/20 text-red-400"
              }`}>
                {simulationState === "idle" ? "Esperando" : simulationState === "running" ? "En curso" : simulationState === "success" ? "Exitoso" : "Accidente"}
              </Badge>
            </CardContent>
          </Card>
          <Card className="bg-card border-border/50">
            <CardHeader className="pb-2"><CardTitle className="text-base">Escenario</CardTitle></CardHeader>
            <CardContent>
              <div className="text-xs text-muted-foreground space-y-1">
                {scenarioType === "single-success" && (<><p className="text-emerald-400 font-medium">1 Vehiculo - Exitoso</p><p>El vehiculo respeta el semaforo y cruza de forma segura.</p></>)}
                {scenarioType === "single-accident" && (<><p className="text-red-400 font-medium">1 Vehiculo - Accidente</p><p>El vehiculo ignora el semaforo y cae al barranco.</p></>)}
                {scenarioType === "dual-success" && (<><p className="text-emerald-400 font-medium">2 Vehiculos - Exitoso</p><p>Los semaforos coordinan el paso seguro de ambos vehiculos.</p></>)}
                {scenarioType === "dual-accident" && (<><p className="text-red-400 font-medium">2 Vehiculos - Colision</p><p>Ambos vehiculos ignoran los semaforos y colisionan frontalmente.</p></>)}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
