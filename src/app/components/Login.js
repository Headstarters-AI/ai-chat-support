import React, { useState } from "react";
import Register from "./Register";
import ChatBot from "./ChatBot";

const Login = ({ onLogin }) => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showRegister, setShowRegister] = useState(false);
  const handleRegistrationComplete = () => {
    setShowRegister(false);
  };
  const [error, setError] = useState("");
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isHovered, setIsHovered] = useState(false);

  const handleLogin = async (e) => {
    e.preventDefault();

    // Example login API request
    const response = await fetch("/api/auth/login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ username, password }),
    });

    if (response.ok) {
      const { token, userId, username } = await response.json();
      localStorage.setItem("authToken", token);
      localStorage.setItem("userId", userId);
      localStorage.setItem("username", username);
      setIsAuthenticated(true);
      onLogin();
    } else {
      const { message } = await response.json();
      setError(message || "Login failed. Please check your credentials.");
    }
  };

  return (
    <div
      style={{
        padding: "20px",
        maxWidth: "400px",
        margin: "0 auto",
        border: "3px solid #1A4D2E",
        borderRadius: "5px",
        height: "400px",
        display: "flex",
        flexDirection: "column",
        boxShadow: "0 0 10px rgba(10, 0, 10, 0.1)",
        // backgroundColor: "#1A4D2E",
        // backgroundColor: "#F9F5EB",
        backgroundColor: "white",
      }}
    >
      {isAuthenticated ? (
        <ChatBot />
      ) : (
        <>
          {showRegister ? (
            <Register onRegistrationComplete={handleRegistrationComplete} />
          ) : (
            <>
              <h2
                style={{
                  fontSize: "24px",
                  fontWeight: "400px",
                }}
              >
                Login
              </h2>
              {error && <p style={{ color: "red" }}>{error}</p>}
              <form
                onSubmit={handleLogin}
                style={{
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  justifyContent: "space-evenly",
                  width: "100%",
                  height: "200px",
                  marginTop: "20px",
                }}
              >
                {/* <label>Username</label> */}
                <input
                  type="text"
                  placeholder="Username"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  required
                  style={{
                    border: "2px solid #1A4D2E",
                    width: "100%",
                    height: "40px",
                    paddingLeft: "10px",
                    fontSize: "16px",
                    borderRadius: "5px",
                  }}
                />

                {/* <label>Password</label> */}
                <input
                  type="password"
                  placeholder="Password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  style={{
                    border: "2px solid #1A4D2E",
                    borderRadius: "5px",
                    width: "100%",
                    height: "40px",
                    paddingLeft: "10px",
                    fontSize: "16px",
                  }}
                />

                <button
                  type="submit"
                  className="btn"
                  style={{
                    borderRadius: "5px",
                    width: "100%",
                    height: "40px",
                    paddingLeft: "10px",
                    fontSize: "16px",
                    backgroundColor: "#1A4D2E",
                    color: "white",
                    fontWeight: "bold",
                  }}
                >
                  Login
                </button>
              </form>
              <div style={{ marginTop: "100px" }}>
                <p
                  style={{
                    fontSize: "15px",
                  }}
                >
                  Don't have an account?{" "}
                  <button
                    type="button"
                    onClick={() => setShowRegister(true)}
                    style={{
                      color: isHovered ? "#33cc6f" : "#228047",
                      textDecoration: "none",
                      background: "none",
                      border: "none",
                      fontWeight: "600px",
                      cursor: isHovered ? "pointer" : "default",
                    }}
                    onMouseEnter={() => setIsHovered(true)}
                    onMouseLeave={() => setIsHovered(false)}
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
