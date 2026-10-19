"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import {
  Sparkles,
  BookOpen,
  Calendar,
  Clock,
  Award,
  AlertTriangle,
  CheckCircle2,
  AlertCircle,
  HelpCircle,
  BrainCircuit,
  ArrowRight
} from "lucide-react";
import { apiRequest } from "@/lib/api";
import { getSession } from "@/lib/auth";

export default function AssessmentPage() {
  const router = useRouter();

  const [formData, setFormData] = useState({
    attendance: 88.0,
    study_hours: 14.0,
    assignment_score: 82.0,
    internal_score: 80.0,
    previous_gpa: 8.2,
    previous_marks: 80.0,
    participation: 85.0,
    backlogs: 0,
  });

  const [subjectMarks, setSubjectMarks] = useState<Record<string, number>>({
    "Mathematics": 80,
    "Programming": 85,
    "Database Management": 82,
    "Operating Systems": 78,
    "Software Engineering": 84,
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(false);
  const [loadingMessageIndex, setLoadingMessageIndex] = useState(0);

  const loadingMessages = [
    "Analyzing your academic performance...",
    "Executing Scikit-learn Random Forest model inference...",
    "Evaluating Early Warning risk matrix...",
    "Synthesizing personalized academic recommendations...",
    "Persisting prediction logs to SQL database..."
  ];

  useEffect(() => {
    const session = getSession();
    if (!session) {
      router.push("/login");
      return;
    }
  }, [router]);

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (loading) {
      interval = setInterval(() => {
        setLoadingMessageIndex((prev) => (prev + 1) % loadingMessages.length);
      }, 700);
    }
    return () => clearInterval(interval);
  }, [loading]);

  const handleFieldChange = (field: string, val: string) => {
    const num = parseFloat(val);
    setFormData((prev) => ({
      ...prev,
      [field]: isNaN(num) ? 0 : num,
    }));

    // Clear specific error
    if (errors[field]) {
      setErrors((prev) => {
        const copy = { ...prev };
        delete copy[field];
        return copy;
      });
    }
  };

  const handleSubjectChange = (subject: string, val: string) => {
    const num = parseFloat(val);
    setSubjectMarks((prev) => ({
      ...prev,
      [subject]: isNaN(num) ? 0 : Math.max(0, Math.min(100, num)),
    }));
  };

  const validate = (): boolean => {
    const errs: Record<string, string> = {};

    if (formData.attendance < 0 || formData.attendance > 100) {
      errs.attendance = "Attendance must be between 0% and 100%.";
    }
    if (formData.assignment_score < 0 || formData.assignment_score > 100) {
      errs.assignment_score = "Assignment average must be between 0% and 100%.";
    }
    if (formData.internal_score < 0 || formData.internal_score > 100) {
      errs.internal_score = "Internal exam average must be between 0% and 100%.";
    }
    if (formData.participation < 0 || formData.participation > 100) {
      errs.participation = "Class participation must be between 0% and 100%.";
    }
    if (formData.previous_marks < 0 || formData.previous_marks > 100) {
      errs.previous_marks = "Previous marks must be between 0% and 100%.";
    }
    if (formData.previous_gpa < 0 || formData.previous_gpa > 10) {
      errs.previous_gpa = "GPA must be between 0.0 and 10.0.";
    }
    if (formData.study_hours < 0) {
      errs.study_hours = "Study hours must be 0 or greater.";
    }
    if (formData.backlogs < 0) {
      errs.backlogs = "Backlog count must be 0 or greater.";
    }

    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    setLoading(true);

    try {
      const payload = {
        ...formData,
        subject_marks: subjectMarks,
      };

      const result = await apiRequest("/predict", {
        method: "POST",
        body: JSON.stringify(payload),
      });

      // Save to session storage for instant result render
      if (typeof window !== "undefined") {
        sessionStorage.setItem("latest_prediction", JSON.stringify(result));
      }

      router.push("/student/result");
    } catch (err: any) {
      setErrors({ form: err.message || "Prediction failed. Check backend connection." });
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-[70vh] flex flex-col items-center justify-center px-4">
        <div className="w-20 h-20 rounded-3xl bg-indigo-50 border border-indigo-200 flex items-center justify-center text-indigo-600 mb-6 relative shadow-lg shadow-indigo-500/10">
          <BrainCircuit className="w-10 h-10 animate-pulse" />
          <div className="absolute inset-0 rounded-3xl border-2 border-indigo-500 border-t-transparent animate-spin"></div>
        </div>
        <h2 className="text-xl font-extrabold text-slate-900 tracking-tight text-center">
          EduPredict AI Neural Engine
        </h2>
        <p className="text-sm font-semibold text-indigo-600 mt-2 text-center h-6 transition-all duration-300">
          {loadingMessages[loadingMessageIndex]}
        </p>
        <p className="text-xs text-slate-400 mt-4 max-w-sm text-center">
          Executing verified Python machine learning inference with transparent uncertainty bounds.
        </p>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-10">
      {/* Title */}
      <div className="mb-8">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-50 border border-indigo-100 text-indigo-700 text-xs font-semibold mb-3">
          <Sparkles className="w-3.5 h-3.5 text-indigo-500" />
          Performance Assessment Form
        </div>
        <h1 className="text-2xl sm:text-3xl font-black text-slate-900">
          Enter Academic Information
        </h1>
        <p className="text-sm text-slate-600 mt-1 max-w-2xl">
          Provide your current semester metrics. The machine learning model will analyze your performance trajectory, determine your early warning risk level, and generate tailored recommendations.
        </p>
      </div>

      {errors.form && (
        <div className="mb-6 p-4 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs flex items-start gap-2.5">
          <AlertCircle className="w-5 h-5 shrink-0 mt-0.5" />
          <span>{errors.form}</span>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-8">
        {/* =====================================================================
            1. Core Continuous Assessment & Attendance
           ===================================================================== */}
        <div className="bg-white rounded-2xl border border-slate-200/90 p-6 sm:p-8 shadow-xs">
          <h2 className="text-base font-bold text-slate-900 flex items-center gap-2 mb-1">
            <BookOpen className="w-5 h-5 text-indigo-600" />
            Continuous Academic Metrics
          </h2>
          <p className="text-xs text-slate-500 mb-6">
            Evaluated by the regression model for final score estimation.
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            {/* Attendance */}
            <div>
              <div className="flex justify-between items-center mb-1.5">
                <label className="text-xs font-bold text-slate-700 uppercase tracking-wider">
                  Attendance Percentage (0-100)
                </label>
                <span className="text-xs font-bold text-indigo-600">{formData.attendance}%</span>
              </div>
              <input
                type="number"
                min="0"
                max="100"
                step="0.1"
                required
                value={formData.attendance}
                onChange={(e) => handleFieldChange("attendance", e.target.value)}
                className={`w-full px-3.5 py-2.5 text-sm rounded-xl border ${
                  errors.attendance ? "border-rose-300 ring-2 ring-rose-100" : "border-slate-200"
                } focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 text-slate-900`}
              />
              {errors.attendance && <p className="text-xs text-rose-600 mt-1">{errors.attendance}</p>}
              <p className="text-[11px] text-slate-500 mt-1">Institutional requirement is &ge; 75%.</p>
            </div>

            {/* Study Hours */}
            <div>
              <div className="flex justify-between items-center mb-1.5">
                <label className="text-xs font-bold text-slate-700 uppercase tracking-wider">
                  Study Hours Per Week
                </label>
                <span className="text-xs font-bold text-indigo-600">{formData.study_hours} hrs</span>
              </div>
              <input
                type="number"
                min="0"
                max="60"
                step="0.5"
                required
                value={formData.study_hours}
                onChange={(e) => handleFieldChange("study_hours", e.target.value)}
                className={`w-full px-3.5 py-2.5 text-sm rounded-xl border ${
                  errors.study_hours ? "border-rose-300 ring-2 ring-rose-100" : "border-slate-200"
                } focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 text-slate-900`}
              />
              {errors.study_hours && <p className="text-xs text-rose-600 mt-1">{errors.study_hours}</p>}
              <p className="text-[11px] text-slate-500 mt-1">Average recommended is 12–16 hrs/week.</p>
            </div>

            {/* Internal Exam Average */}
            <div>
              <div className="flex justify-between items-center mb-1.5">
                <label className="text-xs font-bold text-slate-700 uppercase tracking-wider">
                  Internal Exam Average (0-100)
                </label>
                <span className="text-xs font-bold text-indigo-600">{formData.internal_score}%</span>
              </div>
              <input
                type="number"
                min="0"
                max="100"
                step="0.1"
                required
                value={formData.internal_score}
                onChange={(e) => handleFieldChange("internal_score", e.target.value)}
                className={`w-full px-3.5 py-2.5 text-sm rounded-xl border ${
                  errors.internal_score ? "border-rose-300 ring-2 ring-rose-100" : "border-slate-200"
                } focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 text-slate-900`}
              />
              {errors.internal_score && <p className="text-xs text-rose-600 mt-1">{errors.internal_score}</p>}
              <p className="text-[11px] text-slate-500 mt-1">Midterm and periodic assessment marks.</p>
            </div>

            {/* Assignment Average */}
            <div>
              <div className="flex justify-between items-center mb-1.5">
                <label className="text-xs font-bold text-slate-700 uppercase tracking-wider">
                  Assignment Average (0-100)
                </label>
                <span className="text-xs font-bold text-indigo-600">{formData.assignment_score}%</span>
              </div>
              <input
                type="number"
                min="0"
                max="100"
                step="0.1"
                required
                value={formData.assignment_score}
                onChange={(e) => handleFieldChange("assignment_score", e.target.value)}
                className={`w-full px-3.5 py-2.5 text-sm rounded-xl border ${
                  errors.assignment_score ? "border-rose-300 ring-2 ring-rose-100" : "border-slate-200"
                } focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 text-slate-900`}
              />
              {errors.assignment_score && <p className="text-xs text-rose-600 mt-1">{errors.assignment_score}</p>}
              <p className="text-[11px] text-slate-500 mt-1">Homework, projects, and lab submissions.</p>
            </div>
          </div>
        </div>

        {/* =====================================================================
            2. Historical & Engagement Parameters
           ===================================================================== */}
        <div className="bg-white rounded-2xl border border-slate-200/90 p-6 sm:p-8 shadow-xs">
          <h2 className="text-base font-bold text-slate-900 flex items-center gap-2 mb-1">
            <Award className="w-5 h-5 text-indigo-600" />
            Historical GPA & Engagement
          </h2>
          <p className="text-xs text-slate-500 mb-6">
            Prior academic baseline and classroom interaction level.
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            {/* Previous GPA */}
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                Previous Semester GPA (0.0 - 10.0)
              </label>
              <input
                type="number"
                min="0"
                max="10"
                step="0.01"
                required
                value={formData.previous_gpa}
                onChange={(e) => handleFieldChange("previous_gpa", e.target.value)}
                className={`w-full px-3.5 py-2.5 text-sm rounded-xl border ${
                  errors.previous_gpa ? "border-rose-300 ring-2 ring-rose-100" : "border-slate-200"
                } focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 text-slate-900`}
              />
              {errors.previous_gpa && <p className="text-xs text-rose-600 mt-1">{errors.previous_gpa}</p>}
            </div>

            {/* Previous Semester Marks */}
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                Previous Semester Marks (%) (0 - 100)
              </label>
              <input
                type="number"
                min="0"
                max="100"
                step="0.1"
                required
                value={formData.previous_marks}
                onChange={(e) => handleFieldChange("previous_marks", e.target.value)}
                className={`w-full px-3.5 py-2.5 text-sm rounded-xl border ${
                  errors.previous_marks ? "border-rose-300 ring-2 ring-rose-100" : "border-slate-200"
                } focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 text-slate-900`}
              />
              {errors.previous_marks && <p className="text-xs text-rose-600 mt-1">{errors.previous_marks}</p>}
            </div>

            {/* Participation */}
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                Classroom Participation Score (0 - 100)
              </label>
              <input
                type="number"
                min="0"
                max="100"
                step="1"
                required
                value={formData.participation}
                onChange={(e) => handleFieldChange("participation", e.target.value)}
                className={`w-full px-3.5 py-2.5 text-sm rounded-xl border ${
                  errors.participation ? "border-rose-300 ring-2 ring-rose-100" : "border-slate-200"
                } focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 text-slate-900`}
              />
              {errors.participation && <p className="text-xs text-rose-600 mt-1">{errors.participation}</p>}
            </div>

            {/* Backlogs */}
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                Number of Active Backlogs (&ge; 0)
              </label>
              <input
                type="number"
                min="0"
                max="15"
                step="1"
                required
                value={formData.backlogs}
                onChange={(e) => handleFieldChange("backlogs", e.target.value)}
                className={`w-full px-3.5 py-2.5 text-sm rounded-xl border ${
                  errors.backlogs ? "border-rose-300 ring-2 ring-rose-100" : "border-slate-200"
                } focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 text-slate-900`}
              />
              {errors.backlogs && <p className="text-xs text-rose-600 mt-1">{errors.backlogs}</p>}
              <p className="text-[11px] text-slate-500 mt-1">Pending arrears from prior semesters.</p>
            </div>
          </div>
        </div>

        {/* =====================================================================
            3. Subject-wise Marks Breakdown (Configurable)
           ===================================================================== */}
        <div className="bg-white rounded-2xl border border-slate-200/90 p-6 sm:p-8 shadow-xs">
          <h2 className="text-base font-bold text-slate-900 flex items-center gap-2 mb-1">
            <Calendar className="w-5 h-5 text-indigo-600" />
            Subject-wise Marks Breakdown
          </h2>
          <p className="text-xs text-slate-500 mb-6">
            Enter marks (0-100) across curriculum subjects to generate subject-specific remediation guidance.
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
            {Object.entries(subjectMarks).map(([subj, score]) => (
              <div key={subj} className="p-3.5 rounded-xl border border-slate-200 bg-slate-50/50">
                <label className="block text-xs font-bold text-slate-700 truncate mb-1">
                  {subj}
                </label>
                <div className="flex items-center gap-2">
                  <input
                    type="number"
                    min="0"
                    max="100"
                    value={score}
                    onChange={(e) => handleSubjectChange(subj, e.target.value)}
                    className="w-full px-3 py-1.5 text-sm rounded-lg border border-slate-200 bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 text-slate-900 font-semibold"
                  />
                  <span className="text-xs font-bold text-slate-400">%</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Submit Button */}
        <div className="pt-2">
          <button
            type="submit"
            disabled={loading}
            className="w-full py-4 px-6 text-base font-bold text-white bg-indigo-600 hover:bg-indigo-700 rounded-2xl shadow-xl shadow-indigo-600/20 flex items-center justify-center gap-2 transition-all hover:-translate-y-0.5"
          >
            <Sparkles className="w-5 h-5" />
            Predict My Performance
            <ArrowRight className="w-5 h-5 ml-1" />
          </button>
          <p className="text-xs text-slate-400 text-center mt-3">
            Inference performed live using trained Python Scikit-learn models & stored to MySQL / SQLite.
          </p>
        </div>
      </form>
    </div>
  );
}
