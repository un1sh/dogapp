import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { GoogleLogin } from "@react-oauth/google";
import { useAuth } from "../components/auth";

const Login = () => {
  const [values, setValues] = useState({
    email: "",
    password: "",
  });
  const [error, setError] = useState(null);
  const navigate = useNavigate();
  const auth = useAuth();

  const handleChanges = (e) => {
    setValues({ ...values, [e.target.name]: e.target.value });
  };
  const handleSubmit = async (e) => {
    setError(null);
    e.preventDefault();
    try {
      const response = await axios.post("http://localhost:3000/login", values);

      auth.login(response);
      navigate("/", { replace: true });
    } catch (err) {
      if (err.status === 401) {
        setError("Password incorrect!");
      } else if(err.status === 404){
        setError("User not found");
      }
      else {
        setError("Something Went Wrong");
      }

    }
  };
  const handleGoogleSignIn = async (googleCreds) => {
    try {
      setError(null);
      const response = await axios.post("http://localhost:3000/login", {
        token: googleCreds,
      });
      auth.login(response);
      navigate("/", { replace: true });
    } catch (err) {
      if (err.status === 404) {
        setError("User not found");
      } else {
        setError("Something Went Wrong");
      }
    }
  };
  return (
    <div className="register-container">
      <div className="form-container">
        <h2 className="form-title">Login</h2>
        <form on onSubmit={handleSubmit}>
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
          <button className="submit-button">Login</button>
        </form>
        <GoogleLogin
          onSuccess={async (credentialResponse) => {
            await handleGoogleSignIn(credentialResponse);
          }}
          onError={() => {
            setError("Google Login Failed");
          }}
        />
        {error && <h1>{error}</h1>}
        <div className="login-link">
          <span>Don't have an account? </span>
          <Link to="/register">Register</Link>
        </div>
      </div>
    </div>
  );
};

export default Login;
