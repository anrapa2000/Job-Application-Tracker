import React, { useEffect, useState } from "react";
import styled from "styled-components";
import { useParams, useNavigate } from "react-router-dom";
import api from "../api";

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
  resume_url?: string;
};

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

const MainCard = styled.div`
  background: white;
  border-radius: 0.75rem;
  box-shadow: 0 1px 3px 0 rgba(0, 0, 0, 0.1);
  border: 1px solid #e5e7eb;
  overflow: hidden;
`;

const CardHeader = styled.div`
  padding: 2rem;
  border-bottom: 1px solid #e5e7eb;

  @media (min-width: 640px) {
    padding: 2rem 2.5rem;
  }
`;

const JobInfo = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1rem;

  @media (min-width: 640px) {
    flex-direction: row;
    align-items: center;
    justify-content: space-between;
  }
`;

const JobTitle = styled.h2`
  font-size: 1.5rem;
  font-weight: 600;
  color: #111827;
  margin: 0;
`;

const CompanyName = styled.p`
  color: #6b7280;
  font-size: 1rem;
  margin: 0;
`;

const StatusBadge = styled.span<{ status: string }>`
  display: inline-flex;
  align-items: center;
  padding: 0.25rem 0.75rem;
  font-size: 0.75rem;
  font-weight: 600;
  border-radius: 0.5rem;
  border: 1px solid;

  ${(props) => {
    switch (props.status.toLowerCase()) {
      case "applied":
        return `
          background-color: #dbeafe;
          color: #1e40af;
          border-color: #bfdbfe;
        `;
      case "interviewing":
        return `
          background-color: #fef3c7;
          color: #92400e;
          border-color: #fde68a;
        `;
      case "rejected":
        return `
          background-color: #fee2e2;
          color: #991b1b;
          border-color: #fecaca;
        `;
      case "offer":
        return `
          background-color: #dcfce7;
          color: #166534;
          border-color: #bbf7d0;
        `;
      default:
        return `
          background-color: #f3f4f6;
          color: #374151;
          border-color: #d1d5db;
        `;
    }
  }}
`;

const AppliedDate = styled.div`
  color: #6b7280;
  font-size: 0.875rem;
`;

const CardContent = styled.div`
  padding: 2rem;

  @media (min-width: 640px) {
    padding: 2rem 2.5rem;
  }
`;

const ContentGrid = styled.div`
  display: grid;
  grid-template-columns: 1fr;
  gap: 2rem;

  @media (min-width: 1024px) {
    grid-template-columns: 2fr 1fr;
  }
`;

const ContentSection = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
`;

const Section = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
`;

const SectionTitle = styled.h3`
  font-size: 1rem;
  font-weight: 600;
  color: #111827;
  margin: 0;
`;

const JobUrl = styled.a`
  color: #2563eb;
  text-decoration: none;
  font-size: 0.875rem;
  word-break: break-all;

  &:hover {
    text-decoration: underline;
  }
`;

const Description = styled.div`
  color: #374151;
  font-size: 0.875rem;
  line-height: 1.6;
  white-space: pre-wrap;
`;

const Notes = styled.div`
  color: #374151;
  font-size: 0.875rem;
  line-height: 1.6;
  white-space: pre-wrap;
`;

const ResumeSection = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1rem;
`;

const ResumeCard = styled.div`
  background-color: #f8fafc;
  border: 1px solid #e2e8f0;
  border-radius: 0.5rem;
  padding: 1.5rem;
`;

const ResumeTitle = styled.h4`
  font-size: 0.875rem;
  font-weight: 600;
  color: #111827;
  margin: 0 0 1rem 0;
`;

const ResumeActions = styled.div`
  display: flex;
  gap: 1rem;

  @media (max-width: 640px) {
    flex-direction: column;
  }
`;

const EditButton = styled.button`
  display: inline-flex;
  align-items: center;
  padding: 0.75rem 1.5rem;
  background-color: #059669;
  color: white;
  font-weight: 500;
  border-radius: 0.5rem;
  border: none;
  cursor: pointer;
  transition: all 0.2s;
  font-size: 0.875rem;

  &:hover {
    background-color: #047857;
  }

  &:focus {
    outline: none;
    box-shadow: 0 0 0 3px rgba(5, 150, 105, 0.5);
  }
`;

const ResumeButton = styled.button`
  display: inline-flex;
  align-items: center;
  padding: 0.5rem 1rem;
  background-color: #2563eb;
  color: white;
  font-weight: 500;
  border-radius: 0.5rem;
  border: none;
  cursor: pointer;
  transition: all 0.2s;
  font-size: 0.875rem;

  &:hover {
    background-color: #1d4ed8;
  }

  &:focus {
    outline: none;
    box-shadow: 0 0 0 3px rgba(37, 99, 235, 0.5);
  }
`;

const DownloadButton = styled.a`
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
  text-decoration: none;

  &:hover {
    background-color: #f9fafb;
    border-color: #9ca3af;
  }

  &:focus {
    outline: none;
    box-shadow: 0 0 0 3px rgba(55, 65, 81, 0.1);
  }
`;

const ButtonIcon = styled.svg`
  width: 1rem;
  height: 1rem;
  margin-right: 0.5rem;
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
    0% {
      transform: rotate(0deg);
    }
    100% {
      transform: rotate(360deg);
    }
  }
`;

const LoadingText = styled.p`
  margin-top: 1rem;
  color: #6b7280;
`;

