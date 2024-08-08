import React, { useState, useContext } from 'react';
import AuthContext from '../context/AuthContext'; // Import the AuthContext

export default function Login() {
  const [email, setEmail] = useState(''); // State for email input
  const [password, setPassword] = useState(''); // State for password input
  const { login } = useContext(AuthContext); // Get the login function from AuthContext

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    login(email, password); // Call login function with email and password
  };

  return (
    <div>
      <h2>Login</h2>
      <form onSubmit={handleSubmit}>
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)} // Update email state on change
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)} // Update password state on change
        />
        <button type="submit">Login</button>
      </form>
    </div>
  );
}
