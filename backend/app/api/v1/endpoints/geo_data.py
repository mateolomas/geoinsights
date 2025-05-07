from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import Any, List

from app.api.deps import get_db, get_current_user
from app.crud import crud_geo_data
from app.schemas.geo_data import GeoData, GeoDataCreate, GeoDataUpdate
from app.schemas.user import User

router = APIRouter()

@router.get("/", response_model=List[GeoData])
def read_geo_data(
    db: Session = Depends(get_db),
    skip: int = 0,
    limit: int = 100,
    current_user: User = Depends(get_current_user),
) -> Any:
    """
    Retrieve geographic data
    """
    geo_data = crud_geo_data.get_multi_by_user(
        db=db, user_id=current_user.id, skip=skip, limit=limit
    )
    

    return geo_data

@router.post("/", response_model=GeoData)
def create_geo_data(
    *,
    db: Session = Depends(get_db),
    geo_data_in: GeoDataCreate,
    current_user: User = Depends(get_current_user),
) -> Any:
    """
    Create new geographic data
    """
    geo_data = crud_geo_data.create_with_user(
        db=db, obj_in=geo_data_in, user_id=current_user.id
    )
    return geo_data

@router.get("/{id}", response_model=GeoData)
def read_geo_data(
    *,
    db: Session = Depends(get_db),
    id: int,
    current_user: User = Depends(get_current_user),
) -> Any:
    """
    Get geographic data by ID
    """
    geo_data = crud_geo_data.get(db=db, id=id)
    if not geo_data:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Geographic data not found"
        )
    if geo_data.user_id != current_user.id:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Not enough permissions"
        )
    return geo_data

@router.put("/{id}", response_model=GeoData)
def update_geo_data(
    *,
    db: Session = Depends(get_db),
    id: int,
    geo_data_in: GeoDataUpdate,
    current_user: User = Depends(get_current_user),
) -> Any:
    """
    Update geographic data
    """
    geo_data = crud_geo_data.get(db=db, id=id)
    if not geo_data:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Geographic data not found"
        )
    if geo_data.user_id != current_user.id:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Not enough permissions"
        )
    geo_data = crud_geo_data.update(db=db, db_obj=geo_data, obj_in=geo_data_in)
    return geo_data

@router.delete("/{id}", response_model=GeoData)
def delete_geo_data(
    *,
    db: Session = Depends(get_db),
    id: int,
    current_user: User = Depends(get_current_user),
) -> Any:
    """
    Delete geographic data
    """
    geo_data = crud_geo_data.get(db=db, id=id)
    if not geo_data:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Geographic data not found"
        )
    if geo_data.user_id != current_user.id:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Not enough permissions"
        )
    geo_data = crud_geo_data.remove(db=db, id=id)
    return geo_data 