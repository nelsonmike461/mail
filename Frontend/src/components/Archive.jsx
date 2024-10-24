import React, { useEffect, useState } from "react";
import EmailDetails from "./EmailDetails";

function Archive() {
  const [emails, setEmails] = useState([]);
  const [error, setError] = useState(null);
  const [selectedEmailId, setSelectedEmailId] = useState(null);

  const fetchEmails = async () => {
    try {
      const token = localStorage.getItem("accessToken");

      const response = await fetch(`http://127.0.0.1:8000/api/emails/archive`, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Fetching Archived Mails Failed");
      }

      const data = await response.json();
      setEmails(data);
    } catch (err) {
      setError(err.message);
      console.error("Error:", err);
    }
  };

  const handleEmailClick = async (id) => {
    setSelectedEmailId(id); // Set the selected email ID when clicked

    try {
      const token = localStorage.getItem("accessToken");
      await fetch(`http://127.0.0.1:8000/api/emails/${id}/`, {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ read: true }), // Mark email as read
      });

      // Update local state to reflect that the email is read
      setEmails((prevEmails) => prevEmails.filter((email) => email.id !== id));
    } catch (err) {
      console.error("Error marking email as read:", err);
    }
  };

  const handleUnarchiveEmail = async (id) => {
    const token = localStorage.getItem("accessToken");
    try {
      // Unarchive the email
      await fetch(`http://127.0.0.1:8000/api/emails/${id}/`, {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ archived: false }),
      });

      // Remove from local state
      setEmails((prevEmails) => prevEmails.filter((email) => email.id !== id));
    } catch (err) {
      console.error("Error unarchiving email:", err);
    }
  };

  const handleCloseDetails = () => {
    setSelectedEmailId(null); // Clear the selected email ID
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
          onArchive={handleUnarchiveEmail} // Pass unarchive handler
        />
      ) : (
        <div className="w-full max-w-xl p-4 space-y-2">
          {emails.map((email) => (
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
          ))}
        </div>
      )}
    </div>
  );
}

export default Archive;
