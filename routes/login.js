const express = require("express");
const router = express.Router();
const bcrypt = require("bcryptjs");
const { getUserByEmail } = require("../helpers");

module.exports = (db) => {
  router
    .get("/", (req, res) => {
      if (req.session["user_id"]) {
        res.redirect(`/`);
        return;
      }
      res.render("login");
      res.status(200).end();
    })

    .post("/", async(req, res) => {
      const { email, password } = req.body;
      try {
        const user = await getUserByEmail(db, email);
        const userObj = user.rows[0];

        if (!userObj || !bcrypt.compareSync(password, userObj.password)) {
          res.status(403).send("Invalid credentials.");
          return;
        }
        delete userObj.password;
        req.session["user_id"] = userObj;
        res.redirect("/");
      } catch (err) {
        console.log("err", err);
        res.status(500).send("There was a server error, try again later.");
      }
    });

  return router;
};
