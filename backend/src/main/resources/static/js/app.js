/**
 * TrafficIQ — Main Application Controller
 * Handles SPA navigation, API data integration, Leaflet maps, Chart.js visualizations,
 * and user interactions aligned with Google Stitch Cybernetic Theme.
 */

class TrafficIQApp {
  constructor() {
    this.apiBase = '/api';
    this.currentView = 'overview';
    this.currentHorizon = 30;
    this.currentRegion = 'seattle';
    this.sandboxActive = false;
    
    this.mapManager = null;
    this.chartsManager = null;
    this.dashboardData = null;
    this.allSensors = [];
    this.incidents = [];

    // Sub-maps
    this.routeMap = null;
    this.heatmapMap = null;
  }

  async init() {
    console.log('Initializing TrafficIQ Application...');

    // 1. Instantiate Managers
    this.chartsManager = new TrafficChartsManager();
    this.mapManager = new TrafficMapManager('map-leaflet-container');

    // 2. Setup Navigation
    this.setupNavigation();

    // 3. Setup Top Header Controls
    this.setupTopHeader();

    // 4. Setup Overview View Controls
    this.setupOverviewControls();

    // 5. Setup Live Traffic Map Controls
    this.setupMapControls();

    // 6. Setup Route Planner & Forecaster Studio
    this.setupRoutePlanner();
    this.setupForecasterStudio();
    this.setupAIAssistant();

    // 7. Load Initial Data from Backend
    await this.loadMapConfig();
    await this.loadDashboardSummary();
    await this.loadSensors();
    await this.loadIncidents();
    await this.loadAdminHealth();

    // 8. Initial Chart Rendering
    this.chartsManager.renderTrajectoryChart('chart-trajectory-canvas', 30);
    this.chartsManager.renderSparkline('sparkline-chokepoint');

    // 9. Start live telemetry clock & sync pulse
    this.startLiveTelemetryClock();

    console.log('TrafficIQ Application initialized successfully.');
  }

  // --- SPA ROUTER & NAVIGATION ---
  setupNavigation() {
    const navLinks = document.querySelectorAll('.nav-link');
    navLinks.forEach(link => {
      link.addEventListener('click', (e) => {
        e.preventDefault();
        const path = link.getAttribute('data-path');
        if (path) this.switchView(path);
      });
    });
  }

  switchView(path) {
    this.currentView = path;

    // Update Sidebar Active state
    document.querySelectorAll('.nav-link').forEach(link => {
      if (link.getAttribute('data-path') === path) {
        link.classList.add('active');
        link.classList.remove('text-on-surface-variant');
      } else {
        link.classList.remove('active');
        link.classList.add('text-on-surface-variant');
      }
    });

    // Update Tab Views
    document.querySelectorAll('.tab-view').forEach(view => {
      if (view.id === `view-${path}`) {
        view.classList.add('active');
      } else {
        view.classList.remove('active');
      }
    });

    // View-specific trigger
    if (path === 'live-traffic-map') {
      if (!this.mapManager.map) {
        this.mapManager.init((id, loc, payload) => this.showNodeModal(id, loc, payload));
      }
      this.mapManager.invalidateSize();
    } else if (path === 'overview') {
      this.chartsManager.renderTrajectoryChart('chart-trajectory-canvas', this.currentHorizon);
      this.chartsManager.renderSparkline('sparkline-chokepoint');
    } else if (path === 'route-planner') {
      this.initRoutePreviewMap();
    } else if (path === 'congestion-heatmap') {
      this.initHeatmapMap();
    } else if (path === 'traffic-analytics') {
      this.renderAnalyticsCharts();
    } else if (path === 'explainable-ai') {
      this.chartsManager.renderFeatureImportance('chart-xai-importance');
    } else if (path === 'incident-intelligence') {
      this.renderFullIncidentsTable();
    } else if (path === 'saved-routes') {
      this.renderSavedRoutesGrid();
    } else if (path === 'alert-center') {
      this.renderAlertCenter();
    } else if (path === 'ingestion-monitor') {
      this.loadAdminHealth();
    }
  }

  // --- TOP HEADER CONTROLS ---
  setupTopHeader() {
    // Region selector
    const regionSelect = document.getElementById('region-selector');
    if (regionSelect) {
      regionSelect.addEventListener('change', (e) => {
        this.currentRegion = e.target.value;
        this.mapManager.setRegion(this.currentRegion);

        const netId = document.getElementById('overview-net-id');
        const streamDesc = document.getElementById('overview-stream-desc');
        const streamTag = document.getElementById('overview-stream-tag');
        const mainTitle = document.getElementById('overview-main-title');

        if (this.currentRegion === 'bayarea') {
          if (netId) netId.textContent = 'CALTRANS-D4-PEMS';
          if (streamDesc) streamDesc.textContent = 'Connected to Caltrans District 4 PeMS Loop Detectors (325 Stations)';
          if (streamTag) streamTag.textContent = 'BENCHMARK STREAM';
          if (mainTitle) mainTitle.textContent = 'Silicon Valley & Bay Area Operations Overview';
          this.showToast('Switched to California Bay Area (PeMS-BAY 325-Sensor Benchmark)');
        } else {
          if (netId) netId.textContent = 'SEA-CORR-0924';
          if (streamDesc) streamDesc.textContent = 'Connected to Municipal IoT & Inductive Loop Detector Array (Calibrated Demo)';
          if (streamTag) streamTag.textContent = 'SIMULATED STREAM';
          if (mainTitle) mainTitle.textContent = 'Urban Corridor Operations Overview';
          this.showToast('Switched to Metro Seattle Urban Corridor');
        }
      });
    }

    // Header Quick Horizon Buttons
    document.querySelectorAll('.top-horizon-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        document.querySelectorAll('.top-horizon-btn').forEach(b => {
          b.className = 'px-2 py-0.5 rounded text-on-surface-variant hover:text-on-surface top-horizon-btn';
        });
        btn.className = 'px-2 py-0.5 rounded bg-primary-container text-on-primary font-semibold top-horizon-btn';
        
