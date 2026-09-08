from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.orm import Session
from typing import List, Optional
from app.database import get_db
from app.models.models import Farmer, FarmerEquipment, FarmerInput
from app.schemas.schemas import FarmerOut, FarmerCreate, FarmerUpdate
from app.utils.validators import validate_farmer_payload

router = APIRouter(prefix="/api/farmers", tags=["Farmers"])

@router.get("", response_model=List[FarmerOut])
def get_farmers(
    search: Optional[str] = None,
    crop: Optional[str] = None,
    growth_stage: Optional[str] = None,
    water_availability: Optional[str] = None,
    db: Session = Depends(get_db)
):
    query = db.query(Farmer)

    if search:
        s = f"%{search.strip()}%"
        query = query.filter(
            (Farmer.name.ilike(s)) |
            (Farmer.id.ilike(s)) |
            (Farmer.location.ilike(s)) |
            (Farmer.crop.ilike(s))
        )

    if crop:
        query = query.filter(Farmer.crop.ilike(crop))
    if growth_stage:
        query = query.filter(Farmer.growth_stage.ilike(growth_stage))
    if water_availability:
        query = query.filter(Farmer.water_availability.ilike(water_availability))

    return query.order_by(Farmer.created_at.desc()).all()


@router.post("", response_model=FarmerOut)
def create_farmer(payload: FarmerCreate, db: Session = Depends(get_db)):
    data_dict = payload.model_dump()
    errors = validate_farmer_payload(data_dict)
    if errors:
        raise HTTPException(status_code=400, detail={"errors": errors})

    existing = db.query(Farmer).filter(Farmer.id == payload.id).first()
    if existing:
        raise HTTPException(status_code=400, detail={"errors": [f"Farmer ID '{payload.id}' already exists."]})

    equip_list = payload.equipment
    inputs_list = payload.inputs

    farmer_data = payload.model_dump(exclude={"equipment", "inputs"})
    farmer = Farmer(**farmer_data)
    db.add(farmer)
    db.commit()
    db.refresh(farmer)

    for eq_name in equip_list:
        if eq_name and eq_name.strip():
            db.add(FarmerEquipment(farmer_id=farmer.id, equipment_name=eq_name.strip()))

    for inp_item in inputs_list:
        db.add(FarmerInput(
            farmer_id=farmer.id,
            input_name=inp_item.input_name,
            quantity=inp_item.quantity,
            unit=inp_item.unit
        ))

    db.commit()
    db.refresh(farmer)
    return farmer


@router.get("/{farmer_id}", response_model=FarmerOut)
def get_farmer(farmer_id: str, db: Session = Depends(get_db)):
    farmer = db.query(Farmer).filter(Farmer.id == farmer_id).first()
    if not farmer:
        raise HTTPException(status_code=404, detail="Farmer not found.")
    return farmer


@router.put("/{farmer_id}", response_model=FarmerOut)
def update_farmer(farmer_id: str, payload: FarmerUpdate, db: Session = Depends(get_db)):
    farmer = db.query(Farmer).filter(Farmer.id == farmer_id).first()
    if not farmer:
        raise HTTPException(status_code=404, detail="Farmer not found.")

    update_data = payload.model_dump(exclude_unset=True)

    # Perform validation on merged dict
    merged_dict = {
        "id": farmer.id,
        "name": update_data.get("name", farmer.name),
        "phone": update_data.get("phone", farmer.phone),
        "location": update_data.get("location", farmer.location),
        "farm_size": update_data.get("farm_size", farmer.farm_size),
        "crop": update_data.get("crop", farmer.crop),
        "variety": update_data.get("variety", farmer.variety),
        "growth_stage": update_data.get("growth_stage", farmer.growth_stage),
        "workers": update_data.get("workers", farmer.workers),
        "budget": update_data.get("budget", farmer.budget),
        "temperature": update_data.get("temperature", farmer.temperature),
        "rainfall": update_data.get("rainfall", farmer.rainfall),
        "humidity": update_data.get("humidity", farmer.humidity),
    }

    errors = validate_farmer_payload(merged_dict)
    if errors:
        raise HTTPException(status_code=400, detail={"errors": errors})

    if "equipment" in update_data:
        db.query(FarmerEquipment).filter(FarmerEquipment.farmer_id == farmer_id).delete()
        for eq_name in update_data.pop("equipment"):
            if eq_name and eq_name.strip():
                db.add(FarmerEquipment(farmer_id=farmer_id, equipment_name=eq_name.strip()))

    if "inputs" in update_data:
        db.query(FarmerInput).filter(FarmerInput.farmer_id == farmer_id).delete()
        for inp_item in update_data.pop("inputs"):
            db.add(FarmerInput(
                farmer_id=farmer_id,
                input_name=inp_item["input_name"],
                quantity=inp_item.get("quantity", 0.0),
                unit=inp_item.get("unit", "kg")
            ))

    for k, v in update_data.items():
        setattr(farmer, k, v)

    db.commit()
    db.refresh(farmer)
    return farmer


@router.delete("/{farmer_id}")
def delete_farmer(farmer_id: str, db: Session = Depends(get_db)):
    farmer = db.query(Farmer).filter(Farmer.id == farmer_id).first()
    if not farmer:
        raise HTTPException(status_code=404, detail="Farmer not found.")

    db.delete(farmer)
    db.commit()
    return {"message": f"Farmer '{farmer_id}' deleted successfully."}


@router.post("/validate")
def validate_farmer(payload: dict):
    errors = validate_farmer_payload(payload)
    return {"valid": len(errors) == 0, "errors": errors}
