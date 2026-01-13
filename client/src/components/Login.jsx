import { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const Login = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate(); // Hook to move between pages

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post('http://localhost:5000/api/auth/login', {
        username,
        password
      });
      
      // Save user info to browser storage so they stay logged in
      localStorage.setItem('user', JSON.stringify(res.data));
      
      alert('Login Successful!');
      navigate('/dashboard'); // Go to dashboard after login
    } catch (err) {
      console.error(err);
      alert('Invalid Credentials');
    }
  };

  return (
    <div style={{ padding: '20px', maxWidth: '400px', margin: 'auto' }}>
      <h2>Login</h2>
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
        <button type="submit" style={{ padding: '10px 20px', cursor: 'pointer' }}>
          Login
        </button>
      </form>
    </div>
  );
};

export default Login;