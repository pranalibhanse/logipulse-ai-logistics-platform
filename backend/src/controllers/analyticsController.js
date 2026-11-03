const analyticsRepository = require(
  "../repositories/analyticsRepository"
);

const analyticsService = require(
  "../services/analyticsService"
);

async function getOverview(req, res) {
  try {
    const overview =
      await analyticsRepository.getOverview();

    res.json({ data: overview });
  } catch (error) {
    console.error("Failed to fetch overview:", error);

    res.status(500).json({
      error: "Failed to fetch dashboard overview",
    });
  }
}

async function getDelayedByDestination(req, res) {
  try {
    const destinations =
      await analyticsRepository.getDelayedByDestination();

    res.json({ data: destinations });
  } catch (error) {
    console.error("Failed to fetch destination analytics:", error);

    res.status(500).json({
      error: "Failed to fetch destination analytics",
    });
  }
}

async function getStatusDistribution(req, res) {
  try {
    const data =
      await analyticsRepository.getStatusDistribution();

    res.json({ data });
  } catch (error) {
    console.error("Failed to fetch status distribution:", error);

    res.status(500).json({
      error: "Failed to fetch status distribution",
    });
  }
}

async function getAdvancedAnalytics(req, res) {
  try {
    const analytics =
      await analyticsService.getAdvancedAnalytics();

    res.status(200).json({
      success: true,
      data: analytics
    });
  } catch (error) {
    console.error(
      "Advanced analytics error:",
      error
    );

    res.status(500).json({
      success: false,
      error: "Failed to fetch advanced analytics"
    });
  }
}

module.exports = {
  getOverview,
  getDelayedByDestination,
  getStatusDistribution,
  getAdvancedAnalytics
};