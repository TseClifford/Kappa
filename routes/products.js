const express = require("express");
const router = express.Router();
const { getProducts, getProductById } = require("../helpers");

module.exports = (db) => {
  router.get("/", async(req, res) => {
    const products = await getProducts(db);

    if (req.session["user_id"]) {
      const templateVars = {
        products,
        "user_id": req.session["user_id"],
      };
      res.render("products_index", templateVars);
    } else {
      const templateVars = { products };
      res.render("products_index", templateVars);
    }
  });

  router.get("/new", (req, res) => {
    if (req.session["user_id"] && req.session["user_id"].admin) {
      const templateVars = {
        "user_id": req.session["user_id"],
      };
      res.render("products_new", templateVars);
    } else {
      res.send(`You must be an authorized user to access this.`);
    }
  });

  router.get("/:id", async(req, res) => {
    const productId = req.params.id;
    const product = await getProductById(db, productId);

    if (req.session["user_id"]) {
      const templateVars = {
        product,
        "user_id": req.session["user_id"],
      };
      res.render("products_unique", templateVars);
    } else {
      const templateVars = { product };
      res.render("products_unique", templateVars);
    }
  });

  return router;
};
