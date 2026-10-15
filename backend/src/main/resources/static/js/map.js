/**
 * TrafficIQ — Interactive Geospatial GIS Map Manager
 * Supports Leaflet.js with CartoDB Dark Matter tiles, tactical corridor overlays,
 * Seattle Urban Corridor calibrated simulation, and Caltrans PeMS-BAY 325-sensor benchmark.
 */

class TrafficMapManager {
  constructor(containerId) {
    this.containerId = containerId;
    this.map = null;
    this.currentRegion = 'seattle'; // 'seattle' or 'bayarea'
    this.apiKey = 'AIzaSyD0JIwXnofK8a7xvVrlSuYHqA3iwUcubg4';
    this.currentBasemap = 'google-traffic'; // 'google-traffic', 'google-sat', 'google-roads', 'carto-dark'
    this.baseLayers = {};
    this.activeBaseLayer = null;
    
    // Layer Groups
    this.corridorLayer = null;
    this.sensorLayer = null;
    this.incidentLayer = null;
    this.routeLayer = null;
    this.diversionLayer = null;
    
    // State
    this.allSensors = [];
    this.onNodeSelectedCallback = null;
    this.isDiversionApplied = false;
  }

  init(onNodeSelected) {
    this.onNodeSelectedCallback = onNodeSelected;
    const container = document.getElementById(this.containerId);
    if (!container) return;

    // Initialize Leaflet map
    this.map = L.map(this.containerId, {
      zoomControl: false,
      minZoom: 8,
      maxZoom: 19,
      attributionControl: false
    }).setView([47.618, -122.285], 12);

    // Setup base layers with Google Maps live traffic & CartoDB fallback
    this.setupBaseLayers();
    this.setBasemap(this.currentBasemap);

    // Add scale
    L.control.scale({ imperial: true, metric: true, position: 'bottomright' }).addTo(this.map);

    // Create layer groups
    this.corridorLayer = L.layerGroup().addTo(this.map);
    this.sensorLayer = L.layerGroup().addTo(this.map);
    this.incidentLayer = L.layerGroup().addTo(this.map);
    this.routeLayer = L.layerGroup().addTo(this.map);
    this.diversionLayer = L.layerGroup().addTo(this.map);

    // Initial render
    this.loadRegion('seattle');
  }

  setupBaseLayers() {
    this.baseLayers = {
      'google-traffic': L.tileLayer(`https://mt{s}.google.com/vt/lyrs=m,traffic&x={x}&y={y}&z={z}&key=${this.apiKey}`, {
        subdomains: ['0', '1', '2', '3'],
        maxZoom: 20,
        attribution: 'Google Maps Live Traffic'
      }),
      'google-sat': L.tileLayer(`https://mt{s}.google.com/vt/lyrs=y&x={x}&y={y}&z={z}&key=${this.apiKey}`, {
        subdomains: ['0', '1', '2', '3'],
        maxZoom: 20,
        attribution: 'Google Maps Satellite'
      }),
      'google-roads': L.tileLayer(`https://mt{s}.google.com/vt/lyrs=m&x={x}&y={y}&z={z}&key=${this.apiKey}`, {
        subdomains: ['0', '1', '2', '3'],
        maxZoom: 20,
        attribution: 'Google Maps Standard'
      }),
      'carto-dark': L.tileLayer('https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png', {
        subdomains: 'abcd',
        maxZoom: 20,
        attribution: 'CartoDB Dark Matter'
      })
    };
  }

  setBasemap(name) {
    if (!this.map) return;
    if (!this.baseLayers || Object.keys(this.baseLayers).length === 0) {
      this.setupBaseLayers();
    }
    const layer = this.baseLayers[name] || this.baseLayers['google-traffic'];
    if (!layer) return;

    if (this.activeBaseLayer && this.map.hasLayer(this.activeBaseLayer)) {
      this.map.removeLayer(this.activeBaseLayer);
    }
    this.currentBasemap = name;
    this.activeBaseLayer = layer;
    this.activeBaseLayer.addTo(this.map);
    this.activeBaseLayer.bringToBack();
  }

