import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

function LoginForm() {
  const [loginUser, setLoginUser] = useState({ email: '', password: '' });
  const [loginError, setLoginError] = useState('');
  const navigate = useNavigate();

  const handleLoginInputChange = (e) => {
    setLoginUser({ ...loginUser, [e.target.name]: e.target.value });
    setLoginError('');
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post('http://localhost:5000/api/login', loginUser);
      console.log('User logged in:', response.data);
      navigate('/dashboard'); // Redirect to the dashboard upon successful login
    } catch (error) {
      if (error.response) {
        if (error.response.status === 401) {
          // Unauthorized - Invalid email or password
          setLoginError('Email or password is wrong');
        } else {
          console.error('Login failed:', error);
          setLoginError('Login failed. Please try again.');
        }
      }
    }
  };

  return (
    <form onSubmit={handleLogin} className="login-form">
      <div className="form-group">
        <label htmlFor="loginEmail">Email:</label>
        <input
          type="email"
          id="loginEmail"
          name="email"
          placeholder="Enter your email"
          value={loginUser.email}
          onChange={handleLoginInputChange}
          className="input-field"
        />
      </div>

      <div className="form-group">
        <label htmlFor="loginPassword">Password:</label>
        <input
          type="password"
          id="loginPassword"
          name="password"
          placeholder="Enter your password"
          value={loginUser.password}
          onChange={handleLoginInputChange}
          className="input-field"
        />
      </div>

      <div className="form-group">
        <button type="submit" className="submit-button">
          Login
        </button>
      </div>
      <p className="error-message">{loginError}</p>
      <button className="changePassword" onClick={() => navigate('/reset')}>
        Forgot Password
      </button>
    </form>
  );
}

export default LoginForm;
