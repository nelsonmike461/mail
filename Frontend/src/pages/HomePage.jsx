import React, { useState } from "react";
import Footer from "../stylecomponents/Footer";
import Navigation from "../components/Navigation";
import Header from "../stylecomponents/Header";
import Inbox from "../components/Inbox";
import ComposeForm from "../components/ComposeForm";
import Sent from "../components/Sent";
import Archive from "../components/Archive";

function HomePage() {
  const [currentView, setCurrentView] = useState("inbox");

  const renderView = () => {
    switch (currentView) {
      case "inbox":
        return <Inbox setCurrentView={setCurrentView} />;
      case "sent":
        return <Sent setCurrentView={setCurrentView} />;
      case "archive":
        return <Archive setCurrentView={setCurrentView} />;
      case "compose":
        return <ComposeForm setCurrentView={setCurrentView} />;
      default:
        return <Inbox setCurrentView={setCurrentView} />;
    }
  };

  return (
    <div className="bg-gray-100 min-h-screen">
      <Header />
      <Navigation setCurrentView={setCurrentView} currentView={currentView} />
      <div className="flex flex-column justify-center pt-1">{renderView()}</div>
      <Footer />
    </div>
  );
}

export default HomePage;
