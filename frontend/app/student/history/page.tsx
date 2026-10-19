"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  History,
  Sparkles,
  Calendar,
  X,
  CheckCircle2,
  AlertTriangle,
  ArrowRight,
  Eye,
  FileText
} from "lucide-react";
import { apiRequest } from "@/lib/api";
import { getSession } from "@/lib/auth";
import { PredictionResult } from "@/types";
import RiskBadge from "@/components/RiskBadge";

export default function PredictionHistoryPage() {
  const router = useRouter();
  const [history, setHistory] = useState<PredictionResult[]>([]);
  const [selectedPrediction, setSelectedPrediction] = useState<PredictionResult | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const session = getSession();
    if (!session) {
      router.push("/login");
      return;
    }
    fetchHistory();
  }, [router]);

  const fetchHistory = async () => {
    setLoading(true);
    try {
      const data = await apiRequest<PredictionResult[]>("/predictions");
      setHistory(data);
    } catch (err: any) {
      setError(err.message || "Failed to load prediction history.");
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (isoStr?: string) => {
    if (!isoStr) return "N/A";
    const d = new Date(isoStr);
    return d.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-10 space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-50 border border-indigo-100 text-indigo-700 text-xs font-semibold mb-2">
            <History className="w-3.5 h-3.5 text-indigo-600" />
            Audit Log
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-slate-900">
            Prediction History
          </h1>
          <p className="text-sm text-slate-500 mt-1">
            Permanent SQL database records of all academic assessments performed.
          </p>
        </div>

        <Link
          href="/student/assess"
          className="inline-flex items-center gap-2 px-4 py-2.5 text-xs font-bold text-white bg-indigo-600 hover:bg-indigo-700 rounded-xl shadow-xs transition-colors self-start sm:self-auto"
        >
          <Sparkles className="w-3.5 h-3.5" />
          New Assessment
        </Link>
      </div>

      {/* Content */}
      {loading ? (
        <div className="bg-white rounded-2xl border border-slate-200/80 p-12 text-center">
          <div className="inline-block animate-spin w-8 h-8 border-4 border-indigo-600 border-t-transparent rounded-full mb-3"></div>
          <p className="text-sm font-semibold text-slate-600">Retrieving records from SQL database...</p>
        </div>
      ) : error ? (
        <div className="bg-rose-50 border border-rose-200 rounded-2xl p-6 text-center text-xs text-rose-700">
          {error}
        </div>
      ) : history.length === 0 ? (
        <div className="bg-white rounded-2xl border border-slate-200/80 p-12 text-center max-w-lg mx-auto">
          <FileText className="w-12 h-12 text-slate-300 mx-auto mb-3" />
          <h3 className="text-base font-bold text-slate-900">No Assessment History Found</h3>
          <p className="text-xs text-slate-500 mt-1 mb-6">
            You have not run any performance predictions yet. Submit your first assessment to establish an academic baseline.
          </p>
          <Link
            href="/student/assess"
            className="px-5 py-2.5 text-xs font-bold text-white bg-indigo-600 hover:bg-indigo-700 rounded-xl shadow-xs"
          >
            Start Assessment
          </Link>
        </div>
      ) : (
        <div className="bg-white rounded-2xl border border-slate-200/80 shadow-xs overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs sm:text-sm">
              <thead>
                <tr className="bg-slate-50/80 border-b border-slate-200 text-slate-500 font-bold uppercase text-[11px] tracking-wider">
                  <th className="py-3.5 px-4 sm:px-6">Assessment Date</th>
                  <th className="py-3.5 px-4">Predicted Score</th>
                  <th className="py-3.5 px-4">Performance Level</th>
                  <th className="py-3.5 px-4">Risk Level</th>
                  <th className="py-3.5 px-4 sm:px-6 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {history.map((item, idx) => (
                  <tr
                    key={item.id || idx}
                    onClick={() => setSelectedPrediction(item)}
                    className="hover:bg-indigo-50/40 transition-colors cursor-pointer group"
                  >
                    <td className="py-4 px-4 sm:px-6 font-semibold text-slate-900 flex items-center gap-2">
                      <Calendar className="w-3.5 h-3.5 text-slate-400" />
                      {formatDate(item.created_at)}
                    </td>
                    <td className="py-4 px-4">
                      <span className="font-extrabold text-slate-900 text-base">
                        {item.predicted_score}%
                      </span>
                    </td>
                    <td className="py-4 px-4">
                      <span className="font-semibold text-slate-700">
                        {item.performance_category}
                      </span>
                    </td>
                    <td className="py-4 px-4">
                      <RiskBadge level={item.risk_level} size="sm" />
                    </td>
                    <td className="py-4 px-4 sm:px-6 text-right">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          setSelectedPrediction(item);
                        }}
                        className="inline-flex items-center gap-1 text-xs font-bold text-indigo-600 hover:text-indigo-800 bg-indigo-50 group-hover:bg-indigo-100/70 px-2.5 py-1.5 rounded-lg transition-colors"
                      >
                        <Eye className="w-3.5 h-3.5" />
                        Inspect
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* =========================================================================
          Detailed Drilldown Modal
         ========================================================================= */}
      {selectedPrediction && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-fade-in">
          <div className="bg-white rounded-3xl border border-slate-200 shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto p-6 sm:p-8 space-y-6">
            <div className="flex items-start justify-between pb-4 border-b border-slate-100">
              <div>
                <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                  Assessment ID #{selectedPrediction.id}
                </span>
                <h3 className="text-xl font-black text-slate-900 mt-0.5">
                  Assessment Detail & Guidance
                </h3>
                <p className="text-xs text-slate-500">{formatDate(selectedPrediction.created_at)}</p>
              </div>
              <button
                onClick={() => setSelectedPrediction(null)}
                className="p-1.5 rounded-xl text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Score & Risk Banner */}
            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 flex flex-wrap items-center justify-between gap-4">
              <div>
                <p className="text-xs font-semibold text-slate-500">Predicted Score</p>
                <p className="text-3xl font-black text-indigo-600 mt-0.5">
                  {selectedPrediction.predicted_score}%
                </p>
                <p className="text-xs font-medium text-slate-600 mt-0.5">
                  Category: <strong>{selectedPrediction.performance_category}</strong>
                </p>
              </div>
              <div>
                <p className="text-xs font-semibold text-slate-500 mb-1.5">Risk Status</p>
                <RiskBadge level={selectedPrediction.risk_level} size="lg" />
              </div>
            </div>

            {/* Input Values Used */}
            {selectedPrediction.inputs && (
              <div>
                <h4 className="text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                  Academic Inputs Logged in SQL
                </h4>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs">
                  <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-100">
                    <span className="text-slate-500">Attendance:</span>
                    <p className="font-bold text-slate-900 mt-0.5">{selectedPrediction.inputs.attendance}%</p>
                  </div>
                  <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-100">
                    <span className="text-slate-500">Study Hours:</span>
                    <p className="font-bold text-slate-900 mt-0.5">{selectedPrediction.inputs.study_hours}h/wk</p>
                  </div>
                  <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-100">
                    <span className="text-slate-500">Internals:</span>
                    <p className="font-bold text-slate-900 mt-0.5">{selectedPrediction.inputs.internal_score}%</p>
                  </div>
                  <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-100">
                    <span className="text-slate-500">Assignments:</span>
                    <p className="font-bold text-slate-900 mt-0.5">{selectedPrediction.inputs.assignment_score}%</p>
                  </div>
                  <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-100">
                    <span className="text-slate-500">Prior GPA:</span>
                    <p className="font-bold text-slate-900 mt-0.5">{selectedPrediction.inputs.previous_gpa}</p>
                  </div>
                  <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-100">
                    <span className="text-slate-500">Prior Marks:</span>
                    <p className="font-bold text-slate-900 mt-0.5">{selectedPrediction.inputs.previous_marks}%</p>
                  </div>
                  <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-100">
                    <span className="text-slate-500">Participation:</span>
                    <p className="font-bold text-slate-900 mt-0.5">{selectedPrediction.inputs.participation}%</p>
                  </div>
                  <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-100">
                    <span className="text-slate-500">Backlogs:</span>
                    <p className="font-bold text-slate-900 mt-0.5">{selectedPrediction.inputs.backlogs}</p>
                  </div>
                </div>
              </div>
            )}

            {/* Recommendations */}
            <div>
              <h4 className="text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                Stored Recommendations
              </h4>
              <div className="space-y-2">
                {selectedPrediction.recommendations && selectedPrediction.recommendations.length > 0 ? (
                  selectedPrediction.recommendations.map((r, i) => (
                    <div
                      key={i}
                      className="p-3 rounded-xl bg-slate-50 border border-slate-100 text-xs flex items-start gap-2.5"
                    >
                      <CheckCircle2 className="w-4 h-4 text-indigo-600 shrink-0 mt-0.5" />
                      <p className="text-slate-800 leading-relaxed">{r.recommendation_text}</p>
                    </div>
                  ))
                ) : (
                  <p className="text-xs text-slate-400">No active recommendations recorded.</p>
                )}
              </div>
            </div>

            <div className="pt-2 text-right">
              <button
                onClick={() => setSelectedPrediction(null)}
                className="px-5 py-2.5 text-xs font-bold text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-xl transition-colors"
              >
                Close Inspector
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
