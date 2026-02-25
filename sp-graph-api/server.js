require("dotenv").config();
const express = require("express");
const cors = require("cors");
const axios = require("axios");
const { getToken } = require("./graph");

const app = express();
app.use(cors());

/**
 * Health check
 */
app.get("/api/health", (req, res) => {
  res.json({ status: "Node API running" });
});

/**
 * LIST Documents (default Documents library)
 * /api/list
 * /api/list?folderId=...
 */
app.get("/api/list", async (req, res) => {
  try {
    const token = await getToken();
    const folderId = req.query.folderId;
    const driveId = process.env.DOCUMENTS_DRIVE_ID;

    const url = folderId
      ? `https://graph.microsoft.com/v1.0/drives/${driveId}/items/${folderId}/children`
      : `https://graph.microsoft.com/v1.0/drives/${driveId}/root/children`;

    const response = await axios.get(url, {
      headers: { Authorization: `Bearer ${token}` }
    });

    const items = response.data.value.map(i => ({
      id: i.id,
      name: i.name,
      type: i.folder ? "folder" : "file",
      mimeType: i.file?.mimeType || null
    }));

    res.json(items);
  } catch (err) {
    console.error(err.response?.data || err.message);
    res.status(500).json({ error: "Unable to list documents" });
  }
});

/**
 * LIST PublishingImages (folders + images)
 * /api/publishing-images
 * /api/publishing-images?folderId=...
 */
app.get("/api/publishing-images", async (req, res) => {
  try {
    const token = await getToken();
    const folderId = req.query.folderId;
    const driveId = process.env.PUBLISHING_IMAGES_DRIVE_ID;

    const url = folderId
      ? `https://graph.microsoft.com/v1.0/drives/${driveId}/items/${folderId}/children`
      : `https://graph.microsoft.com/v1.0/drives/${driveId}/root/children`;

    const response = await axios.get(url, {
      headers: { Authorization: `Bearer ${token}` }
    });

    const items = response.data.value.map(i => ({
      id: i.id,
      name: i.name,
      type: i.folder ? "folder" : "image",
      mimeType: i.file?.mimeType || null
    }));

    res.json(items);
  } catch (err) {
    console.error(err.response?.data || err.message);
    res.status(500).json({ error: "Unable to load PublishingImages" });
  }
});

/**
 * UNIVERSAL VIEW FILE (Images + Documents)
 * /api/view-file/:drive/:fileId
 * drive = images | documents
 */
app.get("/api/view-file/:drive/:fileId", async (req, res) => {
  try {
    const token = await getToken();
    const { drive, fileId } = req.params;

    const driveMap = {
      images: process.env.PUBLISHING_IMAGES_DRIVE_ID,
      documents: process.env.DOCUMENTS_DRIVE_ID
    };

    const driveId = driveMap[drive];
    if (!driveId) {
      return res.status(400).json({ error: "Invalid drive type" });
    }

    const url = `https://graph.microsoft.com/v1.0/drives/${driveId}/items/${fileId}/content`;

    const response = await axios.get(url, {
      responseType: "stream",
      decompress: false,
      headers: {
        Authorization: `Bearer ${token}`,
        "Accept-Encoding": "identity"
      }
    });

    // Forward important headers
    res.setHeader(
      "Content-Type",
      response.headers["content-type"] || "application/octet-stream"
    );

    if (response.headers["content-length"]) {
      res.setHeader("Content-Length", response.headers["content-length"]);
    }

    res.setHeader("Content-Disposition", "inline");
    res.setHeader("Cache-Control", "public, max-age=3600");

    response.data.pipe(res);
  } catch (err) {
    console.error(
      "VIEW FILE ERROR:",
      err.response?.data || err.message
    );
    res.status(500).json({ error: "Unable to view file" });
  }
});

