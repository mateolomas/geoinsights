from sqlalchemy import Column, Integer, String, Float, DateTime, ForeignKey, JSON
from sqlalchemy.orm import relationship
from geoalchemy2 import Geometry
from datetime import datetime
from app.db.base import Base

class GeoData(Base):
    __tablename__ = "geo_data"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, index=True)
    description = Column(String, nullable=True)
    geometry = Column(Geometry('GEOMETRY', srid=4326))
    properties = Column(JSON)  # Use JSON type instead of String
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
    user_id = Column(Integer, ForeignKey("users.id"))
    
    # Relationships
    user = relationship("User", back_populates="geo_data") 