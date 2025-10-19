/* ----------------------------- react ----------------------------- */
import { useEffect, useState } from "react";

/* ----------------------------- libraries ----------------------------- */
import axios from "axios";
import { useNavigate, Link } from "react-router-dom";

/* ----------------------------- components ----------------------------- */
import Loader from "../../common-ui/Loader";

export default function PublishedWebPages() {
  const [webPage, setWebPage] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    fetchWebPage();
  }, []);

  const fetchWebPage = async () => {
    try {
      const { data } = await axios.get("/api/published/web-pages");
      setWebPage(data.webPages);
    } catch (err) {
      console.error(err);
      setError("Failed to fetch web pages.");
    } finally {
      setLoading(false);
    }
  };

  if (error) {
    return (
      <div className="alert alert-danger text-center mt-5" role="alert">
        {error}
      </div>
    );
  }

  return (
    <Loader isLoading={loading}>
      <div className="container py-5">
        <div className="d-flex align-items-center justify-content-center mb-5">
          <h2 className="text-primary fw-bold mb-0">Web Pages</h2>
        </div>

        {webPage.length === 0 ? (
          <div className="d-flex flex-column align-items-center justify-content-center p-5 bg-light rounded shadow text-center">
            <i className="bi bi-file-earmark-plus fs-1 text-secondary mb-3"></i>
            <h3 className="text-muted mb-2">No web pages found</h3>
            <p className="text-muted mb-4">Login & create your first page and bring your ideas to life!</p>
            <Link to="/login" className="btn btn-primary fw-semibold px-4 py-2 rounded">
              🔐 Go to Login
            </Link>
          </div>
        ) : (
          <div className="row g-4">
            {webPage.map((page, index) => (
              <div key={page._id} className="col-md-6 col-lg-4">
                <div className="card shadow-sm h-100 border-0 hover-card">
                  <div className="card-body d-flex flex-column justify-content-between">
                    <div>
                      <div className="d-flex align-items-center justify-content-between">
                        <h5
                          className="card-title text-primary fw-bold mb-0"
                          style={{ cursor: "pointer" }}
                          onClick={() => navigate(`/published/web-page/${page.slug}`)}
                        >
                          {page.title}
                        </h5>

                        <i
                          className="bi bi-eye text-secondary fs-5 ms-2"
                          title="Open Page"
                          style={{ cursor: "pointer" }}
                          onClick={() => navigate(`/published/web-page/${page.slug}`)}
                        ></i>
                      </div>

                      <p className="card-subtitle mb-2 text-muted">/{page.slug}</p>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      <style>{`
        .hover-card:hover {
          transform: translateY(-5px);
          transition: all 0.3s ease-in-out;
          box-shadow: 0 10px 20px rgba(0, 0, 0, 0.15);
        }

        .bi-eye:hover {
          color: #0d6efd !important;
        }
      `}</style>
    </Loader>
  );
}
