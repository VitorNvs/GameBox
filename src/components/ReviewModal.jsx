import React from "react";

export default function ReviewModal({ open, onClose, review }) {
  if (!open) return null;

  const overlayStyle = {
    position: "fixed",
    top: 0,
    left: 0,
    width: "100vw",
    height: "100vh",
    background: "rgba(0,0,0,0.65)",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    zIndex: 9999
  };

  const contentStyle = {
    background: "#1e1e1e",
    color: "#fff",
    padding: "24px",
    width: "400px",
    borderRadius: "12px",
    position: "relative"
  };

  const closeStyle = {
    border: "none",
    background: "transparent",
    fontSize: "20px",
    color: "white",
    cursor: "pointer",
    position: "absolute",
    top: "10px",
    right: "10px"
  };

  return (
    <div style={overlayStyle}>
      <div style={contentStyle}>
        <button style={closeStyle} onClick={onClose}>x</button>
        <h2>sua review</h2>
        <p>{review}</p>
      </div>
    </div>
  );
}
