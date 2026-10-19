-- =============================================================================
-- EduPredict AI — Relational Database Demonstration Seed Data
-- =============================================================================

USE edupredict_db;

-- -----------------------------------------------------------------------------
-- 1. Insert Users (Admin & Students)
-- Passwords:
-- admin@demo.com   -> Admin@123
-- student@demo.com -> Student@123
-- All other demo students -> Student@123
-- -----------------------------------------------------------------------------
INSERT INTO users (id, email, password_hash, role, is_active) VALUES
(1, 'admin@demo.com', '$2b$12$KgoZaSmZeHlVbw87lIi6q.IBvYgcgfwn5KAP10LqAQ8x.HUrk8DvW', 'admin', TRUE),
(2, 'student@demo.com', '$2b$12$TS8Y6BUQsXeQj8mEEm5G0.Dlm3fmJfgGG453ARKTAGFYF7tWxP5Om', 'student', TRUE),
(3, 'priya.sharma@demo.com', '$2b$12$TS8Y6BUQsXeQj8mEEm5G0.Dlm3fmJfgGG453ARKTAGFYF7tWxP5Om', 'student', TRUE),
(4, 'rahul.verma@demo.com', '$2b$12$TS8Y6BUQsXeQj8mEEm5G0.Dlm3fmJfgGG453ARKTAGFYF7tWxP5Om', 'student', TRUE),
(5, 'sneha.patel@demo.com', '$2b$12$TS8Y6BUQsXeQj8mEEm5G0.Dlm3fmJfgGG453ARKTAGFYF7tWxP5Om', 'student', TRUE),
(6, 'kavita.nair@demo.com', '$2b$12$TS8Y6BUQsXeQj8mEEm5G0.Dlm3fmJfgGG453ARKTAGFYF7tWxP5Om', 'student', TRUE)
ON DUPLICATE KEY UPDATE email=VALUES(email);

-- -----------------------------------------------------------------------------
-- 2. Insert Student Profiles
-- -----------------------------------------------------------------------------
INSERT INTO students (id, user_id, full_name, register_number, department, semester, section) VALUES
(1, 2, 'Alex Rivera', 'REG2024CS001', 'Computer Science & Engineering', 5, 'A'),
(2, 3, 'Priya Sharma', 'REG2024CS014', 'Computer Science & Engineering', 5, 'A'),
(3, 4, 'Rahul Verma', 'REG2024IT022', 'Information Technology', 5, 'B'),
(4, 5, 'Sneha Patel', 'REG2024CS035', 'Computer Science & Engineering', 5, 'B'),
(5, 6, 'Kavita Nair', 'REG2024EC019', 'Electronics & Communication', 5, 'A')
ON DUPLICATE KEY UPDATE register_number=VALUES(register_number);

-- -----------------------------------------------------------------------------
-- 3. Insert Subjects
-- -----------------------------------------------------------------------------
INSERT INTO subjects (id, code, name, department, credits) VALUES
(1, 'CS501', 'Advanced Mathematics & Statistics', 'Computer Science & Engineering', 4),
(2, 'CS502', 'Data Structures & Algorithms', 'Computer Science & Engineering', 4),
(3, 'CS503', 'Database Management Systems', 'Computer Science & Engineering', 4),
(4, 'CS504', 'Operating Systems & Architecture', 'Computer Science & Engineering', 3),
(5, 'CS505', 'Software Engineering & Agile Methodologies', 'Computer Science & Engineering', 3)
ON DUPLICATE KEY UPDATE code=VALUES(code);

-- -----------------------------------------------------------------------------
-- 4. Insert Academic Records
-- Student 1 (Alex Rivera): Good performer, high attendance, 0 backlogs
-- Student 2 (Priya Sharma): High performer, 94% attendance, 9.2 GPA
-- Student 3 (Rahul Verma): High risk, low attendance (62%), 3 backlogs
-- Student 4 (Sneha Patel): Moderate / Medium risk, 76% attendance, 1 backlog
-- Student 5 (Kavita Nair): Good performer, 88% attendance, 0 backlogs
-- -----------------------------------------------------------------------------
INSERT INTO academic_records (id, student_id, attendance, study_hours, assignment_score, internal_score, previous_gpa, previous_marks, participation, backlogs, term_label) VALUES
(1, 1, 88.5, 14.0, 82.0, 80.5, 8.1, 79.0, 85.0, 0, 'Semester 5 - Midterm Assessment'),
(2, 2, 95.0, 18.0, 92.5, 91.0, 9.2, 90.0, 94.0, 0, 'Semester 5 - Midterm Assessment'),
(3, 3, 62.0, 5.0, 51.0, 48.0, 5.4, 52.0, 45.0, 3, 'Semester 5 - Midterm Assessment'),
(4, 4, 76.0, 9.5, 68.0, 64.0, 6.8, 65.0, 60.0, 1, 'Semester 5 - Midterm Assessment'),
(5, 5, 89.0, 13.5, 84.0, 81.0, 8.3, 80.0, 82.0, 0, 'Semester 5 - Midterm Assessment')
ON DUPLICATE KEY UPDATE id=VALUES(id);

