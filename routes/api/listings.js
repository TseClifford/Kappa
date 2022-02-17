const express = require("express");
const router = express.Router();
const { getProducts } = require("../../helpers");

module.exports = (db) => {
  // Browse
  router.get("/", async (req, res) => {
    const user = req.session["user_id"];
    const userId = user ? user.id : undefined;
    let { favouritesOnly, sortBy } = req.query;
    // req.query returns a string, have to convert favouritesOnly back to a boolean
    favouritesOnly = favouritesOnly === "true";
    try {
      const products = await getProducts(db, favouritesOnly, sortBy, userId);
      if (products) {
        res.status(200).send({ products });
      }
    } catch (err) {
      console.log("Error: ", err.message);
      res.status(500).send(err);
    }
  });

  // Read
  router.get("/:id", (req, res) => {
    console.log("To be implemented");
  });

  // Edit
  router.post("/:id", async (req, res) => {
    const user = req.session["user_id"];
    const userId = user ? user.id : undefined;
    const queryParams = [req.params.id];
    let query = "";
    console.log(req.body);
    if (req.body.action === "sold") {
      query = "UPDATE listings SET sold = true WHERE id = $1";
    }
    if (req.body.action === "favourite" && userId) {
      queryParams.unshift(userId);
      query = "INSERT INTO favourites (user_id, listing_id) VALUES ($1, $2)";
    }
    if (req.body.action === "delete" && user.admin) {
      query = "DELETE FROM listings WHERE id = $1";
    }
    if (query) {
      try {
        const response = await db.query(query, queryParams);
        if (response) {
          res.status(200).send("success");
        }
      } catch (err) {
        res.status(500).json({ error: err.message });
      }
    }
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
