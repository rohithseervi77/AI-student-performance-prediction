"""
EduPredict AI - SQLAlchemy ORM Models
Defines relational entity models mapping to SQL tables.
"""

from datetime import datetime
from sqlalchemy import (
    Column, Integer, String, Float, Boolean, DateTime, ForeignKey, Text, Enum
)
from sqlalchemy.orm import relationship
from app.database import Base

class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True, autoincrement=True)
    email = Column(String(255), unique=True, index=True, nullable=False)
    password_hash = Column(String(255), nullable=False)
    role = Column(String(50), nullable=False, default="student") # "student" or "admin"
    is_active = Column(Boolean, default=True, nullable=False)
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

    # Relationships
    student_profile = relationship("Student", back_populates="user", uselist=False, cascade="all, delete-orphan")


class Student(Base):
    __tablename__ = "students"

    id = Column(Integer, primary_key=True, index=True, autoincrement=True)
    user_id = Column(Integer, ForeignKey("users.id", ondelete="CASCADE"), unique=True, nullable=False)
    full_name = Column(String(150), nullable=False)
    register_number = Column(String(50), unique=True, index=True, nullable=False)
    department = Column(String(100), nullable=False)
    semester = Column(Integer, nullable=False, default=1)
    section = Column(String(10), nullable=False, default="A")
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

    # Relationships
    user = relationship("User", back_populates="student_profile")
    academic_records = relationship("AcademicRecord", back_populates="student", cascade="all, delete-orphan", order_by="desc(AcademicRecord.created_at)")
    subject_scores = relationship("SubjectScore", back_populates="student", cascade="all, delete-orphan")
    predictions = relationship("Prediction", back_populates="student", cascade="all, delete-orphan", order_by="desc(Prediction.created_at)")


class Subject(Base):
    __tablename__ = "subjects"

    id = Column(Integer, primary_key=True, index=True, autoincrement=True)
    code = Column(String(20), unique=True, index=True, nullable=False)
    name = Column(String(150), nullable=False)
    department = Column(String(100), nullable=False)
    credits = Column(Integer, default=4, nullable=False)
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

    # Relationships
    scores = relationship("SubjectScore", back_populates="subject")


class AcademicRecord(Base):
    __tablename__ = "academic_records"

    id = Column(Integer, primary_key=True, index=True, autoincrement=True)
    student_id = Column(Integer, ForeignKey("students.id", ondelete="CASCADE"), nullable=False, index=True)
    attendance = Column(Float, nullable=False)
    study_hours = Column(Float, nullable=False)
    assignment_score = Column(Float, nullable=False)
    internal_score = Column(Float, nullable=False)
    previous_gpa = Column(Float, nullable=False)
    previous_marks = Column(Float, nullable=False)
    participation = Column(Float, nullable=False)
    backlogs = Column(Integer, default=0, nullable=False)
    term_label = Column(String(50), default="Current Semester")
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

    # Relationships
    student = relationship("Student", back_populates="academic_records")
    predictions = relationship("Prediction", back_populates="academic_record")
    subject_scores = relationship("SubjectScore", back_populates="academic_record")


class SubjectScore(Base):
    __tablename__ = "subject_scores"

    id = Column(Integer, primary_key=True, index=True, autoincrement=True)
    student_id = Column(Integer, ForeignKey("students.id", ondelete="CASCADE"), nullable=False, index=True)
    subject_id = Column(Integer, ForeignKey("subjects.id", ondelete="CASCADE"), nullable=False, index=True)
    academic_record_id = Column(Integer, ForeignKey("academic_records.id", ondelete="SET NULL"), nullable=True)
    score = Column(Float, nullable=False)
    exam_type = Column(String(50), default="Internal 1", nullable=False)
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

    # Relationships
    student = relationship("Student", back_populates="subject_scores")
    subject = relationship("Subject", back_populates="scores")
    academic_record = relationship("AcademicRecord", back_populates="subject_scores")


class Prediction(Base):
    __tablename__ = "predictions"

    id = Column(Integer, primary_key=True, index=True, autoincrement=True)
    student_id = Column(Integer, ForeignKey("students.id", ondelete="CASCADE"), nullable=False, index=True)
    academic_record_id = Column(Integer, ForeignKey("academic_records.id", ondelete="SET NULL"), nullable=True)
    predicted_score = Column(Float, nullable=False)
    performance_category = Column(String(50), nullable=False) # 'Excellent', 'Good', 'Average', 'At Risk'
    risk_level = Column(String(20), nullable=False) # 'LOW', 'MEDIUM', 'HIGH'
    confidence = Column(Float, nullable=False)
    model_version = Column(String(50), default="v1.0.0-rf")
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

    # Relationships
    student = relationship("Student", back_populates="predictions")
    academic_record = relationship("AcademicRecord", back_populates="predictions")
    recommendations = relationship("Recommendation", back_populates="prediction", cascade="all, delete-orphan")


class Recommendation(Base):
    __tablename__ = "recommendations"

    id = Column(Integer, primary_key=True, index=True, autoincrement=True)
    prediction_id = Column(Integer, ForeignKey("predictions.id", ondelete="CASCADE"), nullable=False, index=True)
    recommendation_text = Column(Text, nullable=False)
    category = Column(String(50), nullable=False)
    severity = Column(String(20), default="info", nullable=False) # 'info', 'warning', 'urgent'
    is_completed = Column(Boolean, default=False, nullable=False)
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

    # Relationships
    prediction = relationship("Prediction", back_populates="recommendations")
