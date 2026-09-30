import pytest
from fastapi.testclient import TestClient
from app.main import app

client = TestClient(app)

def test_farmer_login_success():
    """Verify farmer account login succeeds and returns valid session token."""
    response = client.post("/api/auth/farmer/login", json={
        "identifier": "farmer1@example.com",
        "password": "FarmerPassword123!"
    })
    assert response.status_code == 200
    data = response.json()
    assert "token" in data
    assert data["farmer_id"] == "F024"
    assert data["email"] == "farmer1@example.com"

def test_farmer_phone_login_success():
    """Verify farmer login via phone number succeeds."""
    response = client.post("/api/auth/farmer/login", json={
        "identifier": "9876543210",
        "password": "FarmerPassword123!"
    })
    assert response.status_code == 200
    data = response.json()
    assert "token" in data
    assert data["farmer_id"] == "F024"

def test_buyer_login_success():
    """Verify buyer account login succeeds."""
    response = client.post("/api/auth/buyer/login", json={
        "identifier": "buyer1@example.com",
        "password": "BuyerPassword123!"
    })
    assert response.status_code == 200
    data = response.json()
    assert "token" in data
    assert data["buyer_id"] == "B001"

def test_wrong_password_fails():
    """Verify wrong password returns generic 401 error."""
    response = client.post("/api/auth/farmer/login", json={
        "identifier": "farmer1@example.com",
        "password": "WrongPassword!"
    })
    assert response.status_code == 401
    assert response.json()["detail"] == "Unable to sign in with these credentials."

def test_farmer_cannot_login_as_buyer():
    """Verify farmer credentials sent to buyer login are rejected with generic 401."""
    response = client.post("/api/auth/buyer/login", json={
        "identifier": "farmer1@example.com",
        "password": "FarmerPassword123!"
    })
    assert response.status_code == 401
    assert response.json()["detail"] == "Unable to sign in with these credentials."

def test_buyer_cannot_login_as_farmer():
    """Verify buyer credentials sent to farmer login are rejected with generic 401."""
    response = client.post("/api/auth/farmer/login", json={
        "identifier": "buyer1@example.com",
        "password": "BuyerPassword123!"
    })
    assert response.status_code == 401
    assert response.json()["detail"] == "Unable to sign in with these credentials."

def test_unauthenticated_protected_endpoint_rejected():
    """Verify unauthenticated requests to protected endpoints return 401."""
    response = client.get("/api/farmer-portal/profile")
    assert response.status_code == 401

    response = client.get("/api/buyer-portal/profile")
    assert response.status_code == 401

def test_farmer_portal_data_isolation():
    """Verify farmer token retrieves isolated farmer data and cannot access buyer portal."""
    # Login farmer
    login_resp = client.post("/api/auth/farmer/login", json={
        "identifier": "farmer1@example.com",
        "password": "FarmerPassword123!"
    })
    token = login_resp.json()["token"]
    headers = {"Authorization": f"Bearer {token}"}

    # Access farmer profile
    farm_resp = client.get("/api/farmer-portal/profile", headers=headers)
    assert farm_resp.status_code == 200
    assert farm_resp.json()["id"] == "F024"

    # Attempt to access buyer portal with farmer token -> Forbidden 403
    buyer_resp = client.get("/api/buyer-portal/profile", headers=headers)
    assert buyer_resp.status_code == 403

def test_buyer_portal_data_isolation():
    """Verify buyer token retrieves buyer requirements and cannot access farmer portal."""
    # Login buyer
    login_resp = client.post("/api/auth/buyer/login", json={
        "identifier": "buyer1@example.com",
        "password": "BuyerPassword123!"
    })
    token = login_resp.json()["token"]
    headers = {"Authorization": f"Bearer {token}"}

    # Access buyer requirements
    req_resp = client.get("/api/buyer-portal/requirements", headers=headers)
    assert req_resp.status_code == 200

    # Attempt to access farmer portal with buyer token -> Forbidden 403
    farm_resp = client.get("/api/farmer-portal/profile", headers=headers)
    assert farm_resp.status_code == 403

def test_logout():
    """Verify logout invalidates the session token."""
    login_resp = client.post("/api/auth/farmer/login", json={
        "identifier": "farmer1@example.com",
        "password": "FarmerPassword123!"
    })
    token = login_resp.json()["token"]
    headers = {"Authorization": f"Bearer {token}"}

    # Logout
    logout_resp = client.post("/api/auth/logout", headers=headers)
    assert logout_resp.status_code == 200

    # Subsequent request with invalidated token returns 401
    subsequent_resp = client.get("/api/farmer-portal/profile", headers=headers)
    assert subsequent_resp.status_code == 401

def test_farmer_registration():
    """Verify new farmer can register and immediately gets a valid session."""
    reg_resp = client.post("/api/auth/farmer/register", json={
        "name": "Arun Kumar",
        "phone": "9123456780",
        "location": "Salem, Tamil Nadu",
        "farm_size": 3.5,
        "crop": "Tomato",
        "variety": "Hybrid",
        "growth_stage": "Flowering",
        "workers": 2,
        "budget": 6000.0,
        "water_availability": "Adequate",
        "password": "NewFarmerPass123!"
    })
    assert reg_resp.status_code == 200
    data = reg_resp.json()
    assert "token" in data
    assert data["farmer_id"] is not None

    # Test login with new credentials
    login_resp = client.post("/api/auth/farmer/login", json={
        "identifier": "9123456780",
        "password": "NewFarmerPass123!"
    })
    assert login_resp.status_code == 200

def test_buyer_registration():
    """Verify new buyer can register and immediately gets a valid session."""
    reg_resp = client.post("/api/auth/buyer/register", json={
        "name": "Coimbatore Agro Traders",
        "phone": "9123456781",
        "email": "traders@coimbatoreagro.com",
        "buyer_type": "Wholesale",
        "market": "Coimbatore APMC",
        "location": "Coimbatore, Tamil Nadu",
        "required_crops": ["Tomato", "Onion"],
        "password": "NewBuyerPass123!"
    })
    assert reg_resp.status_code == 200
    data = reg_resp.json()
    assert "token" in data
    assert data["buyer_id"] is not None

    # Test login with new buyer credentials
    login_resp = client.post("/api/auth/buyer/login", json={
        "identifier": "9123456781",
        "password": "NewBuyerPass123!"
    })
    assert login_resp.status_code == 200

