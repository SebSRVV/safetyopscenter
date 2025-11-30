import { supabase } from "@/lib/supabase/client";

export interface Mina {
  id: string;
  nombre: string;
  ubicacion: string;
  latitud: number;
  longitud: number;
  estado: "activa" | "inactiva" | "mantenimiento";
  created_at: string;
  updated_at: string;
}

export interface Lugar {
  id: string;
  mina_id: string;
  nombre: string;
  tipo: string;
  latitud: number;
  longitud: number;
  descripcion?: string;
  created_at: string;
}

export async function listarMinas() {
  const { data, error } = await supabase.rpc("rpc_listar_minas");
  if (error) throw error;
  return data as Mina[];
}

export async function obtenerMina(id: string) {
  const { data, error } = await supabase.rpc("rpc_obtener_mina", { p_id: id });
  if (error) throw error;
  return data as Mina;
}

export async function crearMina(mina: Omit<Mina, "id" | "created_at" | "updated_at">) {
  const { data, error } = await supabase.rpc("rpc_crear_mina", {
    p_nombre: mina.nombre,
    p_ubicacion: mina.ubicacion,
    p_latitud: mina.latitud,
    p_longitud: mina.longitud,
    p_estado: mina.estado,
  });
  if (error) throw error;
  return data;
}

export async function actualizarMina(id: string, mina: Partial<Mina>) {
  const { data, error } = await supabase.rpc("rpc_actualizar_mina", {
    p_id: id,
    p_nombre: mina.nombre,
    p_ubicacion: mina.ubicacion,
    p_latitud: mina.latitud,
    p_longitud: mina.longitud,
    p_estado: mina.estado,
  });
  if (error) throw error;
  return data;
}

export async function eliminarMina(id: string) {
  const { data, error } = await supabase.rpc("rpc_eliminar_mina", { p_id: id });
  if (error) throw error;
  return data;
}

// Lugares
export async function listarLugares(minaId: string) {
  const { data, error } = await supabase.rpc("rpc_listar_lugares", {
    p_mina_id: minaId,
  });
  if (error) throw error;
  return data as Lugar[];
}

export async function crearLugar(lugar: Omit<Lugar, "id" | "created_at">) {
  const { data, error } = await supabase.rpc("rpc_crear_lugar", {
    p_mina_id: lugar.mina_id,
    p_nombre: lugar.nombre,
    p_tipo: lugar.tipo,
    p_latitud: lugar.latitud,
    p_longitud: lugar.longitud,
    p_descripcion: lugar.descripcion,
  });
  if (error) throw error;
  return data;
}

export async function actualizarLugar(id: string, lugar: Partial<Lugar>) {
  const { data, error } = await supabase.rpc("rpc_actualizar_lugar", {
    p_id: id,
    ...lugar,
  });
  if (error) throw error;
  return data;
}

export async function eliminarLugar(id: string) {
  const { data, error } = await supabase.rpc("rpc_eliminar_lugar", { p_id: id });
  if (error) throw error;
  return data;
}
