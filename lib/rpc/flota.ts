import { supabase } from "@/lib/supabase/client";

export type ClaseFlota = "vehiculo_liviano" | "vehiculo_pesado" | "maquinaria";
export type FamiliaFlota = "camioneta" | "camion" | "bus" | "scooptram" | "dumper" | "jumbo" | "otro";

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
  creado_por?: number;
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
    p_id_mina: flota.id_mina,
  });
  if (error) throw error;
  return data as Flota;
}

// ========== UPDATE & DELETE ==========

export async function actualizarFlota(
  id: number,
  flota: Partial<{
    nombre: string;
    clase: ClaseFlota;
    familia: FamiliaFlota;
    tipo_especifico: string;
    placa_o_credencial: string;
    marca: string;
    modelo: string;
    anio_fabricacion: number;
    capacidad_toneladas: number;
  }>
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
