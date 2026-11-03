const shipmentsRepository = require(
  "../repositories/shipmentsRepository"
);

async function getShipments(req, res) {
  try {
    const shipments =
      await shipmentsRepository.findAll();

    res.json({
      count: shipments.length,
      shipments,
    });
  } catch (error) {
    console.error("Failed to fetch shipments:", error);

    res.status(500).json({
      error: "Failed to retrieve shipments",
    });
  }
}

module.exports = { getShipments };