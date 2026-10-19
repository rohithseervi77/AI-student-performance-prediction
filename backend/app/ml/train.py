"""
EduPredict AI - Machine Learning Training & Evaluation Pipeline
Trains, evaluates, and selects best regression and classification models.
Saves model artifacts and genuine evaluation metrics for admin analytics.
"""

import os
import json
import numpy as np
import pandas as pd
import joblib

from sklearn.model_selection import train_test_split
from sklearn.preprocessing import StandardScaler
from sklearn.linear_model import LinearRegression, LogisticRegression
from sklearn.ensemble import RandomForestRegressor, GradientBoostingRegressor
from sklearn.ensemble import RandomForestClassifier, GradientBoostingClassifier
from sklearn.metrics import (
    mean_absolute_error,
    root_mean_squared_error,
    r2_score,
    accuracy_score,
    precision_score,
    recall_score,
    f1_score,
    confusion_matrix
)

FEATURE_COLS = [
    'attendance',
    'study_hours',
    'assignment_score',
    'internal_score',
    'previous_gpa',
    'previous_marks',
    'participation',
    'backlogs'
]

FEATURE_LABELS = {
    'attendance': 'Class Attendance (%)',
    'study_hours': 'Weekly Study Hours',
    'assignment_score': 'Assignment Average (%)',
    'internal_score': 'Internal Exam Average (%)',
    'previous_gpa': 'Previous Semester GPA',
    'previous_marks': 'Previous Semester Marks (%)',
    'participation': 'Classroom Participation (%)',
    'backlogs': 'Active Backlog Count'
}

