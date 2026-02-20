const express = require("express");
const router = express.Router();

const { getAllStates } = require("../controllers/states.controller");

router.get("/", getAllStates);

module.exports = router;
