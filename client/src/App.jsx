import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import Register from './components/Register';
import Login from './components/Login';
import Dashboard from './components/Dashboard';
import SpaceView from './components/SpaceView';
import SubspaceView from './components/t'; // Make sure this file exists!

function App() {
  return (
    <Router>
      {/* Navbar with Dark Theme Styles */}
      <nav style={{ 
        padding: '15px 20px', 
        background: '#1a1a23', 
        borderBottom: '1px solid #2a2a35',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center'
      }}>
        <div style={{ fontWeight: 'bold', fontSize: '1.2rem', color: '#fff' }}>
          Workflow<span style={{ color: '#7c4dff' }}>Manager</span>
        </div>
        
        <div>
          <Link to="/" style={{ color: '#a0a0b0', textDecoration: 'none', marginRight: '20px' }}>Register</Link>
          <Link to="/login" style={{ color: '#fff', textDecoration: 'none' }}>Login</Link>
        </div>
      </nav>

      <div style={{ padding: '20px' }}>
        <Routes>
          <Route path="/" element={<Register />} />
          <Route path="/login" element={<Login />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/space/:id" element={<SpaceView />} />
          <Route path="/subspace/:id" element={<SubspaceView />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;