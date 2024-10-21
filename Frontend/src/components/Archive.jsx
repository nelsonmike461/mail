import React, { useEffect, useState } from "react";

function Archive() {
  const [emails, setEmails] = useState([]);
  const [error, setError] = useState(null);

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

  useEffect(() => {
    fetchEmails();
  }, []);

  if (error) {
    return <div>Error: {error}</div>;
  }

  return (
    <div className="flex justify-center w-full max-w-xl ">
      <div className="w-full max-w-xl p-4 space-y-2">
        {" "}
        {/* Increased max width */}
        {emails.map((email) => (
          <div
            key={email.id}
            className="flex justify-between items-center p-3 bg-gray-200 rounded-lg shadow"
          >
            <div className="flex-1 flex items-center">
              <div className="font-semibold text-sm">{email.sender}</div>
              <div className="mx-10 text-gray-700 text-sm">{email.subject}</div>
            </div>
            <div className="text-gray-500 text-sm">{email.timestamp}</div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Archive;
