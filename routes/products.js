const express = require("express");
const router = express.Router();
const { getProducts, getProductById } = require("../helpers");

module.exports = (db) => {
  router.get("/", async (req, res) => {
    const products = await getProducts(db);
    const templateVars = { products };

    if (req.session["user_id"]) {
      const userObj = req.session["user_id"];
      Object.assign(templateVars, { user_id: userObj });
    }
    res.render("products_index", templateVars);
  });

  router.get("/new", (req, res) => {
    if (req.session["user_id"] && req.session["user_id"].admin) {
      const templateVars = {
        user_id: req.session["user_id"],
      };
      res.render("products_new", templateVars);
      return;
    }
    res.send(`You must be an authorized user to access this.`);
  });

  router.get("/:id", async (req, res) => {
    const productId = req.params.id;
    const product = await getProductById(db, productId);

    const templateVars = { product };

    if (req.session["user_id"]) {
      const userObj = req.session["user_id"];
      Object.assign(templateVars, { user_id: userObj });
    }
    console.log(templateVars);
    res.render("products_unique", templateVars);
  });

  return router;
};
