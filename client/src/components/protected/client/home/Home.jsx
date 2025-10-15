/* ----------------------------- react ----------------------------- */
import { useEffect, useState } from "react";

/* ----------------------------- libraries ----------------------------- */
import axios from "axios";
import { useNavigate } from "react-router-dom";

/* ----------------------------- components ----------------------------- */
import Loader from "../../../common-ui/Loader";

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
      setError("Failed to fetch webPage.");
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
        <h3 className="text-center text-success mb-4">All WebPage</h3>
        <div className="table-responsive">
          <table className="table table-bordered table-hover align-middle">
            <thead className="table-dark text-center">
              <tr>
                <th>#</th>
                <th>Title</th>
                <th>status</th>
                <th>Created At</th>
              </tr>
            </thead>
            <tbody>
              {webPage.length === 0 ? (
                <tr>
                  <td colSpan="5" className="text-center">
                    No webPage found.
                  </td>
                </tr>
              ) : (
                webPage.map((page, index) => (
                  <tr key={page._id}>
                    <td className="text-center">{index + 1}</td>
                    <td>
                      <span style={{ cursor: "pointer" }} className="text-primary" onClick={() => navigate(`/${page.slug}`)}>
                        {page.title}
                      </span>
                    </td>
                    <td>{page.status}</td>
                    <td className="text-center">
                      {new Date(page.createdOn).toLocaleDateString("en-GB", {
                        day: "2-digit",
                        month: "short",
                        year: "numeric",
                      })}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </Loader>
  );
}
