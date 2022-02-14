const express = require("express");
const router = express.Router();
const bcrypt = require('bcryptjs');

module.exports = (db) => {
  router
    .get("/", (req, res) => {
      res.render("login");
    })

    .post("/", (req, res) => {
      db.query(`SELECT * FROM users WHERE email = '${req.body.email}';`)
        .then((data) => {
          const userObj = data.rows[0];

          if (!bcrypt.compareSync(req.body.password, userObj.password)) {
            res.status(403).send(`Invalid credentials.`);
          } else {
            req.session["email"] = userObj.email;
            res.redirect('/');
          }
        })

        .catch((err) => {
          res.status(500).json({ error: err.message });
        });
    });

  return router;
};
