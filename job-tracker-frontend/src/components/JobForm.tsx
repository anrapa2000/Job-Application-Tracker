import React, { useState } from 'react';
import styled from 'styled-components';
import { useNavigate } from 'react-router-dom';
import api from '../api';

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
  const [loading, setLoading] = useState(false);
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
      setError('');
    } else if (file) {
      setError('Please upload a PDF file');
      setResumeFile(null);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!resumeFile) {
      setError('Please upload a resume (PDF)');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const formDataToSend = new FormData();
      formDataToSend.append('resume', resumeFile);
      
      Object.entries(formData).forEach(([key, value]) => {
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

  // Check if form has any data filled in
  const hasData = () => {
    return (
      formData.company_name.trim() !== '' ||
      formData.job_title.trim() !== '' ||
      formData.job_url.trim() !== '' ||
      formData.location.trim() !== '' ||
      formData.job_description.trim() !== '' ||
      formData.notes.trim() !== '' ||
      resumeFile !== null
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
                placeholder="https://example.com/job-posting"
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
    </Container>
  );
};

export default JobForm;
