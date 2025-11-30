import { supabase } from "@/lib/supabase/client";

export interface Unidad {
  id: string;
  codigo: string;
  tipo: "camion" | "excavadora" | "cargador" | "perforadora" | "vehiculo_liviano" | "otro";
  marca: string;
  modelo: string;
  anio: number;
  mina_id: string;
  mina_nombre?: string;
  estado: "activo" | "inactivo" | "mantenimiento" | "fuera_servicio";
  dispositivo_id?: string;
  ultima_ubicacion?: {
    latitud: number;
    longitud: number;
    timestamp: string;
  };
  created_at: string;
  updated_at: string;
}

export interface Telemetria {
  id: string;
  unidad_id: string;
  velocidad: number;
  latitud: number;
  longitud: number;
  rumbo: number;
  motor_encendido: boolean;
  nivel_combustible?: number;
  timestamp: string;
}

export async function listarFlota(minaId?: string) {
  const params = minaId ? { p_mina_id: minaId } : {};
  const { data, error } = await supabase.rpc("rpc_listar_flota", params);
  if (error) throw error;
  return data as Unidad[];
}

export async function obtenerUnidad(id: string) {
  const { data, error } = await supabase.rpc("rpc_obtener_unidad", { p_id: id });
  if (error) throw error;
  return data as Unidad;
}

export async function crearUnidad(unidad: Omit<Unidad, "id" | "created_at" | "updated_at" | "mina_nombre" | "ultima_ubicacion">) {
  const { data, error } = await supabase.rpc("rpc_crear_unidad", {
    p_codigo: unidad.codigo,
    p_tipo: unidad.tipo,
    p_marca: unidad.marca,
    p_modelo: unidad.modelo,
    p_anio: unidad.anio,
    p_mina_id: unidad.mina_id,
    p_estado: unidad.estado,
  });
  if (error) throw error;
  return data;
}

export async function actualizarUnidad(id: string, unidad: Partial<Unidad>) {
  const { data, error } = await supabase.rpc("rpc_actualizar_unidad", {
    p_id: id,
    ...unidad,
  });
  if (error) throw error;
  return data;
}

export async function eliminarUnidad(id: string) {
  const { data, error } = await supabase.rpc("rpc_eliminar_unidad", { p_id: id });
  if (error) throw error;
  return data;
}

export async function asignarDispositivoUnidad(unidadId: string, dispositivoId: string) {
  const { data, error } = await supabase.rpc("rpc_asignar_dispositivo_unidad", {
    p_unidad_id: unidadId,
    p_dispositivo_id: dispositivoId,
  });
  if (error) throw error;
  return data;
}

export async function obtenerTelemetriaUnidad(unidadId: string, limite: number = 100) {
  const { data, error } = await supabase.rpc("rpc_obtener_telemetria_unidad", {
    p_unidad_id: unidadId,
    p_limite: limite,
  });
  if (error) throw error;
  return data as Telemetria[];
}

export async function obtenerRutaUnidad(unidadId: string, fechaInicio: string, fechaFin: string) {
  const { data, error } = await supabase.rpc("rpc_obtener_ruta_unidad", {
    p_unidad_id: unidadId,
    p_fecha_inicio: fechaInicio,
    p_fecha_fin: fechaFin,
  });
  if (error) throw error;
  return data as Telemetria[];
}
