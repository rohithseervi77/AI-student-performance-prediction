"""
EduPredict AI - Backend and ML Unit & Integration Test Suite
Verifies Authentication, RBAC, Prediction API, Input Validation, and ML Reliability.
"""

import pytest
from fastapi.testclient import TestClient
from app.main import app
from app.ml.pipeline import ml_pipeline

client = TestClient(app)

def test_health_endpoint():
    response = client.get("/api/health")
    assert response.status_code == 200
    data = response.json()
    assert data["status"] == "healthy"
    assert data["database"] == "connected"

def test_ml_pipeline_direct():
    """Verifies that the ML model pipeline loads and predicts valid ranges."""
    assert ml_pipeline.is_loaded is True
    sample_input = {
        "attendance": 85.0,
        "study_hours": 12.0,
        "assignment_score": 80.0,
        "internal_score": 78.0,
        "previous_gpa": 7.8,
        "previous_marks": 75.0,
        "participation": 80.0,
        "backlogs": 0
    }
    pred = ml_pipeline.predict(sample_input)
    assert "predicted_score" in pred
    assert 0.0 <= pred["predicted_score"] <= 100.0
    assert pred["performance_category"] in ["Excellent", "Good", "Average", "At Risk"]
    assert "confidence" in pred
    assert len(pred["influencing_factors"]) > 0

def test_login_demo_admin():
    """Verifies admin login succeeds with correct credentials and returns JWT."""
    response = client.post("/api/auth/login", json={
        "email": "admin@demo.com",
        "password": "Admin@123"
    })
    assert response.status_code == 200
    data = response.json()
    assert data["role"] == "admin"
    assert "access_token" in data
    assert data["email"] == "admin@demo.com"

def test_login_demo_student():
    """Verifies student login succeeds and returns JWT with student profile."""
    response = client.post("/api/auth/login", json={
        "email": "student@demo.com",
        "password": "Student@123"
    })
    assert response.status_code == 200
    data = response.json()
    assert data["role"] == "student"
    assert "access_token" in data
    assert data["student_id"] is not None

def test_login_invalid_credentials():
    """Verifies error handling on wrong password."""
    response = client.post("/api/auth/login", json={
        "email": "student@demo.com",
        "password": "WrongPassword999!"
    })
    assert response.status_code == 401

def test_registration_and_duplicate_prevention():
    """Verifies student registration and duplicate validation."""
    test_email = "test.newstudent@college.edu"
    test_reg = "REG2026TEST01"

    reg_payload = {
        "full_name": "Test Student Automated",
        "register_number": test_reg,
        "email": test_email,
        "password": "SecurePassword123!",
        "department": "Computer Science & Engineering",
        "semester": 4,
        "section": "A"
    }

    # First attempt: should succeed or already exist if re-run
    res1 = client.post("/api/auth/register", json=reg_payload)
    assert res1.status_code in [201, 400]

    # Duplicate attempt: must return 400 Bad Request
    res2 = client.post("/api/auth/register", json=reg_payload)
    assert res2.status_code == 400

def test_student_prediction_flow_and_persistence():
    """Verifies that a student can post academic data, get real predictions, and view history."""
    # 1. Login as demo student
    login_res = client.post("/api/auth/login", json={
        "email": "student@demo.com",
        "password": "Student@123"
    })
    token = login_res.json()["access_token"]
    headers = {"Authorization": f"Bearer {token}"}

    # 2. Post assessment
    assess_payload = {
        "attendance": 90.0,
        "study_hours": 15.0,
        "assignment_score": 85.0,
        "internal_score": 82.0,
        "previous_gpa": 8.5,
        "previous_marks": 84.0,
        "participation": 90.0,
        "backlogs": 0,
        "subject_marks": {
            "Advanced Mathematics & Statistics": 80.0,
            "Data Structures & Algorithms": 86.0,
            "Database Management Systems": 84.0,
            "Operating Systems": 82.0,
            "Software Engineering": 85.0
        }
    }
    pred_res = client.post("/api/predict", json=assess_payload, headers=headers)
    assert pred_res.status_code == 200
    pred_data = pred_res.json()
    assert "predicted_score" in pred_data
    assert "risk_level" in pred_data
    assert pred_data["risk_level"] in ["LOW", "MEDIUM", "HIGH"]
    assert len(pred_data["recommendations"]) > 0

    # 3. Check prediction history in SQL
    hist_res = client.get("/api/predictions", headers=headers)
    assert hist_res.status_code == 200
    history = hist_res.json()
    assert len(history) >= 1
    assert any(h["id"] == pred_data["id"] for h in history)

def test_invalid_input_validation():
    """Verifies that out-of-range inputs return 422 Unprocessable Entity."""
    login_res = client.post("/api/auth/login", json={
        "email": "student@demo.com",
        "password": "Student@123"
    })
    token = login_res.json()["access_token"]
    headers = {"Authorization": f"Bearer {token}"}

    # Invalid attendance > 100
    invalid_payload = {
        "attendance": 150.0, # Out of range
        "study_hours": 10.0,
        "assignment_score": 80.0,
        "internal_score": 80.0,
        "previous_gpa": 8.0,
        "previous_marks": 80.0,
        "participation": 80.0,
        "backlogs": 0
    }
    res = client.post("/api/predict", json=invalid_payload, headers=headers)
    assert res.status_code == 422

def test_rbac_student_cannot_access_admin_routes():
    """Verifies that a student JWT cannot access admin routes."""
    login_res = client.post("/api/auth/login", json={
        "email": "student@demo.com",
        "password": "Student@123"
    })
    student_token = login_res.json()["access_token"]
    headers = {"Authorization": f"Bearer {student_token}"}

    admin_res = client.get("/api/admin/stats", headers=headers)
    assert admin_res.status_code == 403

def test_admin_access_allowed():
    """Verifies that an admin JWT can access admin routes."""
    login_res = client.post("/api/auth/login", json={
        "email": "admin@demo.com",
        "password": "Admin@123"
    })
    admin_token = login_res.json()["access_token"]
    headers = {"Authorization": f"Bearer {admin_token}"}

    admin_res = client.get("/api/admin/stats", headers=headers)
    assert admin_res.status_code == 200
    stats = admin_res.json()
    assert "total_students" in stats
    assert "average_predicted_score" in stats
