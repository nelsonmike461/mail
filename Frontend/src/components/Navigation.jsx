import React from "react";

function Navigation({ setCurrentView, currentView }) {
  return (
    <nav className="bg-gray-200">
      <ul className="flex flex-row justify-center space-x-14 pt-1">
        {["inbox", "sent", "compose", "archive"].map((view) => (
          <li
            key={view}
            onClick={() => setCurrentView(view)}
            className={`relative cursor-pointer py-2 ${
              currentView === view ? "text-gray-800" : "text-gray-600"
            }`}
          >
            <span className="hover:bg-gray-300 transition block">
              {view.charAt(0).toUpperCase() + view.slice(1)}
            </span>
            {currentView === view && (
              <div className="absolute left-0 right-0 bottom-0 h-1 bg-gray-800"></div>
            )}
          </li>
        ))}
      </ul>
    </nav>
  );
}

export default Navigation;
