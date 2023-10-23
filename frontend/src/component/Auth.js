import React, { useState } from 'react';
import RegistrationForm from './RegistrationForm'; // Import Registration component
import LoginForm from './LoginForm'; // Import Login component

function Auth() {
  const [activeTab, setActiveTab] = useState('login');

  const switchTab = (tab) => {
    setActiveTab(tab);
  };

  return (
    <div className="page-container">
      <div className="registration-container">
        <h2 className="title">Authentication</h2>
        <div className="tab-buttons">
          <button
            className={`auth-button ${activeTab === 'register' ? 'active' : ''}`}
            onClick={() => switchTab('register')}
          >
            Register
          </button>
          <button
            className={`auth-button ${activeTab === 'login' ? 'active' : ''}`}
            onClick={() => switchTab('login')}
          >
            Login
          </button>
        </div>
        {activeTab === 'register' ? (
          <RegistrationForm />
        ) : (
          <LoginForm />
        )}
      </div>
    </div>
  );
}

export default Auth;
