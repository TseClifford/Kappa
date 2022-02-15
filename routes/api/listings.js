const express = require("express");
const router = express.Router();
const { getProducts } = require("../../helpers");

module.exports = (db) => {
  // Browse
  router.get("/", async (req, res) => {
    const userId = req.session["user_id"];
    let { favouritesOnly, sortBy } = req.query;
    // req.query returns a string, have to convert favouritesOnly back to a boolean
    favouritesOnly = favouritesOnly === "true";
    const products = await getProducts(db, favouritesOnly, sortBy, userId);
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
