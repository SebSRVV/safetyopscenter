import { useState, useEffect } from "react";

export interface Incidente {
  id_reporte: number;
  id_mina: number;
  id_lugar?: number;
  id_flota?: number;
  id_trabajador_afectado?: number;
  id_reportante: number;
  tipo_incidente: string;
  severidad: string;
  descripcion_detallada: string;
  fecha_hora_incidente: string;
  acciones_inmediatas?: string;
  testigos_presentes?: string[];
  danos_materiales?: string;
  tiempo_parada_horas?: number;
  estado_investigacion: string;
  medidas_correctivas?: string;
  fecha_cierre?: string;
  creado_en: string;
  // Datos relacionados
  minas?: { nombre: string; codigo: string; empresa: string };
  lugar_de_los_dispositivos?: { nombre: string };
  flota_minera?: { nombre: string; placa_o_credencial: string };
  trabajadores?: { nombre_completo: string };
  usuarios_aplicacion?: { nombre: string; email: string };
}

export interface IncidenteFilters {
  tipo?: string;
  severidad?: string;
  estado?: string;
  minaId?: number;
  fechaInicio?: string;
  fechaFin?: string;
  limite?: number;
}

export interface CreateIncidenteData {
  id_mina: number;
  id_lugar?: number;
  id_flota?: number;
  id_trabajador_afectado?: number;
  id_reportante: number;
  tipo_incidente: string;
  severidad: string;
  descripcion_detallada: string;
  fecha_hora_incidente?: string;
  acciones_inmediatas?: string;
  testigos_presentes?: string[];
  danos_materiales?: string;
  tiempo_parada_horas?: number;
  medidas_correctivas?: string;
}

export const useIncidentes = (filters?: IncidenteFilters) => {
  const [incidentes, setIncidentes] = useState<Incidente[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchIncidentes = async () => {
    try {
      setLoading(true);
      setError(null);

      const params = new URLSearchParams();
      if (filters?.tipo) params.append("tipo", filters.tipo);
      if (filters?.severidad) params.append("severidad", filters.severidad);
      if (filters?.estado) params.append("estado", filters.estado);
      if (filters?.minaId) params.append("mina_id", filters.minaId.toString());
      if (filters?.fechaInicio) params.append("fecha_inicio", filters.fechaInicio);
      if (filters?.fechaFin) params.append("fecha_fin", filters.fechaFin);
      if (filters?.limite) params.append("limite", filters.limite.toString());

      const response = await fetch(`/api/incidentes?${params.toString()}`);
      
      if (!response.ok) {
        throw new Error("Error al cargar los incidentes");
      }

      const data = await response.json();
      setIncidentes(data);
    } catch (err) {
      console.error("Error fetching incidentes:", err);
      setError(err instanceof Error ? err.message : "Error desconocido");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchIncidentes();
  }, [JSON.stringify(filters)]);

  const refetch = () => {
    fetchIncidentes();
  };

  return { incidentes, loading, error, refetch };
};

export const useCrearIncidente = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const crearIncidente = async (data: CreateIncidenteData) => {
    try {
      setLoading(true);
      setError(null);

      const response = await fetch("/api/incidentes", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Error al crear el incidente");
      }

      const nuevoIncidente = await response.json();
      return nuevoIncidente;
    } catch (err) {
      console.error("Error creando incidente:", err);
      setError(err instanceof Error ? err.message : "Error desconocido");
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const actualizarIncidente = async (id: number, action: string, data?: any) => {
    try {
      setLoading(true);
      setError(null);

      const response = await fetch("/api/incidentes", {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ id, action, ...data }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Error al actualizar el incidente");
      }

      const incidenteActualizado = await response.json();
      return incidenteActualizado;
    } catch (err) {
      console.error("Error actualizando incidente:", err);
      setError(err instanceof Error ? err.message : "Error desconocido");
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const cerrarIncidente = async (id: number, medidasCorrectivas: string) => {
    return actualizarIncidente(id, "cerrar", { medidas_correctivas: medidasCorrectivas });
  };

  const iniciarInvestigacion = async (id: number) => {
    return actualizarIncidente(id, "en_investigacion");
  };

  const eliminarIncidente = async (id: number) => {
    try {
      setLoading(true);
      setError(null);

      const response = await fetch(`/api/incidentes?id=${id}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Error al eliminar el incidente");
      }

      return true;
    } catch (err) {
      console.error("Error eliminando incidente:", err);
      setError(err instanceof Error ? err.message : "Error desconocido");
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return { 
    crearIncidente, 
    actualizarIncidente, 
    cerrarIncidente, 
    iniciarInvestigacion, 
    eliminarIncidente, 
    loading, 
    error 
  };
};
