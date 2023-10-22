# Meli API

A simple yet powerful service that connects to MercadoLibre to retrieve product information. This API is built with Node.js and Express and is hosted on AWS Lambda through Serverless Framework.

## Table of Contents

- [Introduction](#introduction)
- [Endpoints](#endpoints)
  - [GET /api/items](#get-apiitems)
  - [GET /api/items/:id](#get-apiitemsid)
- [Local Development](#local-development)
- [Deployment](#deployment)

## Introduction

**Meli API** allows you to access product data from MercadoLibre in a simple and straightforward way. It offers two main endpoints for retrieving product information:

- `/api/items`: Search for products by a query or category.
- `/api/items/:id`: Get detailed information about a specific product by its ID.

## Endpoints

### GET /api/items

Search for products by query or category.

#### Request

- Query Parameters:
  - `search` (string, optional): The search query for products.
  - `category` (string, optional): The category to filter products.

#### Response

- 200 OK: Returns a list of products based on the search query or category.
- 400 Bad Request: If no query or category is provided.
- 500 Internal Server Error: If there is an issue with the server.

### GET /api/items/:id

Get detailed information about a specific product by its ID.

#### Request

- Path Parameters:
  - `id` (string): The ID of the product to retrieve.

#### Response

- 200 OK: Returns detailed information about the specified product.
- 500 Internal Server Error: If there is an issue with the server.

## Local Development

To run the server locally, you can use the Serverless Offline plugin. Follow these steps:

1. Clone the repository.
2. Install dependencies with `npm install`.
3. Run the server locally with `npx serverless offline`.

The API will be available at `http://localhost:3000`.

## Deployment

The API is deployed on AWS Lambda and can be accessed at the following URL:
```bash
https://6fijj60uc7.execute-api.us-east-1.amazonaws.com
```
