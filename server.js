// load .env data into process.env
require("dotenv").config();

// Web server config
const PORT = process.env.PORT || 8080;
const sassMiddleware = require("./lib/sass-middleware");
const express = require("express");
const app = express();
const morgan = require("morgan");
const cookieSession = require("cookie-session");

// PG database client/connection setup
const { Pool } = require("pg");
const dbParams = require("./lib/db.js");
const db = new Pool(dbParams);
db.connect();

// Load the logger first so all (static) HTTP requests are logged to STDOUT
// 'dev' = Concise output colored by response status for development use.
//         The :status token will be colored red for server error codes, yellow for client error codes, cyan for redirection codes, and uncolored for all other codes.
app.use(morgan("dev"));

app.set("view engine", "ejs");
app.use(express.urlencoded({ extended: false }));

app.use(
  "/styles",
  sassMiddleware({
    source: __dirname + "/styles",
    destination: __dirname + "/public/styles",
    isSass: false, // false => scss, true => sass
  })
);

app.use(express.static("public"));

app.use(
  cookieSession({
    name: "session",
    keys: [process.env.SESSIONKEY],
    maxAge: 24 * 60 * 60 * 1000, // 24 hours
  })
);

// Separated Routes for each Resource
const listingsRoutes = require("./routes/api/listings");
const productsRoutes = require("./routes/products");
const registerRoutes = require("./routes/register");
const loginRoutes = require("./routes/login");
const messageRoutes = require("./routes/message");

// Mount all resource routes
app.use("/api/listings", listingsRoutes(db));
app.use("/products", productsRoutes(db));
app.use("/register", registerRoutes(db));
app.use("/login", loginRoutes(db));
app.use("/message", messageRoutes());

// Redirects to the products page
app.get("/", (req, res) => {
  res.redirect("/products");
});

// Logout clear cookies session
app.post("/logout", (req, res) => {
  req.session = null;
  res.redirect(`/`);
});

// 404 error page
app.get("/404", (req, res) => {
  res.render("404");
});

// Redirects to 404 page
app.get("*", (req, res) => {
  res.redirect("/404");
});

app.listen(PORT, () => {
  console.log(`Example app listening on port ${PORT}`);
});
