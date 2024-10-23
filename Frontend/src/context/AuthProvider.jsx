import React, { createContext, useContext, useState, useEffect } from "react";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const isTokenExpired = (token) => {
    if (!token) return true;
    const payload = JSON.parse(atob(token.split(".")[1]));
    return payload.exp * 2000 < Date.now();
  };

  const refreshAccessToken = async () => {
    const refreshToken = localStorage.getItem("refreshToken");
    if (!refreshToken) {
      logout(); // No refresh token, log out
      return;
    }

    try {
      const response = await fetch(`http://127.0.0.1:8000/api/token/refresh/`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ refresh: refreshToken }),
      });

      if (!response.ok) {
        throw new Error("Failed to refresh token");
      }

      const data = await response.json();
      localStorage.setItem("accessToken", data.access);
      console.log("Access token refreshed:", data.access);
    } catch (error) {
      console.error("Error refreshing token:", error);
      logout(); // If refresh fails, log out
    }
  };

  const checkToken = async () => {
    const token = localStorage.getItem("accessToken");
    if (!token || isTokenExpired(token)) {
      console.log("Access token expired, attempting to refresh...");
      await refreshAccessToken(); // Wait for refresh to complete
    } else {
      console.log("Access token is valid");
    }
  };

  const [isAuthenticated, setIsAuthenticated] = useState(() => {
    const token = localStorage.getItem("accessToken");
    return token && !isTokenExpired(token);
  });

  const login = () => {
    setIsAuthenticated(true);
  };

  const logout = () => {
    setIsAuthenticated(false);
    localStorage.removeItem("accessToken");
    localStorage.removeItem("refreshToken");
    localStorage.removeItem("userEmail");
  };

  useEffect(() => {
    const intervalId = setInterval(checkToken, 60000); // Check every minute
    checkToken(); // Initial check on mount

    return () => clearInterval(intervalId); // Cleanup on unmount
  }, []);

  return (
    <AuthContext.Provider value={{ isAuthenticated, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
