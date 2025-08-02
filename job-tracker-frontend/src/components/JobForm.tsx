import React, { useState } from 'react';
import styled from 'styled-components';
import { useNavigate } from 'react-router-dom';
import api from '../api';
import { uploadToCloudinary } from '../utils/uploadToCloudinary';

interface Resume {
  public_id: string;
  secure_url: string;
  filename: string;
  created_at: string;
  job_id?: number;
  company_name?: string;
  job_title?: string;
  company_folder?: string;
}

// Styled Components
const Container = styled.div`
  min-height: 100vh;
  background-color: #f9fafb;
`;

const ContentWrapper = styled.div`
  max-width: 1280px;
  margin: 0 auto;
  padding: 2rem 1rem;
  
  @media (min-width: 640px) {
    padding: 2rem 1.5rem;
  }
  
  @media (min-width: 1024px) {
    padding: 2rem 2rem;
  }
`;

const Header = styled.div`
  margin-bottom: 2rem;
`;

const Title = styled.h1`
  font-size: 1.875rem;
  font-weight: 700;
  color: #111827;
  margin: 0 0 0.5rem 0;
`;

const Subtitle = styled.p`
  color: #6b7280;
  font-size: 0.875rem;
  margin: 0;
`;

const FormCard = styled.div`
  background: white;
  border-radius: 0.75rem;
  box-shadow: 0 1px 3px 0 rgba(0, 0, 0, 0.1);
  border: 1px solid #e5e7eb;
  padding: 2rem;
  
  @media (min-width: 640px) {
    padding: 2rem 2.5rem;
  }
`;

const Form = styled.form`
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
`;

const FormSection = styled.div`
  display: grid;
  grid-template-columns: 1fr;
  gap: 1.5rem;
  
  @media (min-width: 640px) {
    grid-template-columns: repeat(2, 1fr);
  }
`;

const FormGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
`;

const Label = styled.label`
  font-size: 0.875rem;
  font-weight: 600;
  color: #374151;
`;

const Required = styled.span`
  color: #dc2626;
  margin-left: 0.25rem;
`;

const Input = styled.input`
  padding: 0.75rem;
  border: 1px solid #d1d5db;
  border-radius: 0.5rem;
  font-size: 0.875rem;
  transition: all 0.2s;
  
  &:focus {
    outline: none;
    border-color: #2563eb;
    box-shadow: 0 0 0 3px rgba(37, 99, 235, 0.1);
  }
  
  &::placeholder {
    color: #9ca3af;
  }
`;

const TextArea = styled.textarea`
  padding: 0.75rem;
  border: 1px solid #d1d5db;
  border-radius: 0.5rem;
  font-size: 0.875rem;
  font-family: inherit;
  resize: vertical;
  min-height: 6rem;
  transition: all 0.2s;
  
  &:focus {
    outline: none;
    border-color: #2563eb;
    box-shadow: 0 0 0 3px rgba(37, 99, 235, 0.1);
  }
  
  &::placeholder {
    color: #9ca3af;
  }
`;

const FileUploadContainer = styled.div`
  border: 2px dashed #d1d5db;
  border-radius: 0.5rem;
  padding: 2rem;
  text-align: center;
  transition: all 0.2s;
  cursor: pointer;
  
  &:hover {
    border-color: #2563eb;
    background-color: #f8fafc;
  }
`;

const FileUploadInput = styled.input`
  display: none;
`;

const FileUploadContent = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 1rem;
`;

const FileUploadIcon = styled.svg`
  width: 3rem;
  height: 3rem;
  color: #9ca3af;
`;

const FileUploadText = styled.div`
  color: #6b7280;
  font-size: 0.875rem;
`;

const FileUploadHint = styled.div`
  color: #9ca3af;
  font-size: 0.75rem;
`;

const SelectedFile = styled.div`
  margin-top: 1rem;
  padding: 0.75rem;
  background-color: #f0f9ff;
  border: 1px solid #bae6fd;
  border-radius: 0.5rem;
  color: #0369a1;
  font-size: 0.875rem;
  display: flex;
  align-items: center;
  gap: 0.5rem;
`;

