import React from "react";
import { Link } from "react-router-dom";

function Navigation({ setCurrentView }) {
  return (
    <nav>
      <ul>
        <li onClick={() => setCurrentView("inbox")}>Inbox</li>
        <li onClick={() => setCurrentView("sent")}>Sent</li>
        <li onClick={() => setCurrentView("compose")}>Compose</li>
        <li onClick={() => setCurrentView("archive")}>Archive</li>
      </ul>
    </nav>
  );
}

export default Navigation;
