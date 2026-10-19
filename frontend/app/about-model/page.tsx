import React from "react";
import Link from "next/link";
import {
  BrainCircuit,
  BookOpen,
  Sparkles,
  HelpCircle,
  TrendingUp,
  Award,
  AlertTriangle,
  ShieldCheck,
  Cpu,
  Layers,
  ArrowRight
} from "lucide-react";

export default function AboutModelPage() {
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-16 space-y-12 animate-fade-in">
      {/* Header */}
      <div className="text-center max-w-2xl mx-auto">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-50 border border-indigo-100 text-indigo-700 text-xs font-semibold mb-3">
          <BookOpen className="w-3.5 h-3.5 text-indigo-600" />
          Academic Documentation & Methodology
        </div>
        <h1 className="text-3xl sm:text-4xl font-black text-slate-900 tracking-tight">
          About the Machine Learning System
        </h1>
        <p className="text-sm sm:text-base text-slate-600 mt-2">
          A clear, academically grounded walkthrough of how EduPredict AI evaluates student performance, quantifies risk, and produces early warnings.
        </p>
      </div>

      {/* Section 1: What is Machine Learning? */}
      <section className="bg-white rounded-2xl border border-slate-200/90 p-6 sm:p-8 shadow-xs space-y-3">
        <div className="w-10 h-10 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center mb-2">
          <BrainCircuit className="w-5 h-5" />
        </div>
        <h2 className="text-xl font-bold text-slate-900">1. What is Machine Learning?</h2>
        <p className="text-sm text-slate-600 leading-relaxed">
          Machine Learning (ML) is a branch of artificial intelligence where algorithms identify patterns from empirical historical data rather than following rigid, manually programmed if-else statements. In EduPredict AI, our models analyze prior academic records to learn how combinations of attendance, study discipline, and midterm exam scores translate to final semester results.
        </p>
      </section>

      {/* Section 2: What data is used? */}
      <section className="bg-white rounded-2xl border border-slate-200/90 p-6 sm:p-8 shadow-xs space-y-3">
        <div className="w-10 h-10 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center mb-2">
          <Layers className="w-5 h-5" />
        </div>
        <h2 className="text-xl font-bold text-slate-900">2. What Academic Data is Used?</h2>
        <p className="text-sm text-slate-600 leading-relaxed">
          The models evaluate eight primary academic features:
        </p>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2 text-xs">
          <div className="p-3 rounded-xl bg-slate-50 border border-slate-100">
            <strong>Attendance (%):</strong> Classroom presence and institutional minimum compliance.
          </div>
          <div className="p-3 rounded-xl bg-slate-50 border border-slate-100">
            <strong>Study Hours / Week:</strong> Self-directed revision and dedicated problem practice.
          </div>
          <div className="p-3 rounded-xl bg-slate-50 border border-slate-100">
            <strong>Internal Exam Average:</strong> Performance on periodic midterm assessments.
          </div>
          <div className="p-3 rounded-xl bg-slate-50 border border-slate-100">
            <strong>Assignment Average:</strong> Continuous homework and laboratory coursework consistency.
          </div>
          <div className="p-3 rounded-xl bg-slate-50 border border-slate-100">
            <strong>Previous Semester GPA:</strong> Cumulative historical academic standing (0.0 to 10.0).
          </div>
          <div className="p-3 rounded-xl bg-slate-50 border border-slate-100">
            <strong>Active Backlogs:</strong> Arrears requiring split study focus during the semester.
          </div>
        </div>
      </section>

      {/* Section 3: How Prediction Works & Model Selection */}
      <section className="bg-white rounded-2xl border border-slate-200/90 p-6 sm:p-8 shadow-xs space-y-3">
        <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center mb-2">
          <Cpu className="w-5 h-5" />
        </div>
        <h2 className="text-xl font-bold text-slate-900">3. How Prediction Works & Why Random Forest is Evaluated</h2>
        <p className="text-sm text-slate-600 leading-relaxed">
          During training, multiple model families are compared on a 20% hold-out test set:
        </p>
        <ul className="list-disc pl-5 text-sm text-slate-600 space-y-1.5 leading-relaxed">
          <li><strong>Linear Regression:</strong> Models direct linear contributions across features.</li>
          <li><strong>Random Forest Regressor:</strong> An ensemble of hundreds of decision trees trained on random subsets of data and features. It excels at capturing non-linear threshold effects (e.g. sharp penalties when attendance drops below 75% or backlogs increase).</li>
          <li><strong>Gradient Boosting:</strong> Sequentially corrects errors of prior trees for fine-grained convergence.</li>
        </ul>
        <p className="text-sm text-slate-600 leading-relaxed mt-2">
          The best model is selected based on validation performance, ensuring maximum generalizability without overfitting.
        </p>
      </section>

      {/* Section 4: What are MAE, RMSE, and R²? */}
      <section className="bg-white rounded-2xl border border-slate-200/90 p-6 sm:p-8 shadow-xs space-y-3">
        <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center mb-2">
          <TrendingUp className="w-5 h-5" />
        </div>
        <h2 className="text-xl font-bold text-slate-900">4. Evaluation Metrics Explained (MAE, RMSE, R²)</h2>
        <div className="space-y-3 pt-1 text-sm text-slate-600">
          <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-100">
            <h4 className="font-bold text-slate-900">MAE (Mean Absolute Error):</h4>
            <p className="text-xs text-slate-600 mt-1">
              The average absolute difference between predicted and actual scores. If our MAE is 2.7, predictions are typically within &plusmn;2.7 percentage points of true scores.
            </p>
          </div>
          <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-100">
            <h4 className="font-bold text-slate-900">RMSE (Root Mean Squared Error):</h4>
            <p className="text-xs text-slate-600 mt-1">
              Similar to MAE, but penalizes large errors more heavily due to the squaring term. A low RMSE indicates that the model rarely makes severe mispredictions.
            </p>
          </div>
          <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-100">
            <h4 className="font-bold text-slate-900">R² Score (Coefficient of Determination):</h4>
            <p className="text-xs text-slate-600 mt-1">
              Measures the proportion of variance in student final scores explained by the academic features. A score of 0.96 indicates 96% of final score variance is captured by the model.
            </p>
          </div>
        </div>
      </section>

      {/* Section 5: Early Warning Risk Engine */}
      <section className="bg-white rounded-2xl border border-slate-200/90 p-6 sm:p-8 shadow-xs space-y-3">
        <div className="w-10 h-10 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center mb-2">
          <AlertTriangle className="w-5 h-5" />
        </div>
        <h2 className="text-xl font-bold text-slate-900">5. How Student Risk is Calculated</h2>
        <p className="text-sm text-slate-600 leading-relaxed">
          EduPredict AI does not rely purely on a black-box model. It synthesizes machine learning predictions with statutory university guidelines:
        </p>
        <div className="space-y-2 pt-2 text-xs">
          <div className="p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-900">
            <strong>HIGH RISK:</strong> 2 or more pending backlogs, OR attendance below 75% with failing internals (&lt; 50%), OR a predicted final score in the failing zone (&lt; 50%).
          </div>
          <div className="p-3 rounded-xl bg-amber-50 border border-amber-200 text-amber-900">
            <strong>MEDIUM RISK:</strong> 1 active backlog, OR borderline attendance (75%–80%), OR marginal internal marks (50%–60%), OR average predicted standing (50%–65%).
          </div>
          <div className="p-3 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-900">
            <strong>LOW RISK:</strong> Stable attendance (&ge; 80%), zero backlogs, strong continuous assessment marks, and predicted score &ge; 65%.
          </div>
        </div>
      </section>

      {/* Section 6: Official Academic Disclaimer */}
      <section className="rounded-2xl border border-indigo-200 bg-indigo-50/70 p-6 sm:p-8 text-indigo-950 space-y-3">
        <div className="flex items-center gap-2 font-bold text-base text-indigo-900">
          <ShieldCheck className="w-5 h-5 text-indigo-600" />
          Academic Governance Disclaimer
        </div>
        <p className="text-xs sm:text-sm leading-relaxed text-indigo-800">
          <strong>Disclaimer:</strong> This system is an academic decision-support tool and should not be used as the sole basis for high-stakes academic decisions such as disciplinary action, grade assignment, or formal graduation eligibility. Model outputs represent probabilistic projections intended to guide proactive student mentoring and faculty counseling.
        </p>
      </section>

      {/* Action Button */}
      <div className="text-center pt-4">
        <Link
          href="/student/assess"
          className="inline-flex items-center gap-2 px-6 py-3 text-sm font-bold text-white bg-indigo-600 hover:bg-indigo-700 rounded-xl shadow-md transition-all hover:scale-102"
        >
          Try Performance Assessment Now
          <ArrowRight className="w-4 h-4" />
        </Link>
      </div>
    </div>
  );
}
