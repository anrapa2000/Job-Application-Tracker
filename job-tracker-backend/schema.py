from pydantic import BaseModel
from typing import Optional
from datetime import date, datetime

class JobCreate(BaseModel):
    company_name: str
    job_title: str
    job_url: Optional[str]
    status: str
    job_description: Optional[str]
    notes: Optional[str]
    applied_date: str
    location: Optional[str]

class JobOut(JobCreate):
    id: int
    applied_date: str
    resume_file_path: Optional[str]

    class Config:
        orm_mode = True
