import { supabase } from "@/lib/supabase/client";

// ========== INTERFACES COMPLETAS ==========

export interface Mina {
  id_mina: number;
  nombre: string;
  codigo: string;
  ubicacion: string;
  departamento?: string;
  provincia?: string;
  distrito?: string;
  latitud?: number;
  longitud?: number;
  altitud_metros?: number;
  empresa: string;
  tipo_mina: "subterranea" | "superficial" | "mixta";
  mineral_principal?: string;
  produccion_anual_toneladas?: number;
  numero_trabajadores?: number;
  activa: boolean;
  creado_en?: string;
  creado_por?: number;
}

export interface Lugar {
  id_lugar: number;
  id_mina: number;
  nombre: string;
  tipo: "cruce" | "rampa" | "galeria" | "taller" | "superficie" | "otro";
  descripcion?: string;
  latitud?: number;
  longitud?: number;
  altitud_metros?: number;
  nivel_profundidad_metros?: number;
  capacidad_vehiculos?: number;
  estado: "operativo" | "mantenimiento" | "cerrado" | "emergencia";
  creado_en?: string;
  creado_por?: number;
}

export interface EstadisticasMina {
  nombre_mina: string;
  flota_operativa: number;
  flota_mantenimiento: number;
  dispositivos_online: number;
  eventos_dia: number;
  trabajadores_activos: number;
  ultima_actualizacion: string;
}

// ========== FUNCIONES RPC ==========

export async function listarMinas(): Promise<Mina[]> {
  const { data, error } = await supabase.rpc("rpc_listar_minas");
  if (error) throw error;
  return (data || []) as Mina[];
}

export async function obtenerMina(id: number): Promise<Mina | null> {
  const { data, error } = await supabase.rpc("rpc_obtener_mina", { p_id: id });
  if (error) throw error;
  return data as Mina | null;
}

export async function crearMina(mina: {
  nombre: string;
  codigo: string;
  ubicacion: string;
  empresa: string;
  departamento?: string;
  provincia?: string;
  distrito?: string;
  latitud?: number;
  longitud?: number;
  altitud_metros?: number;
  tipo_mina?: "subterranea" | "superficial" | "mixta";
  mineral_principal?: string;
  produccion_anual_toneladas?: number;
  numero_trabajadores?: number;
}): Promise<Mina> {
  const { data, error } = await supabase.rpc("rpc_crear_mina", {
    p_nombre: mina.nombre,
    p_codigo: mina.codigo,
    p_ubicacion: mina.ubicacion,
    p_empresa: mina.empresa,
    p_departamento: mina.departamento || null,
    p_provincia: mina.provincia || null,
    p_distrito: mina.distrito || null,
    p_latitud: mina.latitud || null,
    p_longitud: mina.longitud || null,
    p_altitud_metros: mina.altitud_metros || null,
    p_tipo_mina: mina.tipo_mina || "subterranea",
    p_mineral_principal: mina.mineral_principal || null,
    p_produccion_anual_toneladas: mina.produccion_anual_toneladas || null,
    p_numero_trabajadores: mina.numero_trabajadores || null,
  });
  if (error) throw error;
  return data as Mina;
}

export async function listarLugaresPorMina(idMina: number): Promise<Lugar[]> {
  const { data, error } = await supabase.rpc("rpc_lugares_por_mina", {
    p_id_mina: idMina,
  });
  if (error) throw error;
  return (data || []) as Lugar[];
}

export async function crearLugar(lugar: {
  id_mina: number;
  nombre: string;
  tipo: Lugar["tipo"];
  descripcion?: string;
  latitud?: number;
  longitud?: number;
  altitud_metros?: number;
  nivel_profundidad_metros?: number;
  capacidad_vehiculos?: number;
}): Promise<Lugar> {
  const { data, error } = await supabase.rpc("rpc_crear_lugar", {
    p_id_mina: lugar.id_mina,
    p_nombre: lugar.nombre,
    p_tipo: lugar.tipo,
    p_descripcion: lugar.descripcion || null,
    p_latitud: lugar.latitud || null,
    p_longitud: lugar.longitud || null,
    p_altitud_metros: lugar.altitud_metros || null,
    p_nivel_profundidad_metros: lugar.nivel_profundidad_metros || null,
    p_capacidad_vehiculos: lugar.capacidad_vehiculos || null,
  });
  if (error) throw error;
  return data as Lugar;
}

export async function obtenerEstadisticasMina(idMina: number): Promise<EstadisticasMina | null> {
  const { data, error } = await supabase.rpc("rpc_estadisticas_mina", {
    p_id_mina: idMina,
  });
  if (error) throw error;
  return data as EstadisticasMina | null;
}

// ========== FUNCIONES DE ACTUALIZACIÓN Y ELIMINACIÓN ==========

export async function actualizarMina(
  id: number,
  mina: Partial<Omit<Mina, "id_mina" | "creado_en" | "creado_por">>
): Promise<Mina> {
  const { data, error } = await supabase
    .from("minas")
    .update(mina)
    .eq("id_mina", id)
    .select()
    .single();
  if (error) throw error;
  return data as Mina;
}

export async function eliminarMina(id: number): Promise<void> {
  const { error } = await supabase.from("minas").delete().eq("id_mina", id);
  if (error) throw error;
}

export async function actualizarLugar(
  id: number,
  lugar: Partial<Omit<Lugar, "id_lugar" | "creado_en" | "creado_por">>
): Promise<Lugar> {
  const { data, error } = await supabase
    .from("lugar_de_los_dispositivos")
    .update(lugar)
    .eq("id_lugar", id)
    .select()
    .single();
  if (error) throw error;
  return data as Lugar;
}

export async function eliminarLugar(id: number): Promise<void> {
  const { error } = await supabase.from("lugar_de_los_dispositivos").delete().eq("id_lugar", id);
  if (error) throw error;
}
