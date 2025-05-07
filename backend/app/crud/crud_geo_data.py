from typing import List, Optional
from sqlalchemy.orm import Session
from app.crud.base import CRUDBase
from app.models.geo_data import GeoData
from app.schemas.geo_data import GeoDataCreate, GeoDataUpdate
from shapely.geometry import shape, mapping
from geoalchemy2.shape import from_shape, to_shape

class CRUDGeoData(CRUDBase[GeoData, GeoDataCreate, GeoDataUpdate]):
    def get_multi_by_user(
        self, db: Session, *, user_id: int, skip: int = 0, limit: int = 100
    ) -> List[GeoData]:
        db_objs = (
            db.query(self.model)
            .filter(GeoData.user_id == user_id)
            .offset(skip)
            .limit(limit)
            .all()
        )
        
        # Convert WKB geometry to GeoJSON for each object
        result = []
        for obj in db_objs:
            obj_dict = {
                "id": obj.id,
                "name": obj.name,
                "description": obj.description,
                "user_id": obj.user_id,
                "created_at": obj.created_at,
                "updated_at": obj.updated_at,
                "properties": obj.properties
            }
            
            if obj.geometry is not None:
                shape_obj = to_shape(obj.geometry)
                obj_dict["geometry"] = mapping(shape_obj)
            
            result.append(GeoData(**obj_dict))
        
        return result

    def create_with_user(
        self, db: Session, *, obj_in: GeoDataCreate, user_id: int
    ) -> GeoData:
        # Convert GeoJSON to WKB
        geom = shape(obj_in.geometry)
        wkb_geometry = from_shape(geom, srid=4326)
        
        db_obj = GeoData(
            name=obj_in.name,
            description=obj_in.description,
            geometry=wkb_geometry,
            properties=obj_in.properties,
            user_id=user_id,
        )
        db.add(db_obj)
        db.commit()
        db.refresh(db_obj)
        return db_obj

    def get(self, db: Session, id: int) -> Optional[GeoData]:
        return db.query(self.model).filter(GeoData.id == id).first()

    def update(
        self, db: Session, *, db_obj: GeoData, obj_in: GeoDataUpdate
    ) -> GeoData:
        update_data = obj_in.model_dump(exclude_unset=True)
        
        # Handle geometry update if provided
        if "geometry" in update_data:
            geom = shape(update_data["geometry"])
            update_data["geometry"] = from_shape(geom, srid=4326)
        
        for field in update_data:
            setattr(db_obj, field, update_data[field])
        
        db.add(db_obj)
        db.commit()
        db.refresh(db_obj)
        return db_obj

crud_geo_data = CRUDGeoData(GeoData) 