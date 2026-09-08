from app.utils.validators import validate_farmer_payload, validate_phone

def test_phone_validation():
    assert validate_phone("+919876543210") is True
    assert validate_phone("9876543210") is True
    assert validate_phone("12345") is False
    assert validate_phone("abcd123456") is False

def test_farmer_payload_validation():
    valid_payload = {
        "id": "F999",
        "name": "Test Farmer",
        "phone": "+91 98765 43210",
        "location": "Coimbatore",
        "farm_size": 2.5,
        "crop": "Tomato",
        "growth_stage": "Flowering",
        "workers": 2,
        "budget": 5000.0,
        "temperature": 30.0,
        "rainfall": 10.0,
        "humidity": 65.0
    }
    errors = validate_farmer_payload(valid_payload)
    assert len(errors) == 0

def test_invalid_farmer_payload():
    invalid_payload = {
        "id": "",
        "name": "12345",  # numbers only
        "phone": "invalid",
        "location": "",
        "farm_size": -5.0,  # negative size
        "crop": "",
        "growth_stage": "",
        "workers": -1,
        "budget": -100,
        "temperature": 200.0,  # 200°C invalid
        "rainfall": -50.0,     # negative
        "humidity": 150.0      # >100%
    }
    errors = validate_farmer_payload(invalid_payload)
    assert len(errors) >= 8
    assert any("phone" in e.lower() for e in errors)
    assert any("farm size must be greater than 0" in e.lower() for e in errors)
    assert any("budget cannot be negative" in e.lower() for e in errors)
    assert any("200" in e for e in errors)
    assert any("rainfall cannot be negative" in e.lower() for e in errors)
    assert any("humidity must be between 0 and 100%" in e.lower() for e in errors)
