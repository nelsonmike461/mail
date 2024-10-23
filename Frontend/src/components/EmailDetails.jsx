import React, { useEffect, useState } from "react";
import ToggleArchiveButton from "./ToggleArchiveButton";
import ReplyForm from "./ReplyForm";

function EmailDetails({ id, onClose, onArchive, showArchiveButton = true }) {
  const [data, setData] = useState(null);
  const [error, setError] = useState(null);
  const [isReplying, setIsReplying] = useState(false); // State to manage reply form visibility

  const fetchDetails = async () => {
    try {
      const token = localStorage.getItem("accessToken");
      const response = await fetch(`http://127.0.0.1:8000/api/emails/${id}/`, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Fetching Details Failed");
      }
      const data = await response.json();
      setData(data);
    } catch (err) {
      setError(err.message);
      console.error("Error:", err);
    }
  };

  useEffect(() => {
    fetchDetails();
  }, [id]);

  if (error) {
    return <div className="text-red-600">Error: {error}</div>;
  }

  if (!data) {
    return <div>Loading...</div>;
  }

  const handleReply = () => {
    setIsReplying(true); // Open the reply form
  };

  return (
    <div className="p-4 border border-gray-300 rounded bg-white shadow relative w-full mt-6">
      {isReplying ? (
        <ReplyForm email={data} onClose={onClose} />
      ) : (
        <>
          <button
            onClick={onClose}
            className="absolute top-4 right-4 text-gray-600 text-2xl"
          >
            &larr;
          </button>
          <h5 className="font-semibold text-lg">{data.subject}</h5>
          <div className="mt-2">
            <div>
              <strong>From:</strong> {data.sender}
            </div>
            <div>
              <strong>To:</strong> {data.recipients.join(", ")}
            </div>
            <div>
              <strong>Received:</strong> {data.timestamp}
            </div>
          </div>
          <div className="mt-4">{data.body}</div>
          <div className="mt-4 flex space-x-2">
            <button
              onClick={handleReply}
              className="bg-blue-500 text-white px-2 py-1 rounded hover:bg-gray-100 hover:text-black border hover:border-black transparent"
            >
              Reply
            </button>
            {showArchiveButton && (
              <ToggleArchiveButton
                emailId={id}
                isArchived={data.archived}
                onToggle={() => {
                  onClose();
                  onArchive();
                }}
              />
            )}
          </div>
        </>
      )}
    </div>
  );
}

export default EmailDetails;
