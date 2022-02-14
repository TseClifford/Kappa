const express = require("express");
const router = express.Router();
const { getProducts } = require("../helpers");

module.exports = (db) => {
  router.get("/", async (req, res) => {
    const products = await getProducts(db);
    console.log(products);
    const templateVars = { products };
    res.render("products_index", templateVars);
  });

  router.get("/new", (req, res) => {
    res.render("products_new");
  });

  router.get("/:id", (req, res) => {
    res.render("products_unique");
  });

  return router;
};
