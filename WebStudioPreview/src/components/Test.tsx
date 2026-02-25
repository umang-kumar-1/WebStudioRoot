import React, { useEffect, useState } from "react";
import { api } from "../services/api";

const SmartMetadataTable: React.FC = () => {
    const [items, setItems] = useState<any[]>();
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const loadData = async () => {
            try {
                const res: any = await api.get<any>("/api/smart-metadata");
                const containerData: any = await api.get<any>("/api/containers");
                const newData: any = await api.get<any>("/api/news");
                console.log("News data :", newData)
                setItems(res);
                console.log(containerData)
                console.log(res);
            } catch (error) {
                console.error(error);
            } finally {
                setLoading(false);
            }
        };

        loadData();
    }, []);

    if (loading) return <p>Loading...</p>;
    if (!items?.length) return <p>No data available</p>;

    // 🔥 Get ALL columns from all rows
    const columns = getAllColumns(items);

    return (
        <div>
            <h2>Smart Metadata List</h2>

            <table border={1} cellPadding={8}>
                <thead>
                    <tr>
                        {columns.map((col) => (
                            <th key={col}>{col}</th>
                        ))}
                    </tr>
                </thead>

                <tbody>
                    {items.map((row, rowIndex) => (
                        <tr key={rowIndex}>
                            {columns.map((col) => (
                                <td key={col}>
                                    {row[col] !== null && row[col] !== undefined
                                        ? String(row[col])
                                        : ""}
                                </td>
                            ))}
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

export default SmartMetadataTable;

// 🔹 Helper function
const getAllColumns = <T extends Record<string, unknown>>(data: T[]) => {
    const columnSet = new Set<string>();

    data.forEach((item) => {
        Object.keys(item).forEach((key) => {
            columnSet.add(key);
        });
    });

    return Array.from(columnSet);
};