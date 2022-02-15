const express = require("express");
const router = express.Router();
const bcrypt = require('bcryptjs');
const salt = bcrypt.genSaltSync(10);

module.exports = (db) => {
  router
    .get("/", (req, res) => {
      if (req.session["user_id"]) {
        res.redirect(`/`);
        return;
      }
      const templateVars = {
        "user_id": req.session["user_id"],
      };
      res.render("register", templateVars);
    })

    .post("/", (req, res) => {
      db.query(`SELECT * FROM users WHERE email = $1;`, [req.body.email.toLowerCase()])
        .then((data) => {
          if (data.rows.length > 0) {
            res.send('This email has already been used.');
            return;
          }
          db.query(`INSERT INTO users (name, email, password) VALUES ($1, $2, $3) RETURNING id, name, email, admin;`, [req.body.name, req.body.email.toLowerCase(), bcrypt.hashSync(req.body.password, salt)])
            .then((data) => {
              const record = data.rows[0];
              req.session["user_id"] = record;
              res.redirect('/');
            }).catch(error => {
              console.log(error);
            });
        })

        .catch((err) => {
          res.status(500).json({ error: err.message });
        });
    });

  return router;
};
