/* ----------------------------- react ----------------------------- */
import { useEffect, useState } from "react";

/* ----------------------------- libraries ----------------------------- */
import axios from "axios";
import { useNavigate, useParams } from "react-router-dom";

/* ----------------------------- components ----------------------------- */
import Loader from "../../../common-ui/Loader";

const RenderBlock = ({ block }) => {
  const { type, content, styles, children = [] } = block;

  const defaultStyles = {
    margin: styles?.margin || "0",
    padding: styles?.padding || "0",
  };

  switch (type) {
    case "text":
      return (
        <div
          style={{
            ...defaultStyles,
            ...styles,
            whiteSpace: "pre-wrap",
            wordBreak: "break-word",
          }}
        >
          {content || ""}
        </div>
      );

    case "image":
      return (
        <div style={{ ...defaultStyles, ...styles, display: "inline-block" }}>
          {content?.src ? (
            <img
              src={content.src}
              alt={content?.alt || "Image"}
              style={{
                maxWidth: "100%",
                height: "auto",
                display: "block",
                borderRadius: styles?.borderRadius || "0",
              }}
              onError={(e) => {
                e.target.style.display = "none";
                e.target.nextSibling.style.display = "flex";
              }}
            />
          ) : null}
          <div
            style={{
              display: content?.src ? "none" : "flex",
              alignItems: "center",
              justifyContent: "center",
              backgroundColor: "#f8f9fa",
              minHeight: "200px",
              color: "#6c757d",
              borderRadius: styles?.borderRadius || "8px",
            }}
          >
            <span>Image not available</span>
          </div>
        </div>
      );

    case "button":
      return (
        <a
          href={content?.link || "#"}
          className="btn"
          style={{
            ...defaultStyles,
            ...styles,
            textDecoration: "none",
            display: "inline-block",
            cursor: "pointer",
          }}
          target={content?.link && content.link.startsWith("http") ? "_blank" : "_self"}
          rel="noopener noreferrer"
        >
          {content?.label || "Button"}
        </a>
      );

    case "divider":
      return (
        <hr
          style={{
            ...defaultStyles,
            ...styles,
            border: "none",
            borderTop: `2px solid ${styles?.color || "#dee2e6"}`,
          }}
        />
      );

    case "card":
      return (
        <div
          className="card"
          style={{
            ...defaultStyles,
            ...styles,
            display: "inline-block",
            overflow: "hidden",
          }}
        >
          {content?.image && (
            <img
              src={content.image}
              className="card-img-top"
              alt={content?.title || "Card image"}
              style={{ width: "100%", height: "auto" }}
              onError={(e) => {
                e.target.style.display = "none";
              }}
            />
          )}
          <div className="card-body" style={{ padding: "16px" }}>
            {content?.title && (
              <h5 className="card-title" style={{ color: styles?.color || "#212529", marginBottom: "8px" }}>
                {content.title}
              </h5>
            )}
            {content?.body && (
              <p className="card-text" style={{ color: "#6c757d", marginBottom: "0" }}>
                {content.body}
              </p>
            )}
          </div>
        </div>
      );

    case "form":
      return (
        <div style={{ ...defaultStyles, ...styles }}>
          <form action={content?.action || "#"} method={content?.method || "POST"}>
            {content?.fields &&
              content.fields.map((field, idx) => (
                <div key={field.id || idx} style={{ marginBottom: "16px" }}>
                  <label style={{ display: "block", marginBottom: "6px", fontSize: "14px", fontWeight: "500" }}>
                    {field.label}
                    {field.required && <span style={{ color: "#dc3545" }}> *</span>}
                  </label>
                  {field.type === "textarea" ? (
                    <textarea
                      name={field.id}
                      placeholder={field.placeholder}
                      required={field.required}
                      rows={field.rows || 4}
                      style={{
                        width: "100%",
                        padding: "8px 12px",
                        borderRadius: "4px",
                        border: "1px solid #ced4da",
                        fontSize: "14px",
                        fontFamily: "inherit",
                        resize: "vertical",
                      }}
                    />
                  ) : (
                    <input
                      type={field.type || "text"}
                      name={field.id}
                      placeholder={field.placeholder}
                      required={field.required}
                      style={{
                        width: "100%",
                        padding: "8px 12px",
                        borderRadius: "4px",
                        border: "1px solid #ced4da",
                        fontSize: "14px",
                      }}
                    />
                  )}
                </div>
              ))}
            <button
              type="submit"
              className="btn btn-primary"
              style={{
                width: "100%",
                padding: "10px 20px",
                fontSize: "14px",
                fontWeight: "500",
              }}
            >
              {content?.submitButton || "Submit"}
            </button>
          </form>
        </div>
      );

    case "list":
      return (
        <div style={{ ...defaultStyles, ...styles }}>
          {content?.listType === "ordered" ? (
            <ol style={{ margin: 0, paddingLeft: "20px" }}>
              {content?.items &&
                content.items.map((item, idx) => (
                  <li key={idx} style={{ marginBottom: "6px" }}>
                    {item}
                  </li>
                ))}
            </ol>
          ) : (
            <ul style={{ margin: 0, paddingLeft: "20px" }}>
              {content?.items &&
                content.items.map((item, idx) => (
                  <li key={idx} style={{ marginBottom: "6px" }}>
                    {item}
                  </li>
                ))}
            </ul>
          )}
        </div>
      );

    case "container":
      return (
        <div
          style={{
            ...defaultStyles,
            ...styles,
            display: "flex",
            flexWrap: "wrap",
            gap: "12px",
          }}
        >
          {children && children.length > 0 ? (
            children.map((child) => <RenderBlock key={child.id} block={child} />)
          ) : (
            <div style={{ color: "#adb5bd", fontStyle: "italic", padding: "20px" }}>Empty container</div>
          )}
        </div>
      );

    default:
      return (
        <div
          style={{
            color: "red",
            padding: "10px",
            backgroundColor: "#fff3cd",
            borderRadius: "4px",
            border: "1px solid #ffc107",
          }}
        >
          ⚠️ Unknown block type: {type}
        </div>
      );
  }
};