const ErrorContainer = styled.div`
  min-height: 100vh;
  background-color: #f9fafb;
  display: flex;
  justify-content: center;
  align-items: center;
`;

const ErrorContent = styled.div`
  text-align: center;
  max-width: 24rem;
`;

const ErrorIcon = styled.div`
  margin: 0 auto 1.5rem;
  width: 6rem;
  height: 6rem;
  background-color: #fee2e2;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
`;

const ErrorIconSvg = styled.svg`
  height: 3rem;
  width: 3rem;
  color: #dc2626;
`;

const ErrorTitle = styled.h2`
  font-size: 1.25rem;
  font-weight: 600;
  color: #111827;
  margin-bottom: 0.75rem;
`;

const ErrorMessage = styled.p`
  color: #6b7280;
  margin-bottom: 2rem;
`;

const ErrorButton = styled.button`
  display: inline-flex;
  align-items: center;
  padding: 0.75rem 1.5rem;
  background-color: #2563eb;
  color: white;
  font-weight: 500;
  border-radius: 0.5rem;
  border: none;
  cursor: pointer;
  transition: all 0.2s;
  font-size: 0.875rem;

  &:hover {
    background-color: #1d4ed8;
  }

  &:focus {
    outline: none;
    box-shadow: 0 0 0 3px rgba(37, 99, 235, 0.5);
  }
`;

const JobDetails: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [job, setJob] = useState<Job | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchJob = async () => {
      try {
        const response = await api.get(`/jobs/${id}`);
        setJob(response.data);
      } catch (error) {
        console.error("Error fetching job:", error);
        setError("Job not found or failed to load");
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchJob();
    }
  }, [id]);

  if (loading) {
    return (
      <LoadingContainer>
        <LoadingContent>
          <Spinner />
          <LoadingText>Loading job details...</LoadingText>
        </LoadingContent>
      </LoadingContainer>
    );
  }

  if (error || !job) {
    return (
      <ErrorContainer>
        <ErrorContent>
          <ErrorIcon>
            <ErrorIconSvg fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z"
              />
            </ErrorIconSvg>
          </ErrorIcon>
          <ErrorTitle>Job Not Found</ErrorTitle>
          <ErrorMessage>
            The job you're looking for doesn't exist or has been removed.
          </ErrorMessage>
          <ErrorButton onClick={() => navigate("/")}>
            <BackIcon fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M10 19l-7-7m0 0l7-7m-7 7h18"
              />
            </BackIcon>
            Back to Dashboard
          </ErrorButton>
        </ErrorContent>
      </ErrorContainer>
    );
  }

  return (
    <Container>
      <ContentWrapper>
        <Header>
          <BackButton onClick={() => navigate("/")}>
            <BackIcon fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M10 19l-7-7m0 0l7-7m-7 7h18"
              />
            </BackIcon>
            Back to Dashboard
          </BackButton>
          <Title>{job.job_title}</Title>
          <Subtitle>Job Application Details</Subtitle>
        </Header>

        <MainCard>
          <CardHeader>
            <JobInfo>
              <div>
                <JobTitle>{job.job_title}</JobTitle>
                <CompanyName>{job.company_name}</CompanyName>
              </div>
              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "flex-end",
                  gap: "0.5rem",
                }}
              >
                <StatusBadge status={job.status}>{job.status}</StatusBadge>
                <AppliedDate>Applied: {job.applied_date}</AppliedDate>
                <EditButton onClick={() => navigate(`/job/${job.id}/edit`)}>
                  <ButtonIcon
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                    />
                  </ButtonIcon>
                  Edit Application
                </EditButton>
              </div>
            </JobInfo>
          </CardHeader>

          <CardContent>
            <ContentGrid>
              <ContentSection>
                {job.job_url && (
                  <Section>
                    <SectionTitle>Job URL</SectionTitle>
                    <JobUrl
                      href={job.job_url}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      {job.job_url}
                    </JobUrl>
                  </Section>
                )}

                {job.location && (
                  <Section>
                    <SectionTitle>Location</SectionTitle>
                    <div style={{ fontSize: "0.875rem", color: "#374151" }}>
                      {job.location}
                    </div>
                  </Section>
                )}

                {job.job_description && (
                  <Section>
                    <SectionTitle>Job Description</SectionTitle>
                    <Description>{job.job_description}</Description>
                  </Section>
                )}

                {job.notes && (
                  <Section>
                    <SectionTitle>Notes</SectionTitle>
                    <Notes>{job.notes}</Notes>
                  </Section>
                )}
              </ContentSection>

              <ContentSection>
                {job.resume_url && (
                  <ResumeSection>
                    <SectionTitle>Resume</SectionTitle>
                    <ResumeCard>
                      <ResumeTitle>Uploaded Resume</ResumeTitle>
                      <ResumeActions>
                        <ResumeButton
                          onClick={() => window.open(job.resume_url, "_blank")}
                        >
                          <ButtonIcon
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                            />
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                            />
                          </ButtonIcon>
                          View PDF
                        </ResumeButton>
                        <DownloadButton href={job.resume_url} download>
                          <ButtonIcon
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                            />
                          </ButtonIcon>
                          Download
                        </DownloadButton>
                      </ResumeActions>
                    </ResumeCard>
                  </ResumeSection>
                )}
              </ContentSection>
            </ContentGrid>
          </CardContent>
        </MainCard>
      </ContentWrapper>
    </Container>
  );
};

export default JobDetails;
