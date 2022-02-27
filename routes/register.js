const express = require("express");
const router = express.Router();
const { insertUser, getUserByEmail } = require("../helpers");

module.exports = (db) => {
  router
    .get("/", (req, res) => {
      if (req.session["user_id"]) {
        res.redirect(`/`);
      }
      res.render("register");
      res.status(200).end();
    })

    .post("/", async(req, res) => {
      const { name, email, password } = req.body;
      try {
        const user = await getUserByEmail(db, email);
        if (user.rows.length > 0) {
          res.send("This email has already been used.");
          return;
        }
        const userSessionData = await insertUser(db, name, email, password);
        if (userSessionData) {
          req.session["user_id"] = userSessionData.rows[0];
        }
        res.redirect("/");
      } catch (err) {
        console.log("err", err);
        res.status(500).send("There was a server error, try again later.");
      }
    });

  return router;
};
