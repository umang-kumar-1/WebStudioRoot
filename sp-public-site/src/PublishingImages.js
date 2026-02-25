import React, { useEffect, useState } from "react";
import { API_BASE } from "./api";

function PublishingImages() {
    const [items, setItems] = useState([]);
    const [path, setPath] = useState([]);

    const loadItems = async (folderId = null, folderName = null) => {
        const url = folderId
            ? `${API_BASE}/api/publishing-images?folderId=${folderId}`
            : `${API_BASE}/api/publishing-images`;

        const res = await fetch(url);
        const data = await res.json();
        setItems(data);

        if (folderId && folderName) {
            setPath(prev => [...prev, { id: folderId, name: folderName }]);
        }
    };

    useEffect(() => {
        loadItems();
    }, []);

    const goBack = (index) => {
        const newPath = path.slice(0, index + 1);
        setPath(newPath);

        const folder = newPath[newPath.length - 1];
        loadItems(folder?.id);
    };

    const viewImage = (fileId) => {
        window.open(`${API_BASE}/api/view-file/${fileId}`, "_blank");
    };

    return (
        <div style={{ padding: 20 }}>
            <h2>🖼 Publishing Images</h2>

            {/* Breadcrumb */}
            <div>
                <button onClick={() => { setPath([]); loadItems(); }}>
                    Root
                </button>
                {path.map((p, i) => (
                    <span key={p.id}>
                        {" > "}
                        <button onClick={() => goBack(i)}>{p.name}</button>
                    </span>
                ))}
            </div>

            {/* Grid */}
            <div style={{ display: "flex", flexWrap: "wrap", gap: 20 }}>
                {items.map(item => (
                    <div key={item.id}>
                        {item.type === "folder" ? (
                            <button onClick={() => loadItems(item.id, item.name)}>
                                📁 {item.name}
                            </button>
                        ) : (
                            <>
                                {/* IMAGE AUTO OPEN */}
                                <img
                                   src={`${API_BASE}/api/view-file/images/${item.id}`}
                                    alt={item.name}
                                    style={{
                                        width: 250,
                                        height: 180,
                                        objectFit: "cover",
                                        border: "1px solid #ddd",
                                        cursor: "pointer"
                                    }}
                                    onClick={() =>
                                        window.open(`${API_BASE}/api/view-file/${item.id}`, "_blank")
                                    }
                                />
                                <div style={{ maxWidth: 250, fontSize: 12 }}>
                                    {item.name}
                                </div>
                            </>
                        )}
                    </div>
                ))}
            </div>

        </div>
    );
}

export default PublishingImages;
