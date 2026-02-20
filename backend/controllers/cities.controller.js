const db = require("../config/db");

const getCitiesByState = async (req, res) => {
  const { stateId } = req.params;

  try {
    const [rows] = await db.query(
      "SELECT * FROM cities WHERE state_id = ?",
      [stateId]
    );
    res.json(rows);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Database error" });
  }
};

module.exports = { getCitiesByState };
