"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  Shield,
  Users,
  AlertTriangle,
  AlertOctagon,
  TrendingUp,
  BookOpen,
  Search,
  Filter,
  ArrowUpDown,
  ChevronLeft,
  ChevronRight,
  Eye,
  RefreshCw,
  Sparkles,
  BarChart3,
  BrainCircuit
} from "lucide-react";
import { apiRequest } from "@/lib/api";
import { getSession, isAdmin } from "@/lib/auth";
import { AdminStats, AdminStudentSummary } from "@/types";
import MetricCard from "@/components/MetricCard";
import RiskBadge from "@/components/RiskBadge";

export default function AdminDashboardPage() {
  const router = useRouter();

  const [stats, setStats] = useState<AdminStats | null>(null);
  const [students, setStudents] = useState<AdminStudentSummary[]>([]);
  const [totalStudents, setTotalStudents] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Filters
  const [search, setSearch] = useState("");
  const [riskFilter, setRiskFilter] = useState("ALL");
  const [deptFilter, setDeptFilter] = useState("ALL");
  const [sortBy, setSortBy] = useState("name");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("asc");
  const [page, setPage] = useState(1);

  const departments = [
    "ALL",
    "Computer Science & Engineering",
    "Information Technology",
    "Electronics & Communication",
    "Mechanical Engineering",
  ];

  useEffect(() => {
    const session = getSession();
    if (!session) {
      router.push("/login");
      return;
    }
    if (session.role !== "admin") {
      router.push("/student/dashboard");
      return;
    }

    fetchStats();
  }, [router]);

  useEffect(() => {
    fetchStudents();
  }, [search, riskFilter, deptFilter, sortBy, sortOrder, page]);

  const fetchStats = async () => {
    try {
      const res = await apiRequest<AdminStats>("/admin/stats");
      setStats(res);
    } catch (err: any) {
      console.error("Stats load failed:", err);
    }
  };

  const fetchStudents = async () => {
    setLoading(true);
    try {
      const res = await apiRequest("/admin/students", {
        params: {
          search: search.trim() || undefined,
          risk: riskFilter,
          department: deptFilter,
          sort_by: sortBy,
          order: sortOrder,
          page,
          limit: 8,
        },
      });
      setStudents(res.items || []);
      setTotalStudents(res.total || 0);
      setTotalPages(res.total_pages || 1);
    } catch (err: any) {
      setError(err.message || "Failed to load student directory");
    } finally {
      setLoading(false);
    }
  };

  const toggleSort = (col: string) => {
    if (sortBy === col) {
      setSortOrder((prev) => (prev === "asc" ? "desc" : "asc"));
    } else {
      setSortBy(col);
      setSortOrder("desc");
    }
    setPage(1);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-10 space-y-8 animate-fade-in">
      {/* =========================================================================
          Top Header: Admin Console
         ========================================================================= */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 p-6 sm:p-8 rounded-3xl bg-gradient-to-r from-slate-900 via-indigo-950 to-purple-950 text-white shadow-xl shadow-purple-950/20">
        <div>
          <div className="flex items-center gap-2 mb-1.5">
            <span className="text-xs font-bold px-2.5 py-0.5 rounded-full bg-purple-500/20 text-purple-300 border border-purple-400/20 flex items-center gap-1">
              <Shield className="w-3.5 h-3.5" />
              Administrative Command Console
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black tracking-tight">
            Academic Performance & Early Warning Dashboard
          </h1>
          <p className="text-xs sm:text-sm text-purple-200/80 mt-1 max-w-xl">
            Live student risk tracking, academic evaluation rosters, and predictive regression analytics.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2.5">
          <Link
            href="/admin/risk-analytics"
            className="inline-flex items-center gap-1.5 px-4 py-2 text-xs font-bold text-white bg-white/10 hover:bg-white/20 border border-white/10 rounded-xl transition-colors"
          >
            <BarChart3 className="w-3.5 h-3.5" />
            Risk Distribution
          </Link>
          <Link
            href="/admin/ml-analytics"
            className="inline-flex items-center gap-1.5 px-4 py-2 text-xs font-bold text-white bg-indigo-600 hover:bg-indigo-700 rounded-xl shadow-xs transition-colors"
          >
            <BrainCircuit className="w-3.5 h-3.5" />
            ML Model Metrics
          </Link>
        </div>
      </div>

      {/* =========================================================================
          Admin Summary Metrics Cards
         ========================================================================= */}
      <div className="grid grid-cols-2 lg:grid-cols-6 gap-4">
        <MetricCard
          title="Total Students"
          value={stats ? stats.total_students : "--"}
          subtitle="Registered cohort"
          icon={<Users className="w-5 h-5" />}
          color="indigo"
        />

        <MetricCard
          title="Low Risk"
          value={stats ? stats.low_risk_count : "--"}
          subtitle="Satisfactory"
          icon={<Shield className="w-5 h-5" />}
          color="emerald"
        />

        <MetricCard
          title="Medium Risk"
          value={stats ? stats.medium_risk_count : "--"}
          subtitle="Requires attention"
          icon={<AlertTriangle className="w-5 h-5" />}
          color="amber"
        />

        <MetricCard
          title="High Risk"
          value={stats ? stats.high_risk_count : "--"}
          subtitle="Critical alert"
          icon={<AlertOctagon className="w-5 h-5" />}
          color="rose"
        />

        <MetricCard
          title="Avg Predicted"
          value={stats ? `${stats.average_predicted_score}%` : "--"}
          subtitle="Model cohort avg"
          icon={<TrendingUp className="w-5 h-5" />}
          color="blue"
        />

        <MetricCard
          title="Average GPA"
          value={stats ? `${stats.average_gpa}` : "--"}
          subtitle="Cumulative baseline"
          icon={<BookOpen className="w-5 h-5" />}
          color="slate"
        />
      </div>

      {/* =========================================================================
          Student Directory Table with Search, Filter & Pagination
         ========================================================================= */}
      <div className="bg-white rounded-2xl border border-slate-200/90 shadow-xs overflow-hidden">
        {/* Table Filter Bar */}
        <div className="p-4 sm:p-6 border-b border-slate-200/80 space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <h2 className="text-base font-bold text-slate-900">Student Directory</h2>
              <p className="text-xs text-slate-500 mt-0.5">
                Showing {students.length} of {totalStudents} evaluated students
              </p>
            </div>

            {/* Search Box */}
            <div className="relative w-full sm:w-72">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
              <input
                type="text"
                value={search}
                onChange={(e) => {
                  setSearch(e.target.value);
                  setPage(1);
                }}
                placeholder="Search name, register #..."
                className="w-full pl-9 pr-3.5 py-2 text-xs rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 text-slate-900"
              />
            </div>
          </div>

          {/* Filter Pills */}
          <div className="flex flex-wrap items-center gap-3 pt-2">
            <div className="flex items-center gap-1.5 text-xs text-slate-500">
              <Filter className="w-3.5 h-3.5" />
              <span>Risk Filter:</span>
            </div>
            {["ALL", "LOW", "MEDIUM", "HIGH"].map((rf) => (
              <button
                key={rf}
                onClick={() => {
                  setRiskFilter(rf);
                  setPage(1);
                }}
                className={`px-3 py-1 text-xs font-semibold rounded-lg border transition-all ${
                  riskFilter === rf
                    ? "bg-slate-900 text-white border-slate-900 shadow-xs"
                    : "bg-slate-50 text-slate-600 border-slate-200 hover:bg-slate-100"
                }`}
              >
                {rf}
              </button>
            ))}

            <div className="hidden sm:block h-4 w-px bg-slate-200 mx-1"></div>

            <div className="flex items-center gap-2">
              <span className="text-xs text-slate-500">Dept:</span>
              <select
                value={deptFilter}
                onChange={(e) => {
                  setDeptFilter(e.target.value);
                  setPage(1);
                }}
                className="text-xs font-semibold px-2.5 py-1 rounded-lg border border-slate-200 bg-slate-50 text-slate-700 focus:outline-none"
              >
                {departments.map((d) => (
                  <option key={d} value={d}>
                    {d}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          {loading ? (
            <div className="p-12 text-center">
              <div className="inline-block animate-spin w-8 h-8 border-4 border-indigo-600 border-t-transparent rounded-full mb-3"></div>
              <p className="text-xs font-semibold text-slate-600">Querying SQL student database...</p>
            </div>
          ) : students.length === 0 ? (
            <div className="p-12 text-center text-xs text-slate-500">
              No students found matching your search or risk criteria.
            </div>
          ) : (
            <table className="w-full text-left border-collapse text-xs sm:text-sm">
              <thead>
                <tr className="bg-slate-50/80 border-b border-slate-200 text-slate-500 font-bold uppercase text-[11px] tracking-wider">
                  <th
                    onClick={() => toggleSort("name")}
                    className="py-3.5 px-4 sm:px-6 cursor-pointer hover:text-slate-900 select-none"
                  >
                    <div className="flex items-center gap-1.5">
                      Student Details
                      <ArrowUpDown className="w-3 h-3" />
                    </div>
                  </th>
                  <th className="py-3.5 px-4">Department / Sem</th>
                  <th
                    onClick={() => toggleSort("gpa")}
                    className="py-3.5 px-4 cursor-pointer hover:text-slate-900 select-none"
                  >
                    <div className="flex items-center gap-1.5">
                      Current GPA
                      <ArrowUpDown className="w-3 h-3" />
                    </div>
                  </th>
                  <th
                    onClick={() => toggleSort("score")}
                    className="py-3.5 px-4 cursor-pointer hover:text-slate-900 select-none"
                  >
                    <div className="flex items-center gap-1.5">
                      Predicted Score
                      <ArrowUpDown className="w-3 h-3" />
                    </div>
                  </th>
                  <th className="py-3.5 px-4">Early Warning Risk</th>
                  <th className="py-3.5 px-4 sm:px-6 text-right">Audit</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {students.map((st) => (
                  <tr
                    key={st.id}
                    className="hover:bg-indigo-50/30 transition-colors group"
                  >
                    <td className="py-3.5 px-4 sm:px-6">
                      <p className="font-bold text-slate-900">{st.full_name}</p>
                      <p className="text-[11px] text-slate-500 font-mono mt-0.5">
                        {st.register_number} • {st.email}
                      </p>
                    </td>

                    <td className="py-3.5 px-4 text-xs">
                      <p className="font-semibold text-slate-800">{st.department}</p>
                      <p className="text-slate-500 text-[11px]">
                        Semester {st.semester} • Section {st.section}
                      </p>
                    </td>

                    <td className="py-3.5 px-4">
                      <span className="font-extrabold text-slate-900">{st.latest_gpa}</span>
                    </td>

                    <td className="py-3.5 px-4">
                      <span className="font-extrabold text-indigo-600 text-sm">
                        {st.latest_predicted_score}%
                      </span>
                      <span className="text-[10px] text-slate-400 block">
                        {st.latest_performance_category}
                      </span>
                    </td>

                    <td className="py-3.5 px-4">
                      <RiskBadge level={st.latest_risk_level} size="sm" />
                    </td>

                    <td className="py-3.5 px-4 sm:px-6 text-right">
                      <Link
                        href={`/admin/students/${st.id}`}
                        className="inline-flex items-center gap-1 px-3 py-1.5 text-xs font-bold text-indigo-700 bg-indigo-50 hover:bg-indigo-100 rounded-lg transition-colors"
                      >
                        <Eye className="w-3.5 h-3.5" />
                        Details
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>

        {/* Pagination Footer */}
        <div className="p-4 border-t border-slate-200 flex items-center justify-between text-xs text-slate-500">
          <span>
            Page <strong>{page}</strong> of <strong>{totalPages}</strong>
          </span>

          <div className="flex items-center gap-1">
            <button
              onClick={() => setPage((p) => Math.max(1, p - 1))}
              disabled={page <= 1}
              className="p-1.5 rounded-lg border border-slate-200 hover:bg-slate-50 disabled:opacity-40 disabled:hover:bg-transparent"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <button
              onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
              disabled={page >= totalPages}
              className="p-1.5 rounded-lg border border-slate-200 hover:bg-slate-50 disabled:opacity-40 disabled:hover:bg-transparent"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
