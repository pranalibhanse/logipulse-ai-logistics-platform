const pool = require("../db");

async function getOverview() {
  const result = await pool.query(`
    SELECT
      COUNT(*)::INT AS total_shipments,

      COUNT(*) FILTER (
        WHERE status = 'delayed'
      )::INT AS delayed_shipments,

      COUNT(*) FILTER (
        WHERE status = 'in_transit'
      )::INT AS in_transit_shipments,

      COUNT(*) FILTER (
        WHERE status = 'out_for_delivery'
      )::INT AS out_for_delivery_shipments,

      COUNT(*) FILTER (
        WHERE status = 'delivered'
      )::INT AS delivered_shipments,

      COUNT(*) FILTER (
        WHERE status = 'pending'
      )::INT AS pending_shipments,

      COALESCE(
        ROUND(
          100.0 * COUNT(*) FILTER (
            WHERE status = 'delivered'
          ) / NULLIF(COUNT(*), 0),
          2
        ),
        0
      ) AS delivery_completion_percentage

    FROM shipments
    WHERE status != 'cancelled'
  `);

  return result.rows[0];
}

async function getDelayedByDestination() {
  const result = await pool.query(`
    SELECT
      l.city AS destination,
      COUNT(*)::INT AS delayed_shipments
    FROM shipments s
    JOIN locations l
      ON l.id = s.destination_id
    WHERE
      s.status != 'cancelled'
      AND s.estimated_delivery < NOW()
      AND s.actual_delivery IS NULL
    GROUP BY l.id, l.city
    ORDER BY delayed_shipments DESC, l.city ASC
  `);

  return result.rows;
}

async function getStatusDistribution() {
  const result = await pool.query(`
    SELECT
      status,
      COUNT(*)::INT AS count
    FROM shipments
    GROUP BY status
    ORDER BY status;
  `);

  return result.rows;
}


async function getDeliveryPerformance() {
  const result = await pool.query(`
    SELECT
      COUNT(*) FILTER (
        WHERE status = 'delivered'
      )::INT AS total_delivered,

      COALESCE(
        ROUND(
          AVG(
            EXTRACT(EPOCH FROM (actual_delivery - created_at)) / 3600
          ) FILTER (
            WHERE status = 'delivered'
              AND actual_delivery IS NOT NULL
              AND actual_delivery >= created_at
          )::NUMERIC,
          2
        ),
        0
      ) AS average_delivery_hours,

      COALESCE(
        ROUND(
          100.0 * COUNT(*) FILTER (
            WHERE status = 'delivered'
              AND actual_delivery <= estimated_delivery
          ) / NULLIF(
            COUNT(*) FILTER (WHERE status = 'delivered'),
            0
          ),
          2
        ),
        0
      ) AS on_time_delivery_percentage

    FROM shipments
    WHERE status != 'cancelled'
  `);

  return result.rows[0];
}

async function getMostDelayedDestination() {
  const destinations = await getDelayedByDestination();

  return destinations.length > 0 ? destinations[0] : null;
}

async function getTopDelayReasons() {
  const result = await pool.query(`
    SELECT
      delay_reason,
      COUNT(*)::INT AS shipment_count
    FROM shipments
    WHERE
      status != 'cancelled'
      AND delay_reason IS NOT NULL
      AND TRIM(delay_reason) != ''
    GROUP BY delay_reason
    ORDER BY shipment_count DESC
    LIMIT 5;
  `);

  return result.rows;
}

async function getAtRiskShipments() {
  const result = await pool.query(`
    SELECT
      s.id,
      s.tracking_number,
      s.status,
      origin.city AS origin,
      destination.city AS destination,
      s.estimated_delivery,
      CASE
        WHEN s.estimated_delivery < NOW() THEN 'overdue'
        ELSE 'due_soon'
      END AS risk_category

    FROM shipments s

    JOIN locations origin
      ON origin.id = s.origin_id

    JOIN locations destination
      ON destination.id = s.destination_id

    WHERE
      s.status NOT IN ('delivered', 'cancelled')
      AND s.estimated_delivery <= NOW() + INTERVAL '24 hours'

    ORDER BY s.estimated_delivery ASC
    LIMIT 10;
  `);

  return result.rows;
}

module.exports = {
  getOverview,
  getDelayedByDestination,
  getStatusDistribution,
  getDeliveryPerformance,
  getMostDelayedDestination,
  getTopDelayReasons,
  getAtRiskShipments
};