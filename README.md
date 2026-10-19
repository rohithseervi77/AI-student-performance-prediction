# EduPredict AI — Student Performance Prediction & Early Warning System

> **An Academic Decision-Support Web Application** demonstrating Artificial Intelligence & Machine Learning, Python FastAPI, Normalized Relational SQL Database Architecture, Full-Stack Next.js, and Explainable Early-Risk Warning Analytics.

[![FastAPI](https://img.shields.io/badge/Backend-FastAPI_0.149-009688.svg?logo=fastapi)](https://fastapi.tiangolo.com)
[![Next.js](https://img.shields.io/badge/Frontend-Next.js_14-black.svg?logo=next.js)](https://nextjs.org)
[![Scikit-Learn](https://img.shields.io/badge/ML-Scikit--learn-F7931E.svg?logo=scikitlearn)](https://scikit-learn.org)
[![SQL](https://img.shields.io/badge/Database-MySQL_%2F_SQLite-4479A1.svg?logo=mysql)](https://www.mysql.com)
[![Tailwind CSS](https://img.shields.io/badge/Styling-Tailwind_CSS-38B2AC.svg?logo=tailwind-css)](https://tailwindcss.com)

---

## 1. Project Overview

**EduPredict AI** is a complete, production-grade web application engineered for colleges and universities to address student academic vulnerability before final semester examinations. 

By analyzing multi-dimensional academic metrics—including class attendance, continuous internal assessments, study discipline, coursework assignments, and historical GPAs—the system:
1. **Predicts Expected Final Exam Scores** using validated Scikit-learn regression models.
2. **Classifies Academic Performance Levels** (`Excellent`, `Good`, `Average`, `At Risk`).
3. **Proactively Triggers Early Risk Warnings** (`LOW`, `MEDIUM`, `HIGH`) through a hybrid rule-and-model warning matrix.
4. **Delivers Personalized Recommendations** derived from individual metric weaknesses (attendance deficits, backlog clearance plans, difficult subject remediation).
5. **Provides Role-Based Dashboards (RBAC)** separating Student self-assessment from Institutional Administrator class rosters, risk distribution breakdowns, and model explainability metrics.

Every feature connects to real Python ML pipelines and persistent relational SQL tables—**no static mock data or fabricated metrics**.

---

## 2. System Architecture

```
                       +--------------------------------------------------+
                       |              Next.js 14 Web Frontend             |
                       |  (React 18 + TypeScript + Tailwind + Recharts)   |
                       +--------------------------------------------------+
                                                |
                                     JWT-Authenticated REST
                                                |
                                                v
                       +--------------------------------------------------+
                       |             FastAPI Python Backend Server        |
                       |          (Uvicorn + Pydantic v2 + bcrypt)        |
                       +--------------------------------------------------+
                                  /                           \
                   Inference API /                             \ SQL Persistence
                                v                               v
+------------------------------------------+   +------------------------------------------+
|          Scikit-learn ML Pipeline        |   |       Relational SQL Database Engine     |
|   * Linear Regression vs Random Forest   |   |   * MySQL (Production) / SQLite (Local)  |
|   * Logistic Reg vs Gradient Boosting    |   |   * Normalized Tables, FKs, Indexes      |
|   * Feature Importance & Uncertainty     |   |   * Analytical Aggregation Queries       |
+------------------------------------------+   +------------------------------------------+
```

---

## 3. Technology Stack

### Frontend
- **Framework**: Next.js 14 (App Router)
- **Language**: TypeScript 5.5
- **Library**: React 18
- **Data Visualization**: Recharts (Scatter, Line, Bar, and Multi-Axis charts)
- **Styling**: Tailwind CSS & Lucide React icons
- **State & Session**: Token-based client session with automatic route guards

### Backend
- **Framework**: FastAPI 0.149
- **Server**: Uvicorn ASGI
- **Data Validation & Serialization**: Pydantic v2
- **ORM & Data Layer**: SQLAlchemy 2.0 with connection pooling
- **Authentication**: JWT (JSON Web Tokens) with HS256 encryption
- **Password Security**: Passlib & bcrypt salted hashing

### Machine Learning
- **Libraries**: Scikit-learn, Pandas, NumPy, Joblib
- **Regression Algorithms Compared**: Linear Regression ($R^2 \approx 0.965$, $\text{MAE} \approx 2.68$), Random Forest Regressor ($R^2 \approx 0.964$), Gradient Boosting Regressor ($R^2 \approx 0.960$)
- **Classification Algorithms Compared**: Logistic Regression ($\text{F1} \approx 0.848$), Random Forest Classifier ($\text{F1} \approx 0.836$), Gradient Boosting Classifier ($\text{F1} \approx 0.829$)
- **Explainability**: Normalized feature importance extraction ($87.7\%$ Internal Exam, $6.2\%$ Attendance, $2.1\%$ Assignments, $2.0\%$ Backlogs, $0.7\%$ Study Hours).
- **Uncertainty Bounds**: Transparent validation residual standard error estimation ($\pm 3.32$ points).

### Relational Database
- **Dialect**: MySQL 8.0+ / SQLite 3
- **Design**: 7 normalized relational tables with Primary Keys, Foreign Keys (`ON DELETE CASCADE`), Indexes, and Timestamp auditing.

---

## 4. Repository & Folder Structure

```
passport-automation-system/
├── frontend/
│   ├── app/
│   │   ├── page.tsx                     # Landing Page (Hero, Features, Workflow, Tech)
│   │   ├── login/page.tsx               # Unified Authentication with Autofill Demo buttons
│   │   ├── register/page.tsx            # Student Registration & Department Enrollment
│   │   ├── student/
│   │   │   ├── dashboard/page.tsx       # Student Dashboard (Summary cards, Key factors)
│   │   │   ├── assess/page.tsx          # Academic Assessment Form with live validation
│   │   │   ├── result/page.tsx          # Prediction Result, Risk, & Explainability weights
│   │   │   ├── history/page.tsx         # Prediction History Table & Drilldown Modal
│   │   │   └── analytics/page.tsx       # Interactive Recharts Visualizations
│   │   ├── admin/
│   │   │   ├── dashboard/page.tsx       # Admin Console (Summary metrics, Search/Filter Roster)
│   │   │   ├── students/[id]/page.tsx   # Individual Student Comprehensive Academic Audit
│   │   │   ├── risk-analytics/page.tsx  # Class-wide Risk Distribution Charts
│   │   │   └── ml-analytics/page.tsx    # Model Comparison (MAE, RMSE, R², Accuracy, F1)
│   │   ├── about-model/page.tsx         # Educational ML presentation & academic disclaimer
│   │   ├── layout.tsx
│   │   └── globals.css
│   ├── components/
│   │   ├── Navbar.tsx                   # Responsive Header with Role Badges & Drawer
│   │   ├── Footer.tsx                   # Footer with Tech Stack and Academic Governance
│   │   ├── MetricCard.tsx               # Metric Display Card Component
│   │   └── RiskBadge.tsx                # Semantic Green/Amber/Red Risk Indicators
│   ├── lib/
│   │   ├── api.ts                       # Typed Fetch API Client with Bearer token injection
│   │   └── auth.ts                      # Client session management & RBAC helpers
│   ├── types/
│   │   └── index.ts                     # TypeScript Domain Models
│   ├── package.json
│   ├── tailwind.config.js
│   └── tsconfig.json
│
├── backend/
│   ├── app/
│   │   ├── main.py                      # FastAPI App, CORS, Lifespan DB & ML loading
│   │   ├── config.py                    # Environment Configuration
│   │   ├── database.py                  # SQLAlchemy Engine, SessionLocal, raw SQL executor
│   │   ├── models/                      # Relational ORM Models (User, Student, Subject, etc.)
│   │   ├── schemas/                     # Pydantic v2 Request/Response validation schemas
│   │   ├── routes/
│   │   │   ├── auth.py                  # /api/auth (register, login, me)
│   │   │   ├── student.py               # /api/students (me, profile update, subjects)
│   │   │   ├── prediction.py            # /api/predict & /api/predictions history
│   │   │   ├── analytics.py             # /api/analytics/student time-series feeds
│   │   │   └── admin.py                 # /api/admin (stats, directory, risk-analysis, metrics)
│   │   ├── services/
│   │   │   ├── risk_engine.py           # Multi-factor Early Warning Risk Classifier
│   │   │   └── recommendation_engine.py # Personalized Actionable Advice Synthesizer
│   │   ├── ml/
│   │   │   ├── train.py                 # Model training, comparison, and evaluation pipeline
│   │   │   └── pipeline.py              # ML singleton inference & explainability engine
│   │   └── utils/
│   │       ├── security.py              # Bcrypt hashing & JWT utilities
│   │       └── deps.py                  # RBAC dependencies (require_student, require_admin)
│   ├── datasets/
│   │   ├── generate_dataset.py          # Synthetic dataset generator with realistic correlations
│   │   └── student_performance.csv      # 850 Realistic Student Records
│   ├── models/
│   │   ├── regressor_model.joblib       # Best Regressor Model Artifact
│   │   ├── classifier_model.joblib      # Best Classifier Model Artifact
│   │   ├── scaler.joblib                # Feature StandardScaler Artifact
│   │   └── model_metrics.json           # Actual Empirical Training & Evaluation Metrics
│   ├── tests/
│   │   └── test_backend.py              # Comprehensive Pytest Suite (10 unit/integration tests)
│   └── requirements.txt
│
├── database/
│   ├── schema.sql                       # Complete MySQL Relational DDL Schema
│   ├── seed.sql                         # Demonstration Seed Data
│   └── queries.sql                      # Demonstrable SQL Analytical & Reporting Queries
│
├── legacy_passport_system/              # Safely archived previous workspace files
├── .env.example                         # Environment variables template
└── README.md
```

---

## 5. Relational Database Design

### Normalized Tables
1. **`users`**: System authentication credentials (`email`, `password_hash`, `role`, `is_active`, `created_at`).
2. **`students`**: Student academic identifiers (`register_number`, `full_name`, `department`, `semester`, `section`).
3. **`subjects`**: Course catalog (`code`, `name`, `department`, `credits`).
4. **`academic_records`**: Snapshot of student continuous parameters (`attendance`, `study_hours`, `assignment_score`, `internal_score`, `previous_gpa`, `previous_marks`, `participation`, `backlogs`).
5. **`subject_scores`**: Breakdown of marks in individual subjects (`subject_id`, `score`, `exam_type`).
6. **`predictions`**: Permanent inference logs (`predicted_score`, `performance_category`, `risk_level`, `confidence`, `model_version`).
7. **`recommendations`**: Stored action items linked to predictions (`recommendation_text`, `category`, `severity`, `is_completed`).

### Demonstrable Analytical SQL Queries
Located in `database/queries.sql`:
- **Query 1**: High-risk student detection via multi-table `JOIN`.
- **Query 2**: Students with attendance below mandatory 75% threshold.
- **Query 3**: Institution-wide aggregate academic statistics (`AVG`, `MIN`, `MAX`).
- **Query 4**: Top-performing distinction candidate roster.
- **Query 5**: Backlog risk analysis.
- **Query 6**: Risk distribution percentages via `GROUP BY`.
- **Query 7**: Department-wise performance comparison.
- **Query 8**: Subject difficulty & failure rate detection.

---

## 6. Machine Learning Workflow

```
[Synthetic Academic Dataset (850 records)]
                  │
                  ▼
[Data Cleaning & Feature Validation] ── (Attendance 0-100, Backlogs >= 0)
                  │
                  ▼
[80/20 Stratified Train-Test Split]
                  │
                  ▼
[Model Candidate Comparison]
┌──────────────────────────────────────┬─────────────────────────────────────┐
│          Regression Models           │        Classification Models        │
├──────────────────────────────────────┼─────────────────────────────────────┤
│ * Linear Regression  (R² = 0.9653)   │ * Logistic Regression (F1 = 0.8477) │
│ * Random Forest Reg  (R² = 0.9638)   │ * Random Forest Clf   (F1 = 0.8357) │
│ * Gradient Boosting  (R² = 0.9603)   │ * Gradient Boosting   (F1 = 0.8294) │
└──────────────────────────────────────┴─────────────────────────────────────┘
                  │
                  ▼
[Model Selection & Artifact Serialization] ── (Joblib + model_metrics.json)
                  │
                  ▼
[Live FastAPI Lifespan In-Memory Loading]
                  │
                  ▼
[Inference + Explainability + Confidence Uncertainty Bounds]
```

---

## 7. API Documentation

| Method | Endpoint | Access | Purpose |
| :--- | :--- | :--- | :--- |
| `POST` | `/api/auth/register` | Public | Register new student with bcrypt hashing |
| `POST` | `/api/auth/login` | Public | Authenticate user & issue signed JWT |
| `GET` | `/api/auth/me` | Authenticated | Fetch active user profile |
| `GET` | `/api/students/me` | Student | Fetch student profile & latest prediction |
| `PUT` | `/api/students/me` | Student | Update student profile information |
| `GET` | `/api/students/subjects` | Student | Fetch configured curriculum subjects |
| `POST` | `/api/predict` | Student | Execute ML model inference & log to SQL |
| `GET` | `/api/predictions` | Student | Fetch student's prediction history from SQL |
| `GET` | `/api/predictions/{id}` | Student | Drilldown view of specific historical prediction |
| `GET` | `/api/analytics/student` | Student | Fetch Recharts time-series datasets |
| `GET` | `/api/admin/stats` | Admin | Compute class-wide KPIs & risk metrics |
| `GET` | `/api/admin/students` | Admin | Search, filter, sort, & paginate student roster |
| `GET` | `/api/admin/students/{id}` | Admin | Comprehensive student audit view |
| `DELETE`| `/api/admin/students/{id}` | Admin | Delete student record (cascading) |
| `GET` | `/api/admin/risk-analysis` | Admin | Class risk distribution & department metrics |
| `GET` | `/api/admin/model-metrics` | Admin | Empirical ML validation metrics (MAE, RMSE, R²) |
| `GET` | `/api/health` | Public | System status, DB, and ML pipeline health check |

---

## 8. Installation & Setup Guide

### Prerequisites
- Python 3.10+ (Tested on Python 3.13)
- Node.js 18+ (Tested on Node.js 20 LTS)
- MySQL 8.0+ (Optional; local SQLite is configured automatically out-of-the-box)

### Step 1: Clone & Configure Environment

```bash
cd "passport-automation-system"

# Copy environment settings
cp .env.example .env
cp .env.example backend/.env
cp .env.example frontend/.env.local
```

### Step 2: Database Setup

#### Option A: SQLite (Default Zero-Config)
The application automatically creates tables and seeds initial demo accounts on backend startup with `edupredict.db`. No installation required!

#### Option B: MySQL (Production Setup)
1. Ensure MySQL server is running:
   ```bash
   sudo systemctl start mysql
   ```
2. Create the database and import schema and seed data:
   ```bash
   mysql -u root -p < database/schema.sql
   mysql -u root -p < database/seed.sql
   ```
3. Update `DATABASE_URL` in `backend/.env`:
   ```env
   DATABASE_URL=mysql+pymysql://root:yourpassword@localhost:3306/edupredict_db
   ```

### Step 3: Backend Setup & ML Training

```bash
# 1. Create and activate a Python virtual environment
python3 -m venv backend/venv
source backend/venv/bin/activate

# 2. Install backend dependencies
pip install -r backend/requirements.txt

# 3. Generate synthetic dataset (850 records)
python3 backend/datasets/generate_dataset.py

# 4. Train, evaluate, and save machine learning models
python3 backend/app/ml/train.py

# 5. Run automated test suite
pytest backend/tests/test_backend.py -v

# 6. Start the FastAPI backend server
uvicorn app.main:app --app-dir backend --host 0.0.0.0 --port 8000 --reload
```
The FastAPI interactive Swagger UI will be available at: [http://localhost:8000/docs](http://localhost:8000/docs)

### Step 4: Frontend Setup

Open a new terminal window:
```bash
cd frontend

# 1. Install npm dependencies
npm install

# 2. Build or start Next.js development server
npm run dev
# or for optimized production build:
# npm run build && npm start
```
The web application will be accessible at: [http://localhost:3000](http://localhost:3000)

---

## 9. Demonstration Credentials

| Role | Email | Password | Access Rights |
| :--- | :--- | :--- | :--- |
| **Student** | `student@demo.com` | `Student@123` | Self-assessment, personal dashboard, prediction history, analytics |
| **Administrator** | `admin@demo.com` | `Admin@123` | Student directory, individual audit, risk distribution, ML metrics |

> **Tip**: On the `/login` page, you can click the **Student Demo** or **Admin Demo** buttons to automatically populate these credentials with one click.

---

## 10. Verification Checklist

- [x] **Backend Health Check**: `curl http://localhost:8000/api/health` returns `healthy` and `ml_pipeline_loaded: true`.
- [x] **Student Authentication**: Register and login flow with bcrypt password hashing and JWT issuance.
- [x] **Prediction Engine**: Live input form posts to `/api/predict`, evaluates Scikit-learn models, computes risk level, and generates personalized recommendations.
- [x] **SQL Persistence**: Every prediction and academic record is saved to SQL tables and retrievable via `/api/predictions`.
- [x] **Student Analytics**: Recharts graphs render Attendance vs Score, Internal Trends, and Subject breakdown with real database data.
- [x] **Admin Roster**: Search, filter by risk level, sort by GPA/score, and pagination.
- [x] **Student Audit**: Faculty counselor drilldown inspection view of individual student performance.
- [x] **Risk Distribution**: Dynamic aggregation pie chart of Low, Medium, and High-risk percentages.
- [x] **Model Explainability**: Admin view of actual MAE, RMSE, $R^2$, and feature importance weights.
- [x] **Role-Based Access Control**: Students are blocked from administrative routes with HTTP 403 Forbidden.

---

## 11. Troubleshooting

- **Backend fails to start (`ModuleNotFoundError`)**:
  Ensure the virtual environment is activated (`source backend/venv/bin/activate`) and run `pip install -r backend/requirements.txt`.
- **Model not loaded on startup**:
  Run `python3 backend/app/ml/train.py` to regenerate the model artifacts in `backend/models/`.
- **Frontend cannot connect to backend**:
  Verify the FastAPI server is running on port 8000. Ensure `NEXT_PUBLIC_API_URL` in `frontend/.env.local` points to `http://localhost:8000/api`.

---

## 12. Academic Presentation Disclaimers

> **Academic Note:** EduPredict AI is an educational decision-support prototype designed for early warning and academic counseling intervention. Predictions represent statistical models based on historical training patterns and must not be used as the sole determinant for disciplinary action or formal degree eligibility.
