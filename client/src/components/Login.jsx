import { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const Login = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post('https://nexus-io.onrender.com/api/auth/login', { 
        username, 
        password 
      });

      if (res.data.token) {
        // 1. Save Token
        localStorage.setItem('token', res.data.token);
        
        // 2. Save User (Crucial for Dashboard to work)
        localStorage.setItem('user', JSON.stringify(res.data.user)); 

        alert('Login Successful!');
        
        // 3. Go to Dashboard
        navigate('/dashboard');
        
        // Optional: Force page load to ensure Navbar updates
        window.location.reload(); 
      }
    } catch (err) {
      console.error(err);
      // Detailed error message
      const errorMessage = err.response?.data?.message || err.response?.data || 'Invalid Credentials';
      alert(errorMessage);
    }
  };

  return (
    <div style={{ padding: '20px', maxWidth: '400px', margin: 'auto', color: 'white' }}>
      <h2 style={{color: '#fff'}}>Login to Nexus</h2>
      <form onSubmit={handleLogin}>
        <input 
          type="text" 
          placeholder="Username" 
          onChange={(e) => setUsername(e.target.value)}
          style={{ display: 'block', margin: '10px 0', width: '100%', padding: '8px' }}
        />
        <input 
          type="password" 
          placeholder="Password" 
          onChange={(e) => setPassword(e.target.value)}
          style={{ display: 'block', margin: '10px 0', width: '100%', padding: '8px' }}
        />
        <button type="submit" style={{ padding: '10px 20px', cursor: 'pointer', background: '#7c4dff', border: 'none', color: 'white' }}>
          Login
        </button>
      </form>
    </div>
  );
};

export default Login;