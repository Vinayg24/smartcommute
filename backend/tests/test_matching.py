from services.matching_service import haversine


def test_haversine_delhi_gurugram():
    dist = haversine(28.6315, 77.2167, 28.4950, 77.0890)
    assert 25 <= dist <= 35


def test_haversine_same_location():
    dist = haversine(28.6315, 77.2167, 28.6315, 77.2167)
    assert dist == 0.0


def test_haversine_nearby():
    dist = haversine(28.6315, 77.2167, 28.6400, 77.2250)
    assert dist < 3.0


def test_haversine_far():
    dist = haversine(28.6315, 77.2167, 19.0596, 72.8656)
    assert dist > 1000

