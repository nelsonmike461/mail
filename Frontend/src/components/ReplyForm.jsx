import React, { useEffect, useState } from "react";

function ReplyForm({ email, onClose }) {
  const [recipients, setRecipients] = useState("");
  const [subject, setSubject] = useState("");
  const [body, setBody] = useState("");
  const [error, setError] = useState(null);

  useEffect(() => {
    // Pre-fill the form fields
    if (email) {
      setRecipients(email.sender);
      setSubject(
        email.subject.startsWith("Re: ")
          ? email.subject
          : `Re: ${email.subject}`
      );
      setBody(
        `On ${new Date(email.timestamp).toLocaleString()} ${
          email.sender
        } wrote:\n${email.body}`
      );
    }
  }, [email]);

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
      console.log("Reply sent successfully!");
      onClose(); // Close the form after sending
    } catch (err) {
      setError(err.message); // Set the error message to display
      console.error("Error:", err);
    }
  };

  return (
    <div className="p-6 bg-white shadow-md rounded-lg w-full max-w-xl mx-auto">
      <form onSubmit={sendMail} aria-label="Reply Email Form">
        <fieldset className="space-y-4">
          <div>
            <label htmlFor="recipients" className="block font-medium text-sm">
              To:
            </label>
            <input
              type="email"
              id="recipients"
              value={recipients}
              readOnly
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
              value={body}
              onChange={(e) => setBody(e.target.value)}
              required
              className="w-full border border-gray-300 p-2 rounded h-32 text-sm"
            />
          </div>
          <button
            type="submit"
            className="w-full bg-blue-500 text-white p-1 rounded hover:bg-gray-100 hover:text-black border hover:border-black transparent transition font-medium text-sm"
          >
            Send Reply
          </button>
          {error && <p className="text-red-500 mt-2">{error}</p>}
        </fieldset>
      </form>
      <button onClick={onClose} className="mt-4 text-gray-600 text-sm">
        Cancel
      </button>
    </div>
  );
}

export default ReplyForm;
