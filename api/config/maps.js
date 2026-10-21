module.exports = (req, res) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  const apiKey = process.env.GOOGLE_MAPS_API_KEY || process.env.MAPS_API_KEY || "AIzaSyD0JIwXnofK8a7xvVrlSuYHqA3iwUcubg4";

  res.status(200).json({
    success: true,
    data: {
      googleMapsConfigured: true,
      apiKey: apiKey,
      provider: "Google Maps JavaScript API + Live Traffic Layer",
      status: "CONNECTED"
    }
  });
};
