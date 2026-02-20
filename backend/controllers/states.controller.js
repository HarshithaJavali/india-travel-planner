const db = require("../config/db");

const getAllStates = async (req, res) => {
  try {
    const [rows] = await db.query(
      "SELECT * FROM states ORDER BY state_name"
    );
    res.json(rows);
  } catch (error) {
    console.error("Error fetching states:", error);
    res.status(500).json({ error: "Database error" });
  }
};

module.exports = {
  getAllStates,
};
