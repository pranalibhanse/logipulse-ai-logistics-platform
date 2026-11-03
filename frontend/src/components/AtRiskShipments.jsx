
import { AlertTriangle, Clock } from "lucide-react";

function AtRiskShipments({ shipments = [] }) {
  return (
    <section className="analytics-card at-risk-section">
      <div className="analytics-card-heading">
        <h2>At-Risk Shipments</h2>
        <p>Shipments that are overdue or due within 24 hours</p>
      </div>

      {shipments.length === 0 ? (
        <p className="empty-message">
          No at-risk shipments currently found.
        </p>
      ) : (
        <div className="table-wrapper">
          <table className="risk-table">
            <thead>
              <tr>
                <th>Tracking ID</th>
                <th>Route</th>
                <th>Status</th>
                <th>Expected Delivery</th>
                <th>Risk</th>
              </tr>
            </thead>

            <tbody>
              {shipments.map((shipment) => (
                <tr key={shipment.id}>
                  <td className="tracking-id">
                    {shipment.tracking_number}
                  </td>

                  <td>
                    {shipment.origin} → {shipment.destination}
                  </td>

                  <td>
                    <span className="status-label">
                      {shipment.status.replaceAll("_", " ")}
                    </span>
                  </td>

                  <td>
                    {new Date(
                      shipment.estimated_delivery
                    ).toLocaleString("en-IN", {
                      dateStyle: "medium",
                      timeStyle: "short"
                    })}
                  </td>

                  <td>
                    <span
                      className={`risk-badge ${shipment.risk_category}`}
                    >
                      {shipment.risk_category === "overdue" ? (
                        <AlertTriangle size={13} />
                      ) : (
                        <Clock size={13} />
                      )}

                      {shipment.risk_category === "overdue"
                        ? "Overdue"
                        : "Due Soon"}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </section>
  );
}

export default AtRiskShipments;
