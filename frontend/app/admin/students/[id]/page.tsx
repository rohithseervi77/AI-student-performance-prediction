"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter, useParams } from "next/navigation";
import {
  ArrowLeft,
  User,
  BookOpen,
  Calendar,
  AlertTriangle,
  CheckCircle2,
  AlertOctagon,
  TrendingUp,
  BrainCircuit,
  Clock,
  Sparkles,
  Award,
  Hash
} from "lucide-react";
import { apiRequest } from "@/lib/api";
import { getSession } from "@/lib/auth";
import RiskBadge from "@/components/RiskBadge";
import MetricCard from "@/components/MetricCard";

export default function AdminStudentDetailPage() {
  const router = useRouter();
  const params = useParams();
  const studentId = params?.id;

  const [audit, setAudit] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const session = getSession();
    if (!session || session.role !== "admin") {
      router.push("/login");
      return;
    }

    if (studentId) {
      fetchStudentAudit();
    }
  }, [studentId, router]);

  const fetchStudentAudit = async () => {
    setLoading(true);
    try {
      const res = await apiRequest(`/admin/students/${studentId}`);
      setAudit(res);
    } catch (err: any) {
      setError(err.message || "Failed to load student audit record.");
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="max-w-6xl mx-auto px-4 py-16 text-center">
        <div className="inline-block animate-spin w-8 h-8 border-4 border-indigo-600 border-t-transparent rounded-full mb-3"></div>
        <p className="text-sm font-semibold text-slate-600">Retrieving student academic audit from SQL store...</p>
      </div>
    );
  }

  if (error || !audit) {
    return (
      <div className="max-w-xl mx-auto px-4 py-16 text-center">
        <div className="p-6 bg-rose-50 border border-rose-200 rounded-2xl text-xs text-rose-700">
          {error || "Student record not found."}
          <div className="mt-4">
            <Link
              href="/admin/dashboard"
              className="px-4 py-2 text-xs font-bold text-white bg-indigo-600 rounded-xl"
            >
              Back to Directory
            </Link>
          </div>
        </div>
      </div>
    );
  }

  const { student, latest_academic, current_prediction, recommendations, subject_scores, prediction_history } = audit;

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-10 space-y-8 animate-fade-in">
      {/* Top Breadcrumb */}
      <div>
        <Link
          href="/admin/dashboard"
          className="inline-flex items-center gap-1.5 text-xs font-bold text-slate-500 hover:text-indigo-600 transition-colors mb-3"
        >
          <ArrowLeft className="w-3.5 h-3.5" /> Back to Student Roster
        </Link>
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-2xl sm:text-3xl font-black text-slate-900">
              {student.full_name}
            </h1>
            <p className="text-xs text-slate-500 font-mono mt-1">
              {student.register_number} • {student.department} • Semester {student.semester} - Sec {student.section}
            </p>
          </div>
          <div>
            <RiskBadge level={current_prediction?.risk_level || "LOW"} size="lg" />
          </div>
        </div>
      </div>

      {/* Metric Cards Banner */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <MetricCard
          title="Predicted Score"
          value={current_prediction?.predicted_score ? `${current_prediction.predicted_score}%` : "Pending"}
          subtitle="ML Regressor"
          icon={<TrendingUp className="w-5 h-5" />}
          color="indigo"
        />

        <MetricCard
          title="Performance Category"
          value={current_prediction?.performance_category || "N/A"}
          subtitle="Model Classification"
          icon={<Award className="w-5 h-5" />}
          color="purple"
        />

        <MetricCard
          title="Attendance"
          value={latest_academic?.attendance ? `${latest_academic.attendance}%` : "--"}
          subtitle={latest_academic?.attendance >= 75 ? "Compliant" : "Attendance Shortage"}
          icon={<Calendar className="w-5 h-5" />}
          color={latest_academic?.attendance >= 75 ? "emerald" : "rose"}
        />

        <MetricCard
          title="Active Backlogs"
          value={latest_academic?.backlogs ?? 0}
          subtitle={latest_academic?.backlogs > 0 ? "Arrears pending" : "Zero arrears"}
          icon={<AlertTriangle className="w-5 h-5" />}
          color={latest_academic?.backlogs > 0 ? "rose" : "emerald"}
        />
      </div>

      {/* Grid: Academic Info & Recommendations */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Academic Assessment Breakdown */}
        <div className="bg-white rounded-2xl border border-slate-200/90 p-6 shadow-xs">
          <h2 className="text-base font-bold text-slate-900 mb-1">Academic Profile Parameters</h2>
          <p className="text-xs text-slate-500 mb-6">Continuous metrics recorded in SQL</p>

          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 text-xs">
            <div className="p-3 rounded-xl bg-slate-50 border border-slate-100">
              <span className="text-slate-500">Internal Marks</span>
              <p className="text-lg font-bold text-slate-900 mt-0.5">{latest_academic?.internal_score ?? "--"}%</p>
            </div>
            <div className="p-3 rounded-xl bg-slate-50 border border-slate-100">
              <span className="text-slate-500">Assignment Avg</span>
              <p className="text-lg font-bold text-slate-900 mt-0.5">{latest_academic?.assignment_score ?? "--"}%</p>
            </div>
            <div className="p-3 rounded-xl bg-slate-50 border border-slate-100">
              <span className="text-slate-500">Study Hours</span>
              <p className="text-lg font-bold text-slate-900 mt-0.5">{latest_academic?.study_hours ?? "--"} hrs/wk</p>
            </div>
            <div className="p-3 rounded-xl bg-slate-50 border border-slate-100">
              <span className="text-slate-500">Previous GPA</span>
              <p className="text-lg font-bold text-slate-900 mt-0.5">{latest_academic?.previous_gpa ?? "--"}</p>
            </div>
            <div className="p-3 rounded-xl bg-slate-50 border border-slate-100">
              <span className="text-slate-500">Prior Semester Marks</span>
              <p className="text-lg font-bold text-slate-900 mt-0.5">{latest_academic?.previous_marks ?? "--"}%</p>
            </div>
            <div className="p-3 rounded-xl bg-slate-50 border border-slate-100">
              <span className="text-slate-500">Participation</span>
              <p className="text-lg font-bold text-slate-900 mt-0.5">{latest_academic?.participation ?? "--"}%</p>
            </div>
          </div>

          {/* Subject Scores Table */}
          <div className="mt-6 pt-6 border-t border-slate-100">
            <h3 className="text-xs font-bold text-slate-700 uppercase tracking-wider mb-3">
              Curricular Subject Marks
            </h3>
            {subject_scores && subject_scores.length > 0 ? (
              <div className="space-y-2">
                {subject_scores.map((sc: any, idx: number) => (
                  <div
                    key={idx}
                    className="flex items-center justify-between p-2.5 rounded-xl bg-slate-50/80 border border-slate-100 text-xs"
                  >
                    <div>
                      <p className="font-bold text-slate-800">{sc.subject}</p>
                      <span className="text-[10px] text-slate-400 font-mono">{sc.code}</span>
                    </div>
                    <span
                      className={`font-black text-sm ${
                        sc.score < 50 ? "text-rose-600" : sc.score >= 80 ? "text-emerald-600" : "text-slate-900"
                      }`}
                    >
                      {sc.score}%
                    </span>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-xs text-slate-400">No subject marks registered.</p>
            )}
          </div>
        </div>

        {/* AI Recommendations & Actions */}
        <div className="bg-white rounded-2xl border border-slate-200/90 p-6 shadow-xs flex flex-col justify-between">
          <div>
            <h2 className="text-base font-bold text-slate-900 mb-1">Generated Recommendations</h2>
            <p className="text-xs text-slate-500 mb-6">Counselor & academic advisor action plan</p>

            <div className="space-y-3">
              {recommendations && recommendations.length > 0 ? (
                recommendations.map((rec: any, idx: number) => (
                  <div
                    key={idx}
                    className={`p-3.5 rounded-xl border text-xs flex items-start gap-3 ${
                      rec.severity === "urgent"
                        ? "bg-rose-50 border-rose-200 text-rose-900"
                        : rec.severity === "warning"
                        ? "bg-amber-50 border-amber-200 text-amber-900"
                        : "bg-slate-50 border-slate-200 text-slate-800"
                    }`}
                  >
                    {rec.severity === "urgent" ? (
                      <AlertOctagon className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
                    ) : (
                      <CheckCircle2 className="w-4 h-4 text-indigo-600 shrink-0 mt-0.5" />
                    )}
                    <div>
                      <span className="text-[10px] font-bold uppercase tracking-wider block mb-0.5 text-slate-500">
                        {rec.category} • {rec.severity}
                      </span>
                      <p className="font-medium leading-relaxed">{rec.recommendation_text}</p>
                    </div>
                  </div>
                ))
              ) : (
                <p className="text-xs text-slate-400">No recommendations on record.</p>
              )}
            </div>
          </div>

          {/* Prediction History Timeline */}
          <div className="mt-6 pt-6 border-t border-slate-100">
            <h3 className="text-xs font-bold text-slate-700 uppercase tracking-wider mb-3">
              Prediction Audit History
            </h3>
            <div className="space-y-2 max-h-48 overflow-y-auto">
              {prediction_history && prediction_history.length > 0 ? (
                prediction_history.map((ph: any) => (
                  <div
                    key={ph.id}
                    className="flex items-center justify-between p-2 rounded-lg bg-slate-50 text-xs"
                  >
                    <span className="text-slate-500">{ph.date}</span>
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-slate-900">{ph.predicted_score}%</span>
                      <RiskBadge level={ph.risk_level} size="sm" showIcon={false} />
                    </div>
                  </div>
                ))
              ) : (
                <p className="text-xs text-slate-400">No history logged.</p>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
