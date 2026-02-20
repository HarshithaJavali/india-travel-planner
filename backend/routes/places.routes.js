const express = require("express");
const router = express.Router();

const { getPlacesByCity } = require("../controllers/places.controller");

router.get("/:cityId", getPlacesByCity);

module.exports = router;
