import { supabase } from "@/lib/supabase/client";

// ========== CRUD OPERATIONS ==========

export interface Mina {
  id_mina: number;
  nombre: string;
  codigo: string;
  ubicacion: string;
  empresa: string;
  creado_por?: number;
  creado_en?: string;
}

export interface Lugar {
  id_lugar: number;
  id_mina: number;
  nombre: string;
  tipo: "cruce" | "rampa" | "galeria" | "taller" | "superficie" | "otro";
  descripcion?: string;
  latitud?: number;
  longitud?: number;
  creado_por?: number;
  creado_en?: string;
}

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
}): Promise<Mina> {
  const { data, error } = await supabase.rpc("rpc_crear_mina", {
    p_nombre: mina.nombre,
    p_codigo: mina.codigo,
    p_ubicacion: mina.ubicacion,
    p_empresa: mina.empresa,
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
}): Promise<Lugar> {
  const { data, error } = await supabase.rpc("rpc_crear_lugar", {
    p_id_mina: lugar.id_mina,
    p_nombre: lugar.nombre,
    p_tipo: lugar.tipo,
    p_descripcion: lugar.descripcion || null,
    p_latitud: lugar.latitud || null,
    p_longitud: lugar.longitud || null,
  });
  if (error) throw error;
  return data as Lugar;
}

// ========== UPDATE & DELETE (Direct table access) ==========

export async function actualizarMina(
  id: number,
  mina: Partial<{ nombre: string; codigo: string; ubicacion: string; empresa: string }>
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
  lugar: Partial<{ nombre: string; tipo: Lugar["tipo"]; descripcion: string; latitud: number; longitud: number }>
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
