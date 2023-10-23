import React, { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';

export const Dashboard = () => {
  const navigate = useNavigate();
  const logoutTimerRef = useRef(null);
  const [secondsLeft, setSecondsLeft] = useState(5);

  const handleActivity = () => {
    if (logoutTimerRef.current) {
      clearTimeout(logoutTimerRef.current);
    }

    logoutTimerRef.current = setTimeout(() => {
      console.log('User logged out due to inactivity');
      // Perform logout actions or clear user data here

      // Navigate back to the registration form
      navigate('/');
    }, secondsLeft * 1000); // Convert seconds to milliseconds

    // Update the remaining seconds
    setSecondsLeft(5);
  };

  useEffect(() => {
    handleActivity(); // Initial setup
    window.addEventListener('mousemove', handleActivity);
    window.addEventListener('keydown', handleActivity);

    return () => {
      window.removeEventListener('mousemove', handleActivity);
      window.removeEventListener('keydown', handleActivity);
      if (logoutTimerRef.current) {
        clearTimeout(logoutTimerRef.current);
      }
    };
  }, [navigate]);

  useEffect(() => {
    // Update the remaining seconds every second
    const timer = setInterval(() => {
      setSecondsLeft((prevSeconds) => {
        if (prevSeconds > 0) {
          return prevSeconds - 1;
        }
        return prevSeconds;
      });
    }, 1000);

    return () => {
      clearInterval(timer);
    };
  }, []);

  return (
    <div>
      <h1>Hello</h1>
      <p>Time remaining: {secondsLeft} seconds</p>
      {/* Dashboard content goes here */}
    </div>
  );
};
