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
│   │   ├── App.tsx              # Main app component
│   │   ├── api.ts               # API configuration
│   │   └── index.css            # Global styles
│   ├── package.json             # Node.js dependencies
│   └── vite.config.ts           # Vite configuration
└── README.md
```

## 🔌 API Endpoints

### Jobs
- `GET /jobs/` - List all jobs
- `GET /jobs/{job_id}` - Get specific job
- `POST /jobs/` - Create new job
- `PUT /jobs/{job_id}` - Update job
- `DELETE /jobs/{job_id}` - Delete job

### Status Updates
- `PUT /jobs/{job_id}/status` - Update job status

### Resume Management
- `GET /jobs/{job_id}/resume` - Download resume
- `GET /resume/{filename}` - Get resume by filename

## 🎨 UI Components

### Dashboard (JobList)
- **Statistics Cards**: Total, Applied, Interviewing, Offers
- **Excel-like Table**: Sortable columns with inline editing
- **Status Dropdowns**: Real-time status updates
- **Action Buttons**: View, Edit, Delete with loading states

### Job Form
- **Smart Validation**: Required fields with visual feedback
- **File Upload**: Drag-and-drop PDF resume upload
- **Change Detection**: Submit button disabled when no changes
- **Error Handling**: Comprehensive error messages

### Job Details
- **Clean Layout**: Organized information display
- **Resume Viewer**: PDF viewing and download
- **Edit Integration**: Direct link to edit form
- **Responsive Design**: Works on all devices

## 🛠️ Technology Stack

### Backend
- **FastAPI**: Modern Python web framework
- **SQLAlchemy**: Database ORM
- **Pydantic**: Data validation and serialization
- **Uvicorn**: ASGI server
- **SQLite**: Database (can be easily changed to PostgreSQL/MySQL)

### Frontend
- **React 19**: Modern React with hooks
- **TypeScript**: Type safety and better DX
- **Styled-Components**: CSS-in-JS styling
- **React Router**: Client-side routing
- **Axios**: HTTP client for API calls
- **Vite**: Fast build tool and dev server

## 🔧 Development

### Backend Development
```bash
cd job-tracker-backend
source env/bin/activate
uvicorn main:app --reload --host 0.0.0.0 --port 8000
```

### Frontend Development
```bash
cd job-tracker-frontend
npm run dev
```

### Building for Production
```bash
# Frontend
cd job-tracker-frontend
npm run build

# Backend
cd job-tracker-backend
pip install -r requirements.txt
uvicorn main:app --host 0.0.0.0 --port 8000
```

## 🐛 Troubleshooting

### Common Issues

1. **Backend won't start**
   - Ensure virtual environment is activated
   - Check if all dependencies are installed
   - Verify Python version (3.8+)

2. **Frontend build errors**
   - Clear node_modules and reinstall: `rm -rf node_modules && npm install`
   - Check Node.js version (16+)

3. **Resume upload issues**
   - Ensure uploads directory exists
   - Check file permissions
   - Verify PDF file format

4. **Date display issues**
   - Dates are handled as strings to avoid timezone issues
   - Format: YYYY-MM-DD

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature-name`
3. Commit changes: `git commit -am 'Add feature'`
4. Push to branch: `git push origin feature-name`
5. Submit a pull request

## 📝 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 🙏 Acknowledgments

- Built with modern web technologies
- Designed for optimal user experience
- Focused on maintainability and scalability