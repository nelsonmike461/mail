import { useNavigate } from "react-router-dom";
import AuthContext from "../context/AuthProvider";
import { useContext } from "react";

const LogoutButton = () => {
  const { logoutUser } = useContext(AuthContext); // Change here
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      const authToken = JSON.parse(localStorage.getItem("authTokens"));
      const refreshToken = authToken.refresh;

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

      logoutUser(); // Use logoutUser instead

      navigate("/login");
    } catch (err) {
      console.error("Error:", err);
      alert(err.message);
    }
  };

  return (
    <button className="pr-2 hover:text-red-500" onClick={handleLogout}>
      Logout
    </button>
  );
};

export default LogoutButton;