  setApiKey(key) {
    if (!key || key === this.apiKey) return;
    this.apiKey = key;
    this.setupBaseLayers();
    this.setBasemap(this.currentBasemap);
  }

  setRegion(region) {
    this.currentRegion = region;
    this.loadRegion(region);
  }

  loadRegion(region) {
    this.clearAllLayers();

    if (region === 'seattle') {
      this.map.flyTo([47.618, -122.285], 12, { duration: 1.2 });
      this.renderSeattleCorridors();
      this.renderSeattleIncidents();
      this.renderSeattleSensors();
    } else {
      this.map.flyTo([37.38, -121.98], 11, { duration: 1.2 });
      this.renderBayAreaSensors();
    }
  }

  clearAllLayers() {
    this.corridorLayer.clearLayers();
    this.sensorLayer.clearLayers();
    this.incidentLayer.clearLayers();
    this.routeLayer.clearLayers();
    this.diversionLayer.clearLayers();
    this.isDiversionApplied = false;
  }

  // --- SEATTLE REGION RENDER (Stitch Design B) ---
  renderSeattleCorridors() {
    // 1. I-5 Northbound: South Free Flow -> Chokepoint (Seneca -> Mercer) -> North
    // South Free flow
    L.polyline([
      [47.530, -122.318],
      [47.570, -122.320],
      [47.595, -122.324]
    ], { color: '#10b981', weight: 6, opacity: 0.9 }).addTo(this.corridorLayer);

    // Approaching Downtown buildup
    L.polyline([
      [47.595, -122.324],
      [47.608, -122.329]
    ], { color: '#f97316', weight: 7, opacity: 0.9 }).addTo(this.corridorLayer);

    // CRITICAL CHOKEPOINT: Seneca St to Mercer St (WA-DOT-I5-165.2)
    const chokepointPoly = L.polyline([
      [47.608, -122.329],
      [47.616, -122.331],
      [47.625, -122.328]
    ], {
      color: '#ef4444',
      weight: 10,
      opacity: 0.95,
      dashArray: '8, 6'
    }).addTo(this.corridorLayer);

    chokepointPoly.bindPopup(`
      <div style="font-family: JetBrains Mono; font-size: 11px;">
        <span style="color: #ffb4ab; font-weight: bold; text-transform: uppercase;">CRITICAL CHOKEPOINT</span><br/>
        <strong style="color: #fff; font-size: 13px;">I-5 NB: Seneca St → Mercer St</strong><br/>
        <span style="color: #869397;">WA-DOT-I5-165.2</span><br/><br/>
        Velocity: <strong style="color: #ef4444;">19 mph</strong> (Limit: 52 mph)<br/>
        Congestion Index: <strong style="color: #ef4444;">78% Severe</strong><br/>
        Queue Length: <strong>3.8 miles</strong><br/>
        Est. Clearance: <strong style="color: #d0bcff;">42 mins</strong>
      </div>
    `);

    // Pulsing Hazard Halo on Chokepoint Core
    const hazardCircle = L.circleMarker([47.616, -122.331], {
      radius: 14,
      fillColor: '#ef4444',
      fillOpacity: 0.5,
      color: '#ffb4ab',
      weight: 2
    }).addTo(this.corridorLayer);

    hazardCircle.on('click', () => {
      chokepointPoly.openPopup();
      if (this.onNodeSelectedCallback) {
        this.onNodeSelectedCallback('WA-DOT-I5-165.2', 'I-5 NB: Seneca St → Mercer St', 'Velocity: 19 mph | Congestion: 78% SEVERE | Est. Clearance: 42 mins');
      }
    });

    // North of Mercer
    L.polyline([
      [47.625, -122.328],
      [47.655, -122.322],
      [47.700, -122.330]
    ], { color: '#f59e0b', weight: 6, opacity: 0.9 }).addTo(this.corridorLayer);

    // 2. SR-520 Floating Bridge (Vibrant Green Free Flow)
    const sr520 = L.polyline([
      [47.643, -122.305],
      [47.642, -122.250],
      [47.635, -122.215],
      [47.625, -122.180]
    ], { color: '#10b981', weight: 7, opacity: 0.9 }).addTo(this.corridorLayer);
    sr520.bindPopup('<strong style="font-family: JetBrains Mono; color: #4edea3;">SR-520 Floating Bridge</strong><br/>Velocity: 61 mph • Free Flow • 9 min travel time');

    // 3. I-90 Floating Bridge (Amber Moderate Traffic)
    const i90 = L.polyline([
      [47.590, -122.300],
      [47.591, -122.250],
      [47.585, -122.210],
      [47.578, -122.165]
    ], { color: '#f59e0b', weight: 6, opacity: 0.85 }).addTo(this.corridorLayer);
    i90.bindPopup('<strong style="font-family: JetBrains Mono; color: #f59e0b;">I-90 Lake Washington</strong><br/>Velocity: 38 mph • Moderate Traffic • 17 min travel time');

    // 4. I-405 Beltway (Free Flow Green)
    L.polyline([
      [47.710, -122.180],
      [47.625, -122.180],
      [47.560, -122.170],
      [47.500, -122.210]
    ], { color: '#10b981', weight: 6, opacity: 0.85 }).addTo(this.corridorLayer);

    // 5. SR-99 Alaskan Way Tunnel (Cyan Alternate Route)
    const sr99 = L.polyline([
      [47.595, -122.335],
      [47.610, -122.342],
      [47.622, -122.343],
      [47.635, -122.345],
      [47.660, -122.348]
    ], {
      color: '#06b6d4',
      weight: 6,
      opacity: 0.9,
      dashArray: '10, 6'
    }).addTo(this.corridorLayer);
    sr99.bindPopup('<strong style="font-family: JetBrains Mono; color: #4cd7f6;">SR-99 Alaskan Way Tunnel</strong><br/>Free Flow • Velocity: 44 mph • AI Recommended Diversion (Saves 21m)');

    // Active Navigation Pathing Vector (Downtown -> Bellevue via SR-520)
    L.polyline([
      [47.608, -122.335], // 4th & Pike
      [47.625, -122.325],
      [47.643, -122.305],
      [47.642, -122.250],
      [47.635, -122.215],
      [47.618, -122.195]  // Bellevue Campus
    ], {
      color: '#acedff',
      weight: 4,
      opacity: 0.8,
      dashArray: '6, 6'
    }).addTo(this.routeLayer);
  }

