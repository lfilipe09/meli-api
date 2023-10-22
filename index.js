const serverless = require("serverless-http");
const express = require("express");
const axios = require("axios");
const { productMapper, itemsMapper } = require("./utils");

const app = express();
const meliBaseURL = "https://api.mercadolibre.com";

app.get("/api/items", async (req, res, next) => {
  try {
    const query = req.query.search;
    const category = req.query.category;

    if (!query && !category) {
      return res.status(400).json({ error: "Search query or category is required" });
    }

    const encodedQuery = query ? encodeURIComponent(query) : '';
    const encodedCategory = category ? encodeURIComponent(category) : '';

    let searchURL;

    if (query) {
      searchURL = `${meliBaseURL}/sites/MLB/search?q=${encodedQuery}`;
    } else {
      searchURL = `${meliBaseURL}/sites/MLB/search?category=${encodedCategory}`;
    }

    const categories = []
    
    const response = await axios.get(searchURL);

    response.data.filters
      .find(filter => filter.id === "category")?.values
      ?.map((value) => value.path_from_root
        .map(path => {
          categories.push({name:path.name, id:path.id})
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

    const categories = categoryResponse.data?.path_from_root?.map(path => ({name:path.name, id:path.id})) || []

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