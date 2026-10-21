module.exports = (req, res) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  const query = req.query || {};
  const oLat = parseFloat(query.originLat || 47.608);
  const oLon = parseFloat(query.originLon || -122.335);
  const dLat = parseFloat(query.destLat || 47.618);
  const dLon = parseFloat(query.destLon || -122.195);
  const oName = query.originName || 'Downtown Seattle';
  const dName = query.destName || 'Bellevue Tech Campus';

  const dLatMiles = (dLat - oLat) * 69.0;
  const dLonMiles = (dLon - oLon) * 54.6;
  const straight = Math.sqrt(dLatMiles * dLatMiles + dLonMiles * dLonMiles);
  const roadDist = Math.max(1.5, Math.round(straight * 1.25 * 10) / 10);

  const coords = [];
  const steps = 25;
  for (let i = 0; i <= steps; i++) {
    const fraction = i / steps;
    const lat = oLat + fraction * (dLat - oLat);
    const lon = oLon + fraction * (dLon - oLon);
    const offset = Math.sin(fraction * Math.PI) * 0.008;
    coords.push([Math.round((lon + offset) * 100000) / 100000, Math.round((lat + offset) * 100000) / 100000]);
  }

  const durationMin = Math.round(roadDist * 1.5 * 10) / 10;
  const freeFlowMin = Math.round(roadDist * 1.1 * 10) / 10;
  const delayMin = Math.max(0.5, Math.round((durationMin - freeFlowMin) * 10) / 10);

  res.status(200).json({
    success: true,
    data: {
      originName: oName,
      destinationName: dName,
      originLat: oLat,
      originLon: oLon,
      destLat: dLat,
      destLon: dLon,
      totalDistanceMiles: roadDist,
      distanceMiles: roadDist,
      estimatedDurationMinutes: durationMin,
      formattedDuration: `${Math.round(durationMin)} min`,
      freeFlowDurationMinutes: freeFlowMin,
      trafficDelayMinutes: delayMin,
      congestionDelayMinutes: delayMin,
      overallCongestionStatus: delayMin > 3.0 ? "MODERATE_DELAY" : "SMOOTH",
      routingProvider: "Vercel Serverless Corridor Routing Engine",
      pathCoordinates: coords,
      geometryCoordinates: coords
    }
  });
};
