import { useNavigate } from "react-router-dom";

export default function Home() {
  const navigate = useNavigate();

  return (
    <div
      className="d-flex flex-column align-items-center justify-content-center min-vh-100 text-center px-3"
      style={{
        background: "linear-gradient(135deg, #0f2027, #203a43, #2c5364)",
        color: "#f8f9fa",
      }}
    >
      {/* Hero Section */}
      <header className="mb-5">
        <h1 className="fw-bold display-4 text-light mb-3">⚡ Web App Builder</h1>
        <p className="fs-5 text-white-50" style={{ maxWidth: "600px" }}>
          Build, edit, and preview your web pages in real-time. Drag, drop, and publish — instantly.
        </p>
      </header>

      {/* Navigation Buttons */}
      <div className="d-flex flex-column align-items-center gap-3 mb-5 w-100" style={{ maxWidth: "320px" }}>
        <button className="btn btn-outline-light w-100 fw-semibold py-2" onClick={() => navigate("/login")}>
          🔐 Login
        </button>

        <button className="btn btn-success w-100 fw-semibold py-2" onClick={() => navigate("/signup")}>
          📝 Sign Up
        </button>

        <button className="btn btn-outline-info w-100 fw-semibold py-2" onClick={() => navigate("/privacy")}>
          📜 Privacy Policy
        </button>

        <button className="btn btn-outline-warning w-100 fw-semibold py-2" onClick={() => navigate("/terms")}>
          ⚖️ Terms & Conditions
        </button>
      </div>

      {/* About Section */}
      <section className="mb-5" style={{ maxWidth: "600px" }}>
        <h4 className="fw-bold text-light mb-3">About Web App Builder</h4>
        <p className="text-white-50">
          A minimal yet powerful tool for developers to create fully customizable web layouts with live collaboration and instant deployment.
        </p>
      </section>

      {/* Footer */}
      <footer className="text-white-50 small border-top pt-3 mt-auto">
        © {new Date().getFullYear()} Web App Builder | Fast ⚡ Secure 🔒 Easy 🧩
      </footer>
    </div>
  );
}
