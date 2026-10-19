"""
EduPredict AI - Synthetic Dataset Generator
Generates realistic, correlated academic performance records for machine learning training.
Clearly labeled as synthetic academic simulation data.
"""

import os
import numpy as np
import pandas as pd

def generate_student_dataset(n_samples: int = 850, random_seed: int = 42) -> pd.DataFrame:
    np.random.seed(random_seed)
    
    # 1. Base academic aptitude factor (latent student capability, standard normal ~ N(0, 1))
    aptitude = np.random.normal(loc=0.0, scale=1.0, size=n_samples)
    
    # 2. Study motivation & discipline factor ~ N(0, 1) correlated with aptitude (r ~ 0.4)
    discipline = 0.4 * aptitude + np.sqrt(1 - 0.4**2) * np.random.normal(0, 1, size=n_samples)
    
    # 3. Attendance: Strongly correlated with discipline (mean ~ 78%, bounded [35, 100])
    raw_attendance = 78 + 12 * discipline + np.random.normal(0, 6, size=n_samples)
    attendance = np.clip(np.round(raw_attendance, 1), 35.0, 100.0)
    
    # 4. Study Hours per week: Positively related to discipline, range [2, 35]
    raw_study_hours = 12 + 6 * discipline + np.random.normal(0, 3, size=n_samples)
    study_hours = np.clip(np.round(raw_study_hours, 1), 2.0, 35.0)
    
    # 5. Assignment Average: Correlated with discipline, attendance, and aptitude
    raw_assignment = 40 + 0.3 * attendance + 10 * aptitude + 5 * discipline + np.random.normal(0, 5, size=n_samples)
    assignment_score = np.clip(np.round(raw_assignment, 1), 25.0, 100.0)
    
    # 6. Internal Exam Average: Strongly correlated with aptitude, study hours, and assignments
    raw_internal = 25 + 0.35 * assignment_score + 0.25 * attendance + 0.8 * study_hours + 8 * aptitude + np.random.normal(0, 5, size=n_samples)
    internal_score = np.clip(np.round(raw_internal, 1), 20.0, 100.0)
    
    # 7. Previous Semester GPA: Correlated with aptitude and historical consistency [3.5, 9.9]
    raw_gpa = 5.0 + 0.035 * internal_score + 0.7 * aptitude + np.random.normal(0, 0.4, size=n_samples)
    previous_gpa = np.clip(np.round(raw_gpa, 2), 3.5, 9.9)
    
    # 8. Previous Semester Marks: Related to previous GPA
    raw_prev_marks = previous_gpa * 9.5 + np.random.normal(0, 3.5, size=n_samples)
    previous_marks = np.clip(np.round(raw_prev_marks, 1), 30.0, 99.0)
    
    # 9. Class Participation Score [20, 100]
    raw_part = 30 + 0.4 * attendance + 8 * discipline + np.random.normal(0, 8, size=n_samples)
    participation = np.clip(np.round(raw_part, 1), 20.0, 100.0)
    
    # 10. Backlogs: Higher when internal_score and attendance are low
    backlog_prob = 1.0 / (1.0 + np.exp(0.08 * (internal_score - 55) + 0.05 * (attendance - 70)))
    raw_backlogs = np.random.poisson(lam=backlog_prob * 3.5)
    backlogs = np.clip(raw_backlogs, 0, 6)
    
    # 11. Predicted Final Score (Target Continuous [20, 100])
    # Realistic weighted academic formulation with non-linear penalties for backlogs and low attendance:
    # 35% Internal + 25% Assignment + 15% Previous GPA equivalent + 10% Attendance + 8% Study Hours impact + 7% Participation
    base_final = (
        0.35 * internal_score +
        0.25 * assignment_score +
        0.15 * (previous_gpa * 10) +
        0.10 * attendance +
        0.08 * np.minimum(study_hours * 3.0, 100.0) +
        0.07 * participation
    )
    
    # Non-linear penalty: severe backlogs reduce final score due to split focus
    backlog_penalty = backlogs * 3.2
    
    # Attendance shortage penalty: attendance < 75% incurs exam eligibility deduction
    attendance_penalty = np.where(attendance < 75.0, (75.0 - attendance) * 0.4, 0.0)
    
    # Realistic irreducible error / noise (exam day anxiety, exam variances ~ N(0, 3.5))
    noise = np.random.normal(0, 3.2, size=n_samples)
    
    final_score = base_final - backlog_penalty - attendance_penalty + noise
    predicted_final_score = np.clip(np.round(final_score, 1), 25.0, 99.5)
    
    # 12. Classification Target: Performance Category
    # Excellent (>= 85), Good (70 - 84.9), Average (50 - 69.9), At Risk (< 50)
    conditions = [
        predicted_final_score >= 85.0,
        (predicted_final_score >= 70.0) & (predicted_final_score < 85.0),
        (predicted_final_score >= 50.0) & (predicted_final_score < 70.0),
        predicted_final_score < 50.0
    ]
    categories = ['Excellent', 'Good', 'Average', 'At Risk']
    performance_category = np.select(conditions, categories, default='Average')
    
    # 13. Risk Level (LOW, MEDIUM, HIGH)
    risk_conditions = [
        (predicted_final_score < 50.0) | (backlogs >= 2) | ((attendance < 70.0) & (internal_score < 50.0)),
        (predicted_final_score < 65.0) | (backlogs == 1) | (attendance < 75.0) | (internal_score < 60.0),
    ]
    risk_levels = ['HIGH', 'MEDIUM']
    risk_level = np.select(risk_conditions, risk_levels, default='LOW')
    
    df = pd.DataFrame({
        'student_id': [f'STU{1000 + i}' for i in range(n_samples)],
        'attendance': attendance,
        'study_hours': study_hours,
        'assignment_score': assignment_score,
        'internal_score': internal_score,
        'previous_gpa': previous_gpa,
        'previous_marks': previous_marks,
        'participation': participation,
        'backlogs': backlogs,
        'predicted_final_score': predicted_final_score,
        'performance_category': performance_category,
        'risk_level': risk_level,
        'data_type': 'synthetic_academic_simulation'
    })
    
    return df

if __name__ == '__main__':
    dataset_dir = os.path.dirname(os.path.abspath(__file__))
    os.makedirs(dataset_dir, exist_ok=True)
    csv_path = os.path.join(dataset_dir, 'student_performance.csv')
    
    df = generate_student_dataset(n_samples=850, random_seed=42)
    df.to_csv(csv_path, index=False)
    print(f"Generated {len(df)} synthetic student records saved to {csv_path}")
    print("\nSample preview:")
    print(df.head(3))
    print("\nTarget Distribution:")
    print(df['performance_category'].value_counts())
    print("\nRisk Level Distribution:")
    print(df['risk_level'].value_counts())
