"use client";
import React, { useState, useEffect } from "react";
import ChatBot from "./components/ChatBot";
import Login from "./components/Login";
import styles from "./AuthWrapper.module.css";

export default function AuthWrapper() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem("authToken");
    if (token) {
      setIsAuthenticated(true);
    }
    setLoading(false);
  }, []);

  const handleLogin = () => {
    setIsAuthenticated(true);
  };
  const containerStyle = {
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
    minHeight: "100vh",
    width: "100%",
    padding: "20px",
    boxSizing: "border-box",
  };

  if (loading) {
    return <div style={containerStyle}>Loading...</div>;
  }

  if (!isAuthenticated) {
    return (
      <div style={containerStyle}>
        <Login onLogin={handleLogin} />
      </div>
    );
  }

  return (
    <div className={styles.container}>
      <ChatBot />
    </div>
  );
}
