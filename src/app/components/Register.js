import React, { useState } from "react";
import { useRouter } from "next/navigation";
import Login from "./Login"; // Import the Login component

const Register = ({ onRegistrationComplete }) => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isRegistered, setIsRegistered] = useState(false); // State to track if registration is successful
  const router = useRouter();

  const handleRegister = async (e) => {
    e.preventDefault();

    if (password !== confirmPassword) {
      alert("Passwords do not match");
      return;
    }

    const response = await fetch("/api/auth/register", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ username, password }),
    });

    if (response.ok) {
      alert("Registration successful. Please log in.");
      setIsRegistered(true); // Set the state to true to render the Login component
      onRegistrationComplete();
    } else {
      const { message } = await response.json();
      alert(message || "Registration failed. Please try again.");
    }
  };

  if (isRegistered) {
    return <Login />; // Render the Login component if registration is successful
  }

  return (
    <div
      style={{
        minWidth: "250px",
        height: "100%",
        display: "flex",
        flexDirection: "column",
        backgroundColor: "white",
      }}
    >
      <h2
        style={{
          fontSize: "24px",
          fontWeight: "400px",
        }}
      >
        Register
      </h2>
      <form
        onSubmit={handleRegister}
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "space-evenly",
          width: "100%",
          height: "230px",
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

        {/* <label>Confirm Password</label> */}
        <input
          type="password"
          placeholder="Confirm Password"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
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
          style={{
            borderRadius: "5px",
            width: "100%",
            height: "40px",
            paddingLeft: "10px",
            fontSize: "16px",
            backgroundColor: "#1A4D2E",
            color: "white",
            fontWeight: "bold",
            marginTop: "20px",
          }}
        >
          Register
        </button>
      </form>
    </div>
  );
};

export default Register;
