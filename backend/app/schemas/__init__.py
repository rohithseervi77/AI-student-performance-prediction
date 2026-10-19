"""
EduPredict AI - Pydantic Request & Response Validation Schemas
"""

from typing import List, Optional, Dict, Any
from datetime import datetime
from pydantic import BaseModel, Field, ConfigDict, field_validator

EMAIL_REGEX = r"^[^@\s]+@[^@\s]+\.[^@\s]+$"

# -----------------------------------------------------------------------------
# Auth Schemas
# -----------------------------------------------------------------------------
class UserRegisterRequest(BaseModel):
    full_name: str = Field(..., min_length=2, max_length=150)
    register_number: str = Field(..., min_length=3, max_length=50)
    email: str = Field(..., pattern=EMAIL_REGEX)
    password: str = Field(..., min_length=6, max_length=100)
    department: str = Field(..., min_length=2, max_length=100)
    semester: int = Field(..., ge=1, le=8)
    section: str = Field(..., min_length=1, max_length=10)

class UserLoginRequest(BaseModel):
    email: str = Field(..., pattern=EMAIL_REGEX)
    password: str = Field(..., min_length=1)

class TokenResponse(BaseModel):
    access_token: str
    token_type: str = "bearer"
    role: str
    user_id: int
    student_id: Optional[int] = None
    email: str
    full_name: str

# -----------------------------------------------------------------------------
# Student Schemas
# -----------------------------------------------------------------------------
class StudentProfileResponse(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: int
    user_id: int
    email: str
    full_name: str
    register_number: str
    department: str
    semester: int
    section: str
    created_at: datetime

class StudentUpdateRequest(BaseModel):
    full_name: Optional[str] = None
    department: Optional[str] = None
    semester: Optional[int] = Field(None, ge=1, le=8)
    section: Optional[str] = None

# -----------------------------------------------------------------------------
# Assessment & Prediction Schemas
# -----------------------------------------------------------------------------
class AssessmentInput(BaseModel):
    attendance: float = Field(..., ge=0.0, le=100.0, description="Attendance Percentage (0-100)")
    study_hours: float = Field(..., ge=0.0, le=80.0, description="Weekly Study Hours (0-80)")
    assignment_score: float = Field(..., ge=0.0, le=100.0, description="Assignment Average (0-100)")
    internal_score: float = Field(..., ge=0.0, le=100.0, description="Internal Exam Average (0-100)")
    previous_gpa: float = Field(..., ge=0.0, le=10.0, description="Previous Semester GPA (0-10)")
    previous_marks: float = Field(..., ge=0.0, le=100.0, description="Previous Semester Marks (0-100)")
    participation: float = Field(..., ge=0.0, le=100.0, description="Class Participation (0-100)")
    backlogs: int = Field(..., ge=0, le=20, description="Number of Active Backlogs")
    subject_marks: Optional[Dict[str, float]] = Field(default_factory=dict, description="Subject-wise marks dictionary")

class RecommendationItem(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: Optional[int] = None
    recommendation_text: str
    category: str
    severity: str
    is_completed: bool = False

class InfluencingFactor(BaseModel):
    feature: str
    label: str
    importance_pct: float
    student_value: Optional[float] = None

class PredictionResponse(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: Optional[int] = None
    predicted_score: float
    performance_category: str
    risk_level: str
    confidence: float
    confidence_label: str = "Validation-based uncertainty estimate"
    created_at: Optional[datetime] = None
    inputs: Optional[Dict[str, Any]] = None
    influencing_factors: List[InfluencingFactor] = []
    recommendations: List[RecommendationItem] = []

# -----------------------------------------------------------------------------
# Admin & Analytics Schemas
# -----------------------------------------------------------------------------
class AdminStudentSummary(BaseModel):
    id: int
    user_id: int
    register_number: str
    full_name: str
    email: str
    department: str
    semester: int
    section: str
    latest_gpa: Optional[float] = None
    latest_predicted_score: Optional[float] = None
    latest_performance_category: Optional[str] = None
    latest_risk_level: Optional[str] = None
    last_assessed_at: Optional[datetime] = None

class AdminStatsResponse(BaseModel):
    total_students: int
    low_risk_count: int
    medium_risk_count: int
    high_risk_count: int
    average_predicted_score: float
    average_gpa: float
    total_predictions: int
