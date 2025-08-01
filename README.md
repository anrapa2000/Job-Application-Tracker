# 📋 Job Application Tracker

A modern, full-stack web application for tracking job applications with resume management, status updates, and detailed analytics.

## ✨ Features

### 🎯 Core Functionality
- **Add Job Applications**: Upload resumes, track company details, job descriptions
- **Dashboard View**: Excel-like table with real-time statistics and status tracking
- **Edit Applications**: Update any job details from dashboard or job details page
- **Delete Jobs**: Remove applications with confirmation dialog
- **View Details**: Detailed job information with resume viewing/downloading
- **Status Updates**: Inline status changes from the dashboard
- **Location Tracking**: Track job locations for better organization

### 📊 Excel Import/Export
- **Export to Excel**: Download all job applications as Excel file
- **Import from Excel**: Bulk import jobs from Excel files
- **Template Download**: Get a template Excel file for manual entry
- **Smart Column Mapping**: Handles different column name variations
- **Validation**: Ensures required fields are present before import

### ☁️ Cloud Resume Management
- **Cloudinary Integration**: Store resumes in the cloud
- **Resume Selection**: Choose from existing resumes or upload new ones
- **Smart Deletion**: Only deletes resumes when no other jobs reference them
- **Company-based Organization**: Resumes organized by company folders
- **Direct Viewing**: View PDFs directly from Cloudinary URLs

### 🎨 Modern UI/UX
- **Styled-Components**: Clean, modern styling throughout
- **Responsive Design**: Works seamlessly on all screen sizes
- **Professional Look**: Modern cards, proper spacing, beautiful colors
- **Smart Validation**: Form validation with change detection
- **Loading States**: Smooth loading indicators and error handling

### 🔧 Technical Excellence
- **Full-Stack**: FastAPI backend + React frontend
- **File Handling**: PDF resume upload, storage, and retrieval
- **Data Validation**: Proper error handling and validation
- **Date Handling**: Accurate date tracking without timezone issues
- **TypeScript**: Full type safety throughout the application

## 🚀 Quick Start

### Prerequisites
- Python 3.8+
- Node.js 16+
- npm or yarn

### Backend Setup

1. **Navigate to backend directory**
   ```bash
   cd job-tracker-backend
   ```

2. **Create virtual environment**
   ```bash
   python -m venv env
   source env/bin/activate  # On Windows: env\Scripts\activate
   ```

3. **Install dependencies**
   ```bash
   pip install -r requirements.txt
   ```

4. **Start the backend server**
   ```bash
   uvicorn main:app --reload
   ```
   The backend will run on `http://localhost:8000`

### Frontend Setup

1. **Navigate to frontend directory**
   ```bash
   cd job-tracker-frontend
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Start the development server**
   ```bash
   npm run dev
   ```
   The frontend will run on `http://localhost:5173`

## 📁 Project Structure

```
Job-Application-Tracker/
├── job-tracker-backend/
│   ├── main.py              # FastAPI application
│   ├── models.py            # SQLAlchemy models
│   ├── schema.py            # Pydantic schemas
│   ├── crud.py              # Database operations
│   ├── database.py          # Database configuration
│   ├── requirements.txt     # Python dependencies
│   └── uploads/             # Resume storage directory
├── job-tracker-frontend/
│   ├── src/
│   │   ├── components/
│   │   │   ├── JobList.tsx      # Dashboard component
│   │   │   ├── JobForm.tsx      # Add job form
│   │   │   ├── JobDetails.tsx   # Job details view
│   │   │   └── EditJobForm.tsx  # Edit job form
│   │   ├── utils/
│   │   │   └── uploadToCloudinary.ts  # Cloudinary upload utility
│   │   ├── App.tsx              # Main app component
│   │   ├── api.ts               # API configuration
│   │   └── index.css            # Global styles
│   ├── package.json             # Node.js dependencies
│   └── create-test-excel.js     # Excel test file generator
├── setup.sh                     # Automated setup script
├── start.sh                     # Quick start script
└── README.md                    # This file
```

## 🔧 Configuration

### Cloudinary Setup (Optional)
For resume cloud storage, create a Cloudinary account and update the configuration in `src/utils/uploadToCloudinary.ts`:

```typescript
const cloudName = "your-cloud-name";
const uploadPreset = "your-upload-preset";
```

## 📊 Excel Import/Export Guide

### Exporting Jobs
1. Click "Export to Excel" button in the dashboard
2. File will be downloaded with current date: `job_applications_YYYY-MM-DD.xlsx`
3. Contains all job data with proper column formatting

### Importing Jobs
1. Click "Download Template" to get the correct format
2. Fill in your job data following the template
3. Click "Import Excel" and select your file
4. System will validate and import jobs automatically

### Supported Excel Columns
| Column | Required | Description |
|--------|----------|-------------|
| Company Name | ✅ | Company name |
| Job Title | ✅ | Job title |
| Status | ❌ | Application status (defaults to "Applied") |
| Applied Date | ❌ | Date applied (YYYY-MM-DD format) |
| Location | ❌ | Job location |
| Job URL | ❌ | Job posting URL |
| Resume URL | ❌ | Cloudinary resume URL |
| Job Description | ❌ | Job description |
| Notes | ❌ | Additional notes |

## 🛠️ Development

### Backend API Endpoints
- `GET /jobs/` - List all jobs
- `POST /jobs/` - Create new job
- `GET /jobs/{id}` - Get specific job
- `PUT /jobs/{id}` - Update job
- `DELETE /jobs/{id}` - Delete job
- `GET /jobs/{id}/resume` - Get job resume
- `GET /cloudinary/resumes` - List cloud resumes
- `DELETE /cloudinary/resumes/{public_id}` - Delete cloud resume

### Frontend Components
- **JobList**: Main dashboard with Excel-like table
- **JobForm**: Add new job with resume upload
- **JobDetails**: Detailed job view with resume viewing
- **EditJobForm**: Edit existing job applications

## 🚀 Deployment

### Backend Deployment
1. Install dependencies: `pip install -r requirements.txt`
2. Set environment variables for production
3. Run with production server: `uvicorn main:app --host 0.0.0.0 --port 8000`

### Frontend Deployment
1. Install dependencies: `npm install`
2. Build for production: `npm run build`
3. Serve the `dist` folder

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## 📝 License

This project is open source and available under the [MIT License](LICENSE).

## 🙏 Acknowledgments

- FastAPI for the excellent backend framework
- React and Styled-Components for the modern UI
- Cloudinary for cloud file storage
- SheetJS for Excel functionality