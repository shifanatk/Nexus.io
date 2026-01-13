import { useState } from 'react';
import axios from 'axios';

const Register = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('user'); // Default role is 'user'

  const handleRegister = async (e) => {
    e.preventDefault();
    try {
      // This sends the data to your Node.js Backend
      const res = await axios.post('http://localhost:5000/api/auth/register', {
        username,
        password,
        role
      });
      alert('Registration Successful! You can now login.');
    } catch (err) {
      console.error(err);
      alert('Error registering user.');
    }
  };

  return (
    <div style={{ padding: '20px', maxWidth: '400px', margin: 'auto' }}>
      <h2>Register</h2>
      <form onSubmit={handleRegister}>
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
        
        <label>Select Role:</label>
        <select 
          value={role} 
          onChange={(e) => setRole(e.target.value)}
          style={{ display: 'block', margin: '10px 0', width: '100%', padding: '8px' }}
        >
          <option value="user">User</option>
          <option value="admin">Admin</option>
        </select>

        <button type="submit" style={{ padding: '10px 20px', cursor: 'pointer' }}>
          Sign Up
        </button>
      </form>
    </div>
  );
};

export default Register;