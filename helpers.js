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

module.exports = {
  getProducts,
};
