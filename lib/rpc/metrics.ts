import { supabase } from "@/lib/supabase/client";

export interface KPIGlobal {
  incidentes_hoy: number;
  incidentes_mes: number;
  alarmas_criticas_hoy: number;
  alarmas_activas: number;
  flota_activa: number;
  flota_total: number;
  trabajadores_turno: number;
  dispositivos_activos: number;
  dispositivos_total: number;
}

export interface ComparativaMinas {
  mina_id: string;
  mina_nombre: string;
  incidentes: number;
  alarmas: number;
  flota_activa: number;
  trabajadores: number;
}

export interface UnidadConMasIncidentes {
  unidad_id: string;
  unidad_codigo: string;
  tipo: string;
  mina_nombre: string;
  total_incidentes: number;
}

export interface ZonaPeligrosa {
  lugar_id: string;
  lugar_nombre: string;
  mina_id: string;
  latitud: number;
  longitud: number;
  nivel_riesgo: number;
  incidentes_count: number;
  alarmas_count: number;
}

export async function obtenerKPIsGlobales(minaId?: string) {
  const { data, error } = await supabase.rpc("rpc_kpis_globales", {
    p_mina_id: minaId,
  });
  if (error) throw error;
  return data as KPIGlobal;
}

export async function obtenerComparativaMinas() {
  const { data, error } = await supabase.rpc("rpc_comparativa_minas");
  if (error) throw error;
  return data as ComparativaMinas[];
}

export async function obtenerTop5UnidadesIncidentes(minaId?: string) {
  const { data, error } = await supabase.rpc("rpc_top_unidades_incidentes", {
    p_mina_id: minaId,
    p_limite: 5,
  });
  if (error) throw error;
  return data as UnidadConMasIncidentes[];
}

export async function obtenerZonasPeligrosas(minaId: string) {
  const { data, error } = await supabase.rpc("rpc_zonas_peligrosas", {
    p_mina_id: minaId,
  });
  if (error) throw error;
  return data as ZonaPeligrosa[];
}

export async function obtenerTendenciaIncidentes(minaId?: string, dias: number = 30) {
  const { data, error } = await supabase.rpc("rpc_tendencia_incidentes", {
    p_mina_id: minaId,
    p_dias: dias,
  });
  if (error) throw error;
  return data as { fecha: string; cantidad: number }[];
}

export async function obtenerDistribucionAlarmas(minaId?: string) {
  const { data, error } = await supabase.rpc("rpc_distribucion_alarmas", {
    p_mina_id: minaId,
  });
  if (error) throw error;
  return data as { tipo: string; cantidad: number; porcentaje: number }[];
}

export async function obtenerEstadisticasFlota(minaId?: string) {
  const { data, error } = await supabase.rpc("rpc_estadisticas_flota", {
    p_mina_id: minaId,
  });
  if (error) throw error;
  return data as {
    por_tipo: { tipo: string; cantidad: number }[];
    por_estado: { estado: string; cantidad: number }[];
  };
}

export async function obtenerActividadReciente(minaId?: string, limite: number = 10) {
  const { data, error } = await supabase.rpc("rpc_actividad_reciente", {
    p_mina_id: minaId,
    p_limite: limite,
  });
  if (error) throw error;
  return data as {
    tipo: "incidente" | "alarma" | "dispositivo" | "semaforo";
    titulo: string;
    descripcion: string;
    severidad?: string;
    created_at: string;
  }[];
}
