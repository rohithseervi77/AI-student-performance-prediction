"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  Sparkles,
  TrendingUp,
  Award,
  AlertTriangle,
  Clock,
  BookOpen,
  ArrowRight,
  ShieldCheck,
  CheckCircle2,
  Calendar,
  AlertCircle
} from "lucide-react";
import { apiRequest } from "@/lib/api";
import { getSession, isStudent } from "@/lib/auth";
import { StudentProfile } from "@/types";
import MetricCard from "@/components/MetricCard";
import RiskBadge from "@/components/RiskBadge";

export default function StudentDashboardPage() {
  const router = useRouter();
  const [profile, setProfile] = useState<StudentProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const session = getSession();
    if (!session) {
      router.push("/login");
      return;
    }
    if (session.role !== "student") {
      router.push("/admin/dashboard");
      return;
    }

    fetchProfile();
  }, [router]);

  const fetchProfile = async () => {
    setLoading(true);
    try {
      const data = await apiRequest<StudentProfile>("/students/me");
      setProfile(data);
    } catch (err: any) {
      setError(err.message || "Failed to load student dashboard");
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-16 text-center">
        <div className="inline-block animate-spin w-8 h-8 border-4 border-indigo-600 border-t-transparent rounded-full mb-4"></div>
        <p className="text-sm font-semibold text-slate-600">Retrieving academic profile from SQL store...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="max-w-xl mx-auto px-4 py-16">
        <div className="p-6 bg-rose-50 border border-rose-200 rounded-2xl text-center">
          <AlertCircle className="w-8 h-8 text-rose-600 mx-auto mb-2" />
          <h3 className="text-base font-bold text-rose-900">Unable to load dashboard</h3>
          <p className="text-xs text-rose-600 mt-1">{error}</p>
          <button
            onClick={fetchProfile}
            className="mt-4 px-4 py-2 text-xs font-bold text-white bg-rose-600 rounded-xl"
          >
            Retry Connection
          </button>
        </div>
      </div>
    );
  }

  const latestPred = profile?.latest_prediction;
  const latestAcad = profile?.latest_academic;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-10 space-y-8">
      {/* =========================================================================
          Top Header: Welcome, [Student Name]
         ========================================================================= */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 p-6 sm:p-8 rounded-3xl bg-gradient-to-r from-slate-900 via-indigo-950 to-indigo-900 text-white shadow-xl shadow-indigo-950/20">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-white/10 text-indigo-200 border border-white/10">
              {profile?.register_number} • Semester {profile?.semester} • Sec {profile?.section}
            </span>
            <span className="text-xs text-slate-400">{profile?.department}</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black tracking-tight">
            Welcome, {profile?.full_name}
          </h1>
          <p className="text-xs sm:text-sm text-indigo-200/80 mt-1 max-w-xl">
            Real-time Machine Learning prediction and Early Warning risk monitoring desk.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <Link
            href="/student/assess"
            className="inline-flex items-center gap-2 px-5 py-2.5 text-sm font-bold text-slate-900 bg-white hover:bg-indigo-50 rounded-xl shadow-md transition-all hover:scale-102"
          >
            <Sparkles className="w-4 h-4 text-indigo-600" />
            Assess Performance
          </Link>
          <Link
            href="/student/analytics"
            className="inline-flex items-center gap-2 px-4 py-2.5 text-sm font-semibold text-white bg-white/10 hover:bg-white/20 border border-white/10 rounded-xl transition-colors"
          >
            View Analytics
          </Link>
        </div>
      </div>

      {/* =========================================================================
          Summary Metric Cards
         ========================================================================= */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
        <MetricCard
          title="Predicted Score"
          value={latestPred ? `${latestPred.predicted_score}%` : "Not Assessed"}
          subtitle={latestPred ? `Confidence: ${latestPred.confidence}%` : "Run prediction"}
          icon={<TrendingUp className="w-6 h-6" />}
          color="indigo"
        />

        <MetricCard
          title="Performance Level"
          value={latestPred?.performance_category || "Pending"}
          subtitle="ML Category Classifier"
          icon={<Award className="w-6 h-6" />}
          color={
            latestPred?.performance_category === "Excellent"
              ? "emerald"
              : latestPred?.performance_category === "Good"
              ? "indigo"
              : latestPred?.performance_category === "At Risk"
              ? "rose"
              : "amber"
          }
        />

        <div className="bg-white rounded-2xl border border-slate-200/80 p-5 shadow-xs flex flex-col justify-between">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Risk Level</p>
              <div className="mt-2">
                {latestPred ? (
                  <RiskBadge level={latestPred.risk_level} size="lg" />
                ) : (
                  <span className="text-sm font-semibold text-slate-400">No Assessment</span>
                )}
              </div>
            </div>
            <div className="p-2.5 rounded-xl border bg-amber-50 text-amber-600 border-amber-100">
              <AlertTriangle className="w-6 h-6" />
            </div>
          </div>
          <p className="text-xs text-slate-400 mt-3">Early Warning System Status</p>
        </div>

        <MetricCard
          title="Current GPA"
          value={latestAcad ? `${latestAcad.previous_gpa}` : "N/A"}
          subtitle="Cumulative Grade Point"
          icon={<BookOpen className="w-6 h-6" />}
          color="emerald"
        />
      </div>

      {/* =========================================================================
          Academic Factor Standing & Quick Actions
         ========================================================================= */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left: Academic Profile Snapshot */}
        <div className="lg:col-span-2 bg-white rounded-2xl border border-slate-200/80 p-6 shadow-xs space-y-6">
          <div className="flex items-center justify-between pb-4 border-b border-slate-100">
            <div>
              <h3 className="text-base font-bold text-slate-900">Current Assessment Factors</h3>
              <p className="text-xs text-slate-500 mt-0.5">Parameters evaluating student standing</p>
            </div>
            <Link
              href="/student/assess"
              className="text-xs font-bold text-indigo-600 hover:text-indigo-700 flex items-center gap-1"
            >
              Update Marks <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            <div className="p-4 rounded-xl bg-slate-50 border border-slate-100">
              <p className="text-xs font-medium text-slate-500">Attendance</p>
              <p className="text-xl font-extrabold text-slate-900 mt-1">
                {latestAcad ? `${latestAcad.attendance}%` : "--"}
              </p>
              <span
                className={`text-[10px] font-semibold mt-1 inline-block ${
                  (latestAcad?.attendance || 0) >= 75 ? "text-emerald-600" : "text-rose-600"
                }`}
              >
                {(latestAcad?.attendance || 0) >= 75 ? "Above 75% Criteria" : "Shortage Warning"}
              </span>
            </div>

            <div className="p-4 rounded-xl bg-slate-50 border border-slate-100">
              <p className="text-xs font-medium text-slate-500">Study Hours</p>
              <p className="text-xl font-extrabold text-slate-900 mt-1">
                {latestAcad ? `${latestAcad.study_hours}h/wk` : "--"}
              </p>
              <span className="text-[10px] font-semibold text-slate-500 mt-1 inline-block">
                Weekly Self-study
              </span>
            </div>

            <div className="p-4 rounded-xl bg-slate-50 border border-slate-100">
              <p className="text-xs font-medium text-slate-500">Internal Marks</p>
              <p className="text-xl font-extrabold text-slate-900 mt-1">
                {latestAcad ? `${latestAcad.internal_score}%` : "--"}
              </p>
              <span className="text-[10px] font-semibold text-indigo-600 mt-1 inline-block">
                Continuous Exam
              </span>
            </div>

            <div className="p-4 rounded-xl bg-slate-50 border border-slate-100">
              <p className="text-xs font-medium text-slate-500">Active Backlogs</p>
              <p
                className={`text-xl font-extrabold mt-1 ${
                  (latestAcad?.backlogs || 0) > 0 ? "text-rose-600" : "text-emerald-600"
                }`}
              >
                {latestAcad ? latestAcad.backlogs : "0"}
              </p>
              <span
                className={`text-[10px] font-semibold mt-1 inline-block ${
                  (latestAcad?.backlogs || 0) > 0 ? "text-rose-600" : "text-emerald-600"
                }`}
              >
                {(latestAcad?.backlogs || 0) > 0 ? "Requires Clearance" : "Clear Record"}
              </span>
            </div>
          </div>

          {/* Quick Notice */}
          <div className="p-4 rounded-xl bg-indigo-50/60 border border-indigo-100 text-xs text-indigo-900 flex items-start gap-3">
            <ShieldCheck className="w-5 h-5 text-indigo-600 shrink-0 mt-0.5" />
            <div>
              <p className="font-bold">Model Decision-Support Indicator</p>
              <p className="mt-0.5 text-indigo-700 leading-relaxed">
                Predictions are generated by a pre-trained regression pipeline and evaluated against university risk thresholds. All data is securely stored in SQL.
              </p>
            </div>
          </div>
        </div>

        {/* Right: Quick Launch & Guidance */}
        <div className="bg-white rounded-2xl border border-slate-200/80 p-6 shadow-xs flex flex-col justify-between">
          <div>
            <h3 className="text-base font-bold text-slate-900 mb-1">Academic Tools</h3>
            <p className="text-xs text-slate-500 mb-4">Direct student portals</p>

            <div className="space-y-3">
              <Link
                href="/student/assess"
                className="flex items-center justify-between p-3.5 rounded-xl border border-slate-100 hover:border-indigo-200 hover:bg-indigo-50/40 transition-all group"
              >
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-lg bg-indigo-100 text-indigo-700">
                    <Sparkles className="w-4 h-4" />
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-slate-900 group-hover:text-indigo-600">
                      Performance Assessment
                    </h4>
                    <p className="text-xs text-slate-500">Run fresh ML model prediction</p>
                  </div>
                </div>
                <ArrowRight className="w-4 h-4 text-slate-400 group-hover:text-indigo-600" />
              </Link>

              <Link
                href="/student/history"
                className="flex items-center justify-between p-3.5 rounded-xl border border-slate-100 hover:border-indigo-200 hover:bg-indigo-50/40 transition-all group"
              >
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-lg bg-emerald-100 text-emerald-700">
                    <Clock className="w-4 h-4" />
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-slate-900 group-hover:text-indigo-600">
                      Prediction History
                    </h4>
                    <p className="text-xs text-slate-500">Inspect historical records</p>
                  </div>
                </div>
                <ArrowRight className="w-4 h-4 text-slate-400 group-hover:text-indigo-600" />
              </Link>

              <Link
                href="/student/analytics"
                className="flex items-center justify-between p-3.5 rounded-xl border border-slate-100 hover:border-indigo-200 hover:bg-indigo-50/40 transition-all group"
              >
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-lg bg-purple-100 text-purple-700">
                    <TrendingUp className="w-4 h-4" />
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-slate-900 group-hover:text-indigo-600">
                      Interactive Charts
                    </h4>
                    <p className="text-xs text-slate-500">Explore Recharts graphs</p>
                  </div>
                </div>
                <ArrowRight className="w-4 h-4 text-slate-400 group-hover:text-indigo-600" />
              </Link>
            </div>
          </div>

          <div className="mt-6 pt-4 border-t border-slate-100">
            <Link
              href="/about-model"
              className="text-xs font-medium text-slate-500 hover:text-indigo-600 flex items-center justify-between"
            >
              <span>Learn how the ML model works</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
