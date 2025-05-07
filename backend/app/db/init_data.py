from sqlalchemy.orm import Session
from app.crud import crud_user, crud_geo_data
from app.schemas.user import UserCreate
from app.schemas.geo_data import GeoDataCreate
from app.core.security import get_password_hash

def init_db(db: Session) -> None:
    # Create a test user
    user_in = UserCreate(
        email="test@example.com",
        password="test123",
        full_name="Test User"
    )
    user = crud_user.get_by_email(db, email=user_in.email)
    if not user:
        user = crud_user.create(db, obj_in=user_in)

    # Create sample geographic data
    sample_data = [
        {
            "name": "New York City",
            "description": "The Big Apple",
            "geometry": {
                "type": "Point",
                "coordinates": [-74.006, 40.7128]
            },
            "properties": {
                "population": "8.8 million",
                "founded": "1624"
            }
        },
        {
            "name": "London",
            "description": "Capital of England",
            "geometry": {
                "type": "Point",
                "coordinates": [-0.1276, 51.5074]
            },
            "properties": {
                "population": "9 million",
                "founded": "43 AD"
            }
        },
        {
            "name": "Tokyo",
            "description": "Capital of Japan",
            "geometry": {
                "type": "Point",
                "coordinates": [139.6917, 35.6895]
            },
            "properties": {
                "population": "37 million",
                "founded": "1457"
            }
        },
        {
            "name": "Sydney",
            "description": "Largest city in Australia",
            "geometry": {
                "type": "Point",
                "coordinates": [151.2093, -33.8688]
            },
            "properties": {
                "population": "5.3 million",
                "founded": "1788"
            }
        }
    ]

    # Add sample data to database
    for data in sample_data:
        geo_data_in = GeoDataCreate(
            name=data["name"],
            description=data["description"],
            geometry=data["geometry"],
            properties=data["properties"]  # Pass as dictionary
        )
        crud_geo_data.create_with_user(db, obj_in=geo_data_in, user_id=user.id) 