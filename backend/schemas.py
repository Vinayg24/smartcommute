from __future__ import annotations
from enum import Enum

from datetime import date, datetime, time
from typing import List, Optional, Any, Dict
from uuid import UUID

from pydantic import BaseModel, EmailStr, field_validator, model_validator, ConfigDict


# Department enum MUST match PostgreSQL employee_department_enum values
# enum employee_department_enum = 'Engineering', 'HR', 'Sales', 'Operations', 'Finance'
class DepartmentEnum(str, Enum):
    ENGINEERING = "Engineering"
    HR = "HR"
    SALES = "Sales"
    OPERATIONS = "Operations"
    FINANCE = "Finance"

class UserRegister(BaseModel):
    name: str
    employee_id: str
    email: EmailStr
    phone: str
    department: DepartmentEnum
    password: str
    confirm_password: str

    @model_validator(mode="after")
    def passwords_match(self) -> "UserRegister":
        if self.password != self.confirm_password:
            raise ValueError("Passwords do not match")
        return self

    @field_validator("password")
    @classmethod
    def validate_password(cls, v: str) -> str:
        if len(v) < 8:
            raise ValueError("Password must be at least 8 characters")
        if not any(c.isupper() for c in v):
            raise ValueError("Password must contain at least one uppercase letter")
        if not any(c.isdigit() for c in v):
            raise ValueError("Password must contain at least one digit")
        return v


class UserLogin(BaseModel):
    email: EmailStr
    password: str


class Token(BaseModel):
    access_token: str
    token_type: str = "bearer"


class TokenData(BaseModel):
    user_id: str
    email: str
    role: str


class EmployeeResponse(BaseModel):
    id: UUID
    name: str
    employee_id: str
    email: str
    phone: str
    department: DepartmentEnum
    role: str
    is_active: bool
    created_at: datetime

    model_config = ConfigDict(from_attributes=True)


class OfficeResponse(BaseModel):
    id: UUID
    name: str
    address: str
    city: Optional[str] = None
    latitude: float
    longitude: float
    phone: Optional[str] = None
    email: Optional[str] = None
    capacity: int

    model_config = ConfigDict(from_attributes=True)


class OfficeCrowdResponse(BaseModel):
    office_id: UUID
    level: str  # LOW/MEDIUM/HIGH
    color: str  # green/yellow/red
    count: int
    percentage: int


class TravelRequestCreate(BaseModel):
    office_id: UUID
    from_location: str
    from_lat: float
    from_lng: float
    travel_date: date
    travel_time: time
    purpose: Optional[str] = None


class TravelRequestResponse(BaseModel):
    id: UUID
    employee_id: UUID
    office_id: UUID
    from_location: str
    from_lat: float
    from_lng: float
    travel_date: date
    travel_time: time
    distance_km: Optional[float]
    duration_mins: Optional[int]
    crowd_level: Optional[str]
    booking_status: str
    matched_with: Optional[Any]
    purpose: Optional[str]
    created_at: datetime
    updated_at: datetime
    employee: EmployeeResponse
    office: OfficeResponse

    model_config = ConfigDict(from_attributes=True)


class DistanceResponse(BaseModel):
    distance_km: float
    duration_mins: int
    distance_text: str
    duration_text: str


class MatchResult(BaseModel):
    employee_id: UUID
    employee_name: str
    employee_department: str
    from_location: str
    from_lat: float
    from_lng: float
    distance_between_km: float
    travel_time: str
    request_id: UUID


class MatchResponse(BaseModel):
    matches: List[MatchResult]
    total_found: int
    request_id: UUID


class DashboardStats(BaseModel):
    total_requests_today: int
    active_shares: int
    cost_saved_inr: float
    co2_reduced_kg: float
    hourly_demand: List[Dict[str, Any]]
    office_traffic: List[Dict[str, Any]]


class NotificationResponse(BaseModel):
    id: UUID
    type: str
    message: str
    is_read: bool
    related_id: Optional[UUID]
    created_at: datetime

    model_config = ConfigDict(from_attributes=True)


class AcceptMatchRequest(BaseModel):
    request_id: UUID
    match_request_id: UUID

