"use client";

import { useState, useEffect } from "react";
import { 
  generarTodosLosDatosMock,
  DashboardResumenMock,
  IncidentesPorDiaMock,
  AlarmasPorSeveridadMock,
  IncidentesPorClasificacionMock,
  AlarmaDisparadaMock,
} from "@/lib/mock-data";

// Hook para datos mockup del dashboard con actualización automática
export function useMockDashboard(idMina: number | null, refreshInterval: number = 30000) {
  const [data, setData] = useState(() => generarTodosLosDatosMock());
  const [lastUpdate, setLastUpdate] = useState(new Date());

  useEffect(() => {
    const interval = setInterval(() => {
      setData(generarTodosLosDatosMock());
      setLastUpdate(new Date());
    }, refreshInterval);

    return () => clearInterval(interval);
  }, [refreshInterval]);

  return { data, lastUpdate };
}

// Hook específico para resumen del dashboard
export function useMockDashboardResumen(idMina: number | null) {
  const [resumen, setResumen] = useState(() => generarTodosLosDatosMock().resumen);
  const [lastUpdate, setLastUpdate] = useState(new Date());

  useEffect(() => {
    const interval = setInterval(() => {
      setResumen(generarTodosLosDatosMock().resumen);
      setLastUpdate(new Date());
    }, 30000); // Actualizar cada 30 segundos

    return () => clearInterval(interval);
  }, []);

  return { resumen, lastUpdate };
}

// Hook para incidentes históricos (últimos 7 días)
export function useMockIncidentesHistorico(idMina: number | null) {
  const [incidentes, setIncidentes] = useState(() => generarTodosLosDatosMock().incidentes_7_dias);
  const [lastUpdate, setLastUpdate] = useState(new Date());

  useEffect(() => {
    const interval = setInterval(() => {
      setIncidentes(generarTodosLosDatosMock().incidentes_7_dias);
      setLastUpdate(new Date());
    }, 45000); // Actualizar cada 45 segundos

    return () => clearInterval(interval);
  }, []);

  return { incidentes, lastUpdate };
}

// Hook para alarmas por severidad
export function useMockAlarmasPorSeveridad(idMina: number | null) {
  const [alarmas, setAlarmas] = useState(() => generarTodosLosDatosMock().alarmas_severidad);
  const [lastUpdate, setLastUpdate] = useState(new Date());

  useEffect(() => {
    const interval = setInterval(() => {
      setAlarmas(generarTodosLosDatosMock().alarmas_severidad);
      setLastUpdate(new Date());
    }, 35000); // Actualizar cada 35 segundos

    return () => clearInterval(interval);
  }, []);

  return { alarmas, lastUpdate };
}

// Hook para incidentes por clasificación
export function useMockIncidentesPorClasificacion(idMina: number | null) {
  const [incidentes, setIncidentes] = useState(() => generarTodosLosDatosMock().incidentes_clasificacion);
  const [lastUpdate, setLastUpdate] = useState(new Date());

  useEffect(() => {
    const interval = setInterval(() => {
      setIncidentes(generarTodosLosDatosMock().incidentes_clasificacion);
      setLastUpdate(new Date());
    }, 40000); // Actualizar cada 40 segundos

    return () => clearInterval(interval);
  }, []);

  return { incidentes, lastUpdate };
}

// Hook para alarmas activas
export function useMockAlarmasActivas(idMina: number | null) {
  const [alarmas, setAlarmas] = useState(() => generarTodosLosDatosMock().alarmas_activas);
  const [lastUpdate, setLastUpdate] = useState(new Date());

  useEffect(() => {
    const interval = setInterval(() => {
      setAlarmas(generarTodosLosDatosMock().alarmas_activas);
      setLastUpdate(new Date());
    }, 15000); // Actualizar cada 15 segundos

    return () => clearInterval(interval);
  }, []);

  return { alarmas, lastUpdate };
}

// Hook para últimas alarmas
export function useMockUltimasAlarmas(idMina: number | null) {
  const [alarmas, setAlarmas] = useState(() => generarTodosLosDatosMock().ultimas_alarmas);
  const [lastUpdate, setLastUpdate] = useState(new Date());

  useEffect(() => {
    const interval = setInterval(() => {
      setAlarmas(generarTodosLosDatosMock().ultimas_alarmas);
      setLastUpdate(new Date());
    }, 20000); // Actualizar cada 20 segundos

    return () => clearInterval(interval);
  }, []);

  return { alarmas, lastUpdate };
}

// Hook para estadísticas por mina
export function useMockEstadisticasPorMina(idMina: number | null) {
  const [estadisticas, setEstadisticas] = useState(() => generarTodosLosDatosMock().estadisticas_minas);
  const [lastUpdate, setLastUpdate] = useState(new Date());

  useEffect(() => {
    const interval = setInterval(() => {
      setEstadisticas(generarTodosLosDatosMock().estadisticas_minas);
      setLastUpdate(new Date());
    }, 60000); // Actualizar cada 60 segundos

    return () => clearInterval(interval);
  }, []);

  return { estadisticas, lastUpdate };
}
