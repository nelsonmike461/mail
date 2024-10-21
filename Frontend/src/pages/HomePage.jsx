import React, { useState } from "react";
import Footer from "../components/Footer";
import Navigation from "../components/Navigation";
import Header from "../components/Header";
import Inbox from "../components/Inbox";
import ComposeForm from "../components/ComposeForm";
import Sent from "../components/Sent";
import Archive from "../components/Archive";
import { useAuth } from "../context/AuthProvider";

function HomePage() {
  const { isAuthenticated } = useAuth();
  const [currentView, setCurrentView] = useState("inbox");

  const renderView = () => {
    switch (currentView) {
      case "inbox":
        return <Inbox />;
      case "sent":
        return <Sent />;
      case "archive":
        return <Archive />;
      case "compose":
        return <ComposeForm />;
      default:
        return <Inbox />;
    }
  };

  return (
    <div>
      <Header />
      <Navigation setCurrentView={setCurrentView} currentView={currentView} />
      <div className="flex flex-column justify-center pt-1">
        {renderView()} {/* Render the current view here */}
      </div>
      <Footer />
    </div>
  );
}

export default HomePage;
