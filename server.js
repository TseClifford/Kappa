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
app.use(express.urlencoded({ extended: true }));

app.use(
  "/styles",
  sassMiddleware({
    source: __dirname + "/styles",
    destination: __dirname + "/public/styles",
    isSass: false, // false => scss, true => sass
  })
);

app.use(express.static("public"));

app.use(cookieSession({
  name: 'session',
  keys: ["mySuperSecretKey"],
  maxAge: 24 * 60 * 60 * 1000 // 24 hours
}));

// Separated Routes for each Resource
// Note: Feel free to replace the example routes below with your own
const usersRoutes = require("./routes/api/users");
const listingsRoutes = require("./routes/api/listings");
const productsRoutes = require("./routes/products");
const registerRoutes = require("./routes/register");
const loginRoutes = require("./routes/login");

// Mount all resource routes
// Note: Feel free to replace the example routes below with your own
app.use("/api/users", usersRoutes(db));
app.use("/api/listings", listingsRoutes(db));
app.use("/products", productsRoutes(db));
app.use("/register", registerRoutes(db));
app.use("/login", loginRoutes(db));

// Redirects to the products page
app.get("/", (req, res) => {
  res.redirect("/products");
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
