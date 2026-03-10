from typing import List
import uuid

from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from database import get_db
from models import TravelRequest, SharingGroup
from routers.auth import get_current_user
from schemas import MatchResponse, AcceptMatchRequest
from services.matching_service import find_matches
from ws.connection_manager import manager

router = APIRouter()


@router.get("/find/{request_id}", response_model=MatchResponse)
def find_ride_matches(
    request_id: str,
    db: Session = Depends(get_db),
    current_user=Depends(get_current_user),
):
    request = db.query(TravelRequest).filter(TravelRequest.id == request_id).first()
    if not request:
        raise HTTPException(status_code=404, detail="Request not found")

    if str(request.employee_id) != str(current_user.id) and current_user.role != "ADMIN":
        raise HTTPException(status_code=403, detail="Not authorized")

    matches = find_matches(request_id, db)
    return MatchResponse(
        matches=matches,
        total_found=len(matches),
        request_id=uuid.UUID(request_id),
    )


@router.get("/groups")
def get_sharing_groups(
    db: Session = Depends(get_db),
    current_user=Depends(get_current_user),
):
    query = db.query(SharingGroup)

    if current_user.role == "EMPLOYEE":
        all_groups: List[SharingGroup] = query.all()
        my_groups: List[SharingGroup] = []
        for group in all_groups:
            members = group.member_request_ids or []
            if not members:
                continue
            requests = (
                db.query(TravelRequest)
                .filter(TravelRequest.id.in_(members))
                .all()
            )
            employee_ids = [str(r.employee_id) for r in requests]
            if str(current_user.id) in employee_ids:
                my_groups.append(group)
        return my_groups

    return (
        query.order_by(SharingGroup.created_at.desc())
        .limit(50)
        .all()
    )


@router.post("/accept")
async def accept_match(
    body: AcceptMatchRequest,
    db: Session = Depends(get_db),
    current_user=Depends(get_current_user),
):
    my_request = (
        db.query(TravelRequest)
        .filter(TravelRequest.id == str(body.request_id))
        .first()
    )
    if not my_request:
        raise HTTPException(status_code=404, detail="Your request not found")

    match_request = (
        db.query(TravelRequest)
        .filter(TravelRequest.id == str(body.match_request_id))
        .first()
    )
    if not match_request:
        raise HTTPException(status_code=404, detail="Match request not found")

    my_request.booking_status = "CONFIRMED"
    match_request.booking_status = "CONFIRMED"
    db.commit()

    group = (
        db.query(SharingGroup)
        .filter(SharingGroup.status == "FORMING")
        .first()
    )
    if group:
        group.status = "CONFIRMED"
        db.commit()

    await manager.send_to_user(
        str(match_request.employee_id),
        {
            "type": "match_accepted",
            "message": "🎉 Your ride share is confirmed!",
            "data": {
                "office": str(my_request.office_id),
                "travel_time": str(my_request.travel_time),
                "matched_with": current_user.name,
            },
        },
    )

    return {
        "message": "Match accepted! Ride confirmed ✅",
        "status": "CONFIRMED",
    }


@router.post("/decline")
async def decline_match(
    body: AcceptMatchRequest,
    db: Session = Depends(get_db),
    current_user=Depends(get_current_user),
):
    request = (
        db.query(TravelRequest)
        .filter(TravelRequest.id == str(body.request_id))
        .first()
    )
    if not request:
        raise HTTPException(status_code=404, detail="Request not found")

    request.booking_status = "PENDING"
    request.matched_with = None
    db.commit()

    await manager.send_to_user(
        str(body.match_request_id),
        {
            "type": "match_declined",
            "message": "Ride share was declined",
            "data": {},
        },
    )

    return {"message": "Match declined"}

