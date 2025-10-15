/* ----------------------------- react ----------------------------- */
import React, { useState } from "react";

/* ----------------------------- libraries ----------------------------- */
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";

/* ----------------------------- store ----------------------------- */
import { useStore } from "../../StoreProvider";

export default function Header() {
  const { store, updateStore } = useStore();
  const navigate = useNavigate();
  const [loader, setLoader] = useState(false);

  const logout = async () => {
    try {
      setLoader(true);
      await axios.post("/api/authentication/logout");
      updateStore({ user: null, isAuthenticate: false });
      navigate("/");
    } catch (error) {
      console.error("Logout failed:", error);
    } finally {
      setLoader(false);
    }
  };

  return (
    <header className="navbar navbar-expand-lg navbar-dark bg-dark border-bottom border-success shadow-sm sticky-top" style={{ zIndex: 1000 }}>
      <div className="container-fluid px-4">
        {/* Brand */}
        <Link to="/" className="navbar-brand fw-bold text-success fs-4">
          Web Page Builder
        </Link>

        {/* Navbar Toggler */}
        <button
          className="navbar-toggler"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#navbarNav"
          aria-controls="navbarNav"
          aria-expanded="false"
          aria-label="Toggle navigation"
        >
          <span className="navbar-toggler-icon"></span>
        </button>

        {/* Nav Links */}
        <div className="collapse navbar-collapse" id="navbarNav">
          <ul className="navbar-nav ms-auto align-items-center">
            <li className="nav-item">
              <Link to="/" className="nav-link text-light">
                Home
              </Link>
            </li>

            {store?.user?.role === "ADMIN" && (
              <li className="nav-item">
                <Link to="/users" className="nav-link text-light">
                  Users
                </Link>
              </li>
            )}

            <li className="nav-item">
              <Link to="/room" className="nav-link text-light">
                My Rooms
              </Link>
            </li>

            <li className="nav-item">
              <Link to="/profile" className="nav-link text-light">
                Profile
              </Link>
            </li>

            <li className="nav-item ms-3">
              <button onClick={logout} disabled={loader} className="btn btn-success btn-sm fw-semibold px-3">
                {loader ? "Logging out..." : "Logout"}
              </button>
            </li>
          </ul>
        </div>
      </div>
    </header>
  );
}
