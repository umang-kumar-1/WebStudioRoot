import React, { useEffect, useState } from "react";
import { API_BASE } from "./api";

function Documents() {
  const [items, setItems] = useState([]);
  const [path, setPath] = useState([]);

  // Load root or folder
  const loadItems = async (folderId = null, folderName = null) => {
    try {
      const url = folderId
        ? `${API_BASE}/api/list?folderId=${folderId}`
        : `${API_BASE}/api/list`;

      const res = await fetch(url);
      const data = await res.json();

      if (Array.isArray(data)) {
        setItems(data);

        // ✅ breadcrumb update
        if (folderId && folderName) {
          setPath(prev => [...prev, { id: folderId, name: folderName }]);
        }
      } else {
        console.error("API did not return array:", data);
        setItems([]);
      }
    } catch (err) {
      console.error(err);
      setItems([]);
    }
  };

  useEffect(() => {
    loadItems(); // root load
  }, []);

  // Breadcrumb back
  const goBack = (index) => {
    const newPath = path.slice(0, index + 1);
    setPath(newPath);

    const folder = newPath[newPath.length - 1];
    loadItems(folder?.id);
  };

  // ✅ CORRECT document view
  const openFile = (fileId) => {
    window.open(
      `${API_BASE}/api/view-file/documents/${fileId}`,
      "_blank"
    );
  };

  return (
    <div style={{ padding: 20 }}>
      <h2>📁 Documents</h2>

      {/* Breadcrumb */}
      <div style={{ marginBottom: 12 }}>
        <button onClick={() => { setPath([]); loadItems(); }}>
          Root
        </button>

        {path.map((p, i) => (
          <span key={p.id}>
            {" > "}
            <button onClick={() => goBack(i)}>
              {p.name}
            </button>
          </span>
        ))}
      </div>

      {/* List */}
      <ul>
        {Array.isArray(items) && items.map(item => (
          <li key={item.id} style={{ margin: "8px 0" }}>
            {item.type === "folder" ? (
              <button onClick={() => loadItems(item.id, item.name)}>
                📁 {item.name}
              </button>
            ) : (
              <>
                📄 {item.name}{" "}
                <button onClick={() => openFile(item.id)}>
                  View
                </button>
              </>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
}

export default Documents;
