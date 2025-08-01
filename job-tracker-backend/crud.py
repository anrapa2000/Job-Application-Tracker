from sqlalchemy.orm import Session
import models, schema
import os
import datetime

def create_job(db: Session, job_data: schema.JobCreate, resume_path: str):
    # Convert the date string to a proper date object for the database
    job_dict = job_data.dict()
    if 'applied_date' in job_dict and isinstance(job_dict['applied_date'], str):
        job_dict['applied_date'] = datetime.datetime.strptime(job_dict['applied_date'], "%Y-%m-%d").date()
    
    job = models.Job(**job_dict, resume_file_path=resume_path)
    db.add(job)
    db.commit()
    db.refresh(job)
    
    # Return as dictionary with string date for API response
    return {
        'id': job.id,
        'company_name': job.company_name,
        'job_title': job.job_title,
        'job_url': job.job_url,
        'status': job.status,
        'applied_date': job.applied_date.strftime("%Y-%m-%d") if job.applied_date else None,
        'resume_file_path': job.resume_file_path,
        'job_description': job.job_description,
        'notes': job.notes,
        'location': job.location
    }

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
            'resume_file_path': job.resume_file_path,
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
            'resume_file_path': job.resume_file_path,
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
            'resume_file_path': job.resume_file_path,
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
            'resume_file_path': job.resume_file_path,
            'job_description': job.job_description,
            'notes': job.notes,
            'location': job.location
        }
    return None

def delete_job(db: Session, job_id: int):
    job = db.query(models.Job).filter(models.Job.id == job_id).first()
    if job:
        # Delete the resume file if it exists
        if job.resume_file_path and os.path.exists(job.resume_file_path):
            try:
                os.remove(job.resume_file_path)
            except OSError:
                pass  # Continue even if file deletion fails
        
        db.delete(job)
        db.commit()
        return True
    return False
