"""
EduPredict AI - FastAPI Application Server
Main entry point orchestrating routes, database lifecycle, ML loading, and CORS.
"""

from contextlib import asynccontextmanager
from fastapi import FastAPI, Request, status
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
from sqlalchemy.orm import Session

from app.config import settings
from app.database import engine, Base, SessionLocal
from app.models import User, Student, Subject, AcademicRecord, Prediction, Recommendation, SubjectScore
from app.utils.security import hash_password
from app.ml.pipeline import ml_pipeline

from app.routes.auth import router as auth_router
from app.routes.student import router as student_router
from app.routes.prediction import router as prediction_router
from app.routes.analytics import router as analytics_router
from app.routes.admin import router as admin_router

def seed_initial_demo_data():
    """Seeds default demo accounts and records if database is empty."""
    db: Session = SessionLocal()
    try:
        admin_user = db.query(User).filter(User.email == "admin@demo.com").first()
        if not admin_user:
            print("EduPredict AI: Seeding initial demo accounts...")
            # 1. Admin
            admin_user = User(
                email="admin@demo.com",
                password_hash=hash_password("Admin@123"),
                role="admin",
                is_active=True
            )
            db.add(admin_user)

            # 2. Student 1: Alex Rivera (student@demo.com)
            student_user = User(
                email="student@demo.com",
                password_hash=hash_password("Student@123"),
                role="student",
                is_active=True
            )
            db.add(student_user)
            db.flush()

            alex = Student(
                user_id=student_user.id,
                full_name="Alex Rivera",
                register_number="REG2024CS001",
                department="Computer Science & Engineering",
                semester=5,
                section="A"
            )
            db.add(alex)
            db.flush()

            # Additional Demo Students for realistic Admin view
            demo_students_meta = [
                ("Priya Sharma", "priya.sharma@demo.com", "REG2024CS014", "Computer Science & Engineering", 5, "A", 95.0, 18.0, 92.5, 91.0, 9.2, 90.0, 94.0, 0, 91.8, "Excellent", "LOW"),
                ("Rahul Verma", "rahul.verma@demo.com", "REG2024IT022", "Information Technology", 5, "B", 62.0, 5.0, 51.0, 48.0, 5.4, 52.0, 45.0, 3, 46.2, "At Risk", "HIGH"),
                ("Sneha Patel", "sneha.patel@demo.com", "REG2024CS035", "Computer Science & Engineering", 5, "B", 76.0, 9.5, 68.0, 64.0, 6.8, 65.0, 60.0, 1, 66.4, "Average", "MEDIUM"),
                ("Kavita Nair", "kavita.nair@demo.com", "REG2024EC019", "Electronics & Communication", 5, "A", 89.0, 13.5, 84.0, 81.0, 8.3, 80.0, 82.0, 0, 81.5, "Good", "LOW")
            ]

            # Core Curricular Subjects
            subjects = [
                Subject(code="CS501", name="Advanced Mathematics & Statistics", department="Computer Science & Engineering", credits=4),
                Subject(code="CS502", name="Data Structures & Algorithms", department="Computer Science & Engineering", credits=4),
                Subject(code="CS503", name="Database Management Systems", department="Computer Science & Engineering", credits=4),
                Subject(code="CS504", name="Operating Systems", department="Computer Science & Engineering", credits=3),
                Subject(code="CS505", name="Software Engineering", department="Computer Science & Engineering", credits=3),
            ]
            for s in subjects:
                db.add(s)
            db.flush()

            # Record for Alex
            ar_alex = AcademicRecord(
                student_id=alex.id,
                attendance=88.5,
                study_hours=14.0,
                assignment_score=82.0,
                internal_score=80.5,
                previous_gpa=8.1,
                previous_marks=79.0,
                participation=85.0,
                backlogs=0,
                term_label="Semester 5 - Midterm Assessment"
            )
            db.add(ar_alex)
            db.flush()

            pred_alex = Prediction(
                student_id=alex.id,
                academic_record_id=ar_alex.id,
                predicted_score=82.6,
                performance_category="Good",
                risk_level="LOW",
                confidence=94.2,
                model_version="v1.0.0-rf"
            )
            db.add(pred_alex)
            db.flush()

            db.add(Recommendation(
                prediction_id=pred_alex.id,
                recommendation_text="Maintain your current high attendance rate (88.5%) to retain conceptual continuity.",
                category="attendance",
                severity="info"
            ))
            db.add(Recommendation(
                prediction_id=pred_alex.id,
                recommendation_text="Aim for 2 additional hours of peer-programming revision weekly in Advanced Mathematics.",
                category="study_hours",
                severity="info"
            ))

            for name, email, regno, dept, sem, sec, att, hrs, asgn, intr, gpa, pmarks, part, bklg, pscore, pcat, prisk in demo_students_meta:
                u = User(
                    email=email,
                    password_hash=hash_password("Student@123"),
                    role="student",
                    is_active=True
                )
                db.add(u)
                db.flush()

                st = Student(
                    user_id=u.id,
                    full_name=name,
                    register_number=regno,
                    department=dept,
                    semester=sem,
                    section=sec
                )
                db.add(st)
                db.flush()

                ar = AcademicRecord(
                    student_id=st.id,
                    attendance=att,
                    study_hours=hrs,
                    assignment_score=asgn,
                    internal_score=intr,
                    previous_gpa=gpa,
                    previous_marks=pmarks,
                    participation=part,
                    backlogs=bklg,
                    term_label="Semester 5 - Midterm Assessment"
                )
                db.add(ar)
                db.flush()

                pr = Prediction(
                    student_id=st.id,
                    academic_record_id=ar.id,
                    predicted_score=pscore,
                    performance_category=pcat,
                    risk_level=prisk,
                    confidence=91.5,
                    model_version="v1.0.0-rf"
                )
                db.add(pr)
                db.flush()

                if prisk == "HIGH":
                    db.add(Recommendation(
                        prediction_id=pr.id,
                        recommendation_text=f"CRITICAL: Attendance ({att}%) is below 75%. Attend all upcoming classes immediately.",
                        category="attendance",
                        severity="urgent"
                    ))
                    db.add(Recommendation(
                        prediction_id=pr.id,
                        recommendation_text=f"URGENT: {bklg} backlogs detected. Schedule academic counselor intervention.",
                        category="backlogs",
                        severity="urgent"
                    ))

            db.commit()
            print("EduPredict AI: Demo accounts seeded successfully!")
    except Exception as e:
        db.rollback()
        print(f"EduPredict AI: Seed skipped or failed: {e}")
    finally:
        db.close()

