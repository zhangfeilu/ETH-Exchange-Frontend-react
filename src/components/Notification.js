// Notification.js
import React from "react";

function Notification({ show, message, type }) {
  if (!show) return null;

  let bgColor = "bg-blue-500";
  if (type === "success") bgColor = "bg-green-500";
  if (type === "error") bgColor = "bg-red-500";

  return (
    <div
      className={`fixed bottom-4 right-4 px-6 py-3 rounded-lg shadow-lg transform transition-all duration-300 ${
        show ? "" : "translate-y-20 opacity-0"
      } ${bgColor}`}
    >
      <p className="text-white">{message}</p>
    </div>
  );
}

export default Notification;
