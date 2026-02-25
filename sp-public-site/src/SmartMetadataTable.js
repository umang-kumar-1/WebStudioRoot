import React, { useEffect, useState } from "react";
import { API_BASE } from "./api";

function SmartMetadataTable() {
  const [items, setItems] = useState([]);

  useEffect(() => {
    fetch(`${API_BASE}/api/smart-metadata`)
      .then(res => res.json())
      .then(data => {
        if (Array.isArray(data)) {
          setItems(data);
        }
      })
      .catch(console.error);
  }, []);

  if (!items.length) {
    return <p>Loading list items...</p>;
  }

  // Dynamic columns (SharePoint jaise)
  const columns = Object.keys(items[0]).filter(
    key => key !== "id"
  );

  return (
    <div style={{ padding: 20 }}>
      <h2>📋 SmartMetadata List</h2>

      <table border="1" cellPadding="8" cellSpacing="0">
        <thead>
          <tr>
            {columns.map(col => (
              <th key={col}>{col}</th>
            ))}
          </tr>
        </thead>

        <tbody>
          {items.map(row => (
            <tr key={row.id}>
              {columns.map(col => (
                <td key={col}>
                  {String(row[col] ?? "")}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default SmartMetadataTable;
