const pool = require("../db");

async function findAll() {
  const result = await pool.query(`
    SELECT
      s.id,
      s.tracking_number,
      o.city AS origin,
      d.city AS destination,
      s.status,
      s.estimated_delivery,
      s.actual_delivery,
      s.delay_reason
    FROM shipments s
    JOIN locations o ON o.id = s.origin_id
    JOIN locations d ON d.id = s.destination_id
    ORDER BY s.created_at DESC
    LIMIT 50
  `);

  return result.rows;
}

module.exports = { findAll };