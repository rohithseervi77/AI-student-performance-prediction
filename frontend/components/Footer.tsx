import React from "react";
import Link from "next/link";
import { BrainCircuit, Database, Code, Cpu, ShieldCheck } from "lucide-react";

export default function Footer() {
  return (
    <footer className="mt-auto bg-slate-900 text-slate-300 border-t border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="md:col-span-2 space-y-3">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-indigo-600 flex items-center justify-center text-white">
                <BrainCircuit className="w-4 h-4" />
              </div>
              <span className="text-lg font-bold text-white tracking-tight">EduPredict AI</span>
            </div>
            <p className="text-sm text-slate-400 max-w-sm">
              Student Performance Prediction & Early Warning System. Combining statistical machine learning, relational SQL databases, and institutional academic guidance.
            </p>
            <div className="flex flex-wrap gap-2 pt-2">
              <span className="inline-flex items-center gap-1 text-[11px] font-medium px-2 py-0.5 rounded bg-slate-800 text-indigo-400 border border-slate-700">
                <Cpu className="w-3 h-3" /> Python & Scikit-learn
              </span>
              <span className="inline-flex items-center gap-1 text-[11px] font-medium px-2 py-0.5 rounded bg-slate-800 text-emerald-400 border border-slate-700">
                <Code className="w-3 h-3" /> FastAPI
              </span>
              <span className="inline-flex items-center gap-1 text-[11px] font-medium px-2 py-0.5 rounded bg-slate-800 text-amber-400 border border-slate-700">
                <Database className="w-3 h-3" /> Relational SQL
              </span>
              <span className="inline-flex items-center gap-1 text-[11px] font-medium px-2 py-0.5 rounded bg-slate-800 text-sky-400 border border-slate-700">
                Next.js & React
              </span>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-xs font-bold text-slate-200 uppercase tracking-wider mb-3">Quick Navigation</h4>
            <ul className="space-y-2 text-sm text-slate-400">
              <li>
                <Link href="/" className="hover:text-white transition-colors">Home Landing</Link>
              </li>
              <li>
                <Link href="/about-model" className="hover:text-white transition-colors">About the ML Model</Link>
              </li>
              <li>
                <Link href="/login" className="hover:text-white transition-colors">Unified Login</Link>
              </li>
              <li>
                <Link href="/register" className="hover:text-white transition-colors">Student Registration</Link>
              </li>
            </ul>
          </div>

          {/* Academic Governance */}
          <div>
            <h4 className="text-xs font-bold text-slate-200 uppercase tracking-wider mb-3">Academic Project</h4>
            <div className="text-xs text-slate-400 space-y-2">
              <p>Department of Computer Science & Engineering</p>
              <p className="text-slate-500">Demonstration Project: Machine Learning, Web Engineering & Database Architecture</p>
              <div className="pt-2 flex items-center gap-1 text-emerald-400 text-xs">
                <ShieldCheck className="w-3.5 h-3.5" />
                <span>Production Relational SQL Backend</span>
              </div>
            </div>
          </div>
        </div>

        {/* Disclaimer Bar */}
        <div className="mt-8 pt-8 border-t border-slate-800/80 text-center">
          <p className="text-xs text-slate-400 bg-slate-950/40 py-2.5 px-4 rounded-lg border border-slate-800 inline-block max-w-3xl">
            <span className="font-semibold text-slate-300">Disclaimer:</span> This system is an academic decision-support tool and should not be used as the sole basis for high-stakes academic decisions. Predictions represent model estimates derived from historical training data.
          </p>
          <p className="mt-4 text-xs text-slate-400">
            © {new Date().getFullYear()} EduPredict AI. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}