  renderSeattleSensors() {
    // Loop Detector #4081
    const loopMarker = L.circleMarker([47.608, -122.330], {
      radius: 7,
      fillColor: '#1c2028',
      color: '#ffb4ab',
      weight: 2,
      fillOpacity: 1
    }).addTo(this.sensorLayer);

    loopMarker.bindTooltip('<span style="font-family: JetBrains Mono; font-size: 10px;">LOOP #4081 • 17 mph</span>', { permanent: false, direction: 'right' });
    loopMarker.on('click', () => {
      if (this.onNodeSelectedCallback) {
        this.onNodeSelectedCallback('LOOP-4081', 'I-5 @ Seneca In-Pavement Matrix', 'Occupancy: 84.2% | Mean Velocity: 17.4 mph | Calibrated Inductive Loop');
      }
    });

    // Radar Speed Node #88
    const radarMarker = L.circleMarker([47.642, -122.250], {
      radius: 7,
      fillColor: '#1c2028',
      color: '#4edea3',
      weight: 2,
      fillOpacity: 1
    }).addTo(this.sensorLayer);

    radarMarker.bindTooltip('<span style="font-family: JetBrains Mono; font-size: 10px;">RADAR #88 • 61 mph</span>', { permanent: false, direction: 'right' });
    radarMarker.on('click', () => {
      if (this.onNodeSelectedCallback) {
        this.onNodeSelectedCallback('RADAR-88', 'SR-520 Mid-Lake Vector Sensor', 'Free Flow Confirmed | Mean Velocity: 61.2 mph | Microwave Radar');
      }
    });

    // CCTV #12
    const cctvMarker = L.circleMarker([47.618, -122.332], {
      radius: 8,
      fillColor: '#1c2028',
      color: '#4cd7f6',
      weight: 2,
      fillOpacity: 1
    }).addTo(this.sensorLayer);

    cctvMarker.bindTooltip('<span style="font-family: JetBrains Mono; font-size: 10px;">CCTV #12 • Active HD</span>', { permanent: false, direction: 'right' });
    cctvMarker.on('click', () => {
      if (this.onNodeSelectedCallback) {
        this.onNodeSelectedCallback('CCTV-12', 'I-5 at Stewart St NB', 'Optical Telemetry: Dense Stop-and-Go Queue | AI Vehicle Counting: 2,420 vph');
      }
    });

    // Origin: Downtown Financial Hub (4th & Pike)
    const originPin = L.circleMarker([47.608, -122.335], {
      radius: 9,
      fillColor: '#4cd7f6',
      color: '#003640',
      weight: 3,
      fillOpacity: 1
    }).addTo(this.sensorLayer);
    originPin.bindPopup('<strong style="font-family: JetBrains Mono; color: #4cd7f6;">ORIGIN HUB</strong><br/>Downtown Financial Hub (4th & Pike)');

    // Destination: Bellevue Tech Campus
    const destPin = L.circleMarker([47.618, -122.195], {
      radius: 9,
      fillColor: '#d0bcff',
      color: '#3c0091',
      weight: 3,
      fillOpacity: 1
    }).addTo(this.sensorLayer);
    destPin.bindPopup('<strong style="font-family: JetBrains Mono; color: #d0bcff;">DESTINATION TARGET</strong><br/>Bellevue Tech Campus (108th Ave NE)');
  }

