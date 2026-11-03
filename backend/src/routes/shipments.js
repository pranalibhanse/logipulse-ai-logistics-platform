const express = require("express");
const {
  getShipments,
} = require("../controllers/shipmentsController");

const router = express.Router();

router.get("/", getShipments);

module.exports = router;