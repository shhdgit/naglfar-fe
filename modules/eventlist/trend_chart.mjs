import { Chart } from '//unpkg.com/chart.js?module'
import '../../util/chart_date_adapter.mjs'
import { color } from '../../util/color.mjs'

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
  y: {
    display: true,
    type: 'logarithmic',
  },
}

export function renderTrendChart(dom, data, threshold, changepoints) {
  const topThreshold = {
    backgroundColor: color(0),
    borderColor: color(0),
    fill: false,
    label: 'Top',
    borderWidth: 1,
    borderDash: [5, 5],
    interaction: {
      intersect: false,
    },
    radius: 0,
    data: data.points.map((p) => ({ x: p.timestamp * 1000, y: threshold.top })),
  }
  const bottomThreshold = {
    backgroundColor: color(3),
    borderColor: color(3),
    label: 'Bottom',
    borderWidth: 1,
    borderDash: [5, 5],
    interaction: {
      intersect: false,
    },
    radius: 0,
    data: data.points.map((p) => ({
      x: p.timestamp * 1000,
      y: threshold.bottom,
    })),
  }
  const ds = [
    topThreshold,
    {
      backgroundColor: color(4),
      borderColor: color(4),
      borderWidth: 2,
      radius: 0,
      tension: 0.1,
      label: data.name,
      data: data.points.map((p) => ({ x: p.timestamp * 1000, y: p.value })),
      segment: {
        borderColor: (ctx) => {
          return changepoints?.find(
            (p) =>
              p.start * 1000 < ctx.p0.parsed.x &&
              ctx.p0.parsed.x < p.stop * 1000,
          )
            ? color(1)
            : color(4)
        },
      },
    },
    bottomThreshold,
  ]

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
