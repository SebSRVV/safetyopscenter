"use client";

import { motion } from "framer-motion";
import { LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import { Card, CardContent } from "@/components/ui/card";

interface StatCardProps {
  title: string;
  value: string | number;
  description?: string;
  icon: LucideIcon;
  trend?: {
    value: number;
    isPositive: boolean;
  };
  variant?: "default" | "critical" | "warning" | "success" | "info";
  delay?: number;
}

const variantStyles = {
  default: {
    icon: "bg-primary/10 text-primary border-primary/20",
    glow: "",
  },
  critical: {
    icon: "bg-red-500/10 text-red-500 border-red-500/20",
    glow: "hover:glow-red",
  },
  warning: {
    icon: "bg-yellow-500/10 text-yellow-500 border-yellow-500/20",
    glow: "hover:glow-yellow",
  },
  success: {
    icon: "bg-emerald-500/10 text-emerald-500 border-emerald-500/20",
    glow: "hover:glow-green",
  },
  info: {
    icon: "bg-blue-500/10 text-blue-500 border-blue-500/20",
    glow: "",
  },
};

export function StatCard({
  title,
  value,
  description,
  icon: Icon,
  trend,
  variant = "default",
  delay = 0,
}: StatCardProps) {
  const styles = variantStyles[variant];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay }}
    >
      <Card
        className={cn(
          "bg-card border-border/50 hover:border-primary/30 transition-all duration-300",
          styles.glow
        )}
      >
        <CardContent className="p-6">
          <div className="flex items-start justify-between">
            <div className="space-y-2">
              <p className="text-sm font-medium text-muted-foreground">
                {title}
              </p>
              <div className="flex items-baseline gap-2">
                <motion.span
                  initial={{ opacity: 0, scale: 0.5 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.3, delay: delay + 0.2 }}
                  className="text-3xl font-bold text-foreground"
                >
                  {value}
                </motion.span>
                {trend && (
                  <span
                    className={cn(
                      "text-sm font-medium",
                      trend.isPositive ? "text-emerald-500" : "text-red-500"
                    )}
                  >
                    {trend.isPositive ? "+" : "-"}
                    {Math.abs(trend.value)}%
                  </span>
                )}
              </div>
              {description && (
                <p className="text-xs text-muted-foreground">{description}</p>
              )}
            </div>
            <div
              className={cn(
                "flex h-12 w-12 items-center justify-center rounded-lg border",
                styles.icon
              )}
            >
              <Icon className="h-6 w-6" />
            </div>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}
