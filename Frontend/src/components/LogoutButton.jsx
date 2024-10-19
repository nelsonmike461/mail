import { useAuth } from "../context/AuthProvider"; // Ensure you're importing useAuth
import { useNavigate } from "react-router-dom";

const LogoutButton = () => {
  const { logout } = useAuth(); // Get the logout function
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      const refreshToken = localStorage.getItem("refreshToken");

      const response = await fetch("http://127.0.0.1:8000/api/logout/", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ refresh: refreshToken }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Logout failed");
      }

      // Clear tokens
      localStorage.removeItem("accessToken");
      localStorage.removeItem("refreshToken");

      // Update auth state
      logout(); // Call logout to update state

      // Redirect to login page
      navigate("/login");
    } catch (err) {
      console.error("Error:", err);
      alert(err.message);
    }
  };

  return <button onClick={handleLogout}>Logout</button>;
};

export default LogoutButton;
