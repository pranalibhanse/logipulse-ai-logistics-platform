import { useEffect, useState } from "react";
import {
  Package,
  Truck,
  Clock,
  CheckCircle2,
  RefreshCw,
} from "lucide-react";

import {
  getShipments,
  getAnalyticsOverview,
  getDelayedByDestination,
  getStatusDistribution,
  getAdvancedAnalytics
} from "./services/api";

import ShipmentStatusChart from "./components/ShipmentStatusChart";
import AIAssistant from "./components/AIAssistant";
import DeliveryPerformance from "./components/DeliveryPerformance";
import DelayReasonsChart from "./components/DelayReasonsChart";
import AtRiskShipments from "./components/AtRiskShipments";

import "./App.css";

function StatCard({ title, value, icon: Icon, color }) {
  return (
    <div className="stat-card">
      <div>
        <p className="stat-title">{title}</p>
        <h2>{value ?? "—"}</h2>
      </div>

      <div className={`stat-icon ${color}`}>
        <Icon size={23} />
      </div>
    </div>
  );
}

function App() {
  const [overview, setOverview] = useState(null);
  const [shipments, setShipments] = useState([]);
  const [destinations, setDestinations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [filter, setFilter] = useState("all");
  const [search, setSearch] = useState("");
  const [distribution, setDistribution] = useState([]);
  const [advancedAnalytics, setAdvancedAnalytics] = useState(null);

  async function loadDashboard() {
    setLoading(true);
    setError("");

    try {
      const [
      overviewData,
      shipmentData,
      destinationData,
      distributionData,
      advancedAnalyticsData
      ] = await Promise.all([
        getAnalyticsOverview(),
        getShipments(),
        getDelayedByDestination(),
        getStatusDistribution(),
        getAdvancedAnalytics()
      ]);

    setOverview(overviewData.data);
    setShipments(shipmentData.shipments);
    setDestinations(destinationData.data);
    setDistribution(distributionData.data);
    setAdvancedAnalytics(advancedAnalyticsData.data);
    } catch (err) {
      setError(err.message || "Unable to load dashboard.");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadDashboard();
  }, []);

  const filteredShipments = shipments.filter((shipment) => {
    const matchesStatus =
      filter === "all" || shipment.status === filter;

    const query = search.toLowerCase();

    const matchesSearch =
      shipment.tracking_number.toLowerCase().includes(query) ||
      shipment.origin.toLowerCase().includes(query) ||
      shipment.destination.toLowerCase().includes(query);

    return matchesStatus && matchesSearch;
  });

  const stats = [
    {
      title: "Total Shipments",
      value: overview?.total_shipments,
      icon: Package,
      color: "blue",
    },
    {
      title: "In Transit",
      value: overview?.in_transit_shipments,
      icon: Truck,
      color: "purple",
    },
    {
      title: "Delayed",
      value: overview?.delayed_shipments,
      icon: Clock,
      color: "orange",
    },
    {
      title: "Delivered",
      value: overview?.delivered_shipments,
      icon: CheckCircle2,
      color: "green",
    },
  ];

  return (
    <div className="app-shell">
      <aside className="sidebar">
        <div className="brand">
          <div className="brand-mark">
            <Package size={24} />
          </div>
          <div>
            <h2>LogiPulse</h2>
            <span>Intelligence Platform</span>
          </div>
        </div>

        <p className="nav-label">WORKSPACE</p>

        <div className="nav-item active">
          <Package size={18} />
          Dashboard
        </div>

        <div className="nav-item">
          <Truck size={18} />
          Shipments
        </div>

        <div className="nav-item">
          <Clock size={18} />
          Delivery Analytics
        </div>

        <div className="sidebar-footer">
          <span className="status-dot" />
          API connection configured
        </div>
      </aside>

      <main className="main-content">
        <header className="topbar">
          <div>
            <p className="eyebrow">LOGISTICS OVERVIEW</p>
            <h1>Dashboard</h1>
            <p className="subtitle">
              Monitor shipment operations and delivery performance.
            </p>
          </div>

          <button
            className="refresh-button"
            onClick={loadDashboard}
            disabled={loading}
          >
            <RefreshCw size={16} />
            Refresh
          </button>
        </header>

        {error && (
          <div className="error-banner">
            {error}
            <button onClick={loadDashboard}>Retry</button>
          </div>
        )}

        <section className="stats-grid">
          {stats.map((stat) => (
            <StatCard key={stat.title} {...stat} />
          ))}
        </section>

        <section className="analytics-grid">
          <div className="panel completion-panel">
            <div className="panel-heading">
              <div>
                <h3>Delivery Completion</h3>
                <p>Share of non-cancelled shipments delivered</p>
              </div>
            </div>

            <div className="completion-value">
              {overview
                ? `${overview.delivery_completion_percentage}%`
                : "—"}
            </div>

            <div className="progress-track">
              <div
                className="progress-fill"
                style={{
                  width: `${Math.min(
                    100,
                    Number(
                      overview?.delivery_completion_percentage || 0
                    )
                  )}%`,
                }}
              />
            </div>

            <p className="muted">
              Based on the current database records
            </p>
          </div>

          <div className="panel destinations-panel">
            <div className="panel-heading">
              <div>
                <h3>Overdue by Destination</h3>
                <p>Undelivered shipments past their estimated date</p>
              </div>
            </div>

            {destinations.length === 0 ? (
              <p className="muted">No overdue shipments found.</p>
            ) : (
              destinations.slice(0, 5).map((item) => (
                <div
                  className="destination-row"
                  key={item.destination}
                >
                  <span>{item.destination}</span>
                  <strong>{item.delayed_shipments}</strong>
                </div>
              ))
            )}
          </div>
        </section>

        <DeliveryPerformance analytics={advancedAnalytics} />

        <section className="chart-grid">
          <ShipmentStatusChart distribution={distribution} />
        </section>

        <DelayReasonsChart
          reasons={advancedAnalytics?.topDelayReasons || []}
        />

        <AtRiskShipments
          shipments={advancedAnalytics?.atRiskShipments || []}
        />

        <section className="ai-section">
          <AIAssistant />
        </section>

        <section className="panel shipment-panel">
          <div className="panel-heading shipment-heading">
            <div>
              <h3>Recent Shipments</h3>
              <p>Search and filter your shipment records</p>
            </div>

            <span className="record-count">
              {filteredShipments.length} records
            </span>
          </div>

          <div className="table-toolbar">
            <input
              type="search"
              placeholder="Search tracking ID or city..."
              value={search}
              onChange={(event) => setSearch(event.target.value)}
            />

            <select
              value={filter}
              onChange={(event) => setFilter(event.target.value)}
            >
              <option value="all">All statuses</option>
              <option value="pending">Pending</option>
              <option value="in_transit">In transit</option>
              <option value="out_for_delivery">
                Out for delivery
              </option>
              <option value="delivered">Delivered</option>
              <option value="delayed">Delayed</option>
              <option value="cancelled">Cancelled</option>
            </select>
          </div>

          {loading ? (
            <p className="table-message">Loading shipments...</p>
          ) : (
            <div className="table-scroll">
              <table>
                <thead>
                  <tr>
                    <th>Tracking ID</th>
                    <th>Route</th>
                    <th>Status</th>
                    <th>Estimated Delivery</th>
                  </tr>
                </thead>

                <tbody>
                  {filteredShipments.map((shipment) => (
                    <tr key={shipment.id}>
                      <td className="tracking-id">
                        {shipment.tracking_number}
                      </td>

                      <td>
                        {shipment.origin}
                        <span className="route-arrow"> → </span>
                        {shipment.destination}
                      </td>

                      <td>
                        <span
                          className={`status-badge status-${shipment.status}`}
                        >
                          {shipment.status.replaceAll("_", " ")}
                        </span>
                      </td>

                      <td>
                        {new Date(
                          shipment.estimated_delivery
                        ).toLocaleDateString("en-IN")}
                      </td>
                    </tr>
                  ))}

                  {filteredShipments.length === 0 && (
                    <tr>
                      <td colSpan="4" className="table-message">
                        No matching shipments found.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          )}
        </section>

        <footer className="footer">
          LogiPulse · AI-Powered Logistics Intelligence
        </footer>
      </main>
    </div>
  );
}

export default App;