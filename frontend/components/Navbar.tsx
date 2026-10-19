"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter, usePathname } from "next/navigation";
import {
  BrainCircuit,
  GraduationCap,
  LayoutDashboard,
  Sparkles,
  History,
  BarChart3,
  Shield,
  LogOut,
  Menu,
  X,
  User,
  Info
} from "lucide-react";
import { getSession, clearSession } from "@/lib/auth";
import { UserSession } from "@/types";

export default function Navbar() {
  const router = useRouter();
  const pathname = usePathname();
  const [session, setSession] = useState<UserSession | null>(null);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    // Check session on mount and route changes
    setSession(getSession());
  }, [pathname]);

  const handleLogout = () => {
    clearSession();
    setSession(null);
    router.push("/login");
  };

  const isStudent = session?.role === "student";
  const isAdmin = session?.role === "admin";

  return (
    <header className="sticky top-0 z-50 bg-white/90 backdrop-blur-md border-b border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Brand */}
          <Link href="/" className="flex items-center gap-2.5 group">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-indigo-600 to-indigo-500 flex items-center justify-center text-white shadow-md shadow-indigo-500/20 group-hover:scale-105 transition-transform">
              <BrainCircuit className="w-5 h-5" />
            </div>
            <div>
              <span className="text-xl font-bold bg-gradient-to-r from-slate-900 via-indigo-950 to-indigo-700 bg-clip-text text-transparent">
                EduPredict<span className="text-indigo-600"> AI</span>
              </span>
              <span className="hidden sm:block text-[10px] uppercase font-semibold text-slate-500 tracking-wider">
                Performance & Warning System
              </span>
            </div>
          </Link>

          {/* Desktop Nav Links */}
          <nav className="hidden md:flex items-center gap-1">
            <Link
              href="/"
              className={`px-3 py-1.5 text-sm font-medium rounded-lg transition-colors ${
                pathname === "/" ? "text-indigo-600 bg-indigo-50/70" : "text-slate-600 hover:text-slate-900 hover:bg-slate-50"
              }`}
            >
              Home
            </Link>

            {isStudent && (
              <>
                <Link
                  href="/student/dashboard"
                  className={`flex items-center gap-1.5 px-3 py-1.5 text-sm font-medium rounded-lg transition-colors ${
                    pathname.startsWith("/student/dashboard")
                      ? "text-indigo-600 bg-indigo-50/70"
                      : "text-slate-600 hover:text-slate-900 hover:bg-slate-50"
                  }`}
                >
                  <LayoutDashboard className="w-4 h-4" />
                  Dashboard
                </Link>
                <Link
                  href="/student/assess"
                  className={`flex items-center gap-1.5 px-3 py-1.5 text-sm font-medium rounded-lg transition-colors ${
                    pathname.startsWith("/student/assess")
                      ? "text-indigo-600 bg-indigo-50/70"
                      : "text-slate-600 hover:text-slate-900 hover:bg-slate-50"
                  }`}
                >
                  <Sparkles className="w-4 h-4 text-indigo-500" />
                  Assess Performance
                </Link>
                <Link
                  href="/student/history"
                  className={`flex items-center gap-1.5 px-3 py-1.5 text-sm font-medium rounded-lg transition-colors ${
                    pathname.startsWith("/student/history")
                      ? "text-indigo-600 bg-indigo-50/70"
                      : "text-slate-600 hover:text-slate-900 hover:bg-slate-50"
                  }`}
                >
                  <History className="w-4 h-4" />
                  History
                </Link>
                <Link
                  href="/student/analytics"
                  className={`flex items-center gap-1.5 px-3 py-1.5 text-sm font-medium rounded-lg transition-colors ${
                    pathname.startsWith("/student/analytics")
                      ? "text-indigo-600 bg-indigo-50/70"
                      : "text-slate-600 hover:text-slate-900 hover:bg-slate-50"
                  }`}
                >
                  <BarChart3 className="w-4 h-4" />
                  Analytics
                </Link>
              </>
            )}

            {isAdmin && (
              <>
                <Link
                  href="/admin/dashboard"
                  className={`flex items-center gap-1.5 px-3 py-1.5 text-sm font-medium rounded-lg transition-colors ${
                    pathname === "/admin/dashboard"
                      ? "text-indigo-600 bg-indigo-50/70"
                      : "text-slate-600 hover:text-slate-900 hover:bg-slate-50"
                  }`}
                >
                  <Shield className="w-4 h-4 text-indigo-600" />
                  Admin Console
                </Link>
                <Link
                  href="/admin/risk-analytics"
                  className={`flex items-center gap-1.5 px-3 py-1.5 text-sm font-medium rounded-lg transition-colors ${
                    pathname.startsWith("/admin/risk-analytics")
                      ? "text-indigo-600 bg-indigo-50/70"
                      : "text-slate-600 hover:text-slate-900 hover:bg-slate-50"
                  }`}
                >
                  <BarChart3 className="w-4 h-4" />
                  Risk Distribution
                </Link>
                <Link
                  href="/admin/ml-analytics"
                  className={`flex items-center gap-1.5 px-3 py-1.5 text-sm font-medium rounded-lg transition-colors ${
                    pathname.startsWith("/admin/ml-analytics")
                      ? "text-indigo-600 bg-indigo-50/70"
                      : "text-slate-600 hover:text-slate-900 hover:bg-slate-50"
                  }`}
                >
                  <BrainCircuit className="w-4 h-4 text-emerald-600" />
                  ML Metrics
                </Link>
              </>
            )}

            <Link
              href="/about-model"
              className={`flex items-center gap-1.5 px-3 py-1.5 text-sm font-medium rounded-lg transition-colors ${
                pathname === "/about-model"
                  ? "text-indigo-600 bg-indigo-50/70"
                  : "text-slate-600 hover:text-slate-900 hover:bg-slate-50"
              }`}
            >
              <Info className="w-4 h-4" />
              About ML Model
            </Link>
          </nav>

          {/* Desktop Right Side Auth */}
          <div className="hidden md:flex items-center gap-3">
            {session ? (
              <div className="flex items-center gap-3">
                <div className="text-right">
                  <p className="text-xs font-bold text-slate-800">{session.fullName}</p>
                  <span
                    className={`inline-block px-1.5 py-0.2 rounded text-[10px] font-bold uppercase tracking-wider ${
                      isAdmin
                        ? "bg-purple-100 text-purple-700 border border-purple-200"
                        : "bg-indigo-100 text-indigo-700 border border-indigo-200"
                    }`}
                  >
                    {session.role}
                  </span>
                </div>
                <button
                  onClick={handleLogout}
                  className="flex items-center gap-1 px-3 py-1.5 text-xs font-semibold text-rose-600 hover:text-rose-700 hover:bg-rose-50 rounded-lg border border-rose-200/60 transition-colors"
                >
                  <LogOut className="w-3.5 h-3.5" />
                  Logout
                </button>
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <Link
                  href="/login"
                  className="px-3.5 py-1.5 text-sm font-semibold text-slate-700 hover:text-indigo-600 hover:bg-slate-100 rounded-lg transition-colors"
                >
                  Login
                </Link>
                <Link
                  href="/register"
                  className="px-4 py-1.5 text-sm font-semibold text-white bg-indigo-600 hover:bg-indigo-700 rounded-lg shadow-xs shadow-indigo-600/30 transition-all hover:shadow-md"
                >
                  Get Started
                </Link>
              </div>
            )}
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden flex items-center">
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-lg text-slate-600 hover:text-slate-900 hover:bg-slate-100 focus:outline-none"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t border-slate-200 bg-white px-4 pt-3 pb-6 space-y-2">
          {session && (
            <div className="pb-3 mb-2 border-b border-slate-100">
              <p className="text-sm font-bold text-slate-900">{session.fullName}</p>
              <p className="text-xs text-slate-500">{session.email} • {session.role.toUpperCase()}</p>
            </div>
          )}

          <Link
            href="/"
            onClick={() => setMobileMenuOpen(false)}
            className="block px-3 py-2 text-base font-medium text-slate-700 hover:bg-slate-50 rounded-lg"
          >
            Home
          </Link>

          {isStudent && (
            <>
              <Link
                href="/student/dashboard"
                onClick={() => setMobileMenuOpen(false)}
                className="block px-3 py-2 text-base font-medium text-slate-700 hover:bg-slate-50 rounded-lg"
              >
                Student Dashboard
              </Link>
              <Link
                href="/student/assess"
                onClick={() => setMobileMenuOpen(false)}
                className="block px-3 py-2 text-base font-medium text-slate-700 hover:bg-slate-50 rounded-lg"
              >
                Assess Performance
              </Link>
              <Link
                href="/student/history"
                onClick={() => setMobileMenuOpen(false)}
                className="block px-3 py-2 text-base font-medium text-slate-700 hover:bg-slate-50 rounded-lg"
              >
                Prediction History
              </Link>
              <Link
                href="/student/analytics"
                onClick={() => setMobileMenuOpen(false)}
                className="block px-3 py-2 text-base font-medium text-slate-700 hover:bg-slate-50 rounded-lg"
              >
                Performance Analytics
              </Link>
            </>
          )}

          {isAdmin && (
            <>
              <Link
                href="/admin/dashboard"
                onClick={() => setMobileMenuOpen(false)}
                className="block px-3 py-2 text-base font-medium text-slate-700 hover:bg-slate-50 rounded-lg"
              >
                Admin Console
              </Link>
              <Link
                href="/admin/risk-analytics"
                onClick={() => setMobileMenuOpen(false)}
                className="block px-3 py-2 text-base font-medium text-slate-700 hover:bg-slate-50 rounded-lg"
              >
                Risk Distribution
              </Link>
              <Link
                href="/admin/ml-analytics"
                onClick={() => setMobileMenuOpen(false)}
                className="block px-3 py-2 text-base font-medium text-slate-700 hover:bg-slate-50 rounded-lg"
              >
                ML Performance Metrics
              </Link>
            </>
          )}

          <Link
            href="/about-model"
            onClick={() => setMobileMenuOpen(false)}
            className="block px-3 py-2 text-base font-medium text-slate-700 hover:bg-slate-50 rounded-lg"
          >
            About ML Model
          </Link>

          <div className="pt-4 border-t border-slate-100 flex flex-col gap-2">
            {session ? (
              <button
                onClick={() => {
                  handleLogout();
                  setMobileMenuOpen(false);
                }}
                className="w-full flex items-center justify-center gap-2 px-4 py-2 text-sm font-semibold text-rose-600 bg-rose-50 rounded-lg"
              >
                <LogOut className="w-4 h-4" />
                Logout
              </button>
            ) : (
              <>
                <Link
                  href="/login"
                  onClick={() => setMobileMenuOpen(false)}
                  className="w-full text-center px-4 py-2 text-sm font-semibold text-slate-700 bg-slate-100 rounded-lg"
                >
                  Login
                </Link>
                <Link
                  href="/register"
                  onClick={() => setMobileMenuOpen(false)}
                  className="w-full text-center px-4 py-2 text-sm font-semibold text-white bg-indigo-600 rounded-lg"
                >
                  Get Started
                </Link>
              </>
            )}
          </div>
        </div>
      )}
    </header>
  );
}
