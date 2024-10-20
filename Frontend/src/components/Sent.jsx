import React, { useEffect, useState } from "react";

function Sent() {
  const [emails, setEmails] = useState([]);
  const [error, setError] = useState(null);

  const fetchEmails = async () => {
    try {
      const token = localStorage.getItem("accessToken");

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
          errorData.error || "Fentching Emails That were sent Failed"
        );
      }

      const data = await response.json();
      setEmails(data);
    } catch (err) {
      setError(err.message);
      console.error("Error", err);
    }
  };

  useEffect(() => {
    fetchEmails();
  }, []);

  if (error) {
    return <div>Error: {error}</div>;
  }

  return (
    <table>
      <tbody>
        {emails.map((email) => (
          <tr key={email.id}>
            <td>{email.sender}</td>
            <td>{email.subject}</td>
            <td>{email.timestamp}</td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}

export default Sent;
