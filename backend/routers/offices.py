from datetime import datetime
from typing import List

from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session

from database import get_db
from models import Office
from routers.auth import get_current_user
from schemas import OfficeResponse, OfficeCrowdResponse
from services.crowd_service import get_crowd_level

router = APIRouter()


@router.get("/", response_model=List[OfficeResponse])
def list_offices(
    db: Session = Depends(get_db),
    _current_user=Depends(get_current_user),
):
    offices = db.query(Office).all()
    return offices


@router.get("/{office_id}", response_model=OfficeResponse)
def get_office(
    office_id: str,
    db: Session = Depends(get_db),
    _current_user=Depends(get_current_user),
):
    office = db.query(Office).filter(Office.id == office_id).first()
    if not office:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Office not found")
    return office


@router.get("/{office_id}/crowd", response_model=OfficeCrowdResponse)
def office_crowd(
    office_id: str,
    db: Session = Depends(get_db),
    _current_user=Depends(get_current_user),
):
    office = db.query(Office).filter(Office.id == office_id).first()
    if not office:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Office not found")

    crowd = get_crowd_level(office_id, datetime.now(), db)
    return crowd

