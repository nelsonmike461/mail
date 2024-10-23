import React from "react";

function Footer() {
  return (
    <footer className="bg-gray-800 text-white p-4 text-center fixed bottom-0 left-0 right-0">
      <p className="text-sm">
        &copy; {new Date().getFullYear()} By Nelson Michael
      </p>
    </footer>
  );
}

export default Footer;
