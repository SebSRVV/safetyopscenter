import { supabase } from "@/lib/supabase/client";

export interface Dispositivo {
  id: string;
  codigo: string;
  tipo: "gps" | "semaforo" | "sensor_velocidad" | "sensor_proximidad" | "camara" | "otro";
  marca?: string;
  modelo?: string;
  numero_serie?: string;
  estado: "activo" | "inactivo" | "error" | "desconectado";
  unidad_id?: string;
  lugar_id?: string;
  ultima_lectura?: {
    valor: unknown;
    timestamp: string;
  };
  created_at: string;
  updated_at: string;
}

export async function listarDispositivos(filtros?: {
  tipo?: string;
  estado?: string;
  mina_id?: string;
}) {
  const { data, error } = await supabase.rpc("rpc_listar_dispositivos", {
    p_tipo: filtros?.tipo,
    p_estado: filtros?.estado,
    p_mina_id: filtros?.mina_id,
  });
  if (error) throw error;
  return data as Dispositivo[];
}

export async function obtenerDispositivo(id: string) {
  const { data, error } = await supabase.rpc("rpc_obtener_dispositivo", {
    p_id: id,
  });
  if (error) throw error;
  return data as Dispositivo;
}

export async function crearDispositivo(
  dispositivo: Omit<Dispositivo, "id" | "created_at" | "updated_at" | "ultima_lectura">
) {
  const { data, error } = await supabase.rpc("rpc_crear_dispositivo", {
    p_codigo: dispositivo.codigo,
    p_tipo: dispositivo.tipo,
    p_marca: dispositivo.marca,
    p_modelo: dispositivo.modelo,
    p_numero_serie: dispositivo.numero_serie,
    p_estado: dispositivo.estado,
  });
  if (error) throw error;
  return data;
}

export async function actualizarDispositivo(id: string, dispositivo: Partial<Dispositivo>) {
  const { data, error } = await supabase.rpc("rpc_actualizar_dispositivo", {
    p_id: id,
    ...dispositivo,
  });
  if (error) throw error;
  return data;
}

export async function eliminarDispositivo(id: string) {
  const { data, error } = await supabase.rpc("rpc_eliminar_dispositivo", {
    p_id: id,
  });
  if (error) throw error;
  return data;
}

export async function asignarDispositivoUnidad(dispositivoId: string, unidadId: string) {
  const { data, error } = await supabase.rpc("rpc_asignar_dispositivo_a_unidad", {
    p_dispositivo_id: dispositivoId,
    p_unidad_id: unidadId,
  });
  if (error) throw error;
  return data;
}

export async function asignarDispositivoLugar(dispositivoId: string, lugarId: string) {
  const { data, error } = await supabase.rpc("rpc_asignar_dispositivo_a_lugar", {
    p_dispositivo_id: dispositivoId,
    p_lugar_id: lugarId,
  });
  if (error) throw error;
  return data;
}

export async function obtenerUltimaLectura(dispositivoId: string) {
  const { data, error } = await supabase.rpc("rpc_obtener_ultima_lectura", {
    p_dispositivo_id: dispositivoId,
  });
  if (error) throw error;
  return data;
}
