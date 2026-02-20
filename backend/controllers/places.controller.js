const db = require("../config/db");

const getPlacesByCity = async (req, res) => {
  const { cityId } = req.params;

  try {
    const [rows] = await db.query(
      "SELECT place_id, place_name, description FROM tourist_places WHERE city_id = ?",
      [cityId]
    );
    res.json(rows);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch places" });
  }
};

module.exports = { getPlacesByCity };
