from sqlalchemy import Column, Integer, String, DateTime, Float, Boolean, Text
from sqlalchemy.orm import declarative_base
from datetime import datetime, timezone

Base = declarative_base()

class Prospect(Base):
    __tablename__ = 'prospects'

    id = Column(Integer, primary_key=True)
    name = Column(String, nullable=True)
    company = Column(String, nullable=False)
    website = Column(String, nullable=True)
    city = Column(String, nullable=True)
    country = Column(String, default='Chile')
    email = Column(String, nullable=True, unique=True)
    is_generic_email = Column(Boolean, default=True)
    
    # Compliance (Ley 19.496 / 19.628 Chile)
    source_url = Column(String, nullable=False)
    discovery_date = Column(DateTime, default=lambda: datetime.now(timezone.utc))
    updated_at = Column(DateTime, default=lambda: datetime.now(timezone.utc), onupdate=lambda: datetime.now(timezone.utc))
    opt_out = Column(Boolean, default=False)
    
    # Clasificación y Estado
    classification = Column(Text, nullable=True) # Info extraída por el LLM
    score = Column(Float, default=0.0)
    status = Column(String, default='discovered') # discovered, qualified, approved, sent, opted_out, etc.
