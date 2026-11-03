
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  CartesianGrid,
  XAxis,
  YAxis,
  Tooltip,
} from "recharts";

const STATUS_LABELS = {
  pending: "Pending",
  in_transit: "In Transit",
  out_for_delivery: "Out for Delivery",
  delivered: "Delivered",
  delayed: "Delayed",
  cancelled: "Cancelled",
};

function ShipmentStatusChart({ distribution = [] }) {
  const countsByStatus = Object.fromEntries(
    distribution.map((item) => [
      item.status,
      Number(item.count),
    ])
  );

  const chartData = Object.entries(STATUS_LABELS).map(
    ([status, label]) => ({
      status: label,
      count: countsByStatus[status] ?? 0,
    })
  );

  return (
    <div className="panel chart-panel">
      <div className="panel-heading">
        <div>
          <h3>Shipment Status Distribution</h3>
          <p>All shipments grouped by current recorded status</p>
        </div>
      </div>

      <div className="chart-container">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart
            data={chartData}
            margin={{
              top: 8,
              right: 12,
              left: -16,
              bottom: 8,
            }}
          >
            <CartesianGrid
              strokeDasharray="3 3"
              vertical={false}
              stroke="#e9edf4"
            />

            <XAxis
              dataKey="status"
              tick={{ fontSize: 10, fill: "#7b879b" }}
              axisLine={false}
              tickLine={false}
              interval={0}
            />

            <YAxis
              allowDecimals={false}
              tick={{ fontSize: 11, fill: "#7b879b" }}
              axisLine={false}
              tickLine={false}
            />

            <Tooltip
              cursor={{ fill: "#f5f7fb" }}
              formatter={(value) => [
                value,
                "Shipments",
              ]}
              contentStyle={{
                borderRadius: "8px",
                border: "1px solid #e9edf4",
                fontSize: "12px",
              }}
            />

            <Bar
              dataKey="count"
              name="Shipments"
              fill="#3159df"
              radius={[5, 5, 0, 0]}
              maxBarSize={44}
            />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}

export default ShipmentStatusChart;
