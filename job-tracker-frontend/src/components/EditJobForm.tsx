import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../api';

type Job = {
  id: number;
  company_name: string;
  job_title: string;
  status: string;
  applied_date: string;
  job_url: string;
  job_description: string;
  notes: string;
  location: string;
  resume_file_path?: string;
};

// Styled Components (reusing from JobForm)
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

const BackButton = styled.button`
  display: inline-flex;
  align-items: center;
  padding: 0.5rem 1rem;
  background-color: white;
  color: #374151;
  font-weight: 500;
  border-radius: 0.5rem;
  border: 1px solid #d1d5db;
  cursor: pointer;
  transition: all 0.2s;
  font-size: 0.875rem;
  margin-bottom: 1rem;
  
  &:hover {
    background-color: #f9fafb;
    border-color: #9ca3af;
  }
  
  &:focus {
    outline: none;
    box-shadow: 0 0 0 3px rgba(55, 65, 81, 0.1);
  }
`;

const BackIcon = styled.svg`
  width: 1rem;
  height: 1rem;
  margin-right: 0.5rem;
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

const CurrentResume = styled.div`
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

const ChangesIndicator = styled.div`
  color: #059669;
  font-size: 0.875rem;
  margin-top: 0.5rem;
  display: flex;
  align-items: center;
  gap: 0.5rem;
`;

const ChangesIcon = styled.svg`
  width: 1rem;
  height: 1rem;
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

const LoadingContainer = styled.div`
  min-height: 100vh;
  background-color: #f9fafb;
  display: flex;
  justify-content: center;
  align-items: center;
`;

const LoadingContent = styled.div`
  text-align: center;
`;

const Spinner = styled.div`
  width: 4rem;
  height: 4rem;
  border: 4px solid #2563eb;
  border-top: 4px solid transparent;
  border-radius: 50%;
  animation: spin 1s linear infinite;
  margin: 0 auto;
  
  @keyframes spin {
    0% { transform: rotate(0deg); }
    100% { transform: rotate(360deg); }
  }
`;

const LoadingText = styled.p`
  margin-top: 1rem;
  color: #6b7280;
`;

const EditJobForm: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [job, setJob] = useState<Job | null>(null);
  const [originalData, setOriginalData] = useState({
    company_name: '',
    job_title: '',
    job_url: '',
    job_description: '',
    notes: '',
    location: '',
    status: 'Applied',
    applied_date: ''
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
  const [formData, setFormData] = useState({
    company_name: '',
    job_title: '',
    job_url: '',
    job_description: '',
    notes: '',
    location: '',
    status: 'Applied',
    applied_date: ''
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
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchJob = async () => {
      try {
        const response = await api.get(`/jobs/${id}`);
        const jobData = response.data;
        setJob(jobData);
        
        const initialData = {
          company_name: jobData.company_name,
          job_title: jobData.job_title,
          job_url: jobData.job_url || '',
          job_description: jobData.job_description || '',
          notes: jobData.notes || '',
          location: jobData.location || '',
          status: jobData.status,
          applied_date: jobData.applied_date
        };
        
        setOriginalData(initialData);
        setFormData(initialData);
      } catch (error) {
        console.error('Error fetching job:', error);
        setError('Failed to load job details');
      } finally {
        setFetching(false);
      }
    };

    if (id) {
      fetchJob();
    }
  }, [id]);

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
      setError('');
    } else if (file) {
      setError('Please upload a PDF file');
      setResumeFile(null);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    setLoading(true);
    setError('');

    try {
      const formDataToSend = new FormData();
      
      Object.entries(formData).forEach(([key, value]) => {
        formDataToSend.append(key, value);
      });

      if (resumeFile) {
        formDataToSend.append('resume', resumeFile);
      }

      await api.put(`/jobs/${id}`, formDataToSend, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      navigate(`/job/${id}`);
    } catch (error) {
      console.error('Error updating job:', error);
      setError('Failed to update job. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleFileClick = () => {
    document.getElementById('resume-upload')?.click();
  };

  // Check if form has any changes
  const hasChanges = () => {
    if (resumeFile) return true; // If new resume is selected, there are changes
    
    return (
      formData.company_name !== originalData.company_name ||
      formData.job_title !== originalData.job_title ||
      formData.job_url !== originalData.job_url ||
      formData.location !== originalData.location ||
      formData.job_description !== originalData.job_description ||
      formData.notes !== originalData.notes ||
      formData.status !== originalData.status ||
      formData.applied_date !== originalData.applied_date
    );
  };

  if (fetching) {
    return (
      <LoadingContainer>
        <LoadingContent>
          <Spinner />
          <LoadingText>Loading job details...</LoadingText>
        </LoadingContent>
      </LoadingContainer>
    );
  }

  if (error && !job) {
    return (
      <LoadingContainer>
        <LoadingContent>
          <div style={{ color: '#dc2626', marginBottom: '1rem' }}>
            <svg width="4rem" height="4rem" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
            </svg>
          </div>
          <h3 style={{ color: '#111827', marginBottom: '0.5rem' }}>Error Loading Job</h3>
          <p style={{ color: '#6b7280', marginBottom: '1rem' }}>{error}</p>
          <button
            onClick={() => navigate('/')}
            style={{
              padding: '0.75rem 1.5rem',
              backgroundColor: '#2563eb',
              color: 'white',
              border: 'none',
              borderRadius: '0.5rem',
              cursor: 'pointer'
            }}
          >
            Back to Dashboard
          </button>
        </LoadingContent>
      </LoadingContainer>
    );
  }

  return (
    <Container>
      <ContentWrapper>
        <Header>
          <BackButton onClick={() => navigate(`/job/${id}`)}>
            <BackIcon fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </BackIcon>
            Back to Job Details
          </BackButton>
          <Title>Edit Job Application</Title>
          <Subtitle>Update your job application details</Subtitle>
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
              <Label>Resume (PDF) - Optional</Label>
              {job?.resume_file_path && (
                <CurrentResume>
                  <FileIcon fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </FileIcon>
                  Current resume uploaded (leave empty to keep existing)
                </CurrentResume>
              )}
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
                      <strong>Click to upload</strong> new resume (optional)
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
            </FormGroup>

            {error && <ErrorMessage>{error}</ErrorMessage>}
            
            {hasChanges() && !loading && (
              <ChangesIndicator>
                <ChangesIcon fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
                </ChangesIcon>
                You have unsaved changes
              </ChangesIndicator>
            )}

            <ButtonGroup>
              <SubmitButton type="submit" $loading={loading} disabled={loading || !hasChanges()}>
                {loading ? (
                  <>
                    <LoadingSpinner />
                    Updating...
                  </>
                ) : (
                  'Update Application'
                )}
              </SubmitButton>
              <CancelButton type="button" onClick={() => navigate(`/job/${id}`)}>
                Cancel
              </CancelButton>
            </ButtonGroup>
          </Form>
        </FormCard>
      </ContentWrapper>
    </Container>
  );
};

export default EditJobForm; 