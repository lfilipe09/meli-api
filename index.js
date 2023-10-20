const serverless = require("serverless-http");
const express = require("express");
const axios = require("axios");

const app = express();
const meliBaseURL = "https://api.mercadolibre.com/sites/MLB";

app.get("/", (req, res, next) => {
  return res.status(200).json({
    message: "Hello from root!",
  });
});

app.get("/api/items", async (req, res, next) => {
  try {
    const query = req.query.search;
    if (!query) {
      return res.status(400).json({ error: "Search query is required" });
    }

    const encodedQuery = encodeURIComponent(query); // Encode query to handle special characters
    const searchURL = `${meliBaseURL}/search?q=${encodedQuery}`;
    
    const response = await axios.get(searchURL);
    return res.status(200).json(response.data);
  } catch (error) {
    return res.status(500).json({ error: "Internal Server Error" });
  }
});

app.get("/api/items/:id", async (req, res, next) => {
  try {
    const itemId = req.params.id;
    const itemURL = `${meliBaseURL}/items?ids=${itemId}`;
    
    const response = await axios.get(itemURL);
    return res.status(200).json(response.data);
  } catch (error) {
    return res.status(500).json({ error: "Internal Server Error" });
  }
});

app.use((req, res, next) => {
  return res.status(404).json({ error: "Not Found" });
});

module.exports.handler = serverless(app);