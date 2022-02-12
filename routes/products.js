const express = require("express");
const router = express.Router();

module.exports = (db) => {
  router.get("/", (req, res) => {
    res.render("products");
  });

  router.get("/:id", (req, res) => {
    res.render("products_show");
  });

  return router;
};
