
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip
} from "recharts";

function DelayReasonsChart({ reasons = [] }) {
  const chartData = reasons.map((item) => ({
    reason: item.delay_reason,
    shipments: Number(item.shipment_count)
  }));

  return (
    <section className="analytics-card delay-reasons-card">
      <div className="analytics-card-heading">
        <h2>Top Delay Reasons</h2>
        <p>Most common causes of shipment delays</p>
      </div>

      {chartData.length === 0 ? (
        <p className="empty-message">
          No delay reasons available.
        </p>
      ) : (
        <div className="delay-chart-container">
          <ResponsiveContainer width="100%" height={300}>
            <BarChart
              data={chartData}
              layout="vertical"
              margin={{
                top: 10,
                right: 25,
                left: 15,
                bottom: 10
              }}
            >
              <CartesianGrid
                strokeDasharray="3 3"
                horizontal={false}
              />

              <XAxis
                type="number"
                allowDecimals={false}
              />

              <YAxis
                type="category"
                dataKey="reason"
                width={190}
                tick={{ fontSize: 11 }}
              />

              <Tooltip />

              <Bar
                dataKey="shipments"
                name="Shipments"
                fill="#3985d6"
                radius={[0, 6, 6, 0]}
                barSize={28}
              />
            </BarChart>
          </ResponsiveContainer>
        </div>
      )}
    </section>
  );
}

export default DelayReasonsChart;
