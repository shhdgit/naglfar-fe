import { Chart } from '//unpkg.com/chart.js?module'

import { COLORS } from '../../util/color.mjs'

export function renderPieChart(dom, title, data) {
  const config = {
    type: 'pie',
    data: {
      labels: Object.keys(data),
      datasets: [
        {
          label: 'Dataset 1',
          data: Object.values(data),
          backgroundColor: COLORS,
        },
      ],
    },
    options: {
      responsive: true,
      plugins: {
        legend: { display: false },
        title: {
          display: true,
          text: title,
        },
      },
      aspectRatio: 1,
    },
  }

  return new Chart(dom, config)
}
