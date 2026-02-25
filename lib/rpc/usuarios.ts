import { supabase } from "@/lib/supabase/client";

export type RolUsuario = "administrador" | "supervisor" | "operador" | "visitante";

export interface Usuario {
  id_usuario: number;
  email: string;
  nombre: string;
  rol: RolUsuario;
  telefono?: string;
  activo: boolean;
  ultimo_acceso?: string;
  creado_en?: string;
  creado_por?: number;
}

// ========== FUNCIONES DE USUARIOS ==========

export async function listarUsuarios(): Promise<Usuario[]> {
  const { data, error } = await supabase
    .from("usuarios_aplicacion")
    .select("*")
    .order("nombre");
  if (error) throw error;
  return (data || []) as Usuario[];
}

export async function obtenerUsuario(id: number): Promise<Usuario | null> {
  const { data, error } = await supabase
    .from("usuarios_aplicacion")
    .select("*")
    .eq("id_usuario", id)
    .single();
  if (error) throw error;
  return data as Usuario | null;
}

export async function obtenerUsuarioPorEmail(email: string): Promise<Usuario | null> {
  const { data, error } = await supabase
    .from("usuarios_aplicacion")
    .select("*")
    .eq("email", email)
    .single();
  if (error) throw error;
  return data as Usuario | null;
}

export async function crearUsuario(usuario: {
  email: string;
  nombre: string;
  rol: RolUsuario;
  telefono?: string;
}): Promise<Usuario> {
  const { data, error } = await supabase
    .from("usuarios_aplicacion")
    .insert({
      email: usuario.email,
      nombre: usuario.nombre,
      rol: usuario.rol,
      telefono: usuario.telefono || null,
      activo: true,
    })
    .select()
    .single();
  
  if (error) throw error;
  return data as Usuario;
}

export async function buscarUsuariosPorRol(rol: RolUsuario): Promise<Usuario[]> {
  const { data, error } = await supabase
    .from("usuarios_aplicacion")
    .select("*")
    .eq("rol", rol)
    .eq("activo", true)
    .order("nombre");
  if (error) throw error;
  return (data || []) as Usuario[];
}

export async function buscarUsuariosActivos(): Promise<Usuario[]> {
  const { data, error } = await supabase
    .from("usuarios_aplicacion")
    .select("*")
    .eq("activo", true)
    .order("nombre");
  if (error) throw error;
  return (data || []) as Usuario[];
}

// ========== FUNCIONES DE ACTUALIZACIÓN ==========

export async function actualizarUsuario(
  id: number,
  usuario: Partial<Omit<Usuario, "id_usuario" | "creado_en" | "creado_por">>
): Promise<Usuario> {
  const { data, error } = await supabase
    .from("usuarios_aplicacion")
    .update(usuario)
    .eq("id_usuario", id)
    .select()
    .single();
  if (error) throw error;
  return data as Usuario;
}

export async function actualizarUltimoAcceso(id: number): Promise<void> {
  const { error } = await supabase
    .from("usuarios_aplicacion")
    .update({ ultimo_acceso: new Date().toISOString() })
    .eq("id_usuario", id);
  if (error) throw error;
}

export async function cambiarRolUsuario(id: number, rol: RolUsuario): Promise<Usuario> {
  const { data, error } = await supabase
    .from("usuarios_aplicacion")
    .update({ rol })
    .eq("id_usuario", id)
    .select()
    .single();
  if (error) throw error;
  return data as Usuario;
}

export async function activarDesactivarUsuario(id: number, activo: boolean): Promise<Usuario> {
  const { data, error } = await supabase
    .from("usuarios_aplicacion")
    .update({ activo })
    .eq("id_usuario", id)
    .select()
    .single();
  if (error) throw error;
  return data as Usuario;
}

export async function eliminarUsuario(id: number): Promise<void> {
  const { error } = await supabase.from("usuarios_aplicacion").delete().eq("id_usuario", id);
  if (error) throw error;
}

// ========== FUNCIONES DE AUTENTICACIÓN ==========

export async function signIn(email: string, password: string) {
  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });
  
  if (error) throw error;
  return data;
}

export async function signOut() {
  const { error } = await supabase.auth.signOut();
  if (error) throw error;
}

export async function getCurrentUser() {
  const { data: { user }, error } = await supabase.auth.getUser();
  if (error) throw error;
  return user;
}

export async function updatePassword(newPassword: string) {
  const { error } = await supabase.auth.updateUser({
    password: newPassword,
  });
  
  if (error) throw error;
}

export async function resetPassword(email: string) {
  const { error } = await supabase.auth.resetPasswordForEmail(email);
  if (error) throw error;
}
