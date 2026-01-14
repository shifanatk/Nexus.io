import React from 'react';
import { BrowserRouter as Router, Routes, Route, Link, Navigate, useLocation, useNavigate } from 'react-router-dom';

// Component Imports
import Register from './components/Register';
import Login from './components/Login';
import Dashboard from './components/Dashboard';
import SpaceView from './components/SpaceView';
import SubspaceView from './components/SubspaceView'; 

// Protected Route Component
const ProtectedRoute = ({ children }) => {
  const token = localStorage.getItem('token'); 
  if (!token) {
    return <Navigate to="/login" replace />;
  }
  return children;
};

// Navbar Component
const Navbar = () => {
  const navigate = useNavigate();
  const location = useLocation(); // FIX: Added this so Navbar updates when route changes
  
  const token = localStorage.getItem('token');

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    navigate('/login');
  };

  return (
    <nav style={styles.nav}>
      <div style={styles.logo}>
        {/* FIX: Changed name to NEXUS */}
        <Link to={token ? "/dashboard" : "/"} style={{ textDecoration: 'none', color: 'inherit' }}>
          NEXUS<span style={{ color: '#7c4dff' }}>.io</span>
        </Link>
      </div>

      <div>
        {!token ? (
          <>
            <Link to="/" style={styles.link}>Register</Link>
            <Link to="/login" style={styles.activeLink}>Login</Link>
          </>
        ) : (
          <>
            <Link to="/dashboard" style={styles.link}>Dashboard</Link>
            <button onClick={handleLogout} style={styles.logoutBtn}>Logout</button>
          </>
        )}
      </div>
    </nav>
  );
};

function App() {
  return (
    <Router>
      <Navbar />
      <div style={styles.container}>
        <Routes>
          {/* Public Routes */}
          <Route path="/" element={<Register />} />
          <Route path="/login" element={<Login />} />

          {/* Protected Routes */}
          <Route 
            path="/dashboard" 
            element={
              <ProtectedRoute>
                <Dashboard />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/space/:id" 
            element={
              <ProtectedRoute>
                <SpaceView />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/subspace/:id" 
            element={
              <ProtectedRoute>
                <SubspaceView />
              </ProtectedRoute>
            } 
          />

          {/* Fallback */}
          <Route path="*" element={<div style={{color: '#fff', textAlign: 'center', marginTop: '50px'}}>404 - Page Not Found</div>} />
        </Routes>
      </div>
    </Router>
  );
}

// Styling (Dark Theme)
const styles = {
  nav: {
    padding: '15px 20px',
    background: '#1a1a23',
    borderBottom: '1px solid #2a2a35',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    position: 'sticky',
    top: 0,
    zIndex: 1000
  },
  logo: {
    fontWeight: 'bold',
    fontSize: '1.5rem', // Made slightly bigger
    color: '#fff',
    letterSpacing: '1px'
  },
  link: {
    color: '#a0a0b0',
    textDecoration: 'none',
    marginRight: '20px',
    fontSize: '0.9rem',
    transition: 'color 0.3s'
  },
  activeLink: {
    color: '#fff',
    textDecoration: 'none',
    fontWeight: '500',
    marginRight: '10px'
  },
  logoutBtn: {
    background: '#ff4d4d',
    color: 'white',
    border: 'none',
    padding: '5px 12px',
    borderRadius: '4px',
    cursor: 'pointer',
    fontSize: '0.9rem'
  },
  container: {
    padding: '20px',
    minHeight: '100vh',
    background: '#13131a', 
    color: '#e0e0e0'
  }
};

export default App;