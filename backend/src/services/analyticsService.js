
const analyticsRepository = require(
  "../repositories/analyticsRepository"
);

async function getAdvancedAnalytics() {
  const [
    deliveryPerformance,
    mostDelayedDestination,
    topDelayReasons,
    atRiskShipments
  ] = await Promise.all([
    analyticsRepository.getDeliveryPerformance(),
    analyticsRepository.getMostDelayedDestination(),
    analyticsRepository.getTopDelayReasons(),
    analyticsRepository.getAtRiskShipments()
  ]);

  return {
    deliveryPerformance,
    mostDelayedDestination,
    topDelayReasons,
    atRiskShipments
  };
}

module.exports = {
  getAdvancedAnalytics
};
