import React, { useEffect, useState } from "react";

function ComposeForm() {
  const [recipients, setRecipients] = useState("");
  const [subject, setSubject] = useState("");
  const [body, setBody] = useState("");
  const [error, setError] = useState(null);
  const [from, setFrom] = useState("");

  useEffect(() => {
    const userEmail = localStorage.getItem("userEmail");
    if (userEmail) {
      setFrom(userEmail);
    } else {
      setError("User email not found. Please log in again.");
    }
  });

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
    } catch (err) {
      setError(err.message); // Set the error message to display
      console.error("Error:", err);
    }
  };
  return (
    <form onSubmit={sendMail} aria-label="Compose Email Form">
      <fieldset>
        <div>
          <label htmlFor="from">From</label>
          <input type="email" id="from" value={from} disabled readOnly />
        </div>
        <div>
          <label htmlFor="recipients">To</label>
          <input
            type="email"
            id="recipients"
            value={recipients}
            onChange={(e) => setRecipients(e.target.value)}
            required
          />
        </div>
        <div>
          <input
            type="text"
            id="subject"
            value={subject}
            placeholder="Subject"
            onChange={(e) => setSubject(e.target.value)}
            required
          />
        </div>
        <div>
          <textarea
            id="body"
            placeholder="Body"
            value={body}
            onChange={(e) => setBody(e.target.value)}
            required
          />
        </div>
        <button type="submit">Send</button>
        {error && <p>{error}</p>} {/* Display error message if present */}
      </fieldset>
    </form>
  );
}

export default ComposeForm;
