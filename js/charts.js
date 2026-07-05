/* ==========================================================================
   HBM4/HBM4E Interactive Presentation Showcase - Charts Module
   ========================================================================== */

document.addEventListener('DOMContentLoaded', () => {
  initChartsController();
});

function initChartsController() {
  const bandwidthCtx = document.getElementById('bandwidthChart');
  const efficiencyCtx = document.getElementById('efficiencyChart');

  if (!bandwidthCtx || !efficiencyCtx) return;

  if (typeof Chart !== 'undefined') {
    // Set custom Chart.js global styles matching the theme
    Chart.defaults.color = '#8E9FB6';
    Chart.defaults.font.family = "'Space Grotesk', sans-serif";
    Chart.defaults.font.size = 11;
  } else {
    console.warn('Chart.js is not loaded.');
    return;
  }

  let chartsRendered = false;
  let bandwidthChartInstance = null;
  let efficiencyChartInstance = null;

  function renderCharts() {
    if (chartsRendered) return;
    chartsRendered = true;

    // Chart 1: Bandwidth comparison (Bar)
    const ctxB = bandwidthCtx.getContext('2d');
    const gradient = ctxB.createLinearGradient(0, 0, 0, 240);
    gradient.addColorStop(0, 'rgba(66, 133, 244, 0.85)'); // Gemini Blue
    gradient.addColorStop(0.5, 'rgba(155, 114, 203, 0.5)'); // Gemini Purple
    gradient.addColorStop(1, 'rgba(217, 107, 186, 0.15)'); // Gemini Pink

    bandwidthChartInstance = new Chart(bandwidthCtx, {
      type: 'bar',
      data: {
        labels: ['DDR5', 'GDDR7', 'HBM3E', 'HBM4', 'HBM4E'],
        datasets: [{
          data: [38.4, 192, 1228, 2048, 2457],
          backgroundColor: gradient,
          borderColor: '#4285F4',
          borderWidth: 1.5,
          borderRadius: 8,
          hoverBackgroundColor: '#D96BBA', // Shines pink on hover
          hoverBorderColor: '#D96BBA'
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: { display: false },
          tooltip: {
            backgroundColor: 'rgba(5, 8, 22, 0.95)',
            titleColor: '#4285F4',
            titleFont: { family: "'Space Grotesk', sans-serif", weight: 'bold' },
            bodyColor: '#fff',
            borderColor: '#9B72CB',
            borderWidth: 1,
            padding: 10
          }
        },
        scales: {
          y: {
            grid: { color: 'rgba(255, 255, 255, 0.03)' },
            ticks: { font: { family: "'Space Grotesk', sans-serif" } }
          },
          x: {
            grid: { display: false },
            ticks: { color: '#F5F7FA', font: { family: "'Space Grotesk', sans-serif" } }
          }
        }
      }
    });

    // Chart 2: Efficiency Radar Graph
    efficiencyChartInstance = new Chart(efficiencyCtx, {
      type: 'radar',
      data: {
        labels: ['Pin Speed', 'Efficiency (GB/s/W)', 'Capacity Density', 'Bus Width', 'Access Latency'],
        datasets: [
          {
            label: 'HBM3E',
            data: [62, 58, 55, 50, 72],
            backgroundColor: 'rgba(66, 133, 244, 0.08)',
            borderColor: '#4285F4',
            borderWidth: 1.5,
            pointBackgroundColor: '#4285F4'
          },
          {
            label: 'HBM4',
            data: [82, 85, 78, 90, 84],
            backgroundColor: 'rgba(155, 114, 203, 0.08)',
            borderColor: '#9B72CB',
            borderWidth: 1.5,
            pointBackgroundColor: '#9B72CB'
          },
          {
            label: 'HBM4E',
            data: [98, 96, 98, 90, 92],
            backgroundColor: 'rgba(217, 107, 186, 0.08)',
            borderColor: '#D96BBA',
            borderWidth: 1.5,
            pointBackgroundColor: '#D96BBA'
          }
        ]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: {
            position: 'top',
            labels: { color: '#F5F7FA', font: { family: "'Space Grotesk', sans-serif", size: 10 } }
          }
        },
        scales: {
          r: {
            angleLines: { color: 'rgba(255, 255, 255, 0.04)' },
            grid: { color: 'rgba(255, 255, 255, 0.04)' },
            pointLabels: { color: '#8E9FB6', font: { family: "'Space Grotesk', sans-serif", size: 11 } },
            ticks: { display: false },
            min: 0,
            max: 100
          }
        }
      }
    });
  }

  window.triggerChartsRender = renderCharts;
}
