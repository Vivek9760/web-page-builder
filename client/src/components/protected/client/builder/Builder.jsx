import React, { useState, useCallback, useEffect } from "react";

/* ----------------------------- libraries ----------------------------- */
import axios from "axios";
import { v4 as uuidv4 } from "uuid";
import { DndProvider } from "react-dnd";
import { useNavigate, useParams } from "react-router-dom";
import { HTML5Backend } from "react-dnd-html5-backend";

/* ----------------------------- constants ----------------------------- */
import { DEFAULT_BLOCKS } from "../../../../constants/default-blocks.constant";

/* ----------------------------- components ----------------------------- */
import Toolbar from "./toolbar/Toolbar";
import EditPanel from "./edit-panel/EditPanel";
import Playground from "./playground/Playground";

/* ----------------------------- utils ----------------------------- */
import toasty from "../../../../utils/toasty.util";
import Loader from "../../../common-ui/Loader";

function updateBlockInTree(blocks, updatedBlock) {
  return blocks.map((block) => {
    if (block.id === updatedBlock.id) return updatedBlock;
    if (block.type === "container" && block.children) {
      return { ...block, children: updateBlockInTree(block.children, updatedBlock) };
    }
    return block;
  });
}

function removeBlockFromTree(blocks, blockId) {
  return blocks
    .filter((block) => block.id !== blockId)
    .map((block) => {
      if (block.type === "container" && block.children) {
        return { ...block, children: removeBlockFromTree(block.children, blockId) };
      }
      return block;
    });
}

function findBlockById(blocks, id, parentId = null) {
  for (let index = 0; index < blocks.length; index++) {
    const block = blocks[index];
    if (block.id === id) return { block, index, parentId };
    if (block.type === "container" && block.children) {
      const foundChild = findBlockById(block.children, id, block.id);
      if (foundChild) return foundChild;
    }
  }
  return null;
}

