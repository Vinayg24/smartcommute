import uuid
from datetime import datetime

from sqlalchemy import (
    Boolean,
    Column,
    Date,
    DateTime,
    Enum,
    Float,
    ForeignKey,
    Integer,
    String,
    Text,
    Time,
    JSON,
)
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.orm import relationship

from database import Base


employee_department_enum = Enum(
    "Engineering",
    "HR",
    "Sales",
    "Operations",
    "Finance",
    name="employee_department_enum",
)

employee_role_enum = Enum(
    "EMPLOYEE",
    "MANAGER",
    "HR",
    "ADMIN",
    name="employee_role_enum",
)

crowd_level_enum = Enum(
    "LOW",
    "MEDIUM",
    "HIGH",
    name="crowd_level_enum",
)

booking_status_enum = Enum(
    "PENDING",
    "MATCHED",
    "CONFIRMED",
    "IN_TRANSIT",
    "COMPLETED",
    "CANCELLED",
    name="booking_status_enum",
)

sharing_group_status_enum = Enum(
    "FORMING",
    "CONFIRMED",
    "COMPLETED",
    name="sharing_group_status_enum",
)


class Employee(Base):
    __tablename__ = "employees"

    id = Column(
        UUID(as_uuid=True),
        primary_key=True,
        default=uuid.uuid4,
    )
    name = Column(String(100), nullable=False)
    employee_id = Column(String(20), unique=True, nullable=False)
    email = Column(String(100), unique=True, nullable=False, index=True)
    phone = Column(String(15))
    department = Column(employee_department_enum, nullable=True)
    role = Column(employee_role_enum, nullable=False, default="EMPLOYEE")
    hashed_password = Column(String(255), nullable=False)
    is_active = Column(Boolean, default=True, nullable=False)
    created_at = Column(DateTime, default=datetime.utcnow, nullable=False)

    travel_requests = relationship("TravelRequest", back_populates="employee")
    notifications = relationship("Notification", back_populates="user")


class Office(Base):
    __tablename__ = "offices"

    id = Column(
        UUID(as_uuid=True),
        primary_key=True,
        default=uuid.uuid4,
    )
    name = Column(String(100), nullable=False)
    address = Column(Text, nullable=False)
    city = Column(String(50))
    latitude = Column(Float, nullable=False)
    longitude = Column(Float, nullable=False)
    phone = Column(String(15))
    email = Column(String(100))
    capacity = Column(Integer, default=100, nullable=False)
    created_at = Column(DateTime, default=datetime.utcnow, nullable=False)

    travel_requests = relationship("TravelRequest", back_populates="office")
    sharing_groups = relationship("SharingGroup", back_populates="office")


class TravelRequest(Base):
    __tablename__ = "travel_requests"

    id = Column(
        UUID(as_uuid=True),
        primary_key=True,
        default=uuid.uuid4,
    )
    employee_id = Column(
        UUID(as_uuid=True),
        ForeignKey("employees.id"),
        nullable=False,
    )
    office_id = Column(
        UUID(as_uuid=True),
        ForeignKey("offices.id"),
        nullable=False,
    )
    from_location = Column(String(255), nullable=False)
    from_lat = Column(Float, nullable=False)
    from_lng = Column(Float, nullable=False)
    travel_date = Column(Date, nullable=False)
    travel_time = Column(Time, nullable=False)
    distance_km = Column(Float, nullable=True)
    duration_mins = Column(Integer, nullable=True)
    crowd_level = Column(
        crowd_level_enum,
        nullable=False,
        default="LOW",
    )
    booking_status = Column(
        booking_status_enum,
        nullable=False,
        default="PENDING",
    )
    matched_with = Column(JSON, nullable=True)
    purpose = Column(Text, nullable=True)
    created_at = Column(DateTime, default=datetime.utcnow, nullable=False)
    updated_at = Column(
        DateTime,
        default=datetime.utcnow,
        onupdate=datetime.utcnow,
        nullable=False,
    )

    employee = relationship("Employee", back_populates="travel_requests")
    office = relationship("Office", back_populates="travel_requests")


class SharingGroup(Base):
    __tablename__ = "sharing_groups"

    id = Column(
        UUID(as_uuid=True),
        primary_key=True,
        default=uuid.uuid4,
    )
    office_id = Column(
        UUID(as_uuid=True),
        ForeignKey("offices.id"),
        nullable=False,
    )
    travel_time = Column(DateTime, nullable=False)
    member_request_ids = Column(JSON, nullable=False)
    optimal_route = Column(JSON, nullable=True)
    total_distance_km = Column(Float, nullable=True)
    status = Column(
        sharing_group_status_enum,
        nullable=False,
        default="FORMING",
    )
    created_at = Column(DateTime, default=datetime.utcnow, nullable=False)

    office = relationship("Office", back_populates="sharing_groups")


class Notification(Base):
    __tablename__ = "notifications"

    id = Column(
        UUID(as_uuid=True),
        primary_key=True,
        default=uuid.uuid4,
    )
    user_id = Column(
        UUID(as_uuid=True),
        ForeignKey("employees.id"),
        nullable=False,
    )
    type = Column(String(50), nullable=False)
    message = Column(Text, nullable=False)
    is_read = Column(Boolean, default=False, nullable=False)
    related_id = Column(UUID(as_uuid=True), nullable=True)
    created_at = Column(DateTime, default=datetime.utcnow, nullable=False)

    user = relationship("Employee", back_populates="notifications")

