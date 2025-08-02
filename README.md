# Job Application Tracker

A full-stack application to track job applications with resume management and Excel import/export capabilities.

## 🔐 Security Configuration

### Environment Variables Setup

**Backend (.env file in job-tracker-backend/)**
```bash
# Database Configuration
DATABASE_URL=postgresql://postgres:password@your-supabase-host:5432/postgres

# Cloudinary Configuration
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret
CLOUDINARY_UPLOAD_PRESET=your_upload_preset

# API Configuration
API_BASE_URL=https://your-backend-url.onrender.com
```

**Frontend (.env file in job-tracker-frontend/)**
```bash
# API Configuration
VITE_API_BASE_URL=https://your-backend-url.onrender.com

# Cloudinary Configuration
VITE_CLOUDINARY_CLOUD_NAME=your_cloud_name
VITE_CLOUDINARY_UPLOAD_PRESET=your_upload_preset
VITE_CLOUDINARY_API_KEY=your_api_key
VITE_CLOUDINARY_API_SECRET=your_api_secret
```

### 🔒 Security Best Practices

1. **Never commit .env files** - They're already in .gitignore
2. **Use different credentials for development and production**
3. **Rotate API keys regularly**
4. **Use environment variables in deployment platforms**

### 🚀 Deployment Security

**Render Backend Environment Variables:**
- `DATABASE_URL`
- `CLOUDINARY_CLOUD_NAME`
- `CLOUDINARY_API_KEY`
- `CLOUDINARY_API_SECRET`
- `CLOUDINARY_UPLOAD_PRESET`

**Render Frontend Environment Variables:**
- `VITE_API_BASE_URL`
- `VITE_CLOUDINARY_CLOUD_NAME`
- `VITE_CLOUDINARY_UPLOAD_PRESET`
- `VITE_CLOUDINARY_API_KEY`
- `VITE_CLOUDINARY_API_SECRET`

## 🚀 Quick Start

### Prerequisites
- Python 3.8+
- Node.js 16+
- Supabase account
- Cloudinary account

### Backend Setup
```bash
cd job-tracker-backend
python -m venv env
source env/bin/activate  # On Windows: env\Scripts\activate
pip install -r requirements.txt

# Copy .env.example to .env and fill in your values
cp .env.example .env
# Edit .env with your actual credentials

uvicorn main:app --reload
```

### Frontend Setup
```bash
cd job-tracker-frontend
npm install

# Copy .env.example to .env and fill in your values
cp .env.example .env
# Edit .env with your actual credentials

npm run dev
```

## 📁 Project Structure

```
Job-Application-Tracker/
├── job-tracker-backend/
│   ├── main.py              # FastAPI application
│   ├── models.py            # SQLAlchemy models
│   ├── crud.py              # Database operations
│   ├── schema.py            # Pydantic schemas
│   ├── database.py          # Database configuration
│   ├── requirements.txt     # Python dependencies
│   └── .env                 # Environment variables (create this)
├── job-tracker-frontend/
│   ├── src/
│   │   ├── components/      # React components
│   │   ├── utils/           # Utility functions
│   │   └── config/          # Configuration files
│   ├── package.json         # Node.js dependencies
│   └── .env                 # Environment variables (create this)
└── README.md
```

## 🌟 Features

- **Job Application Tracking**: Add, edit, delete, and view job applications
- **Resume Management**: Upload resumes to Cloudinary with company-based organization
- **Excel Import/Export**: Download job data as Excel and import from Excel files
- **Modern UI**: Clean, responsive interface built with styled-components
- **Real-time Updates**: Instant feedback on all operations
- **Cloud Storage**: Secure resume storage with Cloudinary
- **Database**: Persistent data storage with Supabase PostgreSQL

## 🔧 API Endpoints

### Jobs
- `GET /jobs/` - List all jobs
- `POST /jobs/` - Create new job
- `GET /jobs/{id}` - Get specific job
- `PUT /jobs/{id}` - Update job
- `DELETE /jobs/{id}` - Delete job

### Resumes
- `GET /jobs/{id}/resume` - View job resume
- `GET /cloudinary/resumes` - List existing resumes
- `DELETE /cloudinary/resumes/{public_id}` - Delete resume

## 🛠️ Technologies Used

### Backend
- **FastAPI**: Modern Python web framework
- **SQLAlchemy**: Database ORM
- **Pydantic**: Data validation
- **PostgreSQL**: Database (via Supabase)
- **Cloudinary**: File storage

### Frontend
- **React**: UI library
- **TypeScript**: Type safety
- **Styled Components**: CSS-in-JS styling
- **React Router**: Client-side routing
- **Axios**: HTTP client

## 📊 Data Flow

1. **Frontend** → User submits form
2. **Cloudinary** → Resume uploaded
3. **Backend** → Job data + resume URL saved to Supabase
4. **Database** → PostgreSQL stores structured data
5. **Frontend** → Displays updated job list

## 🔍 Troubleshooting

### Common Issues

**Database Connection Error:**
- Check `DATABASE_URL` in `.env`
- Verify Supabase credentials
- Ensure database is accessible

**Cloudinary Upload Fails:**
- Verify `CLOUDINARY_*` environment variables
- Check upload preset configuration
- Ensure file is PDF format

**Frontend Can't Connect to Backend:**
- Check `VITE_API_BASE_URL` in frontend `.env`
- Verify CORS configuration
- Ensure backend is running

### Development Tips

1. **Use .env.example files** as templates
2. **Never commit sensitive data**
3. **Test locally before deploying**
4. **Check logs for detailed error messages**

## 📝 License

This project is open source and available under the [MIT License](LICENSE).