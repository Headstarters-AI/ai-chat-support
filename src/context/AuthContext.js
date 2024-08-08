import React, { createContext, useState, useEffect } from 'react';
import jwt_decode from "jwt-decode"; // Decode JWT to extract user information
import { useRouter } from 'next/router'; // Next.js router for navigation

// Create an AuthContext to manage user authentication state
const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null); // State to hold the current user
  const [loading, setLoading] = useState(true); // State to manage loading
  const router = useRouter();

  // Check for existing JWT token in local storage on initial load
  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      setUser(jwt_decode(token)); // Decode token to get user details
    }
    setLoading(false); // Set loading to false after check
  }, []);

  // Login function that sends credentials to the backend
  const login = async (email, password) => {
    const res = await fetch('/api/auth/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ email, password }), // Send email and password
    });

    const data = await res.json();
    if (data.token) {
      localStorage.setItem('token', data.token); // Save JWT token to local storage
      setUser(jwt_decode(data.token)); // Decode token to get user details
      router.push('/'); // Redirect to home page after successful login
    }
  };

  // Register function that creates a new user account
  const register = async (email, password) => {
    const res = await fetch('/api/auth/register', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ email, password }), // Send email and password
    });

    if (res.ok) {
      login(email, password); // Auto-login after successful registration
    }
  };

  // Logout function that clears the user session
  const logout = () => {
    localStorage.removeItem('token'); // Remove JWT token from local storage
    setUser(null); // Clear user state
    router.push('/login'); // Redirect to login page
  };

  return (
    // Provide authentication state and functions to the rest of the app
    <AuthContext.Provider value={{ user, login, register, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthContext;
