import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

function ComposeForm({ setCurrentView }) {
  const [recipients, setRecipients] = useState("");
  const [subject, setSubject] = useState("");
  const [body, setBody] = useState("");
  const [error, setError] = useState(null);
  const [from, setFrom] = useState("");

  const navigate = useNavigate();

  useEffect(() => {
    const userEmail = localStorage.getItem("userEmail");
    if (userEmail) {
      setFrom(userEmail);
    } else {
      setError("User email not found. Please log in again.");
    }
  }, []);

  const sendMail = async (e) => {
    e.preventDefault();
    setError(null);

    try {
      const token = localStorage.getItem("accessToken");

      const response = await fetch(`http://127.0.0.1:8000/api/compose/`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ recipients, subject, body }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Mail Not Sent");
      }
      console.log("Mail sent successfully!");
      // Clear the form after sending
      setRecipients("");
      setSubject("");
      setBody("");
      setCurrentView("sent");
    } catch (err) {
      setError(err.message);
      console.error("Error:", err);
    }
  };

  return (
    <div className="p-6 bg-white shadow-md rounded-lg w-full max-w-lg mx-auto mt-6">
      <form onSubmit={sendMail} aria-label="Compose Email Form">
        <fieldset className="space-y-4">
          <div className="flex items-center space-x-3">
            <label htmlFor="from" className="font-medium">
              From:
            </label>
            <input
              type="email"
              id="from"
              value={from}
              disabled
              readOnly
              className="flex-1 border border-gray-300 p-1 text-sm rounded"
            />
          </div>
          <div>
            <label htmlFor="recipients" className="block font-medium text-sm">
              To:
            </label>
            <input
              type="email"
              id="recipients"
              value={recipients}
              onChange={(e) => setRecipients(e.target.value)}
              required
              className="w-full border border-gray-300 p-1 rounded text-sm"
            />
          </div>
          <div>
            <label htmlFor="subject" className="block font-medium text-sm">
              Subject:
            </label>
            <input
              type="text"
              id="subject"
              value={subject}
              placeholder="Subject"
              onChange={(e) => setSubject(e.target.value)}
              required
              className="w-full border border-gray-300 p-1 rounded text-sm"
            />
          </div>
          <div>
            <label htmlFor="body" className="block font-medium text-sm">
              Body:
            </label>
            <textarea
              id="body"
              placeholder="Body"
              value={body}
              onChange={(e) => setBody(e.target.value)}
              required
              className="w-full border border-gray-300 p-2 rounded h-32 text-sm" // Set a specific height for the textarea
            />
          </div>
          <button
            type="submit"
            className="w-full bg-blue-500 text-white p-1 rounded hover:bg-gray-100 hover:text-black border hover:border-black transparent transition font-medium text-sm"
          >
            Send
          </button>
          {error && <p className="text-red-500 mt-2">{error}</p>}{" "}
        </fieldset>
      </form>
    </div>
  );
}

export default ComposeForm;
