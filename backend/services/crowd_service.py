from datetime import datetime, timedelta, date as date_cls

from sqlalchemy.orm import Session

from models import TravelRequest
from schemas import OfficeCrowdResponse
from services.redis_service import get_cache, set_cache


def _bucket_to_level(count: int) -> tuple[str, str, int]:
    if count <= 5:
        return "LOW", "green", 20
    if count <= 15:
        return "MEDIUM", "yellow", 60
    return "HIGH", "red", 90


def get_crowd_level(office_id, travel_time, db: Session) -> OfficeCrowdResponse:
    if isinstance(travel_time, datetime):
        ref_dt = travel_time
    else:
        today = date_cls.today()
        ref_dt = datetime.combine(today, travel_time)

    hour_key = ref_dt.strftime("%Y%m%d%H")
    cache_key = f"crowd:{office_id}:{hour_key}"

    cached = get_cache(cache_key)
    if cached:
        return OfficeCrowdResponse(**cached)

    start = ref_dt - timedelta(hours=1)
    end = ref_dt + timedelta(hours=1)

    today = ref_dt.date()
    q = (
        db.query(TravelRequest)
        .filter(
            TravelRequest.office_id == office_id,
            TravelRequest.travel_date == today,
            TravelRequest.travel_time >= start.time(),
            TravelRequest.travel_time <= end.time(),
        )
        .count()
    )

    level, color, percentage = _bucket_to_level(q)

    result = {
        "office_id": office_id,
        "level": level,
        "color": color,
        "count": q,
        "percentage": percentage,
    }

    set_cache(cache_key, result, ttl=900)
    return OfficeCrowdResponse(**result)

