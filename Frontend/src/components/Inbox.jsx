import React, { useEffect, useState } from "react";
import EmailDetails from "./EmailDetails";

function Inbox() {
  const [emails, setEmails] = useState([]);
  const [error, setError] = useState(null);
  const [selectedEmailId, setSelectedEmailId] = useState(null);

  const fetchEmails = async () => {
    try {
      const token = localStorage.getItem("accessToken");

      const response = await fetch(`http://127.0.0.1:8000/api/emails/inbox`, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Fetching Mails Failed");
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

      await fetch(`http://127.0.0.1:8000/api/emails/${id}`, {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ read: true }),
      });

      // Update local state to reflect the read status
      setEmails((prevEmails) =>
        prevEmails.map((email) =>
          email.id === id ? { ...email, read: true } : email
        )
      );
    } catch (err) {
      console.error("Error updating email:", err);
    }
  };

  const handleCloseDetails = () => {
    setSelectedEmailId(null);
  };

  const handleArchive = (id) => {
    setEmails((prevEmails) => prevEmails.filter((email) => email.id !== id));
    handleCloseDetails();
  };

  useEffect(() => {
    fetchEmails(); // Initial fetch

    const intervalId = setInterval(fetchEmails, 5000); // Fetch emails every 10 seconds

    return () => clearInterval(intervalId); // Clean up on unmount
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
          onArchive={() => handleArchive(selectedEmailId)}
        />
      ) : (
        <div className="w-full max-w-xl p-4 space-y-2">
          {emails.length === 0 ? (
            <div className="flex justify-center">
              You haven't received any mails.
            </div>
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

export default Inbox;
