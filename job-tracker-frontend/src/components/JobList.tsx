import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import api from '../api';
import { Link } from 'react-router-dom';

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

const HeaderContent = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1rem;
  
  @media (min-width: 640px) {
    flex-direction: row;
    align-items: center;
    justify-content: space-between;
  }
`;

const TitleSection = styled.div``;

const Title = styled.h1`
  font-size: 1.875rem;
  font-weight: 700;
  color: #111827;
  margin: 0;
`;

const Subtitle = styled.p`
  margin-top: 0.5rem;
  color: #6b7280;
  font-size: 0.875rem;
`;

const AddButton = styled(Link)`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  padding: 0.75rem 1.5rem;
  background-color: #2563eb;
  color: white;
  font-weight: 500;
  border-radius: 0.75rem;
  text-decoration: none;
  transition: all 0.2s;
  box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1);
  
  &:hover {
    background-color: #1d4ed8;
    box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1);
  }
  
  &:focus {
    outline: none;
    box-shadow: 0 0 0 3px rgba(37, 99, 235, 0.5);
  }
`;

const AddIcon = styled.svg`
  width: 1rem;
  height: 1rem;
  margin-right: 0.5rem;
`;

const StatsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 1rem;
  margin-bottom: 2rem;
  
  @media (min-width: 1024px) {
    grid-template-columns: repeat(4, 1fr);
  }
`;

const StatCard = styled.div`
  background: white;
  border-radius: 0.75rem;
  padding: 1.5rem;
  box-shadow: 0 1px 3px 0 rgba(0, 0, 0, 0.1);
  border: 1px solid #e5e7eb;
  transition: box-shadow 0.2s;
  
  &:hover {
    box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
  }
`;

const StatContent = styled.div`
  display: flex;
  align-items: center;
`;

const StatIcon = styled.div<{ color: string }>`
  padding: 0.5rem;
  background-color: ${props => props.color};
  border-radius: 0.5rem;
`;

const StatIconSvg = styled.svg<{ color: string }>`
  width: 1.5rem;
  height: 1.5rem;
  color: ${props => props.color};
`;

const StatInfo = styled.div`
  margin-left: 1rem;
`;

const StatNumber = styled.div<{ color: string }>`
  font-size: 1.5rem;
  font-weight: 700;
  color: ${props => props.color};
`;

const StatLabel = styled.div`
  font-size: 0.875rem;
  color: #6b7280;
`;

const MainCard = styled.div`
  background: white;
  border-radius: 0.75rem;
  box-shadow: 0 1px 3px 0 rgba(0, 0, 0, 0.1);
  border: 1px solid #e5e7eb;
  overflow: hidden;
`;

const EmptyState = styled.div`
  padding: 1.5rem 4rem;
`;

const EmptyContent = styled.div`
  text-align: center;
  max-width: 24rem;
  margin: 0 auto;
`;

const EmptyIcon = styled.div`
  margin: 0 auto 1.5rem;
  width: 6rem;
  height: 6rem;
  background-color: #f3f4f6;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
`;

const EmptyIconSvg = styled.svg`
  height: 3rem;
  width: 3rem;
  color: #9ca3af;
`;

const EmptyTitle = styled.h3`
  font-size: 1.25rem;
  font-weight: 600;
  color: #111827;
  margin-bottom: 0.75rem;
`;

const EmptyDescription = styled.p`
  color: #6b7280;
  margin-bottom: 2rem;
`;

const TableContainer = styled.div`
  overflow-x: auto;
`;

const Table = styled.table`
  width: 100%;
`;

const TableHead = styled.thead`
  background-color: #f9fafb;
`;

const TableHeader = styled.th`
  padding: 1rem 1.5rem;
  text-align: left;
  font-size: 0.75rem;
  font-weight: 600;
  color: #6b7280;
  text-transform: uppercase;
  letter-spacing: 0.05em;
`;

const TableBody = styled.tbody`
  background: white;
`;

const TableRow = styled.tr`
  transition: background-color 0.2s;
  
  &:hover {
    background-color: #f9fafb;
  }
  
  &:not(:last-child) {
    border-bottom: 1px solid #e5e7eb;
  }
`;

const TableCell = styled.td`
  padding: 1rem 1.5rem;
`;

const JobTitle = styled.div`
  font-size: 0.875rem;
  font-weight: 600;
  color: #111827;
  margin-bottom: 0.25rem;
`;

const CompanyName = styled.div`
  font-size: 0.875rem;
  color: #6b7280;
`;

