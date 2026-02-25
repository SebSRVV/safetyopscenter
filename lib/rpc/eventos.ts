import { supabase } from "@/lib/supabase/client";

export type TipoEvento = "alarma" | "advertencia" | "informativo" | "emergencia";
export type EstadoEvento = "activo" | "revisado" | "resuelto" | "falso_positivo";

export interface Evento {
  id_evento: number;
  tipo_evento: TipoEvento;
  categoria: string;
  descripcion: string;
  severidad: number;
  id_dispositivo?: number;
  id_flota?: number;
  id_lugar?: number;
  id_trabajador?: number;
  latitud?: number;
  longitud?: number;
  altitud_metros?: number;
  datos_adicionales?: Record<string, any>;
  estado: EstadoEvento;
  fecha_resolucion?: string;
  resuelto_por?: number;
  observaciones_resolucion?: string;
  creado_en: string;
}

export interface EventoConDetalles extends Evento {
  nombre_mina?: string;
  nombre_lugar?: string;
  nombre_flota?: string;
  nombre_trabajador?: string;
  nivel_riesgo?: string;
}

export interface Metrica {
  id_metrica: number;
  id_mina: number;
  id_flota?: number;
  tipo_metrica: string;
  valor: number;
  unidad_medida?: string;
  fecha_hora: string;
  datos_contexto?: Record<string, any>;
  creado_en?: string;
}

export interface DashboardGeneral {
  total_minas: number;
  total_flota: number;
  total_trabajadores: number;
  total_dispositivos: number;
  eventos_activos: number;
  mantenimientos_pendientes: number;
}

// ========== FUNCIONES RPC PARA EVENTOS ==========

export async function listarEventosRecientes(limite: number = 50, idMina?: number): Promise<EventoConDetalles[]> {
  const { data, error } = await supabase.rpc("rpc_listar_eventos_recientes", {
    p_limite: limite,
    p_id_mina: idMina || null,
  });
  if (error) throw error;
  return (data || []) as EventoConDetalles[];
}

export async function crearEvento(evento: {
  tipo_evento: TipoEvento;
  categoria: string;
  descripcion: string;
  severidad: number;
  id_dispositivo?: number;
  id_flota?: number;
  id_lugar?: number;
  id_trabajador?: number;
  latitud?: number;
  longitud?: number;
  altitud_metros?: number;
  datos_adicionales?: Record<string, any>;
}): Promise<Evento> {
  const { data, error } = await supabase.rpc("rpc_crear_evento", {
    p_tipo_evento: evento.tipo_evento,
    p_categoria: evento.categoria,
    p_descripcion: evento.descripcion,
    p_severidad: evento.severidad,
    p_id_dispositivo: evento.id_dispositivo || null,
    p_id_flota: evento.id_flota || null,
    p_id_lugar: evento.id_lugar || null,
    p_id_trabajador: evento.id_trabajador || null,
    p_latitud: evento.latitud || null,
    p_longitud: evento.longitud || null,
    p_altitud_metros: evento.altitud_metros || null,
    p_datos_adicionales: evento.datos_adicionales || null,
  });
  if (error) throw error;
  return data as Evento;
}

export async function obtenerEvento(id: number): Promise<Evento | null> {
  const { data, error } = await supabase
    .from("eventos_alarmas")
    .select("*")
    .eq("id_evento", id)
    .single();
  if (error) throw error;
  return data as Evento | null;
}

export async function buscarEventosPorTipo(tipo: TipoEvento, limite?: number): Promise<Evento[]> {
  let query = supabase
    .from("eventos_alarmas")
    .select("*")
    .eq("tipo_evento", tipo)
    .order("creado_en", { ascending: false });
  
  if (limite) {
    query = query.limit(limite);
  }
  
  const { data, error } = await query;
  if (error) throw error;
  return (data || []) as Evento[];
}

export async function buscarEventosPorSeveridad(severidadMin: number, severidadMax: number): Promise<Evento[]> {
  const { data, error } = await supabase
    .from("eventos_alarmas")
    .select("*")
    .gte("severidad", severidadMin)
    .lte("severidad", severidadMax)
    .eq("estado", "activo")
    .order("severidad", { ascending: false })
    .order("creado_en", { ascending: false });
  
  if (error) throw error;
  return (data || []) as Evento[];
}

