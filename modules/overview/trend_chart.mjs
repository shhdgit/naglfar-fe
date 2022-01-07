import { Chart } from '//unpkg.com/chart.js?module'
import '../../util/chart_date_adapter.mjs'
import { color, NAMED_COLORS } from '../../util/color.mjs'

const scales = {
  x: {
    position: 'bottom',
    type: 'time',
    ticks: {
      source: 'auto',
      autoSkip: true,
      autoSkipPadding: 50,
      maxRotation: 0,
    },
    time: {
      displayFormats: {
        hour: 'HH:mm',
        minute: 'HH:mm',
        second: 'HH:mm:ss',
      },
    },
  },
}

export function renderTrendChart(dom, data, topNData) {
  const ds = data.map((d) => {
    const topNDataIndex = topNData.findIndex((td) => td.event_id === d.event_id)
    return {
      backgroundColor:
        topNDataIndex !== -1 ? color(topNDataIndex) : NAMED_COLORS.white,
      borderColor:
        topNDataIndex !== -1 ? color(topNDataIndex) : NAMED_COLORS.white,
      borderWidth: 2,
      fill: false,
      tension: 0.1,
      radius: 0,
      label: d.name,
      data: d.points.map((p) => ({ x: p.timestamp * 1000, y: p.value })),
    }
  })

  const config = {
    type: 'line',
    data: {
      datasets: ds,
    },
    options: {
      responsive: true,
      aspectRatio: 5,
      scales,
      interaction: {
        mode: 'index',
        intersect: false,
      },
      stacked: false,
      plugins: {
        legend: {
          display: false,
        },
      },
    },
  }

  return new Chart(dom, config)
}
