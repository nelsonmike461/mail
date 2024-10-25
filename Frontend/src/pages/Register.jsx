import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Link } from "react-router-dom"; // Import Link

function Register() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmation, setConfirmation] = useState("");
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      const response = await fetch(`http://127.0.0.1:8000/api/register/`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password, confirmation }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Registration failed");
      }

      navigate("/login");
    } catch (err) {
      setError(err.message);
      console.error("Error:", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center h-screen bg-gray-100">
      <form
        onSubmit={handleSubmit}
        aria-label="User Register Form"
        className="bg-white p-6 rounded shadow-md w-96"
      >
        <fieldset>
          <legend className="text-xl font-bold mb-4">Register</legend>
          <div className="mb-4">
            <label htmlFor="email" className="block mb-1 text-sm">
              Email
            </label>
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => {
                setEmail(e.target.value);
                setError(null);
              }}
              required
              className="border border-gray-300 p-2 w-full rounded"
            />
          </div>
          <div className="mb-4">
            <label htmlFor="password" className="block mb-1 text-sm">
              Password
            </label>
            <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => {
                setPassword(e.target.value);
                setError(null);
              }}
              required
              className="border border-gray-300 p-2 w-full rounded"
            />
          </div>
          <div className="mb-4">
            <label htmlFor="confirmation" className="block mb-1 text-sm">
              Confirm Password
            </label>
            <input
              type="password"
              id="confirmation"
              value={confirmation}
              onChange={(e) => {
                setConfirmation(e.target.value);
                setError(null);
              }}
              required
              className="border border-gray-300 p-2 w-full rounded"
            />
          </div>
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-blue-500 text-white p-2 rounded hover:bg-gray-100 hover:text-black border hover:border-black"
          >
            {loading ? "Registering" : "Register"}
          </button>
        </fieldset>
        {error && (
          <p className="flex text-red-500 mt-2 justify-center">{error}</p>
        )}
        <p className="mt-4 text-center text-sm">
          Already have an account?{" "}
          <Link to="/login" className="text-blue-500 underline">
            Login here
          </Link>
        </p>
      </form>
    </div>
  );
}

export default Register;