export async function listarEventosCriticos(): Promise<EventoConDetalles[]> {
  const { data, error } = await supabase
    .from("vw_eventos_criticos")
    .select("*")
    .order("severidad", { ascending: false })
    .order("creado_en", { ascending: false })
    .limit(20);
  
  if (error) throw error;
  return (data || []) as EventoConDetalles[];
}

// ========== FUNCIONES RPC PARA MÉTRICAS ==========

export async function listarMetricasPorMina(
  idMina: number,
  fechaInicio?: string,
  fechaFin?: string
): Promise<Metrica[]> {
  const { data, error } = await supabase.rpc("rpc_metricas_por_mina", {
    p_id_mina: idMina,
    p_fecha_inicio: fechaInicio || null,
    p_fecha_fin: fechaFin || null,
  });
  if (error) throw error;
  return (data || []) as Metrica[];
}

export async function crearMetrica(metrica: {
  id_mina: number;
  id_flota?: number;
  tipo_metrica: string;
  valor: number;
  unidad_medida?: string;
  datos_contexto?: Record<string, any>;
}): Promise<Metrica> {
  const { data, error } = await supabase.rpc("rpc_crear_metrica", {
    p_id_mina: metrica.id_mina,
    p_id_flota: metrica.id_flota || null,
    p_tipo_metrica: metrica.tipo_metrica,
    p_valor: metrica.valor,
    p_unidad_medida: metrica.unidad_medida || null,
    p_datos_contexto: metrica.datos_contexto || null,
  });
  if (error) throw error;
  return data as Metrica;
}

export async function obtenerMetricasRecientes(idMina?: number, limite: number = 100): Promise<Metrica[]> {
  let query = supabase
    .from("metricas_operacion")
    .select("*")
    .order("fecha_hora", { ascending: false })
    .limit(limite);
  
  if (idMina) {
    query = query.eq("id_mina", idMina);
  }
  
  const { data, error } = await query;
  if (error) throw error;
  return (data || []) as Metrica[];
}

export async function obtenerMetricasPorTipo(
  tipoMetrica: string,
  idMina?: number,
  dias: number = 30
): Promise<Metrica[]> {
  const fechaInicio = new Date();
  fechaInicio.setDate(fechaInicio.getDate() - dias);
  
  let query = supabase
    .from("metricas_operacion")
    .select("*")
    .eq("tipo_metrica", tipoMetrica)
    .gte("fecha_hora", fechaInicio.toISOString())
    .order("fecha_hora", { ascending: false });
  
  if (idMina) {
    query = query.eq("id_mina", idMina);
  }
  
  const { data, error } = await query;
  if (error) throw error;
  return (data || []) as Metrica[];
}

// ========== FUNCIONES RPC PARA DASHBOARD ==========

export async function obtenerDashboardGeneral(): Promise<DashboardGeneral> {
  const { data, error } = await supabase.rpc("rpc_dashboard_general");
  if (error) throw error;
  return data as DashboardGeneral;
}

export async function obtenerEstadisticasMina(idMina: number): Promise<any> {
  const { data, error } = await supabase.rpc("rpc_estadisticas_mina", {
    p_id_mina: idMina,
  });
  if (error) throw error;
  return data;
}

// ========== FUNCIONES DE ACTUALIZACIÓN ==========

export async function actualizarEvento(
  id: number,
  evento: Partial<Omit<Evento, "id_evento" | "creado_en">>
): Promise<Evento> {
  const { data, error } = await supabase
    .from("eventos_alarmas")
    .update(evento)
    .eq("id_evento", id)
    .select()
    .single();
  if (error) throw error;
  return data as Evento;
}

export async function resolverEvento(
  id: number,
  observaciones: string,
  idResueltoPor: number
): Promise<Evento> {
  const { data, error } = await supabase
    .from("eventos_alarmas")
    .update({
      estado: "resuelto",
      fecha_resolucion: new Date().toISOString(),
      resuelto_por: idResueltoPor,
      observaciones_resolucion: observaciones,
    })
    .eq("id_evento", id)
    .select()
    .single();
  if (error) throw error;
  return data as Evento;
}

export async function actualizarMetrica(
  id: number,
  metrica: Partial<Omit<Metrica, "id_metrica" | "creado_en">>
): Promise<Metrica> {
  const { data, error } = await supabase
    .from("metricas_operacion")
    .update(metrica)
    .eq("id_metrica", id)
    .select()
    .single();
  if (error) throw error;
  return data as Metrica;
}
