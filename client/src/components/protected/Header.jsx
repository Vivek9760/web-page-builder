/* ----------------------------- react ----------------------------- */
import React, { useState, useEffect } from "react";

/* ----------------------------- libraries ----------------------------- */
import axios from "axios";
import { Link, useNavigate, useLocation } from "react-router-dom";

/* ----------------------------- socket ----------------------------- */
import { receiveEventFromSocket, closeSocketEvent, sendEventToSocket, disconnectSocket } from "../../services/socket.service";

/* ----------------------------- store ----------------------------- */
import { useStore } from "../../StoreProvider";

export default function Header() {
  const { store, updateStore } = useStore();
  const navigate = useNavigate();
  const location = useLocation();
  const [loader, setLoader] = useState(false);
  const [allActiveInstances, setAllActiveInstances] = useState([]);

  useEffect(() => {
    sendEventToSocket("UPDATE_PATH", location.pathname);
  }, [location.pathname]);

  useEffect(() => {
    receiveEventFromSocket("ALL_ACTIVE_USERS", ({ users }) => {
      setAllActiveInstances(users);
    });
  }, []);

  const logout = async () => {
    try {
      setLoader(true);
      await axios.post("/api/authentication/logout");
      updateStore({ user: null, isAuthenticate: false });
      navigate("/");
      disconnectSocket();
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
          👋 Hi, {store.user.name}
        </Link>

        {allActiveInstances.length > 1 && (
          <div className="d-flex align-items-center gap-2 ms-3 px-3 py-1 bg-success bg-opacity-10 border border-success border-opacity-25 rounded-pill">
            <span className="text-success fw-medium small">🟢 {allActiveInstances.length} online</span>
          </div>
        )}

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

        <div className="collapse navbar-collapse" id="navbarNav">
          <ul className="navbar-nav ms-auto align-items-center">
            {store.user.role === "CLIENT" && (
              <>
                <li className="nav-item">
                  <Link to="/" className="nav-link text-light px-3 py-2 rounded hover-bg-light" style={{ transition: "0.2s" }}>
                    Pages
                  </Link>
                </li>
                <li className="nav-item">
                  <Link to="/builder" className="nav-link text-light px-3 py-2 rounded hover-bg-light" style={{ transition: "0.2s" }}>
                    Builder
                  </Link>
                </li>
              </>
            )}
            <li className="nav-item ms-3">
              <button onClick={logout} disabled={loader} className="btn btn-success btn-sm fw-semibold px-4 py-2 rounded shadow-sm">
                {loader ? <i className="bi bi-person-walking me-2"></i> : <i className="bi bi-box-arrow-right me-2"></i>}
              </button>
            </li>
          </ul>
        </div>
      </div>
    </header>
  );
}
