import React, { useState } from 'react';
import axios from 'axios';

function RegistrationForm() {
  const [registrationUser, setRegistrationUser] = useState({ name: '', email: '', password: '' });
  const [registrationSuccess, setRegistrationSuccess] = useState(false);
  const [registrationError, setRegistrationError] = useState('');

  const handleRegistrationInputChange = (e) => {
    setRegistrationUser({ ...registrationUser, [e.target.name]: e.target.value });
    setRegistrationError('');
  };

  const handleRegister = async (e) => {
    e.preventDefault();

    // Password validation rules
    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d]{8,}$/;

    if (!passwordRegex.test(registrationUser.password)) {
      setRegistrationError(
        'Password must be 8 characters long and contain at least one uppercase letter, one lowercase letter, and one number.'
      );
      return;
    }

    try {
      const response = await axios.post('http://localhost:5000/api/register', registrationUser);
      console.log('User registered:', response.data);
      setRegistrationSuccess(true);
      setRegistrationError(''); // Clear any previous errors
    } catch (error) {
      console.error('Registration failed:', error);

      if (error.response && error.response.data) {
        const errorMessage = error.response.data.message;
        if (errorMessage === 'Email address is already registered') {
          setRegistrationError(errorMessage);
        } else if (errorMessage === 'Only Gmail addresses are allowed for registration') {
          setRegistrationError(errorMessage);
        } else {
          setRegistrationError('Registration failed. Please try again.');
        }
      } else {
        setRegistrationError('Registration failed. Please try again.');
      }
    }
  };

  return (
    <form onSubmit={handleRegister} className="registration-form">
      <div className="form-group">
        <label htmlFor="name">Name:</label>
        <input
          type="text"
          id="name"
          name="name"
          placeholder="Enter your name"
          value={registrationUser.name}
          onChange={handleRegistrationInputChange}
          className="input-field"
        />
      </div>

      <div className="form-group">
        <label htmlFor="email">Email:</label>
        <input
          type="email"
          id="email"
          name="email"
          placeholder="Enter your email"
          value={registrationUser.email}
          onChange={handleRegistrationInputChange}
          className="input-field"
        />
      </div>

      <div className="form-group">
        <label htmlFor="password">Password:</label>
        <input
          type="password"
          id="password"
          name="password"
          placeholder="Enter your password"
          value={registrationUser.password}
          onChange={handleRegistrationInputChange}
          className="input-field"
        />
      </div>

      <div className="form-group">
        <button type="submit" className="submit-button">
          Register
        </button>
      </div>
      <p className="error-message">{registrationError}</p>
      {registrationSuccess && <p className="success-message">Registered successfully!</p>}
    </form>
  );
}

export default RegistrationForm;
