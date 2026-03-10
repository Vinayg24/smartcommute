from datetime import datetime, timedelta
from math import radians, sin, cos, sqrt, asin

from sqlalchemy.orm import Session

from models import TravelRequest, SharingGroup, Employee, Office


def haversine(lat1, lon1, lat2, lon2) -> float:
    R = 6371
    phi1, phi2 = radians(lat1), radians(lat2)
    dphi = radians(lat2 - lat1)
    dl = radians(lon2 - lon1)
    a = sin(dphi / 2) ** 2 + cos(phi1) * cos(phi2) * sin(dl / 2) ** 2
    return round(2 * R * asin(sqrt(a)), 2)


def find_matches(request_id, db: Session) -> list[dict]:
    current: TravelRequest | None = db.get(TravelRequest, request_id)
    if not current:
        return []

    window_start = (datetime.combine(current.travel_date, current.travel_time) - timedelta(minutes=30)).time()
    window_end = (datetime.combine(current.travel_date, current.travel_time) + timedelta(minutes=30)).time()

    candidates = (
        db.query(TravelRequest)
        .filter(
            TravelRequest.office_id == current.office_id,
            TravelRequest.travel_date == current.travel_date,
            TravelRequest.travel_time >= window_start,
            TravelRequest.travel_time <= window_end,
            TravelRequest.booking_status.in_(["PENDING", "MATCHED"]),
            TravelRequest.employee_id != current.employee_id,
        )
        .all()
    )

    matches: list[tuple[TravelRequest, float]] = []
    for cand in candidates:
        dist = haversine(current.from_lat, current.from_lng, cand.from_lat, cand.from_lng)
        if dist <= 3:
            matches.append((cand, dist))

    matches.sort(key=lambda x: x[1])
    top = matches[:3]

    if not top:
        return []

    from datetime import datetime as _dt

    group_member_ids = [str(current.id)] + [str(m[0].id) for m in top]
    sharing = SharingGroup(
        office_id=current.office_id,
        travel_time=_dt.combine(current.travel_date, current.travel_time),
        member_request_ids=group_member_ids,
        optimal_route=None,
        total_distance_km=sum(m[1] for m in top),
    )
    db.add(sharing)

    for cand, _ in top:
        cand.booking_status = "MATCHED"

    current.booking_status = "MATCHED"
    db.commit()
    db.refresh(current)

    results: list[dict] = []
    for cand, dist in top:
        emp: Employee = cand.employee
        results.append(
            {
                "employee_id": str(emp.id),
                "employee_name": emp.name,
                "employee_department": emp.department,
                "from_location": cand.from_location,
                "from_lat": cand.from_lat,
                "from_lng": cand.from_lng,
                "distance_between_km": dist,
                "travel_time": cand.travel_time.strftime("%H:%M"),
                "request_id": str(cand.id),
            }
        )

    return results

