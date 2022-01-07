import { Chart } from '//unpkg.com/chart.js?module'

import { COLORS } from '../../util/color.mjs'

let chart

export function renderPieChart(dom, topNData, othersCount) {
  if (chart) {
    chart.destroy()
  }

  const config = {
    type: 'pie',
    data: {
      labels: [...topNData.map((d) => d.name), 'Others'],
      datasets: [
        {
          label: 'Dataset 1',
          data: [...topNData.map((d) => d.total), othersCount],
          backgroundColor: COLORS,
        },
      ],
    },
    options: {
      responsive: true,
      plugins: {
        legend: {
          position: 'top',
        },
      },
      aspectRatio: 1.6,
    },
  }

  chart = new Chart(dom, config)
  return chart
}
