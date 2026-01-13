import { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const Dashboard = () => {
  const [spaces, setSpaces] = useState([]);
  const [newSpaceName, setNewSpaceName] = useState('');
  const user = JSON.parse(localStorage.getItem('user'));
  const navigate = useNavigate();

  useEffect(() => {
    if (!user) { navigate('/login'); } 
    else { fetchSpaces(); }
  }, []);

  const fetchSpaces = async () => {
    try {
      const res = await axios.get(`http://localhost:5000/api/spaces/user/${user._id}`);
      setSpaces(res.data);
    } catch (err) { console.error(err); }
  };

  const handleCreateSpace = async (e) => {
    e.preventDefault();
    try {
      await axios.post('http://localhost:5000/api/spaces/create', {
        name: newSpaceName,
        ownerId: user._id
      });
      setNewSpaceName('');
      fetchSpaces();
    } catch (err) { console.error(err); }
  };

  return (
    <div className="container">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '30px' }}>
        <h1>Welcome, {user?.username} 👋</h1>
        <button className="btn-secondary" onClick={() => {
          localStorage.removeItem('user');
          window.location.href = '/login';
        }}>Logout</button>
      </div>
      
      {/* Create Section */}
      <div className="card">
        <h3>🚀 Create New Workspace</h3>
        <form onSubmit={handleCreateSpace} style={{ display: 'flex', gap: '10px' }}>
          <input 
            type="text" 
            placeholder="Project Name..." 
            value={newSpaceName}
            onChange={(e) => setNewSpaceName(e.target.value)}
            style={{ marginBottom: 0 }} // Override global input margin for this row
          />
          <button type="submit" className="btn-primary" style={{ width: 'auto' }}>
            + Create
          </button>
        </form>
      </div>

      {/* List Section */}
      <h3 style={{ color: '#a0a0b0' }}>Your Workspaces</h3>
      <div className="card" style={{ padding: 0, overflow: 'hidden' }}>
        {spaces.length === 0 ? <p style={{ padding: '20px' }}>No spaces yet.</p> : (
          spaces.map((space) => (
            <div 
              key={space._id} 
              className="list-item"
              onClick={() => navigate(`/space/${space._id}`)}
            >
              <strong>{space.name}</strong>
              <span style={{ fontSize: '0.8rem', color: '#666' }}>ID: {space._id.toString().slice(-4)}</span>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default Dashboard;