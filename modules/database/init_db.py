import os
import sys
# Añadimos la ruta raíz para que Python encuentre los módulos
sys.path.append(os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__)))))

from sqlalchemy import create_engine
from modules.database.models import Base

def init_database():
    database_url = os.getenv("DATABASE_URL")
    if not database_url:
        print("Error: Falta la variable DATABASE_URL.")
        return
    
    # SQLAlchemy usa postgresql+psycopg2://
    db_url_alchemy = database_url.replace("postgresql://", "postgresql+psycopg2://")
    
    engine = create_engine(db_url_alchemy)
    Base.metadata.create_all(engine)
    print("¡Base de datos inicializada en Supabase! Tablas creadas.")

if __name__ == "__main__":
    init_database()
