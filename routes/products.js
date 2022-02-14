const express = require("express");
const router = express.Router();
const { getProducts, getProductById } = require("../helpers");

module.exports = (db) => {
  router.get("/", async (req, res) => {
    const products = await getProducts(db);
    const templateVars = { products };
    res.render("products_index", templateVars);
  });

  router.get("/new", (req, res) => {
    res.render("products_new");
  });

  router.get("/:id", async (req, res) => {
    const productId = req.params.id;
    const product = await getProductById(db, productId);
    const templateVars = { product };
    res.render("products_unique", templateVars);
  });

  return router;
};
