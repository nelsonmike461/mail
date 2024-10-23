import React, { useEffect, useState } from "react";
import EmailDetails from "./EmailDetails";

function Sent() {
  const [emails, setEmails] = useState([]);
  const [error, setError] = useState(null);
  const [selectedEmailId, setSelectedEmailId] = useState(null);

  const fetchEmails = async () => {
    try {
      const token = localStorage.getItem("accessToken");

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
        throw new Error(
          errorData.error || "Fetching emails that were sent failed"
        );
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

    try {
      const token = localStorage.getItem("accessToken");

      if (!token) {
        throw new Error("Access token is missing");
      }

      await fetch(`http://127.0.0.1:8000/api/emails/${id}/`, {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ read: true }),
      });

      setEmails((prevEmails) => prevEmails.filter((email) => email.id !== id));
    } catch (err) {
      console.error("Error updating email:", err);
    }
  };

  const handleCloseDetails = () => {
    setSelectedEmailId(null);
  };

  useEffect(() => {
    fetchEmails();
  }, []);

  if (error) {
    return <div>Error: {error}</div>;
  }

  return (
    <div className="flex justify-center w-full max-w-xl">
      {selectedEmailId ? (
        <EmailDetails
          id={selectedEmailId}
          onClose={handleCloseDetails}
          onArchive={() => {
            setEmails((prevEmails) =>
              prevEmails.filter((email) => email.id !== selectedEmailId)
            ); // Remove email from local state
            handleCloseDetails(); // Close email details
          }}
          showArchiveButton={false} // Hide the archive button in sent section
        />
      ) : (
        <div className="w-full max-w-xl p-4 space-y-2">
          {emails.length === 0 ? (
            <div>No sent emails available.</div>
          ) : (
            emails.map((email) => (
              <div
                key={email.id}
                onClick={() => handleEmailClick(email.id)}
                className={`flex justify-between items-center p-3 rounded-lg shadow cursor-pointer ${
                  email.read ? "bg-white" : "bg-gray-200"
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