@asynccontextmanager
async def lifespan(app: FastAPI):
    # 1. Initialize Tables
    Base.metadata.create_all(bind=engine)
    # 2. Seed initial demo data
    seed_initial_demo_data()
    # 3. Load ML model into memory
    try:
        ml_pipeline.load_artifacts()
    except Exception as e:
        print(f"Warning: ML model not loaded on startup: {e}")
    yield

# Also eagerly ensure database schema exists
Base.metadata.create_all(bind=engine)
seed_initial_demo_data()
try:
    ml_pipeline.load_artifacts()
except Exception as e:
    pass

app = FastAPI(
    title="EduPredict AI — API",
    description="Student Performance Prediction & Early Warning System API",
    version="1.0.0",
    lifespan=lifespan
)

# CORS Configuration
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Exception Handler for clean JSON responses
@app.exception_handler(Exception)
async def global_exception_handler(request: Request, exc: Exception):
    return JSONResponse(
        status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
        content={"detail": "An internal server error occurred.", "message": str(exc)},
    )

# Include Routers
app.include_router(auth_router, prefix="/api")
app.include_router(student_router, prefix="/api")
app.include_router(prediction_router, prefix="/api")
app.include_router(analytics_router, prefix="/api")
app.include_router(admin_router, prefix="/api")

@app.get("/")
def root():
    return {
        "service": "EduPredict AI API",
        "status": "online",
        "docs_url": "/docs",
        "version": settings.VERSION
    }

@app.get("/api/health")
def health_check():
    return {
        "status": "healthy",
        "database": "connected",
        "ml_pipeline_loaded": ml_pipeline.is_loaded
    }
