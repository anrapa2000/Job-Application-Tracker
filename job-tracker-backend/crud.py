from sqlalchemy.orm import Session
import models, schema
import os
import datetime
from dotenv import load_dotenv

# Load environment variables
load_dotenv()

def create_job(db: Session, job_data: schema.JobCreate):
    job_dict = job_data.dict()
    if 'applied_date' in job_dict and isinstance(job_dict['applied_date'], str):
        job_dict['applied_date'] = datetime.datetime.strptime(job_dict['applied_date'], "%Y-%m-%d").date()

    job = models.Job(**job_dict)
    db.add(job)
    db.commit()
    db.refresh(job)

    return job

def get_jobs(db: Session):
    jobs = db.query(models.Job).all()
    return [
        {
            'id': job.id,
            'company_name': job.company_name,
            'job_title': job.job_title,
            'job_url': job.job_url,
            'status': job.status,
            'applied_date': job.applied_date.strftime("%Y-%m-%d") if job.applied_date else None,
            'resume_url': job.resume_url,
            'job_description': job.job_description,
            'notes': job.notes,
            'location': job.location
        }
        for job in jobs
    ]

def get_job(db: Session, job_id: int):
    job = db.query(models.Job).filter(models.Job.id == job_id).first()
    if job:
        # Convert the date object to string for the API response
        job_dict = {
            'id': job.id,
            'company_name': job.company_name,
            'job_title': job.job_title,
            'job_url': job.job_url,
            'status': job.status,
            'applied_date': job.applied_date.strftime("%Y-%m-%d") if job.applied_date else None,
            'resume_url': job.resume_url,
            'job_description': job.job_description,
            'notes': job.notes,
            'location': job.location
        }
        return job_dict
    return None

def update_status(db: Session, job_id: int, new_status: str):
    job = db.query(models.Job).filter(models.Job.id == job_id).first()
    if job:
        job.status = new_status
        db.commit()
        db.refresh(job)
        # Return as dictionary with string date
        return {
            'id': job.id,
            'company_name': job.company_name,
            'job_title': job.job_title,
            'job_url': job.job_url,
            'status': job.status,
            'applied_date': job.applied_date.strftime("%Y-%m-%d") if job.applied_date else None,
            'resume_url': job.resume_url,
            'job_description': job.job_description,
            'notes': job.notes,
            'location': job.location
        }
    return None

def update_job(db: Session, job_id: int, job_data: dict):
    job = db.query(models.Job).filter(models.Job.id == job_id).first()
    if job:
        for key, value in job_data.items():
            if key == 'applied_date' and isinstance(value, str):
                # Convert date string to date object
                setattr(job, key, datetime.datetime.strptime(value, "%Y-%m-%d").date())
            else:
                setattr(job, key, value)
        db.commit()
        db.refresh(job)
        # Return as dictionary with string date
        return {
            'id': job.id,
            'company_name': job.company_name,
            'job_title': job.job_title,
            'job_url': job.job_url,
            'status': job.status,
            'applied_date': job.applied_date.strftime("%Y-%m-%d") if job.applied_date else None,
            'resume_url': job.resume_url,
            'job_description': job.job_description,
            'notes': job.notes,
            'location': job.location
        }
    return None

def delete_job(db: Session, job_id: int):
    job = db.query(models.Job).filter(models.Job.id == job_id).first()
    if job:
        # Check if this resume is used by other jobs
        resume_url = job.resume_url
        other_jobs_with_same_resume = db.query(models.Job).filter(
            models.Job.resume_url == resume_url,
            models.Job.id != job_id
        ).count()
        
        # Delete the job
        db.delete(job)
        db.commit()
        
        # If no other jobs use this resume, delete it from Cloudinary
        if resume_url and other_jobs_with_same_resume == 0:
            try:
                import cloudinary
                import cloudinary.uploader
                
                # Configure Cloudinary using environment variables
                cloudinary.config(
                    cloud_name=os.getenv("CLOUDINARY_CLOUD_NAME"),
                    api_key=os.getenv("CLOUDINARY_API_KEY"),
                    api_secret=os.getenv("CLOUDINARY_API_SECRET")
                )
                
                # Extract public_id from URL
                if 'res.cloudinary.com' in resume_url:
                    # Extract the path after /upload/
                    url_parts = resume_url.split('/upload/')
                    if len(url_parts) > 1:
                        public_id = url_parts[1].split('/')[0]  # Get the version
                        if '/' in url_parts[1]:
                            public_id += '/' + '/'.join(url_parts[1].split('/')[1:])  # Add the rest of the path
                        public_id = public_id.replace('.pdf', '').replace('.txt', '')
                        
                        # Delete from Cloudinary
                        cloudinary.uploader.destroy(public_id, resource_type="raw")
                        print(f"✅ Deleted resume from Cloudinary: {public_id}")
            except Exception as e:
                print(f"❌ Error deleting resume from Cloudinary: {e}")
        elif resume_url and other_jobs_with_same_resume > 0:
            print(f"✅ Resume kept in Cloudinary (used by {other_jobs_with_same_resume} other job(s))")
        
        return True
    return False
