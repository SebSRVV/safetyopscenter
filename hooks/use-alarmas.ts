import { useState, useEffect } from "react";

export interface Alarma {
  id_evento: number;
  tipo_evento: string;
  categoria: string;
  descripcion: string;
  severidad: number;
  id_dispositivo?: number;
  id_flota?: number;
  id_lugar?: number;
  id_trabajador?: number;
  latitud?: number;
  longitud?: number;
  altitud_metros?: number;
  datos_adicionales?: any;
  estado: string;
  fecha_resolucion?: string;
  resuelto_por?: number;
  observaciones_resolucion?: string;
  creado_en: string;
  // Datos relacionados
  minas?: { nombre: string; codigo: string };
  flota_minera?: { nombre: string; placa_o_credencial: string };
  lugar_de_los_dispositivos?: { nombre: string };
  trabajadores?: { nombre_completo: string };
}

export interface AlarmaFilters {
  tipo?: string;
  severidad?: number;
  estado?: string;
  minaId?: number;
  limite?: number;
}

export interface CreateAlarmaData {
  tipo_evento: string;
  categoria: string;
  descripcion: string;
  severidad: number;
  id_dispositivo?: number;
  id_flota?: number;
  id_lugar?: number;
  id_trabajador?: number;
  latitud?: number;
  longitud?: number;
  altitud_metros?: number;
  datos_adicionales?: any;
  estado?: string;
}

export const useAlarmas = (filters?: AlarmaFilters) => {
  const [alarmas, setAlarmas] = useState<Alarma[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchAlarmas = async () => {
    try {
      setLoading(true);
      setError(null);

      const params = new URLSearchParams();
      if (filters?.tipo) params.append("tipo", filters.tipo);
      if (filters?.severidad) params.append("severidad", filters.severidad.toString());
      if (filters?.estado) params.append("estado", filters.estado);
      if (filters?.minaId) params.append("mina_id", filters.minaId.toString());
      if (filters?.limite) params.append("limite", filters.limite.toString());

      const response = await fetch(`/api/alarmas?${params.toString()}`);
      
      if (!response.ok) {
        throw new Error("Error al cargar las alarmas");
      }

      const data = await response.json();
      setAlarmas(data);
    } catch (err) {
      console.error("Error fetching alarmas:", err);
      setError(err instanceof Error ? err.message : "Error desconocido");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAlarmas();
  }, [JSON.stringify(filters)]);

  const refetch = () => {
    fetchAlarmas();
  };

  return { alarmas, loading, error, refetch };
};

export const useCrearAlarma = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const crearAlarma = async (data: CreateAlarmaData) => {
    try {
      setLoading(true);
      setError(null);

      const response = await fetch("/api/alarmas", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Error al crear la alarma");
      }

      const nuevaAlarma = await response.json();
      return nuevaAlarma;
    } catch (err) {
      console.error("Error creando alarma:", err);
      setError(err instanceof Error ? err.message : "Error desconocido");
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const actualizarAlarma = async (id: number, action: string, data?: any) => {
    try {
      setLoading(true);
      setError(null);

      const response = await fetch(`/api/alarmas`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ id, action, ...data }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Error al actualizar la alarma");
      }

      const alarmaActualizada = await response.json();
      return alarmaActualizada;
    } catch (err) {
      console.error("Error actualizando alarma:", err);
      setError(err instanceof Error ? err.message : "Error desconocido");
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const eliminarAlarma = async (id: number) => {
    try {
      setLoading(true);
      setError(null);

      const response = await fetch(`/api/alarmas?id=${id}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Error al eliminar la alarma");
      }

      return true;
    } catch (err) {
      console.error("Error eliminando alarma:", err);
      setError(err instanceof Error ? err.message : "Error desconocido");
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return { crearAlarma, actualizarAlarma, eliminarAlarma, loading, error };
};
