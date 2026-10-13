from fastapi.testclient import TestClient
import sys
import os

sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from main import app

client = TestClient(app)

def test_get_profiles():
    """Test retrieving all available user profiles."""
    response = client.get("/api/v1/profiles/")
    
    assert response.status_code == 200
    data = response.json()
    
    assert "active_profile_id" in data
    assert "profiles" in data
    assert isinstance(data["profiles"], list)
    assert len(data["profiles"]) >= 2


def test_get_profile_by_id_success():
    """Test retrieving a specific valid profile."""
    response = client.get("/api/v1/profiles/p1")
    
    assert response.status_code == 200
    data = response.json()
    
    assert data["id"] == "p1"
    assert "name" in data
    assert "accessibility_mode" in data


def test_get_profile_by_id_not_found():
    """Test retrieving a non-existent profile returns 404."""
    response = client.get("/api/v1/profiles/invalid_id_999")
    
    assert response.status_code == 404
    assert response.json()["detail"] == "Profile not found"