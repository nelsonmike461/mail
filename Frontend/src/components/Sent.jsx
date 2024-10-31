import React, { useEffect, useState } from "react";
import EmailDetails from "./EmailDetails";

function Sent({ setCurrentView }) {
  const [emails, setEmails] = useState([]);
  const [error, setError] = useState(null);
  const [selectedEmailId, setSelectedEmailId] = useState(null);

  const fetchEmails = async () => {
    try {
      const authToken = JSON.parse(localStorage.getItem("authTokens"));
      const token = authToken.access;

      if (!token) {
        throw new Error("Access token is missing");
      }

      const response = await fetch(`http://127.0.0.1:8000/api/emails/sent`, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Fetching sent emails failed");
      }

      const data = await response.json();
      setEmails(data);
    } catch (err) {
      setError(err.message);
      console.error("Error:", err);
    }
  };

  const handleEmailClick = async (id) => {
    setSelectedEmailId(id);
  };

  const handleCloseDetails = () => {
    setSelectedEmailId(null);
  };

  useEffect(() => {
    fetchEmails();
    const intervalId = setInterval(fetchEmails, 5000);
    return () => clearInterval(intervalId);
  }, []);

  if (error) {
    return <div className="text-red-600">Error: {error}</div>;
  }

  return (
    <div className="flex justify-center w-full max-w-xl">
      {selectedEmailId ? (
        <EmailDetails
          id={selectedEmailId}
          onClose={handleCloseDetails}
          showArchiveButton={false}
          setCurrentView={setCurrentView}
        />
      ) : (
        <div className="w-full max-w-xl p-4 space-y-2">
          {emails.length === 0 ? (
            <div className="flex justify-center">No sent emails available.</div>
          ) : (
            emails.map((email) => (
              <div
                key={email.id}
                onClick={() => handleEmailClick(email.id)}
                className={`flex justify-between items-center p-3 rounded-lg shadow cursor-pointer ${
                  email.read ? "bg-white" : "bg-gray-300"
                }`}
              >
                <div className="flex-1 flex items-center">
                  <div className="font-semibold text-sm">{email.sender}</div>
                  <div className="mx-10 text-gray-700 text-sm">
                    {email.subject}
                  </div>
                </div>
                <div className="text-gray-500 text-sm">{email.timestamp}</div>
              </div>
            ))
          )}
        </div>
      )}
    </div>
  );
}

export default Sent;