app.get("/api/smart-metadata", async (req, res) => {
  try {
    const token = await getToken();

    const url = `https://graph.microsoft.com/v1.0/sites/${process.env.SITE_ID}/lists/${process.env.SMART_METADATA_LIST_ID}/items?$expand=fields($select=*)`;
    console.log("FINAL GRAPH URL:", url);

    const response = await axios.get(url, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    });
    const items = response.data.value.map(item => ({
      id: item.id,
      ...item.fields
    }));

    res.json(items);
  } catch (err) {
    console.error("SMART METADATA ERROR:", err.response?.data || err.message);
    res.status(500).json({ error: "Unable to load list items" });
  }
});
app.get("/api/containers", async (req, res) => {
  try {
    const token = await getToken();

    const url = `https://graph.microsoft.com/v1.0/sites/${process.env.SITE_ID}/lists/${process.env.CONTAINERS_LIST_ID}/items?$expand=fields($select=*)`;
    console.log("FINAL GRAPH URL:", url);

    const response = await axios.get(url, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    });
    const items = response.data.value.map(item => ({
      id: item.id,
      ...item.fields
    }));

    res.json(items);
  } catch (err) {
    console.error("SMART METADATA ERROR:", err.response?.data || err.message);
    res.status(500).json({ error: "Unable to load list items" });
  }
});
app.get("/api/events", async (req, res) => {
  try {
    const token = await getToken();

    const url = `https://graph.microsoft.com/v1.0/sites/${process.env.SITE_ID}/lists/${process.env.EVENTS_LIST_ID}/items?$expand=fields($select=*)`;
    console.log("FINAL GRAPH URL:", url);

    const response = await axios.get(url, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    });
    const items = response.data.value.map(item => ({
      id: item.id,
      ...item.fields
    }));

    res.json(items);
  } catch (err) {
    console.error("SMART METADATA ERROR:", err.response?.data || err.message);
    res.status(500).json({ error: "Unable to load list items" });
  }
});
app.get("/api/news", async (req, res) => {
  try {
    const token = await getToken();

    const url = `https://graph.microsoft.com/v1.0/sites/${process.env.SITE_ID}/lists/${process.env.NEWS_LIST_ID}/items?$expand=fields($select=*)`;
    console.log("FINAL GRAPH URL:", url);

    const response = await axios.get(url, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    });
    const items = response.data.value.map(item => ({
      id: item.id,
      ...item.fields
    }));

    res.json(items);
  } catch (err) {
    console.error("SMART METADATA ERROR:", err.response?.data || err.message);
    res.status(500).json({ error: "Unable to load list items" });
  }
});
app.get("/api/containerItems", async (req, res) => {
  try {
    const token = await getToken();

    const url = `https://graph.microsoft.com/v1.0/sites/${process.env.SITE_ID}/lists/${process.env.CONTAINER_ITEMS_LIST_ID}/items?$expand=fields($select=*)`;
    console.log("FINAL GRAPH URL:", url);

    const response = await axios.get(url, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    });
    const items = response.data.value.map(item => ({
      id: item.id,
      ...item.fields
    }));

    res.json(items);
  } catch (err) {
    console.error("SMART METADATA ERROR:", err.response?.data || err.message);
    res.status(500).json({ error: "Unable to load list items" });
  }
});
app.get("/api/globalSettings", async (req, res) => {
  try {
    const token = await getToken();

    const url = `https://graph.microsoft.com/v1.0/sites/${process.env.SITE_ID}/lists/${process.env.GLOBAL_SETTINGS_LIST_ID}/items?$expand=fields($select=*)`;
    console.log("FINAL GRAPH URL:", url);

    const response = await axios.get(url, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    });
    const items = response.data.value.map(item => ({
      id: item.id,
      ...item.fields
    }));

    res.json(items);
  } catch (err) {
    console.error("SMART METADATA ERROR:", err.response?.data || err.message);
    res.status(500).json({ error: "Unable to load list items" });
  }
});
app.get("/api/contacts", async (req, res) => {
  try {
    const token = await getToken();

    const url = `https://graph.microsoft.com/v1.0/sites/${process.env.SITE_ID}/lists/${process.env.CONTACTS_LIST_ID}/items?$expand=fields($select=*)`;
    console.log("FINAL GRAPH URL:", url);

    const response = await axios.get(url, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    });
    const items = response.data.value.map(item => ({
      id: item.id,
      ...item.fields
    }));

    res.json(items);
  } catch (err) {
    console.error("SMART METADATA ERROR:", err.response?.data || err.message);
    res.status(500).json({ error: "Unable to load list items" });
  }
});

