import { useDrag, useDrop } from "react-dnd";

export default function Block({ block, onSelect, selectedBlockId, moveBlock, findBlock, parentId, onDelete, onChangeType }) {
  const { index: originalIndex } = findBlock(block.id);

  const [{ isDragging }, drag] = useDrag({
    type: "BLOCK",
    item: { id: block.id, originalIndex, parentId },
    collect: (monitor) => ({
      isDragging: monitor.isDragging(),
    }),
  });

  const [{ isOver, canDrop }, drop] = useDrop({
    accept: "BLOCK",
    canDrop: (item) => item.id !== block.id,
    drop: ({ id: draggedId, parentId: draggedParentId }, monitor) => {
      if (!monitor.didDrop() && draggedId !== block.id) {
        const { index: overIndex, parentId: overParentId } = findBlock(block.id);
        const newParentId = block.type === "container" ? block.id : overParentId;
        const newIndex = block.type === "container" ? (block.children ? block.children.length : 0) : overIndex;
        moveBlock(draggedId, draggedParentId, newIndex, newParentId);
      }
    },
    collect: (monitor) => ({
      isOver: monitor.isOver({ shallow: true }),
      canDrop: monitor.canDrop(),
    }),
  });

  const isSelected = selectedBlockId === block.id;
  const opacity = isDragging ? 0.4 : 1;

  const handleSelect = (e) => {
    e.stopPropagation();
    onSelect(block);
  };

  const handleDelete = (e) => {
    e.stopPropagation();
    onDelete(block.id);
  };

  const getBorderStyle = () => {
    if (isDragging) return "2px dashed #007bff";
    if (isOver && canDrop) return "2px solid #28a745";
    if (isSelected) return "2px solid #0d6efd";
    return block.styles.border || "1px solid #dee2e6";
  };

  const getBoxShadow = () => {
    if (isSelected && !isDragging) return "0 0 0 3px rgba(13, 110, 253, 0.25)";
    if (isOver && canDrop) return "0 0 0 3px rgba(40, 167, 69, 0.25)";
    return "0 1px 3px rgba(0,0,0,0.1)";
  };

  const renderChildren = () => {
    if (block.type === "container" && block.children && block.children.length) {
      return block.children.map((childBlock) => (
        <Block
          key={childBlock.id}
          block={childBlock}
          onSelect={onSelect}
          selectedBlockId={selectedBlockId}
          moveBlock={moveBlock}
          findBlock={findBlock}
          parentId={block.id}
          onDelete={onDelete}
          onChangeType={onChangeType}
        />
      ));
    }
    return null;
  };

  return (
    <div
      ref={(node) => drag(drop(node))}
      style={{
        cursor: isDragging ? "grabbing" : "grab",
        opacity,
        maxWidth: block.styles.width || "300px",
        flex: "0 0 auto",
        margin: "4px",
        width: block.styles.width || "auto",
        height: block.styles.height || "auto",
        backgroundColor: block.styles.backgroundColor || "white",
        color: block.styles.color || "black",
        fontSize: block.styles.fontSize || "16px",
        padding: block.styles.padding || "12px",
        borderRadius: block.styles.borderRadius || "8px",
        border: getBorderStyle(),
        boxSizing: "border-box",
        display: "flex",
        flexDirection: "column",
        userSelect: "none",
        position: "relative",
        transition: "all 0.2s ease",
        boxShadow: getBoxShadow(),
      }}
      onClick={handleSelect}
    >
      {/* Selection Indicator */}
      {isSelected && !isDragging && (
        <div
          style={{
            position: "absolute",
            top: "-2px",
            right: "-2px",
            backgroundColor: "#0d6efd",
            color: "white",
            padding: "2px 8px",
            borderRadius: "0 6px 0 6px",
            fontSize: "10px",
            fontWeight: "600",
            textTransform: "uppercase",
            zIndex: 10,
          }}
        >
          Selected
        </div>
      )}

      {/* Block Content */}
      {block.type === "text" && <div style={{ margin: 0, whiteSpace: "pre-wrap", wordBreak: "break-word" }}>{block.content || "Enter text..."}</div>}

      {block.type === "image" && (
        <div style={{ width: "100%", height: "auto", overflow: "hidden", borderRadius: "4px" }}>
          {block.content.src ? (
            <img
              src={block.content.src}
              alt={block.content.alt || "Image"}
              style={{ width: "100%", height: "auto", display: "block" }}
              onError={(e) => {
                e.target.style.display = "none";
                e.target.nextSibling.style.display = "flex";
              }}
            />
          ) : null}
          <div
            style={{
              display: block.content.src ? "none" : "flex",
              alignItems: "center",
              justifyContent: "center",
              backgroundColor: "#f8f9fa",
              minHeight: "150px",
              color: "#6c757d",
              flexDirection: "column",
              gap: "8px",
            }}
          >
            <i className="bi bi-image" style={{ fontSize: "2rem" }}></i>
            <span style={{ fontSize: "12px" }}>Add image URL</span>
          </div>
        </div>
      )}

      {block.type === "button" && (
        <button
          style={{
            width: "100%",
            cursor: "grab",
            border: "none",
            backgroundColor: block.styles.backgroundColor || "#0d6efd",
            color: block.styles.color || "white",
            padding: block.styles.padding || "10px 20px",
            borderRadius: block.styles.borderRadius || "6px",
            fontSize: block.styles.fontSize || "16px",
            fontWeight: "500",
            transition: "all 0.2s ease",
          }}
        >
          {block.content.label || "Button"}
        </button>
      )}

      {block.type === "divider" && (
        <hr
          style={{
            width: "100%",
            border: "none",
            borderTop: `2px solid ${block.styles.color || "#dee2e6"}`,
            margin: "8px 0",
          }}
        />
      )}

      {block.type === "card" && (
        <div style={{ width: "100%" }}>
          <h6 style={{ marginBottom: "8px", fontWeight: "600", color: block.styles.color || "#212529" }}>{block.content.title || "Card Title"}</h6>
          <p style={{ margin: 0, fontSize: "14px", color: "#6c757d" }}>{block.content.body || "Card description goes here..."}</p>
        </div>
      )}

      {/* Container with Children */}
      {block.type === "container" && (
        <div
          style={{
            marginTop: "8px",
            padding: "12px",
            borderLeft: "3px solid #dee2e6",
            minHeight: "80px",
            position: "relative",
            backgroundColor: "rgba(248, 249, 250, 0.5)",
            borderRadius: "4px",
          }}
        >
          {block.children && block.children.length > 0 ? (
            <div style={{ display: "flex", flexWrap: "wrap", gap: "8px" }}>{renderChildren()}</div>
          ) : (
            <div
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                minHeight: "60px",
                color: "#adb5bd",
                fontSize: "13px",
                fontStyle: "italic",
              }}
            >
              Drop blocks here or add child blocks
            </div>
          )}

          {/* Indicator for Container */}
          {isOver && canDrop && (
            <div
              style={{
                position: "absolute",
                top: 0,
                left: 0,
                right: 0,
                bottom: 0,
                backgroundColor: "rgba(40, 167, 69, 0.1)",
                border: "2px dashed #28a745",
                borderRadius: "4px",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                pointerEvents: "none",
                zIndex: 10,
                color: "#28a745",
                fontWeight: "600",
              }}
            >
              <i className="bi bi-arrow-down-circle me-2"></i>
              Drop here
            </div>
          )}
        </div>
      )}
    </div>
  );
}
