/* ----------------------------- react ----------------------------- */
import { useEffect, useState } from "react";

/* ----------------------------- libraries ----------------------------- */
import axios from "axios";
import { useNavigate } from "react-router-dom";

/* ----------------------------- components ----------------------------- */
import Loader from "../../../common-ui/Loader";

/* ----------------------------- utils ----------------------------- */
import { formatDateTime } from "../../../../utils/time.util";

export default function WebPageList() {
  const [webPage, setWebPage] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    fetchWebPage();
  }, []);

  const fetchWebPage = async () => {
    try {
      const { data } = await axios.get("/api/user/web-pages");
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
        <h2 className="text-center text-primary mb-5 fw-bold">Your Web Pages</h2>

        {webPage.length === 0 ? (
          <div className="text-center text-muted fs-5">No web pages found.</div>
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
                          onClick={() => navigate(`/preview/${page.slug}`)}
                        >
                          {page.title}
                        </h5>

                        <i
                          className="bi bi-eye text-secondary fs-5 ms-2"
                          title="Preview Page"
                          style={{ cursor: "pointer" }}
                          onClick={() => navigate(`/preview/${page.slug}`)}
                        ></i>
                      </div>

                      <p className="card-subtitle mb-2 text-muted">/{page.slug}</p>
                      <span
                        className={`badge ${
                          page.status === "published" ? "bg-success" : page.status === "draft" ? "bg-warning text-dark" : "bg-secondary"
                        }`}
                      >
                        {page.status.toUpperCase()}
                      </span>
                    </div>

                    <div className="d-flex justify-content-between align-items-center mt-3">
                      <small className="text-muted">{formatDateTime(page.createdOn)}</small>
                      <i
                        className="bi bi-pencil-square text-primary fs-5"
                        style={{ cursor: "pointer" }}
                        onClick={() => navigate(`/builder/${page.slug}`)}
                      ></i>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      <style jsx>{`
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
