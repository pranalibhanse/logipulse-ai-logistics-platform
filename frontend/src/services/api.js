const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL ||
  "http://localhost:5000/api";

async function request(endpoint) {
  const response = await fetch(
    `${API_BASE_URL}${endpoint}`
  );

  if (!response.ok) {
    throw new Error(
      `API request failed: ${response.status}`
    );
  }

  return response.json();
}

export async function askAI(question) {
  const response = await fetch(
    `${API_BASE_URL}/ai/ask`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ question }),
    }
  );

  const data = await response.json();

  if (!response.ok) {
    throw new Error(
      data.error || "Unable to get AI response"
    );
  }

  return data;
}

export async function getAdvancedAnalytics() {
  const response = await fetch(
    `${API_BASE_URL}/analytics/advanced`
  );

  if (!response.ok) {
    throw new Error("Failed to fetch advanced analytics");
  }

  return response.json();
}

export function getShipments() {
  return request("/shipments");
}

export function getAnalyticsOverview() {
  return request("/analytics/overview");
}

export function getDelayedByDestination() {
  return request("/analytics/delayed-by-destination");
}

export function getStatusDistribution() {
  return request("/analytics/status-distribution");
}
