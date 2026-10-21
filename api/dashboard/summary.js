module.exports = (req, res) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  res.status(200).json({
    success: true,
    data: {
      totalSensorsMonitored: 325,
      averageNetworkSpeedMph: 48.4,
      freeFlowSensors: 242,
      moderateSensors: 58,
      congestedSensors: 18,
      severeSensors: 7,
      activeIncidentsCount: 3,
      primaryHighwayCorridor: "I-5 Corridor / US-101 (PeMS Benchmark)",
      datasetBenchmark: "PEMS-BAY",
      modelStatus: "HIST_GRADIENT_BOOSTING (Loaded)",
      modelMae: 2.14,
      modelR2: 0.912,
      congestionBreakdown: {
        "FREE_FLOW": 242,
        "MODERATE": 58,
        "CONGESTED": 18,
        "SEVERE": 7
      }
    }
  });
};
