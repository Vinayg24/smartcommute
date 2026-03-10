from datetime import date
from typing import Optional, List
import uuid

from fastapi import (
    APIRouter,
    BackgroundTasks,
    Depends,
    HTTPException,
    Query,
)
from sqlalchemy.orm import Session, joinedload

from database import get_db
from models import TravelRequest, Office
from routers.auth import get_current_user
from schemas import TravelRequestCreate, TravelRequestResponse, DistanceResponse
from services.crowd_service import get_crowd_level
from services.maps_service import get_distance
from services.matching_service import find_matches

router = APIRouter()


@router.post("/submit", response_model=TravelRequestResponse)
async def submit_travel_request(
    body: TravelRequestCreate,
    background_tasks: BackgroundTasks,
    db: Session = Depends(get_db),
    current_user=Depends(get_current_user),
):
    office = db.query(Office).filter(Office.id == body.office_id).first()
    if not office:
        raise HTTPException(status_code=404, detail="Office not found")

    distance_data = await get_distance(
        body.from_lat,
        body.from_lng,
        office.latitude,
        office.longitude,
    )

    crowd = get_crowd_level(str(body.office_id), body.travel_time, db)

    request = TravelRequest(
        id=uuid.uuid4(),
        employee_id=current_user.id,
        office_id=body.office_id,
        from_location=body.from_location,
        from_lat=body.from_lat,
        from_lng=body.from_lng,
        travel_date=body.travel_date,
        travel_time=body.travel_time,
        distance_km=distance_data["distance_km"],
        duration_mins=distance_data["duration_mins"],
        crowd_level=crowd.level,
        booking_status="PENDING",
        purpose=body.purpose,
    )

    db.add(request)
    db.commit()
    db.refresh(request)

    background_tasks.add_task(find_matches, str(request.id), db)

    return request


@router.get("/all", response_model=List[TravelRequestResponse])
def get_all_requests(
    office_id: Optional[str] = Query(None),
    travel_date: Optional[date] = Query(None),
    status: Optional[str] = Query(None),
    page: int = Query(1, ge=1),
    limit: int = Query(20, le=100),
    db: Session = Depends(get_db),
    current_user=Depends(get_current_user),
):
    query = db.query(TravelRequest).options(
        joinedload(TravelRequest.employee),
        joinedload(TravelRequest.office),
    )

    if current_user.role == "EMPLOYEE":
        query = query.filter(TravelRequest.employee_id == current_user.id)

    if office_id:
        query = query.filter(TravelRequest.office_id == office_id)
    if travel_date:
        query = query.filter(TravelRequest.travel_date == travel_date)
    if status:
        query = query.filter(TravelRequest.booking_status == status)

    offset = (page - 1) * limit
    return (
        query.order_by(TravelRequest.created_at.desc())
        .offset(offset)
        .limit(limit)
        .all()
    )


@router.get("/mine", response_model=List[TravelRequestResponse])
def get_my_requests(
    db: Session = Depends(get_db),
    current_user=Depends(get_current_user),
):
    return (
        db.query(TravelRequest)
        .options(
            joinedload(TravelRequest.employee),
            joinedload(TravelRequest.office),
        )
        .filter(TravelRequest.employee_id == current_user.id)
        .order_by(TravelRequest.created_at.desc())
        .all()
    )


@router.get("/distance", response_model=DistanceResponse)
async def calculate_distance(
    origin_lat: float = Query(...),
    origin_lng: float = Query(...),
    dest_lat: float = Query(...),
    dest_lng: float = Query(...),
    _current_user=Depends(get_current_user),
):
    result = await get_distance(origin_lat, origin_lng, dest_lat, dest_lng)
    return result


@router.put("/{request_id}/status", response_model=TravelRequestResponse)
def update_status(
    request_id: str,
    status: str,
    db: Session = Depends(get_db),
    current_user=Depends(get_current_user),
):
    request = db.query(TravelRequest).filter(TravelRequest.id == request_id).first()
    if not request:
        raise HTTPException(status_code=404, detail="Request not found")

    if str(request.employee_id) != str(current_user.id) and current_user.role not in [
        "ADMIN",
        "MANAGER",
    ]:
        raise HTTPException(status_code=403, detail="Not authorized")

    request.booking_status = status
    db.commit()
    db.refresh(request)
    return request


@router.delete("/{request_id}")
def cancel_request(
    request_id: str,
    db: Session = Depends(get_db),
    current_user=Depends(get_current_user),
):
    request = db.query(TravelRequest).filter(TravelRequest.id == request_id).first()
    if not request:
        raise HTTPException(status_code=404, detail="Request not found")

    if str(request.employee_id) != str(current_user.id) and current_user.role != "ADMIN":
        raise HTTPException(status_code=403, detail="Not authorized")

    request.booking_status = "CANCELLED"
    db.commit()
    return {"message": "Request cancelled successfully"}

