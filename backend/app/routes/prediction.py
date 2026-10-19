"""
EduPredict AI - Prediction & Academic Assessment Routes
Invokes ML pipeline, applies Risk Engine, generates Recommendations, and persists to SQL.
"""

from typing import List
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from app.database import get_db
from app.models import Student, AcademicRecord, SubjectScore, Subject, Prediction, Recommendation
from app.schemas import AssessmentInput, PredictionResponse, RecommendationItem, InfluencingFactor
from app.ml.pipeline import ml_pipeline
from app.services.risk_engine import evaluate_academic_risk
from app.services.recommendation_engine import generate_recommendations
from app.utils.deps import require_student

router = APIRouter(prefix="", tags=["Prediction & Assessment"])

@router.post("/predict", response_model=PredictionResponse)
def generate_prediction(
    input_data: AssessmentInput,
    student: Student = Depends(require_student),
    db: Session = Depends(get_db)
):
    try:
        # 1. Run Machine Learning Pipeline Inference
        ml_result = ml_pipeline.predict(input_data.model_dump())
        predicted_score = ml_result["predicted_score"]
        performance_category = ml_result["performance_category"]
        confidence = ml_result["confidence"]
        influencing_factors = ml_result["influencing_factors"]

        # 2. Run Early Warning Risk Assessment Engine
        risk_level, risk_reasons = evaluate_academic_risk(
            attendance=input_data.attendance,
            study_hours=input_data.study_hours,
            assignment_score=input_data.assignment_score,
            internal_score=input_data.internal_score,
            previous_gpa=input_data.previous_gpa,
            previous_marks=input_data.previous_marks,
            participation=input_data.participation,
            backlogs=input_data.backlogs,
            predicted_score=predicted_score
        )

        # 3. Run Personalized Recommendation Engine
        recommendation_dicts = generate_recommendations(
            attendance=input_data.attendance,
            study_hours=input_data.study_hours,
            assignment_score=input_data.assignment_score,
            internal_score=input_data.internal_score,
            previous_gpa=input_data.previous_gpa,
            backlogs=input_data.backlogs,
            predicted_score=predicted_score,
            subject_marks=input_data.subject_marks
        )

        # 4. Persist to SQL Relational Database
        # 4a. Academic Record
        academic_rec = AcademicRecord(
            student_id=student.id,
            attendance=input_data.attendance,
            study_hours=input_data.study_hours,
            assignment_score=input_data.assignment_score,
            internal_score=input_data.internal_score,
            previous_gpa=input_data.previous_gpa,
            previous_marks=input_data.previous_marks,
            participation=input_data.participation,
            backlogs=input_data.backlogs,
            term_label=f"Semester {student.semester} Assessment"
        )
        db.add(academic_rec)
        db.flush()

        # 4b. Subject-wise scores if provided
        if input_data.subject_marks:
            for subj_name, mark in input_data.subject_marks.items():
                # Find or register subject
                subj = db.query(Subject).filter(Subject.name == subj_name).first()
                if not subj:
                    subj_code = "".join([w[0].upper() for w in subj_name.split()[:3]]) + str(student.semester) + "01"
                    subj = Subject(
                        code=subj_code,
                        name=subj_name,
                        department=student.department,
                        credits=4
                    )
                    db.add(subj)
                    db.flush()
                
                score_rec = SubjectScore(
                    student_id=student.id,
                    subject_id=subj.id,
                    academic_record_id=academic_rec.id,
                    score=float(mark),
                    exam_type="Assessment Test"
                )
                db.add(score_rec)

        # 4c. Prediction Record
        prediction_rec = Prediction(
            student_id=student.id,
            academic_record_id=academic_rec.id,
            predicted_score=predicted_score,
            performance_category=performance_category,
            risk_level=risk_level,
            confidence=confidence,
            model_version="v1.0.0-rf"
        )
        db.add(prediction_rec)
        db.flush()

        # 4d. Recommendations
        persisted_recs = []
        for r in recommendation_dicts:
            rec_obj = Recommendation(
                prediction_id=prediction_rec.id,
                recommendation_text=r["recommendation_text"],
                category=r["category"],
                severity=r["severity"],
                is_completed=False
            )
            db.add(rec_obj)
            persisted_recs.append(rec_obj)

        db.commit()
        db.refresh(prediction_rec)

        factors_response = [
            InfluencingFactor(
                feature=f["feature"],
                label=f["label"],
                importance_pct=f["importance_pct"],
                student_value=f["student_value"]
            )
            for f in influencing_factors
        ]

        rec_response = [
            RecommendationItem(
                id=r.id,
                recommendation_text=r.recommendation_text,
                category=r.category,
                severity=r.severity,
                is_completed=r.is_completed
            )
            for r in persisted_recs
        ]

        return PredictionResponse(
            id=prediction_rec.id,
            predicted_score=predicted_score,
            performance_category=performance_category,
            risk_level=risk_level,
            confidence=confidence,
            confidence_label="Validation-based uncertainty estimate",
            created_at=prediction_rec.created_at,
            inputs=input_data.model_dump(),
            influencing_factors=factors_response,
            recommendations=rec_response
        )

    except Exception as e:
        db.rollback()
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Prediction evaluation failed: {str(e)}"
        )

