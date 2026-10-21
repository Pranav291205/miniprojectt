/**
 * TrafficIQ — Visualization & Chart Engine
 * Built with Chart.js using Stitch Cybernetic Dark Palette
 */

class TrafficChartsManager {
  constructor() {
    this.charts = {};
  }

  destroyChart(id) {
    if (this.charts[id]) {
      this.charts[id].destroy();
      delete this.charts[id];
    }
  }

  // 1. Multi-Horizon Trajectory Chart on Overview Dashboard
  renderTrajectoryChart(canvasId, horizonMinutes = 30) {
    this.destroyChart(canvasId);
    const canvas = document.getElementById(canvasId);
    if (!canvas) return;

    const ctx = canvas.getContext('2d');

    // Create 24-hour time labels at 15-min or 30-min steps
    const labels = [
      '00:00', '02:00', '04:00', '06:00', '07:30 (AM Peak)', '08:30', 
      '10:00', '12:00', '14:00', '15:30', '16:45 (Now)', '17:15 (+30m)', 
      '17:45 (+60m)', '18:45 (+120m)', '20:00', '22:00', '23:59'
    ];

    // Historical typical baseline
    const baseline = [66.5, 67.2, 67.0, 61.2, 42.0, 48.5, 56.4, 58.1, 57.0, 52.0, 49.5, 41.0, 44.5, 54.0, 62.3, 65.8, 66.4];

    // Observed speeds up to 16:45 (index 10)
    const observed = [66.8, 67.0, 66.9, 60.5, 40.5, 46.8, 55.8, 59.2, 57.8, 51.2, 48.4, null, null, null, null, null, null];

    // AI Forecast curve starting at 16:45
    let forecast = [null, null, null, null, null, null, null, null, null, null, 48.4, 38.5, 34.2, 51.0, null, null, null];
    let confUpper = [null, null, null, null, null, null, null, null, null, null, 50.2, 43.5, 39.0, 57.0, null, null, null];
    let confLower = [null, null, null, null, null, null, null, null, null, null, 46.5, 33.5, 29.5, 45.0, null, null, null];

    if (horizonMinutes === 15) {
      forecast = [null, null, null, null, null, null, null, null, null, null, 48.4, 44.2, null, null, null, null, null];
      confUpper = [null, null, null, null, null, null, null, null, null, null, 49.8, 46.5, null, null, null, null, null];
      confLower = [null, null, null, null, null, null, null, null, null, null, 47.0, 41.8, null, null, null, null, null];
    } else if (horizonMinutes === 60) {
      forecast = [null, null, null, null, null, null, null, null, null, null, 48.4, 38.5, 33.0, null, null, null, null];
      confUpper = [null, null, null, null, null, null, null, null, null, null, 50.2, 44.0, 39.5, null, null, null, null];
      confLower = [null, null, null, null, null, null, null, null, null, null, 46.5, 33.0, 27.5, null, null, null, null];
    } else if (horizonMinutes === 120) {
      forecast = [null, null, null, null, null, null, null, null, null, null, 48.4, 38.5, 34.2, 51.0, 59.5, null, null];
      confUpper = [null, null, null, null, null, null, null, null, null, null, 50.2, 44.5, 41.0, 58.0, 65.0, null, null];
      confLower = [null, null, null, null, null, null, null, null, null, null, 46.5, 32.5, 27.0, 44.0, 54.0, null, null];
    }

    // Gradients
    const obsGrad = ctx.createLinearGradient(0, 0, 0, 260);
    obsGrad.addColorStop(0, 'rgba(76, 215, 246, 0.35)');
    obsGrad.addColorStop(1, 'rgba(76, 215, 246, 0.0)');

    const confGrad = ctx.createLinearGradient(0, 0, 0, 260);
    confGrad.addColorStop(0, 'rgba(208, 188, 255, 0.25)');
    confGrad.addColorStop(1, 'rgba(208, 188, 255, 0.02)');

    this.charts[canvasId] = new Chart(ctx, {
      type: 'line',
      data: {
        labels: labels,
        datasets: [
          {
            label: '24h Baseline',
            data: baseline,
            borderColor: '#869397',
            borderWidth: 1.5,
            borderDash: [4, 4],
            pointRadius: 0,
            fill: false,
            tension: 0.35
          },
          {
            label: 'Observed Telemetry',
            data: observed,
            borderColor: '#4cd7f6',
            backgroundColor: obsGrad,
            borderWidth: 2.5,
            pointRadius: (ctx) => (ctx.dataIndex === 10 ? 6 : 2),
            pointBackgroundColor: '#4cd7f6',
            pointBorderColor: '#0a0e16',
            pointBorderWidth: 2,
            fill: true,
            tension: 0.35
          },
          {
            label: 'AI Forecast Median',
            data: forecast,
            borderColor: '#d0bcff',
            borderWidth: 2.5,
            borderDash: [5, 4],
            pointRadius: 4,
            pointBackgroundColor: (ctx) => (ctx.dataIndex === 11 ? '#facc15' : '#ffb4ab'),
            pointBorderColor: '#0f131c',
            pointBorderWidth: 2,
            fill: false,
            tension: 0.35
          },
          {
            label: 'Upper 90% Bound',
            data: confUpper,
            borderColor: 'rgba(208, 188, 255, 0.3)',
            borderWidth: 1,
            pointRadius: 0,
            fill: '+1',
            backgroundColor: confGrad,
            tension: 0.35
          },
          {
            label: 'Lower 90% Bound',
            data: confLower,
            borderColor: 'rgba(208, 188, 255, 0.3)',
            borderWidth: 1,
            pointRadius: 0,
            fill: false,
            tension: 0.35
          }
        ]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        interaction: {
          mode: 'index',
          intersect: false
        },
        plugins: {
          legend: { display: false },
          tooltip: {
            backgroundColor: 'rgba(15, 19, 28, 0.95)',
            borderColor: '#3d494c',
            borderWidth: 1,
            titleFont: { family: 'JetBrains Mono', size: 12 },
            bodyFont: { family: 'JetBrains Mono', size: 11 },
            callbacks: {
              label: (item) => {
                if (item.raw === null || item.raw === undefined) return null;
                return ` ${item.dataset.label}: ${item.raw} mph`;
              }
            }
          }
        },
        scales: {
          x: {
            grid: { color: 'rgba(57, 65, 78, 0.25)' },
            ticks: {
              color: '#869397',
              font: { family: 'JetBrains Mono', size: 10 }
            }
          },
          y: {
            min: 15,
            max: 75,
            grid: { color: 'rgba(57, 65, 78, 0.25)' },
            ticks: {
              color: '#869397',
              font: { family: 'JetBrains Mono', size: 10 },
              callback: (v) => `${v} mph`
            }
          }
        }
      }
    });
  }

