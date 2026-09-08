import pytest
from fastapi.testclient import TestClient
from app.main import app

client = TestClient(app)

def test_health_endpoint():
    response = client.get("/api/health")
    assert response.status_code == 200
    assert response.json()["status"] == "healthy"

def test_get_farmers_api():
    response = client.get("/api/farmers")
    assert response.status_code == 200
    data = response.json()
    assert isinstance(data, list)
    assert len(data) >= 1

def test_get_dashboard_metrics_api():
    response = client.get("/api/dashboard/metrics")
    assert response.status_code == 200
    metrics = response.json()
    assert "active_farmers" in metrics
    assert "feasibility_rate" in metrics

def test_get_agronomy_rules_api():
    response = client.get("/api/agronomy-rules")
    assert response.status_code == 200
    rules = response.json()
    assert len(rules) >= 1

def test_recommendation_api():
    # Uma F024 recommendation test
    payload = {"farmer_id": "F024", "demo_mode": False}
    response = client.post("/api/recommendations", json=payload)
    assert response.status_code == 200
    rec = response.json()
    assert rec["farmer_id"] == "F024"
    assert "feasibility_status" in rec
    assert "constraints" in rec

def test_experiment_api():
    response = client.get("/api/experiments")
    assert response.status_code == 200
    exp = response.json()
    assert exp["status"] == "COMPLETED"
    assert "baseline_feasibility_rate" in exp
    assert "cropcompass_feasibility_rate" in exp
