import React, { useEffect, useState } from "react";
import LogoutButton from "../buttons/LogoutButton";

function Header() {
  const [user, setUser] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    const userEmail = localStorage.getItem("userEmail");
    if (userEmail) {
      setUser(userEmail);
    } else {
      setError("No Users Logged in.");
    }
  }, []);

  return (
    <header className="flex justify-between items-center p-4 bg-gray-100 shadow">
      <h4 className="pl-2 text-xl">Mail</h4>
      <div className="flex items-center">
        {error ? (
          <span className="text-red-500">{error}</span>
        ) : (
          <h2 className="text-lg">{user}</h2>
        )}
      </div>
      <LogoutButton />
    </header>
  );
}

export default Header;
