
import {
  Clock,
  CheckCircle2,
  Package,
  MapPin
} from "lucide-react";

function DeliveryPerformance({ analytics }) {
  if (!analytics) return null;

  const performance = analytics.deliveryPerformance;
  const delayedDestination = analytics.mostDelayedDestination;

  const metrics = [
    {
      title: "Average Delivery Time",
      value: `${performance.average_delivery_hours} hrs`,
      icon: Clock,
      description: "Average time from creation to delivery"
    },
    {
      title: "On-Time Delivery",
      value: `${performance.on_time_delivery_percentage}%`,
      icon: CheckCircle2,
      description: "Delivered within estimated time"
    },
    {
      title: "Total Delivered",
      value: performance.total_delivered,
      icon: Package,
      description: "Successfully delivered shipments"
    },
    {
      title: "Most Delayed Destination",
      value: delayedDestination
        ? delayedDestination.destination
        : "None",
      icon: MapPin,
      description: delayedDestination
        ? `${delayedDestination.delayed_shipments} overdue shipments`
        : "No overdue destinations"
    }
  ];

  return (
    <section className="performance-section">
      <div className="section-heading">
        <div>
          <h2>Delivery Performance</h2>
          <p>Advanced logistics performance metrics</p>
        </div>
      </div>

      <div className="performance-grid">
        {metrics.map((metric) => {
          const Icon = metric.icon;

          return (
            <div className="performance-card" key={metric.title}>
              <div className="performance-card-top">
                <span>{metric.title}</span>
                <Icon size={20} />
              </div>

              <h3>{metric.value}</h3>

              <p>{metric.description}</p>
            </div>
          );
        })}
      </div>
    </section>
  );
}

export default DeliveryPerformance;
