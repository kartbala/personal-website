// Election turnout visualizations

function createChart(ctx, labels, data, colors, title) {
  return new Chart(ctx, {
    type: 'doughnut',
    data: {
      labels,
      datasets: [{
        data,
        backgroundColor: colors,
      }]
    },
    options: {
      responsive: true,
      plugins: {
        legend: {
          position: 'bottom',
          labels: { color: '#fff', font: { family: 'Courier New' } }
        },
        title: {
          display: true,
          text: title,
          color: '#fff',
          font: { size: 18, family: 'Courier New' }
        }
      },
      animation: { duration: 1500 }
    }
  });
}

window.addEventListener('DOMContentLoaded', () => {
  // Chart 1: overall turnout
  const totalCtx = document.getElementById('turnoutChart').getContext('2d');
  createChart(totalCtx,
    ['Voted', 'Didn\'t Vote'],
    [63, 37],
    ['#4caf50', '#c0392b'],
    '2024 Eligible Voters');

  // Chart 2: Biden 2020 voter behavior in 2024
  const bidenCtx = document.getElementById('bidenChart').getContext('2d');
  createChart(bidenCtx,
    ['Harris', 'Didn\'t Vote', 'Trump', 'Third Party'],
    [79, 15, 5, 1],
    ['#1e90ff', '#c0392b', '#f1c40f', '#7f8c8d'],
    '2020 Biden Voters in 2024');

  // Chart 3: Trump 2020 voter behavior in 2024
  const trumpCtx = document.getElementById('trumpChart').getContext('2d');
  createChart(trumpCtx,
    ['Trump', 'Didn\'t Vote', 'Harris', 'Third Party'],
    [85, 11, 3, 1],
    ['#f1c40f', '#c0392b', '#1e90ff', '#7f8c8d'],
    '2020 Trump Voters in 2024');
});
