import json
import os

import redis

redis_client = redis.from_url(os.getenv("REDIS_URL", "redis://localhost:6379"))


def get_cache(key: str):
    try:
        val = redis_client.get(key)
        return json.loads(val) if val else None
    except Exception:
        return None


def set_cache(key: str, value, ttl: int = 300):
    try:
        redis_client.setex(key, ttl, json.dumps(value))
    except Exception:
        pass


def delete_cache(key: str):
    try:
        redis_client.delete(key)
    except Exception:
        pass

