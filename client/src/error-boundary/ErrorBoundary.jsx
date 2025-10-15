import { Link, useRouteError } from "react-router-dom";

export default function ErrorBoundary() {
  const error = useRouteError();

  console.error("Caught error:", error);

  return (
    <div
      className="d-flex flex-column align-items-center justify-content-center min-vh-100 text-center px-3"
      style={{
        background: "linear-gradient(135deg, #141E30, #243B55)",
        color: "#f8f9fa",
      }}
    >
      {/* Main card */}
      <div
        className="card shadow-lg border-0 text-light p-4"
        style={{
          backgroundColor: "rgba(0,0,0,0.7)",
          maxWidth: "600px",
          borderRadius: "16px",
        }}
      >
        <div className="card-body">
          <h1 className="display-5 fw-bold text-warning mb-3">🚧 Oops! Something Broke</h1>
          <p className="text-light-emphasis mb-4 fs-5">
            You weren’t supposed to find this bug — so technically, it’s your fault 😅.
            <br />
            <br />
            Don’t worry, we’ll fix it (eventually). Or maybe it’s a *feature* in disguise 👀.
          </p>

          {error?.statusText || error?.message ? (
            <div className="alert alert-danger text-start small">
              <strong>Error:</strong> {error.statusText || error.message}
            </div>
          ) : null}

          <div className="d-flex justify-content-center gap-3 mt-4">
            <Link
              to="/"
              className="btn btn-outline-warning fw-semibold"
              onMouseEnter={(e) => (e.target.innerText = "🥺 Don't!")}
              onMouseLeave={(e) => (e.target.innerText = "⚠️ Report")}
            >
              ⚠️ Report
            </Link>

            <Link to="/" className="btn btn-success fw-semibold">
              🔙 Go Back
            </Link>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="mt-5 text-white-50 small">© {new Date().getFullYear()} Web App Builder | Debug Mode: ON 🐞</footer>
    </div>
  );
}
