module.exports = (req, res) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  const sensors = [
    {
      id: 400101,
      name: "I-5 SB @ Mercer St (Exit 167)",
      highway: "I-5 Southbound",
      latitude: 47.625,
      longitude: -122.328,
      currentSpeedMph: 19.4,
      occupancy: 0.38,
      flowRateVehPerHour: 1840,
      congestionStatus: "CONGESTED",
      congestionColor: "#ef4444",
      region: "Metro Seattle Urban Corridor"
    },
    {
      id: 400102,
      name: "I-5 NB @ Seneca St (Exit 165A)",
      highway: "I-5 Northbound",
      latitude: 47.608,
      longitude: -122.329,
      currentSpeedMph: 22.1,
      occupancy: 0.32,
      flowRateVehPerHour: 2100,
      congestionStatus: "CONGESTED",
      congestionColor: "#ef4444",
      region: "Metro Seattle Urban Corridor"
    },
    {
      id: 400103,
      name: "SR-520 EB Mid-Span Floating Bridge",
      highway: "SR-520 Eastbound",
      latitude: 47.642,
      longitude: -122.250,
      currentSpeedMph: 61.2,
      occupancy: 0.12,
      flowRateVehPerHour: 1450,
      congestionStatus: "FREE_FLOW",
      congestionColor: "#10b981",
      region: "Metro Seattle Urban Corridor"
    },
    {
      id: 400104,
      name: "I-90 WB Mercer Island Lid",
      highway: "I-90 Westbound",
      latitude: 47.591,
      longitude: -122.250,
      currentSpeedMph: 38.5,
      occupancy: 0.22,
      flowRateVehPerHour: 1680,
      congestionStatus: "MODERATE",
      congestionColor: "#f59e0b",
      region: "Metro Seattle Urban Corridor"
    },
    {
      id: 400105,
      name: "SR-99 NB Alaskan Way Tunnel Portal",
      highway: "SR-99 Northbound",
      latitude: 47.610,
      longitude: -122.342,
      currentSpeedMph: 44.0,
      occupancy: 0.18,
      flowRateVehPerHour: 1320,
      congestionStatus: "FREE_FLOW",
      congestionColor: "#06b6d4",
      region: "Metro Seattle Urban Corridor"
    },
    {
      id: 400001,
      name: "Downtown San Jose Interchange (US-101 / I-880)",
      highway: "US-101 Northbound",
      latitude: 37.364085,
      longitude: -121.901149,
      currentSpeedMph: 67.6,
      occupancy: 0.11,
      flowRateVehPerHour: 1950,
      congestionStatus: "FREE_FLOW",
      congestionColor: "#10b981",
      region: "California Bay Area (PEMS-BAY)"
    },
    {
      id: 400017,
      name: "San Jose South Expressway (US-101 @ Bernal Rd)",
      highway: "US-101 Southbound",
      latitude: 37.253303,
      longitude: -121.94544,
      currentSpeedMph: 59.0,
      occupancy: 0.15,
      flowRateVehPerHour: 1720,
      congestionStatus: "FREE_FLOW",
      congestionColor: "#10b981",
      region: "California Bay Area (PEMS-BAY)"
    },
    {
      id: 400030,
      name: "Palo Alto Tech Corridor (US-101 @ University Ave)",
      highway: "US-101 Northbound",
      latitude: 37.4520,
      longitude: -122.1280,
      currentSpeedMph: 46.2,
      occupancy: 0.24,
      flowRateVehPerHour: 2280,
      congestionStatus: "MODERATE",
      congestionColor: "#f59e0b",
      region: "California Bay Area (PEMS-BAY)"
    },
    {
      id: 400045,
      name: "San Francisco Bay Bridge Toll Plaza (I-80 Westbound)",
      highway: "I-80 Westbound",
      latitude: 37.8240,
      longitude: -122.3200,
      currentSpeedMph: 24.8,
      occupancy: 0.36,
      flowRateVehPerHour: 2450,
      congestionStatus: "CONGESTED",
      congestionColor: "#ef4444",
      region: "California Bay Area (PEMS-BAY)"
    }
  ];

  res.status(200).json({
    success: true,
    data: sensors
  });
};
