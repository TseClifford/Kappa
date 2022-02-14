const getProducts = (db) => {
  let query = `SELECT * FROM listings`;
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

const getProductById = (db, productId) => {
  let query = `SELECT * FROM listings WHERE id = $1;`;
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
