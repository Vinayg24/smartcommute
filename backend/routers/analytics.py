from datetime import date, timedelta
import csv
import io

from fastapi import APIRouter, Depends
from fastapi.responses import StreamingResponse
from sqlalchemy import func, extract
from sqlalchemy.orm import Session, joinedload

from database import get_db
from models import TravelRequest, Office
from routers.auth import get_current_user, require_role
from schemas import DashboardStats

router = APIRouter()


@router.get("/dashboard", response_model=DashboardStats)
def get_dashboard_stats(
    db: Session = Depends(get_db),
    current_user=Depends(require_role("MANAGER", "HR", "ADMIN")),
):
    today = date.today()

    total_requests_today = (
        db.query(TravelRequest)
        .filter(TravelRequest.travel_date == today)
        .count()
    )

    active_shares = (
        db.query(TravelRequest)
        .filter(
            TravelRequest.travel_date == today,
            TravelRequest.booking_status.in_(["MATCHED", "CONFIRMED"]),
        )
        .count()
    )

    distances = (
        db.query(TravelRequest.distance_km)
        .filter(
            TravelRequest.travel_date == today,
            TravelRequest.distance_km.isnot(None),
        )
        .all()
    )

    avg_dist = (
        sum(d[0] for d in distances) / len(distances)
        if distances
        else 15.0
    )

    cost_saved = round(active_shares * avg_dist * 6, 2)
    co2_reduced = round(active_shares * avg_dist * 0.21, 2)

    hourly = []
    for hour in range(24):
        count = (
            db.query(TravelRequest)
            .filter(
                TravelRequest.travel_date == today,
                extract("hour", TravelRequest.travel_time) == hour,
            )
            .count()
        )
        hourly.append({"hour": hour, "count": count})

    office_rows = (
        db.query(
            Office.name,
            func.count(TravelRequest.id).label("count"),
        )
        .join(
            TravelRequest,
            Office.id == TravelRequest.office_id,
            isouter=True,
        )
        .filter(TravelRequest.travel_date == today)
        .group_by(Office.name)
        .all()
    )

    office_traffic = [
        {"office": row[0], "count": row[1]} for row in office_rows
    ]

    return DashboardStats(
        total_requests_today=total_requests_today,
        active_shares=active_shares,
        cost_saved_inr=cost_saved,
        co2_reduced_kg=co2_reduced,
        hourly_demand=hourly,
        office_traffic=office_traffic,
    )


@router.get("/peak-hours")
def get_peak_hours(
    db: Session = Depends(get_db),
    _current_user=Depends(get_current_user),
):
    result = []
    for i in range(7):
        day = date.today() - timedelta(days=i)
        for hour in range(24):
            count = (
                db.query(TravelRequest)
                .filter(
                    TravelRequest.travel_date == day,
                    extract("hour", TravelRequest.travel_time) == hour,
                )
                .count()
            )
            if count > 0:
                result.append(
                    {
                        "date": str(day),
                        "hour": hour,
                        "count": count,
                    }
                )
    return result


@router.get("/export/csv")
def export_csv(
    db: Session = Depends(get_db),
    _current_user=Depends(require_role("MANAGER", "HR", "ADMIN")),
):
    requests = (
        db.query(TravelRequest)
        .options(
            joinedload(TravelRequest.employee),
            joinedload(TravelRequest.office),
        )
        .all()
    )

    output = io.StringIO()
    writer = csv.writer(output)

    writer.writerow(
        [
            "Employee Name",
            "Employee ID",
            "Department",
            "From Location",
            "Office Name",
            "Office City",
            "Travel Date",
            "Travel Time",
            "Distance (km)",
            "Duration (mins)",
            "Crowd Level",
            "Status",
            "Created At",
        ]
    )

    for r in requests:
        writer.writerow(
            [
                r.employee.name if r.employee else "",
                r.employee.employee_id if r.employee else "",
                r.employee.department if r.employee else "",
                r.from_location,
                r.office.name if r.office else "",
                r.office.city if r.office else "",
                str(r.travel_date),
                str(r.travel_time),
                r.distance_km or "",
                r.duration_mins or "",
                r.crowd_level,
                r.booking_status,
                str(r.created_at),
            ]
        )

    output.seek(0)
    return StreamingResponse(
        iter([output.getvalue()]),
        media_type="text/csv",
        headers={
            "Content-Disposition": "attachment; filename=smartcommute_report.csv"
        },
    )

