import React, { useContext, useState, useEffect } from "react";
import AuthContext from "../context/AuthProvider";
import { Link, useNavigate } from "react-router-dom";

function Login() {
  let { loginUser, user } = useContext(AuthContext);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const navigate = useNavigate();

  useEffect(() => {
    if (user) {
      navigate("/");
    }
  }, [user, navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true); // Set loading state
    setError(null); // Clear previous error

    // Call loginUser and pass the event
    const response = await loginUser(e);

    // Handle login response if needed
    if (response.error) {
      setError(response.error); // Set error state if login fails
    }

    setLoading(false); // Reset loading state
  };

  return (
    <div className="flex items-center justify-center h-screen bg-gray-100">
      <form
        onSubmit={handleSubmit}
        aria-label="Login Form"
        className="bg-white p-6 rounded shadow-md w-96"
      >
        <fieldset>
          <legend className="text-xl font-bold mb-4">Login</legend>
          <div className="mb-4">
            <label htmlFor="email" className="block mb-1 text-sm">
              Email
            </label>
            <input
              type="email"
              name="email"
              placeholder="Email"
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
              name="password"
              placeholder="Password"
              required
              className="border border-gray-300 p-2 w-full rounded"
            />
          </div>
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-blue-500 text-white p-2 rounded hover:bg-gray-100 hover:text-black border hover:border-black"
          >
            {loading ? "Logging in..." : "Login"}
          </button>
        </fieldset>
        {error && (
          <p className="flex text-red-500 mt-2 justify-center">{error}</p>
        )}
        <p className="mt-4 text-center text-sm">
          Don't have an account?{" "}
          <Link to="/register" className="text-blue-500 underline">
            Register here
          </Link>
        </p>
      </form>
    </div>
  );
}

export default Login;
