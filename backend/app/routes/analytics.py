"""
EduPredict AI - Student Analytics Routes
Provides chart-ready analytical time-series and correlation datasets for Recharts visualization.
"""

from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from app.database import get_db, execute_raw_sql
from app.models import Student, AcademicRecord, Prediction, SubjectScore, Subject
from app.utils.deps import require_student

router = APIRouter(prefix="/analytics", tags=["Student Analytics"])

@router.get("/student")
def get_student_analytics(
    student: Student = Depends(require_student),
    db: Session = Depends(get_db)
):
    """
    Generates rich chart metrics from real SQL records for the authenticated student:
    - attendance_vs_score
    - internal_trend
    - assignment_performance
    - subject_performance
    - study_hours_vs_predicted
    - current_risk_status
    """
    # 1. Fetch prediction time-series history
    predictions = (
        db.query(Prediction)
        .filter(Prediction.student_id == student.id)
        .order_by(Prediction.created_at.asc())
        .all()
    )

    attendance_vs_score = []
    study_hours_vs_predicted = []
    internal_trend = []
    assignment_trend = []

    for idx, p in enumerate(predictions):
        ar = p.academic_record
        label = p.created_at.strftime("%b %d") if p.created_at else f"Assessment #{idx + 1}"
        att = ar.attendance if ar else 80.0
        hrs = ar.study_hours if ar else 10.0
        internals = ar.internal_score if ar else 75.0
        assignments = ar.assignment_score if ar else 75.0

        attendance_vs_score.append({
            "name": label,
            "attendance": att,
            "predicted_score": p.predicted_score,
            "actual_benchmark": 75.0 # Institutional threshold
        })

        study_hours_vs_predicted.append({
            "name": label,
            "study_hours": hrs,
            "predicted_score": p.predicted_score
        })

        internal_trend.append({
            "name": label,
            "internal_score": internals,
            "passing_threshold": 50.0
        })

        assignment_trend.append({
            "name": label,
            "assignment_score": assignments,
            "target": 80.0
        })

    # If new student without prediction history yet, supply baseline placeholder points based on student's current semester
    if not attendance_vs_score:
        attendance_vs_score = [
            {"name": "Week 4", "attendance": 85.0, "predicted_score": 78.0, "actual_benchmark": 75.0},
            {"name": "Week 8", "attendance": 88.0, "predicted_score": 82.0, "actual_benchmark": 75.0}
        ]
        study_hours_vs_predicted = [
            {"name": "Week 4", "study_hours": 10.0, "predicted_score": 78.0},
            {"name": "Week 8", "study_hours": 14.0, "predicted_score": 82.0}
        ]
        internal_trend = [
            {"name": "Assessment 1", "internal_score": 76.0, "passing_threshold": 50.0},
            {"name": "Assessment 2", "internal_score": 81.0, "passing_threshold": 50.0}
        ]
        assignment_trend = [
            {"name": "Unit 1", "assignment_score": 80.0, "target": 80.0},
            {"name": "Unit 2", "assignment_score": 84.0, "target": 80.0}
        ]

    # 2. Subject-wise performance from subject_scores table
    scores = (
        db.query(SubjectScore)
        .filter(SubjectScore.student_id == student.id)
        .all()
    )

    subject_performance = []
    if scores:
        for s in scores:
            subject_performance.append({
                "subject": s.subject.name if s.subject else f"Subject #{s.subject_id}",
                "score": s.score,
                "passing_mark": 50.0,
                "distinction": 80.0
            })
    else:
        # Default curricular subjects
        subject_performance = [
            {"subject": "Mathematics", "score": 78.0, "passing_mark": 50.0, "distinction": 80.0},
            {"subject": "Programming", "score": 85.0, "passing_mark": 50.0, "distinction": 80.0},
            {"subject": "Database Mgmt", "score": 82.0, "passing_mark": 50.0, "distinction": 80.0},
            {"subject": "Operating Systems", "score": 79.0, "passing_mark": 50.0, "distinction": 80.0},
            {"subject": "Software Eng", "score": 81.0, "passing_mark": 50.0, "distinction": 80.0}
        ]

    # 3. Latest risk status
    latest_pred = (
        db.query(Prediction)
        .filter(Prediction.student_id == student.id)
        .order_by(Prediction.created_at.desc())
        .first()
    )

    return {
        "student_id": student.id,
        "full_name": student.full_name,
        "current_risk_level": latest_pred.risk_level if latest_pred else "LOW",
        "current_predicted_score": latest_pred.predicted_score if latest_pred else 80.0,
        "current_category": latest_pred.performance_category if latest_pred else "Good",
        "attendance_vs_score": attendance_vs_score,
        "internal_trend": internal_trend,
        "assignment_trend": assignment_trend,
        "subject_performance": subject_performance,
        "study_hours_vs_predicted": study_hours_vs_predicted
    }
