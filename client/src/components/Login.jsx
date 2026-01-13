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
      // 1. Send login request
      const res = await axios.post('http://localhost:5000/api/auth/login', {
        username,
        password
      });
      
      // 2. Debugging: Check if token exists in console
      console.log("Server response:", res.data);

      // 3. Check if token exists in response
      if (res.data.token) {
        localStorage.setItem('token', res.data.token);
        
        // Save user data for Dashboard component
        if (res.data.user) {
          localStorage.setItem('user', JSON.stringify(res.data.user));
        }

        alert('Login Successful!');
        
        // 4. Navigate to dashboard
        navigate('/dashboard');
      } else {
        alert('Login failed: No token received');
      }

    } catch (err) {
      console.error(err);
      // Detailed error for debugging
      const errorMessage = err.response?.data?.message || 'Invalid Credentials or Server Error';
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