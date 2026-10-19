-- =============================================================================
-- EduPredict AI — Demonstrable SQL Analytical Queries
-- These queries showcase SQL mastery for student performance analytics,
-- early warning detection, risk distribution, and academic reporting.
-- =============================================================================

USE edupredict_db;

-- -----------------------------------------------------------------------------
-- Query 1: Find all High-Risk students requiring immediate intervention
-- Demonstrates: Multi-table JOIN, subqueries, and semantic filtering
-- -----------------------------------------------------------------------------
SELECT 
    s.register_number,
    s.full_name,
    s.department,
    s.semester,
    ar.attendance AS attendance_pct,
    ar.backlogs,
    p.predicted_score,
    p.performance_category,
    p.risk_level,
    p.created_at AS prediction_date
FROM students s
INNER JOIN academic_records ar ON s.id = ar.student_id
INNER JOIN predictions p ON ar.id = p.academic_record_id
WHERE p.risk_level = 'HIGH'
ORDER BY p.predicted_score ASC;

-- -----------------------------------------------------------------------------
-- Query 2: Find students with attendance below the mandatory 75% threshold
-- Demonstrates: Filtering, formatting, and institutional compliance checks
-- -----------------------------------------------------------------------------
SELECT 
    s.register_number,
    s.full_name,
    s.department,
    ar.attendance,
    ar.backlogs,
    ar.internal_score,
    CASE 
        WHEN ar.attendance < 65 THEN 'Severe Attendance Shortage'
        ELSE 'Borderline Attendance'
    END AS compliance_status
FROM students s
INNER JOIN academic_records ar ON s.id = ar.student_id
WHERE ar.attendance < 75.0
ORDER BY ar.attendance ASC;

-- -----------------------------------------------------------------------------
-- Query 3: Calculate institution-wide academic averages (GPA, Predicted Score)
-- Demonstrates: Aggregation functions (AVG, MIN, MAX, STDDEV)
-- -----------------------------------------------------------------------------
SELECT 
    COUNT(DISTINCT s.id) AS total_students_evaluated,
    ROUND(AVG(ar.previous_gpa), 2) AS average_gpa,
    ROUND(AVG(ar.attendance), 2) AS average_attendance_pct,
    ROUND(AVG(ar.study_hours), 2) AS average_weekly_study_hours,
    ROUND(AVG(p.predicted_score), 2) AS average_predicted_score,
    ROUND(MIN(p.predicted_score), 2) AS lowest_predicted_score,
    ROUND(MAX(p.predicted_score), 2) AS highest_predicted_score
FROM students s
INNER JOIN academic_records ar ON s.id = ar.student_id
INNER JOIN predictions p ON s.id = p.student_id;

-- -----------------------------------------------------------------------------
-- Query 4: Identify Top-Performing Students (Distinction Candidate Roster)
-- Demonstrates: Filtering, sorting, and multi-factor ranking
-- -----------------------------------------------------------------------------
SELECT 
    s.register_number,
    s.full_name,
    s.department,
    ar.previous_gpa,
    ar.attendance,
    p.predicted_score,
    p.performance_category
FROM students s
INNER JOIN academic_records ar ON s.id = ar.student_id
INNER JOIN predictions p ON s.id = p.student_id
WHERE p.performance_category = 'Excellent' OR p.predicted_score >= 85.0
ORDER BY p.predicted_score DESC, ar.previous_gpa DESC
LIMIT 10;

-- -----------------------------------------------------------------------------
-- Query 5: Find students with active backlogs and their academic standing
-- Demonstrates: Conditional logic, backlog count analysis
-- -----------------------------------------------------------------------------
SELECT 
    s.register_number,
    s.full_name,
    s.department,
    ar.backlogs,
    ar.attendance,
    ar.internal_score,
    p.predicted_score,
    p.risk_level
FROM students s
INNER JOIN academic_records ar ON s.id = ar.student_id
LEFT JOIN predictions p ON s.id = p.student_id
WHERE ar.backlogs > 0
ORDER BY ar.backlogs DESC, p.predicted_score ASC;

-- -----------------------------------------------------------------------------
-- Query 6: Calculate Risk Distribution Breakdown with Percentages
-- Demonstrates: GROUP BY, COUNT, and percentage share calculation
-- -----------------------------------------------------------------------------
SELECT 
    risk_level,
    COUNT(*) AS student_count,
    ROUND((COUNT(*) * 100.0 / (SELECT COUNT(*) FROM predictions)), 2) AS percentage_share,
    ROUND(AVG(predicted_score), 2) AS avg_score_in_category
FROM predictions
GROUP BY risk_level
ORDER BY 
    CASE risk_level 
        WHEN 'HIGH' THEN 1 
        WHEN 'MEDIUM' THEN 2 
        WHEN 'LOW' THEN 3 
    END;

-- -----------------------------------------------------------------------------
-- Query 7: Department-wise Academic Performance Comparison
-- Demonstrates: Grouping by department, aggregate metrics
-- -----------------------------------------------------------------------------
SELECT 
    s.department,
    COUNT(DISTINCT s.id) AS total_students,
    ROUND(AVG(ar.attendance), 1) AS avg_attendance,
    ROUND(AVG(ar.internal_score), 1) AS avg_internal,
    ROUND(AVG(p.predicted_score), 1) AS avg_predicted_score,
    SUM(CASE WHEN p.risk_level = 'HIGH' THEN 1 ELSE 0 END) AS high_risk_count
FROM students s
INNER JOIN academic_records ar ON s.id = ar.student_id
INNER JOIN predictions p ON s.id = p.student_id
GROUP BY s.department
ORDER BY avg_predicted_score DESC;

-- -----------------------------------------------------------------------------
-- Query 8: Subject-wise Marks Analysis & Failure Rate Detection
-- Demonstrates: Aggregating curricular scores, identifying difficult subjects
-- -----------------------------------------------------------------------------
SELECT 
    sub.code AS subject_code,
    sub.name AS subject_name,
    COUNT(sc.id) AS total_evaluated,
    ROUND(AVG(sc.score), 2) AS average_score,
    ROUND(MIN(sc.score), 2) AS lowest_score,
    ROUND(MAX(sc.score), 2) AS highest_score,
    SUM(CASE WHEN sc.score < 50 THEN 1 ELSE 0 END) AS failed_count
FROM subjects sub
INNER JOIN subject_scores sc ON sub.id = sc.subject_id
GROUP BY sub.id, sub.code, sub.name
ORDER BY average_score ASC;
