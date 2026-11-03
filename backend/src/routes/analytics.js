const express = require("express");

const {
  getOverview,
  getDelayedByDestination,
  getStatusDistribution,
  getAdvancedAnalytics
} = require("../controllers/analyticsController");

const router = express.Router();

router.get("/overview", getOverview);
router.get("/status-distribution", getStatusDistribution);
router.get("/advanced", getAdvancedAnalytics);

router.get(
  "/delayed-by-destination",
  getDelayedByDestination
);

module.exports = router;