const express = require("express");
const router = express.Router();

const { getCitiesByState } = require("../controllers/cities.controller");

router.get("/:stateId", getCitiesByState);

module.exports = router;
