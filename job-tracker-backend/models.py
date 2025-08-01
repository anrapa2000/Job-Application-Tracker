from sqlalchemy import Column, Integer, String, Date
from database import Base
import datetime

class Job(Base):
    __tablename__ = "jobs"

    id = Column(Integer, primary_key=True, index=True)
    company_name = Column(String, index=True)
    job_title = Column(String)
    job_url = Column(String)
    status = Column(String)
    applied_date = Column(Date, default=datetime.date.today)
    resume_file_path = Column(String)
    job_description = Column(String)
    notes = Column(String)
    location = Column(String)
