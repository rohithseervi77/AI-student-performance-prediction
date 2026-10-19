"""
EduPredict AI - Personalized Recommendation Engine
Generates tailored, actionable academic advice derived from individual student performance metrics.
"""

from typing import List, Dict, Any, Optional

def generate_recommendations(
    attendance: float,
    study_hours: float,
    assignment_score: float,
    internal_score: float,
    previous_gpa: float,
    backlogs: int,
    predicted_score: float,
    subject_marks: Optional[Dict[str, float]] = None
) -> List[Dict[str, Any]]:
    """
    Produces actionable recommendations with categorization and severity levels:
    - severity: 'info', 'warning', 'urgent'
    - category: 'attendance', 'assignments', 'internals', 'study_hours', 'backlogs', 'subject', 'general'
    """
    recs = []

    # 1. Backlogs Recommendation
    if backlogs >= 2:
        recs.append({
            "category": "backlogs",
            "severity": "urgent",
            "recommendation_text": f"You currently have {backlogs} backlogs. Prioritize clearing pending subjects through dedicated remedial coaching to reduce institutional academic risk."
        })
    elif backlogs == 1:
        recs.append({
            "category": "backlogs",
            "severity": "warning",
            "recommendation_text": "Prioritize clearing your 1 pending backlog in the upcoming supplementary examination cycle to maintain a clear academic record."
        })

    # 2. Attendance Recommendation
    if attendance < 75.0:
        recs.append({
            "category": "attendance",
            "severity": "urgent",
            "recommendation_text": f"Your current attendance ({attendance}%) is below the mandatory 75% university eligibility requirement. Focus on attending all scheduled classes regularly to avoid exam debarment."
        })
    elif attendance < 82.0:
        recs.append({
            "category": "attendance",
            "severity": "warning",
            "recommendation_text": f"Your attendance is borderline at {attendance}%. Build a safety cushion by attending the next 3 weeks of lectures without absence."
        })
    else:
        recs.append({
            "category": "attendance",
            "severity": "info",
            "recommendation_text": f"Excellent attendance record ({attendance}%). Continue your steady classroom participation."
        })

    # 3. Internal Exam & Continuous Assessment
    if internal_score < 50.0:
        recs.append({
            "category": "internals",
            "severity": "urgent",
            "recommendation_text": f"Your internal assessment average ({internal_score}%) indicates significant risk of semester failure. Request individual faculty consultation and attend tutorial problem-solving sessions."
        })
    elif internal_score < 65.0:
        recs.append({
            "category": "internals",
            "severity": "warning",
            "recommendation_text": f"Your internal assessment scores ({internal_score}%) indicate that additional structured revision is recommended prior to final exams."
        })
    elif internal_score >= 85.0:
        recs.append({
            "category": "internals",
            "severity": "info",
            "recommendation_text": "Strong internal assessment performance. Maintain this momentum into university finals."
        })

    # 4. Assignment Consistency
    if assignment_score < 60.0:
        recs.append({
            "category": "assignments",
            "severity": "warning",
            "recommendation_text": "Your assignment scores are affecting your predicted performance. Focus on completing homework and lab exercises consistently before due dates."
        })
    elif assignment_score < 75.0:
        recs.append({
            "category": "assignments",
            "severity": "info",
            "recommendation_text": "Work with study group peers on complex assignments to improve depth and technical accuracy."
        })

    # 5. Study Hours & Time Management
    if study_hours < 8.0:
        target_hours = min(15.0, study_hours + 4.0)
        recs.append({
            "category": "study_hours",
            "severity": "warning",
            "recommendation_text": f"You are averaging {study_hours} weekly self-study hours. Consider increasing your weekly study time gradually towards {target_hours:.0f} hours using focused Pomodoro blocks."
        })
    elif study_hours >= 16.0:
        recs.append({
            "category": "study_hours",
            "severity": "info",
            "recommendation_text": f"High self-study commitment ({study_hours} hrs/week). Ensure balanced time management with adequate rest to prevent burnout."
        })

    # 6. Subject-Specific Analysis
    if subject_marks:
        for subj_name, mark in subject_marks.items():
            if mark < 50.0:
                recs.append({
                    "category": "subject",
                    "severity": "urgent",
                    "recommendation_text": f"{subj_name} appears to be a critical weak area ({mark}%). Consider allocating daily practice time and attending office hours."
                })
            elif mark < 65.0:
                recs.append({
                    "category": "subject",
                    "severity": "warning",
                    "recommendation_text": f"Your score in {subj_name} ({mark}%) is below your average. Dedicate 2 extra hours weekly to past-year exam questions in this subject."
                })

    # 7. General Academic Standing
    if predicted_score >= 85.0 and len(recs) <= 3:
        recs.append({
            "category": "general",
            "severity": "info",
            "recommendation_text": "You are on track for University Distinction! Consider participating in hackathons, academic competitions, or student paper publications."
        })

    return recs
