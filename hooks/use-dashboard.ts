"use client";

import { useQuery } from "@tanstack/react-query";
import { obtenerDashboardResumen, DashboardResumen } from "@/lib/rpc/dashboard";
import { listarAlarmasPorMina, AlarmaDisparada } from "@/lib/rpc/alarmas";
import { listarMinas, Mina } from "@/lib/rpc/minas";
import { listarFlota, Flota } from "@/lib/rpc/flota";

export function useMinas() {
  return useQuery<Mina[], Error>({
    queryKey: ["minas"],
    queryFn: listarMinas,
    staleTime: 5 * 60 * 1000,
  });
}

export function useDashboardResumen(idMina: number | null) {
  return useQuery<DashboardResumen, Error>({
    queryKey: ["dashboard-resumen", idMina],
    queryFn: () => obtenerDashboardResumen(idMina!),
    enabled: !!idMina,
    refetchInterval: 30000,
  });
}

export function useAlarmas(idMina: number | null) {
  return useQuery<AlarmaDisparada[], Error>({
    queryKey: ["alarmas", idMina],
    queryFn: () => listarAlarmasPorMina(idMina!),
    enabled: !!idMina,
    refetchInterval: 15000,
  });
}

export function useFlota(idMina: number | null) {
  return useQuery<Flota[], Error>({
    queryKey: ["flota", idMina],
    queryFn: () => listarFlota(idMina!),
    enabled: !!idMina,
    staleTime: 60000,
  });
}
