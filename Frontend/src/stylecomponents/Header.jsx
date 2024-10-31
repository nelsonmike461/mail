import React, { useContext } from "react";
import LogoutButton from "../buttons/LogoutButton";
import AuthContext from "../context/AuthProvider";

function Header() {
  const { user } = useContext(AuthContext);

  return (
    <header className="flex justify-between items-center p-4 bg-gray-100 shadow">
      <h4 className="pl-2 text-xl">Mail</h4>
      <div className="flex items-center">
        {user ? (
          <h2 className="text-lg">{user.email}</h2>
        ) : (
          <span className="text-red-500">No Users Logged in.</span>
        )}
      </div>
      <LogoutButton />
    </header>
  );
}

export default Header;
