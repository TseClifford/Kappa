const bcrypt = require("bcryptjs");
const salt = bcrypt.genSaltSync(10);

// Returns a product list from the db
// @param {db} database to query
// @param {isFavourite} boolean to determine if to return only user's favourites
// @param {sortBy} sorts the products by one of the options: "recent", "priceLow", "priceHigh"
const getProducts = (
  db,
  favouritesOnly = false,
  sortBy = "recent",
  userId = undefined
) => {
  const queryParams = [];
  let query = `SELECT listings.* FROM listings `;

  if (favouritesOnly && userId) {
    queryParams.push(userId);
    // Join users and favourites tables
    query +=
      "JOIN favourites ON listing_id = listings.id JOIN users ON users.id = user_id ";
    query += `WHERE favourites.user_id = $${queryParams.length} `;
  }

  switch (sortBy) {
    case "recent":
      query += "ORDER BY listings.id DESC;";
      break;
    case "priceLow":
      query += "ORDER BY price;";
      break;
    case "priceHigh":
      query += "ORDER BY price DESC;";
  }

  console.log(query);
  return db
    .query(query, queryParams)
    .then((data) => {
      const listings = data.rows;
      return listings;
    })
    .catch((err) => {
      console.log(err.message);
      return err;
    });
};

// Returns an individual product from the db
// @param {db} database to query
// @param {productId} product ID
const getProductById = (db, productId) => {
  let query = "SELECT * FROM listings WHERE listings.id = $1;";
  return db
    .query(query, [productId])
    .then((data) => {
      return data.rows[0];
    })
    .catch((err) => {
      console.log(err.message);
      return err;
    });
};

// Checks if a listing is in the favourites table, returns boolean
// @param {db} database to query
// @param {productId} product ID
// @param {userId} user ID
const checkIfFavourite = (db, productId, userId) => {
  let query =
    "SELECT listing_id FROM favourites WHERE listing_id = $1 AND user_id = $2;";
  return db
    .query(query, [productId, userId])
    .then((data) => {
      return data.rows[0] ? true : false;
    })
    .catch((err) => {
      console.log(err.message);
      return err;
    });
};

const insertUser = (db, name, email, password) => {
  let query =
    "INSERT INTO users (name, email, password) VALUES ($1, $2, $3) RETURNING id, name, email, admin;";

  return db
    .query(query, [name, email.toLowerCase(), bcrypt.hashSync(password, salt)])
    .then((data) => {
      return data;
    })
    .catch((err) => {
      console.log(err.message);
      return err;
    });
};

const getUserByEmail = (db, email) => {
  let query = "SELECT * FROM users WHERE email = $1;";

  return db
    .query(query, [email.toLowerCase()])
    .then((data) => data)
    .catch((err) => {
      console.log(err.message);
    });
};

module.exports = {
  getProducts,
  getProductById,
  checkIfFavourite,
  insertUser,
  getUserByEmail,
};
