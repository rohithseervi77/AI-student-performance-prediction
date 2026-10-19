import React from "react";
import { ShieldCheck, AlertTriangle, AlertOctagon } from "lucide-react";

interface RiskBadgeProps {
  level: "LOW" | "MEDIUM" | "HIGH" | string;
  size?: "sm" | "md" | "lg";
  showIcon?: boolean;
}

export default function RiskBadge({ level, size = "md", showIcon = true }: RiskBadgeProps) {
  const normLevel = (level || "LOW").toUpperCase();

  const styles = {
    LOW: {
      bg: "bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-950/40 dark:text-emerald-400 dark:border-emerald-800",
      dot: "bg-emerald-500",
      icon: ShieldCheck,
      label: "LOW RISK",
    },
    MEDIUM: {
      bg: "bg-amber-50 text-amber-700 border-amber-200 dark:bg-amber-950/40 dark:text-amber-400 dark:border-amber-800",
      dot: "bg-amber-500",
      icon: AlertTriangle,
      label: "MEDIUM RISK",
    },
    HIGH: {
      bg: "bg-rose-50 text-rose-700 border-rose-200 dark:bg-rose-950/40 dark:text-rose-400 dark:border-rose-800",
      dot: "bg-rose-500",
      icon: AlertOctagon,
      label: "HIGH RISK",
    },
  }[normLevel] || {
    bg: "bg-slate-50 text-slate-700 border-slate-200",
    dot: "bg-slate-500",
    icon: ShieldCheck,
    label: normLevel,
  };

  const sizeClasses = {
    sm: "px-2 py-0.5 text-xs font-semibold",
    md: "px-2.5 py-1 text-xs font-bold",
    lg: "px-3.5 py-1.5 text-sm font-bold",
  }[size];

  const IconComponent = styles.icon;

  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full border tracking-wide uppercase shadow-xs ${styles.bg} ${sizeClasses}`}
    >
      {showIcon && <IconComponent className={size === "lg" ? "w-4 h-4" : "w-3.5 h-3.5"} />}
      {!showIcon && <span className={`w-1.5 h-1.5 rounded-full ${styles.dot}`} />}
      {styles.label}
    </span>
  );
}
