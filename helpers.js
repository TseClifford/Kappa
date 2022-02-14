// Returns a product list from the db
// @param {db} database to query
// @param {isFavourite} boolean to determine if to return only user's favourites
// @param {sortBy} sorts the products by one of the options: "recent", "priceLow", "priceHigh"
const getProducts = (db, isFavourite = false, sortBy = "recent") => {
  let query = `SELECT * FROM listings `;

  if (isFavourite) {
    // in order to implement need to join users and favourites tables
    console.log("favourites yet to be implemented");
  }

  switch (sortBy) {
    case "recent":
      query += "ORDER BY id DESC";
      break;
    case "priceLow":
      query += "ORDER BY price DESC";
      break;
    case "priceHigh":
      query += "ORDER BY price";
  }

  console.log(query);
  return db
    .query(query)
    .then((data) => {
      const listings = data.rows;
      return listings;
    })
    .catch((err) => {
      res.status(500).json({ error: err.message });
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
