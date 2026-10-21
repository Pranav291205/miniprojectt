let memoryIncidents = [
  {
    id: 101,
    title: "COLLISION: I-5 Northbound MP 165A",
    category: "COLLISION",
    type: "COLLISION",
    highway: "I-5 Northbound MP 165A",
    corridorLocation: "I-5 NB @ Seneca St",
    latitude: 47.608,
    longitude: -122.329,
    severity: "SEVERE",
    description: "Overturned trailer blocking 2 center lanes. Backup extending 3.4 miles. Emergency response units on scene.",
    status: "Active",
    reportedAt: "2026-10-15T16:42:00Z"
  },
  {
    id: 102,
    title: "WEATHER_HAZARD: SR-520 Floating Bridge",
    category: "WEATHER_HAZARD",
    type: "WEATHER_HAZARD",
    highway: "SR-520 Floating Bridge",
    corridorLocation: "SR-520 Mid-Span",
    latitude: 47.642,
    longitude: -122.250,
    severity: "MODERATE",
    description: "Crosswinds gusting to 28 mph across Lake Washington mid-span. High-profile vehicles caution advised.",
    status: "Advisory",
    reportedAt: "2026-10-15T16:30:00Z"
  },
  {
    id: 103,
    title: "ROADWORK: I-90 Westbound Tunnel",
    category: "ROADWORK",
    type: "ROADWORK",
    highway: "I-90 Westbound Tunnel",
    corridorLocation: "I-90 WB Mercer Island Portal",
    latitude: 47.591,
    longitude: -122.250,
    severity: "LOW",
    description: "Scheduled maintenance work in right bore. Single lane closure through 19:00 PST.",
    status: "Active",
    reportedAt: "2026-10-15T15:15:00Z"
  }
];

module.exports = (req, res) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method === 'POST') {
    let body = req.body;
    if (typeof body === 'string') {
      try {
        body = JSON.parse(body);
      } catch (_) {
        body = {};
      }
    }
    body = body || {};

    const newInc = {
      id: Date.now(),
      title: body.title || `${body.type || 'INCIDENT'}: ${body.highway || 'Corridor'}`,
      category: (body.category || body.type || 'INCIDENT').toUpperCase(),
      type: body.type || 'INCIDENT',
      highway: body.highway || body.corridorLocation || 'Monitored Highway',
      corridorLocation: body.corridorLocation || body.highway || 'Monitored Corridor',
      latitude: body.latitude || 47.61,
      longitude: body.longitude || -122.33,
      severity: (body.severity || 'LOW').toUpperCase(),
      description: body.description || 'Operator reported incident.',
      status: body.status || 'Active',
      reportedAt: new Date().toISOString()
    };

    memoryIncidents.unshift(newInc);

    return res.status(200).json({
      success: true,
      data: newInc,
      message: "Incident successfully logged and broadcast."
    });
  }

  res.status(200).json({
    success: true,
    data: memoryIncidents
  });
};
