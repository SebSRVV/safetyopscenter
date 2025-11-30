import { supabase } from "@/lib/supabase/client";

export interface Incidente {
  id: string;
  tipo: "accidente" | "cuasi_accidente" | "incidente_ambiental" | "falla_equipo" | "otro";
  severidad: "leve" | "moderado" | "grave" | "fatal";
  titulo: string;
  descripcion: string;
  fecha_hora: string;
  unidad_id?: string;
  unidad_codigo?: string;
  lugar_id?: string;
  lugar_nombre?: string;
  mina_id: string;
  mina_nombre?: string;
  trabajador_id?: string;
  trabajador_nombre?: string;
  latitud?: number;
  longitud?: number;
  danos?: string;
  causa_probable?: string;
  acciones_correctivas?: string;
  estado: "reportado" | "en_investigacion" | "cerrado";
  reportado_por?: string;
  created_at: string;
  updated_at: string;
}

export interface TimelineEvento {
  id: string;
  incidente_id: string;
  tipo: "creacion" | "actualizacion" | "comentario" | "cambio_estado";
  descripcion: string;
  usuario_id?: string;
  usuario_nombre?: string;
  created_at: string;
}

export async function listarIncidentes(filtros?: {
  tipo?: string;
  severidad?: string;
  estado?: string;
  mina_id?: string;
  fecha_inicio?: string;
  fecha_fin?: string;
}) {
  const { data, error } = await supabase.rpc("rpc_listar_incidentes", {
    p_tipo: filtros?.tipo,
    p_severidad: filtros?.severidad,
    p_estado: filtros?.estado,
    p_mina_id: filtros?.mina_id,
    p_fecha_inicio: filtros?.fecha_inicio,
    p_fecha_fin: filtros?.fecha_fin,
  });
  if (error) throw error;
  return data as Incidente[];
}

export async function obtenerIncidente(id: string) {
  const { data, error } = await supabase.rpc("rpc_obtener_incidente", {
    p_id: id,
  });
  if (error) throw error;
  return data as Incidente;
}

export async function crearIncidente(
  incidente: Omit<Incidente, "id" | "created_at" | "updated_at" | "mina_nombre" | "unidad_codigo" | "lugar_nombre" | "trabajador_nombre">
) {
  const { data, error } = await supabase.rpc("rpc_crear_incidente", {
    p_tipo: incidente.tipo,
    p_severidad: incidente.severidad,
    p_titulo: incidente.titulo,
    p_descripcion: incidente.descripcion,
    p_fecha_hora: incidente.fecha_hora,
    p_unidad_id: incidente.unidad_id,
    p_lugar_id: incidente.lugar_id,
    p_mina_id: incidente.mina_id,
    p_trabajador_id: incidente.trabajador_id,
    p_latitud: incidente.latitud,
    p_longitud: incidente.longitud,
    p_danos: incidente.danos,
    p_causa_probable: incidente.causa_probable,
    p_acciones_correctivas: incidente.acciones_correctivas,
    p_estado: incidente.estado,
  });
  if (error) throw error;
  return data;
}

export async function actualizarIncidente(id: string, incidente: Partial<Incidente>) {
  const { data, error } = await supabase.rpc("rpc_actualizar_incidente", {
    p_id: id,
    ...incidente,
  });
  if (error) throw error;
  return data;
}

export async function cambiarEstadoIncidente(id: string, estado: Incidente["estado"]) {
  const { data, error } = await supabase.rpc("rpc_cambiar_estado_incidente", {
    p_id: id,
    p_estado: estado,
  });
  if (error) throw error;
  return data;
}

export async function contarIncidentesHoy(minaId?: string) {
  const { data, error } = await supabase.rpc("rpc_contar_incidentes_hoy", {
    p_mina_id: minaId,
  });
  if (error) throw error;
  return data as number;
}

export async function obtenerIncidentesUltimos30Dias(minaId?: string) {
  const { data, error } = await supabase.rpc("rpc_incidentes_ultimos_30_dias", {
    p_mina_id: minaId,
  });
  if (error) throw error;
  return data as { fecha: string; cantidad: number }[];
}

export async function obtenerTimelineIncidente(incidenteId: string) {
  const { data, error } = await supabase.rpc("rpc_timeline_incidente", {
    p_incidente_id: incidenteId,
  });
  if (error) throw error;
  return data as TimelineEvento[];
}

export async function agregarComentarioIncidente(incidenteId: string, comentario: string) {
  const { data, error } = await supabase.rpc("rpc_agregar_comentario_incidente", {
    p_incidente_id: incidenteId,
    p_comentario: comentario,
  });
  if (error) throw error;
  return data;
}
