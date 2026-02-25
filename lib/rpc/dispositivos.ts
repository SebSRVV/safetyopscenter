import { supabase } from "@/lib/supabase/client";

export type TipoDispositivo = "gps" | "semaforo" | "proximidad" | "sensor_gas" | "velocimetro" | "camara" | "sensor_temperatura" | "sensor_vibracion" | "otro";
export type EstadoDispositivo = "online" | "offline" | "mantenimiento" | "error";

export interface Dispositivo {
  id_dispositivo: number;
  codigo: string;
  tipo: TipoDispositivo;
  marca_modelo?: string;
  numero_serie?: string;
  firmware_version?: string;
  bateria_porcentaje?: number;
  estado: EstadoDispositivo;
  fecha_ultima_transmision?: string;
  creado_en?: string;
  creado_por?: number;
}

export interface DispositivoAsignado {
  id_dispositivo: number;
  codigo: string;
  tipo: TipoDispositivo;
  marca_modelo?: string;
  estado: EstadoDispositivo;
  bateria_porcentaje?: number;
  fecha_ultima_transmision?: string;
  id_flota?: number;
  id_lugar?: number;
  id_trabajador?: number;
  nombre_flota?: string;
  nombre_lugar?: string;
  nombre_trabajador?: string;
  nombre_mina?: string;
  fecha_instalacion?: string;
  configuracion?: Record<string, any>;
}

export interface AsignacionDispositivo {
  id_asignacion: number;
  id_dispositivo: number;
  id_flota?: number;
  id_lugar?: number;
  id_trabajador?: number;
  fecha_instalacion: string;
  fecha_retiro?: string;
  activo: boolean;
  configuracion?: Record<string, any>;
  creado_en?: string;
}

// ========== FUNCIONES RPC ==========

export async function listarDispositivos(): Promise<Dispositivo[]> {
  const { data, error } = await supabase.rpc("rpc_listar_dispositivos");
  if (error) throw error;
  return (data || []) as Dispositivo[];
}

export async function crearDispositivo(dispositivo: {
  codigo: string;
  tipo: TipoDispositivo;
  marca_modelo?: string;
  numero_serie?: string;
  firmware_version?: string;
  bateria_porcentaje?: number;
}): Promise<Dispositivo> {
  const { data, error } = await supabase.rpc("rpc_crear_dispositivo", {
    p_codigo: dispositivo.codigo,
    p_tipo: dispositivo.tipo,
    p_marca_modelo: dispositivo.marca_modelo || null,
    p_numero_serie: dispositivo.numero_serie || null,
    p_firmware_version: dispositivo.firmware_version || null,
    p_bateria_porcentaje: dispositivo.bateria_porcentaje || 100,
  });
  if (error) throw error;
  return data as Dispositivo;
}

export async function obtenerDispositivo(id: number): Promise<Dispositivo | null> {
  const { data, error } = await supabase
    .from("dispositivos_iot")
    .select("*")
    .eq("id_dispositivo", id)
    .single();
  if (error) throw error;
  return data as Dispositivo | null;
}

export async function listarDispositivosAsignados(): Promise<DispositivoAsignado[]> {
  const { data, error } = await supabase
    .from("vw_dispositivos_asignados")
    .select("*")
    .order("codigo");
  if (error) throw error;
  return (data || []) as DispositivoAsignado[];
}

export async function buscarDispositivosPorTipo(tipo: TipoDispositivo): Promise<Dispositivo[]> {
  const { data, error } = await supabase
    .from("dispositivos_iot")
    .select("*")
    .eq("tipo", tipo)
    .order("codigo");
  if (error) throw error;
  return (data || []) as Dispositivo[];
}

export async function buscarDispositivosPorEstado(estado: EstadoDispositivo): Promise<Dispositivo[]> {
  const { data, error } = await supabase
    .from("dispositivos_iot")
    .select("*")
    .eq("estado", estado)
    .order("codigo");
  if (error) throw error;
  return (data || []) as Dispositivo[];
}

// ========== FUNCIONES DE ASIGNACIÓN ==========

export async function asignarDispositivo(asignacion: {
  id_dispositivo: number;
  id_flota?: number;
  id_lugar?: number;
  id_trabajador?: number;
  configuracion?: Record<string, any>;
}): Promise<AsignacionDispositivo> {
  const { data, error } = await supabase
    .from("asignaciones_dispositivos")
    .insert({
      id_dispositivo: asignacion.id_dispositivo,
      id_flota: asignacion.id_flota || null,
      id_lugar: asignacion.id_lugar || null,
      id_trabajador: asignacion.id_trabajador || null,
      configuracion: asignacion.configuracion || null,
    })
    .select()
    .single();
  
  if (error) throw error;
  return data as AsignacionDispositivo;
}

export async function desasignarDispositivo(idAsignacion: number): Promise<void> {
  const { error } = await supabase
    .from("asignaciones_dispositivos")
    .update({ 
      activo: false, 
      fecha_retiro: new Date().toISOString() 
    })
    .eq("id_asignacion", idAsignacion);
  
  if (error) throw error;
}

export async function listarAsignacionesDispositivos(): Promise<AsignacionDispositivo[]> {
  const { data, error } = await supabase
    .from("asignaciones_dispositivos")
    .select("*")
    .eq("activo", true)
    .order("fecha_instalacion", { ascending: false });
  
  if (error) throw error;
  return (data || []) as AsignacionDispositivo[];
}

// ========== FUNCIONES DE ACTUALIZACIÓN Y ELIMINACIÓN ==========

export async function actualizarDispositivo(
  id: number,
  dispositivo: Partial<Omit<Dispositivo, "id_dispositivo" | "creado_en" | "creado_por">>
): Promise<Dispositivo> {
  const { data, error } = await supabase
    .from("dispositivos_iot")
    .update(dispositivo)
    .eq("id_dispositivo", id)
    .select()
    .single();
  if (error) throw error;
  return data as Dispositivo;
}

export async function actualizarEstadoDispositivo(id: number, estado: EstadoDispositivo): Promise<Dispositivo> {
  const { data, error } = await supabase
    .from("dispositivos_iot")
    .update({ 
      estado,
      fecha_ultima_transmision: new Date().toISOString()
    })
    .eq("id_dispositivo", id)
    .select()
    .single();
  if (error) throw error;
  return data as Dispositivo;
}

export async function eliminarDispositivo(id: number): Promise<void> {
  const { error } = await supabase.from("dispositivos_iot").delete().eq("id_dispositivo", id);
  if (error) throw error;
}
