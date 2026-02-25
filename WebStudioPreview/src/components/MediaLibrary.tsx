import React, { useEffect, useState } from "react";
import { API_BASE } from "../services/apiTest";

interface MediaItem {
    id: string;
    name: string;
    type: "folder" | "image" | "file";
    mimeType: string | null;
    url?: string;
}

const MediaLibrary: React.FC = () => {
    const [allImages, setAllImages] = useState<MediaItem[]>([]);
    const [allDocuments, setAllDocuments] = useState<MediaItem[]>([]);
    const [loading, setLoading] = useState<boolean>(true);

    // 🔥 Recursive function to get all items from folder
    const fetchAllItems = async (
        endpoint: string,
        driveType: "images" | "documents",
        folderId: string | null = null
    ): Promise<MediaItem[]> => {
        const url = folderId
            ? `${API_BASE}${endpoint}?folderId=${folderId}`
            : `${API_BASE}${endpoint}`;

        const response = await fetch(url);
        const data: MediaItem[] = await response.json();

        let collectedItems: MediaItem[] = [];

        for (const item of data) {
            if (item.type === "folder") {
                // 🔁 Recursive call for folder children
                const childItems = await fetchAllItems(
                    endpoint,
                    driveType,
                    item.id
                );
                collectedItems = [...collectedItems, ...childItems];
            } else {
                collectedItems.push({
                    ...item,
                    url: `${API_BASE}/api/view-file/${driveType}/${item.id}`
                });
            }
        }

        return collectedItems;
    };

    useEffect(() => {
        const loadAllMedia = async () => {
            try {
                setLoading(true);

                // 🔹 Get ALL images recursively
                const images = await fetchAllItems(
                    "/api/publishing-images",
                    "images"
                );

                // 🔹 Get ALL documents recursively
                const documents = await fetchAllItems(
                    "/api/list",
                    "documents"
                );

                setAllImages(images);
                setAllDocuments(documents);

                console.log("All Images:", images);
                console.log("All Documents:", documents);

            } catch (error) {
                console.error("Error loading media:", error);
            } finally {
                setLoading(false);
            }
        };

        loadAllMedia();
    }, []);

    if (loading) return <p>Loading media...</p>;

    return (
        <div style={{ padding: 20 }}>
            <h2>📷 All Images (Root + Folders)</h2>

            <div style={{ display: "flex", gap: 15, flexWrap: "wrap" }}>
                {allImages.map((img) => (
                    <img
                        key={img.id}
                        src={img.url}
                        alt={img.name}
                        width={150}
                        style={{ borderRadius: 6 }}
                    />
                ))}
            </div>

            <h2 style={{ marginTop: 40 }}>📄 All Documents (Root + Folders)</h2>

            <ul>
                {allDocuments.map((doc) => (
                    <li key={doc.id}>
                        <a href={doc.url} target="_blank" rel="noopener noreferrer">
                            {doc.name}
                        </a>
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default MediaLibrary;