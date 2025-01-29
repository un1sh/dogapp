import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const SetPassword = () => {
  const navigate = useNavigate();
  const [passwords, setPasswords] = useState({
    password: "",
    confirmPassword: "",
  });
  const [error, setError] = useState(null);

  const handleChange = (e) => {
    setPasswords({ ...passwords, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const storedUser = JSON.parse(sessionStorage.getItem("googleUser"));

    if (!storedUser) {
      setError("User session expired. Please sign up again.");
      return;
    }

    if (passwords.password !== passwords.confirmPassword) {
      setError("Passwords do not match!");
      return;
    }

    try {
      await axios.post("http://localhost:3000/set-password", {
        email: storedUser.email,
        password: passwords.password,
      });

      // Clear session storage and navigate to login
      sessionStorage.removeItem("googleUser");
      navigate("/login");
    } catch (err) {
      setError("Failed to set password. Try again.");
    }
  };

  return (
    <div className="set-password-container">
      <h2>Set Your Password</h2>
      <form onSubmit={handleSubmit}>
        <input
          type="password"
          name="password"
          placeholder="Enter new password"
          onChange={handleChange}
        />
        <input
          type="password"
          name="confirmPassword"
          placeholder="Confirm password"
          onChange={handleChange}
        />
        <button type="submit">Submit</button>
      </form>
      {error && <p>{error}</p>}
    </div>
  );
};

export default SetPassword;