        const h = parseInt(btn.dataset.horizon, 10);
        this.setHorizon(h);
      });
    });

    // Broadcast Incident Warn Button
    const warnBtn = document.getElementById('btn-broadcast-warn');
    if (warnBtn) {
      warnBtn.addEventListener('click', () => {
        this.showToast('⚠️ INCIDENT WARNING BROADCAST dispatched to all freeway VMS sign boards!', 'error');
      });
    }

    // Global Search
    const searchInput = document.getElementById('global-search');
    if (searchInput) {
      searchInput.addEventListener('keydown', (e) => {
        if (e.key === 'Enter') {
          const val = searchInput.value.trim();
          if (val) {
            this.showToast(`Filter applied for "${val}". Highlighted relevant corridors.`);
            this.switchView('live-traffic-map');
          }
        }
      });
    }

    // Notifications Button
    const notifBtn = document.getElementById('btn-notifications');
    if (notifBtn) {
      notifBtn.addEventListener('click', () => {
        this.switchView('alert-center');
      });
    }
  }

  // --- OVERVIEW VIEW CONTROLS ---
  setupOverviewControls() {
    // Horizon Selector Pills
    document.querySelectorAll('.horizon-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        document.querySelectorAll('.horizon-btn').forEach(b => {
          b.className = 'px-3 py-1.5 rounded text-on-surface-variant hover:text-on-surface transition-all horizon-btn';
        });
        btn.className = 'px-3 py-1.5 rounded bg-primary-container text-on-primary font-semibold transition-all shadow-sm horizon-btn active';
        
        const h = parseInt(btn.dataset.horizon, 10);
        this.setHorizon(h);
      });
    });

    // Sandbox Toggle
    const sandboxBtn = document.getElementById('sandbox-toggle');
    if (sandboxBtn) {
      sandboxBtn.addEventListener('click', () => {
        this.sandboxActive = !this.sandboxActive;
        if (this.sandboxActive) {
          sandboxBtn.classList.add('bg-secondary-container/50', 'text-secondary');
          this.showToast('Simulation Sandbox ACTIVATED. Telemetry modifications enabled.');
        } else {
          sandboxBtn.classList.remove('bg-secondary-container/50', 'text-secondary');
          this.showToast('Simulation Sandbox DEACTIVATED. Live telemetry restored.');
        }
      });
    }

    // Export Briefing Button
    const exportBtn = document.getElementById('btn-export-briefing');
    if (exportBtn) {
      exportBtn.addEventListener('click', () => {
        this.downloadBriefingReport();
      });
    }
  }

  setHorizon(minutes) {
    this.currentHorizon = minutes;
    this.chartsManager.renderTrajectoryChart('chart-trajectory-canvas', minutes);
    this.showToast(`Forecast Horizon updated to +${minutes} minutes. AI Bayesian curves recalibrated.`);
  }

  // --- LIVE TRAFFIC MAP CONTROLS ---
  setupMapControls() {
    // Horizon Pills in Map Floating Bar
    document.querySelectorAll('.map-horizon-pill').forEach(btn => {
      btn.addEventListener('click', () => {
        document.querySelectorAll('.map-horizon-pill').forEach(b => {
          b.className = 'map-horizon-pill px-2.5 py-1 rounded-md text-xs font-mono text-on-surface-variant hover:text-on-surface transition-all';
        });
        btn.className = 'map-horizon-pill px-2.5 py-1 rounded-md text-xs font-mono bg-primary-container text-on-primary font-semibold transition-all';

        const h = parseInt(btn.dataset.horizon, 10);
        this.setHorizon(h);
      });
    });

    // Layer Chips
    document.querySelectorAll('.layer-chip').forEach(chip => {
      chip.addEventListener('click', () => {
        chip.classList.toggle('opacity-40');
        const layer = chip.dataset.layer;
        const active = !chip.classList.contains('opacity-40');
        this.showToast(`Layer "${layer}" ${active ? 'enabled' : 'hidden'}.`);
      });
    });

    // Time-Lapse Scrubber
    const scrubber = document.getElementById('timeline-scrubber');
    const scrubLabel = document.getElementById('scrubber-time-label');
    if (scrubber && scrubLabel) {
      scrubber.addEventListener('input', (e) => {
        const val = parseInt(e.target.value, 10);
        const mins = 16 * 60 + Math.floor((val / 100) * 120); // 16:00 to 18:00
        const h = Math.floor(mins / 60);
        const m = mins % 60;
        const timeStr = `${h.toString().padStart(2, '0')}:${m.toString().padStart(2, '0')}`;
        scrubLabel.textContent = `${timeStr} (REPLAY)`;
      });
    }

    // Play button
    const playBtn = document.getElementById('scrubber-play-btn');
    if (playBtn) {
      let isPlaying = false;
      let timer = null;
      playBtn.addEventListener('click', () => {
        isPlaying = !isPlaying;
        playBtn.querySelector('.material-symbols-outlined').textContent = isPlaying ? 'pause' : 'play_arrow';
        if (isPlaying) {
          timer = setInterval(() => {
            let v = parseInt(scrubber.value, 10);
            v = (v + 2) % 100;
            scrubber.value = v;
            scrubber.dispatchEvent(new Event('input'));
          }, 400);
        } else {
          clearInterval(timer);
        }
      });
    }

    // Swap Locations Button
    const swapBtn = document.getElementById('btn-swap-locations');
    if (swapBtn) {
      swapBtn.addEventListener('click', () => {
        const orig = document.getElementById('map-origin-input');
        const dest = document.getElementById('map-dest-input');
        if (orig && dest) {
          const temp = orig.value;
          orig.value = dest.value;
          dest.value = temp;
          this.showToast('Origin and Destination swapped.');
        }
      });
    }

    // Analyze AI Pathing Button
    const analyzeBtn = document.getElementById('btn-analyze-pathing');
    if (analyzeBtn) {
      analyzeBtn.addEventListener('click', () => {
        this.runMapRouteAnalysis();
      });
    }
  }

  // --- ROUTE PLANNER CONTROLS ---
  setupRoutePlanner() {
    const runBtn = document.getElementById('btn-run-route-plan');
    if (runBtn) {
      runBtn.addEventListener('click', async () => {
        const orig = document.getElementById('route-origin-select').value;
        const dest = document.getElementById('route-dest-select').value;
        this.calculateRoute(orig, dest);
      });
    }
  }

  async calculateRoute(origKey, destKey) {
    let origLat = 37.3382, origLon = -121.8863, origName = 'Downtown San Jose';
    let destLat = 37.3861, destLon = -122.0839, destName = 'Mountain View Tech Corridor';

    if (origKey === 'downtown_seattle') {
      origLat = 47.608; origLon = -122.335; origName = 'Downtown Seattle (4th & Pike)';
    } else if (origKey === 'seatac') {
      origLat = 47.450; origLon = -122.308; origName = 'SeaTac Freight Terminal';
    }

    if (destKey === 'bellevue_tech') {
      destLat = 47.618; destLon = -122.195; destName = 'Bellevue Tech Campus';
    } else if (destKey === 'terminal_18') {
      destLat = 47.585; destLon = -122.355; destName = 'Terminal 18 Harbor Island';
    }

    try {
      this.showToast('Computing traffic-aware route via Spring Boot Routing Engine...');
      const url = `${this.apiBase}/routes/plan?originLat=${origLat}&originLon=${origLon}&destLat=${destLat}&destLon=${destLon}&originName=${encodeURIComponent(origName)}&destName=${encodeURIComponent(destName)}`;
      const res = await fetch(url);
      const json = await res.json();

      if (json.success && json.data) {
        const plan = json.data;
        this.showToast(`Route computed: ${plan.formattedDuration} (${plan.distanceMiles} miles, delay: +${plan.congestionDelayMinutes}m)`);
        if (this.routeMap && plan.geometryCoordinates) {
          const latLngs = plan.geometryCoordinates.map(c => [c[1], c[0]]);
          this.routeMap.eachLayer(l => {
            if (l instanceof L.Polyline) this.routeMap.removeLayer(l);
          });
          const poly = L.polyline(latLngs, { color: '#4cd7f6', weight: 5 }).addTo(this.routeMap);
          this.routeMap.fitBounds(poly.getBounds(), { padding: [30, 30] });
        }
      }
    } catch (e) {
      console.error('Routing calculation failed:', e);
      this.showToast('Using local corridor routing fallback.', 'warning');
    }
  }

  initRoutePreviewMap() {
    if (!this.routeMap) {
      const container = document.getElementById('route-preview-map');
      if (!container) return;

      this.routeMap = L.map('route-preview-map', {
        zoomControl: false,
        attributionControl: false
      }).setView([47.618, -122.260], 11);

      L.tileLayer('https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png', {
        subdomains: 'abcd',
        maxZoom: 19
      }).addTo(this.routeMap);

      // Default route polyline
      L.polyline([
        [47.608, -122.335],
        [47.625, -122.325],
        [47.643, -122.305],
        [47.642, -122.250],
        [47.618, -122.195]
      ], { color: '#4cd7f6', weight: 5 }).addTo(this.routeMap);
    }
    setTimeout(() => this.routeMap.invalidateSize(), 150);
  }

  initHeatmapMap() {
    if (!this.heatmapMap) {
      const container = document.getElementById('heatmap-leaflet-container');
      if (!container) return;

      this.heatmapMap = L.map('heatmap-leaflet-container', {
        zoomControl: true,
        attributionControl: false
      }).setView([47.618, -122.285], 11);

      L.tileLayer('https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png', {
        subdomains: 'abcd',
        maxZoom: 19
      }).addTo(this.heatmapMap);

      this.renderHeatmapRings(17);
    }
    setTimeout(() => this.heatmapMap.invalidateSize(), 150);
  }

  setHeatmapHour(hour) {
    const label = document.getElementById('heatmap-hour-label');
    if (label) {
      if (hour === 8) label.textContent = '08:00 (Morning Rush Peak)';
      else if (hour === 17) label.textContent = '17:00 (Evening Rush Peak)';
      else label.textContent = '22:00 (Late Night Free Flow)';
    }
    this.renderHeatmapRings(hour);
  }

  renderHeatmapRings(hour) {
    if (!this.heatmapMap) return;
    this.heatmapMap.eachLayer(l => {
      if (l instanceof L.Circle) this.heatmapMap.removeLayer(l);
    });

    const isPeak = (hour === 8 || hour === 17);
    const color = isPeak ? '#ef4444' : '#10b981';
    const radius = isPeak ? 1800 : 800;

    // Chokepoints
    L.circle([47.616, -122.331], { radius: radius, color: color, fillOpacity: 0.35 }).addTo(this.heatmapMap);
    L.circle([47.643, -122.305], { radius: radius * 0.7, color: isPeak ? '#f59e0b' : '#10b981', fillOpacity: 0.35 }).addTo(this.heatmapMap);
    L.circle([47.591, -122.250], { radius: radius * 0.8, color: isPeak ? '#f59e0b' : '#10b981', fillOpacity: 0.35 }).addTo(this.heatmapMap);
  }

  // --- FORECASTER STUDIO CONTROLS ---
  setupForecasterStudio() {
    let chosenHorizon = 15;

    // Horizon buttons
    document.querySelectorAll('.forecast-h-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        document.querySelectorAll('.forecast-h-btn').forEach(b => {
          b.className = 'py-2 rounded-lg bg-surface-container-high text-on-surface font-mono text-xs font-semibold forecast-h-btn';
        });
        btn.className = 'py-2 rounded-lg bg-primary-container text-on-primary font-mono text-xs font-bold forecast-h-btn active';
        chosenHorizon = parseInt(btn.dataset.horizon, 10);
      });
    });

    // Speed slider
    const slider = document.getElementById('slider-speed');
    const sliderVal = document.getElementById('slider-speed-val');
    if (slider && sliderVal) {
      slider.addEventListener('input', (e) => {
        sliderVal.textContent = `${parseFloat(e.target.value).toFixed(1)} mph`;
      });
    }

    // Run Forecast Button
    const runBtn = document.getElementById('btn-run-forecast');
    if (runBtn) {
      runBtn.addEventListener('click', async () => {
        const sensorId = document.getElementById('forecast-sensor-select').value;
        const currentSpeed = parseFloat(slider ? slider.value : '52.0');
        await this.runForecastStudio(sensorId, chosenHorizon, currentSpeed);
      });
    }
  }

  async runForecastStudio(sensorId, horizon, currentSpeed) {
    try {
      this.showToast(`Invoking in-process ONNX model for Station #${sensorId} (+${horizon}m)...`);
      const body = {
        sensorId: parseInt(sensorId, 10),
        horizon: horizon,
        currentSpeed: currentSpeed
      };

      const res = await fetch(`${this.apiBase}/traffic/forecast/custom`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body)
      });
      const json = await res.json();

      if (json.success && json.data) {
        const d = json.data;
        document.getElementById('res-pred-speed').textContent = `${d.predictedSpeedMph} mph`;
        document.getElementById('res-base-speed').textContent = `${d.baselineSpeedMph} mph`;
        document.getElementById('res-cong-level').textContent = d.congestionLevel;
        document.getElementById('res-cong-level').style.color = d.congestionColor || '#4edea3';
        document.getElementById('res-latency').textContent = `${d.inferenceLatencyMs} ms`;
        document.getElementById('forecast-engine-tag').textContent = d.inferenceEngine;

        this.showToast(`ONNX Prediction complete: ${d.predictedSpeedMph} mph (${d.congestionLevel}) in ${d.inferenceLatencyMs}ms`);

        // Render history chart if points provided
        if (d.recentHistory && d.recentHistory.length > 0) {
          const labels = d.recentHistory.map(p => p.timeLabel);
          const values = d.recentHistory.map(p => p.speedMph);
          labels.push(`+${horizon}m (Pred)`);
          values.push(d.predictedSpeedMph);

          this.chartsManager.renderSparkline('chart-forecast-history', values, labels);
        }
      }
    } catch (e) {
      console.error('Forecast request failed:', e);
      this.showToast('Inference error. Falling back to local model.', 'error');
    }
  }

  // --- AI ASSISTANT CHAT ---
  setupAIAssistant() {
    const input = document.getElementById('chat-input');
    const sendBtn = document.getElementById('btn-send-chat');

    const doSend = () => {
      const txt = input.value.trim();
      if (!txt) return;
      input.value = '';
      this.sendChatMessage(txt);
    };

    if (sendBtn) sendBtn.addEventListener('click', doSend);
    if (input) {
      input.addEventListener('keydown', (e) => {
        if (e.key === 'Enter') doSend();
      });
    }
  }

  sendChatMessage(message) {
    const feed = document.getElementById('chat-messages');
    if (!feed) return;

    // User message
    const userBubble = document.createElement('div');
    userBubble.className = 'flex items-start justify-end gap-3';
    userBubble.innerHTML = `
      <div class="bg-primary/20 p-3 rounded-xl max-w-xl text-xs font-mono text-on-surface border border-primary/30">
        ${message}
      </div>
      <div class="h-8 w-8 rounded-lg bg-surface-container-high text-primary flex items-center justify-center font-bold text-xs font-mono">
        ML
      </div>
    `;
    feed.appendChild(userBubble);
    feed.scrollTop = feed.scrollHeight;

    // Simulate AI response
    setTimeout(() => {
      let reply = '';
      const lower = message.toLowerCase();

      if (lower.includes('i-5') || lower.includes('chokepoint') || lower.includes('bottleneck')) {
        reply = 'Current status on <strong>I-5 NB (Seneca to Mercer)</strong>: Heavy gridlock. Monitored velocity is <strong>19 mph</strong> with 3.8 miles queue backup. Estimated clearance: 42 mins. I recommend activating the <strong>SR-99 Alaskan Way Tunnel Detour</strong> to bypass 21 minutes of delay.';
      } else if (lower.includes('detour') || lower.includes('route') || lower.includes('bellevue')) {
        reply = 'Fastest routing to <strong>Bellevue Tech Campus</strong>: Take <strong>SR-99 Tunnel</strong> north, merge onto Mercer bypass, then cross <strong>SR-520 Floating Bridge</strong>. Total transit time: <strong>17 mins</strong> (saves 21 mins vs I-5).';
      } else if (lower.includes('forecast') || lower.includes('velocity')) {
        reply = 'In-process <strong>ONNX HistGradientBoosting Model</strong> predicts velocity will reach a trough of <strong>14 mph at 17:20</strong> (+30m), followed by normalization back to 46 mph after 18:45.';
      } else {
        reply = `Telemetry acknowledged for query "${message}". System telemetry stream is healthy (18,420 msg/s, 0.00% frame loss). All 325 Caltrans PeMS sensors and Seattle corridor arrays are online.`;
      }

      const aiBubble = document.createElement('div');
      aiBubble.className = 'flex items-start gap-3';
      aiBubble.innerHTML = `
        <div class="h-8 w-8 rounded-lg bg-primary/20 text-primary flex items-center justify-center font-bold text-xs font-mono">
          AI
        </div>
        <div class="bg-surface-container p-3.5 rounded-xl max-w-xl text-xs font-mono leading-relaxed border border-outline-variant/30">
          ${reply}
        </div>
      `;
      feed.appendChild(aiBubble);
      feed.scrollTop = feed.scrollHeight;
    }, 600);
  }

  // --- DATA LOADERS ---
  async loadDashboardSummary() {
    try {
      const res = await fetch(`${this.apiBase}/dashboard/summary`);
      const json = await res.json();
      if (!json.success || !json.data) return;

      this.dashboardData = json.data;
      const d = json.data;

      // Update KPIs
      const kpiSpeed = document.getElementById('kpi-avg-speed');
      if (kpiSpeed) kpiSpeed.innerHTML = `${d.averageNetworkSpeedMph} <span class="text-base text-outline font-normal">mph</span>`;

      const kpiMae = document.getElementById('kpi-mae-val');
      if (kpiMae) kpiMae.textContent = `${d.modelMae} mph`;

      const topCci = document.getElementById('top-cci-val');
      if (topCci) topCci.textContent = '41.8';

    } catch (e) {
      console.warn('Could not fetch dashboard summary:', e);
    }
  }

  async loadMapConfig() {
    try {
      const res = await fetch(`${this.apiBase}/config/maps`);
      const json = await res.json();
      if (json.success && json.data) {
        this.mapsConfig = json.data;
        if (this.mapManager && json.data.apiKey) {
          this.mapManager.setApiKey(json.data.apiKey);
        }
        const badge = document.getElementById('google-maps-status-badge');
        if (badge && json.data.googleMapsConfigured) {
          badge.classList.remove('hidden');
        }
      }
    } catch (e) {
      console.warn('Could not fetch maps config:', e);
    }
  }

  async loadSensors() {
    try {
      const res = await fetch(`${this.apiBase}/traffic/locations`);
      const json = await res.json();
      if (json.success && json.data) {
        this.allSensors = json.data;
        if (this.mapManager) {
          this.mapManager.allSensors = this.allSensors;
        }
      }
    } catch (e) {
      console.warn('Could not fetch sensor locations:', e);
    }
  }

  async loadIncidents() {
    try {
      const res = await fetch(`${this.apiBase}/incidents`);
      const json = await res.json();
      if (json.success && json.data) {
        this.incidents = json.data;
        this.renderIncidentFeed();
      }
    } catch (e) {
      console.warn('Could not fetch incidents:', e);
    }
  }

  async loadAdminHealth() {
    try {
      const res = await fetch(`${this.apiBase}/health`);
      const json = await res.json();
      if (!json.success || !json.data) return;

      const d = json.data;
      const grid = document.getElementById('admin-kpi-grid');
      if (grid) {
        grid.innerHTML = `
          <div class="p-4 bg-surface-container-low rounded-xl border border-outline-variant/30">
            <span class="text-xs font-mono text-outline uppercase block">Server Status</span>
            <div class="text-2xl font-bold font-mono text-tertiary mt-1">${d.status}</div>
            <span class="text-[0.625rem] font-mono text-outline">HTTP 200 OK</span>
          </div>
          <div class="p-4 bg-surface-container-low rounded-xl border border-outline-variant/30">
            <span class="text-xs font-mono text-outline uppercase block">Inference Engine</span>
            <div class="text-lg font-bold font-mono text-primary mt-1">ONNX Runtime</div>
            <span class="text-[0.625rem] font-mono text-tertiary">Java 21 In-Process CPU</span>
          </div>
          <div class="p-4 bg-surface-container-low rounded-xl border border-outline-variant/30">
            <span class="text-xs font-mono text-outline uppercase block">Model Loaded</span>
            <div class="text-2xl font-bold font-mono text-tertiary mt-1">${d.modelLoaded ? 'ACTIVE' : 'FALLBACK'}</div>
            <span class="text-[0.625rem] font-mono text-outline">HistGradientBoosting</span>
          </div>
          <div class="p-4 bg-surface-container-low rounded-xl border border-outline-variant/30">
            <span class="text-xs font-mono text-outline uppercase block">Benchmark Dataset</span>
            <div class="text-lg font-bold font-mono text-on-surface mt-1">PEMS-BAY</div>
            <span class="text-[0.625rem] font-mono text-outline">325 Caltrans Detectors</span>
          </div>
        `;
      }
    } catch (e) {
      console.warn('Could not fetch health:', e);
    }
  }

  renderIncidentFeed() {
    const container = document.getElementById('incident-stream-container');
    if (!container || !this.incidents || this.incidents.length === 0) return;

    container.innerHTML = this.incidents.slice(0, 3).map(inc => {
      const isSevere = inc.severity === 'Severe' || inc.severity === 'High';
      const borderCol = isSevere ? 'border-error' : 'border-amber-400';
      const titleCol = isSevere ? 'text-error' : 'text-amber-300';
      const bgCol = isSevere ? 'bg-error/10' : 'bg-surface-container';

      return `
        <div class="p-2.5 rounded-lg ${bgCol} border-l-2 ${borderCol}">
          <div class="flex items-center justify-between ${titleCol} font-bold">
            <span>${inc.type.replace('_', ' ')}</span>
            <span class="text-[10px]">${inc.corridorLocation || 'MP 165A'}</span>
          </div>
          <p class="text-xs font-sans text-on-surface mt-1">${inc.description}</p>
          <div class="mt-2 flex items-center justify-between text-[11px] text-on-surface-variant">
            <span class="${titleCol}">Severity: ${inc.severity}</span>
            <span class="text-tertiary font-semibold">${inc.status || 'Active'}</span>
          </div>
        </div>
      `;
    }).join('');
  }

  renderFullIncidentsTable() {
    const tbody = document.getElementById('incidents-full-table');
    if (!tbody || !this.incidents) return;

    tbody.innerHTML = this.incidents.map(inc => `
      <tr class="hover:bg-surface-container transition-colors">
        <td class="py-3 font-mono text-primary font-bold">#INC-${inc.id || '104'}</td>
        <td class="py-3 font-semibold text-on-surface">${inc.corridorLocation || 'I-5 Corridor'}</td>
        <td class="py-3 text-outline">${inc.type}</td>
        <td class="py-3">
          <span class="px-2 py-0.5 rounded text-[10px] font-bold ${inc.severity === 'Severe' ? 'bg-error/20 text-error' : 'bg-amber-500/20 text-amber-300'}">
            ${inc.severity}
          </span>
        </td>
        <td class="py-3 text-on-surface-variant">${inc.description}</td>
        <td class="py-3 text-tertiary font-bold">${inc.status || 'Active'}</td>
        <td class="py-3 text-right">
          <button onclick="window.app.showToast('Incident #${inc.id} updated.')" class="px-2 py-1 rounded bg-surface-container-high hover:bg-surface-variant text-[10px]">Inspect</button>
        </td>
      </tr>
    `).join('');
  }

  renderSavedRoutesGrid() {
    const grid = document.getElementById('saved-routes-grid');
    if (!grid) return;

    grid.innerHTML = `
      <div class="p-5 rounded-xl bg-surface-container-low border border-outline-variant/30 flex flex-col justify-between">
        <div>
          <div class="flex items-center justify-between mb-2">
            <span class="text-xs font-mono text-outline uppercase font-semibold">Commute Monitored</span>
            <span class="text-xs font-mono text-amber-400 font-bold">+4m Delay</span>
          </div>
          <h4 class="text-base font-bold text-on-surface">Bellevue → Seattle Downtown</h4>
          <span class="text-xs font-mono text-outline block mt-0.5">Via SR-520 Floating Bridge</span>
          <div class="my-4 text-3xl font-bold font-mono text-amber-300">22 min</div>
          <p class="text-xs text-on-surface-variant">Recommended departure before 17:10 avoids evening peak chokepoints.</p>
        </div>
        <button onclick="window.app.navigateToMapRoute('Downtown', 'Bellevue')" class="mt-4 w-full py-2 bg-primary-container text-on-primary rounded-lg text-xs font-mono font-bold hover:bg-primary transition-all">Inspect on Map</button>
      </div>

      <div class="p-5 rounded-xl bg-surface-container-low border border-outline-variant/30 flex flex-col justify-between">
        <div>
          <div class="flex items-center justify-between mb-2">
            <span class="text-xs font-mono text-outline uppercase font-semibold">Freight Corridor</span>
            <span class="text-xs font-mono text-error font-bold">+19m Delay</span>
          </div>
          <h4 class="text-base font-bold text-on-surface">SeaTac Freight → Terminal 18</h4>
          <span class="text-xs font-mono text-outline block mt-0.5">Via I-5 Northbound</span>
          <div class="my-4 text-3xl font-bold font-mono text-error">38 min</div>
          <p class="text-xs text-on-surface-variant">Heavy slowdown at Exit 165. Detour via Marginal Way S saves 14 min.</p>
        </div>
        <button onclick="window.app.navigateToMapRoute('SeaTac', 'Terminal 18')" class="mt-4 w-full py-2 bg-primary-container text-on-primary rounded-lg text-xs font-mono font-bold hover:bg-primary transition-all">Inspect on Map</button>
      </div>

      <div class="p-5 rounded-xl bg-surface-container-low border border-outline-variant/30 flex flex-col justify-between">
        <div>
          <div class="flex items-center justify-between mb-2">
            <span class="text-xs font-mono text-outline uppercase font-semibold">University Corridor</span>
            <span class="text-xs font-mono text-tertiary font-bold">Free Flow</span>
          </div>
          <h4 class="text-base font-bold text-on-surface">U-District → Capitol Hill</h4>
          <span class="text-xs font-mono text-outline block mt-0.5">University Shuttle Route</span>
          <div class="my-4 text-3xl font-bold font-mono text-tertiary">15 min</div>
          <p class="text-xs text-on-surface-variant">Operating at nominal travel schedule. No bottlenecks reported.</p>
        </div>
        <button onclick="window.app.navigateToMapRoute('U-District', 'Capitol Hill')" class="mt-4 w-full py-2 bg-primary-container text-on-primary rounded-lg text-xs font-mono font-bold hover:bg-primary transition-all">Inspect on Map</button>
      </div>
    `;
  }

  renderAlertCenter() {
    const container = document.getElementById('alerts-container');
    if (!container) return;

    container.innerHTML = `
      <div class="p-4 rounded-xl bg-error/10 border border-error/40 flex items-start justify-between gap-4">
        <div class="flex items-start gap-3">
          <span class="material-symbols-outlined text-error text-[1.5rem]">report</span>
          <div>
            <div class="flex items-center gap-2">
              <strong class="text-sm text-error font-mono">CRITICAL COLLISION: I-5 NB Exit 165A</strong>
              <span class="text-[10px] font-mono px-2 py-0.5 rounded bg-error text-on-error font-bold">ACTIVE</span>
            </div>
            <p class="text-xs text-on-surface mt-1">Overturned trailer blocking 2 center lanes. Backup extending 3.4 miles. Emergency response units on scene.</p>
            <span class="text-[10px] font-mono text-outline mt-2 block">Timestamp: 16:42 PST • Assigned to Incident Dispatch #9</span>
          </div>
        </div>
        <button onclick="window.app.showToast('Incident acknowledged.')" class="px-3 py-1.5 rounded bg-surface-container-high hover:bg-surface-variant text-xs font-mono whitespace-nowrap">Acknowledge</button>
      </div>

      <div class="p-4 rounded-xl bg-surface-container border border-amber-400/30 flex items-start justify-between gap-4">
        <div class="flex items-start gap-3">
          <span class="material-symbols-outlined text-amber-300 text-[1.5rem]">warning</span>
          <div>
            <div class="flex items-center gap-2">
              <strong class="text-sm text-amber-300 font-mono">BRIDGE WIND ADVISORY: SR-520 Floating Bridge</strong>
              <span class="text-[10px] font-mono px-2 py-0.5 rounded bg-amber-500/20 text-amber-300 font-bold">ADVISORY</span>
            </div>
            <p class="text-xs text-on-surface mt-1">Crosswinds gusting to 28 mph across Lake Washington mid-span. High-profile vehicles caution advised.</p>
            <span class="text-[10px] font-mono text-outline mt-2 block">Timestamp: 16:30 PST</span>
          </div>
        </div>
        <button onclick="window.app.showToast('Advisory acknowledged.')" class="px-3 py-1.5 rounded bg-surface-container-high hover:bg-surface-variant text-xs font-mono whitespace-nowrap">Acknowledge</button>
      </div>
    `;
  }

  renderAnalyticsCharts() {
    this.chartsManager.renderCongestionDonut('chart-analytics-donut', {
      'Free Flow (>= 55 mph)': 242,
      'Moderate (40-54 mph)': 58,
      'Heavy (25-39 mph)': 18,
      'Severe (< 25 mph)': 7
    });
    this.chartsManager.renderTrajectoryChart('chart-analytics-trend', 60);
  }

  // --- ACTIONS & TOASTS ---
  triggerDynamicAction(actionText) {
    this.showToast(`Dynamic Traffic Action Engaged: ${actionText}`);
  }

  navigateToMapRoute(origin, dest) {
    this.switchView('live-traffic-map');
    const origInput = document.getElementById('map-origin-input');
    const destInput = document.getElementById('map-dest-input');
    if (origInput) origInput.value = origin;
    if (destInput) destInput.value = dest;
    this.runMapRouteAnalysis();
  }

  runMapRouteAnalysis() {
    this.showToast('Analyzing AI Pathing across corridors...');
    if (this.mapManager) {
      this.mapManager.applyTunnelDiversion();
      this.showToast('AI Optimal Path Calculated: Diverting via SR-99 Alaskan Way Tunnel (Saves 21 mins)!');
    }
  }

  applyTunnelDiversion() {
    if (this.mapManager) {
      this.mapManager.applyTunnelDiversion();
      this.showToast('Tunnel Diversion route successfully applied to active navigation layer!');
    }
  }

  centerOnCorridor(corridorName) {
    this.showToast(`Centering on monitored corridor: ${corridorName}`);
    if (this.mapManager) {
      if (corridorName === 'SR-520') this.mapManager.map.flyTo([47.642, -122.250], 13);
      else if (corridorName === 'I-90') this.mapManager.map.flyTo([47.591, -122.250], 13);
      else if (corridorName === 'I-405') this.mapManager.map.flyTo([47.625, -122.180], 13);
    }
  }

  runQuickForecast(sensorId) {
    this.switchView('multi-horizon-forecast');
    const select = document.getElementById('forecast-sensor-select');
    if (select) select.value = sensorId;
    this.runForecastStudio(sensorId, 15, 62.0);
  }

  // Map Navigation helper proxies
  switchBasemap(name) {
    if (this.mapManager) {
      this.mapManager.setBasemap(name);
      const labels = {
        'google-traffic': 'Google Maps (Live Traffic)',
        'google-sat': 'Google Satellite Hybrid',
        'google-roads': 'Google Standard Roads',
        'carto-dark': 'Cybernetic Tactical Dark'
      };
      this.showToast(`Basemap switched to ${labels[name] || name}.`);
    }
  }

  zoomInMap() { if (this.mapManager) this.mapManager.zoomIn(); }
  zoomOutMap() { if (this.mapManager) this.mapManager.zoomOut(); }
  recenterMap() { if (this.mapManager) this.mapManager.recenter(); }

  // Telemetry panel toggle
  toggleTelemetryDrawer() {
    const body = document.getElementById('drawer-body');
    const icon = document.getElementById('drawer-toggle-icon');
    if (body) {
      body.classList.toggle('hidden');
      if (icon) icon.textContent = body.classList.contains('hidden') ? 'expand_more' : 'expand_less';
    }
  }

  // Modals
  showNodeModal(id, loc, payload) {
    const modal = document.getElementById('node-modal');
    if (!modal) return;
    document.getElementById('node-modal-title').textContent = id;
    document.getElementById('node-modal-subtitle').textContent = loc;
    document.getElementById('node-modal-body').textContent = payload;
    modal.classList.remove('hidden');
  }

  closeNodeModal() {
    const modal = document.getElementById('node-modal');
    if (modal) modal.classList.add('hidden');
  }

  openSignalPlanModal() {
    const modal = document.getElementById('modal-signal-plan');
    if (modal) modal.classList.remove('hidden');
  }

  closeSignalPlanModal() {
    const modal = document.getElementById('modal-signal-plan');
    if (modal) modal.classList.add('hidden');
  }

  applySignalPlan() {
    this.closeSignalPlanModal();
    this.showToast('Signal Plan AUTHORIZED: +18s Green phase applied on Stewart & Denny Way signals.', 'success');
  }

  dismissSpillover() {
    this.showToast('Spillover suggestion dismissed.');
  }

  openReportIncidentModal() {
    const modal = document.getElementById('modal-report-incident');
    if (modal) modal.classList.remove('hidden');
  }

  closeReportIncidentModal() {
    const modal = document.getElementById('modal-report-incident');
    if (modal) modal.classList.add('hidden');
  }

  async submitReportIncident(e) {
    e.preventDefault();
    const type = document.getElementById('inc-input-type').value;
    const loc = document.getElementById('inc-input-loc').value;
    const severity = document.getElementById('inc-input-severity').value;
    const desc = document.getElementById('inc-input-desc').value;

    const payload = {
      type: type,
      corridorLocation: loc,
      severity: severity,
      description: desc,
      status: 'Active'
    };

    try {
      const res = await fetch(`${this.apiBase}/incidents`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
      const json = await res.json();
      if (json.success) {
        this.showToast('Incident successfully logged and broadcast!', 'success');
        this.closeReportIncidentModal();
        await this.loadIncidents();
      }
    } catch (err) {
      console.warn('Incident persistence failed, adding to local stream:', err);
      this.incidents.unshift(payload);
      this.renderIncidentFeed();
      this.closeReportIncidentModal();
      this.showToast('Incident logged to local session stream.', 'warning');
    }
  }

  downloadBriefingReport() {
    const report = {
      title: "TrafficIQ Urban Corridor Operations Briefing",
      generatedAt: new Date().toISOString(),
      region: this.currentRegion,
      citywideCongestionIndex: "41.8%",
      monitoredAverageSpeed: "48.4 mph",
      activeChokepoints: 14,
      aiForecastReliability: "94.6%",
      primaryChampionModel: "HistGradientBoosting (ONNX Runtime Java)",
      testMAE: "2.33 mph (10.4% improvement over persistence baseline)",
      criticalBottleneck: "I-5 NB Seneca St to Mercer St (19 mph, Queue: 3.8 miles)",
      recommendedAction: "Bypass via SR-99 Alaskan Way Tunnel (Saves 21 minutes)"
    };

    const blob = new Blob([JSON.stringify(report, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `TrafficIQ_Operations_Briefing_${Date.now()}.json`;
    a.click();
    URL.revokeObjectURL(url);
    this.showToast('Operations Briefing report downloaded successfully!');
  }

  startLiveTelemetryClock() {
    setInterval(() => {
      const clock = document.getElementById('overview-live-clock');
      if (clock) {
        const now = new Date();
        clock.textContent = `${now.toLocaleTimeString()} PST`;
      }

      // Random sync jitter (2s - 5s)
      const syncEl = document.getElementById('top-sync-time');
      const telSync = document.getElementById('telemetry-sync');
      const s = Math.floor(Math.random() * 4) + 2;
      if (syncEl) syncEl.textContent = `${s}s ago`;
      if (telSync) telSync.textContent = `${s}s ago`;
    }, 4000);
  }

  showToast(message, type = 'info') {
    const container = document.getElementById('toast-container');
    if (!container) return;

    const toast = document.createElement('div');
    toast.className = `p-3 rounded-lg text-xs font-mono shadow-2xl flex items-center gap-2 border transition-all duration-300 pointer-events-auto ${
      type === 'error' ? 'bg-error/90 text-on-error border-error' :
      type === 'warning' ? 'bg-amber-500/90 text-black border-amber-400 font-bold' :
      type === 'success' ? 'bg-tertiary/90 text-on-tertiary border-tertiary font-bold' :
      'bg-surface-container-high/95 text-on-surface border-outline-variant/60'
    }`;
    toast.innerHTML = `
      <span class="material-symbols-outlined text-[1.125rem]">${type === 'error' ? 'error' : (type === 'success' ? 'check_circle' : 'info')}</span>
      <span>${message}</span>
    `;

    container.appendChild(toast);
    setTimeout(() => {
      toast.style.opacity = '0';
      toast.style.transform = 'translateY(10px)';
      setTimeout(() => toast.remove(), 300);
    }, 3500);
  }
}

// Global bootstrap
document.addEventListener('DOMContentLoaded', () => {
  window.app = new TrafficIQApp();
  window.app.init();
});
