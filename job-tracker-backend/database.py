from sqlalchemy import create_engine
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker
import os

# Use environment variable for DATABASE_URL, fallback to Supabase
DATABASE_URL = os.getenv("DATABASE_URL", "postgresql://postgres:postgres@db.cumibicomnylpslsqxgt.supabase.co:5432/postgres")

engine = create_engine(DATABASE_URL)
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)
Base = declarative_base()
