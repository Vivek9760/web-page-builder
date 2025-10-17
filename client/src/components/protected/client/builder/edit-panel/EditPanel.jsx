/* ----------------------------- constants ----------------------------- */
import { DEFAULT_BLOCKS } from "../../../../../constants/default-blocks.constant";

export default function EditPanel({ block, onChange, onAddChild, onDelete, onChangeType }) {
  const BLOCK_TYPES = Object.keys(DEFAULT_BLOCKS);

  if (!block) {
    return (
      <div className="p-4 h-100 d-flex flex-column align-items-center justify-content-center text-center">
        <div
          style={{
            width: "80px",
            height: "80px",
            borderRadius: "50%",
            backgroundColor: "#f8f9fa",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            marginBottom: "16px",
          }}
        >
          <i className="bi bi-hand-index" style={{ fontSize: "2rem", color: "#adb5bd" }}></i>
        </div>
        <h6 style={{ color: "#495057", marginBottom: "8px" }}>No Block Selected</h6>
        <p style={{ color: "#6c757d", fontSize: "14px", margin: 0 }}>Click on a block in the canvas to edit its properties</p>
      </div>
    );
  }

  const handleStyleChange = (key, value) => {
    onChange({ ...block, styles: { ...block.styles, [key]: value } });
  };

  const handleTypeChange = (newType) => {
    if (!newType || newType === block.type) return;

    let newBlock = { ...block };
    const baseNew = DEFAULT_BLOCKS[newType];
    newBlock.type = newType;
    newBlock.content = baseNew.content;
    newBlock.styles = { ...baseNew.styles };
    newBlock.children = newType === "container" ? block.children || [] : undefined;
    onChangeType(newBlock);
  };

  return (
    <div className="h-100" style={{ backgroundColor: "#f8f9fa" }}>
      {/* Header */}
      <div className="p-3 bg-white border-bottom">
        <div className="d-flex justify-content-between align-items-center">
          <h6 className="mb-0 fw-bold" style={{ color: "#212529" }}>
            <i className="bi bi-gear me-2"></i>
            Block Properties
          </h6>
          <div className="d-flex gap-2">
            {block.type === "container" && (
              <button className="btn btn-success btn-sm" onClick={onAddChild} title="Add child block" style={{ borderRadius: "6px" }}>
                <i className="bi bi-plus-circle"></i>
              </button>
            )}
            <button className="btn btn-danger btn-sm" onClick={() => onDelete(block.id)} title="Delete block" style={{ borderRadius: "6px" }}>
              <i className="bi bi-trash"></i>
            </button>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="p-3" style={{ overflowY: "auto", height: "calc(100% - 65px)" }}>
        {/* Block Type */}
        <div className="mb-4">
          <label className="form-label fw-semibold small text-uppercase text-muted mb-2">Block Type</label>
          <select className="form-select" value={block.type} onChange={(e) => handleTypeChange(e.target.value)} style={{ borderRadius: "6px" }}>
            {BLOCK_TYPES.map((type) => (
              <option key={type} value={type}>
                {type.charAt(0).toUpperCase() + type.slice(1)}
              </option>
            ))}
          </select>
        </div>

        {/* Content Section */}
        <div className="mb-4">
          <label className="form-label fw-semibold small text-uppercase text-muted mb-2">Content</label>

          {block.type === "text" && (
            <div className="mb-2">
              <textarea
                className="form-control"
                placeholder="Enter text content..."
                style={{ height: "120px", borderRadius: "6px", resize: "vertical" }}
                value={block.content}
                onChange={(e) => onChange({ ...block, content: e.target.value })}
              />
            </div>
          )}

          {block.type === "image" && (
            <>
              <div className="mb-2">
                <label className="form-label small">Image URL</label>
                <input
                  type="text"
                  className="form-control"
                  placeholder="https://example.com/image.jpg"
                  value={block.content.src}
                  onChange={(e) => onChange({ ...block, content: { ...block.content, src: e.target.value } })}
                  style={{ borderRadius: "6px" }}
                />
              </div>
              <div className="mb-2">
                <label className="form-label small">Alt Text</label>
                <input
                  type="text"
                  className="form-control"
                  placeholder="Description of image"
                  value={block.content.alt}
                  onChange={(e) => onChange({ ...block, content: { ...block.content, alt: e.target.value } })}
                  style={{ borderRadius: "6px" }}
                />
              </div>
            </>
          )}

          {block.type === "button" && (
            <>
              <div className="mb-2">
                <label className="form-label small">Button Label</label>
                <input
                  type="text"
                  className="form-control"
                  placeholder="Click Me"
                  value={block.content.label}
                  onChange={(e) => onChange({ ...block, content: { ...block.content, label: e.target.value } })}
                  style={{ borderRadius: "6px" }}
                />
              </div>
              <div className="mb-2">
                <label className="form-label small">Link URL</label>
                <input
                  type="text"
                  className="form-control"
                  placeholder="https://example.com"
                  value={block.content.link}
                  onChange={(e) => onChange({ ...block, content: { ...block.content, link: e.target.value } })}
                  style={{ borderRadius: "6px" }}
                />
              </div>
            </>
          )}

          {block.type === "card" && (
            <>
              <div className="mb-2">
                <label className="form-label small">Card Title</label>
                <input
                  type="text"
                  className="form-control"
                  placeholder="Card Title"
                  value={block.content.title}
                  onChange={(e) => onChange({ ...block, content: { ...block.content, title: e.target.value } })}
                  style={{ borderRadius: "6px" }}
                />
              </div>
              <div className="mb-2">
                <label className="form-label small">Card Body</label>
                <textarea
                  className="form-control"
                  placeholder="Card description"
                  style={{ height: "80px", borderRadius: "6px" }}
                  value={block.content.body}
                  onChange={(e) => onChange({ ...block, content: { ...block.content, body: e.target.value } })}
                />
              </div>
            </>
          )}

          {block.type === "container" && (
            <div className="alert alert-info mb-0" style={{ borderRadius: "6px", fontSize: "13px" }}>
              <i className="bi bi-info-circle me-2"></i>
              This is a container block. Add child blocks or drag blocks into it.
            </div>
          )}

          {block.type === "divider" && (
            <div className="alert alert-secondary mb-0" style={{ borderRadius: "6px", fontSize: "13px" }}>
              <i className="bi bi-dash-lg me-2"></i>
              This is a divider block. Customize its color in the styles section.
            </div>
          )}
        </div>

        {/* Styles Section */}
        <div className="mb-3">
          <label className="form-label fw-semibold small text-uppercase text-muted mb-2">Styles</label>

          <div className="accordion" id="stylesAccordion">
            {/* Layout Styles */}
            <div className="accordion-item" style={{ borderRadius: "6px", marginBottom: "8px" }}>
              <h2 className="accordion-header">
                <button
                  className="accordion-button"
                  type="button"
                  data-bs-toggle="collapse"
                  data-bs-target="#layoutStyles"
                  style={{ fontSize: "14px", padding: "10px 14px" }}
                >
                  <i className="bi bi-layout-wtf me-2"></i>
                  Layout
                </button>
              </h2>
              <div id="layoutStyles" className="accordion-collapse collapse show">
                <div className="accordion-body p-2">
                  <div className="mb-2">
                    <label className="form-label small">Width</label>
                    <input
                      type="text"
                      className="form-control form-control-sm"
                      placeholder="e.g., 300px, 100%, auto"
                      value={block.styles.width || ""}
                      onChange={(e) => handleStyleChange("width", e.target.value)}
                      style={{ borderRadius: "6px" }}
                    />
                  </div>
                  <div className="mb-2">
                    <label className="form-label small">Height</label>
                    <input
                      type="text"
                      className="form-control form-control-sm"
                      placeholder="e.g., 200px, auto"
                      value={block.styles.height || ""}
                      onChange={(e) => handleStyleChange("height", e.target.value)}
                      style={{ borderRadius: "6px" }}
                    />
                  </div>
                  <div className="mb-2">
                    <label className="form-label small">Padding</label>
                    <input
                      type="text"
                      className="form-control form-control-sm"
                      placeholder="e.g., 16px, 10px 20px"
                      value={block.styles.padding || ""}
                      onChange={(e) => handleStyleChange("padding", e.target.value)}
                      style={{ borderRadius: "6px" }}
                    />
                  </div>
                  <div className="mb-0">
                    <label className="form-label small">Margin</label>
                    <input
                      type="text"
                      className="form-control form-control-sm"
                      placeholder="e.g., 8px 0, 10px"
                      value={block.styles.margin || ""}
                      onChange={(e) => handleStyleChange("margin", e.target.value)}
                      style={{ borderRadius: "6px" }}
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Appearance Styles */}
            <div className="accordion-item" style={{ borderRadius: "6px", marginBottom: "8px" }}>
              <h2 className="accordion-header">
                <button
                  className="accordion-button collapsed"
                  type="button"
                  data-bs-toggle="collapse"
                  data-bs-target="#appearanceStyles"
                  style={{ fontSize: "14px", padding: "10px 14px" }}
                >
                  <i className="bi bi-palette me-2"></i>
                  Appearance
                </button>
              </h2>
              <div id="appearanceStyles" className="accordion-collapse collapse">
                <div className="accordion-body p-2">
                  <div className="mb-2">
                    <label className="form-label small">Background Color</label>
                    <div className="input-group input-group-sm">
                      <input
                        type="color"
                        className="form-control form-control-color"
                        value={block.styles.backgroundColor || "#ffffff"}
                        onChange={(e) => handleStyleChange("backgroundColor", e.target.value)}
                        style={{ maxWidth: "50px" }}
                      />
                      <input
                        type="text"
                        className="form-control"
                        placeholder="#ffffff"
                        value={block.styles.backgroundColor || ""}
                        onChange={(e) => handleStyleChange("backgroundColor", e.target.value)}
                        style={{ borderRadius: "0 6px 6px 0" }}
                      />
                    </div>
                  </div>
                  <div className="mb-2">
                    <label className="form-label small">Text Color</label>
                    <div className="input-group input-group-sm">
                      <input
                        type="color"
                        className="form-control form-control-color"
                        value={block.styles.color || "#000000"}
                        onChange={(e) => handleStyleChange("color", e.target.value)}
                        style={{ maxWidth: "50px" }}
                      />
                      <input
                        type="text"
                        className="form-control"
                        placeholder="#000000"
                        value={block.styles.color || ""}
                        onChange={(e) => handleStyleChange("color", e.target.value)}
                        style={{ borderRadius: "0 6px 6px 0" }}
                      />
                    </div>
                  </div>
                  <div className="mb-2">
                    <label className="form-label small">Font Size</label>
                    <input
                      type="text"
                      className="form-control form-control-sm"
                      placeholder="e.g., 16px, 1.2rem"
                      value={block.styles.fontSize || ""}
                      onChange={(e) => handleStyleChange("fontSize", e.target.value)}
                      style={{ borderRadius: "6px" }}
                    />
                  </div>
                  <div className="mb-2">
                    <label className="form-label small">Border</label>
                    <input
                      type="text"
                      className="form-control form-control-sm"
                      placeholder="e.g., 1px solid black"
                      value={block.styles.border || ""}
                      onChange={(e) => handleStyleChange("border", e.target.value)}
                      style={{ borderRadius: "6px" }}
                    />
                  </div>
                  <div className="mb-0">
                    <label className="form-label small">Border Radius</label>
                    <input
                      type="text"
                      className="form-control form-control-sm"
                      placeholder="e.g., 8px, 50%"
                      value={block.styles.borderRadius || ""}
                      onChange={(e) => handleStyleChange("borderRadius", e.target.value)}
                      style={{ borderRadius: "6px" }}
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
