"""
EduPredict AI - Authentication Routes
Registration, Login, and Identity verification endpoints.
"""

from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from app.database import get_db
from app.models import User, Student
from app.schemas import UserRegisterRequest, UserLoginRequest, TokenResponse
from app.utils.security import hash_password, verify_password, create_access_token
from app.utils.deps import get_current_user

router = APIRouter(prefix="/auth", tags=["Authentication"])

@router.post("/register", response_model=TokenResponse, status_code=status.HTTP_201_CREATED)
def register_student(req: UserRegisterRequest, db: Session = Depends(get_db)):
    # 1. Check for duplicate email
    existing_user = db.query(User).filter(User.email == req.email.lower().strip()).first()
    if existing_user:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="An account with this email address already exists."
        )

    # 2. Check for duplicate register number
    existing_regno = db.query(Student).filter(Student.register_number == req.register_number.upper().strip()).first()
    if existing_regno:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"Register number '{req.register_number.upper().strip()}' is already registered."
        )

    # 3. Create User & Student Profile atomically
    try:
        new_user = User(
            email=req.email.lower().strip(),
            password_hash=hash_password(req.password),
            role="student",
            is_active=True
        )
        db.add(new_user)
        db.flush() # Generates new_user.id

        new_student = Student(
            user_id=new_user.id,
            full_name=req.full_name.strip(),
            register_number=req.register_number.upper().strip(),
            department=req.department.strip(),
            semester=req.semester,
            section=req.section.upper().strip()
        )
        db.add(new_student)
        db.commit()
        db.refresh(new_student)
    except Exception as e:
        db.rollback()
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to create user account: {str(e)}"
        )

    # 4. Generate JWT
    token_payload = {
        "sub": str(new_user.id),
        "email": new_user.email,
        "role": new_user.role,
        "student_id": new_student.id,
        "name": new_student.full_name
    }
    access_token = create_access_token(token_payload)

    return TokenResponse(
        access_token=access_token,
        role=new_user.role,
        user_id=new_user.id,
        student_id=new_student.id,
        email=new_user.email,
        full_name=new_student.full_name
    )

@router.post("/login", response_model=TokenResponse)
def login_user(req: UserLoginRequest, db: Session = Depends(get_db)):
    # 1. Lookup user by email
    user = db.query(User).filter(User.email == req.email.lower().strip()).first()
    if not user or not verify_password(req.password, user.password_hash):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid email or password combination."
        )

    if not user.is_active:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Your account has been deactivated. Contact administration."
        )

    # 2. Get profile details
    student = db.query(Student).filter(Student.user_id == user.id).first()
    full_name = student.full_name if student else ("Administrator" if user.role == "admin" else user.email)
    student_id = student.id if student else None

    # 3. Generate JWT
    token_payload = {
        "sub": str(user.id),
        "email": user.email,
        "role": user.role,
        "student_id": student_id,
        "name": full_name
    }
    access_token = create_access_token(token_payload)

    return TokenResponse(
        access_token=access_token,
        role=user.role,
        user_id=user.id,
        student_id=student_id,
        email=user.email,
        full_name=full_name
    )

@router.get("/me")
def get_current_user_profile(user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    student = db.query(Student).filter(Student.user_id == user.id).first()
    return {
        "id": user.id,
        "email": user.email,
        "role": user.role,
        "student_id": student.id if student else None,
        "full_name": student.full_name if student else ("Administrator" if user.role == "admin" else user.email),
        "register_number": student.register_number if student else None,
        "department": student.department if student else None,
        "semester": student.semester if student else None,
        "section": student.section if student else None
    }