@router.get("/predictions", response_model=List[PredictionResponse])
def get_prediction_history(
    student: Student = Depends(require_student),
    db: Session = Depends(get_db)
):
    """Fetches full prediction history for the authenticated student from SQL."""
    predictions = (
        db.query(Prediction)
        .filter(Prediction.student_id == student.id)
        .order_by(Prediction.created_at.desc())
        .all()
    )

    results = []
    for p in predictions:
        ar = p.academic_record
        inputs = None
        if ar:
            inputs = {
                "attendance": ar.attendance,
                "study_hours": ar.study_hours,
                "assignment_score": ar.assignment_score,
                "internal_score": ar.internal_score,
                "previous_gpa": ar.previous_gpa,
                "previous_marks": ar.previous_marks,
                "participation": ar.participation,
                "backlogs": ar.backlogs
            }

        recs = [
            RecommendationItem(
                id=r.id,
                recommendation_text=r.recommendation_text,
                category=r.category,
                severity=r.severity,
                is_completed=r.is_completed
            )
            for r in p.recommendations
        ]

        # Factors from current pipeline if available
        factors = [
            InfluencingFactor(
                feature=fi["feature"],
                label=fi["label"],
                importance_pct=fi["importance_pct"],
                student_value=inputs.get(fi["feature"]) if inputs else None
            )
            for fi in ml_pipeline.feature_importances[:5]
        ]

        results.append(
            PredictionResponse(
                id=p.id,
                predicted_score=p.predicted_score,
                performance_category=p.performance_category,
                risk_level=p.risk_level,
                confidence=p.confidence,
                confidence_label="Validation-based uncertainty estimate",
                created_at=p.created_at,
                inputs=inputs,
                influencing_factors=factors,
                recommendations=recs
            )
        )

    return results

@router.get("/predictions/{prediction_id}", response_model=PredictionResponse)
def get_prediction_detail(
    prediction_id: int,
    student: Student = Depends(require_student),
    db: Session = Depends(get_db)
):
    """Drilldown view for a specific historical prediction."""
    p = (
        db.query(Prediction)
        .filter(Prediction.id == prediction_id, Prediction.student_id == student.id)
        .first()
    )
    if not p:
        raise HTTPException(status_code=404, detail="Prediction record not found.")

    ar = p.academic_record
    inputs = None
    if ar:
        inputs = {
            "attendance": ar.attendance,
            "study_hours": ar.study_hours,
            "assignment_score": ar.assignment_score,
            "internal_score": ar.internal_score,
            "previous_gpa": ar.previous_gpa,
            "previous_marks": ar.previous_marks,
            "participation": ar.participation,
            "backlogs": ar.backlogs
        }

    recs = [
        RecommendationItem(
            id=r.id,
            recommendation_text=r.recommendation_text,
            category=r.category,
            severity=r.severity,
            is_completed=r.is_completed
        )
        for r in p.recommendations
    ]

    factors = [
        InfluencingFactor(
            feature=fi["feature"],
            label=fi["label"],
            importance_pct=fi["importance_pct"],
            student_value=inputs.get(fi["feature"]) if inputs else None
        )
        for fi in ml_pipeline.feature_importances[:5]
    ]

    return PredictionResponse(
        id=p.id,
        predicted_score=p.predicted_score,
        performance_category=p.performance_category,
        risk_level=p.risk_level,
        confidence=p.confidence,
        confidence_label="Validation-based uncertainty estimate",
        created_at=p.created_at,
        inputs=inputs,
        influencing_factors=factors,
        recommendations=recs
    )
