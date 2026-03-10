from datetime import datetime, timedelta
import os
from typing import Callable, List

from fastapi import APIRouter, Depends, HTTPException, status
from fastapi.security import OAuth2PasswordBearer
from jose import JWTError, jwt
from passlib.context import CryptContext
from sqlalchemy.orm import Session

from database import get_db
from models import Employee
from schemas import UserRegister, UserLogin, EmployeeResponse, Token, TokenData, DepartmentEnum

router = APIRouter()

pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")
oauth2_scheme = OAuth2PasswordBearer(tokenUrl="/api/auth/login")

SECRET_KEY = os.getenv("SECRET_KEY", "smartcommute-super-secret-key-2024")
ALGORITHM = os.getenv("ALGORITHM", "HS256")
ACCESS_TOKEN_EXPIRE_MINUTES = int(os.getenv("ACCESS_TOKEN_EXPIRE_MINUTES", "1440"))


def get_password_hash(password: str) -> str:
    password=password[:72]
    return pwd_context.hash(password)


def verify_password(plain_password: str, hashed_password: str) -> bool:
    return pwd_context.verify(plain_password, hashed_password)


def create_access_token(data: dict, expires_delta: timedelta | None = None) -> str:
    to_encode = data.copy()
    expire = datetime.utcnow() + (expires_delta or timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES))
    to_encode.update({"exp": expire})
    encoded_jwt = jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)
    return encoded_jwt


def get_current_user(
    token: str = Depends(oauth2_scheme),
    db: Session = Depends(get_db),
) -> Employee:
    credentials_exception = HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail="Could not validate credentials",
        headers={"WWW-Authenticate": "Bearer"},
    )
    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        user_id: str | None = payload.get("sub")
        email: str | None = payload.get("email")
        role: str | None = payload.get("role")
        if user_id is None or email is None or role is None:
            raise credentials_exception
        token_data = TokenData(user_id=user_id, email=email, role=role)
    except JWTError:
        raise credentials_exception

    user = db.query(Employee).filter(Employee.id == token_data.user_id).first()
    if user is None:
        raise credentials_exception
    return user


def require_role(*roles: List[str]) -> Callable:
    def dependency(current_user: Employee = Depends(get_current_user)) -> Employee:
        if roles and current_user.role not in roles:
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail="Insufficient permissions",
            )
        return current_user

    return dependency


@router.post("/register", response_model=EmployeeResponse, status_code=status.HTTP_200_OK)
def register_user(payload: UserRegister, db: Session = Depends(get_db)):
    existing_email = db.query(Employee).filter(Employee.email == payload.email).first()
    if existing_email:
        raise HTTPException(status_code=400, detail="Email already registered")

    existing_emp_id = db.query(Employee).filter(Employee.employee_id == payload.employee_id).first()
    if existing_emp_id:
        raise HTTPException(status_code=400, detail="Employee ID already registered")

    hashed_password = get_password_hash(payload.password)
    # Ensure we always store a value that matches the PostgreSQL enum exactly
    department_value: str | None = None
    if isinstance(payload.department, DepartmentEnum):
        department_value = payload.department.value
    elif isinstance(payload.department, str):
        # If somehow a raw string slips through, normalise common cases
        mapping = {
            "Engineering": "Engineering",
            "ENGINEERING": "Engineering",
            "Hr": "HR",
            "HR": "HR",
            "Sales": "Sales",
            "SALES": "Sales",
            "Operations": "Operations",
            "OPERATIONS": "Operations",
            "Finance": "Finance",
            "FINANCE": "Finance",
        }
        department_value = mapping.get(payload.department, payload.department)

    employee = Employee(
        name=payload.name,
        employee_id=payload.employee_id,
        email=payload.email,
        phone=payload.phone,
        department=department_value,
        role="EMPLOYEE",
        hashed_password=hashed_password,
    )
    db.add(employee)
    db.commit()
    db.refresh(employee)
    return employee


@router.post("/login", response_model=Token)
def login(payload: UserLogin, db: Session = Depends(get_db)):
    user = db.query(Employee).filter(Employee.email == payload.email).first()
    if not user or not verify_password(payload.password, user.hashed_password):
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Incorrect email or password")

    access_token = create_access_token(
        data={
            "sub": str(user.id),
            "email": user.email,
            "role": user.role,
        }
    )
    return Token(access_token=access_token)


@router.get("/me", response_model=EmployeeResponse)
def read_me(current_user: Employee = Depends(get_current_user)):
    return current_user

