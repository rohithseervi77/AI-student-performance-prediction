"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  BrainCircuit,
  Sparkles,
  TrendingUp,
  AlertTriangle,
  CheckCircle2,
  AlertOctagon,
  ArrowRight,
  BookOpen,
  Calendar,
  Layers,
  HelpCircle,
  Clock,
  RotateCcw,
  BarChart2
} from "lucide-react";
import { PredictionResult } from "@/types";
import RiskBadge from "@/components/RiskBadge";

export default function PredictionResultPage() {
  const router = useRouter();
  const [result, setResult] = useState<PredictionResult | null>(null);

  useEffect(() => {
    if (typeof window !== "undefined") {
      const stored = sessionStorage.getItem("latest_prediction");
      if (stored) {
        try {
          setResult(JSON.parse(stored));
        } catch {
          router.push("/student/assess");
        }
      } else {
        router.push("/student/assess");
      }
    }
  }, [router]);

  if (!result) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-16 text-center">
        <p className="text-sm font-semibold text-slate-500">Loading prediction result...</p>
      </div>
    );
  }

  const inputs = result.inputs;
  const isHighRisk = result.risk_level === "HIGH";
  const isMedRisk = result.risk_level === "MEDIUM";

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-10 space-y-8 animate-fade-in">
      {/* =========================================================================
          Top Hero Result Card
         ========================================================================= */}
      <div
        className={`rounded-3xl p-8 sm:p-10 text-white shadow-xl relative overflow-hidden ${
          isHighRisk
            ? "bg-gradient-to-r from-rose-950 via-rose-900 to-slate-900 shadow-rose-950/20"
            : isMedRisk
            ? "bg-gradient-to-r from-amber-950 via-amber-900 to-slate-900 shadow-amber-950/20"
            : "bg-gradient-to-r from-indigo-950 via-indigo-900 to-slate-900 shadow-indigo-950/20"
        }`}
      >
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 text-xs font-semibold uppercase tracking-wider mb-3">
              <Sparkles className="w-3.5 h-3.5 text-indigo-300" />
              Your AI Performance Prediction
            </div>

            <div className="flex items-baseline gap-3">
              <span className="text-5xl sm:text-6xl font-black tracking-tight">
                {result.predicted_score}%
              </span>
              <span className="text-xl sm:text-2xl font-bold uppercase tracking-wide text-white/90">
                {result.performance_category} Performance
              </span>
            </div>

            <div className="mt-4 flex flex-wrap items-center gap-3">
              <div className="flex items-center gap-2">
                <span className="text-xs uppercase font-semibold text-white/70">Risk Level:</span>
                <RiskBadge level={result.risk_level} size="md" />
              </div>

              <div className="text-xs text-white/70 pl-3 border-l border-white/20">
                <span className="font-semibold text-white">{result.confidence}%</span> {result.confidence_label}
              </div>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row md:flex-col gap-2.5">
            <Link
              href="/student/assess"
              className="inline-flex items-center justify-center gap-2 px-5 py-2.5 text-xs font-bold text-slate-900 bg-white hover:bg-slate-100 rounded-xl transition-all"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              Recalculate
            </Link>
            <Link
              href="/student/analytics"
              className="inline-flex items-center justify-center gap-2 px-5 py-2.5 text-xs font-semibold text-white bg-white/10 hover:bg-white/20 rounded-xl border border-white/20 transition-all"
            >
              <BarChart2 className="w-3.5 h-3.5" />
              View Analytics
            </Link>
          </div>
        </div>
      </div>

      {/* =========================================================================
          Key Factors Used in Evaluation
         ========================================================================= */}
      {inputs && (
        <div className="bg-white rounded-2xl border border-slate-200/90 p-6 sm:p-8 shadow-xs">
          <h2 className="text-base font-bold text-slate-900 mb-1">Key Input Factors</h2>
          <p className="text-xs text-slate-500 mb-6">Actual student metrics processed by model pipeline</p>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            <div className="p-4 rounded-xl bg-slate-50 border border-slate-100">
              <span className="text-xs font-medium text-slate-500">Attendance</span>
              <p className="text-2xl font-extrabold text-slate-900 mt-1">{inputs.attendance}%</p>
              <span
                className={`text-[10px] font-semibold mt-1 inline-block ${
                  inputs.attendance >= 75 ? "text-emerald-600" : "text-rose-600"
                }`}
              >
                {inputs.attendance >= 75 ? "Statutory Satisfied" : "Debarment Danger"}
              </span>
            </div>

            <div className="p-4 rounded-xl bg-slate-50 border border-slate-100">
              <span className="text-xs font-medium text-slate-500">Internal Marks</span>
              <p className="text-2xl font-extrabold text-slate-900 mt-1">{inputs.internal_score}%</p>
              <span className="text-[10px] font-semibold text-indigo-600 mt-1 inline-block">
                Continuous Exam
              </span>
            </div>

            <div className="p-4 rounded-xl bg-slate-50 border border-slate-100">
              <span className="text-xs font-medium text-slate-500">Assignments</span>
              <p className="text-2xl font-extrabold text-slate-900 mt-1">{inputs.assignment_score}%</p>
              <span className="text-[10px] font-semibold text-slate-500 mt-1 inline-block">
                Task Submissions
              </span>
            </div>

            <div className="p-4 rounded-xl bg-slate-50 border border-slate-100">
              <span className="text-xs font-medium text-slate-500">Study Hours</span>
              <p className="text-2xl font-extrabold text-slate-900 mt-1">{inputs.study_hours}h/wk</p>
              <span className="text-[10px] font-semibold text-slate-500 mt-1 inline-block">
                Dedicated Revision
              </span>
            </div>
          </div>
        </div>
      )}

      {/* =========================================================================
          Model Explainability: Factors Influencing Prediction
         ========================================================================= */}
      <div className="bg-white rounded-2xl border border-slate-200/90 p-6 sm:p-8 shadow-xs">
        <div className="flex items-start justify-between pb-4 border-b border-slate-100">
          <div>
            <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
              <BrainCircuit className="w-5 h-5 text-indigo-600" />
              Factors Influencing Prediction
            </h2>
            <p className="text-xs text-slate-500 mt-0.5">
              Derived from Scikit-learn Random Forest model feature importances.
            </p>
          </div>
          <span className="hidden sm:inline-block text-[11px] font-medium text-slate-400 bg-slate-100 px-2.5 py-1 rounded-md">
            Model Feature Weights
          </span>
        </div>

        <div className="mt-6 space-y-4">
          {result.influencing_factors && result.influencing_factors.length > 0 ? (
            result.influencing_factors.map((factor, idx) => (
              <div key={idx} className="space-y-1.5">
                <div className="flex justify-between items-center text-xs">
                  <span className="font-bold text-slate-800">{factor.label}</span>
                  <div className="flex items-center gap-3">
                    {factor.student_value !== undefined && (
                      <span className="text-slate-500">
                        Your value: <strong className="text-slate-900">{factor.student_value}</strong>
                      </span>
                    )}
                    <span className="font-bold text-indigo-600">{factor.importance_pct}% weight</span>
                  </div>
                </div>
                <div className="w-full bg-slate-100 rounded-full h-2 overflow-hidden">
                  <div
                    className="bg-indigo-600 h-2 rounded-full transition-all duration-500"
                    style={{ width: `${Math.min(100, Math.max(8, factor.importance_pct))}%` }}
                  ></div>
                </div>
              </div>
            ))
          ) : (
            <p className="text-xs text-slate-400">Model feature importances being computed...</p>
          )}
        </div>

        <div className="mt-6 pt-4 border-t border-slate-100 text-[11px] text-slate-500 flex items-center gap-2">
          <HelpCircle className="w-4 h-4 text-slate-400 shrink-0" />
          <span>
            <strong>Academic Note:</strong> Feature importances reflect statistical variance contribution in the trained model. They are correlation-based weights rather than guaranteed causal relationships.
          </span>
        </div>
      </div>

      {/* =========================================================================
          Personalized AI Recommendations
         ========================================================================= */}
      <div className="bg-white rounded-2xl border border-slate-200/90 p-6 sm:p-8 shadow-xs">
        <h2 className="text-base font-bold text-slate-900 mb-1 flex items-center gap-2">
          <Sparkles className="w-5 h-5 text-indigo-600" />
          Actionable AI Recommendations
        </h2>
        <p className="text-xs text-slate-500 mb-6">
          Targeted interventions synthesized directly from your academic profile
        </p>

        <div className="space-y-3">
          {result.recommendations && result.recommendations.length > 0 ? (
            result.recommendations.map((rec, idx) => {
              const isUrgent = rec.severity === "urgent";
              const isWarning = rec.severity === "warning";

              return (
                <div
                  key={idx}
                  className={`p-4 rounded-xl border flex items-start gap-3.5 transition-all ${
                    isUrgent
                      ? "bg-rose-50/70 border-rose-200 text-rose-900"
                      : isWarning
                      ? "bg-amber-50/70 border-amber-200 text-amber-900"
                      : "bg-slate-50 border-slate-200/80 text-slate-900"
                  }`}
                >
                  <div className="mt-0.5">
                    {isUrgent ? (
                      <AlertOctagon className="w-5 h-5 text-rose-600 shrink-0" />
                    ) : isWarning ? (
                      <AlertTriangle className="w-5 h-5 text-amber-600 shrink-0" />
                    ) : (
                      <CheckCircle2 className="w-5 h-5 text-indigo-600 shrink-0" />
                    )}
                  </div>

                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-0.5">
                      <span
                        className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.2 rounded ${
                          isUrgent
                            ? "bg-rose-200/60 text-rose-800"
                            : isWarning
                            ? "bg-amber-200/60 text-amber-800"
                            : "bg-indigo-100 text-indigo-800"
                        }`}
                      >
                        {rec.category}
                      </span>
                      {isUrgent && (
                        <span className="text-[10px] font-bold uppercase text-rose-600">
                          Critical Priority
                        </span>
                      )}
                    </div>
                    <p className="text-xs sm:text-sm font-medium leading-relaxed">
                      {rec.recommendation_text}
                    </p>
                  </div>
                </div>
              );
            })
          ) : (
            <div className="p-4 rounded-xl bg-slate-50 text-center text-xs text-slate-500">
              No critical action items at this time. Maintain your current study routine.
            </div>
          )}
        </div>
      </div>

      {/* Navigation Buttons */}
      <div className="flex flex-wrap items-center justify-between gap-4 pt-2">
        <Link
          href="/student/dashboard"
          className="px-5 py-2.5 text-xs font-bold text-slate-700 bg-white border border-slate-200 rounded-xl hover:bg-slate-50 transition-colors"
        >
          Return to Dashboard
        </Link>
        <Link
          href="/student/history"
          className="inline-flex items-center gap-1.5 px-5 py-2.5 text-xs font-bold text-white bg-indigo-600 hover:bg-indigo-700 rounded-xl shadow-xs transition-colors"
        >
          View Full Prediction History <ArrowRight className="w-3.5 h-3.5" />
        </Link>
      </div>
    </div>
  );
}
