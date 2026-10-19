export type UserRole = 'student' | 'admin';

export interface UserSession {
  token: string;
  role: UserRole;
  userId: number;
  studentId?: number;
  email: string;
  fullName: string;
}

export interface StudentProfile {
  id: number;
  user_id: number;
  email?: string;
  full_name: string;
  register_number: string;
  department: string;
  semester: number;
  section: string;
  created_at?: string;
  latest_academic?: AcademicRecord | null;
  latest_prediction?: {
    id?: number;
    predicted_score: number;
    performance_category: string;
    risk_level: 'LOW' | 'MEDIUM' | 'HIGH';
    confidence: number;
    created_at?: string;
  } | null;
}

export interface AcademicRecord {
  attendance: number;
  study_hours: number;
  assignment_score: number;
  internal_score: number;
  previous_gpa: number;
  previous_marks: number;
  participation: number;
  backlogs: number;
  term_label?: string;
}

export interface InfluencingFactor {
  feature: string;
  label: string;
  importance_pct: number;
  student_value?: number;
}

export interface RecommendationItem {
  id?: number;
  recommendation_text: string;
  category: string;
  severity: 'info' | 'warning' | 'urgent';
  is_completed?: boolean;
}

export interface PredictionResult {
  id?: number;
  predicted_score: number;
  performance_category: 'Excellent' | 'Good' | 'Average' | 'At Risk';
  risk_level: 'LOW' | 'MEDIUM' | 'HIGH';
  confidence: number;
  confidence_label: string;
  created_at?: string;
  inputs?: AcademicRecord;
  influencing_factors: InfluencingFactor[];
  recommendations: RecommendationItem[];
}

export interface AdminStats {
  total_students: number;
  low_risk_count: number;
  medium_risk_count: number;
  high_risk_count: number;
  average_predicted_score: number;
  average_gpa: number;
  total_predictions: number;
}

export interface AdminStudentSummary {
  id: number;
  user_id: number;
  register_number: string;
  full_name: string;
  email: string;
  department: string;
  semester: number;
  section: string;
  latest_gpa: number;
  latest_predicted_score: number;
  latest_performance_category: string;
  latest_risk_level: 'LOW' | 'MEDIUM' | 'HIGH';
  last_assessed_at?: string;
}

export interface SubjectItem {
  id: number;
  code: string;
  name: string;
  department: string;
  credits: number;
}
