const express = require("express");
const router = express.Router();

module.exports = (db) => {
  router.get("/", (req, res) => {
    res.render("products_index");
  });

  router.get("/new", (req, res) => {
    res.render("products_new");
  });

  router.get("/:id", (req, res) => {
    res.render("products_unique");
  });

  return router;
};
