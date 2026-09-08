import re
from typing import Dict, Any, List

def validate_phone(phone: str) -> bool:
    """Validates Indian phone number format."""
    clean = re.sub(r'[\s\-]', '', phone)
    pattern = r'^(\+91|91)?[6-9]\d{9}$'
    return bool(re.match(pattern, clean))

def validate_farmer_payload(data: Dict[str, Any]) -> List[str]:
    """Validates farmer form data and returns list of clear error messages."""
    errors = []

    # ID validation
    farmer_id = data.get("id")
    if not farmer_id or not str(farmer_id).strip():
        errors.append("Farmer ID is required.")

    # Name validation
    name = data.get("name")
    if not name or not str(name).strip():
        errors.append("Name is required.")
    elif len(str(name).strip()) < 2:
        errors.append("Name must be at least 2 characters long.")
    elif str(name).strip().isdigit():
        errors.append("Name cannot contain only numbers.")

    # Phone validation
    phone = data.get("phone")
    if not phone or not str(phone).strip():
        errors.append("Phone number is required.")
    elif not validate_phone(str(phone).strip()):
        errors.append("Please enter a valid 10-digit Indian phone number.")

    # Location validation
    location = data.get("location")
    if not location or not str(location).strip():
        errors.append("Location is required.")

    # Farm size validation
    farm_size = data.get("farm_size")
    if farm_size is None:
        errors.append("Farm size is required.")
    else:
        try:
            fs_val = float(farm_size)
            if fs_val <= 0:
                errors.append("Farm size must be greater than 0.")
            elif fs_val > 1000:
                errors.append("Farm size exceeds maximum limit of 1000 acres.")
        except (ValueError, TypeError):
            errors.append("Farm size must be a valid number.")

    # Crop & Growth Stage
    crop = data.get("crop")
    if not crop or not str(crop).strip():
        errors.append("Crop is required.")

    growth_stage = data.get("growth_stage")
    if not growth_stage or not str(growth_stage).strip():
        errors.append("Growth stage is required.")

    # Workers
    workers = data.get("workers")
    if workers is not None:
        try:
            w_val = int(workers)
            if w_val < 0:
                errors.append("Available workers cannot be negative.")
        except (ValueError, TypeError):
            errors.append("Available workers must be a valid integer.")

    # Budget
    budget = data.get("budget")
    if budget is None:
        errors.append("Budget is required.")
    else:
        try:
            b_val = float(budget)
            if b_val < 0:
                errors.append("Budget cannot be negative.")
        except (ValueError, TypeError):
            errors.append("Budget must be a valid number.")

    # Temperature validation
    temp = data.get("temperature")
    if temp is not None and temp != "":
        try:
            t_val = float(temp)
            if t_val < -10.0 or t_val > 60.0:
                errors.append(f"Temperature of {t_val}°C is outside realistic agricultural range (-10°C to 60°C).")
        except (ValueError, TypeError):
            errors.append("Temperature must be a valid number.")

    # Rainfall validation
    rainfall = data.get("rainfall")
    if rainfall is not None and rainfall != "":
        try:
            r_val = float(rainfall)
            if r_val < 0:
                errors.append("Rainfall cannot be negative.")
        except (ValueError, TypeError):
            errors.append("Rainfall must be a valid number.")

    # Humidity validation
    humidity = data.get("humidity")
    if humidity is not None and humidity != "":
        try:
            h_val = float(humidity)
            if h_val < 0.0 or h_val > 100.0:
                errors.append("Humidity must be between 0 and 100%.")
        except (ValueError, TypeError):
            errors.append("Humidity must be a valid number.")

    return errors
