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
    // join users and favourites tables
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
    });
};

// Returns an individual product from the db
// @param {db} database to query
// @param {productId} product ID
const getProductById = (db, productId) => {
  let query = "SELECT * FROM listings WHERE id=$1";
  return db
    .query(query, [productId])
    .then((data) => {
      return data.rows[0];
    })
    .catch((err) => {
      res.status(500).json({ error: err.message });
    });
};

module.exports = {
  getProducts,
  getProductById,
};
