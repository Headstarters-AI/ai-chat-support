import React, { useState } from 'react';
import Register from './Register'; 
import ChatBot from './ChatBot'; 

const Login = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showRegister, setShowRegister] = useState(false); 
  const [error, setError] = useState(''); 
  const [isAuthenticated, setIsAuthenticated] = useState(false); 
  

  const handleLogin = async (e) => {
    e.preventDefault();

    // Example login API request
    const response = await fetch('/api/auth/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ username, password }),
    });

    if (response.ok) {
      const { token, userId, username} = await response.json();
      localStorage.setItem('authToken', token);
      localStorage.setItem('userId', userId);
      localStorage.setItem('username', username);
      setIsAuthenticated(true); 
    } else {
      const { message } = await response.json();
      setError(message || 'Login failed. Please check your credentials.');
    }
  };

  return (
    <div style={{ padding: '20px', maxWidth: '400px', margin: 'auto' }}>
      {isAuthenticated ? (
        <ChatBot /> 
      ) : (
        <>
          {showRegister ? (
            <Register /> 
          ) : (
            <>
              <h2>Login</h2>
              {error && <p style={{ color: 'red' }}>{error}</p>}
              <form onSubmit={handleLogin}>
                <div>
                  <label>Username</label>
                  <input
                    type="text"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    required
                  />
                </div>
                <div>
                  <label>Password</label>
                  <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                  />
                </div>
                <button type="submit">Login</button>
              </form>
              <div style={{ marginTop: '20px' }}>
                <p>
                  Don't have an account?{' '}
                  <button
                    type="button"
                    onClick={() => setShowRegister(true)} 
                    style={{ color: 'blue', textDecoration: 'underline', background: 'none', border: 'none', cursor: 'pointer' }}
                  >
                    Register here
                  </button>
                </p>
              </div>
            </>
          )}
        </>
      )}
    </div>
  );
};

export default Login;