const FileIcon = styled.svg`
  width: 1rem;
  height: 1rem;
`;

const ButtonGroup = styled.div`
  display: flex;
  gap: 1rem;
  margin-top: 1rem;
  
  @media (max-width: 640px) {
    flex-direction: column;
  }
`;

const SubmitButton = styled.button<{ $loading: boolean }>`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  padding: 0.75rem 1.5rem;
  background-color: #2563eb;
  color: white;
  font-weight: 500;
  border-radius: 0.5rem;
  border: none;
  cursor: pointer;
  transition: all 0.2s;
  font-size: 0.875rem;
  
  &:hover:not(:disabled) {
    background-color: #1d4ed8;
  }
  
  &:focus:not(:disabled) {
    outline: none;
    box-shadow: 0 0 0 3px rgba(37, 99, 235, 0.5);
  }
  
  &:disabled {
    opacity: 0.4;
    cursor: not-allowed;
    background-color: #9ca3af;
  }
`;

const CancelButton = styled.button`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  padding: 0.75rem 1.5rem;
  background-color: white;
  color: #374151;
  font-weight: 500;
  border-radius: 0.5rem;
  border: 1px solid #d1d5db;
  cursor: pointer;
  transition: all 0.2s;
  font-size: 0.875rem;
  
  &:hover {
    background-color: #f9fafb;
    border-color: #9ca3af;
  }
  
  &:focus {
    outline: none;
    box-shadow: 0 0 0 3px rgba(55, 65, 81, 0.1);
  }
`;

const ErrorMessage = styled.div`
  color: #dc2626;
  font-size: 0.875rem;
  margin-top: 0.5rem;
`;

const LoadingSpinner = styled.div`
  width: 1rem;
  height: 1rem;
  border: 2px solid white;
  border-top: 2px solid transparent;
  border-radius: 50%;
  animation: spin 1s linear infinite;
  margin-right: 0.5rem;
  
  @keyframes spin {
    0% { transform: rotate(0deg); }
    100% { transform: rotate(360deg); }
  }
`;

const ResumeSelectorContainer = styled.div`
  margin-top: 1rem;
`;

const ResumeSelectorButton = styled.button`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.75rem 1rem;
  background-color: #f8fafc;
  border: 1px solid #d1d5db;
  border-radius: 0.5rem;
  font-size: 0.875rem;
  color: #374151;
  cursor: pointer;
  transition: all 0.2s;
  
  &:hover {
    background-color: #f1f5f9;
    border-color: #94a3b8;
  }
`;

const ResumeSelectorModal = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
`;

const ResumeSelectorContent = styled.div`
  background: white;
  border-radius: 1rem;
  padding: 0;
  max-width: 700px;
  width: 90%;
  max-height: 85vh;
  overflow: hidden;
  box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.25);
  display: flex;
  flex-direction: column;
`;

const ResumeSelectorHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1.5rem 2rem;
  border-bottom: 1px solid #e5e7eb;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  border-radius: 1rem 1rem 0 0;
`;

const ResumeSelectorTitle = styled.h3`
  font-size: 1.25rem;
  font-weight: 700;
  color: white;
  margin: 0;
  display: flex;
  align-items: center;
  gap: 0.5rem;
`;

const CloseButton = styled.button`
  background: rgba(255, 255, 255, 0.2);
  border: none;
  font-size: 1.25rem;
  color: white;
  cursor: pointer;
  padding: 0.5rem;
  border-radius: 0.5rem;
  width: 2rem;
  height: 2rem;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.2s;
  
  &:hover {
    background: rgba(255, 255, 255, 0.3);
    transform: scale(1.1);
  }
`;

const ResumeList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
  padding: 1.5rem 2rem;
  overflow-y: auto;
  flex: 1;
  max-height: 60vh;
`;

const SearchContainer = styled.div`
  padding: 1.5rem 2rem 0;
  border-bottom: 1px solid #e5e7eb;
