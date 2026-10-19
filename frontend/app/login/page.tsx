"use client";

import React, { useState, useEffect, Suspense } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { BrainCircuit, Lock, Mail, ArrowRight, AlertCircle, Shield, User } from "lucide-react";
import { apiRequest } from "@/lib/api";
import { saveSession } from "@/lib/auth";

function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const demoParam = searchParams.get("demo");
    if (demoParam === "student") {
      setEmail("student@demo.com");
      setPassword("Student@123");
    } else if (demoParam === "admin") {
      setEmail("admin@demo.com");
      setPassword("Admin@123");
    }
  }, [searchParams]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      const data = await apiRequest("/auth/login", {
        method: "POST",
        body: JSON.stringify({ email: email.trim(), password }),
      });

      // Save token and session
      saveSession({
        token: data.access_token,
        role: data.role,
        userId: data.user_id,
        studentId: data.student_id,
        email: data.email,
        fullName: data.full_name,
      });

      // Role-based routing
      if (data.role === "admin") {
        router.push("/admin/dashboard");
      } else {
        router.push("/student/dashboard");
      }
    } catch (err: any) {
      setError(err.message || "Failed to sign in. Please verify your credentials.");
    } finally {
      setLoading(false);
    }
  };

  const handleFillDemo = (type: "student" | "admin") => {
    if (type === "student") {
      setEmail("student@demo.com");
      setPassword("Student@123");
    } else {
      setEmail("admin@demo.com");
      setPassword("Admin@123");
    }
    setError(null);
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-md">
        {/* Card Header */}
        <div className="text-center mb-8">
          <div className="w-12 h-12 rounded-2xl bg-indigo-600 text-white flex items-center justify-center mx-auto shadow-md shadow-indigo-600/20 mb-3">
            <BrainCircuit className="w-6 h-6" />
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900">Welcome Back</h2>
          <p className="text-sm text-slate-500 mt-1">Sign in to EduPredict AI portal</p>
        </div>

        {/* Demo Fill Helper Box */}
        <div className="mb-6 p-4 rounded-xl bg-indigo-50/70 border border-indigo-100">
          <p className="text-xs font-bold text-indigo-900 uppercase tracking-wider mb-2">
            Quick Demo Autofill:
          </p>
          <div className="grid grid-cols-2 gap-2">
            <button
              type="button"
              onClick={() => handleFillDemo("student")}
              className="flex items-center justify-center gap-1.5 py-1.5 px-2.5 text-xs font-semibold bg-white text-indigo-700 border border-indigo-200 rounded-lg hover:bg-indigo-100/50 transition-colors"
            >
              <User className="w-3.5 h-3.5" />
              Student Demo
            </button>
            <button
              type="button"
              onClick={() => handleFillDemo("admin")}
              className="flex items-center justify-center gap-1.5 py-1.5 px-2.5 text-xs font-semibold bg-white text-purple-700 border border-purple-200 rounded-lg hover:bg-purple-100/50 transition-colors"
            >
              <Shield className="w-3.5 h-3.5" />
              Admin Demo
            </button>
          </div>
        </div>

        {/* Form Card */}
        <div className="bg-white rounded-2xl border border-slate-200/90 shadow-sm p-6 sm:p-8">
          {error && (
            <div className="mb-5 p-3.5 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs flex items-start gap-2.5">
              <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                Email Address
              </label>
              <div className="relative">
                <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="student@demo.com"
                  className="w-full pl-10 pr-3.5 py-2.5 text-sm rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all text-slate-900"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                Password
              </label>
              <div className="relative">
                <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full pl-10 pr-3.5 py-2.5 text-sm rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all text-slate-900"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full mt-2 py-3 px-4 text-sm font-bold text-white bg-indigo-600 hover:bg-indigo-700 disabled:opacity-60 rounded-xl shadow-md shadow-indigo-600/20 flex items-center justify-center gap-2 transition-all"
            >
              {loading ? "Signing in..." : "Sign In"}
              {!loading && <ArrowRight className="w-4 h-4" />}
            </button>
          </form>

          <div className="mt-6 pt-5 border-t border-slate-100 text-center">
            <p className="text-xs text-slate-500">
              Don&apos;t have a student account?{" "}
              <Link href="/register" className="font-bold text-indigo-600 hover:underline">
                Register Here
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function LoginPage() {
  return (
    <Suspense fallback={
      <div className="min-h-[80vh] flex items-center justify-center">
        <div className="animate-spin w-8 h-8 border-4 border-indigo-600 border-t-transparent rounded-full"></div>
      </div>
    }>
      <LoginForm />
    </Suspense>
  );
}
