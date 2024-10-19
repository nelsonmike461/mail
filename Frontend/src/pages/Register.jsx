import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

function Register() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch(`http://127.0.0.1:8000/api/register/`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password, confirmation: confirm }),
      });

      if (!response.ok) {
        // Parse the error response for detailed feedback
        const errorData = await response.json();
        throw new Error(errorData.error || "Registration failed");
      }

      // Redirect to login page after successful registration
      navigate("/login");
    } catch (err) {
      setError(err.message); // Set the error message to display
      console.error("Error:", err); // Log error
    }
  };

  return (
    <>
      <form onSubmit={handleSubmit} aria-label="User Register Form">
        <fieldset>
          <legend>Register</legend>
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
          <div>
            <label htmlFor="confirm">Confirm Password</label>
            <input
              type="password"
              id="confirm" // Ensure this ID is unique
              value={confirm}
              onChange={(e) => setConfirm(e.target.value)}
              required
            />
          </div>
          <button type="submit">Register</button>
        </fieldset>
      </form>
      {error && <p>{error}</p>} {/* Display error message if present */}
    </>
  );
}

export default Register;
