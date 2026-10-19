"use client";

import React from "react";
import Link from "next/link";
import {
  BrainCircuit,
  AlertTriangle,
  BarChart3,
  Lightbulb,
  ShieldCheck,
  ArrowRight,
  Sparkles,
  CheckCircle2,
  Cpu,
  Database,
  Code2,
  GraduationCap,
  TrendingUp,
  Layers
} from "lucide-react";

export default function LandingPage() {
  return (
    <div className="flex flex-col gap-20 sm:gap-28">
      {/* =========================================================================
          1. HERO SECTION
         ========================================================================= */}
      <section className="relative pt-12 pb-16 md:pt-20 md:pb-24 overflow-hidden">
        {/* Subtle decorative background gradient */}
        <div className="absolute inset-0 -z-10 flex items-center justify-center">
          <div className="w-[600px] h-[350px] bg-gradient-to-tr from-indigo-200/40 via-purple-200/30 to-blue-200/40 rounded-full blur-3xl opacity-70 transform -translate-y-12"></div>
        </div>

        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-indigo-50 border border-indigo-200/80 text-indigo-700 text-xs font-semibold mb-6 shadow-xs animate-fade-in">
            <Sparkles className="w-4 h-4 text-indigo-500" />
            <span>EduPredict AI • Predict. Understand. Improve.</span>
          </div>

          {/* Heading */}
          <h1 className="text-4xl sm:text-5xl md:text-6xl font-black text-slate-900 tracking-tight leading-[1.15] max-w-4xl mx-auto">
            AI-Powered Student <span className="bg-gradient-to-r from-indigo-600 via-indigo-700 to-purple-600 bg-clip-text text-transparent">Performance Prediction</span> & Early Warning System
          </h1>

          {/* Subtitle */}
          <p className="mt-6 text-lg sm:text-xl text-slate-600 max-w-2xl mx-auto font-normal leading-relaxed">
            Use academic data and machine learning to understand student performance, identify risks early, and provide personalized recommendations before final examinations.
          </p>

          {/* Buttons */}
          <div className="mt-8 flex flex-wrap items-center justify-center gap-3.5">
            <Link
              href="/register"
              className="inline-flex items-center gap-2 px-6 py-3.5 text-base font-semibold text-white bg-indigo-600 hover:bg-indigo-700 rounded-xl shadow-lg shadow-indigo-600/25 transition-all hover:-translate-y-0.5"
            >
              Get Started
              <ArrowRight className="w-4 h-4" />
            </Link>
            <Link
              href="/login"
              className="inline-flex items-center gap-2 px-6 py-3.5 text-base font-semibold text-slate-700 bg-white hover:bg-slate-50 border border-slate-200/90 rounded-xl shadow-xs transition-all hover:border-slate-300"
            >
              Login to Account
            </Link>
            <Link
              href="/login?demo=student"
              className="inline-flex items-center gap-2 px-5 py-3.5 text-sm font-semibold text-indigo-600 bg-indigo-50/80 hover:bg-indigo-100 rounded-xl border border-indigo-200/80 transition-colors"
            >
              Explore Demo Account
            </Link>
          </div>

          {/* Quick Metrics Bar */}
          <div className="mt-14 max-w-4xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-4 p-4 rounded-2xl bg-white/80 backdrop-blur-md border border-slate-200/80 shadow-xs">
            <div className="p-3 text-center border-r border-slate-100 last:border-0">
              <p className="text-2xl font-black text-indigo-600">96.5%</p>
              <p className="text-xs font-medium text-slate-500 mt-0.5">Model R² Variance</p>
            </div>
            <div className="p-3 text-center md:border-r border-slate-100">
              <p className="text-2xl font-black text-emerald-600">&lt; 2.7</p>
              <p className="text-xs font-medium text-slate-500 mt-0.5">Mean Absolute Error</p>
            </div>
            <div className="p-3 text-center border-r border-slate-100 last:border-0">
              <p className="text-2xl font-black text-amber-600">3-Tier</p>
              <p className="text-xs font-medium text-slate-500 mt-0.5">Risk Early Warning</p>
            </div>
            <div className="p-3 text-center">
              <p className="text-2xl font-black text-slate-800">100%</p>
              <p className="text-xs font-medium text-slate-500 mt-0.5">Relational SQL Storage</p>
            </div>
          </div>
        </div>
      </section>

      {/* =========================================================================
          2. FEATURES SECTION
         ========================================================================= */}
      <section className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-12">
          <h2 className="text-xs font-bold text-indigo-600 tracking-wider uppercase">Key Capabilities</h2>
          <p className="text-3xl font-extrabold text-slate-900 mt-1">
            Engineered for Modern Academic Institutions
          </p>
          <p className="text-sm text-slate-500 mt-2">
            Every feature connects live Python machine learning inference with normalized SQL tables.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Feature 1 */}
          <div className="bg-white rounded-2xl border border-slate-200/80 p-6 shadow-xs hover:shadow-md transition-shadow">
            <div className="w-12 h-12 rounded-xl bg-indigo-50 border border-indigo-100 flex items-center justify-center text-indigo-600 mb-4">
              <BrainCircuit className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold text-slate-900">AI Performance Prediction</h3>
            <p className="text-sm text-slate-600 mt-2 leading-relaxed">
              Trained regression algorithms evaluate attendance, continuous assessment marks, study hours, and academic history to estimate final examination scores.
            </p>
          </div>

          {/* Feature 2 */}
          <div className="bg-white rounded-2xl border border-slate-200/80 p-6 shadow-xs hover:shadow-md transition-shadow">
            <div className="w-12 h-12 rounded-xl bg-rose-50 border border-rose-100 flex items-center justify-center text-rose-600 mb-4">
              <AlertTriangle className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold text-slate-900">Early Risk Detection</h3>
            <p className="text-sm text-slate-600 mt-2 leading-relaxed">
              Multi-variable risk engine proactively flags students in LOW, MEDIUM, or HIGH risk brackets before low attendance or failing internals become irreversible.
            </p>
          </div>

          {/* Feature 3 */}
          <div className="bg-white rounded-2xl border border-slate-200/80 p-6 shadow-xs hover:shadow-md transition-shadow">
            <div className="w-12 h-12 rounded-xl bg-blue-50 border border-blue-100 flex items-center justify-center text-blue-600 mb-4">
              <BarChart3 className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold text-slate-900">Academic Analytics</h3>
            <p className="text-sm text-slate-600 mt-2 leading-relaxed">
              Interactive Recharts visualizations render attendance-vs-score correlation, internal exam trajectories, and subject-wise strength and weakness profiles.
            </p>
          </div>

          {/* Feature 4 */}
          <div className="bg-white rounded-2xl border border-slate-200/80 p-6 shadow-xs hover:shadow-md transition-shadow">
            <div className="w-12 h-12 rounded-xl bg-amber-50 border border-amber-100 flex items-center justify-center text-amber-600 mb-4">
              <Lightbulb className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold text-slate-900">Personalized Recommendations</h3>
            <p className="text-sm text-slate-600 mt-2 leading-relaxed">
              Context-aware rule engine synthesizes real student data to produce tailored, prioritized academic steps for study time, revision, and backlog recovery.
            </p>
          </div>

          {/* Feature 5 */}
          <div className="bg-white rounded-2xl border border-slate-200/80 p-6 shadow-xs hover:shadow-md transition-shadow">
            <div className="w-12 h-12 rounded-xl bg-emerald-50 border border-emerald-100 flex items-center justify-center text-emerald-600 mb-4">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold text-slate-900">Secure Student Data</h3>
            <p className="text-sm text-slate-600 mt-2 leading-relaxed">
              Role-Based Access Control (RBAC) powered by bcrypt password hashing and JWT authentication ensures students and administrators access appropriate views.
            </p>
          </div>

          {/* Feature 6 */}
          <div className="bg-white rounded-2xl border border-slate-200/80 p-6 shadow-xs hover:shadow-md transition-shadow">
            <div className="w-12 h-12 rounded-xl bg-purple-50 border border-purple-100 flex items-center justify-center text-purple-600 mb-4">
              <TrendingUp className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold text-slate-900">Historical Trend Logging</h3>
            <p className="text-sm text-slate-600 mt-2 leading-relaxed">
              Every prediction is permanently logged in normalized SQL tables, allowing students and counselors to audit academic growth over the entire degree program.
            </p>
          </div>
        </div>
      </section>

      {/* =========================================================================
          3. HOW IT WORKS SECTION
         ========================================================================= */}
      <section className="bg-slate-100/70 border-y border-slate-200/80 py-16">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-12">
            <h2 className="text-xs font-bold text-indigo-600 tracking-wider uppercase">End-to-End Workflow</h2>
            <p className="text-3xl font-extrabold text-slate-900 mt-1">How EduPredict AI Works</p>
            <p className="text-sm text-slate-500 mt-2">
              From academic input to model inference, risk calculation, and actionable intervention.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
            {[
              {
                step: "01",
                title: "Enter Academic Data",
                desc: "Student inputs attendance, internal marks, study hours, GPA, and subject scores.",
              },
              {
                step: "02",
                title: "AI Analyzes Performance",
                desc: "FastAPI validates data and passes features to pre-trained Scikit-learn models.",
              },
              {
                step: "03",
                title: "Predict Future Score",
                desc: "Regression model generates expected final score with validation uncertainty bounds.",
              },
              {
                step: "04",
                title: "Identify Risk",
                desc: "Early Warning System categorizes academic jeopardy into LOW, MEDIUM, or HIGH.",
              },
              {
                step: "05",
                title: "Receive Recommendations",
                desc: "Actionable advice is generated and persisted to SQL for ongoing tracking.",
              },
            ].map((s, idx) => (
              <div key={idx} className="bg-white rounded-xl p-5 border border-slate-200/80 relative shadow-xs">
                <span className="text-2xl font-black text-indigo-600/30">{s.step}</span>
                <h4 className="text-base font-bold text-slate-900 mt-2">{s.title}</h4>
                <p className="text-xs text-slate-500 mt-2 leading-relaxed">{s.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* =========================================================================
          4. TECHNOLOGY STACK SECTION
         ========================================================================= */}
      <section className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-12">
          <h2 className="text-xs font-bold text-indigo-600 tracking-wider uppercase">Engineered With Integrity</h2>
          <p className="text-3xl font-extrabold text-slate-900 mt-1">Demonstration Technology Stack</p>
          <p className="text-sm text-slate-500 mt-2">
            Built using modern, industry-standard languages and frameworks with zero mock data.
          </p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
          <div className="bg-white rounded-xl border border-slate-200/80 p-5 text-center shadow-xs">
            <Cpu className="w-8 h-8 text-indigo-600 mx-auto mb-2" />
            <h4 className="font-bold text-slate-900 text-sm">Python 3</h4>
            <p className="text-xs text-slate-500 mt-1">Core backend & ML processing</p>
          </div>
          <div className="bg-white rounded-xl border border-slate-200/80 p-5 text-center shadow-xs">
            <BrainCircuit className="w-8 h-8 text-purple-600 mx-auto mb-2" />
            <h4 className="font-bold text-slate-900 text-sm">Scikit-learn</h4>
            <p className="text-xs text-slate-500 mt-1">Random Forest & Regression</p>
          </div>
          <div className="bg-white rounded-xl border border-slate-200/80 p-5 text-center shadow-xs">
            <Code2 className="w-8 h-8 text-emerald-600 mx-auto mb-2" />
            <h4 className="font-bold text-slate-900 text-sm">FastAPI</h4>
            <p className="text-xs text-slate-500 mt-1">High-performance async API</p>
          </div>
          <div className="bg-white rounded-xl border border-slate-200/80 p-5 text-center shadow-xs">
            <Database className="w-8 h-8 text-amber-600 mx-auto mb-2" />
            <h4 className="font-bold text-slate-900 text-sm">Relational SQL</h4>
            <p className="text-xs text-slate-500 mt-1">MySQL / SQLAlchemy persistent store</p>
          </div>
          <div className="bg-white rounded-xl border border-slate-200/80 p-5 text-center shadow-xs col-span-2 md:col-span-1">
            <Layers className="w-8 h-8 text-sky-600 mx-auto mb-2" />
            <h4 className="font-bold text-slate-900 text-sm">Next.js & React</h4>
            <p className="text-xs text-slate-500 mt-1">TypeScript & Tailwind UI</p>
          </div>
        </div>
      </section>

      {/* =========================================================================
          5. CTA BANNER
         ========================================================================= */}
      <section className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 mb-12">
        <div className="rounded-3xl bg-gradient-to-r from-indigo-700 via-indigo-600 to-purple-700 text-white p-8 sm:p-12 text-center relative overflow-hidden shadow-xl">
          <div className="relative z-10 max-w-2xl mx-auto">
            <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
              Ready to evaluate student academic risk?
            </h2>
            <p className="mt-3 text-sm sm:text-base text-indigo-100">
              Register now as a student to calculate your personalized prediction, or log in with administrator credentials to view class-wide analytics.
            </p>
            <div className="mt-6 flex flex-wrap items-center justify-center gap-3">
              <Link
                href="/register"
                className="px-6 py-3 text-sm font-bold text-indigo-700 bg-white hover:bg-indigo-50 rounded-xl shadow-md transition-colors"
              >
                Create Student Account
              </Link>
              <Link
                href="/login"
                className="px-6 py-3 text-sm font-bold text-white bg-indigo-900/60 hover:bg-indigo-900/80 border border-white/20 rounded-xl transition-colors"
              >
                Sign In
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
