import { supabase } from "@/lib/supabase/client";

export interface Semaforo {
  id: string;
  codigo: string;
  nombre: string;
  lugar_id: string;
  lugar_nombre?: string;
  mina_id: string;
  mina_nombre?: string;
  latitud: number;
  longitud: number;
  estado_actual: "verde" | "amarillo" | "rojo" | "apagado" | "intermitente";
  modo: "automatico" | "manual" | "emergencia";
  dispositivo_id?: string;
  created_at: string;
  updated_at: string;
}

export interface HistorialSemaforo {
  id: string;
  semaforo_id: string;
  estado_anterior: string;
  estado_nuevo: string;
  motivo?: string;
  usuario_id?: string;
  created_at: string;
}

export interface FaseSemaforo {
  id: string;
  semaforo_id: string;
  nombre: string;
  estado: "verde" | "amarillo" | "rojo";
  duracion_segundos: number;
  orden: number;
}

export interface SimulacionSemaforo {
  semaforo_id: string;
  fases: FaseSemaforo[];
  ciclo_total_segundos: number;
  estado_actual: string;
  tiempo_restante_fase: number;
}

export async function listarSemaforos(minaId?: string) {
  const { data, error } = await supabase.rpc("rpc_listar_semaforos", {
    p_mina_id: minaId,
  });
  if (error) throw error;
  return data as Semaforo[];
}

export async function obtenerSemaforo(id: string) {
  const { data, error } = await supabase.rpc("rpc_obtener_semaforo", {
    p_id: id,
  });
  if (error) throw error;
  return data as Semaforo;
}

export async function crearSemaforo(
  semaforo: Omit<Semaforo, "id" | "created_at" | "updated_at" | "lugar_nombre" | "mina_nombre">
) {
  const { data, error } = await supabase.rpc("rpc_crear_semaforo", {
    p_codigo: semaforo.codigo,
    p_nombre: semaforo.nombre,
    p_lugar_id: semaforo.lugar_id,
    p_mina_id: semaforo.mina_id,
    p_latitud: semaforo.latitud,
    p_longitud: semaforo.longitud,
    p_estado_actual: semaforo.estado_actual,
    p_modo: semaforo.modo,
  });
  if (error) throw error;
  return data;
}

export async function cambiarEstadoSemaforo(
  id: string,
  estado: Semaforo["estado_actual"],
  motivo?: string
) {
  const { data, error } = await supabase.rpc("rpc_cambiar_estado_semaforo", {
    p_id: id,
    p_estado: estado,
    p_motivo: motivo,
  });
  if (error) throw error;
  return data;
}

export async function cambiarModoSemaforo(id: string, modo: Semaforo["modo"]) {
  const { data, error } = await supabase.rpc("rpc_cambiar_modo_semaforo", {
    p_id: id,
    p_modo: modo,
  });
  if (error) throw error;
  return data;
}

export async function obtenerHistorialSemaforo(semaforoId: string, limite: number = 50) {
  const { data, error } = await supabase.rpc("rpc_historial_semaforo", {
    p_semaforo_id: semaforoId,
    p_limite: limite,
  });
  if (error) throw error;
  return data as HistorialSemaforo[];
}

export async function obtenerFasesSemaforo(semaforoId: string) {
  const { data, error } = await supabase.rpc("rpc_fases_semaforo", {
    p_semaforo_id: semaforoId,
  });
  if (error) throw error;
  return data as FaseSemaforo[];
}

export async function configurarFasesSemaforo(semaforoId: string, fases: Omit<FaseSemaforo, "id" | "semaforo_id">[]) {
  const { data, error } = await supabase.rpc("rpc_configurar_fases_semaforo", {
    p_semaforo_id: semaforoId,
    p_fases: fases,
  });
  if (error) throw error;
  return data;
}

export async function obtenerSimulacionSemaforo(semaforoId: string) {
  const { data, error } = await supabase.rpc("rpc_simulacion_semaforo", {
    p_semaforo_id: semaforoId,
  });
  if (error) throw error;
  return data as SimulacionSemaforo;
}

export async function eliminarSemaforo(id: string) {
  const { data, error } = await supabase.rpc("rpc_eliminar_semaforo", {
    p_id: id,
  });
  if (error) throw error;
  return data;
}
