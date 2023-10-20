const serverless = require("serverless-http");
const express = require("express");
const axios = require("axios");
const { productMapper, itemsMapper } = require("./utils");

const app = express();
const meliBaseURL = "https://api.mercadolibre.com";

app.get("/api/items", async (req, res, next) => {
  try {
    const query = req.query.search;
    if (!query) {
      return res.status(400).json({ error: "Search query is required" });
    }

    const encodedQuery = encodeURIComponent(query); 
    const searchURL = `${meliBaseURL}/sites/MLB/search?q=${encodedQuery}`;

    const categories = []
    
    const response = await axios.get(searchURL);

    response.data.filters
      .find(filter => filter.id === "category")?.values
      ?.map((value) => value.path_from_root
        .map(path => {
          categories.push(path.name)
        }))

    const itemsResponse = itemsMapper(response, categories)

    return res.status(200).json(itemsResponse);
  } catch (error) {
    return res.status(500).json({ error: `Internal Server Error` });
  }
});

app.get("/api/items/:id", async (req, res, next) => {
  try {
    const itemId = req.params.id;

    const itemURL = `${meliBaseURL}/items/${itemId}`;    
    const response = await axios.get(itemURL);

    const categoryURL = `${meliBaseURL}/categories/${response.data.category_id}`;
    const categoryResponse = await axios.get(categoryURL);

    const descriptionURL = `${meliBaseURL}/items/${itemId}/description`;    
    const descriptionResponse = await axios.get(descriptionURL);

    const categories = categoryResponse.data?.path_from_root?.map(path => path.name) || []

    const itemResponse = productMapper(categories, response.data, descriptionResponse.data.plain_text)

    return res.status(200).json(itemResponse);
  } catch (error) {
    return res.status(500).json({ error: `Internal Server Error, ${error}` });
  }
});

app.use((req, res, next) => {
  return res.status(404).json({ error: "Not Found" });
});

module.exports.handler = serverless(app);