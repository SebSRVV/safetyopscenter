import { supabase } from "@/lib/supabase/client";

export interface DashboardResumen {
  incidentes_hoy: number;
  alarmas_criticas: number;
  flota_activa: number;
  trabajadores_turno: number;
}

export async function obtenerDashboardResumen(idMina: number): Promise<DashboardResumen> {
  const { data, error } = await supabase.rpc("rpc_dashboard_resumen", {
    p_id_mina: idMina,
  });
  if (error) throw error;
  
  if (data && data.length > 0) {
    return data[0] as DashboardResumen;
  }
  
  return {
    incidentes_hoy: 0,
    alarmas_criticas: 0,
    flota_activa: 0,
    trabajadores_turno: 0,
  };
}
