const express = require("express");
const router = express.Router();
const bcrypt = require("bcryptjs");

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

    .post("/", (req, res) => {
      db.query(`SELECT * FROM users WHERE email = $1;`, [
        req.body.email.toLowerCase(),
      ])
        .then((data) => {
          const userObj = data.rows[0];

          if (
            !userObj ||
            !bcrypt.compareSync(req.body.password, userObj.password)
          ) {
            res.status(403).send(`Invalid credentials.`);
            return;
          }
          delete userObj.password;
          req.session["user_id"] = userObj;
          res.redirect("/");
        })

        .catch((err) => {
          res.status(500).json({ error: err.message });
        });
    });

  return router;
};
