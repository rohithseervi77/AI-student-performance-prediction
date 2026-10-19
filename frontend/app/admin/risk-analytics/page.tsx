"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  Shield,
  BarChart3,
  PieChart as PieIcon,
  AlertTriangle,
  AlertOctagon,
  ShieldCheck,
  Building,
  ArrowLeft
} from "lucide-react";
import {
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend
} from "recharts";
import { apiRequest } from "@/lib/api";
import { getSession } from "@/lib/auth";

export default function AdminRiskAnalyticsPage() {
  const router = useRouter();
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
    const session = getSession();
    if (!session || session.role !== "admin") {
      router.push("/login");
      return;
    }
    fetchRiskAnalysis();
  }, [router]);

  const fetchRiskAnalysis = async () => {
    setLoading(true);
    try {
      const res = await apiRequest("/admin/risk-analysis");
      setData(res);
    } catch (err: any) {
      setError(err.message || "Failed to load risk analysis data.");
    } finally {
      setLoading(false);
    }
  };

  if (!isMounted || loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-16 text-center">
        <div className="inline-block animate-spin w-8 h-8 border-4 border-indigo-600 border-t-transparent rounded-full mb-3"></div>
        <p className="text-sm font-semibold text-slate-600">Calculating risk distribution from SQL records...</p>
      </div>
    );
  }

  if (error || !data) {
    return (
      <div className="max-w-xl mx-auto px-4 py-16 text-center">
        <div className="p-6 bg-rose-50 border border-rose-200 rounded-2xl text-xs text-rose-700">
          {error || "Unable to load risk distribution analytics."}
        </div>
      </div>
    );
  }

  const { total_evaluated, distribution, department_breakdown } = data;

  const COLORS = {
    "Low Risk": "#10b981",
    "Medium Risk": "#f59e0b",
    "High Risk": "#ef4444",
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-10 space-y-8 animate-fade-in">
      {/* Top Header */}
      <div>
        <Link
          href="/admin/dashboard"
          className="inline-flex items-center gap-1.5 text-xs font-bold text-slate-500 hover:text-indigo-600 transition-colors mb-3"
        >
          <ArrowLeft className="w-3.5 h-3.5" /> Back to Admin Console
        </Link>
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-4 border-b border-slate-200">
          <div>
            <h1 className="text-2xl sm:text-3xl font-black text-slate-900">
              Class Risk Distribution & Department Breakdown
            </h1>
            <p className="text-sm text-slate-500 mt-1">
              Calculated dynamically from {total_evaluated} student predictions stored in SQL.
            </p>
          </div>
        </div>
      </div>

      {/* Summary Cards of Distribution */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
        {distribution.map((d: any, idx: number) => {
          const isHigh = d.name.includes("High");
          const isMed = d.name.includes("Medium");

          return (
            <div
              key={idx}
              className={`rounded-2xl border p-6 shadow-xs ${
                isHigh
                  ? "bg-rose-50/70 border-rose-200 text-rose-950"
                  : isMed
                  ? "bg-amber-50/70 border-amber-200 text-amber-950"
                  : "bg-emerald-50/70 border-emerald-200 text-emerald-950"
              }`}
            >
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold uppercase tracking-wider">{d.name}</span>
                {isHigh ? (
                  <AlertOctagon className="w-5 h-5 text-rose-600" />
                ) : isMed ? (
                  <AlertTriangle className="w-5 h-5 text-amber-600" />
                ) : (
                  <ShieldCheck className="w-5 h-5 text-emerald-600" />
                )}
              </div>
              <div className="mt-4 flex items-baseline gap-2">
                <span className="text-3xl font-black">{d.percentage}%</span>
                <span className="text-xs font-medium opacity-80">({d.count} students)</span>
              </div>
              <p className="text-[11px] mt-2 opacity-75">
                {isHigh
                  ? "Requires urgent counselor intervention"
                  : isMed
                  ? "Monitored for attendance & backlog recovery"
                  : "Stable academic trajectory"}
              </p>
            </div>
          );
        })}
      </div>

      {/* Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Pie Chart: Proportional Breakdown */}
        <div className="bg-white rounded-2xl border border-slate-200/90 p-6 shadow-xs">
          <div className="mb-4">
            <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
              <PieIcon className="w-4 h-4 text-indigo-600" />
              Proportional Risk Distribution
            </h3>
            <p className="text-xs text-slate-500">Live share of evaluated student population</p>
          </div>
          <div className="h-64 sm:h-72 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={distribution}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={95}
                  paddingAngle={4}
                  dataKey="count"
                >
                  {distribution.map((entry: any, index: number) => (
                    <Cell
                      key={`cell-${index}`}
                      fill={entry.color || (COLORS as any)[entry.name] || "#6366f1"}
                    />
                  ))}
                </Pie>
                <Tooltip
                  formatter={(value: any, name: any, item: any) => [
                    `${value} students (${item.payload.percentage}%)`,
                    name,
                  ]}
                  contentStyle={{ backgroundColor: "#ffffff", borderRadius: "12px", border: "1px solid #e2e8f0", fontSize: "12px" }}
                />
                <Legend wrapperStyle={{ fontSize: "11px" }} />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Bar Chart: Department-wise Breakdown */}
        <div className="bg-white rounded-2xl border border-slate-200/90 p-6 shadow-xs">
          <div className="mb-4">
            <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
              <Building className="w-4 h-4 text-indigo-600" />
              Department-Wise Average Score & Risk
            </h3>
            <p className="text-xs text-slate-500">Predicted scores & high-risk count per department</p>
          </div>
          <div className="h-64 sm:h-72 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={department_breakdown} margin={{ top: 5, right: 20, bottom: 5, left: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                <XAxis dataKey="department" tick={{ fontSize: 9, fill: "#64748b" }} interval={0} angle={-15} textAnchor="end" height={45} />
                <YAxis domain={[0, 100]} tick={{ fontSize: 11, fill: "#64748b" }} />
                <Tooltip
                  contentStyle={{ backgroundColor: "#ffffff", borderRadius: "12px", border: "1px solid #e2e8f0", fontSize: "12px" }}
                />
                <Legend wrapperStyle={{ fontSize: "11px" }} />
                <Bar dataKey="average_score" name="Avg Predicted Score %" fill="#4f46e5" radius={[6, 6, 0, 0]} />
                <Bar dataKey="high_risk_count" name="High Risk Students" fill="#ef4444" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
}
