from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.core.config import settings
from app.api.v1.api import api_router
from app.db.session import engine, SessionLocal
from app.db.base import Base
from app.db.init_data import init_db
from prometheus_fastapi_instrumentator import Instrumentator

# Create database tables
Base.metadata.create_all(bind=engine)

# Initialize database with sample data
db = SessionLocal()
#init_db(db)
db.close()

app = FastAPI(
    title="GeoInsights API",
    description="API for geographic data visualization and analysis",
    version="1.0.0",
    # Disable automatic redirects
    #redirect_slashes=False
)

# Configure CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173", "http://127.0.0.1:5173"],  # Frontend URLs
    allow_credentials=True,
    allow_methods=["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allow_headers=["*"],
    expose_headers=["*"],
    max_age=3600,
)

# Add Prometheus metrics
Instrumentator().instrument(app).expose(app, endpoint="/metrics")

# Include API router
app.include_router(api_router, prefix="/api/v1")

@app.get("/health")
async def health_check():
    return {"status": "ok"}