from typing import Optional, Dict, Any
from datetime import datetime
from pydantic import BaseModel, Field, field_validator
from shapely.geometry import shape, mapping
from geoalchemy2.shape import to_shape

# Shared properties
class GeoDataBase(BaseModel):
    name: Optional[str] = None
    description: Optional[str] = None
    geometry: Optional[Dict[str, Any]] = None
    properties: Optional[Dict[str, Any]] = Field(default_factory=dict)

# Properties to receive on creation
class GeoDataCreate(GeoDataBase):
    name: str
    geometry: Dict[str, Any]
    properties: Dict[str, Any] = Field(default_factory=dict)

# Properties to receive on update
class GeoDataUpdate(GeoDataBase):
    pass

# Properties shared by models stored in DB
class GeoDataInDBBase(GeoDataBase):
    id: int
    user_id: int
    created_at: datetime
    updated_at: datetime

    class Config:
        from_attributes = True

# Properties to return to client
class GeoData(GeoDataInDBBase):
    class Config:
        from_attributes = True

    @field_validator('geometry', mode='before')
    @classmethod
    def convert_geometry(cls, v):
        if hasattr(v, 'desc') and 'WKBElement' in str(v.desc):
            shape_obj = to_shape(v)
            return mapping(shape_obj)
        return v

# Properties stored in DB
class GeoDataInDB(GeoDataInDBBase):
    pass 