def train_and_evaluate_pipeline():
    base_dir = os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
    dataset_path = os.path.join(base_dir, 'datasets', 'student_performance.csv')
    models_dir = os.path.join(base_dir, 'models')
    os.makedirs(models_dir, exist_ok=True)
    
    if not os.path.exists(dataset_path):
        raise FileNotFoundError(f"Dataset not found at {dataset_path}. Run generate_dataset.py first.")
        
    df = pd.read_csv(dataset_path)
    print(f"Loaded {len(df)} records from {dataset_path}")
    
    # 1. Data Cleaning & Validation
    df = df.dropna(subset=FEATURE_COLS + ['predicted_final_score', 'performance_category'])
    
    # Clip any out-of-range anomalies
    df['attendance'] = df['attendance'].clip(0, 100)
    df['study_hours'] = df['study_hours'].clip(0, 80)
    df['assignment_score'] = df['assignment_score'].clip(0, 100)
    df['internal_score'] = df['internal_score'].clip(0, 100)
    df['previous_gpa'] = df['previous_gpa'].clip(0, 10)
    df['previous_marks'] = df['previous_marks'].clip(0, 100)
    df['participation'] = df['participation'].clip(0, 100)
    df['backlogs'] = df['backlogs'].clip(0, 15)
    
    X = df[FEATURE_COLS].copy()
    y_reg = df['predicted_final_score'].values
    y_clf = df['performance_category'].values
    
    # 2. Split dataset (80% train, 20% test)
    X_train, X_test, y_reg_train, y_reg_test, y_clf_train, y_clf_test = train_test_split(
        X, y_reg, y_clf, test_size=0.20, random_state=42, stratify=y_clf
    )
    
    # 3. Feature Scaler
    scaler = StandardScaler()
    X_train_scaled = scaler.fit_transform(X_train)
    X_test_scaled = scaler.transform(X_test)
    
    # =========================================================================
    # 4. Compare Regression Models
    # =========================================================================
    reg_candidates = {
        "Linear Regression": LinearRegression(),
        "Random Forest Regressor": RandomForestRegressor(n_estimators=100, max_depth=8, random_state=42),
        "Gradient Boosting Regressor": GradientBoostingRegressor(n_estimators=100, learning_rate=0.08, max_depth=4, random_state=42)
    }
    
    reg_eval = {}
    best_reg_name = None
    best_reg_r2 = -float('inf')
    best_reg_model = None
    
    for name, model in reg_candidates.items():
        if name == "Linear Regression":
            model.fit(X_train_scaled, y_reg_train)
            preds = model.predict(X_test_scaled)
        else:
            model.fit(X_train, y_reg_train)
            preds = model.predict(X_test)
            
        mae = float(mean_absolute_error(y_reg_test, preds))
        rmse = float(root_mean_squared_error(y_reg_test, preds))
        r2 = float(r2_score(y_reg_test, preds))
        
        reg_eval[name] = {
            "mae": round(mae, 3),
            "rmse": round(rmse, 3),
            "r2": round(r2, 4)
        }
        print(f"Regression [{name}] -> MAE: {mae:.3f}, RMSE: {rmse:.3f}, R²: {r2:.4f}")
        
        if r2 > best_reg_r2:
            best_reg_r2 = r2
            best_reg_name = name
            best_reg_model = model
            
    print(f"\n=> Best Regressor Selected: {best_reg_name} (R² = {best_reg_r2:.4f})")
    
    # =========================================================================
    # 5. Compare Classification Models
    # =========================================================================
    categories = ['At Risk', 'Average', 'Good', 'Excellent']
    clf_candidates = {
        "Logistic Regression": LogisticRegression(max_iter=500, random_state=42),
        "Random Forest Classifier": RandomForestClassifier(n_estimators=100, max_depth=8, random_state=42),
        "Gradient Boosting Classifier": GradientBoostingClassifier(n_estimators=100, learning_rate=0.08, max_depth=4, random_state=42)
    }
    
    clf_eval = {}
    best_clf_name = None
    best_clf_f1 = -float('inf')
    best_clf_model = None
    
    for name, model in clf_candidates.items():
        if name == "Logistic Regression":
            model.fit(X_train_scaled, y_clf_train)
            preds = model.predict(X_test_scaled)
        else:
            model.fit(X_train, y_clf_train)
            preds = model.predict(X_test)
            
        acc = float(accuracy_score(y_clf_test, preds))
        prec = float(precision_score(y_clf_test, preds, average='weighted', zero_division=0))
        rec = float(recall_score(y_clf_test, preds, average='weighted', zero_division=0))
        f1 = float(f1_score(y_clf_test, preds, average='weighted', zero_division=0))
        
        cm = confusion_matrix(y_clf_test, preds, labels=categories).tolist()
        
        clf_eval[name] = {
            "accuracy": round(acc, 4),
            "precision": round(prec, 4),
            "recall": round(rec, 4),
            "f1_score": round(f1, 4),
            "confusion_matrix": cm,
            "classes": categories
        }
        print(f"Classifier [{name}] -> Accuracy: {acc:.4f}, Precision: {prec:.4f}, Recall: {rec:.4f}, F1: {f1:.4f}")
        
        if f1 > best_clf_f1:
            best_clf_f1 = f1
            best_clf_name = name
            best_clf_model = model
            
    print(f"\n=> Best Classifier Selected: {best_clf_name} (F1 = {best_clf_f1:.4f})")
    
    # =========================================================================
    # 6. Extract Feature Importance & Model Weights
    # =========================================================================
    feature_importances = []
    # Extract feature importance from Random Forest Regressor for tree-based importance
    rf_reg = reg_candidates["Random Forest Regressor"]
    if hasattr(rf_reg, 'feature_importances_'):
        rf_importances = rf_reg.feature_importances_
        total_imp = sum(rf_importances) if sum(rf_importances) > 0 else 1.0
        for col, imp in zip(FEATURE_COLS, rf_importances):
            normalized_pct = (imp / total_imp) * 100.0
            feature_importances.append({
                "feature": col,
                "label": FEATURE_LABELS.get(col, col),
                "importance": round(float(imp), 4),
                "importance_pct": round(float(normalized_pct), 2)
            })
        feature_importances.sort(key=lambda x: x['importance'], reverse=True)
    elif hasattr(best_reg_model, 'coef_'):
        coefs = np.abs(best_reg_model.coef_)
        total_coef = sum(coefs) if sum(coefs) > 0 else 1.0
        for col, coef in zip(FEATURE_COLS, coefs):
            normalized_pct = (coef / total_coef) * 100.0
            feature_importances.append({
                "feature": col,
                "label": FEATURE_LABELS.get(col, col),
                "importance": round(float(coef), 4),
                "importance_pct": round(float(normalized_pct), 2)
            })
        feature_importances.sort(key=lambda x: x['importance'], reverse=True)
        
    # Calculate residual standard deviation for transparent confidence estimation
    if best_reg_name == "Linear Regression":
        final_test_preds = best_reg_model.predict(X_test_scaled)
    else:
        final_test_preds = best_reg_model.predict(X_test)
    residuals = y_reg_test - final_test_preds
    residual_std = float(np.std(residuals))
    
    # Save artifacts
    joblib.dump(best_reg_model, os.path.join(models_dir, 'regressor_model.joblib'))
    joblib.dump(best_clf_model, os.path.join(models_dir, 'classifier_model.joblib'))
    joblib.dump(scaler, os.path.join(models_dir, 'scaler.joblib'))
    
    metrics_summary = {
        "dataset_total_samples": len(df),
        "train_samples": len(X_train),
        "test_samples": len(X_test),
        "feature_columns": FEATURE_COLS,
        "feature_labels": FEATURE_LABELS,
        "selected_regressor": best_reg_name,
        "selected_classifier": best_clf_name,
        "regression_comparison": reg_eval,
        "classification_comparison": clf_eval,
        "best_regression_metrics": reg_eval[best_reg_name],
        "best_classification_metrics": clf_eval[best_clf_name],
        "feature_importances": feature_importances,
        "residual_std": round(residual_std, 3),
        "trained_at": pd.Timestamp.now().isoformat()
    }
    
    metrics_path = os.path.join(models_dir, 'model_metrics.json')
    with open(metrics_path, 'w') as f:
        json.dump(metrics_summary, f, indent=2)
        
    print(f"\nArtifacts successfully saved to {models_dir}")
    print(f"Metrics saved to {metrics_path}")
    return metrics_summary

if __name__ == '__main__':
    train_and_evaluate_pipeline()