const StatusSelect = styled.select<{ status: string }>`
  font-size: 0.75rem;
  font-weight: 600;
  padding: 0.25rem 0.75rem;
  border-radius: 0.5rem;
  border: 1px solid;
  cursor: pointer;
  transition: all 0.2s;
  
  ${props => {
    switch (props.status.toLowerCase()) {
      case 'applied':
        return `
          background-color: #dbeafe;
          color: #1e40af;
          border-color: #bfdbfe;
          &:hover { background-color: #bfdbfe; }
        `;
      case 'interviewing':
        return `
          background-color: #fef3c7;
          color: #92400e;
          border-color: #fde68a;
          &:hover { background-color: #fde68a; }
        `;
      case 'rejected':
        return `
          background-color: #fee2e2;
          color: #991b1b;
          border-color: #fecaca;
          &:hover { background-color: #fecaca; }
        `;
      case 'offer':
        return `
          background-color: #dcfce7;
          color: #166534;
          border-color: #bbf7d0;
          &:hover { background-color: #bbf7d0; }
        `;
      default:
        return `
          background-color: #f3f4f6;
          color: #374151;
          border-color: #d1d5db;
          &:hover { background-color: #e5e7eb; }
        `;
    }
  }}
  
  &:focus {
    outline: none;
    box-shadow: 0 0 0 3px rgba(37, 99, 235, 0.5);
  }
`;

const DateText = styled.div`
  font-size: 0.875rem;
  color: #6b7280;
`;

const ActionsContainer = styled.div`
  display: flex;
  align-items: center;
  gap: 0.75rem;
`;

const ActionButton = styled.button<{ variant: 'view' | 'edit' | 'delete' }>`
  display: inline-flex;
  align-items: center;
  padding: 0.5rem 0.75rem;
  font-size: 0.875rem;
  font-weight: 500;
  border-radius: 0.5rem;
  border: none;
  cursor: pointer;
  transition: all 0.2s;
  
  ${props => {
    switch (props.variant) {
      case 'view':
        return `
          color: #2563eb;
          background-color: #eff6ff;
          
          &:hover {
            background-color: #dbeafe;
            color: #1d4ed8;
          }
          
          &:focus {
            outline: none;
            box-shadow: 0 0 0 3px rgba(37, 99, 235, 0.5);
          }
        `;
      case 'edit':
        return `
          color: #059669;
          background-color: #ecfdf5;
          
          &:hover {
            background-color: #d1fae5;
            color: #047857;
          }
          
          &:focus {
            outline: none;
            box-shadow: 0 0 0 3px rgba(5, 150, 105, 0.5);
          }
        `;
      case 'delete':
        return `
          color: #dc2626;
          background-color: #fef2f2;
          
          &:hover {
            background-color: #fee2e2;
            color: #b91c1c;
          }
          
          &:focus {
            outline: none;
            box-shadow: 0 0 0 3px rgba(220, 38, 38, 0.5);
          }
          
          &:disabled {
            opacity: 0.5;
            cursor: not-allowed;
          }
        `;
      default:
        return '';
    }
  }}
`;

const ActionIcon = styled.svg`
  width: 1rem;
  height: 1rem;
  margin-right: 0.25rem;
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

const JobList: React.FC = () => {
  const [jobs, setJobs] = useState<Job[]>([]);
  const [loading, setLoading] = useState(true);
  const [deleteLoading, setDeleteLoading] = useState<number | null>(null);

  useEffect(() => {
    fetchJobs();
  }, []);

  const fetchJobs = async () => {
    try {
      const res = await api.get('/jobs/');
      setJobs(res.data);
    } catch (error) {
      console.error('Error fetching jobs:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (jobId: number) => {
    if (!confirm('Are you sure you want to delete this job application?')) {
      return;
    }

    setDeleteLoading(jobId);
    try {
      await api.delete(`/jobs/${jobId}`);
      setJobs(jobs.filter(job => job.id !== jobId));
    } catch (error) {
      console.error('Error deleting job:', error);
      alert('Failed to delete job. Please try again.');
    } finally {
      setDeleteLoading(null);
    }
  };

  const updateStatus = async (jobId: number, newStatus: string) => {
    try {
      await api.put(`/jobs/${jobId}/status?status=${newStatus}`);
      setJobs(jobs.map(job => 
        job.id === jobId ? { ...job, status: newStatus } : job
      ));
    } catch (error) {
      console.error('Error updating status:', error);
    }
  };

  if (loading) {
    return (
      <LoadingContainer>
        <LoadingContent>
          <Spinner />
          <LoadingText>Loading your applications...</LoadingText>
        </LoadingContent>
      </LoadingContainer>
    );
  }

  return (
    <Container>
      <ContentWrapper>
        {/* Header */}
        <Header>
          <HeaderContent>
            <TitleSection>
              <Title>Job Applications</Title>
              <Subtitle>Track and manage your job search progress</Subtitle>
            </TitleSection>
            <AddButton to="/add">
              <AddIcon fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </AddIcon>
              Add New Job
            </AddButton>
          </HeaderContent>
        </Header>

        {/* Stats */}
        <StatsGrid>
          <StatCard>
            <StatContent>
              <StatIcon color="#f3f4f6">
                <StatIconSvg fill="none" stroke="currentColor" viewBox="0 0 24 24" color="#6b7280">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </StatIconSvg>
              </StatIcon>
              <StatInfo>
                <StatNumber color="#111827">{jobs.length}</StatNumber>
                <StatLabel>Total Applications</StatLabel>
              </StatInfo>
            </StatContent>
          </StatCard>
          
          <StatCard>
            <StatContent>
              <StatIcon color="#dbeafe">
                <StatIconSvg fill="none" stroke="currentColor" viewBox="0 0 24 24" color="#2563eb">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </StatIconSvg>
              </StatIcon>
              <StatInfo>
                <StatNumber color="#2563eb">{jobs.filter(j => j.status === 'Applied').length}</StatNumber>
                <StatLabel>Applied</StatLabel>
              </StatInfo>
            </StatContent>
          </StatCard>
          
          <StatCard>
            <StatContent>
              <StatIcon color="#fef3c7">
                <StatIconSvg fill="none" stroke="currentColor" viewBox="0 0 24 24" color="#d97706">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                </StatIconSvg>
              </StatIcon>
              <StatInfo>
                <StatNumber color="#d97706">{jobs.filter(j => j.status === 'Interviewing').length}</StatNumber>
                <StatLabel>Interviewing</StatLabel>
              </StatInfo>
            </StatContent>
          </StatCard>
          
          <StatCard>
            <StatContent>
              <StatIcon color="#dcfce7">
                <StatIconSvg fill="none" stroke="currentColor" viewBox="0 0 24 24" color="#16a34a">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </StatIconSvg>
              </StatIcon>
              <StatInfo>
                <StatNumber color="#16a34a">{jobs.filter(j => j.status === 'Offer').length}</StatNumber>
                <StatLabel>Offers</StatLabel>
              </StatInfo>
            </StatContent>
          </StatCard>
        </StatsGrid>

        {/* Content */}
        <MainCard>
          {jobs.length === 0 ? (
            <EmptyState>
              <EmptyContent>
                <EmptyIcon>
                  <EmptyIconSvg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </EmptyIconSvg>
                </EmptyIcon>
                <EmptyTitle>No applications yet</EmptyTitle>
                <EmptyDescription>
                  Get started by adding your first job application to track your progress and stay organized.
                </EmptyDescription>
                <AddButton to="/add">
                  <AddIcon fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                  </AddIcon>
                  Add Your First Job
                </AddButton>
              </EmptyContent>
            </EmptyState>
          ) : (
            <TableContainer>
              <Table>
                <TableHead>
                  <tr>
                    <TableHeader>Position & Company</TableHeader>
                    <TableHeader>Location</TableHeader>
                    <TableHeader>Status</TableHeader>
                    <TableHeader>Applied Date</TableHeader>
                    <TableHeader>Actions</TableHeader>
                  </tr>
                </TableHead>
                <TableBody>
                  {jobs.map((job) => (
                    <TableRow key={job.id}>
                      <TableCell>
                        <JobTitle>{job.job_title}</JobTitle>
                        <CompanyName>{job.company_name}</CompanyName>
                      </TableCell>
                      <TableCell>
                        <div style={{ fontSize: '0.875rem', color: '#6b7280' }}>
                          {job.location || 'Not specified'}
                        </div>
                      </TableCell>
                      <TableCell>
                        <StatusSelect
                          value={job.status}
                          onChange={(e) => updateStatus(job.id, e.target.value)}
                          status={job.status}
                        >
                          <option value="Applied">Applied</option>
                          <option value="Interviewing">Interviewing</option>
                          <option value="Rejected">Rejected</option>
                          <option value="Offer">Offer</option>
                        </StatusSelect>
                      </TableCell>
                      <TableCell>
                        <DateText>
                          {job.applied_date}
                        </DateText>
                      </TableCell>
                                             <TableCell>
                         <ActionsContainer>
                           <ActionButton as={Link} to={`/job/${job.id}`} variant="view">
                             <ActionIcon fill="none" stroke="currentColor" viewBox="0 0 24 24">
                               <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                               <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                             </ActionIcon>
                             View Details
                           </ActionButton>
                           <ActionButton as={Link} to={`/job/${job.id}/edit`} variant="edit">
                             <ActionIcon fill="none" stroke="currentColor" viewBox="0 0 24 24">
                               <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                             </ActionIcon>
                             Edit
                           </ActionButton>
                           <ActionButton
                             onClick={() => handleDelete(job.id)}
                             disabled={deleteLoading === job.id}
                             variant="delete"
                           >
                            {deleteLoading === job.id ? (
                              <>
                                <div style={{ 
                                  width: '1rem', 
                                  height: '1rem', 
                                  border: '2px solid #dc2626', 
                                  borderTop: '2px solid transparent',
                                  borderRadius: '50%',
                                  animation: 'spin 1s linear infinite',
                                  marginRight: '0.25rem'
                                }} />
                                Deleting...
                              </>
                            ) : (
                              <>
                                <ActionIcon fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                </ActionIcon>
                                Delete
                              </>
                            )}
                          </ActionButton>
                        </ActionsContainer>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          )}
        </MainCard>
      </ContentWrapper>
    </Container>
  );
};

export default JobList;