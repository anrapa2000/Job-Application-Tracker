import os
import datetime
from fastapi import FastAPI, UploadFile, File, Form, Depends, HTTPException
from fastapi.responses import FileResponse
from sqlalchemy.orm import Session
from database import SessionLocal, engine
import models, schema, crud

from fastapi.middleware.cors import CORSMiddleware

models.Base.metadata.create_all(bind=engine)
app = FastAPI()

# Enable CORS for frontend
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:5173",
        "http://localhost:3000",
        "http://127.0.0.1:5173",
        "http://127.0.0.1:3000",
        "http://localhost:4173",  # Vite preview
        "http://127.0.0.1:4173"
    ],
    allow_credentials=True,
    allow_methods=["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allow_headers=["*"],
)

UPLOAD_DIR = "uploads"
os.makedirs(UPLOAD_DIR, exist_ok=True)

@app.get("/")
def read_root():
    return {"message": "Job Application Tracker API is running!"}

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

@app.post("/jobs/")
async def create_job(
    company_name: str = Form(...),
    job_title: str = Form(...),
    status: str = Form(...),
    job_url: str = Form(""),
    job_description: str = Form(""),
    notes: str = Form(""),
    location: str = Form(""),
    applied_date: str = Form(...),
    resume: UploadFile = File(...),
    db: Session = Depends(get_db)
):
    if resume.content_type != "application/pdf":
        raise HTTPException(status_code=400, detail="Only PDF files allowed")

    filepath = os.path.join(UPLOAD_DIR, resume.filename)
    with open(filepath, "wb") as f:
        f.write(await resume.read())

    # Validate the date string format
    try:
        datetime.datetime.strptime(applied_date, "%Y-%m-%d")
    except ValueError:
        raise HTTPException(status_code=400, detail="Invalid date format. Use YYYY-MM-DD")

    job_data = schema.JobCreate(
        company_name=company_name,
        job_title=job_title,
        job_url=job_url,
        status=status,
        job_description=job_description,
        notes=notes,
        location=location,
        applied_date=applied_date
    )
    return crud.create_job(db, job_data, resume_path=filepath)

@app.get("/jobs/")
def list_jobs(db: Session = Depends(get_db)):
    return crud.get_jobs(db)

@app.get("/jobs/{job_id}")
def get_job(job_id: int, db: Session = Depends(get_db)):
    return crud.get_job(db, job_id)

@app.get("/resume/{filename}")
def get_resume(filename: str):
    filepath = os.path.join(UPLOAD_DIR, filename)
    if os.path.exists(filepath):
        return FileResponse(filepath, media_type="application/pdf")
    raise HTTPException(status_code=404, detail="Resume not found")

@app.get("/jobs/{job_id}/resume")
def get_job_resume(job_id: int, db: Session = Depends(get_db)):
    job = crud.get_job(db, job_id)
    if not job:
        raise HTTPException(status_code=404, detail="Job not found")
    
    if not job.get('resume_file_path'):
        raise HTTPException(status_code=404, detail="No resume uploaded for this job")
    
    if os.path.exists(job.get('resume_file_path')):
        return FileResponse(job.get('resume_file_path'), media_type="application/pdf")
    raise HTTPException(status_code=404, detail="Resume file not found")

@app.put("/jobs/{job_id}/status")
def update_job_status(job_id: int, status: str, db: Session = Depends(get_db)):
    job = crud.update_status(db, job_id, new_status=status)
    if not job:
        raise HTTPException(status_code=404, detail="Job not found")
    return job

@app.put("/jobs/{job_id}")
async def update_job(
    job_id: int,
    company_name: str = Form(...),
    job_title: str = Form(...),
    status: str = Form(...),
    job_url: str = Form(""),
    job_description: str = Form(""),
    notes: str = Form(""),
    location: str = Form(""),
    applied_date: str = Form(...),
    resume: UploadFile = File(None),
    db: Session = Depends(get_db)
):
    job = crud.get_job(db, job_id)
    if not job:
        raise HTTPException(status_code=404, detail="Job not found")
    
    # Handle resume upload if provided
    resume_path = job.get('resume_file_path')
    if resume:
        if resume.content_type != "application/pdf":
            raise HTTPException(status_code=400, detail="Only PDF files allowed")
        
        # Delete old resume if it exists
        if job.get('resume_file_path') and os.path.exists(job.get('resume_file_path')):
            try:
                os.remove(job.get('resume_file_path'))
            except OSError:
                pass
        
        # Save new resume
        filepath = os.path.join(UPLOAD_DIR, resume.filename)
        with open(filepath, "wb") as f:
            f.write(await resume.read())
        resume_path = filepath
    
    # Validate the date string format
    try:
        datetime.datetime.strptime(applied_date, "%Y-%m-%d")
    except ValueError:
        raise HTTPException(status_code=400, detail="Invalid date format. Use YYYY-MM-DD")
    
    # Update job data
    job_data = {
        "company_name": company_name,
        "job_title": job_title,
        "job_url": job_url,
        "status": status,
        "job_description": job_description,
        "notes": notes,
        "location": location,
        "applied_date": applied_date,
        "resume_file_path": resume_path
    }
    
    updated_job = crud.update_job(db, job_id, job_data)
    return updated_job

@app.delete("/jobs/{job_id}")
def delete_job(job_id: int, db: Session = Depends(get_db)):
    success = crud.delete_job(db, job_id)
    if not success:
        raise HTTPException(status_code=404, detail="Job not found")
    return {"message": "Job deleted successfully"}
