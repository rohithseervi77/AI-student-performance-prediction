"""
EduPredict AI - Early Warning System & Risk Classification Engine
Combines Machine Learning outputs with institutional academic rules.
"""

from typing import Dict, Any, Tuple, List

def evaluate_academic_risk(
    attendance: float,
    study_hours: float,
    assignment_score: float,
    internal_score: float,
    previous_gpa: float,
    previous_marks: float,
    participation: float,
    backlogs: int,
    predicted_score: float
) -> Tuple[str, List[str]]:
    """
    Evaluates multi-variable academic risk level:
    Returns (risk_level, reasons_list)
    risk_level is one of: 'LOW', 'MEDIUM', 'HIGH'
    """
    reasons = []
    
    # 1. Critical Hard Thresholds (Immediate Escalation Triggers)
    is_high_risk = False
    
    if backlogs >= 2:
        is_high_risk = True
        reasons.append(f"Student has {backlogs} active backlogs requiring immediate academic recovery.")
        
    if attendance < 75.0 and internal_score < 50.0:
        is_high_risk = True
        reasons.append(f"Combined risk: Low attendance ({attendance}%) and failing internal assessments ({internal_score}%).")
    elif attendance < 65.0:
        is_high_risk = True
        reasons.append(f"Severe attendance shortage ({attendance}% is well below the statutory 75% eligibility threshold).")
        
    if predicted_score < 50.0:
        is_high_risk = True
        reasons.append(f"ML predicted final score ({predicted_score}%) is in the failure zone (< 50%).")
        
    if is_high_risk:
        return "HIGH", reasons
        
    # 2. Medium Risk Conditions (Warning & Preventive Attention)
    is_medium_risk = False
    
    if backlogs == 1:
        is_medium_risk = True
        reasons.append("1 active backlog pending clearance.")
        
    if 65.0 <= attendance < 75.0:
        is_medium_risk = True
        reasons.append(f"Attendance ({attendance}%) is below 75% threshold; requires medical condonation or remedial attendance.")
    elif 75.0 <= attendance < 80.0:
        is_medium_risk = True
        reasons.append(f"Borderline attendance ({attendance}%); close to institutional warning threshold.")
        
    if internal_score < 60.0:
        is_medium_risk = True
        reasons.append(f"Internal score ({internal_score}%) indicates potential struggle in continuous assessments.")
        
    if assignment_score < 60.0:
        is_medium_risk = True
        reasons.append(f"Assignment completion rate ({assignment_score}%) is substandard.")
        
    if 50.0 <= predicted_score < 65.0:
        is_medium_risk = True
        reasons.append(f"Predicted final score ({predicted_score}%) falls within average/marginal passing bracket.")
        
    if study_hours < 7.0:
        is_medium_risk = True
        reasons.append(f"Self-directed weekly study time ({study_hours} hrs) is below recommended 10+ hrs.")
        
    if previous_gpa < 6.0:
        is_medium_risk = True
        reasons.append(f"Historical GPA ({previous_gpa}) indicates prior academic vulnerability.")
        
    if is_medium_risk:
        return "MEDIUM", reasons
        
    # 3. Low Risk (Healthy Academic Trajectory)
    reasons.append(f"Consistent attendance ({attendance}%) meets university standards.")
    reasons.append(f"Predicted score ({predicted_score}%) projects satisfactory academic standing.")
    if backlogs == 0:
        reasons.append("Zero pending backlogs.")
        
    return "LOW", reasons
