"""
EduPredict AI - Student Profile & Curriculum Routes
"""

from typing import List
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from app.database import get_db
from app.models import Student, AcademicRecord, Prediction, Subject
from app.schemas import StudentUpdateRequest
from app.utils.deps import require_student

router = APIRouter(prefix="/students", tags=["Student Management"])

@router.get("/me")
def get_student_dashboard_overview(
    student: Student = Depends(require_student),
    db: Session = Depends(get_db)
):
    """
    Returns student profile combined with latest academic standing and latest ML prediction.
    All dynamic from SQL database.
    """
    latest_record = (
        db.query(AcademicRecord)
        .filter(AcademicRecord.student_id == student.id)
        .order_by(AcademicRecord.created_at.desc())
        .first()
    )

    latest_prediction = (
        db.query(Prediction)
        .filter(Prediction.student_id == student.id)
        .order_by(Prediction.created_at.desc())
        .first()
    )

    return {
        "id": student.id,
        "user_id": student.user_id,
        "email": student.user.email if student.user else None,
        "full_name": student.full_name,
        "register_number": student.register_number,
        "department": student.department,
        "semester": student.semester,
        "section": student.section,
        "latest_academic": {
            "attendance": latest_record.attendance if latest_record else 85.0,
            "study_hours": latest_record.study_hours if latest_record else 12.0,
            "assignment_score": latest_record.assignment_score if latest_record else 80.0,
            "internal_score": latest_record.internal_score if latest_record else 78.0,
            "previous_gpa": latest_record.previous_gpa if latest_record else 8.0,
            "previous_marks": latest_record.previous_marks if latest_record else 78.0,
            "participation": latest_record.participation if latest_record else 82.0,
            "backlogs": latest_record.backlogs if latest_record else 0,
            "term_label": latest_record.term_label if latest_record else "Current Term"
        } if latest_record else None,
        "latest_prediction": {
            "id": latest_prediction.id if latest_prediction else None,
            "predicted_score": latest_prediction.predicted_score if latest_prediction else 80.0,
            "performance_category": latest_prediction.performance_category if latest_prediction else "Good",
            "risk_level": latest_prediction.risk_level if latest_prediction else "LOW",
            "confidence": latest_prediction.confidence if latest_prediction else 92.0,
            "created_at": latest_prediction.created_at if latest_prediction else None
        } if latest_prediction else None
    }

@router.put("/me")
def update_student_profile(
    req: StudentUpdateRequest,
    student: Student = Depends(require_student),
    db: Session = Depends(get_db)
):
    """Allows student to update their academic profile."""
    if req.full_name:
        student.full_name = req.full_name.strip()
    if req.department:
        student.department = req.department.strip()
    if req.semester:
        student.semester = req.semester
    if req.section:
        student.section = req.section.upper().strip()

    db.commit()
    db.refresh(student)

    return {
        "message": "Student profile updated successfully.",
        "student": {
            "id": student.id,
            "full_name": student.full_name,
            "department": student.department,
            "semester": student.semester,
            "section": student.section
        }
    }

@router.get("/subjects")
def get_curriculum_subjects(
    student: Student = Depends(require_student),
    db: Session = Depends(get_db)
):
    """Returns subjects configured for assessment."""
    subjects = db.query(Subject).all()
    if not subjects:
        # Default core subjects if table was unseeded
        default_names = [
            ("CS501", "Advanced Mathematics & Statistics"),
            ("CS502", "Data Structures & Algorithms"),
            ("CS503", "Database Management Systems"),
            ("CS504", "Operating Systems"),
            ("CS505", "Software Engineering")
        ]
        subjects = []
        for code, name in default_names:
            s = Subject(code=code, name=name, department=student.department, credits=4)
            db.add(s)
            subjects.append(s)
        db.commit()

    return [
        {
            "id": s.id,
            "code": s.code,
            "name": s.name,
            "department": s.department,
            "credits": s.credits
        }
        for s in subjects
    ]
