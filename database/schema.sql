-- =============================================================================
-- EduPredict AI — Relational SQL Database Schema (MySQL Compatible)
-- Normalized relational database schema for student performance prediction,
-- risk assessment, academic metrics, and personalized recommendations.
-- =============================================================================

CREATE DATABASE IF NOT EXISTS edupredict_db;
USE edupredict_db;

-- -----------------------------------------------------------------------------
-- 1. Table: users
-- Purpose: System authentication and role-based access control (RBAC).
-- Roles: 'student', 'admin'
-- -----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    email VARCHAR(255) NOT NULL UNIQUE,
    password_hash VARCHAR(255) NOT NULL,
    role ENUM('student', 'admin') NOT NULL DEFAULT 'student',
    is_active BOOLEAN NOT NULL DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    INDEX idx_users_email (email),
    INDEX idx_users_role (role)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- -----------------------------------------------------------------------------
-- 2. Table: students
-- Purpose: Profiles of registered students with institutional identifiers.
-- -----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS students (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL UNIQUE,
    full_name VARCHAR(150) NOT NULL,
    register_number VARCHAR(50) NOT NULL UNIQUE,
    department VARCHAR(100) NOT NULL,
    semester INT NOT NULL CHECK (semester BETWEEN 1 AND 8),
    section VARCHAR(10) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    INDEX idx_students_regno (register_number),
    INDEX idx_students_dept_sem (department, semester)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- -----------------------------------------------------------------------------
-- 3. Table: subjects
-- Purpose: Curriculum course catalog.
-- -----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS subjects (
    id INT AUTO_INCREMENT PRIMARY KEY,
    code VARCHAR(20) NOT NULL UNIQUE,
    name VARCHAR(150) NOT NULL,
    department VARCHAR(100) NOT NULL,
    credits INT NOT NULL DEFAULT 4,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    INDEX idx_subjects_dept (department)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- -----------------------------------------------------------------------------
-- 4. Table: academic_records
-- Purpose: Longitudinal academic performance snapshot fed into the ML model.
-- -----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS academic_records (
    id INT AUTO_INCREMENT PRIMARY KEY,
    student_id INT NOT NULL,
    attendance FLOAT NOT NULL CHECK (attendance BETWEEN 0 AND 100),
    study_hours FLOAT NOT NULL CHECK (study_hours >= 0),
    assignment_score FLOAT NOT NULL CHECK (assignment_score BETWEEN 0 AND 100),
    internal_score FLOAT NOT NULL CHECK (internal_score BETWEEN 0 AND 100),
    previous_gpa FLOAT NOT NULL CHECK (previous_gpa BETWEEN 0 AND 10),
    previous_marks FLOAT NOT NULL CHECK (previous_marks BETWEEN 0 AND 100),
    participation FLOAT NOT NULL CHECK (participation BETWEEN 0 AND 100),
    backlogs INT NOT NULL DEFAULT 0 CHECK (backlogs >= 0),
    term_label VARCHAR(50) DEFAULT 'Current Semester',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (student_id) REFERENCES students(id) ON DELETE CASCADE,
    INDEX idx_academic_student (student_id),
    INDEX idx_academic_attendance (attendance),
    INDEX idx_academic_backlogs (backlogs)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- -----------------------------------------------------------------------------
-- 5. Table: subject_scores
-- Purpose: Detailed breakdown of marks in individual curricular subjects.
-- -----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS subject_scores (
    id INT AUTO_INCREMENT PRIMARY KEY,
    student_id INT NOT NULL,
    subject_id INT NOT NULL,
    academic_record_id INT NULL,
    score FLOAT NOT NULL CHECK (score BETWEEN 0 AND 100),
    exam_type VARCHAR(50) NOT NULL DEFAULT 'Internal 1',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (student_id) REFERENCES students(id) ON DELETE CASCADE,
    FOREIGN KEY (subject_id) REFERENCES subjects(id) ON DELETE CASCADE,
    FOREIGN KEY (academic_record_id) REFERENCES academic_records(id) ON DELETE SET NULL,
    INDEX idx_subject_scores_student (student_id),
    INDEX idx_subject_scores_subject (subject_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- -----------------------------------------------------------------------------
-- 6. Table: predictions
-- Purpose: Machine Learning inference logs storing model outputs and risk ratings.
-- -----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS predictions (
    id INT AUTO_INCREMENT PRIMARY KEY,
    student_id INT NOT NULL,
    academic_record_id INT NULL,
    predicted_score FLOAT NOT NULL CHECK (predicted_score BETWEEN 0 AND 100),
    performance_category ENUM('Excellent', 'Good', 'Average', 'At Risk') NOT NULL,
    risk_level ENUM('LOW', 'MEDIUM', 'HIGH') NOT NULL,
    confidence FLOAT NOT NULL CHECK (confidence BETWEEN 0 AND 100),
    model_version VARCHAR(50) DEFAULT 'v1.0.0-rf',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (student_id) REFERENCES students(id) ON DELETE CASCADE,
    FOREIGN KEY (academic_record_id) REFERENCES academic_records(id) ON DELETE SET NULL,
    INDEX idx_predictions_student (student_id),
    INDEX idx_predictions_risk (risk_level),
    INDEX idx_predictions_category (performance_category),
    INDEX idx_predictions_date (created_at)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- -----------------------------------------------------------------------------
-- 7. Table: recommendations
-- Purpose: AI & Rule-driven personalized action items generated per prediction.
-- -----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS recommendations (
    id INT AUTO_INCREMENT PRIMARY KEY,
    prediction_id INT NOT NULL,
    recommendation_text TEXT NOT NULL,
    category VARCHAR(50) NOT NULL, -- 'attendance', 'assignments', 'internals', 'study_hours', 'backlogs', 'subject'
    severity ENUM('info', 'warning', 'urgent') NOT NULL DEFAULT 'info',
    is_completed BOOLEAN NOT NULL DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (prediction_id) REFERENCES predictions(id) ON DELETE CASCADE,
    INDEX idx_recom_prediction (prediction_id),
    INDEX idx_recom_severity (severity)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
