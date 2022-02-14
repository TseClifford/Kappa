const express = require("express");
const router = express.Router();
const { getProducts } = require("../../helpers");

module.exports = (db) => {
  // Browse
  router.get("/", async (req, res) => {
    const { favouritesOnly, sortBy } = req.query;
    const products = await getProducts(db, favouritesOnly, sortBy);
    if (products) {
      res.send({ products });
    } else {
      res.status(500).send("Database query failed");
    }
  });

  // Read
  router.get("/:id", (req, res) => {
    console.log("To be implemented");
  });

  // Edit
  router.post("/:id", (req, res) => {
    console.log("To be implemented");
  });

  // Add
  router.post("/", (req, res) => {
    console.log("To be implemented");
  });

  // Delete
  router.post("/:id/delete", (req, res) => {
    console.log("To be implemented");
  });

  return router;
};
