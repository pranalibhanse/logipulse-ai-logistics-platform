const express = require("express");
const { askAssistant } = require(
  "../controllers/aiController"
);

const router = express.Router();

router.post("/ask", askAssistant);

module.exports = router;