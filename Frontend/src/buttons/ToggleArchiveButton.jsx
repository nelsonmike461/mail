import React from "react";

function ToggleArchiveButton({ emailId, isArchived, onToggle }) {
  const handleToggleArchive = async () => {
    try {
      const token = localStorage.getItem("accessToken");
      await fetch(`http://127.0.0.1:8000/api/emails/${emailId}/`, {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ archived: !isArchived }),
      });
      onToggle();
    } catch (err) {
      console.error("Error toggling email archive state:", err);
    }
  };

  return (
    <button
      onClick={handleToggleArchive}
      className={`text-white px-2 py-1 text-sm rounded ${
        isArchived
          ? "bg-blue-500 border border-transparent hover:bg-gray-100 hover:text-black hover:border-black text-sm"
          : "bg-red-500 border border-transparent hover:bg-gray-100 hover:text-black hover:border-black text-sm"
      }`}
    >
      {isArchived ? "Unarchive" : "Archive"}
    </button>
  );
}

export default ToggleArchiveButton;
