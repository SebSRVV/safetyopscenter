import { supabase } from "@/lib/supabase/client";

export type EstadoTrabajador = "activo" | "vacaciones" | "suspendido" | "retirado";

export interface Trabajador {
  id_trabajador: number;
  nombre_completo: string;
  doc_identidad: string;
  cargo: string;
  empresa_contratista: string;
  email?: string;
  telefono?: string;
  fecha_nacimiento?: string;
  fecha_ingreso?: string;
  certificaciones?: string[];
  estado: EstadoTrabajador;
  creado_en?: string;
  creado_por?: number;
}

// ========== FUNCIONES RPC ==========

export async function listarTrabajadores(): Promise<Trabajador[]> {
  const { data, error } = await supabase.rpc("rpc_listar_trabajadores");
  if (error) throw error;
  return (data || []) as Trabajador[];
}

export async function crearTrabajador(trabajador: {
  nombre_completo: string;
  doc_identidad: string;
  cargo: string;
  empresa_contratista: string;
  email?: string;
  telefono?: string;
  fecha_nacimiento?: string;
  fecha_ingreso?: string;
  certificaciones?: string[];
}): Promise<Trabajador> {
  const { data, error } = await supabase.rpc("rpc_crear_trabajador", {
    p_nombre_completo: trabajador.nombre_completo,
    p_doc_identidad: trabajador.doc_identidad,
    p_cargo: trabajador.cargo,
    p_empresa_contratista: trabajador.empresa_contratista,
    p_email: trabajador.email || null,
    p_telefono: trabajador.telefono || null,
    p_fecha_nacimiento: trabajador.fecha_nacimiento || null,
    p_fecha_ingreso: trabajador.fecha_ingreso || null,
    p_certificaciones: trabajador.certificaciones || null,
  });
  if (error) throw error;
  return data as Trabajador;
}

export async function obtenerTrabajador(id: number): Promise<Trabajador | null> {
  const { data, error } = await supabase
    .from("trabajadores")
    .select("*")
    .eq("id_trabajador", id)
    .single();
  if (error) throw error;
  return data as Trabajador | null;
}

export async function buscarTrabajadoresPorEmpresa(empresa: string): Promise<Trabajador[]> {
  const { data, error } = await supabase
    .from("trabajadores")
    .select("*")
    .eq("empresa_contratista", empresa)
    .eq("estado", "activo")
    .order("nombre_completo");
  if (error) throw error;
  return (data || []) as Trabajador[];
}

export async function buscarTrabajadoresPorCargo(cargo: string): Promise<Trabajador[]> {
  const { data, error } = await supabase
    .from("trabajadores")
    .select("*")
    .ilike("cargo", `%${cargo}%`)
    .eq("estado", "activo")
    .order("nombre_completo");
  if (error) throw error;
  return (data || []) as Trabajador[];
}

// ========== FUNCIONES DE ACTUALIZACIÓN Y ELIMINACIÓN ==========

export async function actualizarTrabajador(
  id: number,
  trabajador: Partial<Omit<Trabajador, "id_trabajador" | "creado_en" | "creado_por">>
): Promise<Trabajador> {
  const { data, error } = await supabase
    .from("trabajadores")
    .update(trabajador)
    .eq("id_trabajador", id)
    .select()
    .single();
  if (error) throw error;
  return data as Trabajador;
}

export async function eliminarTrabajador(id: number): Promise<void> {
  const { error } = await supabase.from("trabajadores").delete().eq("id_trabajador", id);
  if (error) throw error;
}

export async function cambiarEstadoTrabajador(id: number, estado: EstadoTrabajador): Promise<Trabajador> {
  const { data, error } = await supabase
    .from("trabajadores")
    .update({ estado })
    .eq("id_trabajador", id)
    .select()
    .single();
  if (error) throw error;
  return data as Trabajador;
}
