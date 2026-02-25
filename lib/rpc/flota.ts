import { supabase } from "@/lib/supabase/client";

export type ClaseFlota = "vehiculo_liviano" | "vehiculo_pesado" | "maquinaria";
export type FamiliaFlota = "camioneta" | "camion" | "bus" | "scooptram" | "dumper" | "jumbo" | "otro";
export type EstadoFlota = "operativo" | "mantenimiento" | "fuera_servicio" | "emergencia";

export interface Flota {
  id_flota: number;
  nombre: string;
  clase: ClaseFlota;
  familia: FamiliaFlota;
  tipo_especifico?: string;
  placa_o_credencial?: string;
  marca?: string;
  modelo?: string;
  anio_fabricacion?: number;
  capacidad_toneladas?: number;
  potencia_hp?: number;
  horas_operacion: number;
  estado: EstadoFlota;
  fecha_ultimo_mantenimiento?: string;
  proximo_mantenimiento?: string;
  creado_en?: string;
  creado_por?: number;
  asignado?: boolean;
}

export interface AsignacionFlota {
  id_asignacion: number;
  id_flota: number;
  id_mina: number;
  id_lugar_actual?: number;
  fecha_inicio: string;
  fecha_fin?: string;
  activo: boolean;
  observaciones?: string;
  creado_en?: string;
}

export async function listarFlota(idMina: number): Promise<Flota[]> {
  const { data, error } = await supabase.rpc("rpc_listar_flota", { p_id_mina: idMina });
  if (error) throw error;
  return (data || []) as Flota[];
}

export async function crearFlota(flota: {
  nombre: string;
  clase: ClaseFlota;
  familia: FamiliaFlota;
  tipo_especifico?: string;
  placa?: string;
  marca?: string;
  modelo?: string;
  anio?: number;
  capacidad?: number;
  potencia_hp?: number;
  id_mina: number;
}): Promise<Flota> {
  const { data, error } = await supabase.rpc("rpc_crear_flota", {
    p_nombre: flota.nombre,
    p_clase: flota.clase,
    p_familia: flota.familia,
    p_tipo_especifico: flota.tipo_especifico || null,
    p_placa: flota.placa || null,
    p_marca: flota.marca || null,
    p_modelo: flota.modelo || null,
    p_anio: flota.anio || null,
    p_capacidad: flota.capacidad || null,
    p_potencia_hp: flota.potencia_hp || null,
    p_id_mina: flota.id_mina,
  });
  if (error) throw error;
  return data as Flota;
}

export async function listarAsignacionesFlota(idMina?: number): Promise<AsignacionFlota[]> {
  let query = supabase.from("asignaciones_flota_mina").select("*");
  
  if (idMina) {
    query = query.eq("id_mina", idMina);
  }
  
  const { data, error } = await query.order("fecha_inicio", { ascending: false });
  if (error) throw error;
  return (data || []) as AsignacionFlota[];
}

export async function asignarFlotaAMina(asignacion: {
  id_flota: number;
  id_mina: number;
  id_lugar_actual?: number;
  observaciones?: string;
}): Promise<AsignacionFlota> {
  const { data, error } = await supabase
    .from("asignaciones_flota_mina")
    .insert({
      id_flota: asignacion.id_flota,
      id_mina: asignacion.id_mina,
      id_lugar_actual: asignacion.id_lugar_actual || null,
      observaciones: asignacion.observaciones || null,
    })
    .select()
    .single();
  
  if (error) throw error;
  return data as AsignacionFlota;
}

// ========== FUNCIONES DE ACTUALIZACIÓN Y ELIMINACIÓN ==========

export async function actualizarFlota(
  id: number,
  flota: Partial<Omit<Flota, "id_flota" | "creado_en" | "creado_por" | "asignado">>
): Promise<Flota> {
  const { data, error } = await supabase
    .from("flota_minera")
    .update(flota)
    .eq("id_flota", id)
    .select()
    .single();
  if (error) throw error;
  return data as Flota;
}

export async function eliminarFlota(id: number): Promise<void> {
  const { error } = await supabase.from("flota_minera").delete().eq("id_flota", id);
  if (error) throw error;
}

export async function actualizarAsignacionFlota(
  id: number,
  asignacion: Partial<Omit<AsignacionFlota, "id_asignacion" | "creado_en">>
): Promise<AsignacionFlota> {
  const { data, error } = await supabase
    .from("asignaciones_flota_mina")
    .update(asignacion)
    .eq("id_asignacion", id)
    .select()
    .single();
  if (error) throw error;
  return data as AsignacionFlota;
}

export async function eliminarAsignacionFlota(id: number): Promise<void> {
  const { error } = await supabase.from("asignaciones_flota_mina").delete().eq("id_asignacion", id);
  if (error) throw error;
}
