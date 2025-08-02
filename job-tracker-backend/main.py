import os
import datetime
import httpx
from fastapi import FastAPI, UploadFile, File, Form, Depends, HTTPException
from fastapi.responses import FileResponse, RedirectResponse
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
        "http://127.0.0.1:4173",
        "https://job-application-tracker-2mm8.onrender.com",  # Your deployed backend
        "https://job-application-tracker-1-p42y.onrender.com",  # Your deployed frontend
        "*"  # Allow all origins for development/deployment
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
    resume_url: str = Form(""),
    db: Session = Depends(get_db)
):
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
        applied_date=applied_date,
        resume_url=resume_url
    )
    return crud.create_job(db, job_data)

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
async def get_job_resume(job_id: int, db: Session = Depends(get_db)):
    job = crud.get_job(db, job_id)
    if not job:
        raise HTTPException(status_code=404, detail="Job not found")
    
    resume_url = job.get('resume_url')
    if not resume_url:
        raise HTTPException(status_code=404, detail="No resume uploaded for this job")
    
    # If it's a Cloudinary URL, redirect to it directly
    if resume_url.startswith('http'):
        from fastapi.responses import RedirectResponse
        # Add headers to help with PDF viewing
        response = RedirectResponse(url=resume_url)
        response.headers["Content-Type"] = "application/pdf"
        response.headers["Content-Disposition"] = "inline; filename=resume.pdf"
        return response
    
    # Fallback for local files (legacy)
    if os.path.exists(resume_url):
        return FileResponse(resume_url, media_type="application/pdf")
    
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

@app.get("/cloudinary/resumes")
async def list_cloudinary_resumes(db: Session = Depends(get_db)):
    """List all resumes from jobs in the database"""
    try:
        # Get all jobs that have resume URLs
        jobs = crud.get_jobs(db)
        resumes = []
        
        for job in jobs:
            if job.get('resume_url') and job['resume_url'].startswith('http'):
                # Extract filename from the URL
                filename = job['resume_url'].split('/')[-1]
                # Remove any query parameters
                filename = filename.split('?')[0]
                
                # Extract company folder from URL if available
                url_parts = job['resume_url'].split('/')
                company_folder = 'unknown_company'
                if 'resumes/' in job['resume_url']:
                    resume_index = url_parts.index('resumes') if 'resumes' in url_parts else -1
                    if resume_index >= 0 and resume_index + 1 < len(url_parts):
                        potential_folder = url_parts[resume_index + 1]
                        # Check if it's actually a folder (not a filename)
                        if not potential_folder.endswith('.pdf') and not potential_folder.endswith('.txt'):
                            company_folder = potential_folder
                        else:
                            # Use company name from job data for existing resumes
                            company_folder = job['company_name'].replace(' ', '_').lower() if job['company_name'] else 'unknown_company'
                
                resumes.append({
                    "public_id": f"resumes/{company_folder}/{filename}",
                    "secure_url": job['resume_url'],
                    "filename": filename,
                    "created_at": job.get('applied_date', ''),
                    "job_id": job['id'],
                    "company_name": job['company_name'],
                    "job_title": job['job_title'],
                    "company_folder": company_folder
                })
        
        return {"resumes": resumes}
        
    except Exception as e:
        return {
            "resumes": [],
            "message": f"Error fetching resumes: {str(e)}"
        }

@app.delete("/jobs/{job_id}")
def delete_job(job_id: int, db: Session = Depends(get_db)):
    success = crud.delete_job(db, job_id)
    if not success:
        raise HTTPException(status_code=404, detail="Job not found")
    return {"message": "Job deleted successfully"}

@app.delete("/cloudinary/resumes/{public_id}")
async def delete_cloudinary_resume(public_id: str):
    """Manually delete a resume from Cloudinary (requires API credentials)"""
    try:
        import cloudinary
        import cloudinary.uploader
        
        # Configure Cloudinary using environment variables
        cloudinary.config(
            cloud_name=os.getenv("CLOUDINARY_CLOUD_NAME"),
            api_key=os.getenv("CLOUDINARY_API_KEY"),
            api_secret=os.getenv("CLOUDINARY_API_SECRET")
        )
        
        # Delete from Cloudinary
        result = cloudinary.uploader.destroy(public_id, resource_type="raw")
        
        if result.get("result") == "ok":
            return {"message": f"Resume {public_id} deleted successfully from Cloudinary"}
        else:
            raise HTTPException(status_code=400, detail=f"Failed to delete resume: {result}")
            
    except ImportError:
        raise HTTPException(
            status_code=500, 
            detail="Cloudinary library not installed. Run: pip install cloudinary"
        )
    except Exception as e:
        raise HTTPException(
            status_code=500, 
            detail=f"Error deleting resume from Cloudinary: {str(e)}"
        )