export default function PageBuilder() {
  const { slug } = useParams();
  const navigate = useNavigate();
  const [title, setTitle] = useState("Web Page");
  const [blocks, setBlocks] = useState([]);
  const [selectedBlock, setSelectedBlock] = useState(null);
  const [loading, setLoading] = useState(false);

  const [history, setHistory] = useState([]);
  const [historyIndex, setHistoryIndex] = useState(-1);

  useEffect(() => {
    if (slug) fetchWebPage();
  }, [slug]);

  useEffect(() => {
    if (blocks.length > 0 && history.length === 0) {
      setHistory([{ blocks, title }]);
      setHistoryIndex(0);
    }
  }, [blocks]);

  const fetchWebPage = async () => {
    try {
      setLoading(true);
      const { data } = await axios.get(`/api/user/web-page/${slug}`);
      setBlocks(data.webPage.blocks);
      setTitle(data.webPage.title);
    } catch (err) {
      console.error(err);
      toasty.error("Failed to fetch webpage.");
    } finally {
      setLoading(false);
    }
  };

  const saveToHistory = useCallback(
    (newBlocks, newTitle) => {
      const newHistory = history.slice(0, historyIndex + 1);
      newHistory.push({ blocks: newBlocks, title: newTitle });

      if (newHistory.length > 50) {
        newHistory.shift();
      } else {
        setHistoryIndex(historyIndex + 1);
      }

      setHistory(newHistory);
    },
    [history, historyIndex]
  );

  /* ----------------------------- undo ----------------------------- */
  const handleUndo = useCallback(() => {
    if (historyIndex > 0) {
      const newIndex = historyIndex - 1;
      setHistoryIndex(newIndex);
      const state = history[newIndex];
      setBlocks(state.blocks);
      setTitle(state.title);

      if (selectedBlock) {
        const exists = findBlockById(state.blocks, selectedBlock.id);
        if (!exists) setSelectedBlock(null);
      }
    }
  }, [historyIndex, history, selectedBlock]);

  /* ----------------------------- redo ----------------------------- */
  const handleRedo = useCallback(() => {
    if (historyIndex < history.length - 1) {
      const newIndex = historyIndex + 1;
      setHistoryIndex(newIndex);
      const state = history[newIndex];
      setBlocks(state.blocks);
      setTitle(state.title);
    }
  }, [historyIndex, history]);

  const findBlock = useCallback(
    (id, blocksList = blocks, parentId = null) => {
      return findBlockById(blocksList, id, parentId);
    },
    [blocks]
  );

  const submitWebPage = useCallback(
    async (status) => {
      if (blocks.length) {
        try {
          const { data } = await axios.post(`/api/user/web-page/${status}`, {
            title,
            slug,
            blocks,
          });
          toasty.success(data.message);
          navigate(`/builder/${data.slug}`);
        } catch (err) {
          console.error(err);
          toasty.error("Failed to save webpage.");
        }
      } else {
        toasty.error("Bold move leaving it blank… now try adding at least one element!");
      }
    },
    [title, blocks, slug, navigate]
  );

  const moveBlock = useCallback(
    (draggedId, draggedParentId, overIndex, newParentId) => {
      let newBlocks = JSON.parse(JSON.stringify(blocks)); // Deep clone
      let draggedBlock = null;

      // Remove dragged block from its current location
      if (draggedParentId === null) {
        const idx = newBlocks.findIndex((b) => b.id === draggedId);
        if (idx > -1) {
          [draggedBlock] = newBlocks.splice(idx, 1);
        }
      } else {
        function removeFromContainer(blockList, parentID) {
          return blockList.map((block) => {
            if (block.id === parentID) {
              const idx = block.children.findIndex((c) => c.id === draggedId);
              if (idx > -1) {
                [draggedBlock] = block.children.splice(idx, 1);
              }
              return block;
            }
            if (block.type === "container" && block.children) {
              return { ...block, children: removeFromContainer(block.children, parentID) };
            }
            return block;
          });
        }
        newBlocks = removeFromContainer(newBlocks, draggedParentId);
      }

      if (!draggedBlock) return;

      // Insert dragged block at new location
      if (newParentId === null) {
        newBlocks.splice(overIndex, 0, draggedBlock);
      } else {
        function insertIntoContainer(blockList) {
          return blockList.map((block) => {
            if (block.id === newParentId) {
              const children = block.children ? [...block.children] : [];
              children.splice(overIndex, 0, draggedBlock);
              return { ...block, children };
            }
            if (block.type === "container" && block.children) {
              return { ...block, children: insertIntoContainer(block.children) };
            }
            return block;
          });
        }
        newBlocks = insertIntoContainer(newBlocks);
      }

      setBlocks(newBlocks);
      saveToHistory(newBlocks, title);
    },
    [blocks, title, saveToHistory]
  );

  const handleAddBlock = (type) => {
    const newBlock = {
      ...DEFAULT_BLOCKS[type],
      id: uuidv4(),
      children: type === "container" ? [] : undefined,
    };
    const newBlocks = [...blocks, newBlock];
    setBlocks(newBlocks);
    saveToHistory(newBlocks, title);
    setSelectedBlock(newBlock);
  };

  const handleSelectBlock = (block) => setSelectedBlock(block);

  const handleUpdateBlock = (updatedBlock) => {
    const newBlocks = updateBlockInTree(blocks, updatedBlock);
    setBlocks(newBlocks);
    setSelectedBlock(updatedBlock);
    saveToHistory(newBlocks, title);
  };

  const handleDeleteBlock = (blockId) => {
    const newBlocks = removeBlockFromTree(blocks, blockId);
    setBlocks(newBlocks);
    saveToHistory(newBlocks, title);

    if (selectedBlock && selectedBlock.id === blockId) {
      setSelectedBlock(null);
    }
  };

  const handleAddChildBlock = () => {
    if (!selectedBlock || selectedBlock.type !== "container") return;
    const newChild = { ...DEFAULT_BLOCKS["text"], id: uuidv4() };
    const updatedContainer = {
      ...selectedBlock,
      children: [...(selectedBlock.children || []), newChild],
    };
    handleUpdateBlock(updatedContainer);
  };

  const handleChangeBlockType = (newBlock) => {
    handleUpdateBlock(newBlock);
  };

  const handleTitleChange = (newTitle) => {
    setTitle(newTitle);
    saveToHistory(blocks, newTitle);
  };

  return (
    <Loader isLoading={loading}>
      <DndProvider backend={HTML5Backend}>
        <div className="d-flex" style={{ height: "calc(100vh - 64px)" }}>
          <div className="col-2 border-end overflow-auto bg-light" style={{ height: "100%" }}>
            <Toolbar onAddBlock={handleAddBlock} />
          </div>

          <div className="col-7 overflow-auto" style={{ height: "100%" }}>
            <Playground
              blocks={blocks}
              title={title}
              setTitle={handleTitleChange}
              onSelectBlock={handleSelectBlock}
              selectedBlockId={selectedBlock?.id}
              moveBlock={moveBlock}
              findBlock={findBlock}
              submitWebPage={submitWebPage}
              onDelete={handleDeleteBlock}
              onChangeType={handleChangeBlockType}
              onUndo={handleUndo}
              onRedo={handleRedo}
              canUndo={historyIndex > 0}
              canRedo={historyIndex < history.length - 1}
            />
          </div>

          <div className="col-3 border-start overflow-auto bg-light" style={{ height: "100%" }}>
            <EditPanel
              block={selectedBlock}
              onChange={handleUpdateBlock}
              onAddChild={handleAddChildBlock}
              onDelete={handleDeleteBlock}
              onChangeType={handleChangeBlockType}
            />
          </div>
        </div>
      </DndProvider>
    </Loader>
  );
}