-- -----------------------------------------------------------------------------
-- 5. Insert Subject Scores
-- -----------------------------------------------------------------------------
INSERT INTO subject_scores (student_id, subject_id, academic_record_id, score, exam_type) VALUES
-- Alex Rivera
(1, 1, 1, 78.0, 'Internal 1'),
(1, 2, 1, 85.0, 'Internal 1'),
(1, 3, 1, 84.0, 'Internal 1'),
(1, 4, 1, 79.0, 'Internal 1'),
(1, 5, 1, 81.0, 'Internal 1'),
-- Priya Sharma
(2, 1, 2, 92.0, 'Internal 1'),
(2, 2, 2, 96.0, 'Internal 1'),
(2, 3, 2, 94.0, 'Internal 1'),
(2, 4, 2, 89.0, 'Internal 1'),
(2, 5, 2, 90.0, 'Internal 1'),
-- Rahul Verma (Weak in Maths & OS)
(3, 1, 3, 42.0, 'Internal 1'),
(3, 2, 3, 50.0, 'Internal 1'),
(3, 3, 3, 55.0, 'Internal 1'),
(3, 4, 3, 44.0, 'Internal 1'),
(3, 5, 3, 53.0, 'Internal 1'),
-- Sneha Patel
(4, 1, 4, 62.0, 'Internal 1'),
(4, 2, 4, 70.0, 'Internal 1'),
(4, 3, 4, 68.0, 'Internal 1'),
(4, 4, 4, 65.0, 'Internal 1'),
(4, 5, 4, 66.0, 'Internal 1'),
-- Kavita Nair
(5, 1, 5, 80.0, 'Internal 1'),
(5, 2, 5, 83.0, 'Internal 1'),
(5, 3, 5, 85.0, 'Internal 1'),
(5, 4, 5, 78.0, 'Internal 1'),
(5, 5, 5, 82.0, 'Internal 1');

-- -----------------------------------------------------------------------------
-- 6. Insert Predictions (Generated via Model)
-- -----------------------------------------------------------------------------
INSERT INTO predictions (id, student_id, academic_record_id, predicted_score, performance_category, risk_level, confidence, model_version, created_at) VALUES
(1, 1, 1, 82.6, 'Good', 'LOW', 88.4, 'v1.0.0-rf', NOW() - INTERVAL 2 DAY),
(2, 2, 2, 91.8, 'Excellent', 'LOW', 94.2, 'v1.0.0-rf', NOW() - INTERVAL 2 DAY),
(3, 3, 3, 46.2, 'At Risk', 'HIGH', 89.5, 'v1.0.0-rf', NOW() - INTERVAL 1 DAY),
(4, 4, 4, 66.4, 'Average', 'MEDIUM', 84.1, 'v1.0.0-rf', NOW() - INTERVAL 1 DAY),
(5, 5, 5, 81.5, 'Good', 'LOW', 87.8, 'v1.0.0-rf', NOW() - INTERVAL 12 HOUR)
ON DUPLICATE KEY UPDATE id=VALUES(id);

-- -----------------------------------------------------------------------------
-- 7. Insert Personalized Recommendations
-- -----------------------------------------------------------------------------
INSERT INTO recommendations (prediction_id, recommendation_text, category, severity) VALUES
-- For Alex Rivera (LOW RISK)
(1, 'Maintain your current high attendance rate (88.5%) to retain conceptual continuity.', 'attendance', 'info'),
(1, 'Your assignment submissions are consistently strong; focus on deep problem-solving in Advanced Mathematics.', 'subject', 'info'),
(1, 'Aim for 2 additional hours of peer-programming revision weekly to push for Distinction honors.', 'study_hours', 'info'),

-- For Priya Sharma (LOW RISK / EXCELLENT)
(2, 'Outstanding performance across all assessments. Consider mentoring peers in Data Structures.', 'academics', 'info'),
(2, 'Explore research seminar papers and open-source contributions in Database Systems.', 'enrichment', 'info'),

-- For Rahul Verma (HIGH RISK)
(3, 'CRITICAL: Attendance (62%) is below the mandatory 75% university eligibility requirement. Attend all remaining classes immediately.', 'attendance', 'urgent'),
(3, 'URGENT: 3 backlogs detected. Schedule an academic counseling session to formulate a backlog clearance plan.', 'backlogs', 'urgent'),
(3, 'Internal marks in Mathematics (42%) and Operating Systems (44%) need remediation. Attend scheduled remedial tutorial hours.', 'internals', 'warning'),
(3, 'Increase weekly dedicated study time from 5 hours to a minimum of 14 hours per week.', 'study_hours', 'warning'),

-- For Sneha Patel (MEDIUM RISK)
(4, 'Your attendance is borderline at 76%. Target reaching 82%+ before semester end examinations.', 'attendance', 'warning'),
(4, 'Prioritize clearing your 1 pending backlog to eliminate risk before final placement drives.', 'backlogs', 'warning'),
(4, 'Practice past examination papers in Advanced Mathematics to boost internal test consistency.', 'subject', 'info'),

-- For Kavita Nair (LOW RISK)
(5, 'Solid academic trajectory. Maintain balanced revision across Operating Systems and Software Engineering.', 'academics', 'info');
