import { useAuth } from "../context/AuthProvider";
import { useNavigate } from "react-router-dom";

const LogoutButton = () => {
  const { logout } = useAuth();
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

      logout();

      navigate("/login");
    } catch (err) {
      console.error("Error:", err);
      alert(err.message);
    }
  };

  return (
    <button className="pr-2  hover:text-red-500" onClick={handleLogout}>
      Logout
    </button>
  );
};

export default LogoutButton;
