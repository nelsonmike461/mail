import React from "react";
import LogoutButton from "../components/LogoutButton";

function HomePage() {
  return (
    <div>
      HomePage <LogoutButton />
    </div>
  );
}

export default HomePage;

// const token = localStorage.getItem("token");

// const response = await fetch("http://127.0.0.1:8000/api/protected-route/", {
//   method: "GET",
//   headers: {
//     "Authorization": `Bearer ${token}`, // Include the token in the Authorization header
//   },
// });