const PagePreview = () => {
  const [webPage, setWebPage] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { slug } = useParams();
  const navigate = useNavigate();

  useEffect(() => {
    if (slug) {
      fetchWebPage();
    }
  }, [slug]);

  const fetchWebPage = async () => {
    try {
      setLoading(true);
      const { data } = await axios.get(`/api/user/web-page/${slug}`);
      setWebPage(data.webPage);
      setError(null);
    } catch (err) {
      console.error(err);
      setError(err.response?.data?.message || "Failed to fetch webpage.");
    } finally {
      setLoading(false);
    }
  };

  if (error) {
    return (
      <div className="container my-5">
        <div className="alert alert-danger d-flex align-items-center" role="alert">
          <i className="bi bi-exclamation-triangle-fill me-3" style={{ fontSize: "24px" }}></i>
          <div>
            <h5 className="alert-heading mb-1">Error Loading Page</h5>
            <p className="mb-0">{error}</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <Loader isLoading={loading}>
      {webPage && (
        <div style={{ minHeight: "100vh", backgroundColor: "#ffffff" }}>
          {/* Header */}
          <div className="bg-light border-bottom" style={{ padding: "40px 0", marginBottom: "40px" }}>
            <div className="container">
              <div className="text-center">
                <h1 className="display-4 fw-bold mb-2" style={{ color: "#212529" }}>
                  {webPage.title || "Untitled Page"}
                </h1>
                <div className="d-flex align-items-center justify-content-center gap-3 text-muted">
                  <span>
                    <i className="bi bi-link-45deg me-1"></i>
                    <code style={{ fontSize: "14px" }}>{webPage.slug}</code>
                  </span>
                  <span>•</span>
                  <span>
                    <i className="bi bi-calendar me-1"></i>
                    {new Date(webPage.createdOn).toLocaleDateString()}
                  </span>
                  <span>•</span>
                  <span className={`badge ${webPage.status === "published" ? "bg-success" : "bg-secondary"}`}>{webPage.status}</span>
                  <span>•</span>
                  <span
                    className="ms-2 bi bi-pencil-square"
                    style={{ cursor: "pointer" }}
                    onClick={() => navigate(`/builder/${webPage.slug}`)}
                  ></span>
                </div>
              </div>
            </div>
          </div>

          {/* Content */}
          <div className="container pb-5">
            {webPage.blocks && webPage.blocks.length > 0 ? (
              <div style={{ display: "flex", flexWrap: "wrap", gap: "16px" }}>
                {webPage.blocks.map((block) => (
                  <RenderBlock key={block.id} block={block} />
                ))}
              </div>
            ) : (
              <div
                className="text-center p-5"
                style={{
                  backgroundColor: "#f8f9fa",
                  borderRadius: "8px",
                  border: "2px dashed #dee2e6",
                }}
              >
                <i className="bi bi-inbox" style={{ fontSize: "48px", color: "#adb5bd" }}></i>
                <h4 className="mt-3 text-muted">No content yet</h4>
                <p className="text-muted">This page doesn't have any blocks yet.</p>
              </div>
            )}
          </div>

          {/* Footer */}
          <div className="bg-light border-top mt-5" style={{ padding: "30px 0" }}>
            <div className="container text-center text-muted">
              <small>
                <i className="bi bi-box-seam me-1"></i>
                Built with Page Builder
              </small>
            </div>
          </div>
        </div>
      )}
    </Loader>
  );
};

export default PagePreview;
