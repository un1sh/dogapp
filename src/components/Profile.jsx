import React from "react";
import { useAuth } from "./auth";
import { useNavigate } from "react-router-dom";
import "../css/Profile.css"; // Import the separate CSS file

export const Profile = ({ onClose }) => {
  const auth = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    auth.logout();
    onClose();
    navigate("/");
  };

  return (
    <div className="profile-overlay">
      <div className="profile-card">
        {/* Close Button */}
        <button onClick={onClose} className="close-button">✖</button>

        {/* Profile Picture (Centered) */}
        <div className="profile-image-container">
          <img
            src={auth.user?.data?.picture_url || "../../public/assets/dog-profile.jpg"}
            alt="Profile"
            className="profile-image"
          />
        </div>

        {/* Username */}
        <h2 className="profile-username">{auth.user?.data?.username}</h2>

        {/* Logout Button */}
        <button onClick={handleLogout} className="logout-button">Logout</button>
      </div>
    </div>
  );
};
