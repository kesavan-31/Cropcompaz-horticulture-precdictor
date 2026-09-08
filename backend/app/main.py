from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.database import engine, Base, SessionLocal
from app.routes import farmers, recommendations, rules, dashboard, experiments
from app.utils.seed_data import seed_database

# Create SQLite DB tables
Base.metadata.create_all(bind=engine)

app = FastAPI(
    title="CropCompass API",
    description="Resource-Aware Horticulture Advisory Assistant API",
    version="1.0.0"
)

# Configure CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Seed database on startup if empty
db = SessionLocal()
try:
    seed_database(db)
finally:
    db.close()

# Mount API Routers
app.include_router(farmers.router)
app.include_router(recommendations.router)
app.include_router(rules.router)
app.include_router(dashboard.router)
app.include_router(experiments.router)

@app.get("/api/health")
def health_check():
    return {
        "status": "healthy",
        "service": "CropCompass API",
        "version": "1.0.0"
    }