  renderSeattleIncidents() {
    // Incident 1: Critical collision Exit 165A
    const inc1 = L.circleMarker([47.614, -122.329], {
      radius: 9,
      fillColor: '#ef4444',
      color: '#ffdad6',
      weight: 2,
      fillOpacity: 0.9
    }).addTo(this.incidentLayer);
    inc1.bindPopup(`
      <div style="font-family: JetBrains Mono; font-size: 11px;">
        <span style="color: #ef4444; font-weight: bold;">CRITICAL COLLISION (Exit 165A)</span><br/>
        Multi-vehicle collision with overturned trailer on I-5 NB.<br/>
        <strong style="color: #ef4444;">3.4 mi backup • 2 lanes blocked</strong><br/>
        <span style="color: #4edea3;">Units on scene</span>
      </div>
    `);

    // Incident 2: I-90 Pothole repair
    const inc2 = L.circleMarker([47.588, -122.235], {
      radius: 8,
      fillColor: '#f59e0b',
      color: '#fef08a',
      weight: 2,
      fillOpacity: 0.9
    }).addTo(this.incidentLayer);
    inc2.bindPopup(`
      <div style="font-family: JetBrains Mono; font-size: 11px;">
        <span style="color: #f59e0b; font-weight: bold;">INFRASTRUCTURE WORK (I-90 EB)</span><br/>
        Emergency pothole repair mid-span. 1 right lane closed.<br/>
        Travel delay: +9 mins • Est. Clear: 17:30
      </div>
    `);
  }

  // --- CALIFORNIA BAY AREA REGION (PeMS-BAY Benchmark) ---
  renderBayAreaSensors() {
    if (!this.allSensors || this.allSensors.length === 0) {
      // Fetch locations if not yet loaded
      fetch('/api/traffic/locations')
        .then(r => r.json())
        .then(res => {
          if (res.success && res.data) {
            this.allSensors = res.data;
            this.plotBaySensors();
          }
        })
        .catch(e => console.error('Error fetching Bay Area sensors:', e));
    } else {
      this.plotBaySensors();
    }
  }