app.get("/api/smartPages", async (req, res) => {
  try {
    const token = await getToken();

    const url = `https://graph.microsoft.com/v1.0/sites/${process.env.SITE_ID}/lists/${process.env.SMART_PAGES_LIST_ID}/items?$expand=fields($select=*)`;
    console.log("FINAL GRAPH URL:", url);

    const response = await axios.get(url, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    });
    const items = response.data.value.map(item => ({
      id: item.id,
      ...item.fields
    }));

    res.json(items);
  } catch (err) {
    console.error("SMART METADATA ERROR:", err.response?.data || err.message);
    res.status(500).json({ error: "Unable to load list items" });
  }
});
app.get("/api/contactQueries", async (req, res) => {
  try {
    const token = await getToken();

    const url = `https://graph.microsoft.com/v1.0/sites/${process.env.SITE_ID}/lists/${process.env.CONTACT_QUERIES_LIST_ID}/items?$expand=fields($select=*)`;
    console.log("FINAL GRAPH URL:", url);

    const response = await axios.get(url, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    });
    const items = response.data.value.map(item => ({
      id: item.id,
      ...item.fields
    }));

    res.json(items);
  } catch (err) {
    console.error("SMART METADATA ERROR:", err.response?.data || err.message);
    res.status(500).json({ error: "Unable to load list items" });
  }
});
app.get("/api/imageSlider", async (req, res) => {
  try {
    const token = await getToken();

    const url = `https://graph.microsoft.com/v1.0/sites/${process.env.SITE_ID}/lists/${process.env.IMAGE_SLIDER_LIST_ID}/items?$expand=fields($select=*)`;
    console.log("FINAL GRAPH URL:", url);

    const response = await axios.get(url, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    });
    const items = response.data.value.map(item => ({
      id: item.id,
      ...item.fields
    }));

    res.json(items);
  } catch (err) {
    console.error("SMART METADATA ERROR:", err.response?.data || err.message);
    res.status(500).json({ error: "Unable to load list items" });
  }
});
app.get("/api/topNavigation", async (req, res) => {
  try {
    const token = await getToken();

    const url = `https://graph.microsoft.com/v1.0/sites/${process.env.SITE_ID}/lists/${process.env.TOP_NAVIGATION_LIST_ID}/items?$expand=fields($select=*)`;
    console.log("FINAL GRAPH URL:", url);

    const response = await axios.get(url, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    });
    const items = response.data.value.map(item => ({
      id: item.id,
      ...item.fields
    }));

    res.json(items);
  } catch (err) {
    console.error("SMART METADATA ERROR:", err.response?.data || err.message);
    res.status(500).json({ error: "Unable to load list items" });
  }
});
app.get("/api/translationDictionary", async (req, res) => {
  try {
    const token = await getToken();

    const url = `https://graph.microsoft.com/v1.0/sites/${process.env.SITE_ID}/lists/${process.env.TRANSLATION_DICTIONARY_LIST_ID}/items?$expand=fields($select=*)`;
    console.log("FINAL GRAPH URL:", url);

    const response = await axios.get(url, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    });
    const items = response.data.value.map(item => ({
      id: item.id,
      ...item.fields
    }));

    res.json(items);
  } catch (err) {
    console.error("SMART METADATA ERROR:", err.response?.data || err.message);
    res.status(500).json({ error: "Unable to load list items" });
  }
});





app.listen(3001, () => {
  console.log("API running → http://localhost:3001");
});