`;

const SearchInput = styled.input`
  width: 100%;
  padding: 0.75rem 1rem;
  border: 1px solid #d1d5db;
  border-radius: 0.5rem;
  font-size: 0.875rem;
  background-color: #f9fafb;
  
  &:focus {
    outline: none;
    border-color: #667eea;
    box-shadow: 0 0 0 3px rgba(102, 126, 234, 0.1);
  }
  
  &::placeholder {
    color: #9ca3af;
  }
`;

const ResumeItem = styled.div<{ $selected?: boolean }>`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 1rem;
  border: 2px solid ${props => props.$selected ? '#667eea' : '#e5e7eb'};
  border-radius: 0.75rem;
  cursor: pointer;
  transition: all 0.2s;
  background-color: ${props => props.$selected ? '#f0f4ff' : 'white'};
  
  &:hover {
    background-color: ${props => props.$selected ? '#e6f0ff' : '#f9fafb'};
    border-color: ${props => props.$selected ? '#667eea' : '#d1d5db'};
    transform: translateY(-1px);
    box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
  }
`;

const ResumeItemInfo = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;
`;

const ResumeItemName = styled.span`
  font-size: 0.875rem;
  font-weight: 600;
  color: #1f2937;
  display: block;
  margin-bottom: 0.25rem;
`;

const ResumeItemDate = styled.span`
  font-size: 0.75rem;
  color: #6b7280;
  display: block;
`;

const CompanyHeader = styled.div`
  font-size: 0.875rem;
  font-weight: 700;
  color: #1f2937;
  background: linear-gradient(135deg, #f3f4f6 0%, #e5e7eb 100%);
  padding: 0.75rem 1rem;
  border-radius: 0.5rem;
  margin-bottom: 0.75rem;
  text-transform: capitalize;
  border-left: 4px solid #667eea;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  
  &::before {
    content: "🏢";
    font-size: 1rem;
  }
`;

const ResumeItemActions = styled.div`
  display: flex;
  gap: 0.5rem;
  align-items: center;
`;

const ViewButton = styled.button`
  padding: 0.5rem 1rem;
  background-color: #f3f4f6;
  color: #374151;
  border: 1px solid #d1d5db;
  border-radius: 0.375rem;
  font-size: 0.875rem;
  cursor: pointer;
  transition: all 0.2s;
  
  &:hover {
    background-color: #e5e7eb;
  }
`;

const SelectButton = styled.button<{ $selected?: boolean }>`
  padding: 0.5rem 1rem;
  background-color: ${props => props.$selected ? '#059669' : '#2563eb'};
  color: white;
  border: none;
  border-radius: 0.375rem;
  font-size: 0.875rem;
  cursor: pointer;
  transition: all 0.2s;
  
  &:hover {
    background-color: ${props => props.$selected ? '#047857' : '#1d4ed8'};
  }
`;

const UploadNewButton = styled.button`
  width: 100%;
  padding: 0.75rem;
  background-color: #f8fafc;
  border: 1px solid #d1d5db;
  border-radius: 0.5rem;
  font-size: 0.875rem;
  color: #374151;
  cursor: pointer;
  transition: all 0.2s;
  
  &:hover {
    background-color: #f1f5f9;
    border-color: #94a3b8;
  }
`;

