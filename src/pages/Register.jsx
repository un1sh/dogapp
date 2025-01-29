import React from "react";
import "../css/Register.css";
import axios from "axios";
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { GoogleLogin } from "@react-oauth/google";

const Register = () => {
  const [values, setValues] = useState({
    name: "",
    email: "",
    password: "",
  });
  const [error, setError] = useState(null);
  const navigate = useNavigate();
  const handleChanges = (e) => {
    setValues({ ...values, [e.target.name]: e.target.value });
  };
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setError(null);
      const response = await axios.post(
        "http://localhost:3000/register",
        values
      );
      navigate("/");
    } catch (err) {
      console.log(err.message);
      if (err.status === 403) {
        setError("User already exist");
      } else {
        setError("Something Went Wrong");
      }
    }
  };
  const handleGoogleSignUp = async (googleCreds) => {
    try {
      setError(null);
      const response = await axios.post(
        "http://localhost:3000/register",
        {"token":googleCreds}
      );

      navigate("/");
    } catch (err) {
      console.log(err.message);
      if (err.status === 403) {
        setError("User already exist");
      } else {
        setError("Something Went Wrong");
      }
    }
  };

  return (
    <div className="register-container">
      <div className="form-container">
        <h2 className="form-title">Register</h2>
        <form on onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="name">Username</label>
            <input
              type="text"
              id="name"
              placeholder="Enter Username"
              name="name"
              onChange={handleChanges}
            />
          </div>
          <div className="form-group">
            <label htmlFor="email">Email</label>
            <input
              type="email"
              id="email"
              placeholder="Enter Email"
              name="email"
              onChange={handleChanges}
            />
          </div>
          <div className="form-group">
            <label htmlFor="password">Password</label>
            <input
              type="password"
              id="password"
              placeholder="Enter Password"
              name="password"
              onChange={handleChanges}
            />
          </div>
          <button className="submit-button">Submit</button>
        </form>
        <div className="google-login-form">
          <GoogleLogin
            onSuccess={async (credentialResponse) => {              
              await handleGoogleSignUp(credentialResponse);
            }}
            onError={() => {
              setError("Google Login Failed");
            }}
          />
        </div>
        {error && <h2>{error}</h2>}
        <div className="login-link">
          <span>Already have an account? </span>
          <Link to="/login">Login</Link>
        </div>
      </div>
    </div>
  );
};

export default Register;
