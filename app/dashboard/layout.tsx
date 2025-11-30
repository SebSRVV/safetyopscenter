"use client";

import { QueryProvider } from "@/components/providers/query-provider";
import { DashboardShell } from "@/components/layout/dashboard-shell";
import { Toaster } from "@/components/ui/sonner";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <QueryProvider>
      <DashboardShell>{children}</DashboardShell>
      <Toaster position="top-right" richColors />
    </QueryProvider>
  );
}
