const express = require("express");
const router = express.Router();

module.exports = (db) => {
  // Browse
  router.get("/", (req, res) => {
    console.log("To be implemented");
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
