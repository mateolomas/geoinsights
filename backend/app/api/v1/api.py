from fastapi import APIRouter
from app.api.v1.endpoints import auth_router, users_router, geo_data_router

api_router = APIRouter()

api_router.include_router(auth_router, prefix="/auth", tags=["authentication"])
api_router.include_router(users_router, prefix="/users", tags=["users"])
api_router.include_router(geo_data_router, prefix="/geo", tags=["geographic data"]) 