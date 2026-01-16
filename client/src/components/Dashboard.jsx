import { useState, useEffect } from 'react';
import axios from 'axios';
import { Link, useNavigate } from 'react-router-dom';

const Dashboard = () => {
  const [spaces, setSpaces] = useState([]);
  const [newSpaceName, setNewSpaceName] = useState('');
  const navigate = useNavigate();
  
  // Get user from storage
  const user = JSON.parse(localStorage.getItem('user'));

  useEffect(() => {
    if (!user) {
      navigate('/login');
    } else {
      fetchSpaces();
    }
  }, []);

  const fetchSpaces = async () => {
    try {
      // Pass userId to get ONLY my spaces
      const res = await axios.get(`https://nexus-io.onrender.com/api/spaces?userId=${user._id}`);
      setSpaces(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  const handleCreateSpace = async (e) => {
    e.preventDefault();
    if (!newSpaceName) return;

    try {
      await axios.post('https://nexus-io.onrender.com/api/spaces', {
        name: newSpaceName,
        owner: user._id // <--- Send the owner ID
      });
      setNewSpaceName('');
      fetchSpaces(); // Refresh list
    } catch (err) {
      console.error(err);
      alert('Error creating space');
    }
  };

  return (
    <div className="container" style={{maxWidth: '1000px'}}>
      <h1 style={{color: 'white'}}>Welcome, {user?.username} 👋</h1>
      
      {/* --- CREATE SPACE SECTION --- */}
      <div className="card" style={{marginBottom: '30px', border: '1px solid #7c4dff'}}>
        <h3>Create New Workspace</h3>
        <form onSubmit={handleCreateSpace} style={{display: 'flex', gap: '10px'}}>
          <input 
            type="text" 
            placeholder="Workspace Name (e.g. Marketing Team)" 
            value={newSpaceName}
            onChange={(e) => setNewSpaceName(e.target.value)}
            style={{marginBottom: 0}}
          />
          <button className="btn-primary" style={{width: 'auto'}}>Create</button>
        </form>
      </div>

      {/* --- SPACES LIST --- */}
      <h3 style={{color: '#aaa'}}>Your Workspaces</h3>
      <div style={{display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))', gap: '20px'}}>
        
        {spaces.map((space) => (
          <Link key={space._id} to={`/space/${space._id}`} style={{textDecoration: 'none'}}>
            <div className="card" style={{height: '100%', transition: 'transform 0.2s', cursor: 'pointer'}}>
              <h2 style={{marginTop: 0, color: '#fff'}}>🏢 {space.name}</h2>
              <p style={{color: '#888', fontSize: '0.9rem'}}>
                {space.members.length} Members
              </p>
              <div style={{marginTop: '10px', fontSize: '0.8rem', color: '#7c4dff'}}>
                Enter Workspace →
              </div>
            </div>
          </Link>
        ))}

        {spaces.length === 0 && (
          <p style={{color: '#666'}}>No workspaces yet. Create one above!</p>
        )}
      </div>
    </div>
  );
};

export default Dashboard;