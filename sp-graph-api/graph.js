const axios = require("axios");
const NodeCache = require("node-cache");

const cache = new NodeCache({ stdTTL: 3500 }); // ~58 min

async function getToken() {
  const cached = cache.get("token");
  if (cached) return cached;

  const url = `https://login.microsoftonline.com/${process.env.TENANT_ID}/oauth2/v2.0/token`;

  const params = new URLSearchParams({
    client_id: process.env.CLIENT_ID,
    client_secret: process.env.CLIENT_SECRET,
    scope: "https://graph.microsoft.com/.default",
    grant_type: "client_credentials"
  });

  const res = await axios.post(url, params);
  cache.set("token", res.data.access_token);
  return res.data.access_token;
}

module.exports = { getToken };
