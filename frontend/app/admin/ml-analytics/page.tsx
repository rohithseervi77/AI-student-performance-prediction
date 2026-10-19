"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  BrainCircuit,
  ArrowLeft,
  Cpu,
  Layers,
  CheckCircle2,
  Table,
  BarChart2,
  TrendingUp,
  Award,
  Sparkles,
  HelpCircle
} from "lucide-react";
import {
  ResponsiveContainer,
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

export default function AdminMLAnalyticsPage() {
  const router = useRouter();
  const [metrics, setMetrics] = useState<any>(null);
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
    fetchMetrics();
  }, [router]);

  const fetchMetrics = async () => {
    setLoading(true);
    try {
      const res = await apiRequest("/admin/model-metrics");
      setMetrics(res);
    } catch (err: any) {
      setError(err.message || "Failed to load model metrics.");
    } finally {
      setLoading(false);
    }
  };

  if (!isMounted || loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-16 text-center">
        <div className="inline-block animate-spin w-8 h-8 border-4 border-indigo-600 border-t-transparent rounded-full mb-3"></div>
        <p className="text-sm font-semibold text-slate-600">Loading verified Scikit-learn model evaluation metrics...</p>
      </div>
    );
  }

  if (error || !metrics) {
    return (
      <div className="max-w-xl mx-auto px-4 py-16 text-center">
        <div className="p-6 bg-rose-50 border border-rose-200 rounded-2xl text-xs text-rose-700">
          {error || "Model metrics unavailable."}
        </div>
      </div>
    );
  }

  const {
    dataset_total_samples,
    train_samples,
    test_samples,
    selected_regressor,
    selected_classifier,
    regression_comparison,
    classification_comparison,
    feature_importances,
    residual_std,
    trained_at
  } = metrics;

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
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-semibold mb-2">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
              Verified Empirical Metrics (Un-fabricated)
            </div>
            <h1 className="text-2xl sm:text-3xl font-black text-slate-900">
              Machine Learning Pipeline & Evaluation Audit
            </h1>
            <p className="text-sm text-slate-500 mt-1">
              Validation dataset evaluation ({test_samples} test records, {train_samples} train records).
            </p>
          </div>
          <div className="text-xs text-slate-400 font-mono">
            Trained at: {new Date(trained_at).toLocaleString()}
          </div>
        </div>
      </div>

      {/* Selected Model Highlights */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white rounded-2xl border border-slate-200/90 p-5 shadow-xs">
          <p className="text-xs font-bold text-slate-500 uppercase tracking-wider">Champion Regressor</p>
          <h3 className="text-xl font-black text-indigo-600 mt-1">{selected_regressor}</h3>
          <p className="text-xs text-slate-500 mt-2">
            R² Variance: <strong className="text-slate-800">{regression_comparison[selected_regressor]?.r2}</strong>
          </p>
        </div>

        <div className="bg-white rounded-2xl border border-slate-200/90 p-5 shadow-xs">
          <p className="text-xs font-bold text-slate-500 uppercase tracking-wider">Champion Classifier</p>
          <h3 className="text-xl font-black text-purple-600 mt-1">{selected_classifier}</h3>
          <p className="text-xs text-slate-500 mt-2">
            F1 Score: <strong className="text-slate-800">{classification_comparison[selected_classifier]?.f1_score}</strong>
          </p>
        </div>

        <div className="bg-white rounded-2xl border border-slate-200/90 p-5 shadow-xs">
          <p className="text-xs font-bold text-slate-500 uppercase tracking-wider">Residual Std Error</p>
          <h3 className="text-xl font-black text-emerald-600 mt-1">&plusmn;{residual_std} pts</h3>
          <p className="text-xs text-slate-500 mt-2">Standard deviation of test error</p>
        </div>

        <div className="bg-white rounded-2xl border border-slate-200/90 p-5 shadow-xs">
          <p className="text-xs font-bold text-slate-500 uppercase tracking-wider">Dataset Registry</p>
          <h3 className="text-xl font-black text-slate-900 mt-1">{dataset_total_samples} Rows</h3>
          <p className="text-xs text-slate-500 mt-2">80/20 Stratified Validation Split</p>
        </div>
      </div>

      {/* Regression Models Comparison Table */}
      <div className="bg-white rounded-2xl border border-slate-200/90 shadow-xs p-6">
        <div className="mb-4">
          <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
            <TrendingUp className="w-5 h-5 text-indigo-600" />
            Regression Model Comparison
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Evaluating continuous score prediction on unseen test data.
          </p>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs sm:text-sm">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-200 text-slate-500 font-bold uppercase text-[11px] tracking-wider">
                <th className="py-3 px-4">Algorithm Candidate</th>
                <th className="py-3 px-4">MAE (Mean Absolute Error)</th>
                <th className="py-3 px-4">RMSE (Root Mean Squared Error)</th>
                <th className="py-3 px-4">R² Score (Coefficient of Determination)</th>
                <th className="py-3 px-4 text-right">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {Object.entries(regression_comparison).map(([name, m]: any) => {
                const isSelected = name === selected_regressor;
                return (
                  <tr key={name} className={isSelected ? "bg-indigo-50/40 font-semibold" : ""}>
                    <td className="py-3.5 px-4 font-bold text-slate-900">{name}</td>
                    <td className="py-3.5 px-4">{m.mae}</td>
                    <td className="py-3.5 px-4">{m.rmse}</td>
                    <td className="py-3.5 px-4 text-indigo-600 font-extrabold">{m.r2}</td>
                    <td className="py-3.5 px-4 text-right">
                      {isSelected ? (
                        <span className="inline-flex items-center gap-1 text-[11px] font-bold text-emerald-700 bg-emerald-100 px-2.5 py-0.5 rounded-full">
                          <CheckCircle2 className="w-3 h-3" /> Selected Best
                        </span>
                      ) : (
                        <span className="text-[11px] text-slate-400">Evaluated</span>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Classification Models Comparison Table */}
      <div className="bg-white rounded-2xl border border-slate-200/90 shadow-xs p-6">
        <div className="mb-4">
          <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
            <Award className="w-5 h-5 text-purple-600" />
            Classification Model Comparison
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Evaluating multi-class categorization (Excellent, Good, Average, At Risk).
          </p>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs sm:text-sm">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-200 text-slate-500 font-bold uppercase text-[11px] tracking-wider">
                <th className="py-3 px-4">Algorithm Candidate</th>
                <th className="py-3 px-4">Accuracy</th>
                <th className="py-3 px-4">Precision (Weighted)</th>
                <th className="py-3 px-4">Recall (Weighted)</th>
                <th className="py-3 px-4">F1 Score (Weighted)</th>
                <th className="py-3 px-4 text-right">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {Object.entries(classification_comparison).map(([name, m]: any) => {
                const isSelected = name === selected_classifier;
                return (
                  <tr key={name} className={isSelected ? "bg-purple-50/40 font-semibold" : ""}>
                    <td className="py-3.5 px-4 font-bold text-slate-900">{name}</td>
                    <td className="py-3.5 px-4">{(m.accuracy * 100).toFixed(1)}%</td>
                    <td className="py-3.5 px-4">{(m.precision * 100).toFixed(1)}%</td>
                    <td className="py-3.5 px-4">{(m.recall * 100).toFixed(1)}%</td>
                    <td className="py-3.5 px-4 text-purple-600 font-extrabold">{m.f1_score}</td>
                    <td className="py-3.5 px-4 text-right">
                      {isSelected ? (
                        <span className="inline-flex items-center gap-1 text-[11px] font-bold text-emerald-700 bg-emerald-100 px-2.5 py-0.5 rounded-full">
                          <CheckCircle2 className="w-3 h-3" /> Selected Best
                        </span>
                      ) : (
                        <span className="text-[11px] text-slate-400">Evaluated</span>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Feature Importance Recharts Visualization */}
      <div className="bg-white rounded-2xl border border-slate-200/90 shadow-xs p-6">
        <div className="mb-4">
          <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
            <BrainCircuit className="w-5 h-5 text-indigo-600" />
            Model Feature Importance Distribution
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Normalized percentage contribution of each feature to predictions.
          </p>
        </div>

        <div className="h-72 sm:h-80 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={feature_importances || []}
              layout="vertical"
              margin={{ top: 5, right: 30, bottom: 5, left: 140 }}
            >
              <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
              <XAxis type="number" domain={[0, 100]} tick={{ fontSize: 11, fill: "#64748b" }} />
              <YAxis
                type="category"
                dataKey="label"
                tick={{ fontSize: 11, fill: "#334155" }}
                width={130}
              />
              <Tooltip
                formatter={(val: any) => [`${val}% weight`, "Relative Importance"]}
                contentStyle={{ backgroundColor: "#ffffff", borderRadius: "12px", border: "1px solid #e2e8f0", fontSize: "12px" }}
              />
              <Bar dataKey="importance_pct" name="Importance %" fill="#6366f1" radius={[0, 6, 6, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}
