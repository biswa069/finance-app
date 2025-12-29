import React, { useState } from 'react';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';

const Auth = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const { login } = useAuth();
  const [error, setError] = useState('');

  // 1. Get the API URL from the environment file
  // Default to localhost if the variable is missing (safety fallback)
  const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8080/api';

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    
    // 2. CHANGED: Removed '/api' prefix because it is already in API_URL
    const endpoint = isLogin ? '/auth/login' : '/auth/register';
    
    try {
      // 3. CHANGED: Construct the full URL dynamically
      const res = await axios.post(`${API_URL}${endpoint}`, { email, password });
      
      if (isLogin) {
        login(res.data.token);
      } else {
        alert('Registered! Please login.');
        setIsLogin(true);
      }
    } catch (err: any) {
      console.error("Login Error:", err);
      setError(err.response?.data?.msg || 'An error occurred. Check server logs.');
    }
  };

  return (
    <div className="d-flex justify-content-center mt-5">
      <form className="card p-4 shadow" style={{ width: '350px' }} onSubmit={handleSubmit}>
        <h3>{isLogin ? 'Login' : 'Register'}</h3>
        {error && <div className="alert alert-danger">{error}</div>}
        
        <input className="form-control mb-2" placeholder="Email" type="email" 
               onChange={e => setEmail(e.target.value)} required />
        <input className="form-control mb-2" placeholder="Password" type="password" 
               onChange={e => setPassword(e.target.value)} required />
        
        <button className="btn btn-primary w-100">{isLogin ? 'Sign In' : 'Sign Up'}</button>
        
        <p className="mt-3 text-center" style={{ cursor: 'pointer' }} onClick={() => setIsLogin(!isLogin)}>
          {isLogin ? 'Need an account? Register' : 'Have an account? Login'}
        </p>
      </form>
    </div>
  );
};

export default Auth;