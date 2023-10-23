import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom'; // Import useNavigate
import './style/Password.css';

const PasswordResetForm = () => {
  const navigate = useNavigate(); // Initialize useNavigate
  const [formData, setFormData] = useState({
    email: '',
    otp: '',
    newPassword: '',
  });
  const [message, setMessage] = useState('');
  const [step, setStep] = useState(0);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleGenerateOTP = async () => {
    try {
      const response = await axios.post('http://localhost:5000/api/generate-otp', { email: formData.email });
      if (response.status === 200) {
        setMessage('OTP sent successfully.');
        setStep(1);
      }
    } catch (error) {
      setMessage('Failed to send OTP.');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const { email, otp, newPassword } = formData;

      // Send a POST request to your backend endpoint for password reset
      const response = await axios.post('http://localhost:5000/api/verify-otp', { email, otp, newPassword });

      if (response.status === 200) {
        setMessage('Password reset successful.');
        // Use navigate to go to a different page or route
        navigate('/'); 
      } else {
        setMessage('Password reset failed.');
      }
    } catch (error) {
      setMessage('Password reset failed.');
    }
  };

  useEffect(() => {
    const timer = setTimeout(() => {
      if (step === 1) {
        setStep(0);
      }
    }, 60000);

    return () => {
      clearTimeout(timer);
    };
  }, [step]);

  return (
    <div className="password-reset-container">
      <h2 className='title'>Password Reset</h2>
      {step === 0 && (
        <div>
          <input
            type="email"
            name="email"
            placeholder="Email"
            value={formData.email}
            onChange={handleInputChange}
            className="form-input"
          />
          <button onClick={handleGenerateOTP} className="generate-otp-button">Generate OTP</button>
        </div>
      )}

      {step === 1 && (
        <form onSubmit={handleSubmit} className="password-reset-form">
          <input
            type="text"
            name="otp"
            placeholder="OTP"
            value={formData.otp}
            onChange={handleInputChange}
            className="form-input"
          />
          <input
            type="password"
            name="newPassword"
            placeholder="New Password"
            value={formData.newPassword}
            onChange={handleInputChange}
            className="form-input"
          />
          <button type="submit" className="form-button">Reset Password</button>
        </form>
      )}

      <p className="message">{message}</p>
    </div>
  );
};

export default PasswordResetForm;