  // 2. Chokepoint Speed Sparkline for Left Telemetry Panel
  renderSparkline(canvasId, values, labels) {
    this.destroyChart(canvasId);
    const canvas = document.getElementById(canvasId);
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    const grad = ctx.createLinearGradient(0, 0, 0, 50);
    grad.addColorStop(0, 'rgba(87, 27, 193, 0.3)');
    grad.addColorStop(1, 'rgba(87, 27, 193, 0.0)');

    this.charts[canvasId] = new Chart(ctx, {
      type: 'line',
      data: {
        labels: labels || ['Now', '+15m', '+30m', '+45m', '+60m', '+75m', '+90m'],
        datasets: [{
          data: values || [19, 17, 14, 16, 22, 34, 46],
          borderColor: '#d0bcff',
          backgroundColor: grad,
          borderWidth: 2,
          pointRadius: [3, 2, 4, 2, 2, 2, 2],
          pointBackgroundColor: ['#4cd7f6', '#d0bcff', '#ffb4ab', '#d0bcff', '#4edea3', '#4edea3', '#4edea3'],
          fill: true,
          tension: 0.4
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: { display: false },
          tooltip: {
            backgroundColor: '#0f131c',
            borderColor: '#3d494c',
            borderWidth: 1,
            callbacks: { label: (c) => ` ${c.raw} mph` }
          }
        },
        scales: {
          x: { display: false },
          y: { display: false, min: 10, max: 55 }
        }
      }
    });
  }

  // 3. Congestion Breakdown Donut Chart
  renderCongestionDonut(canvasId, breakdown) {
    this.destroyChart(canvasId);
    const canvas = document.getElementById(canvasId);
    if (!canvas) return;

    const labels = Object.keys(breakdown);
    const data = Object.values(breakdown);

    this.charts[canvasId] = new Chart(canvas, {
      type: 'doughnut',
      data: {
        labels: labels,
        datasets: [{
          data: data,
          backgroundColor: ['#4edea3', '#f59e0b', '#f97316', '#ef4444'],
          borderColor: '#0f131c',
          borderWidth: 2,
          hoverOffset: 6
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: {
            position: 'bottom',
            labels: {
              color: '#bcc9cd',
              font: { family: 'JetBrains Mono', size: 10 },
              padding: 10,
              usePointStyle: true
            }
          }
        },
        cutout: '70%'
      }
    });
  }

  // 4. Feature Importance Horizontal Bar Chart (Explainable AI)
  renderFeatureImportance(canvasId) {
    this.destroyChart(canvasId);
    const canvas = document.getElementById(canvasId);
    if (!canvas) return;

    const features = [
      'speed_lag_0 (T-0)',
      'rolling_mean_1h',
      'speed_lag_1 (T-5m)',
      'hour (Time of Day)',
      'speed_lag_2 (T-10m)',
      'speed_lag_6 (T-30m)',
      'horizon_min',
      'day_of_week',
      'rolling_std_1h',
      'weather_temperature',
      'weather_precipitation'
    ];

    const importances = [0.384, 0.241, 0.122, 0.086, 0.054, 0.038, 0.027, 0.019, 0.014, 0.009, 0.006];

    this.charts[canvasId] = new Chart(canvas, {
      type: 'bar',
      data: {
        labels: features,
        datasets: [{
          label: 'Gini Importance Score',
          data: importances,
          backgroundColor: importances.map((v, i) => i < 2 ? '#4cd7f6' : (i < 5 ? '#d0bcff' : '#262a33')),
          borderColor: '#3d494c',
          borderWidth: 1,
          borderRadius: 4
        }]
      },
      options: {
        indexAxis: 'y',
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: { display: false },
          tooltip: {
            callbacks: {
              label: (c) => ` Relative Weight: ${(c.raw * 100).toFixed(1)}%`
            }
          }
        },
        scales: {
          x: {
            grid: { color: 'rgba(57, 65, 78, 0.25)' },
            ticks: {
              color: '#869397',
              font: { family: 'JetBrains Mono', size: 10 },
              callback: (v) => `${(v * 100).toFixed(0)}%`
            }
          },
          y: {
            grid: { display: false },
            ticks: {
              color: '#dfe2ee',
              font: { family: 'JetBrains Mono', size: 11 }
            }
          }
        }
      }
    });
  }
}
