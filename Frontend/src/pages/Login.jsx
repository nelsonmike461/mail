import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthProvider";

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(null);
  const navigate = useNavigate();
  const { login } = useAuth();

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch(`http://127.0.0.1:8000/api/login/`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Login failed");
      }

      const data = await response.json();
      localStorage.setItem("accessToken", data.access); // Store the access token
      localStorage.setItem("refreshToken", data.refresh); // Store the refresh token
      login(); // Update auth state
      navigate("/"); // Redirect to homepage
    } catch (err) {
      setError(err.message); // Set the error message to display
      console.error("Error:", err);
    }
  };

  return (
    <>
      <form onSubmit={handleSubmit} aria-label="Login Form">
        <fieldset>
          <legend>Login</legend>
          <div>
            <label htmlFor="email">Email</label>
            <input
              type="email"
              id="email"
              autoComplete="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          <div>
            <label htmlFor="password">Password</label>
            <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
          <button type="submit">Login</button>
        </fieldset>
      </form>
      {error && <p>{error}</p>} {/* Display error message if present */}
    </>
  );
}

export default Login;
