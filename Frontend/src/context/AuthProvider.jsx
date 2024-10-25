import React, { createContext, useContext, useState, useEffect } from "react";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const isTokenExpired = (token) => {
    if (!token) return true;
    const payload = JSON.parse(atob(token.split(".")[1]));
    return payload.exp * 1000 < Date.now();
  };

  const [isAuthenticated, setIsAuthenticated] = useState(() => {
    const token = localStorage.getItem("accessToken");
    return token && !isTokenExpired(token);
  });

  const refreshAccessToken = async () => {
    const refreshToken = localStorage.getItem("refreshToken");
    if (!refreshToken) {
      logout();
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
      setIsAuthenticated(true);
    } catch (error) {
      console.error("Error refreshing token:", error);
      logout();
    }
  };

  const checkToken = async () => {
    const token = localStorage.getItem("accessToken");
    if (!token || isTokenExpired(token)) {
      await refreshAccessToken();
    } else {
      setIsAuthenticated(true);
    }
  };

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
    checkToken();
    const intervalId = setInterval(checkToken, 60000);

    return () => clearInterval(intervalId);
  }, []);

  return (
    <AuthContext.Provider value={{ isAuthenticated, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
