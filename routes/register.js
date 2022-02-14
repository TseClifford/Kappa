const express = require("express");
const router = express.Router();
const cookieSession = require("cookie-session");
const app = express();

app.use(cookieSession({
  name: 'session',
  keys: ["mySuperSecretKey"],
  maxAge: 24 * 60 * 60 * 1000 // 24 hours
}));

module.exports = (db) => {
  router
    .get("/", (req, res) => {
      res.render("register");
    })

    .post("/", (req, res) => {
      db.query(`SELECT * FROM users WHERE email = '${req.body.email}';`)
        // .then((data) => {
        //   if (data.length > 0) {
        //     throw new Error('This email is already in use.')
        //   }
        // })
        .then(() => {
          db.query(`INSERT INTO users (name, email, password) VALUES ('${req.body.name}', '${req.body.email}', '${req.body.password}');`)
          req.session["email"] = req.body.email
          res.redirect('/')
        })
      .catch((err) => {
        res.status(500).json({ error: err.message });
      });
    })

  return router;
};
