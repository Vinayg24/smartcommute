import os

import httpx

from services.matching_service import haversine
from services.redis_service import get_cache, set_cache


async def get_distance(origin_lat, origin_lng, dest_lat, dest_lng) -> dict:
    key = f"dist:{origin_lat:.4f}:{origin_lng:.4f}:{dest_lat:.4f}:{dest_lng:.4f}"

    cached = get_cache(key)
    if cached:
        return cached

    api_key = os.getenv("GOOGLE_MAPS_API_KEY")

    if api_key and api_key != "optional-add-later":
        url = "https://maps.googleapis.com/maps/api/distancematrix/json"
        params = {
            "origins": f"{origin_lat},{origin_lng}",
            "destinations": f"{dest_lat},{dest_lng}",
            "key": api_key,
        }
        async with httpx.AsyncClient() as client:
            response = await client.get(url, params=params)
            data = response.json()
            element = data["rows"][0]["elements"][0]
            result = {
                "distance_km": element["distance"]["value"] / 1000,
                "duration_mins": element["duration"]["value"] // 60,
                "distance_text": element["distance"]["text"],
                "duration_text": element["duration"]["text"],
            }
    else:
        straight = haversine(origin_lat, origin_lng, dest_lat, dest_lng)
        road_distance = round(straight * 1.3, 2)
        duration = round((road_distance / 40) * 60)
        result = {
            "distance_km": road_distance,
            "duration_mins": duration,
            "distance_text": f"{road_distance} km",
            "duration_text": f"{duration} mins",
        }

    set_cache(key, result, ttl=86400)
    return result

