const express = require("express");
const router = express.Router();
const { getProducts, getProductById, checkIfFavourite } = require("../helpers");

module.exports = (db) => {
  router.get("/", async(req, res) => {
    try {
      const products = await getProducts(db);
      const templateVars = { products };

      if (req.session["user_id"]) {
        const userObj = req.session["user_id"];
        Object.assign(templateVars, { userObj });
      }
      res.render("products_index", templateVars);
      res.status(200).end();
    } catch (err) {
      res
        .status(500)
        .send("We are experiencing server problems, please try later.");
    }
  });

  router
    .get("/new", (req, res) => {
      if (req.session["user_id"] && req.session["user_id"].admin) {
        const userObj = req.session["user_id"];
        const templateVars = { userObj };
        res.render("products_new", templateVars);
        res.status(200).end();
      }
      res.status(403).send(`You must be an authorized user to access this.`);
    })

    .post("/new", async(req, res) => {
      let isFeatured = false;
      if (req.body.featured) {
        isFeatured = true;
      }
      const { title, img_url, price, description } = req.body;
      try {
        const response = await db.query(
          `INSERT INTO listings (title, owner_id, img_url, price, description, featured) VALUES ($1, $2, $3, $4, $5, $6) RETURNING *;`,
          [
            title,
            req.session["user_id"].id,
            img_url,
            price,
            description,
            isFeatured,
          ]
        );
        if (response) {
          res.redirect("/");
        } else {
          throw "No response!";
        }
      } catch (err) {
        res.status(500).send(err.message);
      }
    });

  router.get("/:id", async(req, res) => {
    const productId = req.params.id;
    let product, userId;
    let isFavourite = false;
    if (req.session["user_id"]) {
      userId = req.session["user_id"].id;
    }
    try {
      product = await getProductById(db, productId);
      if (!product) {
        throw "Product does not exist.";
      }
      if (userId) {
        isFavourite = await checkIfFavourite(db, productId, userId);
      }
      const templateVars = { product, isFavourite };

      if (req.session["user_id"]) {
        const userObj = req.session["user_id"];
        Object.assign(templateVars, { userObj });
      }
      res.render("products_unique", templateVars);
      res.status(200).end();
    } catch (err) {
      console.log(err.message);
      res.redirect("/404");
    }
  });

  return router;
};
