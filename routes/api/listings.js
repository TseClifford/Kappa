const express = require("express");
const router = express.Router();

module.exports = (db) => {
  // Browse
  router.get("/", (req, res) => {
    let query = `SELECT * FROM listings`;
    db.query(query)
      .then((data) => {
        const users = data.rows;
        res.json({ users });
      })
      .catch((err) => {
        res.status(500).json({ error: err.message });
      });
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
