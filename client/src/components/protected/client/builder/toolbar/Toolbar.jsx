/* ----------------------------- constants ----------------------------- */
import { DEFAULT_BLOCKS } from "../../../../../constants/default-blocks.constant";

export default function Toolbar({ onAddBlock }) {
  const BLOCK_TYPES = Object.keys(DEFAULT_BLOCKS);

  const blockIcons = {
    text: "bi-fonts",
    image: "bi-image",
    button: "bi-ui-radios",
    divider: "bi-dash-lg",
    card: "bi-card-text",
    container: "bi-box",
  };

  const blockDescriptions = {
    text: "Add text content",
    image: "Insert an image",
    button: "Add a clickable button",
    divider: "Insert a horizontal line",
    card: "Create a content card",
    container: "Add a container for nested blocks",
  };

  return (
    <div className="p-3 h-100" style={{ backgroundColor: "#f8f9fa" }}>
      <div className="mb-3">
        <h6 className="fw-bold text-uppercase text-muted" style={{ fontSize: "12px", letterSpacing: "1px" }}>
          <i className="bi bi-box-seam me-2"></i>
          Components
        </h6>
        <p className="text-muted small mb-0">Drag blocks to the canvas</p>
      </div>

      <div className="d-flex flex-column gap-2">
        {BLOCK_TYPES.map((type) => (
          <button
            key={type}
            className="btn btn-outline-primary text-start d-flex align-items-center"
            onClick={() => onAddBlock(type)}
            style={{
              borderRadius: "8px",
              padding: "12px",
              border: "2px solid #e9ecef",
              backgroundColor: "white",
              transition: "all 0.2s ease",
            }}
            onMouseEnter={(e) => {
              e.target.style.borderColor = "#0d6efd";
              e.target.style.backgroundColor = "#f0f7ff";
              e.target.style.transform = "translateX(4px)";
            }}
            onMouseLeave={(e) => {
              e.target.style.borderColor = "#e9ecef";
              e.target.style.backgroundColor = "white";
              e.target.style.transform = "translateX(0)";
            }}
          >
            <div
              style={{
                width: "36px",
                height: "36px",
                borderRadius: "6px",
                backgroundColor: "#e7f1ff",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                marginRight: "12px",
              }}
            >
              <i className={`bi ${blockIcons[type] || "bi-square"}`} style={{ fontSize: "18px", color: "#0d6efd" }}></i>
            </div>
            <div className="flex-grow-1">
              <div style={{ fontWeight: "600", fontSize: "14px", color: "#212529" }}>{type.charAt(0).toUpperCase() + type.slice(1)}</div>
              <div style={{ fontSize: "11px", color: "#6c757d" }}>{blockDescriptions[type] || "Add block"}</div>
            </div>
          </button>
        ))}
      </div>

      {/* Help Section */}
      <div
        className="mt-4 p-3"
        style={{
          backgroundColor: "#fff3cd",
          borderRadius: "8px",
          border: "1px solid #ffc107",
        }}
      >
        <div className="d-flex align-items-start">
          <i className="bi bi-lightbulb text-warning me-2" style={{ fontSize: "20px" }}></i>
          <div>
            <div style={{ fontSize: "12px", fontWeight: "600", color: "#856404", marginBottom: "4px" }}>Quick Tip</div>
            <div style={{ fontSize: "11px", color: "#856404" }}>
              Click to add blocks to the canvas. Use the container block to create nested layouts.
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
