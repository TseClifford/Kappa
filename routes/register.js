const express = require("express");
const router = express.Router();
const bcrypt = require('bcryptjs');
const salt = bcrypt.genSaltSync(10);

module.exports = (db) => {
  router
    .get("/", (req, res) => {
      res.render("register");
    })

    .post("/", (req, res) => {
      db.query(`SELECT * FROM users WHERE email = '${req.body.email}';`)
        .then((data) => {
          if (data.rows.length > 0) {
            res.send('This email has already been used.');
          } else {
            db.query(`INSERT INTO users (name, email, password) VALUES ('${req.body.name}', '${req.body.email}', '${bcrypt.hashSync(req.body.password, salt)}');`);
            req.session["email"] = req.body.email;
            res.redirect('/');
          }
        })

        .catch((err) => {
          res.status(500).json({ error: err.message });
        });
    });

  return router;
};