const JobForm: React.FC = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    company_name: '',
    job_title: '',
    job_url: '',
    job_description: '',
    notes: '',
    location: '',
    status: 'Applied',
    applied_date: new Date().toLocaleDateString('en-CA') // YYYY-MM-DD format
  } as {
    company_name: string;
    job_title: string;
    job_url: string;
    job_description: string;
    notes: string;
    location: string;
    status: string;
    applied_date: string;
  });
  const [resumeFile, setResumeFile] = useState<File | null>(null);
  const [selectedResumeUrl, setSelectedResumeUrl] = useState<string>('');
  const [existingResumes, setExistingResumes] = useState<Resume[]>([]);
  const [showResumeSelector, setShowResumeSelector] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(false);
  const [resumeLoading, setResumeLoading] = useState(false);
  const [error, setError] = useState('');

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file && file.type === 'application/pdf') {
      setResumeFile(file);
      setSelectedResumeUrl(''); // Clear selected resume when uploading new file
      setError('');
    } else if (file) {
      setError('Please upload a PDF file');
      setResumeFile(null);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!resumeFile && !selectedResumeUrl) {
      setError('Please upload a resume (PDF) or select an existing one');
      return;
    }

    setLoading(true);
    setError('');

    try {
      let resumeUrl = selectedResumeUrl;
      
      // Only upload new file if no existing resume is selected
      if (!selectedResumeUrl && resumeFile) {
        resumeUrl = await uploadToCloudinary(resumeFile, formData.company_name);
      }
      // If selectedResumeUrl exists, use it directly (no upload needed)

      // Send metadata + resume URL to backend
      const jobData = {
        ...formData,
        resume_url: resumeUrl,
      };
      
      // Convert to FormData for backend compatibility
      const formDataToSend = new FormData();
      Object.entries(jobData).forEach(([key, value]) => {
        formDataToSend.append(key, value);
      });

      await api.post('/jobs/', formDataToSend, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      navigate('/');
    } catch (error) {
      console.error('Error creating job:', error);
      setError('Failed to create job. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleFileClick = () => {
    document.getElementById('resume-upload')?.click();
  };

  const fetchExistingResumes = async () => {
    setResumeLoading(true);
    try {
      const response = await api.get('/cloudinary/resumes');
      setExistingResumes(response.data.resumes || []);
    } catch (error) {
      console.error('Error fetching existing resumes:', error);
    } finally {
      setResumeLoading(false);
    }
  };

  const handleResumeSelection = (resumeUrl: string) => {
    setSelectedResumeUrl(resumeUrl);
    setResumeFile(null); // Clear file upload
    setShowResumeSelector(false);
    setError(''); // Clear any previous errors
  };

  const handleNewResumeUpload = () => {
    setSelectedResumeUrl(''); // Clear selected resume
    setShowResumeSelector(false);
    handleFileClick(); // Open file upload
  };

  // Check if form has any data filled in
  const hasData = () => {
    return (
      formData.company_name.trim() !== '' ||
      formData.job_title.trim() !== '' ||
      formData.job_url.trim() !== '' ||
      formData.location.trim() !== '' ||
      formData.job_description.trim() !== '' ||
      formData.notes.trim() !== '' ||
      resumeFile !== null ||
      selectedResumeUrl !== ''
    );
  };

  return (
    <Container>
      <ContentWrapper>
        <Header>
          <Title>Add New Job Application</Title>
          <Subtitle>Track your job search progress by adding a new application</Subtitle>
        </Header>

        <FormCard>
          <Form onSubmit={handleSubmit}>
            <FormSection>
              <FormGroup>
                <Label>
                  Company Name <Required>*</Required>
                </Label>
                <Input
                  type="text"
                  name="company_name"
                  value={formData.company_name}
                  onChange={handleInputChange}
                  placeholder="Enter company name"
                  required
                />
              </FormGroup>

              <FormGroup>
                <Label>
                  Job Title <Required>*</Required>
                </Label>
                <Input
                  type="text"
                  name="job_title"
                  value={formData.job_title}
                  onChange={handleInputChange}
                  placeholder="Enter job title"
                  required
                />
              </FormGroup>
            </FormSection>

            <FormGroup>
              <Label>Job URL</Label>
              <Input
                type="url"
                name="job_url"
                value={formData.job_url}
                onChange={handleInputChange}
                placeholder="https://company.com/careers/job-posting"
              />
            </FormGroup>

            <FormGroup>
              <Label>Location</Label>
              <Input
                type="text"
                name="location"
                value={formData.location}
                onChange={handleInputChange}
                placeholder="e.g., New York, NY or Remote"
              />
            </FormGroup>

            <FormSection>
              <FormGroup>
                <Label>Status</Label>
                <select
                  name="status"
                  value={formData.status}
                  onChange={handleInputChange}
                  style={{
                    padding: '0.75rem',
                    border: '1px solid #d1d5db',
                    borderRadius: '0.5rem',
                    fontSize: '0.875rem',
                    backgroundColor: 'white'
                  }}
                >
                  <option value="Applied">Applied</option>
                  <option value="Online Assignment">Online Assignment</option>
                  <option value="Interviewing">Interviewing</option>
                  <option value="Rejected">Rejected</option>
                  <option value="Offer">Offer</option>
                </select>
              </FormGroup>

              <FormGroup>
                <Label>Applied Date</Label>
                                  <Input
                    type="date"
                    name="applied_date"
                    value={formData.applied_date}
                    onChange={handleInputChange}
                  />
              </FormGroup>
            </FormSection>

            <FormGroup>
              <Label>Job Description</Label>
              <TextArea
                name="job_description"
                value={formData.job_description}
                onChange={handleInputChange}
                placeholder="Enter job description..."
                rows={4}
              />
            </FormGroup>

            <FormGroup>
              <Label>Notes</Label>
              <TextArea
                name="notes"
                value={formData.notes}
                onChange={handleInputChange}
                placeholder="Add any additional notes..."
                rows={3}
              />
            </FormGroup>

            <FormGroup>
              <Label>
                Resume (PDF) <Required>*</Required>
              </Label>
              <FileUploadContainer onClick={handleFileClick}>
                <FileUploadInput
                  id="resume-upload"
                  type="file"
                  accept=".pdf"
                  onChange={handleFileChange}
                />
                <FileUploadContent>
                  <FileUploadIcon fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                  </FileUploadIcon>
                  <div>
                    <FileUploadText>
                      <strong>Click to upload</strong> or drag and drop
                    </FileUploadText>
                    <FileUploadHint>PDF files only</FileUploadHint>
                  </div>
                </FileUploadContent>
              </FileUploadContainer>
              
              {resumeFile && (
                <SelectedFile>
                  <FileIcon fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </FileIcon>
                  {resumeFile.name}
                </SelectedFile>
              )}
              
              {selectedResumeUrl && (
                <SelectedFile>
                  <FileIcon fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </FileIcon>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontWeight: 600, color: '#059669' }}>✓ Selected existing resume</div>
                    <div style={{ fontSize: '0.75rem', color: '#6b7280', marginTop: '0.25rem' }}>
                      {existingResumes.find(r => r.secure_url === selectedResumeUrl)?.filename || 'Resume'}
                    </div>
                  </div>
                  <button
                    onClick={() => setSelectedResumeUrl('')}
                    style={{
                      background: 'none',
                      border: 'none',
                      color: '#dc2626',
                      cursor: 'pointer',
                      padding: '0.25rem',
                      borderRadius: '0.25rem',
                      fontSize: '0.875rem'
                    }}
                    title="Clear selection"
                  >
                    ✕
                  </button>
                </SelectedFile>
              )}
              
              <ResumeSelectorContainer>
                <ResumeSelectorButton 
                  type="button" 
                  onClick={() => {
                    setShowResumeSelector(true);
                    fetchExistingResumes();
                  }}
                >
                  <FileIcon fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </FileIcon>
                  Select from existing resumes
                </ResumeSelectorButton>
              </ResumeSelectorContainer>
            </FormGroup>

            {error && <ErrorMessage>{error}</ErrorMessage>}

            <ButtonGroup>
              <SubmitButton type="submit" $loading={loading} disabled={loading || !hasData()}>
                {loading ? (
                  <>
                    <LoadingSpinner />
                    Creating...
                  </>
                ) : (
                  'Create Application'
                )}
              </SubmitButton>
              <CancelButton type="button" onClick={() => navigate('/')}>
                Cancel
              </CancelButton>
            </ButtonGroup>
          </Form>
        </FormCard>
      </ContentWrapper>
      
      {/* Resume Selector Modal */}
      {showResumeSelector && (
        <ResumeSelectorModal onClick={() => setShowResumeSelector(false)}>
          <ResumeSelectorContent onClick={(e) => e.stopPropagation()}>
            <ResumeSelectorHeader>
              <ResumeSelectorTitle>
                <FileIcon fill="none" stroke="currentColor" viewBox="0 0 24 24" style={{ width: '1.5rem', height: '1.5rem' }}>
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </FileIcon>
                Select Existing Resume
              </ResumeSelectorTitle>
              <CloseButton onClick={() => setShowResumeSelector(false)}>×</CloseButton>
            </ResumeSelectorHeader>
            
            <SearchContainer>
              <SearchInput
                type="text"
                placeholder="Search resumes by company, job title, or filename..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </SearchContainer>
            
            <ResumeList>
              {resumeLoading ? (
                <div style={{ textAlign: 'center', color: '#6b7280', padding: '2rem' }}>
                  <LoadingSpinner />
                  <div style={{ marginTop: '1rem' }}>Loading resumes...</div>
                </div>
              ) : existingResumes.length > 0 ? (
                (() => {
                  // Filter resumes based on search term
                  const filteredResumes = existingResumes.filter(resume => {
                    const searchLower = searchTerm.toLowerCase();
                    return (
                      resume.company_name?.toLowerCase().includes(searchLower) ||
                      resume.job_title?.toLowerCase().includes(searchLower) ||
                      resume.filename.toLowerCase().includes(searchLower) ||
                      resume.company_folder?.toLowerCase().includes(searchLower)
                    );
                  });

                  // Group resumes by company
                  const groupedResumes = filteredResumes.reduce((groups, resume) => {
                    const company = resume.company_folder || resume.company_name || 'Other';
                    if (!groups[company]) {
                      groups[company] = [];
                    }
                    groups[company].push(resume);
                    return groups;
                  }, {} as Record<string, Resume[]>);

                  if (Object.keys(groupedResumes).length === 0) {
                    return (
                      <div style={{ textAlign: 'center', color: '#6b7280', padding: '2rem' }}>
                        No resumes found matching "{searchTerm}"
                      </div>
                    );
                  }

                  return Object.entries(groupedResumes).map(([company, resumes]) => (
                    <div key={company}>
                      <CompanyHeader>{company}</CompanyHeader>
                      {resumes.map((resume, index) => (
                        <ResumeItem 
                          key={index} 
                          $selected={selectedResumeUrl === resume.secure_url}
                          onClick={() => handleResumeSelection(resume.secure_url)}
                        >
                          <ResumeItemInfo>
                            <FileIcon fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                            </FileIcon>
                            <div>
                              <ResumeItemName>{resume.filename}</ResumeItemName>
                              <ResumeItemDate>
                                {resume.company_name && resume.job_title 
                                  ? `${resume.company_name} - ${resume.job_title}`
                                  : `Uploaded on ${new Date(resume.created_at).toLocaleDateString()}`
                                }
                              </ResumeItemDate>
                            </div>
                          </ResumeItemInfo>
                          <ResumeItemActions>
                            <ViewButton onClick={(e) => {
                              e.stopPropagation();
                              window.open(resume.secure_url, '_blank');
                            }}>
                              View
                            </ViewButton>
                            <SelectButton 
                              onClick={(e) => {
                                e.stopPropagation();
                                handleResumeSelection(resume.secure_url);
                              }}
                              $selected={selectedResumeUrl === resume.secure_url}
                            >
                              {selectedResumeUrl === resume.secure_url ? 'Selected' : 'Select'}
                            </SelectButton>
                          </ResumeItemActions>
                        </ResumeItem>
                      ))}
                    </div>
                  ));
                })()
              ) : (
                <div style={{ textAlign: 'center', color: '#6b7280', padding: '2rem' }}>
                  No existing resumes found
                </div>
              )}
            </ResumeList>
            
            <div style={{ padding: '1.5rem 2rem', borderTop: '1px solid #e5e7eb' }}>
              <UploadNewButton onClick={handleNewResumeUpload}>
                Upload New Resume
              </UploadNewButton>
            </div>
          </ResumeSelectorContent>
        </ResumeSelectorModal>
      )}
    </Container>
  );
};

export default JobForm;
