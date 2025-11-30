"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { ChevronRight, Home } from "lucide-react";
import { motion } from "framer-motion";

const routeNames: Record<string, string> = {
  dashboard: "Dashboard",
  minas: "Minas",
  lugares: "Lugares",
  flota: "Flota",
  trabajadores: "Trabajadores",
  dispositivos: "Dispositivos IoT",
  semaforos: "Semáforos",
  simulacion: "Simulación",
  alarmas: "Alarmas",
  configuracion: "Configuración",
  incidentes: "Incidentes",
  metrics: "Métricas",
  auth: "Autenticación",
  login: "Iniciar Sesión",
  register: "Registro",
};

export function Breadcrumbs() {
  const pathname = usePathname();
  const segments = pathname.split("/").filter(Boolean);

  if (segments.length === 0 || segments[0] === "auth") {
    return null;
  }

  const breadcrumbs = segments.map((segment, index) => {
    const href = "/" + segments.slice(0, index + 1).join("/");
    const isLast = index === segments.length - 1;
    const isId = /^[0-9a-fA-F-]+$/.test(segment);
    const name = isId ? `#${segment.slice(0, 8)}` : routeNames[segment] || segment;

    return {
      name,
      href,
      isLast,
    };
  });

  return (
    <motion.nav
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, delay: 0.1 }}
      className="flex items-center gap-2 text-sm text-muted-foreground mb-6"
    >
      <Link
        href="/dashboard"
        className="flex items-center gap-1 hover:text-primary transition-colors"
      >
        <Home className="h-4 w-4" />
      </Link>

      {breadcrumbs.map((crumb, index) => (
        <div key={crumb.href} className="flex items-center gap-2">
          <ChevronRight className="h-4 w-4 text-muted-foreground/50" />
          {crumb.isLast ? (
            <span className="text-foreground font-medium">{crumb.name}</span>
          ) : (
            <Link
              href={crumb.href}
              className="hover:text-primary transition-colors"
            >
              {crumb.name}
            </Link>
          )}
        </div>
      ))}
    </motion.nav>
  );
}
