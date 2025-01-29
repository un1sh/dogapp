import { Link } from "react-router-dom";
import "../css/NavBar.css";
import { useAuth } from "./auth";
import { useState } from "react";
import { Profile } from "./Profile";

function NavBar() {
  const auth = useAuth();
  const [showProfile, setShowProfile] = useState(false);

  return (
    <>
      <nav className="navbar">
        <Link to="/" className="navbar-brand">
          <img className="navbar-logo" src="./assets/logo.png" alt="Logo" />
          <span>Dog App</span>
        </Link>
        <div className="navbar-links">
          <Link to="/" className="nav-link">
            Home
          </Link>
          <Link to="/favorites" className="nav-link">
            Favorites
          </Link>
          <Link to="/identify" className="nav-link">
            Identify
          </Link>

          {auth.user ? (
            <button
              className="nav-link profile-button"
              onClick={() => setShowProfile(true)}
            >
              Profile
            </button>
          ) : (
            <Link to="/Login" className="nav-link">
              Login
            </Link>
          )}
        </div>
      </nav>

      {/* Profile Pop-up */}
      {showProfile && <Profile onClose={() => setShowProfile(false)} />}
    </>
  );
}

export default NavBar;
