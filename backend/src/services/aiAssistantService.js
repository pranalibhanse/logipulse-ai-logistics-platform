const analyticsRepository = require(
  "../repositories/analyticsRepository"
);

const shipmentsRepository = require(
  "../repositories/shipmentsRepository"
);

async function answerQuestion(question) {
  const normalizedQuestion = question
    .trim()
    .toLowerCase();

  if (!normalizedQuestion) {
    throw new Error("Please enter a question.");
  }

  if (
    normalizedQuestion.includes("delay") ||
    normalizedQuestion.includes("overdue")
  ) {
    const destinations =
      await analyticsRepository.getDelayedByDestination();

    const totalOverdue = destinations.reduce(
      (total, item) =>
        total + Number(item.delayed_shipments),
      0
    );

    const topDestination = destinations[0];

    if (totalOverdue === 0) {
      return {
        answer: "There are currently no overdue, undelivered shipments in the database.",
        source: "PostgreSQL analytics",
      };
    }

    return {
      answer: `There are ${totalOverdue} overdue, undelivered shipments across ${destinations.length} destinations. ${
        topDestination
          ? `${topDestination.destination} has the highest count in the returned results, with ${topDestination.delayed_shipments} shipments.`
          : ""
      }`,
      source: "PostgreSQL analytics",
      data: destinations,
    };
  }

  if (
    normalizedQuestion.includes("how many shipments") ||
    normalizedQuestion.includes("total shipments") ||
    normalizedQuestion.includes("shipment count")
  ) {
    const overview =
      await analyticsRepository.getOverview();

    return {
      answer: `There are ${overview.total_shipments} active shipments in the dashboard metrics.`,
      source: "PostgreSQL analytics",
      data: overview,
    };
  }

  if (
    normalizedQuestion.includes("status") ||
    normalizedQuestion.includes("overview") ||
    normalizedQuestion.includes("summary") ||
    normalizedQuestion.includes("total")
  ) {
    const overview =
      await analyticsRepository.getOverview();

    return {
      answer: `There are ${overview.total_shipments} active shipments in the dashboard metrics. ${overview.delayed_shipments} are marked delayed, ${overview.in_transit_shipments} are in transit, and ${overview.delivered_shipments} have been delivered. The delivery completion percentage is ${overview.delivery_completion_percentage}%.`,
      source: "PostgreSQL analytics",
      data: overview,
    };
  }

  if (normalizedQuestion.includes("shipment")) {
    const shipments =
      await shipmentsRepository.findAll();

    return {
      answer: `I found ${shipments.length} shipment records in the current shipment API response. You can ask me about shipment delays or the overall status summary for more specific information.`,
      source: "PostgreSQL shipment records",
    };
  }

  return {
    answer: "I can currently answer questions about shipment delays, overdue destinations, shipment totals and operational status. Try asking: How many shipments are delayed?",
    source: "Mock AI assistant",
  };
}

module.exports = { answerQuestion };