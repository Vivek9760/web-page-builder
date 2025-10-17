import { useState } from "react";
import Block from "./Block";
import { useDrop } from "react-dnd";

export default function Playground({
  blocks,
  onSelectBlock,
  selectedBlockId,
  moveBlock,
  findBlock,
  onDelete,
  onChangeType,
  submitWebPage,
  title,
  setTitle,
  onUndo,
  onRedo,
  canUndo,
  canRedo,
}) {
  const [isHovering, setIsHovering] = useState(false);

  const [, drop] = useDrop({
    accept: "BLOCK",
    hover() {
      setIsHovering(true);
    },
    drop(item) {
      setIsHovering(false);
      const { id: draggedId, parentId: draggedParentId } = item;
      const newParentId = null;
      if (draggedParentId !== newParentId) {
        moveBlock(draggedId, draggedParentId, blocks.length, newParentId);
      }
    },
  });

  const playgroundStyle = {
    minHeight: "calc(100vh - 64px)",
    overflowY: "auto",
    display: "flex",
    flexWrap: "wrap",
    alignContent: "flex-start",
    gap: "12px",
    padding: "20px",
    backgroundColor: isHovering ? "#e8f5e9" : "#f8f9fa",
    border: isHovering ? "2px dashed #28a745" : "none",
    transition: "all 0.2s ease",
  };

  return (
    <div style={{ height: "100%", display: "flex", flexDirection: "column" }}>
      {/* Header Section */}
      <div className="bg-white border-bottom" style={{ padding: "16px 20px" }}>
        <div className="d-flex align-items-center justify-content-between mb-3">
          <div className="flex-grow-1 me-3">
            <input
              type="text"
              className="form-control form-control-lg"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Enter page title..."
              style={{
                border: "2px solid #e9ecef",
                borderRadius: "8px",
                fontSize: "1.25rem",
                fontWeight: "600",
              }}
            />
          </div>
          <div className="d-flex gap-2">
            <button className="btn btn-outline-secondary" onClick={() => submitWebPage("draft")} style={{ borderRadius: "6px", padding: "8px 20px" }}>
              <i className="bi bi-save me-2"></i>
              Save Draft
            </button>
            <button className="btn btn-primary" onClick={() => submitWebPage("published")} style={{ borderRadius: "6px", padding: "8px 20px" }}>
              <i className="bi bi-upload me-2"></i>
              Publish
            </button>
          </div>
        </div>

        {/* Undo/Redo Controls */}
        <div className="d-flex align-items-center gap-2">
          <button
            className={`btn btn-sm ${canUndo ? "btn-outline-primary" : "btn-outline-secondary"}`}
            onClick={onUndo}
            disabled={!canUndo}
            title="Undo (Ctrl+Z)"
            style={{ borderRadius: "6px" }}
          >
            <i className="bi bi-arrow-counterclockwise me-1"></i>
            Undo
          </button>
          <button
            className={`btn btn-sm ${canRedo ? "btn-outline-primary" : "btn-outline-secondary"}`}
            onClick={onRedo}
            disabled={!canRedo}
            title="Redo (Ctrl+Y)"
            style={{ borderRadius: "6px" }}
          >
            <i className="bi bi-arrow-clockwise me-1"></i>
            Redo
          </button>
          <div className="ms-3 text-muted small">
            <i className="bi bi-info-circle me-1"></i>
            Drag and drop blocks to rearrange
          </div>
        </div>
      </div>

      {/* Canvas Area */}
      <div ref={drop} style={playgroundStyle} onMouseLeave={() => setIsHovering(false)}>
        {blocks.length ? (
          blocks.map((block) => (
            <Block
              key={block.id}
              block={block}
              onSelect={onSelectBlock}
              selectedBlockId={selectedBlockId}
              moveBlock={moveBlock}
              findBlock={findBlock}
              parentId={null}
              onDelete={onDelete}
              onChangeType={onChangeType}
            />
          ))
        ) : (
          <div
            className="d-flex flex-column align-items-center justify-content-center border rounded"
            style={{
              minHeight: "400px",
              width: "100%",
              color: "#6c757d",
              backgroundColor: "#ffffff",
              border: "2px dashed #dee2e6 !important",
              textAlign: "center",
              padding: "40px",
            }}
          >
            <div
              style={{
                width: "80px",
                height: "80px",
                borderRadius: "50%",
                backgroundColor: "#f8f9fa",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                marginBottom: "20px",
              }}
            >
              <i className="bi bi-cursor" style={{ fontSize: "2.5rem", color: "#adb5bd" }}></i>
            </div>
            <h5 style={{ color: "#495057", marginBottom: "8px" }}>Your canvas is empty</h5>
            <p style={{ color: "#6c757d", marginBottom: "0" }}>Select a block from the left toolbar to start building your page</p>
          </div>
        )}
      </div>
    </div>
  );
}
