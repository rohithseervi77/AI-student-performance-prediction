"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  BarChart3,
  TrendingUp,
  AlertTriangle,
  Sparkles,
  BookOpen,
  Calendar,
  Clock,
  Layers,
  ArrowRight
} from "lucide-react";
import {
  ResponsiveContainer,
  LineChart,
  Line,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ReferenceLine
} from "recharts";
import { apiRequest } from "@/lib/api";
import { getSession } from "@/lib/auth";
import RiskBadge from "@/components/RiskBadge";

export default function StudentAnalyticsPage() {
  const router = useRouter();
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
    const session = getSession();
    if (!session) {
      router.push("/login");
      return;
    }
    fetchAnalytics();
  }, [router]);

  const fetchAnalytics = async () => {
    setLoading(true);
    try {
      const res = await apiRequest("/analytics/student");
      setData(res);
    } catch (err: any) {
      setError(err.message || "Failed to load student analytics.");
    } finally {
      setLoading(false);
    }
  };

  if (!isMounted || loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-16 text-center">
        <div className="inline-block animate-spin w-8 h-8 border-4 border-indigo-600 border-t-transparent rounded-full mb-3"></div>
        <p className="text-sm font-semibold text-slate-600">Generating Recharts analytics from SQL records...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="max-w-xl mx-auto px-4 py-16 text-center">
        <div className="p-6 bg-rose-50 border border-rose-200 rounded-2xl text-rose-700 text-xs">
          {error}
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-10 space-y-8 animate-fade-in">
      {/* Top Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-4 border-b border-slate-200">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-50 border border-indigo-100 text-indigo-700 text-xs font-semibold mb-2">
            <BarChart3 className="w-3.5 h-3.5 text-indigo-600" />
            Performance Analytics Desk
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-slate-900">
            Student Academic Visualizations
          </h1>
          <p className="text-sm text-slate-500 mt-0.5">
            Real-time charts populated dynamically from SQL assessment records for {data?.full_name}.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <span className="text-xs text-slate-500">Early Warning Risk:</span>
          <RiskBadge level={data?.current_risk_level || "LOW"} size="md" />
        </div>
      </div>

      {/* Grid of Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* =====================================================================
            Chart 1: Attendance vs Predicted Score
           ===================================================================== */}
        <div className="bg-white rounded-2xl border border-slate-200/90 p-6 shadow-xs">
          <div className="mb-4">
            <h3 className="text-sm font-bold text-slate-900">Attendance vs. Predicted Score</h3>
            <p className="text-xs text-slate-500">Tracking score trajectory alongside class attendance</p>
          </div>
          <div className="h-64 sm:h-72 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={data?.attendance_vs_score || []} margin={{ top: 5, right: 20, bottom: 5, left: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                <XAxis dataKey="name" tick={{ fontSize: 11, fill: "#64748b" }} />
                <YAxis domain={[40, 100]} tick={{ fontSize: 11, fill: "#64748b" }} />
                <Tooltip
                  contentStyle={{ backgroundColor: "#ffffff", borderRadius: "12px", border: "1px solid #e2e8f0", fontSize: "12px" }}
                />
                <Legend wrapperStyle={{ fontSize: "11px" }} />
                <ReferenceLine y={75} stroke="#ef4444" strokeDasharray="4 4" label={{ value: "Mandatory 75%", fill: "#ef4444", fontSize: 10 }} />
                <Line type="monotone" dataKey="attendance" name="Attendance %" stroke="#6366f1" strokeWidth={2.5} dot={{ r: 4 }} />
                <Line type="monotone" dataKey="predicted_score" name="Predicted Score %" stroke="#10b981" strokeWidth={2.5} dot={{ r: 4 }} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* =====================================================================
            Chart 2: Subject-wise Performance Breakdown
           ===================================================================== */}
        <div className="bg-white rounded-2xl border border-slate-200/90 p-6 shadow-xs">
          <div className="mb-4">
            <h3 className="text-sm font-bold text-slate-900">Curricular Subject Performance</h3>
            <p className="text-xs text-slate-500">Marks across continuous examination subjects</p>
          </div>
          <div className="h-64 sm:h-72 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={data?.subject_performance || []} margin={{ top: 5, right: 20, bottom: 5, left: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                <XAxis dataKey="subject" tick={{ fontSize: 10, fill: "#64748b" }} interval={0} angle={-15} textAnchor="end" height={45} />
                <YAxis domain={[0, 100]} tick={{ fontSize: 11, fill: "#64748b" }} />
                <Tooltip
                  contentStyle={{ backgroundColor: "#ffffff", borderRadius: "12px", border: "1px solid #e2e8f0", fontSize: "12px" }}
                />
                <Legend wrapperStyle={{ fontSize: "11px" }} />
                <ReferenceLine y={50} stroke="#f59e0b" strokeDasharray="3 3" label={{ value: "Pass 50%", fill: "#f59e0b", fontSize: 10 }} />
                <ReferenceLine y={80} stroke="#10b981" strokeDasharray="3 3" label={{ value: "Distinction", fill: "#10b981", fontSize: 10 }} />
                <Bar dataKey="score" name="Score (%)" fill="#4f46e5" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* =====================================================================
            Chart 3: Internal Examination Progression
           ===================================================================== */}
        <div className="bg-white rounded-2xl border border-slate-200/90 p-6 shadow-xs">
          <div className="mb-4">
            <h3 className="text-sm font-bold text-slate-900">Internal Examination Progression</h3>
            <p className="text-xs text-slate-500">Continuous internal assessments over time</p>
          </div>
          <div className="h-64 sm:h-72 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={data?.internal_trend || []} margin={{ top: 5, right: 20, bottom: 5, left: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                <XAxis dataKey="name" tick={{ fontSize: 11, fill: "#64748b" }} />
                <YAxis domain={[0, 100]} tick={{ fontSize: 11, fill: "#64748b" }} />
                <Tooltip
                  contentStyle={{ backgroundColor: "#ffffff", borderRadius: "12px", border: "1px solid #e2e8f0", fontSize: "12px" }}
                />
                <Legend wrapperStyle={{ fontSize: "11px" }} />
                <ReferenceLine y={50} stroke="#ef4444" strokeDasharray="3 3" label={{ value: "Min Passing Mark", fill: "#ef4444", fontSize: 10 }} />
                <Line type="monotone" dataKey="internal_score" name="Internal Score %" stroke="#8b5cf6" strokeWidth={2.5} dot={{ r: 4 }} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* =====================================================================
            Chart 4: Study Hours vs Predicted Final Score
           ===================================================================== */}
        <div className="bg-white rounded-2xl border border-slate-200/90 p-6 shadow-xs">
          <div className="mb-4">
            <h3 className="text-sm font-bold text-slate-900">Study Hours vs. Predicted Score</h3>
            <p className="text-xs text-slate-500">Correlation between weekly self-study and AI score</p>
          </div>
          <div className="h-64 sm:h-72 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={data?.study_hours_vs_predicted || []} margin={{ top: 5, right: 20, bottom: 5, left: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                <XAxis dataKey="name" tick={{ fontSize: 11, fill: "#64748b" }} />
                <YAxis yAxisId="left" orientation="left" domain={[0, 30]} tick={{ fontSize: 11, fill: "#64748b" }} label={{ value: "Hours/wk", angle: -90, position: "insideLeft", fontSize: 10 }} />
                <YAxis yAxisId="right" orientation="right" domain={[40, 100]} tick={{ fontSize: 11, fill: "#64748b" }} label={{ value: "Score %", angle: 90, position: "insideRight", fontSize: 10 }} />
                <Tooltip
                  contentStyle={{ backgroundColor: "#ffffff", borderRadius: "12px", border: "1px solid #e2e8f0", fontSize: "12px" }}
                />
                <Legend wrapperStyle={{ fontSize: "11px" }} />
                <Bar yAxisId="left" dataKey="study_hours" name="Study Hours" fill="#0ea5e9" radius={[6, 6, 0, 0]} />
                <Bar yAxisId="right" dataKey="predicted_score" name="Predicted Score %" fill="#10b981" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
}
