import styled from 'styled-components';
import { BrowserRouter as Router, Routes, Route, Link, useLocation } from 'react-router-dom';
import JobForm from './components/JobForm';
import JobList from './components/JobList';
import JobDetails from './components/JobDetails';
import EditJobForm from './components/EditJobForm';

// Styled Components
const AppContainer = styled.div`
  min-height: 100vh;
  background-color: #f9fafb;
`;

const NavigationContainer = styled.nav`
  background: white;
  border-bottom: 1px solid #e5e7eb;
  box-shadow: 0 1px 3px 0 rgba(0, 0, 0, 0.1);
`;

const NavContent = styled.div`
  max-width: 1280px;
  margin: 0 auto;
  padding: 0 1rem;
  
  @media (min-width: 640px) {
    padding: 0 1.5rem;
  }
  
  @media (min-width: 1024px) {
    padding: 0 2rem;
  }
`;

const NavList = styled.ul`
  display: flex;
  list-style: none;
  margin: 0;
  padding: 0;
  gap: 2rem;
`;

const NavItem = styled.li``;

const NavLink = styled(Link)<{ $isActive: boolean }>`
  display: inline-block;
  padding: 1rem 0;
  color: ${props => props.$isActive ? '#2563eb' : '#6b7280'};
  text-decoration: none;
  font-weight: 500;
  border-bottom: 2px solid transparent;
  transition: all 0.2s;
  
  ${props => props.$isActive && `
    border-bottom-color: #2563eb;
  `}
  
  &:hover {
    color: ${props => props.$isActive ? '#1d4ed8' : '#374151'};
  }
`;

const MainContent = styled.main`
  width: 100%;
  padding: 1.5rem 0;
`;

function Navigation() {
  const location = useLocation();
  
  return (
    <NavigationContainer>
      <NavContent>
        <NavList>
          <NavItem>
            <NavLink to="/" $isActive={location.pathname === '/'}>
              Dashboard
            </NavLink>
          </NavItem>
          <NavItem>
            <NavLink to="/add" $isActive={location.pathname === '/add'}>
              Add Job
            </NavLink>
          </NavItem>
        </NavList>
      </NavContent>
    </NavigationContainer>
  );
}

export default function App() {
  return (
    <Router>
      <AppContainer>
        <Navigation />
        <MainContent>
          <Routes>
            <Route path="/" element={<JobList />} />
            <Route path="/add" element={<JobForm />} />
            <Route path="/job/:id" element={<JobDetails />} />
            <Route path="/job/:id/edit" element={<EditJobForm />} />
          </Routes>
        </MainContent>
      </AppContainer>
    </Router>
  );
}
