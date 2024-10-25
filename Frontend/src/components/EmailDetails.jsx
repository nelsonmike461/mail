import React, { useEffect, useState } from "react";
import ToggleArchiveButton from "../buttons/ToggleArchiveButton";
import ReplyForm from "./ReplyForm";

function EmailDetails({ id, onClose, onArchive, showArchiveButton = true }) {
  const [data, setData] = useState(null);
  const [error, setError] = useState(null);
  const [isReplying, setIsReplying] = useState(false);

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
    setIsReplying(true);
  };

  return (
    <div className="p-4 border border-gray-300 rounded bg-white shadow relative w-full mt-6">
      {isReplying ? (
        <ReplyForm email={data} onClose={onClose} />
      ) : (
        <>
          <div className="flex items-center justify-between mb-4">
            <button
              onClick={onClose}
              className="text-gray-600 text-2xl hover:text-gray-800 transition"
            >
              &larr;
            </button>
            {showArchiveButton && (
              <ToggleArchiveButton
                emailId={id}
                isArchived={data.archived}
                onToggle={() => {
                  onArchive();
                }}
              />
            )}
          </div>
          <h5 className="font-semibold text-lg">{data.subject}</h5>
          <div className="mt-2 text-gray-600 text-sm">
            <div>
              <strong>From:</strong> {data.sender}
            </div>
            <div>
              <strong>To:</strong> {data.recipients.join(", ")}
            </div>
            <div>
              <strong>Received:</strong>{" "}
              {new Date(data.timestamp).toLocaleString()}
            </div>
          </div>
          <div className="mt-4 whitespace-pre-wrap">{data.body}</div>
          <div className="mt-4 flex space-x-2">
            <button
              onClick={handleReply}
              className="bg-blue-500 text-white px-3 py-1 rounded border border-transparent hover:bg-gray-100 hover:text-black hover:border-black text-sm transition"
            >
              Reply
            </button>
          </div>
        </>
      )}
    </div>
  );
}

export default EmailDetails;
