import React from "react";
import LogoutButton from "./LogoutButton";

function Header() {
  return (
    <header className="flex justify-between p-4 bg-gray-100">
      <h4 className="pl-2 text-xl">Mail</h4>
      <LogoutButton />
    </header>
  );
}

export default Header;
