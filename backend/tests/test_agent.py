from fastapi.testclient import TestClient
import sys
import os

# Ensure backend root is in sys path for relative imports
sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from main import app

client = TestClient(app)

def test_ask_nexa_agent_with_time_constraint():
    """Test submitting an agent prompt with a 15-minute constraint."""
    payload = {
        "prompt": "I only have 15 minutes before my next meeting.",
        "user_id": "test_user_1",
        "time_constraint_minutes": 15
    }
    
    response = client.post("/api/v1/agent/ask", json=payload)
    
    assert response.status_code == 200
    data = response.json()
    
    assert "status" in data
    assert "updated_plan" in data
    assert "execution_time_ms" in data
    
    # Verify that plan adaptation happened successfully in-memory
    assert isinstance(data["updated_plan"], list)
    assert len(data["updated_plan"]) > 0
    
    # Check that execution time is fast (under 2000ms including test client overhead)
    assert data["execution_time_ms"] < 2000.0


def test_ask_nexa_agent_default_constraint():
    """Test submitting an agent prompt without an explicit time constraint."""
    payload = {
        "prompt": "Set up my evening relaxation routine.",
        "user_id": "test_user_2"
    }
    
    response = client.post("/api/v1/agent/ask", json=payload)
    
    assert response.status_code == 200
    data = response.json()
    assert data["status"] == "Plan successfully adapted in-memory"
    assert len(data["updated_plan"]) > 0