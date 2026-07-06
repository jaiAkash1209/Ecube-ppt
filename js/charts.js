/* ==========================================================================
   HBM4/HBM4E Interactive Presentation Showcase - Charts Module
   ========================================================================== */

document.addEventListener('DOMContentLoaded', () => {
  initChartsController();
});

function initChartsController() {
  const bandwidthCtx = document.getElementById('bandwidthChart');

  if (!bandwidthCtx) return;

  if (typeof Chart !== 'undefined') {
    // Set custom Chart.js global styles matching the theme
    Chart.defaults.color = '#D1D9E0'; /* Brighter label color for projector clarity */
    Chart.defaults.font.family = "'Space Grotesk', sans-serif";
    Chart.defaults.font.size = 12;
  } else {
    console.warn('Chart.js is not loaded.');
    return;
  }

  let chartsRendered = false;
  let bandwidthChartInstance = null;

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
            grid: { color: 'rgba(255, 255, 255, 0.08)' },
            ticks: { font: { family: "'Space Grotesk', sans-serif" } }
          },
          x: {
            grid: { display: false },
            ticks: { color: '#F5F7FA', font: { family: "'Space Grotesk', sans-serif" } }
          }
        }
      }
    });
  }

  window.triggerChartsRender = renderCharts;
}
