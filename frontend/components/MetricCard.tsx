import React, { ReactNode } from "react";

interface MetricCardProps {
  title: string;
  value: string | number;
  subtitle?: string;
  icon?: ReactNode;
  trend?: {
    direction: "up" | "down" | "neutral";
    text: string;
  };
  color?: "indigo" | "emerald" | "amber" | "rose" | "blue" | "slate" | "purple";
}

export default function MetricCard({
  title,
  value,
  subtitle,
  icon,
  trend,
  color = "indigo",
}: MetricCardProps) {
  const colorMap = {
    indigo: "bg-indigo-50 text-indigo-600 border-indigo-100",
    purple: "bg-purple-50 text-purple-600 border-purple-100",
    emerald: "bg-emerald-50 text-emerald-600 border-emerald-100",
    amber: "bg-amber-50 text-amber-600 border-amber-100",
    rose: "bg-rose-50 text-rose-600 border-rose-100",
    blue: "bg-blue-50 text-blue-600 border-blue-100",
    slate: "bg-slate-50 text-slate-600 border-slate-200",
  }[color];

  return (
    <div className="bg-white rounded-2xl border border-slate-200/80 p-5 shadow-xs hover:shadow-md transition-shadow">
      <div className="flex items-start justify-between">
        <div>
          <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">{title}</p>
          <h3 className="text-2xl lg:text-3xl font-extrabold text-slate-900 mt-1">{value}</h3>
        </div>
        {icon && <div className={`p-2.5 rounded-xl border ${colorMap}`}>{icon}</div>}
      </div>
      {(subtitle || trend) && (
        <div className="mt-3 flex items-center gap-2 text-xs">
          {trend && (
            <span
              className={`font-semibold ${
                trend.direction === "up"
                  ? "text-emerald-600"
                  : trend.direction === "down"
                  ? "text-rose-600"
                  : "text-slate-500"
              }`}
            >
              {trend.text}
            </span>
          )}
          {subtitle && <span className="text-slate-500">{subtitle}</span>}
        </div>
      )}
    </div>
  );
}
