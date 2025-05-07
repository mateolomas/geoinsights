from sqlalchemy.ext.declarative import declarative_base
from geoalchemy2 import Geometry

Base = declarative_base()

# Import all models here for Alembic
# This will be handled by Alembic's env.py instead 