  plotBaySensors() {
    this.sensorLayer.clearLayers();

    this.allSensors.forEach(s => {
      const color = s.congestionColor || '#10b981';
      const marker = L.circleMarker([s.latitude, s.longitude], {
        radius: 6,
        fillColor: color,
        color: '#0f131c',
        weight: 1.5,
        fillOpacity: 0.85
      }).addTo(this.sensorLayer);

      const popupHtml = `
        <div style="font-family: JetBrains Mono; font-size: 11px; min-width: 220px;">
          <div style="display: flex; justify-content: space-between; align-items: center; border-bottom: 1px solid #3d494c; padding-bottom: 4px; margin-bottom: 6px;">
            <strong style="color: #4cd7f6;">#${s.id}</strong>
            <span style="background: ${color}; color: #000; padding: 2px 6px; border-radius: 4px; font-weight: bold; font-size: 10px;">${s.congestionStatus}</span>
          </div>
          <div style="font-size: 12px; font-weight: bold; color: #fff; margin-bottom: 4px;">${s.name}</div>
          <div style="color: #869397; margin-bottom: 6px;">${s.highway}</div>
          <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 4px; background: #181c24; padding: 6px; border-radius: 4px; margin-bottom: 8px;">
            <div>Speed: <strong style="color: #fff;">${s.currentSpeedMph} mph</strong></div>
            <div>Hist Avg: <strong style="color: #869397;">${s.averageSpeedMph} mph</strong></div>
            <div>Limit: <strong style="color: #869397;">${s.speedLimitMph} mph</strong></div>
            <div>Congestion: <strong style="color: ${color};">${s.congestionPercentage}%</strong></div>
          </div>
          <button onclick="window.app.runQuickForecast(${s.id})" style="width: 100%; background: #06b6d4; color: #003640; border: none; padding: 6px; border-radius: 4px; font-weight: bold; font-family: JetBrains Mono; cursor: pointer;">
            ⚡ Run In-Process ONNX Forecast
          </button>
        </div>
      `;

      marker.bindPopup(popupHtml);
      marker.on('click', () => {
        if (this.onNodeSelectedCallback) {
          this.onNodeSelectedCallback(`SENSOR-${s.id}`, s.name, `Current Speed: ${s.currentSpeedMph} mph | Highway: ${s.highway} | PEMS-BAY Benchmark Station`);
        }
      });
    });
  }

  // --- ACTIONS ---
  applyTunnelDiversion() {
    this.diversionLayer.clearLayers();
    this.isDiversionApplied = true;

    // Draw prominent neon cyan diversion route through SR-99
    const diversionPoly = L.polyline([
      [47.608, -122.335], // 4th & Pike
      [47.600, -122.338],
      [47.610, -122.342], // Alaskan Way Tunnel South Portal
      [47.625, -122.345], // North Portal / Aurora
      [47.643, -122.305], // Via Mercer bypass to SR-520
      [47.642, -122.250],
      [47.618, -122.195]  // Bellevue Campus
    ], {
      color: '#4cd7f6',
      weight: 6,
      opacity: 0.95,
      dashArray: '12, 6'
    }).addTo(this.diversionLayer);

    this.map.flyTo([47.620, -122.260], 12.5, { duration: 1 });
  }

  plotCustomRoute(coordinates) {
    this.routeLayer.clearLayers();
    if (!coordinates || coordinates.length === 0) return;

    // Convert [lon, lat] from OSRM to [lat, lon] for Leaflet
    const latLngs = coordinates.map(c => [c[1], c[0]]);
    const poly = L.polyline(latLngs, {
      color: '#4cd7f6',
      weight: 6,
      opacity: 0.9
    }).addTo(this.routeLayer);

    this.map.fitBounds(poly.getBounds(), { padding: [50, 50] });
  }

  invalidateSize() {
    if (this.map) {
      setTimeout(() => {
        this.map.invalidateSize();
      }, 150);
    }
  }

  zoomIn() {
    if (this.map) this.map.zoomIn();
  }

  zoomOut() {
    if (this.map) this.map.zoomOut();
  }

  recenter() {
    if (this.map) {
      if (this.currentRegion === 'seattle') {
        this.map.flyTo([47.618, -122.285], 12);
      } else {
        this.map.flyTo([37.38, -121.98], 11);
      }
    }
  }
}
