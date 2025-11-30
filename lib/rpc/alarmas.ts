import { supabase } from "@/lib/supabase/client";

export interface Alarma {
  id: string;
  tipo: "velocidad" | "proximidad" | "zona_restringida" | "fatiga" | "colision" | "otro";
  severidad: "baja" | "media" | "alta" | "critica";
  mensaje: string;
  unidad_id?: string;
  unidad_codigo?: string;
  lugar_id?: string;
  lugar_nombre?: string;
  mina_id?: string;
  mina_nombre?: string;
  dispositivo_id?: string;
  valor_detectado?: number;
  umbral_configurado?: number;
  estado: "activa" | "reconocida" | "resuelta";
  reconocida_por?: string;
  reconocida_at?: string;
  resuelta_at?: string;
  created_at: string;
}

export interface ConfiguracionAlarma {
  id: string;
  tipo: string;
  nombre: string;
  descripcion?: string;
  valor_minimo?: number;
  valor_maximo?: number;
  condicion: "mayor_que" | "menor_que" | "igual_a" | "entre" | "fuera_de";
  severidad: "baja" | "media" | "alta" | "critica";
  activa: boolean;
  mina_id?: string;
  created_at: string;
  updated_at: string;
}

export async function listarAlarmas(filtros?: {
  tipo?: string;
  severidad?: string;
  estado?: string;
  mina_id?: string;
  fecha_inicio?: string;
  fecha_fin?: string;
}) {
  const { data, error } = await supabase.rpc("rpc_listar_alarmas", {
    p_tipo: filtros?.tipo,
    p_severidad: filtros?.severidad,
    p_estado: filtros?.estado,
    p_mina_id: filtros?.mina_id,
    p_fecha_inicio: filtros?.fecha_inicio,
    p_fecha_fin: filtros?.fecha_fin,
  });
  if (error) throw error;
  return data as Alarma[];
}

export async function obtenerAlarma(id: string) {
  const { data, error } = await supabase.rpc("rpc_obtener_alarma", { p_id: id });
  if (error) throw error;
  return data as Alarma;
}

export async function reconocerAlarma(id: string) {
  const { data, error } = await supabase.rpc("rpc_reconocer_alarma", {
    p_id: id,
  });
  if (error) throw error;
  return data;
}

export async function resolverAlarma(id: string, notas?: string) {
  const { data, error } = await supabase.rpc("rpc_resolver_alarma", {
    p_id: id,
    p_notas: notas,
  });
  if (error) throw error;
  return data;
}

export async function contarAlarmasCriticasHoy() {
  const { data, error } = await supabase.rpc("rpc_contar_alarmas_criticas_hoy");
  if (error) throw error;
  return data as number;
}

export async function obtenerAlarmasPorCategoria(minaId?: string) {
  const { data, error } = await supabase.rpc("rpc_alarmas_por_categoria", {
    p_mina_id: minaId,
  });
  if (error) throw error;
  return data as { categoria: string; cantidad: number }[];
}

// Configuración de alarmas
export async function listarConfiguracionesAlarma(minaId?: string) {
  const { data, error } = await supabase.rpc("rpc_listar_configuraciones_alarma", {
    p_mina_id: minaId,
  });
  if (error) throw error;
  return data as ConfiguracionAlarma[];
}

export async function crearConfiguracionAlarma(
  config: Omit<ConfiguracionAlarma, "id" | "created_at" | "updated_at">
) {
  const { data, error } = await supabase.rpc("rpc_crear_configuracion_alarma", {
    p_tipo: config.tipo,
    p_nombre: config.nombre,
    p_descripcion: config.descripcion,
    p_valor_minimo: config.valor_minimo,
    p_valor_maximo: config.valor_maximo,
    p_condicion: config.condicion,
    p_severidad: config.severidad,
    p_activa: config.activa,
    p_mina_id: config.mina_id,
  });
  if (error) throw error;
  return data;
}

export async function actualizarConfiguracionAlarma(
  id: string,
  config: Partial<ConfiguracionAlarma>
) {
  const { data, error } = await supabase.rpc("rpc_actualizar_configuracion_alarma", {
    p_id: id,
    ...config,
  });
  if (error) throw error;
  return data;
}

export async function eliminarConfiguracionAlarma(id: string) {
  const { data, error } = await supabase.rpc("rpc_eliminar_configuracion_alarma", {
    p_id: id,
  });
  if (error) throw error;
  return data;
}
